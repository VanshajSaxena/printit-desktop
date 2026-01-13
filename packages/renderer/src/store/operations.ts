export interface TransactionOperationBase {
  operationId: string;
}
export type TransactionOperation = (
  | FetchTransactionOperation
  | TransactionOperationUnion
) &
  TransactionOperationBase;

export type TransactionOperationUnion = { transactionId: number } & (
  | DownloadFilesOperation
  | PrintDocumentsOperation
);

export interface DownloadFilesOperation {
  type: "download-files";
  files: { id: number }[];
}

export interface FetchTransactionOperation {
  type: "fetch-transactions";
}

export interface PrintDocumentsOperation {
  type: "print-file";
  job: {
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
  };
}
