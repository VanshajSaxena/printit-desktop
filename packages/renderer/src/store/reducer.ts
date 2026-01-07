import { produce } from "immer";
import type {
  TransactionObject,
  TransactionState,
} from "./useTransactionStore";

export type TransactionEvent =
  | { type: "transaction:new"; transaction: TransactionObject }
  | { type: "user:print"; files: { id: number }[] };

export type TransactionOperation =
  | { type: "files:download"; files: { id: number }[] }
  | { type: "print-documents" }
  | { type: "error" };

export const reducer = (
  transactionState: TransactionState,
  event: TransactionEvent,
): [TransactionState, TransactionOperation[]] => {
  const operations: TransactionOperation[] = [];

  const nextState = produce(transactionState, (draft) => {
    switch (event.type) {
      case "transaction:new": {
        draft.transactions.push(event.transaction);
        break;
      }
      case "user:print": {
        operations.push({ type: "files:download", files: event.files });
        break;
      }

      default: {
        operations.push({ type: "error" });
      }
    }
  });
  return [nextState, operations];
};
