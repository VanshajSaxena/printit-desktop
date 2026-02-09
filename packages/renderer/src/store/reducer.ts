import { produce } from "immer";
import type { PrintQueueItem, ReducerEvent, TransactionState } from "./events";
import type { TransactionOperation } from "./operations";

function generateOperationId() {
  return crypto.randomUUID().slice(0, 8);
}

function generateQueueItemId() {
  return crypto.randomUUID();
}

export const reducer = (
  state: TransactionState,
  event: ReducerEvent,
): [TransactionState, TransactionOperation[]] => {
  let nextState = state;
  const operations: TransactionOperation[] = [];
  switch (event.type) {
    case "transaction:request": {
      operations.push({
        operationId: generateOperationId(),
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
    case "user:print:transaction": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const queueItems: PrintQueueItem[] = transaction.jobs.map((job) => ({
          id: generateQueueItemId(),
          transactionId: event.transactionId,
          jobId: job.id,
          queuedAt: new Date().toISOString(),
        }));
        draft.printQueue.items.push(...queueItems);
        draft.transactions[event.transactionId].status = "QUEUED";
        draft.transactions[event.transactionId].jobs.forEach((job) => {
          if (job.status === "PENDING") {
            job.status = "QUEUED";
          }
        });
      });
      operations.push({
        operationId: generateOperationId(),
        type: "download-files-to-file-system",
        files: state.transactions[event.transactionId].jobs.map((job) => {
          return { id: job.document.id };
        }),
        transactionId: event.transactionId,
      });
      break;
    }

    case "files:download:started:all": {
      nextState = produce(state, (draft) => {
        draft.transactions[event.transactionId].status = "DOWNLOADING";
      });
      break;
    }

    case "files:download:progress:all":
      break;

    case "files:download:completed:all": {
      nextState = produce(state, (draft) => {
        draft.transactions[event.transactionId].jobs.forEach((job) => {
          job.document.filePath = event.downloadedFiles.find(
            (file) => file.id === job.document.id,
          )?.filePath;
        });
        draft.transactions[event.transactionId].status = "DOWNLOADED";
        draft.transactions[event.transactionId].jobs.forEach(
          (job) => (job.status = "DOWNLOADED"),
        );
      });

      const job = nextState.transactions[event.transactionId].jobs.find(
        (job) => job.status === "DOWNLOADED",
      );

      if (job) {
        operations.push({
          operationId: generateOperationId(),
          type: "spool-files-to-printer",
          transactionId: event.transactionId,
          job,
        });
      }
      break;
    }

    default: {
      break;
    }
  }

  return [nextState, operations];
};
