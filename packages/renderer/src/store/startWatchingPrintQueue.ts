import log from "electron-log/renderer";
import type { ReducerEvent } from "./events";
import type { PrintQueue, TransactionObject } from "./structure";
import { useTransactionStore } from "./useTransactionStore";

export function startWatchingPrintQueue() {
  log.debug("startWatchingPrintQueue ran");
  const unsubscribe = useTransactionStore.subscribe(
    (store) => store.state,
    ({ printQueues, transactions }) => {
      const { dispatch } = useTransactionStore.getState();

      Object.entries(printQueues).forEach(([queueName, queue]) => {
        processQueue(queueName, queue, transactions, dispatch);
      });
    },
  );

  return unsubscribe;
}

function processQueue(
  queueName: string,
  queue: PrintQueue,
  transactions: Record<number, TransactionObject>,
  dispatch: (event: ReducerEvent) => void,
) {
  if (queue.status === "error" || queue.status === "stalled") return;
  if (queue.items.length === 0) return;
  log.debug("processQueue ran for queue: ", queueName);

  const firstItem = queue.items[0];

  const firstStatus = transactions[firstItem.transactionId].jobs.find(
    (job) => job.id === firstItem.jobId,
  )?.status;
  log.debug("First Item Status: ", firstStatus);

  if (queue.status === "idle" || queue.status === "working") {
    if (firstStatus === "QUEUED") {
      dispatch({
        type: "start:download-files-to-file-system",
        transactionId: firstItem.transactionId,
        jobId: firstItem.jobId,
      });
    }
    if (firstStatus === "READY") {
      dispatch({
        type: "start:spool-files-to-printer",
        transactionId: firstItem.transactionId,
        jobId: firstItem.jobId,
        queueName,
      });
    }
  }

  if (queue.items.length === 1) return;

  const secondItem = queue.items[1];
  const secondStatus = transactions[secondItem.transactionId].jobs.find(
    (job) => job.id === secondItem.jobId,
  )?.status;
  log.debug("Second Item Status: ", secondStatus);

  if (queue.status === "idle" || queue.status === "working") {
    if (secondStatus === "QUEUED") {
      dispatch({
        type: "start:download-files-to-file-system",
        transactionId: secondItem.transactionId,
        jobId: secondItem.jobId,
      });
    }
  }
}
