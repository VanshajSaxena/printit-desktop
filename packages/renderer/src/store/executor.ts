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
      timeoutMs = 5000,
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

    // State tracking
    let lastKnownStatus: PrintJobStatusDto | undefined;
    let lastPageCount = 0;
    let totalPages = 0;
    let lastProgressTime = Date.now();

    type PrintingState = "waiting" | "printing" | "completing";
    let printingState: PrintingState = "waiting";

    interval(pollingIntervalMs)
      .pipe(
        startWith(0),
        switchMap(async () => {
          const response = await getPrintJob(printerName, printJobIdentifier);
          return response;
        }),
        tap((response) => {
          // __AUTO_GENERATED_PRINT_VAR_START__
          console.log(
            "ObservableExecutor#startMonitoring printingState:",
            printingState,
          ); // __AUTO_GENERATED_PRINT_VAR_END__
          if (response.success && response.data) {
            const jobInfo = response.data;
            const currentStatus = jobInfo.jobStatus;
            // __AUTO_GENERATED_PRINT_VAR_START__
            console.log(
              "ObservableExecutor#startMonitoring#(anon)#if currentStatus:",
              currentStatus,
            ); // __AUTO_GENERATED_PRINT_VAR_END__
            const currentPageCount = jobInfo.numberOfPagesPrinted;
            // __AUTO_GENERATED_PRINT_VAR_START__
            console.log(
              "ObservableExecutor#startMonitoring#(anon)#if currentPageCount:",
              currentPageCount,
            ); // __AUTO_GENERATED_PRINT_VAR_END__
            totalPages = jobInfo.numberOfPages;

            this.dispatch({
              type: "print-job:status:polled",
              transactionId,
              jobId,
              printJobIdentifier,
              status: currentStatus,
              numberOfPagesPrinted: currentPageCount,
            });

            if (
              printingState === "waiting" &&
              currentStatus === "UserIntervention"
            ) {
              printingState = "printing";
              lastProgressTime = Date.now();
              this.dispatch({
                type: "print-job:printing:started",
                transactionId,
                jobId,
                printJobIdentifier,
              });
            }

            if (
              printingState === "printing" &&
              currentPageCount > lastPageCount
            ) {
              printingState = "completing";
              lastProgressTime = Date.now();
            }

            if (currentPageCount > lastPageCount) {
              lastPageCount = currentPageCount;
              lastProgressTime = Date.now();
            }

            if (currentStatus === "Error" || currentStatus === "Blocked") {
              this.dispatch({
                type: "print-job:failed",
                transactionId,
                jobId,
                printJobIdentifier,
                reason: currentStatus,
              });
              cancellation.next();
              return;
            }

            const timeSinceProgress = Date.now() - lastProgressTime;

            if (printingState === "waiting" && timeSinceProgress > timeoutMs) {
              this.dispatch({
                type: "print-job:timeout",
                transactionId,
                jobId,
                printJobIdentifier,
                lastKnownStatus: currentStatus,
              });
            }

            if (
              printingState === "completing" &&
              timeSinceProgress > timeoutMs
            ) {
              this.dispatch({
                type: "print-job:timeout",
                transactionId,
                jobId,
                printJobIdentifier,
                lastKnownStatus: currentStatus,
              });
            }

            lastKnownStatus = currentStatus;
          } else if (!response.success && response.code === "JOB_NOT_FOUND") {
            this.dispatch({
              type: "print-job:not-found",
              transactionId,
              jobId,
              printJobIdentifier,
              lastKnownStatus,
            });

            const printedAllPages =
              totalPages > 0 && lastPageCount >= totalPages;

            if (printingState === "completing" || printedAllPages) {
              this.dispatch({
                type: "print-job:completed",
                transactionId,
                jobId,
                printJobIdentifier,
              });
            } else if (printingState === "printing" && lastPageCount > 0) {
              this.dispatch({
                type: "print-job:failed",
                transactionId,
                jobId,
                printJobIdentifier,
                reason: "Error",
              });
            } else {
              this.dispatch({
                type: "print-job:failed",
                transactionId,
                jobId,
                printJobIdentifier,
                reason: lastKnownStatus ?? "None",
              });
            }

            cancellation.next();
          }
        }),
        catchError((error) => {
          console.error("Monitoring error:", error);
          this.dispatch({
            type: "print-job:failed",
            transactionId,
            jobId,
            printJobIdentifier,
            reason: "Error",
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
