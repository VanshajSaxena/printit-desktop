import { type FetchClientType } from "@api/client";
import type { PrintJobStatusDto } from "@app/common/gen/types/print-service-api-types";
import {
  downloadFilesToFileSystem,
  emitWebSocketEvent,
  generateQrCodePdf,
  getPrintJob,
  spoolFilesToPrinter,
} from "@app/preload";
import log from "electron-log";
import { defer, Subject } from "rxjs";
import { repeat, takeUntil } from "rxjs/operators";
import { toast } from "sonner";
import type { ReducerEvent } from "./events";
import type {
  ReportJobStatusOperation,
  ReportTransactionStatusOperation,
  StartPrintJobMonitoringOperation,
  StopPrintJobMonitoringOperation,
  TransactionOperation,
} from "./operations";

export class ObservableExecutor {
  private dispatch: (event: ReducerEvent) => void;
  private fetchClient: FetchClientType;
  private logger: log.LogFunctions;
  private monitoringCancellation = new Map<string, Subject<void>>();
  private reportRetryQueue: {
    operation: ReportJobStatusOperation | ReportTransactionStatusOperation;
    attempts: number;
    lastAttemptAt: number;
  }[] = [];
  private maxRetryAttempts = 5;
  private retryIntervalMs = 5000;
  constructor(
    dispatch: (event: ReducerEvent) => void,
    fetchClient: FetchClientType,
  ) {
    this.dispatch = dispatch;
    this.fetchClient = fetchClient;
    this.logger = log.scope(ObservableExecutor.name);
    this.startRetryProcessor();
  }

