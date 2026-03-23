import type { FindTransactionResponseDto } from "@api/gen/cloud-api-types";
import type {
  OutputColorDto,
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
  | PrintJobMonitoringErrorEvent
  | PrintJobStatusPolledEvent
  | PrintJobPrintingStartedEvent
  | PrintJobCompletedEvent
  | PrintJobFailedEvent
  | PrintJobTimeoutEvent
  | PrintJobNotFoundEvent
  | PrintJobAcceptedEvent
  | PrintJobErrorEvent
  | PrintJobBlockedEvent
  | PrintJobIncompleteEvent
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
    | "INCOMPLETE"
    | "COMPLETED"
    | "ERROR";
  jobs: {
    id: number;
    status: TransactionObject["status"];
    document: {
      filePath?: string;
      pageCount: number;
      contentType: string;
      filename: string;
      id: number;
    };
    copyCount: number;
    outputColor: OutputColorDto;
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
  status: "idle" | "working" | "spooled" | "printing" | "stalled" | "error";
}

export interface PrintQueueItem {
  id: string;
  transactionId: number;
  jobId: number;
  queuedAt: string;
  monitoring?: {
    isActive: boolean;
    lastPolledAt?: string;
    lastKnownStatus?: PrintJobStatusDto[];
    pagesPrinted: number;
    startedPrintingAt?: string;
    hasError: boolean;
    errorStatuses: PrintJobStatusDto[];
    isBlocked: boolean;
    blockedStatuses: PrintJobStatusDto[];
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
  type: "job:monitoring:started";
  jobId: number;
  printJobIdentifier: number;
  printerName: string;
}

export interface PrintJobMonitoringErrorEvent {
  type: "job:monitoring:error";
  jobId: number;
  printJobIdentifier: number;
  printerName: string;
  reason?: string[];
}

export interface PrintJobStatusPolledEvent {
  type: "job:status:polled";
  jobId: number;
  printJobIdentifier: number;
  statuses: PrintJobStatusDto[];
  numberOfPagesPrinted: number;
}

export interface PrintJobPrintingStartedEvent {
  type: "job:printing:started";
  jobId: number;
  printJobIdentifier: number;
}

export interface PrintJobCompletedEvent {
  type: "job:completed";
  jobId: number;
  printJobIdentifier: number;
}

export interface PrintJobFailedEvent {
  type: "job:failed";
  jobId: number;
  printJobIdentifier: number;
  reason?: string[];
}

export interface PrintJobTimeoutEvent {
  type: "job:timeout";
  jobId: number;
  printJobIdentifier: number;
  lastKnownStatuses: PrintJobStatusDto[];
}

export interface PrintJobNotFoundEvent {
  type: "job:not-found";
  jobId: number;
  printJobIdentifier: number;
  lastKnownStatuses?: PrintJobStatusDto[];
}

export interface FileSpooledSuccessEvent {
  type: "file:spooled:success";
  printJobInfo: PrintJobInfoDto | undefined;
  jobId: number;
  printerName: string;
}

export interface PrintJobAcceptedEvent {
  type: "job:accepted";
  jobId: number;
  printJobIdentifier: number;
  totalPages: number;
}

export interface PrintJobErrorEvent {
  type: "job:error";
  jobId: number;
  printJobIdentifier: number;
  statuses: PrintJobStatusDto[];
}

export interface PrintJobBlockedEvent {
  type: "job:blocked";
  jobId: number;
  printJobIdentifier: number;
  statuses: PrintJobStatusDto[];
}

export interface PrintJobIncompleteEvent {
  type: "job:incomplete";
  jobId: number;
  printJobIdentifier: number;
  pagesPrinted: number;
  totalPages: number;
}
