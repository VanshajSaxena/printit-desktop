import { produce } from "immer";
import type { PrintQueueItem, ReducerEvent, TransactionState } from "./events";
import type { TransactionOperation } from "./operations";

function generateOperationId() {
  return crypto.randomUUID().slice(0, 8);
}

function generateQueueItemId() {
  return crypto.randomUUID();
}
function getvendorId() {
  return 1;
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

    case "user:qr:generate-pdf": {
      operations.push({
        operationId: generateOperationId(),
        type: "generate-qr-code-pdf",
        qrDataUrl: event.qrDataUrl,
      });
      break;
    }
    case "user:qr:print": {
      // TODO: after user:qr:generate-pdf
      break;
    }
    case "user:reject:transaction": {
      nextState = produce(state, (draft) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete draft.transactions[event.transactionId];
      });
      break;
    }
    case "user:print:transaction": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const queueItems: PrintQueueItem[] = transaction.jobs
          .filter((job) => job.status === "PENDING")
          .map((job) => ({
            id: generateQueueItemId(),
            transactionId: event.transactionId,
            jobId: job.id,
            queuedAt: new Date().toISOString(),
          }));
        draft.printQueue.items.push(...queueItems);
        if (draft.printQueue.status === "idle") {
          draft.printQueue.status = "working";
        }
        draft.transactions[event.transactionId].status = "QUEUED";
        draft.transactions[event.transactionId].jobs
          .filter((job) => job.status === "PENDING")
          .forEach((job) => {
            job.status = "QUEUED";
          });
      });
      operations.push({
        operationId: generateOperationId(),
        type: "download-files-to-file-system",
        files: nextState.transactions[event.transactionId].jobs
          .filter((job) => job.status === "QUEUED")
          .map((job) => {
            return { id: job.document.id };
          }),
        transactionId: event.transactionId,
      });
      operations.push({
        operationId: generateOperationId(),
        type: "emit-user-print-intent",
        vendorId: getvendorId(),
        transactionId: event.transactionId,
      });
      break;
    }

    case "files:download:started:all": {
      nextState = produce(state, (draft) => {
        draft.transactions[event.transactionId].status = "DOWNLOADING";
        draft.transactions[event.transactionId].jobs
          .filter((job) => job.status === "QUEUED")
          .forEach((job) => (job.status = "DOWNLOADING"));
      });
      break;
    }

    case "files:download:progress:all":
      break;

    case "files:download:completed:all": {
      nextState = produce(state, (draft) => {
        draft.transactions[event.transactionId].jobs
          .filter((job) => job.status === "DOWNLOADING")
          .forEach((job) => {
            job.document.filePath = event.downloadedFiles.find(
              (file) => file.id === job.document.id,
            )?.filePath;
          });
        draft.transactions[event.transactionId].status = "READY";
        draft.transactions[event.transactionId].jobs
          .filter((job) => job.status === "DOWNLOADING")
          .forEach((job) => (job.status = "READY"));
      });

      const readyItem = nextState.printQueue.items.find((item) => {
        const jobItem = nextState.transactions[item.transactionId].jobs.find(
          (job) => job.id === item.jobId,
        );
        return jobItem?.status === "READY";
      });

      if (
        nextState.printQueue.status !== "error" &&
        nextState.printQueue.status !== "stalled" &&
        readyItem
      ) {
        const readyJob = nextState.transactions[
          readyItem.transactionId
        ].jobs.find((job) => job.id === readyItem.jobId);
        if (readyJob) {
          operations.push({
            operationId: generateOperationId(),
            type: "spool-files-to-printer",
            transactionId: readyItem.transactionId,
            job: readyJob,
          });
        }
      }
      break;
    }

    case "file:spooled:success": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((j) => j.id === event.jobId);

        if (job && event.printJobInfo) {
          job.status = "SPOOLED";
          job.printJobIdentifier = event.printJobInfo.jobIdentifier;
          job.printerName = event.printerName;
          job.spooledAt = new Date().toISOString();
        }
      });

      if (event.printJobInfo) {
        operations.push({
          operationId: generateOperationId(),
          type: "start-job-monitoring",
          transactionId: event.transactionId,
          jobId: event.jobId,
          printJobIdentifier: event.printJobInfo.jobIdentifier,
          printerName: event.printerName,
          pollingIntervalMs: 1500,
          timeoutMs: 30_000,
        });
      }
      break;
    }

    case "job:monitoring:started": {
      nextState = produce(state, (draft) => {
        const queueItem = draft.printQueue.items.find(
          (item) =>
            item.jobId === event.jobId &&
            item.transactionId === event.transactionId,
        );

        if (queueItem) {
          queueItem.monitoring = {
            isActive: true,
            lastPolledAt: new Date().toISOString(),
            pagesPrinted: 0,
            hasError: false,
            errorStatuses: [],
            isBlocked: false,
            blockedStatuses: [],
            timedOut: false,
          };
        }
      });
      break;
    }

    case "job:status:polled": {
      nextState = produce(state, (draft) => {
        const queueItem = draft.printQueue.items.find(
          (item) =>
            item.jobId === event.jobId &&
            item.transactionId === event.transactionId,
        );

        if (queueItem?.monitoring) {
          queueItem.monitoring.lastPolledAt = new Date().toISOString();
          queueItem.monitoring.lastKnownStatus = event.statuses;
          queueItem.monitoring.pagesPrinted = event.numberOfPagesPrinted;
        }

        if (draft.printQueue.status === "spooled") {
          const hasActivity = event.statuses.some(
            (status) =>
              status === "Printing" ||
              status === "Completed" ||
              event.numberOfPagesPrinted > 0,
          );

          if (hasActivity) {
            draft.printQueue.status = "printing";
            draft.transactions[event.transactionId].status = "PRINTING";
            const job = draft.transactions[event.transactionId].jobs.find(
              (job) => job.id === event.jobId,
            );
            if (job) {
              job.status = "PRINTING";
            }
          }
        }
      });

      if (
        nextState.printQueue.status === "printing" ||
        nextState.printQueue.status === "working"
      ) {
        operations.push({
          operationId: generateOperationId(),
          type: "emit-transaction-printing",
          vendorId: getvendorId(),
          transactionId: event.transactionId,
        });
      }
      break;
    }

    case "job:accepted": {
      nextState = produce(state, (draft) => {
        if (draft.printQueue.status === "working") {
          draft.printQueue.status = "spooled";
        }
      });
      break;
    }

    case "job:error": {
      nextState = produce(state, (draft) => {
        const queueItem = draft.printQueue.items.find(
          (item) =>
            item.jobId === event.jobId &&
            item.transactionId === event.transactionId,
        );

        if (queueItem?.monitoring) {
          queueItem.monitoring.hasError = true;
          queueItem.monitoring.errorStatuses = event.statuses;
        }
      });
      break;
    }

    case "job:blocked": {
      nextState = produce(state, (draft) => {
        const queueItem = draft.printQueue.items.find(
          (item) =>
            item.jobId === event.jobId &&
            item.transactionId === event.transactionId,
        );

        if (queueItem?.monitoring) {
          queueItem.monitoring.isBlocked = true;
          queueItem.monitoring.blockedStatuses = event.statuses;
          queueItem.monitoring.hasError = true;
          queueItem.monitoring.errorStatuses = event.statuses;
        }
      });
      break;
    }

    case "job:timeout": {
      nextState = produce(state, (draft) => {
        const queueItem = draft.printQueue.items.find(
          (item) =>
            item.jobId === event.jobId &&
            item.transactionId === event.transactionId,
        );

        if (queueItem?.monitoring) {
          queueItem.monitoring.timedOut = true;
          queueItem.monitoring.timeoutAt = new Date().toISOString();
        }
      });
      break;
    }

    case "job:completed": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((j) => j.id === event.jobId);

        if (job) {
          job.status = "COMPLETED";
          job.completedAt = new Date().toISOString();
        }

        draft.printQueue.items = draft.printQueue.items.filter(
          (item) =>
            !(
              item.jobId === event.jobId &&
              item.transactionId === event.transactionId
            ),
        );

        const allJobsCompleted = transaction.jobs.every(
          (j) => j.status === "COMPLETED",
        );
        if (allJobsCompleted) {
          transaction.status = "COMPLETED";
        }

        if (draft.printQueue.items.length === 0) {
          draft.printQueue.status = "idle";
        } else {
          draft.printQueue.status = "working";
        }
      });

      const canContinue =
        nextState.printQueue.status !== "error" &&
        nextState.printQueue.status !== "stalled" &&
        nextState.printQueue.items.length > 0;

      if (canContinue) {
        const nextItem = nextState.printQueue.items[0];
        const nextTransaction = nextState.transactions[nextItem.transactionId];
        const nextJob = nextTransaction.jobs.find(
          (j) => j.id === nextItem.jobId,
        );

        if (nextJob?.status === "READY") {
          operations.push({
            operationId: generateOperationId(),
            type: "spool-files-to-printer",
            transactionId: nextItem.transactionId,
            job: nextJob,
          });
        }
      }

      const transaction = nextState.transactions[event.transactionId];
      if (transaction.status === "COMPLETED") {
        operations.push({
          operationId: generateOperationId(),
          type: "report-transaction-and-jobs-status",
          transactionId: event.transactionId,
          status: "COMPLETED",
          timestamp: new Date().toISOString(),
        });
      }

      break;
    }

    case "job:incomplete": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((j) => j.id === event.jobId);

        if (job) {
          job.status = "INCOMPLETE";
          job.failedAt = new Date().toISOString();
        }

        draft.printQueue.items = draft.printQueue.items.filter(
          (item) =>
            !(
              item.jobId === event.jobId &&
              item.transactionId === event.transactionId
            ),
        );

        draft.printQueue.status = "stalled";

        const hasIncomplete = transaction.jobs.some(
          (j) => j.status === "INCOMPLETE",
        );
        if (hasIncomplete) {
          transaction.status = "INCOMPLETE";
        }
      });
      break;
    }

    case "job:failed": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((j) => j.id === event.jobId);

        if (job) {
          job.status = "ERROR";
          job.failedAt = new Date().toISOString();
        }

        draft.printQueue.items = draft.printQueue.items.filter(
          (item) =>
            !(
              item.jobId === event.jobId &&
              item.transactionId === event.transactionId
            ),
        );

        draft.printQueue.status = "error";

        const hasError = transaction.jobs.some((j) => j.status === "ERROR");
        if (hasError) {
          transaction.status = "ERROR";
        }
      });

      break;
    }

    case "transaction:report:success": {
      nextState = produce(state, (draft) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete draft.transactions[event.transactionId];
      });
      break;
    }

    case "job:report:success": {
      nextState = produce(state, (draft) => {
        draft.printQueue.items = draft.printQueue.items.filter(
          (item) =>
            !(
              item.jobId === event.jobId &&
              item.transactionId === event.transactionId
            ),
        );
      });
      break;
    }

    case "job:not-found": {
      // left intentionally
      break;
    }
    default: {
      break;
    }
  }

  return [nextState, operations];
};
