import type {
  PrintQueue,
  PrintQueueStatus,
  StatusType,
  TransactionState,
  TransactionStore,
} from "@/store/structure";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const selectDefaultQueue = (state: TransactionStore) =>
  Object.values(state.state.printQueues).find((q) => q.default);

export function getPrintQueueStatus(
  printQueue: PrintQueue,
  transactions: TransactionState["transactions"],
): PrintQueueStatus {
  const statuses = printQueue.items
    .map((item) => {
      const transaction = transactions[item.transactionId];

      return transaction.jobs.find((job) => job.id === item.jobId)?.status;
    })
    .filter(Boolean) as StatusType[];

  if (statuses.some((s) => s === "CRITICAL" || s === "ERROR")) {
    return "error";
  }

  if (
    statuses.some(
      (s) => s === "TIMEOUT" || s === "DISAPPEARED" || s === "INCOMPLETE",
    )
  ) {
    return "stalled";
  }

  if (statuses.some((s) => s === "PRINTING")) {
    return "printing";
  }

  if (statuses.some((s) => s === "SPOOLED")) {
    return "spooled";
  }

  if (
    statuses.some((s) =>
      ["PENDING", "QUEUED", "DOWNLOADING", "READY"].includes(s),
    )
  ) {
    return "working";
  }

  return "idle";
}
