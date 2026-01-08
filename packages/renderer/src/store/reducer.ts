import { produce } from "immer";
import type {
  TransactionEvent,
  TransactionOperation,
  TransactionState,
} from "./types";

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
