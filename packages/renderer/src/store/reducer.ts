import { produce } from "immer";
import type {
  TransactionEvent,
  TransactionEffect,
  TransactionState,
} from "./types";

export const reducer = (
  state: TransactionState,
  event: TransactionEvent,
): [TransactionState, TransactionEffect[]] => {
  let nextState = state;
  const operations: TransactionEffect[] = [];
  switch (event.type) {
    case "transaction:new":
      nextState = produce(state, (draft) => {
        draft.transactions.push(event.transaction);
      });
      break;

    case "user:print":
      operations.push({ type: "download-files", files: event.files });
      break;

    case "files:download:started":
      break;

    case "files:download:progress":
      break;

    case "files:download:completed":
      break;

    default: {
      operations.push({ type: "error" });
      break;
    }
  }

  return [nextState, operations];
};
