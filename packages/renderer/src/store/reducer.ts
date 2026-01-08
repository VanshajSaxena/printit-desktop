import { produce } from "immer";
import type {
  TransactionObject,
  TransactionState,
} from "./useTransactionStore";

export type TransactionEvent =
  | { type: "transaction:new"; transaction: TransactionObject }
  | { type: "user:print"; files: { id: number }[] }
  | { type: "files:download:started" };

export type TransactionOperation =
  | { type: "files:download"; files: { id: number }[] }
  | { type: "print-documents" }
  | { type: "error" };

export const reducer = (
  state: TransactionState,
  event: TransactionEvent,
): [TransactionState, TransactionOperation[]] => {
  let nextState = state;
  const operations: TransactionOperation[] = [];
  switch (event.type) {
    case "transaction:new":
      nextState = produce(state, (draft) => {
        draft.transactions.push(event.transaction);
      });
      break;

    case "user:print":
      operations.push({ type: "files:download", files: event.files });
      break;

    case "files:download:started":
      break;

    default:
      operations.push({ type: "error" });
      break;
  }

  return [nextState, operations];
};
