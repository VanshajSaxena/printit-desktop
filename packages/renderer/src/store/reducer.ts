import { produce } from "immer";
import type { TransactionEvent, TransactionState } from "./event.types";
import type { TransactionOperation } from "./operation.types";

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
    case "transaction:request": {
      const operationId = generateOperationId();
      operations.push({
        operationId,
        type: "fetch-transactions",
      });
      break;
    }
    case "transaction:response": {
      nextState = produce(state, (draft) => {
        event.response.forEach((transaction) => {
          draft.transactions[transaction.id] ??= transaction;
        });
      });
      break;
    }
    case "transaction:new":
      break;

    case "user:print": {
      const operationId = generateOperationId();
      nextState = produce(state, (draft) => {
        draft.transactions[event.transactionId].status = "PRINTING";
      });
      operations.push({
        operationId,
        type: "download-files",
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
