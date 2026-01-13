import type { FindTransactionResponseDto } from "@api/gen/cloud-api-types";

export type TransactionEventUnion =
  | NewTransactionEvent
  | UserSendToPrinterEvent
  | FilesDownloadStartedEvent
  | FilesDownloadProgressEvent
  | FilesDownloadCompletedEvent
  | FilesDownloadErrorEvent;

export type TransactionEvent =
  | TransactionRequestEvent
  | TransactionResponseEvent
  | (TransactionEventUnion & TransactionEventBase);

export interface TransactionEventBase {
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
    | "DOWNLOADED"
    | "SPOOLED"
    | "PRINTING"
    | "COMPLETED"
    | "ERROR";
  jobs: {
    id: number;
    status:
      | "PENDING"
      | "QUEUED"
      | "DOWNLOADING"
      | "DOWNLOADED"
      | "SPOOLED"
      | "PRINTING"
      | "COMPLETED"
      | "ERROR";
    document: {
      filePath?: string;
      contentType: string;
      filename: string;
      id: number;
    };
    copyCount: number;
    outputColor: "COLOR" | "MONOCHROME" | "GRAYSCALE";
  }[];
}

export interface TransactionState {
  transactions: Record<number, TransactionObject>;
}

export interface TransactionStore {
  state: TransactionState;
  dispatch: (event: TransactionEvent) => void;
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
  type: "user:print";
}

export interface FilesDownloadStartedEvent {
  type: "files:download:started";
}

export interface FilesDownloadProgressEvent {
  type: "files:download:progress";
}

export interface FilesDownloadCompletedEvent {
  type: "files:download:completed";
  downloadedFiles: {
    id: number;
    filePath: string;
  }[];
}

export interface FilesDownloadErrorEvent {
  type: "files:download:error";
  reason:
    | "presigned-url-fetch-failed"
    | "download-manager-threw-during-download";
}
