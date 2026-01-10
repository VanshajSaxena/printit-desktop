import { produce } from "immer";
import type {
  TransactionEvent,
  TransactionOperation,
  TransactionState,
} from "./types";

function generateOperationId() {
  return crypto.randomUUID().slice(0, 8);
}

export const reducer = (
  state: TransactionState,
  event: TransactionEvent,
): [TransactionState, TransactionOperation[]] => {
  let nextState = state;
  const operations: TransactionOperation[] = [];
  switch (event.type) {
    case "transaction:new":
      nextState = produce(state, (draft) => {
        draft.transactions[event.transaction.id] = event.transaction;
      });
      break;

    case "user:print": {
      const operationId = generateOperationId();
      operations.push({
        operationId,
        type: "download-files",
        transactionId: event.transactionId,
        files: event.files,
      });
      break;
    }

    case "files:download:started": {
      break;
    }

    case "files:download:progress":
      break;

    case "files:download:completed":
      break;

    default: {
      break;
    }
  }

  return [nextState, operations];
};
