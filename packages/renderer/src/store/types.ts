export type TransactionEventUnion =
  | NewTransactionEvent
  | UserSendToPrinterEvent
  | FilesDownloadStartedEvent
  | FilesDownloadProgressEvent
  | FilesDownloadCompletedEvent
  | FilesDownloadErrorEvent;

export type TransactionOperationUnion =
  | DownloadFilesOperation
  | PrintDocumentsOperation;

export type TransactionEvent = TransactionEventUnion & TransactionEventBase;
export type TransactionOperation = TransactionOperationUnion &
  TransactionOperationBase;

export interface TransactionEventBase {
  transactionId: number;
}

export interface TransactionOperationBase {
  transactionId: number;
  operationId: string;
}

export interface TransactionObject {
  id: number;
}

export interface TransactionState {
  transactions: Record<number, TransactionObject>;
}

export interface TransactionStore {
  state: TransactionState;
  dispatch: (event: TransactionEvent) => void;
}

export interface NewTransactionEvent {
  type: "transaction:new";
  transaction: TransactionObject;
}

export interface UserSendToPrinterEvent {
  type: "user:print";
  files: { id: number }[];
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

export interface DownloadFilesOperation {
  type: "download-files";
  files: { id: number }[];
}

export interface PrintDocumentsOperation {
  type: "print-documents";
}
