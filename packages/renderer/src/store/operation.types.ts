export interface TransactionOperationBase {
  operationId: string;
}
export type TransactionOperation = TransactionOperationUnion &
  TransactionOperationBase;
export type TransactionOperationUnion =
  | FetchTransactionOperation
  | DownloadFilesOperation
  | PrintDocumentsOperation;

export interface DownloadFilesOperation {
  type: "download-files";
  files: { id: number }[];
}

export interface FetchTransactionOperation {
  type: "fetch-transactions";
}

export interface PrintDocumentsOperation {
  type: "print-documents";
}
