import type {
  OutputColorDto,
  PrintJobStatusDto,
} from "@app/common/gen/types/print-service-api-types";
import type { ReducerEvent } from "./events";

export interface TransactionStore {
  state: TransactionState;
  dispatch: (event: ReducerEvent) => void;
}

export interface TransactionState {
  transactions: Record<TransactionObject["id"], TransactionObject>;
  printQueues: Record<string, PrintQueue>;
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
    isCritical: boolean;
    criticalStatuses: PrintJobStatusDto[];
    timedOut: boolean;
    timeoutAt?: string;
  };
}

export interface TransactionObject {
  id: number;
  createdAt: string;
  friendlyId: string;
  status: StatusType;
  jobs: {
    id: number;
    status: StatusType;
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
  }[];
}

/**
 * Represents the lifecycle state of a print job.
 *
 * States:
 * - PENDING - New or untouched
 * - QUEUED - Print intent captured
 * - DOWNLOADING - File is being downloaded (UI-specific state)
 * - READY - Downloaded and ready to be spooled
 * - SPOOLED - Accepted by the print queue
 * - PRINTING - Printing in progress (inferred)
 * - REJECTED - Explicit user rejection
 * - INCOMPLETE - Document not fully printed
 * - COMPLETED - Successfully printed
 * - TIMEOUT - Printing timedout
 * - DISAPPEAR - Print job disappeared
 * - ERROR - Recoverable error state
 * - CRITICAL - Unrecoverable printer error, requires human intervention
 */
export type StatusType =
  | "PENDING"
  | "QUEUED"
  | "DOWNLOADING"
  | "READY"
  | "SPOOLED"
  | "PRINTING"
  | "REJECTED"
  | "INCOMPLETE"
  | "COMPLETED"
  | "TIMEOUT"
  | "DISAPPEARED"
  | "ERROR"
  | "CRITICAL";

export interface WithTransactionId {
  transactionId: number;
}

export type ReportingStatus = Exclude<
  StatusType,
  | "INCOMPLETE"
  | "DOWNLOADING"
  | "READY"
  | "SPOOLED"
  | "TIMEOUT"
  | "DISAPPEARED"
  | "CRITICAL"
>;
