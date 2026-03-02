import { type FetchClientType } from "@api/client";
import type { PrintJobStatusDto } from "@app/common/gen/types/print-service-api-types";
import {
  downloadFilesToFileSystem,
  getPrintJob,
  spoolFilesToPrinter,
} from "@app/preload";
import { interval, Subject } from "rxjs";
import {
  catchError,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import type { ReducerEvent } from "./events";
import type {
  StartPrintJobMonitoringOperation,
  StopPrintJobMonitoringOperation,
  TransactionOperation,
} from "./operations";

export class ObservableExecutor {
  private dispatch: (event: ReducerEvent) => void;
  private fetchClient: FetchClientType;
  private monitoringCancellation = new Map<string, Subject<void>>();
  constructor(
    dispatch: (event: ReducerEvent) => void,
    fetchClient: FetchClientType,
  ) {
    this.dispatch = dispatch;
    this.fetchClient = fetchClient;
  }

  async execute(operation: TransactionOperation): Promise<void> {
    switch (operation.type) {
      case "fetch-transactions": {
        const { data } = await this.fetchClient.GET("/api/v1/transactions", {
          params: { query: { status: "PENDING" } },
        });
        if (data) {
          this.dispatch({ type: "transaction:response", response: data });
        }
        break;
      }
      case "download-files-to-file-system": {
        const { data } = await this.fetchClient.POST("/api/v1/files/download", {
          body: { ids: operation.files.map((file) => file.id) },
        });

        if (!data) {
          this.dispatch({
            type: "files:download:error:all",
            reason: "presigned-url-fetch-failed",
            transactionId: operation.transactionId,
          });
          break;
        }

        this.dispatch({
          type: "files:download:started:all",
          transactionId: operation.transactionId,
        });

        const downloadedFiles = await downloadFilesToFileSystem(
          operation.transactionId,
          data.signedUrls,
        );

        this.dispatch({
          type: "files:download:completed:all",
          transactionId: operation.transactionId,
          downloadedFiles,
        });
        break;
      }
      case "spool-files-to-printer": {
        const documentPath = operation.job.document.filePath;
        const { copyCount, outputColor } = operation.job;
        const printerName = operation.printerName ?? "hp smart tank 580";
        if (!documentPath) {
          return;
        }
        const response = await spoolFilesToPrinter(printerName, {
          documentPath,
          ticket: { copyCount, outputColor },
        });

        if (response.success) {
          this.dispatch({
            type: "file:spooled:success",
            printJobInfo: response.data,
            transactionId: operation.transactionId,
            jobId: operation.job.id,
            printerName,
          });
        }
        break;
      }

      case "start-print-job-monitoring": {
        this.startMonitoring(operation);
        break;
      }

      case "stop-print-job-monitoring": {
        this.stopMonitoring(operation);
        break;
      }

      default:
        break;
    }
  }

  private startMonitoring(operation: StartPrintJobMonitoringOperation): void {
    const {
      transactionId,
      jobId,
      printJobIdentifier,
      printerName,
      pollingIntervalMs = 1500,
      timeoutMs = 30000, // 30 seconds for generalist approach
    } = operation;

    const cancellation = new Subject<void>();
    const monitoringKey = `${transactionId.toString()}-${jobId.toString()}`;
    this.monitoringCancellation.set(monitoringKey, cancellation);

    this.dispatch({
      type: "print-job:monitoring:started",
      transactionId,
      jobId,
      printJobIdentifier,
      printerName,
    });

    let lastStatuses: PrintJobStatusDto[] = [];
    let lastPageCount = 0;
    let totalPages = 0;
    let lastActivityTime = Date.now();
    let hasDispatchedTimeout = false;

    type MonitoringState = "idle" | "active" | "finalizing";
    let monitoringState: MonitoringState = "idle";

    const arraysEqual = (a: string[], b: string[]): boolean => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, idx) => val === sortedB[idx]);
    };

    interval(pollingIntervalMs)
      .pipe(
        startWith(0),
        switchMap(async () => {
          const response = await getPrintJob(printerName, printJobIdentifier);
          return response;
        }),
        tap((response) => {
          if (response.success && response.data) {
            const jobInfo = response.data;
            const currentStatuses = jobInfo.jobStatuses;
            const currentPageCount = jobInfo.numberOfPagesPrinted;
            const currentTotalPages = jobInfo.numberOfPages;

            const statusesChanged = !arraysEqual(currentStatuses, lastStatuses);

            const hasCompletedSignal = currentStatuses.includes("Completed");
            const hasErrorSignal = currentStatuses.includes("Error");
            const hasBlockedSignal = currentStatuses.includes("Blocked");

            const pagesChanged = currentPageCount !== lastPageCount;
            const totalPagesChanged = currentTotalPages !== totalPages;

            const hasActivity =
              statusesChanged || pagesChanged || totalPagesChanged;

            if (statusesChanged) {
              console.log(
                `[Job ${printJobIdentifier.toString()}] Status transition: ${JSON.stringify(lastStatuses)} => ${JSON.stringify(currentStatuses)}`,
              );
            }

            this.dispatch({
              type: "print-job:status:polled",
              transactionId,
              jobId,
              printJobIdentifier,
              status: currentStatuses,
              numberOfPagesPrinted: currentPageCount,
            });

            if (monitoringState === "idle" && currentTotalPages > 0) {
              monitoringState = "active";
              lastActivityTime = Date.now();

              this.dispatch({
                type: "print-job:printing:started",
                transactionId,
                jobId,
                printJobIdentifier,
              });
            }

            // ACTIVE/IDLE → FINALIZING: Completion signals detected
            if (
              (monitoringState === "active" || monitoringState === "idle") &&
              (hasCompletedSignal ||
                (currentPageCount >= currentTotalPages &&
                  currentTotalPages > 0 &&
                  currentPageCount > 0))
            ) {
              monitoringState = "finalizing";
              lastActivityTime = Date.now();
            }

            // === ACTIVITY TRACKING ===

            if (hasActivity) {
              lastActivityTime = Date.now();
              hasDispatchedTimeout = false; // Reset timeout flag on activity
            }

            // === ERROR DETECTION ===

            if (hasErrorSignal || hasBlockedSignal) {
              this.dispatch({
                type: "print-job:failed",
                transactionId,
                jobId,
                printJobIdentifier,
                reason: currentStatuses,
              });
              cancellation.next();
              return;
            }

            // === TIMEOUT DETECTION ===

            const timeSinceActivity = Date.now() - lastActivityTime;

            if (
              monitoringState === "active" &&
              timeSinceActivity > timeoutMs &&
              !hasDispatchedTimeout
            ) {
              hasDispatchedTimeout = true;
              this.dispatch({
                type: "print-job:timeout",
                transactionId,
                jobId,
                printJobIdentifier,
                lastKnownStatus: currentStatuses,
              });
              // Continue monitoring - printer might recover
            }

            // === UPDATE TRACKING VARIABLES ===

            lastStatuses = currentStatuses;
            lastPageCount = currentPageCount;
            totalPages = currentTotalPages;
          } else if (!response.success && response.code === "JOB_NOT_FOUND") {
            // === JOB DISAPPEARED ===

            this.dispatch({
              type: "print-job:not-found",
              transactionId,
              jobId,
              printJobIdentifier,
              lastKnownStatus: lastStatuses,
            });

            // Determine success vs failure based on state and signals
            const hadActivity = monitoringState !== "idle";
            const printedSomePages = lastPageCount > 0;
            const printedAllPages =
              totalPages > 0 && lastPageCount >= totalPages;

            if (monitoringState === "finalizing" || printedAllPages) {
              // SUCCESS: Job was completing or all pages were printed
              this.dispatch({
                type: "print-job:completed",
                transactionId,
                jobId,
                printJobIdentifier,
              });
            } else if (hadActivity && printedSomePages) {
              // PARTIAL: Job started but didn't complete all pages
              this.dispatch({
                type: "print-job:failed",
                transactionId,
                jobId,
                printJobIdentifier,
                reason: ["Incomplete"],
              });
            } else {
              // FAILURE: Job disappeared without meaningful progress
              this.dispatch({
                type: "print-job:failed",
                transactionId,
                jobId,
                printJobIdentifier,
                reason: lastStatuses.length > 0 ? lastStatuses : ["None"],
              });
            }

            cancellation.next();
          }
        }),
        catchError((error) => {
          console.error(
            `[Job ${printJobIdentifier.toString()}] Monitoring error:`,
            error,
          );
          this.dispatch({
            type: "print-job:failed",
            transactionId,
            jobId,
            printJobIdentifier,
            reason: ["Error"],
          });
          cancellation.next();
          return [];
        }),
        takeUntil(cancellation),
      )
      .subscribe();
  }

  private stopMonitoring(operation: StopPrintJobMonitoringOperation): void {
    const monitoringKey = `${operation.transactionId.toString()}-${operation.jobId.toString()}`;
    const cancellation = this.monitoringCancellation.get(monitoringKey);

    if (cancellation) {
      cancellation.next();
      cancellation.complete();
      this.monitoringCancellation.delete(monitoringKey);
    }
  }
}
