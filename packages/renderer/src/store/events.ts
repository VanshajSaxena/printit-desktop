import type { FindTransactionResponseDto } from "@api/gen/cloud-api-types";
import type {
  PrintJobInfoDto,
  PrintJobStatusDto,
} from "@app/common/gen/types/print-service-api-types";

export type TransactionEventUnionType =
  | NewTransactionEvent
  | UserSendToPrinterEvent
  | FilesDownloadStartedAllEvent
  | FilesDownloadProgressAllEvent
  | FilesDownloadCompletedAllEvent
  | FilesDownloadErrorAllEvent
  | PrintJobMonitoringStartedEvent
  | PrintJobStatusPolledEvent
  | PrintJobPrintingStartedEvent
  | PrintJobCompletedEvent
  | PrintJobFailedEvent
  | PrintJobTimeoutEvent
  | PrintJobNotFoundEvent
  | FileSpooledSuccessEvent;

export type ReducerEvent =
  | (TransactionEventUnionType & WithTransactionId)
  | TransactionRequestEvent
  | TransactionResponseEvent;

export interface WithTransactionId {
  transactionId: number;
}

export interface TransactionObject {
  id: number;
  createdAt: string;
  friendlyId: string;
  status:
    | "PENDING"
    | "QUEUED"
    | "DOWNLOADING"
    | "READY"
    | "SPOOLED"
    | "PRINTING"
    | "COMPLETED"
    | "ERROR";
  jobs: {
    id: number;
    status: TransactionObject["status"];
    document: {
      filePath?: string;
      contentType: string;
      filename: string;
      id: number;
    };
    copyCount: number;
    outputColor: "COLOR" | "MONOCHROME" | "GRAYSCALE";
    printJobIdentifier?: number;
    printerName?: string;
    spooledAt?: string;
    completedAt?: string;
    failedAt?: string;
  }[];
}

export interface TransactionState {
  transactions: Record<TransactionObject["id"], TransactionObject>;
  printQueue: PrintQueue;
}

export interface PrintQueue {
  items: PrintQueueItem[];
  status: "idle" | "working" | "printing" | "error";
}

export interface PrintQueueItem {
  id: string;
  transactionId: number;
  jobId: number;
  queuedAt: string;
  monitoring?: {
    isActive: boolean;
    lastPolledAt?: string;
    lastKnownStatus?: PrintJobStatusDto;
    pagesPrinted: number;
    startedPrintingAt?: string;
    timedOut: boolean;
    timeoutAt?: string;
  };
}

export interface TransactionStore {
  state: TransactionState;
  dispatch: (event: ReducerEvent) => void;
}

export interface TransactionRequestEvent {
  type: "transaction:request";
}

export interface TransactionResponseEvent {
  type: "transaction:response";
  response: FindTransactionResponseDto[];
}

export interface NewTransactionEvent {
  type: "transaction:new";
}

export interface UserSendToPrinterEvent {
  type: "user:print:transaction";
}

export interface FilesDownloadStartedAllEvent {
  type: "files:download:started:all";
}

export interface FilesDownloadProgressAllEvent {
  type: "files:download:progress:all";
}

export interface FilesDownloadCompletedAllEvent {
  type: "files:download:completed:all";
  downloadedFiles: {
    id: number;
    filePath: string;
  }[];
}

export interface FilesDownloadErrorAllEvent {
  type: "files:download:error:all";
  reason:
    | "presigned-url-fetch-failed"
    | "download-manager-threw-during-download";
}

export interface PrintJobMonitoringStartedEvent {
  type: "print-job:monitoring:started";
  jobId: number;
  printJobIdentifier: number;
  printerName: string;
}

export interface PrintJobStatusPolledEvent {
  type: "print-job:status:polled";
  jobId: number;
  printJobIdentifier: number;
  status: PrintJobStatusDto;
  numberOfPagesPrinted: number;
}

export interface PrintJobPrintingStartedEvent {
  type: "print-job:printing:started";
  jobId: number;
  printJobIdentifier: number;
}

export interface PrintJobCompletedEvent {
  type: "print-job:completed";
  jobId: number;
  printJobIdentifier: number;
}

export interface PrintJobFailedEvent {
  type: "print-job:failed";
  jobId: number;
  printJobIdentifier: number;
  reason: PrintJobStatusDto;
}

export interface PrintJobTimeoutEvent {
  type: "print-job:timeout";
  jobId: number;
  printJobIdentifier: number;
  lastKnownStatus: PrintJobStatusDto;
}

export interface PrintJobNotFoundEvent {
  type: "print-job:not-found";
  jobId: number;
  printJobIdentifier: number;
  lastKnownStatus?: PrintJobStatusDto;
}

export interface FileSpooledSuccessEvent {
  type: "file:spooled:success";
  printJobInfo: PrintJobInfoDto | undefined;
  jobId: number;
  printerName: string;
}
