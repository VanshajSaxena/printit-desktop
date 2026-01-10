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
        draft.transactions[event.transactionId] = {
          id: event.transactionId,
          status: "new",
          jobs: event.jobs,
          currentJob: event.jobs[0],
        };
      });
      break;

    case "user:print": {
      const operationId = generateOperationId();
      nextState = produce(state, (draft) => {
        draft.transactions[event.transactionId].status = "printing";
      });
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
