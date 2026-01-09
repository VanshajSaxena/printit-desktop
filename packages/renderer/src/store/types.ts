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
  transactionId: number;
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

export type TransactionEvent =
  | NewTransactionEvent
  | UserSendToPrinterEvent
  | FilesDownloadStartedEvent
  | FilesDownloadProgressEvent
  | FilesDownloadCompletedEvent
  | FilesDownloadErrorEvent;

export interface DownloadFilesOperation {
  type: "download-files";
  transactionId: number;
  files: { id: number }[];
}

export interface PrintDocumentsOperation {
  type: "print-documents";
}

export interface OperationBase {
  operationId: string;
}

export type OperationUnion = DownloadFilesOperation | PrintDocumentsOperation;

export type TransactionOperation = OperationUnion & OperationBase;
