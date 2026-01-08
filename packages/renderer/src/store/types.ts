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

export type TransactionEvent =
  | NewTransactionEvent
  | UserSendToPrinterEvent
  | FilesDownloadStartedEvent
  | FilesDownloadProgressEvent
  | FilesDownloadCompletedEvent;

interface DownloadFilesOperation {
  type: "download-files";
  files: { id: number }[];
}
interface PrintDocumentsOperation {
  type: "print-documents";
}

interface OperationWithId {
  operationId: string;
}

export type OperationUnion = DownloadFilesOperation | PrintDocumentsOperation;

export type TransactionOperation = OperationUnion & OperationWithId;
