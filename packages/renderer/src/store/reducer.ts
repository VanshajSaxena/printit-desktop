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
        if (draft.printQueue.status === "idle") {
          draft.printQueue.status = "working";
        }
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
        draft.transactions[event.transactionId].jobs.forEach(
          (job) => (job.status = "DOWNLOADING"),
        );
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
        draft.transactions[event.transactionId].status = "READY";
        draft.transactions[event.transactionId].jobs.forEach(
          (job) => (job.status = "READY"),
        );
      });

      const readyItem = nextState.printQueue.items.find((item) => {
        const jobItem = nextState.transactions[item.transactionId].jobs.find(
          (job) => job.id === item.jobId,
        );
        return jobItem?.status === "READY";
      });

      if (nextState.printQueue.status === "working" && readyItem) {
        const readyJob = nextState.transactions[
          readyItem.transactionId
        ].jobs.find((job) => job.id === readyItem.jobId);
        if (!readyJob) {
          break;
        }
        operations.push({
          operationId: generateOperationId(),
          type: "spool-files-to-printer",
          transactionId: readyItem.transactionId,
          job: readyJob,
        });
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
          type: "start-print-job-monitoring",
          transactionId: event.transactionId,
          jobId: event.jobId,
          printJobIdentifier: event.printJobInfo.jobIdentifier,
          printerName: event.printerName,
          pollingIntervalMs: 1500,
          timeoutMs: 5000,
        });
      }
      break;
    }

    // reducer.ts

    case "print-job:monitoring:started": {
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

    case "print-job:status:polled": {
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
      });
      break;
    }

    case "print-job:accepted": {
      nextState = produce(state, (draft) => {
        // Job accepted means spooler processed it and knows page count
        // Transition queue to "printing" since active processing started
        if (draft.printQueue.status === "working") {
          draft.printQueue.status = "printing";
        }
      });
      break;
    }

    case "print-job:error": {
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

        // Don't change job status - error might be recoverable
        // Don't change queue status - keep monitoring
      });
      break;
    }

    case "print-job:blocked": {
      nextState = produce(state, (draft) => {
        const queueItem = draft.printQueue.items.find(
          (item) =>
            item.jobId === event.jobId &&
            item.transactionId === event.transactionId,
        );

        if (queueItem?.monitoring) {
          // Track blocked in error statuses
          queueItem.monitoring.isBlocked = true;
          queueItem.monitoring.blockedStatuses = event.statuses;
        }

        // Don't change job status - blocked is recoverable
      });
      break;
    }

    case "print-job:timeout": {
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

        // Don't change statuses - timeout doesn't mean failure yet
      });
      break;
    }

    case "print-job:completed": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((j) => j.id === event.jobId);

        if (job) {
          job.status = "COMPLETED";
          job.completedAt = new Date().toISOString();
        }

        // Remove completed item from queue
        draft.printQueue.items = draft.printQueue.items.filter(
          (item) =>
            !(
              item.jobId === event.jobId &&
              item.transactionId === event.transactionId
            ),
        );

        // Check if all jobs in transaction are completed
        const allJobsCompleted = transaction.jobs.every(
          (j) => j.status === "COMPLETED",
        );
        if (allJobsCompleted) {
          transaction.status = "COMPLETED";
        }

        // Update queue status based on remaining items
        if (draft.printQueue.items.length === 0) {
          draft.printQueue.status = "idle";
        } else {
          // Queue has items but we stay in current state
          // Will check below if we should spool next
          draft.printQueue.status = "working";
        }
      });

      // Only spool next job if queue is NOT in error state
      if (
        nextState.printQueue.status === "working" &&
        nextState.printQueue.items.length > 0
      ) {
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

      // Report milestone to backend (REST - authoritative)
      operations.push({
        operationId: generateOperationId(),
        type: "report-job-status",
        transactionId: event.transactionId,
        jobId: event.jobId,
        status: "COMPLETED",
        timestamp: new Date().toISOString(),
      });

      // Check if transaction completed - report that too
      const transaction = nextState.transactions[event.transactionId];
      if (transaction.status === "COMPLETED") {
        operations.push({
          operationId: generateOperationId(),
          type: "report-transaction-status",
          transactionId: event.transactionId,
          status: "COMPLETED",
          timestamp: new Date().toISOString(),
        });
      }

      break;
    }

    case "print-job:incomplete": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((j) => j.id === event.jobId);

        if (job) {
          job.status = "INCOMPLETE";
          job.failedAt = new Date().toISOString();
        }

        // Remove from queue
        draft.printQueue.items = draft.printQueue.items.filter(
          (item) =>
            !(
              item.jobId === event.jobId &&
              item.transactionId === event.transactionId
            ),
        );

        // Set queue to error - stops automatic spooling
        draft.printQueue.status = "error";

        // Update transaction status
        const hasIncomplete = transaction.jobs.some(
          (j) => j.status === "INCOMPLETE",
        );
        if (hasIncomplete) {
          transaction.status = "INCOMPLETE";
        }
      });

      // DO NOT spool next job - queue is in error, user must intervene

      // Report milestone to backend
      operations.push({
        operationId: generateOperationId(),
        type: "report-job-status",
        transactionId: event.transactionId,
        jobId: event.jobId,
        status: "INCOMPLETE",
        pagesPrinted: event.pagesPrinted,
        totalPages: event.totalPages,
        timestamp: new Date().toISOString(),
      });

      break;
    }

    case "print-job:failed": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((j) => j.id === event.jobId);

        if (job) {
          job.status = "ERROR";
          job.failedAt = new Date().toISOString();
        }

        // Remove from queue
        draft.printQueue.items = draft.printQueue.items.filter(
          (item) =>
            !(
              item.jobId === event.jobId &&
              item.transactionId === event.transactionId
            ),
        );

        // Set queue to error - stops automatic spooling
        draft.printQueue.status = "error";

        // Update transaction status
        const hasError = transaction.jobs.some((j) => j.status === "ERROR");
        if (hasError) {
          transaction.status = "ERROR";
        }
      });

      // DO NOT spool next job - queue is in error, user must intervene

      // Report milestone to backend
      operations.push({
        operationId: generateOperationId(),
        type: "report-job-status",
        transactionId: event.transactionId,
        jobId: event.jobId,
        status: "ERROR",
        timestamp: new Date().toISOString(),
      });

      break;
    }

    case "print-job:not-found": {
      // Observability only - terminal outcome events handle state
      break;
    }
    default: {
      break;
    }
  }

  return [nextState, operations];
};
