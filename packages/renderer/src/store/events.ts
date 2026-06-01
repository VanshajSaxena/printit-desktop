import type { FindTransactionResponseDto } from "@api/gen/cloud-api-types";
import type {
  PrintJobInfoDto,
  PrintJobStatusDto,
} from "@app/common/gen/types/print-service-api-types";
import type { WithTransactionId } from "./structure";

export type TransactionEventUnionType = WithTransactionId &
  (
    | NewTransactionEvent
    | UserPrintTransactionEvent
    | UserPrintJobEvent
    | UserMarkAsCompleteEvent
    | UserRetryJobEvent
    | UserCancleJobEvent
    | UserCancleTransactionEvent
    | UserRejectTransactionEvent
    | FilesDownloadStartedAllEvent
    | FilesDownloadProgressAllEvent
    | FilesDownloadCompletedAllEvent
    | FilesDownloadErrorAllEvent
    | PrintJobMonitoringStartedEvent
    | PrintJobMonitoringErrorEvent
    | PrintJobStatusPolledEvent
    | PrintJobPrintingStartedEvent
    | PrintJobCompletedEvent
    | PrintTransactionReportSuccessEvent
    | PrintJobReportSuccessEvent
    | PrintJobFailedEvent
    | PrintJobTimeoutEvent
    | PrintJobNotFoundEvent
    | PrintJobAcceptedEvent
    | PrintJobCriticalEvent
    | PrintJobBlockedEvent
    | PrintJobIncompleteEvent
    | FileSpooledSuccessEvent
    | StartDownloadFilesToFileSystem
    | StartInitializeJobMonitoring
    | StartSpoolFilesToFileSystem
  );

export type ReducerEvent =
  | TransactionEventUnionType
  | TransactionRequestEvent
  | TransactionResponseEvent
  | UserGetQrCodeEvent
  | UserQrCodeGenerateSuccessEvent
  | UserQrCodeGenerateErrorEvent;

export interface UserPrintJobEvent {
  type: "user:print:job";
  jobId: number;
  queueName: string;
}

export interface UserPrintTransactionEvent {
  type: "user:print:transaction";
  queueName: string;
}

export interface UserCancleTransactionEvent {
  type: "user:cancel:transaction";
}

export interface UserCancleJobEvent {
  type: "user:cancel:job";
  jobId: number;
}

export interface UserRetryJobEvent {
  type: "user:retry:job";
  jobId: number;
}

export interface UserMarkAsCompleteEvent {
  type: "user:mark:complete";
  jobId: number;
}

export interface TransactionRequestEvent {
  type: "transaction:request";
}

export interface TransactionResponseEvent {
  type: "transaction:response";
  response: FindTransactionResponseDto[];
}

export interface PrintTransactionReportSuccessEvent {
  type: "transaction:report:success";
}

export interface NewTransactionEvent {
  type: "transaction:new";
}

export interface UserGetQrCodeEvent {
  type: "user:get-qr-code";
  qrDataUrl: string;
  printIntent: boolean;
}

export interface UserQrCodeGenerateSuccessEvent {
  type: "user:get-qr-code:success";
  path: string;
  printIntent: boolean;
}

export interface UserQrCodeGenerateErrorEvent {
  type: "user:get-qr-code:error";
}

export interface UserRejectTransactionEvent {
  type: "user:reject:transaction";
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
  queueName: string;
}

export interface PrintJobMonitoringErrorEvent {
  type: "job:monitoring:error";
  jobId: number;
  printJobIdentifier: number;
  queueName: string;
  reason?: string[];
}

export interface PrintJobStatusPolledEvent {
  type: "job:status:polled";
  jobId: number;
  queueName: string;
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
  queueName: string;
  printJobIdentifier: number;
}

export interface PrintJobReportSuccessEvent {
  type: "job:report:success";
  jobId: number;
  queueName: string;
}

export interface PrintJobFailedEvent {
  type: "job:disappear";
  jobId: number;
  queueName: string;
  printJobIdentifier: number;
  reason?: string[];
}

export interface PrintJobTimeoutEvent {
  type: "job:timeout";
  jobId: number;
  queueName: string;
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
  queueName: string;
}

export interface PrintJobAcceptedEvent {
  type: "job:accepted";
  queueName: string;
  jobId: number;
  printJobIdentifier: number;
  totalPages: number;
}

export interface PrintJobCriticalEvent {
  type: "job:critical";
  jobId: number;
  queueName: string;
  printJobIdentifier: number;
  statuses: PrintJobStatusDto[];
}

export interface PrintJobBlockedEvent {
  type: "job:blocked";
  jobId: number;
  queueName: string;
  printJobIdentifier: number;
  statuses: PrintJobStatusDto[];
}

export interface PrintJobIncompleteEvent {
  type: "job:incomplete";
  jobId: number;
  queueName: string;
  printJobIdentifier: number;
  pagesPrinted: number;
  totalPages: number;
}

export interface StartDownloadFilesToFileSystem {
  type: "start:download-files-to-file-system";
  jobId: number;
}

export interface StartInitializeJobMonitoring {
  type: "start:initialize-job-monitoring";
  queueName: string;
  jobId: number;
  printJobIdentifier: number;
}

export interface StartSpoolFilesToFileSystem {
  type: "start:spool-files-to-printer";
  jobId: number;
  queueName: string;
}
