import type { OutputColorDto } from "@app/common/gen/types/print-service-api-types";
import type {
  ReportingStatus,
  StatusType,
  WithTransactionId,
} from "./structure";

export interface WithOperationId {
  operationId: string;
}

export type TransactionOperation = WithOperationId &
  (
    | FetchTransactionOperation
    | GenerateQrCodeOperation
    | SpoolQrCodeFileOperation
    | TransactionOperationUnion
  );

export type TransactionOperationUnion = WithTransactionId &
  (
    | EmitTransactionPrintingOperation
    | EmitUserPrintIntentOperation
    | DownloadFilesOperation
    | SpoolFilesToPrinterOperation
    | InitializeJobMonitoringOperation
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

export interface GenerateQrCodeOperation {
  type: "generate-qr-code-pdf";
  qrDataUrl: string;
  printIntent: boolean;
}

export interface FetchTransactionOperation {
  type: "fetch-transactions";
}

export interface SpoolQrCodeFileOperation {
  type: "spool-qr-code-file";
  path: string;
}

export interface SpoolFilesToPrinterOperation {
  type: "spool-files-to-printer";
  job: {
    id: number;
    status: StatusType;
    document: {
      filePath?: string;
      contentType: string;
      filename: string;
      id: number;
    };
    copyCount: number;
    outputColor: OutputColorDto;
  };
  queueName: string;
}

export interface StopPrintJobMonitoringOperation {
  type: "stop-job-monitoring";
  transactionId: number;
  jobId: number;
  printJobIdentifier: number;
  reason: "completed" | "failed" | "user-cancelled" | "timeout";
}

export interface InitializeJobMonitoringOperation {
  type: "initialize-job-monitoring";
  transactionId: number;
  jobId: number;
  printJobIdentifier: number;
  queueName: string;
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
