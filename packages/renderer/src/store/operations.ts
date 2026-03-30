import type {
  ReportingStatus,
  TransactionObject,
  WithTransactionId,
} from "./events";

export interface TransactionOperationBase {
  operationId: string;
}
export type TransactionOperation = (
  | FetchTransactionOperation
  | TransactionOperationUnion
) &
  TransactionOperationBase;

export type TransactionOperationUnion = WithTransactionId &
  (
    | EmitTransactionPrintingOperation
    | EmitUserPrintIntentOperation
    | DownloadFilesOperation
    | SpoolFilesToPrinterOperation
    | StartPrintJobMonitoringOperation
    | StopPrintJobMonitoringOperation
    | ReportJobStatusOperation
    | ReportTransactionStatusOperation
  );

export interface EmitTransactionPrintingOperation {
  type: "emit-transaction-printing";
  vendorId: number;
}

export interface EmitUserPrintIntentOperation {
  type: "emit-user-print-intent";
  vendorId: number;
}

export interface DownloadFilesOperation {
  type: "download-files-to-file-system";
  files: { id: number }[];
}

export interface FetchTransactionOperation {
  type: "fetch-transactions";
}

export interface SpoolFilesToPrinterOperation {
  type: "spool-files-to-printer";
  job: {
    id: number;
    status: TransactionObject["status"];
    document: {
      filePath?: string;
      contentType: string;
      filename: string;
      id: number;
    };
    copyCount: number;
    outputColor: TransactionObject["jobs"][0]["outputColor"];
  };
  printerName?: string;
}

export interface StopPrintJobMonitoringOperation {
  type: "stop-job-monitoring";
  transactionId: number;
  jobId: number;
  printJobIdentifier: number;
  reason: "completed" | "failed" | "user-cancelled" | "timeout";
}

export interface StartPrintJobMonitoringOperation {
  type: "start-job-monitoring";
  transactionId: number;
  jobId: number;
  printJobIdentifier: number;
  printerName: string;
  pollingIntervalMs?: number;
  timeoutMs?: number;
}

export interface ReportJobStatusOperation {
  type: "report-job-status";
  transactionId: number;
  jobId: number;
  status: ReportingStatus;
  pagesPrinted?: number;
  totalPages?: number;
  timestamp: string;
}

export interface ReportTransactionStatusOperation {
  type: "report-transaction-and-jobs-status";
  transactionId: number;
  status: ReportingStatus;
  timestamp: string;
}