  async execute(operation: TransactionOperation): Promise<void> {
    // __AUTO_GENERATED_PRINT_VAR_START__
    this.logger.debug("ObservableExecutor#execute operation:", operation); // __AUTO_GENERATED_PRINT_VAR_END__
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
      case "spool-qr-code-file": {
        const printerName = "hp smart tank 580";
        const response = await spoolFilesToPrinter(printerName, {
          documentPath: operation.path,
          ticket: { copyCount: 1, outputColor: "Grayscale" },
        });
        if (response.success) {
          toast.success(
            "Your QR Code is sent to the printer. Make sure it is connected to start receiving files.",
            { position: "top-center" },
          );
        }
        break;
      }
      case "emit-user-print-intent": {
        emitWebSocketEvent("milestone:transaction:queued", {
          transactionId: operation.transactionId,
          vendorId: operation.vendorId,
          timestamp: new Date().toISOString(),
        });
        break;
      }
      case "emit-transaction-printing": {
        emitWebSocketEvent("milestone:transaction:printing", {
          transactionId: operation.transactionId,
          vendorId: operation.vendorId,
          timestamp: new Date().toISOString(),
        });
        break;
      }

      case "generate-qr-code-pdf": {
        const { path } = await generateQrCodePdf(operation.qrDataUrl);
        if (path) {
          this.dispatch({
            type: "user:get-qr-code:success",
            path,
            printIntent: operation.printIntent,
          });
        } else {
          this.dispatch({ type: "user:get-qr-code:error" });
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
        const printerName = operation.queueName;
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
        } else {
          // __AUTO_GENERATED_PRINT_VAR_START__
          this.logger.log(
            "ObservableExecutor#execute#if#if response.code:",
            response.code,
          ); // __AUTO_GENERATED_PRINT_VAR_END__
        }
        break;
      }

      case "start-job-monitoring": {
        this.startMonitoring(operation);
        break;
      }

      case "stop-job-monitoring": {
        this.stopMonitoring(operation);
        break;
      }

      case "report-job-status": {
        await this.reportJobStatus(operation);
        break;
      }

      case "report-transaction-and-jobs-status": {
        await this.reportTransactionStatus(operation);
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
      queueName,
      pollingIntervalMs = 1500,
      timeoutMs = 30000,
    } = operation;

    const cancellation = new Subject<void>();
    const monitoringKey = `${transactionId.toString()}-${jobId.toString()}`;
    this.monitoringCancellation.set(monitoringKey, cancellation);

    this.dispatch({
      type: "job:monitoring:started",
      transactionId,
      jobId,
      printJobIdentifier,
      queueName,
    });

    let lastStatuses: PrintJobStatusDto[] = [];
    let lastPageCount = 0;
    let totalPages = 0;
    let lastActivityTime = Date.now();
    let hasDispatchedTimeout = false;
    let hasDispatchedError = false;
    let hasDispatchedBlocked = false;

    type MonitoringState = "idle" | "accepted" | "finalizing";
    let monitoringState: MonitoringState = "idle";

    const arraysEqual = (a: string[], b: string[]): boolean => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, idx) => val === sortedB[idx]);
    };

    defer(() => getPrintJob(queueName, printJobIdentifier))
      .pipe(repeat({ delay: pollingIntervalMs }), takeUntil(cancellation))
      .subscribe({
        next: (response) => {
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
              this.logger.log(
                `[Job ${printJobIdentifier.toString()}] Status transition: ${JSON.stringify(lastStatuses)} => ${JSON.stringify(currentStatuses)}`,
              );
            }

            this.dispatch({
              type: "job:status:polled",
              transactionId,
              jobId,
              printJobIdentifier,
              queueName,
              statuses: currentStatuses,
              numberOfPagesPrinted: currentPrintedPageCount,
            });

            if (monitoringState === "idle" && currentTotalPages > 0) {
              monitoringState = "accepted";
              lastActivityTime = Date.now();

              this.dispatch({
                type: "job:accepted",
                transactionId,
                jobId,
                printJobIdentifier,
                queueName,
                totalPages: currentTotalPages,
              });
            }

            if (
              (monitoringState === "accepted" || monitoringState === "idle") &&
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
              hasDispatchedTimeout = false;
            }

            if (hasErrorSignal && !hasDispatchedError) {
              hasDispatchedError = true;
              this.dispatch({
                type: "job:critical",
                transactionId,
                jobId,
                printJobIdentifier,
                statuses: currentStatuses,
              });
            }

            if (!hasErrorSignal && hasDispatchedError) {
              hasDispatchedError = false;
            }

            if (hasBlockedSignal && !hasDispatchedBlocked) {
              hasDispatchedBlocked = true;
              this.dispatch({
                type: "job:blocked",
                transactionId,
                jobId,
                printJobIdentifier,
                statuses: currentStatuses,
              });
            }

            if (!hasBlockedSignal && hasDispatchedBlocked) {
              hasDispatchedBlocked = false;
            }

            const timeSinceActivity = Date.now() - lastActivityTime;
            if (
              monitoringState === "accepted" &&
              timeSinceActivity > timeoutMs &&
              !hasDispatchedTimeout
            ) {
              hasDispatchedTimeout = true;
              this.dispatch({
                type: "job:timeout",
                transactionId,
                jobId,
                printJobIdentifier,
                lastKnownStatuses: currentStatuses,
              });
            }

            lastStatuses = currentStatuses;
            lastPageCount = currentPrintedPageCount;
            totalPages = currentTotalPages;
          } else if (!response.success && response.code === "JOB_NOT_FOUND") {
            this.dispatch({
              type: "job:not-found",
              transactionId,
              jobId,
              printJobIdentifier,
              lastKnownStatuses: lastStatuses,
            });

            const hadActivity = monitoringState !== "idle";
            const printedSomePages = lastPageCount > 0;
            const printedAllPages =
              totalPages > 0 && lastPageCount >= totalPages;

            if (monitoringState === "finalizing" || printedAllPages) {
              this.dispatch({
                type: "job:completed",
                transactionId,
                jobId,
                printJobIdentifier,
              });
            } else if (hadActivity && printedSomePages) {
              this.dispatch({
                type: "job:incomplete",
                transactionId,
                jobId,
                printJobIdentifier,
                pagesPrinted: lastPageCount,
                totalPages: totalPages,
              });
            } else {
              this.dispatch({
                type: "job:disappear",
                transactionId,
                jobId,
                printJobIdentifier,
                reason: lastStatuses.length > 0 ? lastStatuses : ["Unknown"],
              });
            }

            cancellation.next();
          }
        },
        error: (error) => {
          this.logger.error(
            `[Job ${printJobIdentifier.toString()}] Monitoring error:`,
            error,
          );
          this.dispatch({
            type: "job:monitoring:error",
            transactionId,
            jobId,
            queueName,
            printJobIdentifier,
            reason: ["Error"],
          });
          cancellation.next();
          return [];
        },
      });
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

  private async reportJobStatus(
    operation: ReportJobStatusOperation,
  ): Promise<void> {
    try {
      const { error, response } = await this.fetchClient.PATCH(
        "/api/v1/jobs/{id}/status",
        {
          params: { path: { id: operation.jobId } },
          body: { status: operation.status },
        },
      );

      if (!response.ok) {
        this.logger.error("Failed to report job status:", error);
        this.queueReportingForRetry(operation);
        return;
      }

      this.dispatch({
        type: "job:report:success",
        jobId: operation.jobId,
        transactionId: operation.transactionId,
      });
    } catch (error) {
      this.logger.error("Exception reporting job status:", error);
      this.queueReportingForRetry(operation);
    }
  }

  private async reportTransactionStatus(
    operation: ReportTransactionStatusOperation,
  ): Promise<void> {
    try {
      const { error, response } = await this.fetchClient.PATCH(
        "/api/v1/transactions/{id}/status",
        {
          params: { path: { id: operation.transactionId } },
          body: { status: operation.status },
        },
      );

      if (!response.ok) {
        this.logger.error("Failed to report transaction status:", error);
        this.queueReportingForRetry(operation);
        return;
      }

      this.dispatch({
        type: "transaction:report:success",
        transactionId: operation.transactionId,
      });
    } catch (error) {
      this.logger.error("Exception reporting transaction status:", error);
      this.queueReportingForRetry(operation);
    }
  }

  private queueReportingForRetry(
    operation: ReportJobStatusOperation | ReportTransactionStatusOperation,
  ): void {
    const existing = this.reportRetryQueue.find(
      (item) =>
        item.operation.type === operation.type &&
        item.operation.transactionId === operation.transactionId &&
        (operation.type === "report-job-status"
          ? (item.operation as ReportJobStatusOperation).jobId ===
            operation.jobId
          : true),
    );

    if (existing) {
      existing.attempts += 1;
      existing.lastAttemptAt = Date.now();
    } else {
      this.reportRetryQueue.push({
        operation,
        attempts: 1,
        lastAttemptAt: Date.now(),
      });
    }

    this.logger.log(
      `Queued report for retry. Queue size: ${this.reportRetryQueue.length.toString()}`,
    );
  }

  private startRetryProcessor(): void {
    setInterval(() => {
      void this.processRetryQueue();
    }, this.retryIntervalMs);
  }

  private async processRetryQueue(): Promise<void> {
    if (this.reportRetryQueue.length === 0) {
      return;
    }

    const now = Date.now();
    const itemsToRetry: typeof this.reportRetryQueue = [];

    this.reportRetryQueue.forEach((item) => {
      const backoffMs = Math.min(
        this.retryIntervalMs * Math.pow(2, item.attempts - 1),
        60000,
      );
      const nextRetryTime = item.lastAttemptAt + backoffMs;

      if (now >= nextRetryTime) {
        if (item.attempts < this.maxRetryAttempts) {
          itemsToRetry.push(item);
        } else {
          this.logger.error(`Max retries exceeded for report:`, item.operation);
        }
      }
    });

    this.reportRetryQueue = this.reportRetryQueue.filter(
      (item) =>
        !itemsToRetry.includes(item) && item.attempts < this.maxRetryAttempts,
    );

    for (const item of itemsToRetry) {
      this.logger.log(
        `Retrying report (attempt ${(item.attempts + 1).toString()}/${this.maxRetryAttempts.toString()}):`,
        item.operation.type,
      );

      if (item.operation.type === "report-job-status") {
        await this.reportJobStatus(item.operation);
      }
      if (item.operation.type === "report-transaction-and-jobs-status") {
        await this.reportTransactionStatus(item.operation);
      }
    }
  }
}
