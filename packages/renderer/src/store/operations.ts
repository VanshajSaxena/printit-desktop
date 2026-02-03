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
  | SendFilesToPrinterOperation
);

export interface DownloadFilesOperation {
  type: "download-files-to-file-system";
  files: { id: number }[];
}

export interface FetchTransactionOperation {
  type: "fetch-transactions";
}

export interface SendFilesToPrinterOperation {
  type: "spool-files-to-printer";
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
