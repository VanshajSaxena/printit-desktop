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

export interface TransactionObject extends FindTransactionResponseDto {
  currentJob?: number;
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
}

export interface FilesDownloadErrorEvent {
  type: "files:download:error";
  reason:
    | "presigned-url-fetch-failed"
    | "download-manager-threw-during-download";
}
