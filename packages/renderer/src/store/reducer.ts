import { produce } from "immer";
import type {
  TransactionObject,
  TransactionState,
} from "./useTransactionStore";

type TransactionEvent =
  | { type: "transaction:new"; transaction: TransactionObject }
  | { type: "user:print" };

type TransactionOperation =
  | { type: "download-files"; urls: { id: number; url: string }[] }
  | { type: "print-documents" }
  | { type: "error" };

export const transactionReducer = (
  transactionState: TransactionState,
  event: TransactionEvent,
): [TransactionState, TransactionOperation[]] => {
  const operations: TransactionOperation[] = [];

  const nextState = produce(transactionState, (draft) => {
    switch (event.type) {
      case "transaction:new": {
        draft.transactions.push(event.transaction);
        operations.push({
          type: "download-files",
          urls: [{ id: 1, url: "someurl.com" }],
        });
        break;
      }

      case "user:print": {
        operations.push({ type: "print-documents" });
        break;
      }

      default: {
        operations.push({ type: "error" });
      }
    }
  });
  return [nextState, operations];
};
