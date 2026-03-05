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
      timeoutMs = 30000,
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
            const currentPrintedPageCount = jobInfo.numberOfPagesPrinted;
            const currentTotalPages = jobInfo.numberOfPages;

            const statusesChanged = !arraysEqual(currentStatuses, lastStatuses);

            const hasCompletedSignal = currentStatuses.includes("Completed");
            const hasErrorSignal = currentStatuses.includes("Error");
            const hasBlockedSignal = currentStatuses.includes("Blocked");

            const pagesChanged = currentPrintedPageCount !== lastPageCount;
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
              numberOfPagesPrinted: currentPrintedPageCount,
            });

            // This does not actually deterministically tell if the printing was actually started. More like it only tell that the spooler actually cached our file (as currentTotalPages was updated).
            if (monitoringState === "idle" && currentTotalPages > 0) {
              monitoringState = "active";
              lastActivityTime = Date.now();

              // We either have to rename this event or create a completely new event altogether. Printing doesn't start here.
              this.dispatch({
                type: "print-job:printing:started",
                transactionId,
                jobId,
                printJobIdentifier,
              });
            }

            if (
              (monitoringState === "active" || monitoringState === "idle") &&
              (hasCompletedSignal ||
                (currentPrintedPageCount >= currentTotalPages &&
                  currentTotalPages > 0 &&
                  currentPrintedPageCount > 0))
            ) {
              monitoringState = "finalizing";
              lastActivityTime = Date.now();
            }

            if (hasActivity) {
              lastActivityTime = Date.now();
              hasDispatchedTimeout = false; // Reset timeout flag on activity
            }

            if (hasErrorSignal || hasBlockedSignal) {
              // We don't want to dispatch print-job:failed here, a blocked or
              // errored job doesn't always mean the job is dead, it can
              // recover if the user fixes the issue manually (maybe by adding
              // more pages to the printer tray if the printer errored because
              // it was out of paper). We will create granular dispatch events like `print-job:error`, `print-job:blocked`
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

            const timeSinceActivity = Date.now() - lastActivityTime;
            if (
              monitoringState === "active" &&
              timeSinceActivity > timeoutMs &&
              !hasDispatchedTimeout
            ) {
              hasDispatchedTimeout = true;
              this.dispatch({
                type: "print-job:timeout", // this event in my testing is actually working correctly (i.e. this is being fired correctly at the right time.)
                transactionId,
                jobId,
                printJobIdentifier,
                lastKnownStatus: currentStatuses,
              });
            }

            lastStatuses = currentStatuses;
            lastPageCount = currentPrintedPageCount;
            totalPages = currentTotalPages;
          } else if (!response.success && response.code === "JOB_NOT_FOUND") {
            // This block needs thinking.

            // Alright we fire not-found event here, but it's not actually very
            // usefull for the reducer with out the context (which only
            // executor's startMonitoring closure have. We will fire it for
            // now, but the reducer might not do anything with it for now.)
            this.dispatch({
              type: "print-job:not-found",
              transactionId,
              jobId,
              printJobIdentifier,
              lastKnownStatus: lastStatuses,
            });

            const hadActivity = monitoringState !== "idle";
            const printedSomePages = lastPageCount > 0;
            const printedAllPages =
              totalPages > 0 && lastPageCount >= totalPages;

            if (monitoringState === "finalizing" || printedAllPages) {
              this.dispatch({
                type: "print-job:completed",
                transactionId,
                jobId,
                printJobIdentifier,
              });
            } else if (hadActivity && printedSomePages) {
              this.dispatch({
                type: "print-job:failed", // We need a different event for partially printed jobs, we don't declare them failed (failed ~= dead) altogether. The job could progress if the user might fix a hardware issue for example (like adding paper or ink)
                transactionId,
                jobId,
                printJobIdentifier,
                reason: ["Incomplete"],
              });
            } else {
              this.dispatch({
                type: "print-job:failed", // This is appropriate here for now.
                transactionId,
                jobId,
                printJobIdentifier,
                reason: lastStatuses.length > 0 ? lastStatuses : ["Unknown"],
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
