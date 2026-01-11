import { produce } from "immer";
import type { TransactionEvent, TransactionState } from "./events";
import type { TransactionOperation } from "./operations";

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
      // __AUTO_GENERATED_PRINT_VAR_START__
      console.log("reducer event.type:", event.type); // __AUTO_GENERATED_PRINT_VAR_END__
      const operationId = generateOperationId();
      operations.push({
        operationId,
        type: "fetch-transactions",
      });
      break;
    }
    case "transaction:response": {
      // __AUTO_GENERATED_PRINT_VAR_START__
      console.log("reducer event.type:", event.type); // __AUTO_GENERATED_PRINT_VAR_END__
      nextState = produce(state, (draft) => {
        event.response.forEach((transaction) => {
          draft.transactions[transaction.id] ??= transaction;
        });
      });
      break;
    }
    case "transaction:new":
      // __AUTO_GENERATED_PRINT_VAR_START__
      console.log("reducer event.type:", event.type); // __AUTO_GENERATED_PRINT_VAR_END__
      break;
    case "user:print": {
      // __AUTO_GENERATED_PRINT_VAR_START__
      console.log("reducer event.type:", event.type); // __AUTO_GENERATED_PRINT_VAR_END__
      const operationId = generateOperationId();
      nextState = produce(state, (draft) => {
        draft.transactions[event.transactionId].status = "QUEUED";
      });
      operations.push({
        operationId,
        type: "download-files",
        files: state.transactions[event.transactionId].jobs.map((job) => {
          return { id: job.document.id };
        }),
        transactionId: event.transactionId,
      });
      break;
    }

    case "files:download:started": {
      // __AUTO_GENERATED_PRINT_VAR_START__
      console.log("reducer event.type:", event.type); // __AUTO_GENERATED_PRINT_VAR_END__
      nextState = produce(state, (draft) => {
        draft.transactions[event.transactionId].status = "DOWNLOADING";
      });
      break;
    }

    case "files:download:progress":
      // __AUTO_GENERATED_PRINT_VAR_START__
      console.log("reducer event.type:", event.type); // __AUTO_GENERATED_PRINT_VAR_END__
      break;

    case "files:download:completed": {
      // __AUTO_GENERATED_PRINT_VAR_START__
      console.log("reducer event.type:", event.type); // __AUTO_GENERATED_PRINT_VAR_END__
      nextState = produce(state, (draft) => {
        draft.transactions[event.transactionId].jobs.map((job) => {
          job.document.filePath = event.downloadedFiles.find(
            (file) => file.id === job.document.id,
          )?.filePath;
        });
        draft.transactions[event.transactionId].status = "DOWNLOADED";
      });
      break;
    }

    default: {
      break;
    }
  }

  return [nextState, operations];
};
