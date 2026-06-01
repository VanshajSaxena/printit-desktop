import { getPrintQueueStatus } from "@/lib/utils";
import log from "electron-log/renderer";
import { produce } from "immer";
import { toast } from "sonner";
import type { ReducerEvent } from "./events";
import type { TransactionOperation } from "./operations";
import type { PrintQueueItem, TransactionState } from "./structure";

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

    case "user:get-qr-code": {
      operations.push({
        operationId: generateOperationId(),
        type: "generate-qr-code-pdf",
        qrDataUrl: event.qrDataUrl,
        printIntent: event.printIntent,
      });
      break;
    }
    case "user:get-qr-code:success": {
      if (!event.printIntent) {
        toast.success(
          "PDF Downloaded Successfully. Check your Downloads folder.",
        );
        break;
      }
      const defaultQueueName = Object.values(state.printQueues).find(
        (queue) => queue.default,
      )?.name;
      if (!defaultQueueName) {
        toast.error("Please select a default printer first. Then try again.");
        break;
      }
      operations.push({
        operationId: generateOperationId(),
        type: "spool-qr-code-file",
        path: event.path,
        queueName: defaultQueueName,
      });
      break;
    }
    case "user:get-qr-code:error": {
      toast.error("Failed to download PDF. Please, try again.");
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
        if (transaction.status !== "PENDING") return;
        const queueItems: PrintQueueItem[] = transaction.jobs.map((job) => ({
          id: generateQueueItemId(),
          transactionId: event.transactionId,
          jobId: job.id,
          queuedAt: new Date().toISOString(),
        }));
        const queue = draft.printQueues[event.queueName];
        queue.items.push(...queueItems);
        draft.transactions[event.transactionId].status = "QUEUED";
        draft.transactions[event.transactionId].jobs.forEach((job) => {
          job.status = "QUEUED";
          job.queueName = event.queueName;
        });
      });
      break;
    }

    case "user:print:job": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((job) => job.id === event.jobId);
        if (job && job.status !== "COMPLETED") {
          job.status = "QUEUED";
          job.queueName = event.queueName;
          const queueItem = {
            id: generateQueueItemId(),
            transactionId: event.transactionId,
            jobId: job.id,
            queuedAt: new Date().toISOString(),
          };
          const queue = draft.printQueues[event.queueName];
          queue.items.push(queueItem);
        }
        draft.transactions[event.transactionId].status = "QUEUED";
      });
      break;
    }

    case "user:mark:complete": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((job) => job.id === event.jobId);
        if (job) {
          job.status = "COMPLETED";
          if (job.queueName) {
            draft.printQueues[job.queueName].items = draft.printQueues[
              job.queueName
            ].items.filter(
              (item) =>
                !(
                  item.jobId === event.jobId &&
                  item.transactionId === event.transactionId
                ),
            );
          }
        }
        const allCompleted = transaction.jobs.every(
          (job) => job.status === "COMPLETED",
        );
        if (allCompleted) {
          transaction.status = "COMPLETED";
        }
      });

      operations.push({
        type: "report-job-status",
        operationId: generateOperationId(),
        transactionId: event.transactionId,
        jobId: event.jobId,
        status: "COMPLETED",
        timestamp: new Date().toISOString(),
      });
      nextState.transactions[event.transactionId].jobs.forEach((job) => {
        operations.push({
          type: "stop-job-monitoring",
          operationId: generateOperationId(),
          transactionId: event.transactionId,
          jobId: job.id,
          reason: "marked-complete",
        });
      });
      if (nextState.transactions[event.transactionId].status === "COMPLETED") {
        operations.push({
          type: "report-transaction-and-jobs-status",
          operationId: generateOperationId(),
          transactionId: event.transactionId,
          status: "COMPLETED",
          timestamp: new Date().toISOString(),
        });
      }
      break;
    }

    case "user:retry:job": {
      break;
    }

    case "user:cancel:job": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((job) => job.id === event.jobId);
        if (job) {
          job.status = "PENDING";
          if (job.queueName) {
            draft.printQueues[job.queueName].items = draft.printQueues[
              job.queueName
            ].items.filter(
              (item) =>
                !(
                  item.jobId === event.jobId &&
                  item.transactionId === event.transactionId
                ),
            );
          }
        }
        const allPending = transaction.jobs.every(
          (job) => job.status === "PENDING",
        );
        if (allPending) {
          transaction.status = "PENDING";
        }
      });

      const job = nextState.transactions[event.transactionId].jobs.find(
        (job) => job.id === event.jobId,
      );

      const printJobIdentifier =
        job?.printJobIdentifier ??
        Object.values(nextState.printQueues)
          .flatMap((queue) => queue.items)
          .find(
            (item) =>
              item.jobId === event.jobId &&
              item.transactionId === event.transactionId,
          )?.printJobIdentifier;

      if (printJobIdentifier) {
        operations.push({
          type: "stop-job-monitoring",
          operationId: generateOperationId(),
          transactionId: event.transactionId,
          jobId: event.jobId,
          reason: "user-cancelled",
        });
      }

      if (job?.queueName && printJobIdentifier) {
        operations.push({
          type: "cancel-print-job",
          operationId: generateOperationId(),
          printJobIdentifier,
          queueName: job.queueName,
        });
      }
      break;
    }

    case "user:cancel:transaction": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        transaction.status = "PENDING";
        transaction.jobs.forEach((job) => (job.status = "PENDING"));
        const transactionJobIds = new Set(
          transaction.jobs.map((job) => job.id),
        );
        Object.values(draft.printQueues).forEach((queue) => {
          queue.items = queue.items.filter(
            (item) =>
              item.transactionId !== transaction.id ||
              !transactionJobIds.has(item.jobId),
          );
        });
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
      break;
    }

    case "file:spooled:success": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((j) => j.id === event.jobId);
        if (job && event.printJobInfo) {
          job.status = "SPOOLED";
          job.queueName = event.queueName;
          job.spooledAt = new Date().toISOString();
          job.printJobIdentifier = event.printJobInfo.jobIdentifier;
        }
        const queueItem = draft.printQueues[event.queueName].items.find(
          (item) =>
            item.jobId === event.jobId &&
            item.transactionId === event.transactionId,
        );
        if (queueItem) {
          queueItem.printJobIdentifier = event.printJobInfo?.jobIdentifier;
        }
      });

      const nextJob = nextState.transactions[event.transactionId].jobs.find(
        (job) => job.id === event.jobId,
      );

      let timeoutMs = 30_000;
      if (nextJob) {
        const pageCount = nextJob.document.pageCount;
        const copyCount = nextJob.copyCount;
        timeoutMs = pageCount * copyCount * 10_000 + 30_000;
      }

      if (event.printJobInfo) {
        operations.push({
          operationId: generateOperationId(),
          type: "initialize-job-monitoring",
          transactionId: event.transactionId,
          jobId: event.jobId,
          printJobIdentifier: event.printJobInfo.jobIdentifier,
          queueName: event.queueName,
          pollingIntervalMs: 1500,
          timeoutMs,
        });
      }
      break;
    }

    case "job:monitoring:started": {
      nextState = produce(state, (draft) => {
        const queueItem = draft.printQueues[event.queueName].items.find(
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
            isCritical: false,
            criticalStatuses: [],
            timedOut: false,
          };
        }
      });
      break;
    }

    case "job:status:polled": {
      nextState = produce(state, (draft) => {
        const queueItem = draft.printQueues[event.queueName].items.find(
          (item) =>
            item.jobId === event.jobId &&
            item.transactionId === event.transactionId,
        );

        if (queueItem?.monitoring) {
          queueItem.monitoring.lastPolledAt = new Date().toISOString();
          queueItem.monitoring.lastKnownStatus = event.statuses;
          queueItem.monitoring.pagesPrinted = event.numberOfPagesPrinted;
        }

        if (
          getPrintQueueStatus(
            draft.printQueues[event.queueName],
            draft.transactions,
          ) === "spooled"
        ) {
          const hasActivity = event.statuses.some(
            (status) =>
              status === "Printing" ||
              status === "Completed" ||
              event.numberOfPagesPrinted > 0,
          );

          if (hasActivity) {
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

      // if (
      //   nextState.printQueues[event.queueName].status === "printing" ||
      //   nextState.printQueues[event.queueName].status === "working"
      // ) {
      //   operations.push({
      //     operationId: generateOperationId(),
      //     type: "emit-transaction-printing",
      //     vendorId: getvendorId(),
      //     transactionId: event.transactionId,
      //   });
      // }
      break;
    }

    case "job:accepted": {
      // left intentionally
      break;
    }

    case "job:critical": {
      nextState = produce(state, (draft) => {
        const queueItem = draft.printQueues[event.queueName].items.find(
          (item) =>
            item.jobId === event.jobId &&
            item.transactionId === event.transactionId,
        );

        if (queueItem?.monitoring) {
          queueItem.monitoring.isCritical = true;
          queueItem.monitoring.criticalStatuses = event.statuses;
        }
      });
      break;
    }

    case "job:blocked": {
      nextState = produce(state, (draft) => {
        const queueItem = draft.printQueues[event.queueName].items.find(
          (item) =>
            item.jobId === event.jobId &&
            item.transactionId === event.transactionId,
        );

        if (queueItem?.monitoring) {
          queueItem.monitoring.isBlocked = true;
          queueItem.monitoring.blockedStatuses = event.statuses;
        }
      });
      break;
    }

    case "job:timeout": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((j) => j.id === event.jobId);
        if (job) {
          job.status = "TIMEOUT";
        }
        const queueItem = draft.printQueues[event.queueName].items.find(
          (item) =>
            item.jobId === event.jobId &&
            item.transactionId === event.transactionId,
        );

        if (queueItem?.monitoring) {
          queueItem.monitoring.timedOut = true;
          queueItem.monitoring.timeoutAt = new Date().toISOString();
        }
        const hasTimeout = transaction.jobs.some((j) => j.status === "TIMEOUT");
        if (hasTimeout) {
          transaction.status = "TIMEOUT";
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

        draft.printQueues[event.queueName].items = draft.printQueues[
          event.queueName
        ].items.filter(
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
      });

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
        }

        draft.printQueues[event.queueName].items = draft.printQueues[
          event.queueName
        ].items.filter(
          (item) =>
            !(
              item.jobId === event.jobId &&
              item.transactionId === event.transactionId
            ),
        );

        const hasIncomplete = transaction.jobs.some(
          (j) => j.status === "INCOMPLETE",
        );
        if (hasIncomplete) {
          transaction.status = "INCOMPLETE";
        }
      });
      break;
    }

    case "job:disappear": {
      nextState = produce(state, (draft) => {
        const transaction = draft.transactions[event.transactionId];
        const job = transaction.jobs.find((j) => j.id === event.jobId);

        if (job) {
          job.status = "DISAPPEARED";
        }

        draft.printQueues[event.queueName].items = draft.printQueues[
          event.queueName
        ].items.filter(
          (item) =>
            !(
              item.jobId === event.jobId &&
              item.transactionId === event.transactionId
            ),
        );

        const hasDisappeared = transaction.jobs.some(
          (j) => j.status === "DISAPPEARED",
        );
        if (hasDisappeared) {
          transaction.status = "DISAPPEARED";
        }
      });

      operations.push({
        type: "stop-job-monitoring",
        transactionId: event.transactionId,
        jobId: event.jobId,
        operationId: generateOperationId(),
        reason: "disappeared",
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
        draft.printQueues[event.queueName].items = draft.printQueues[
          event.queueName
        ].items.filter(
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

    case "start:download-files-to-file-system": {
      const files = state.transactions[event.transactionId].jobs.map((job) => {
        return { id: job.document.id };
      });
      operations.push({
        operationId: generateOperationId(),
        type: "download-files-to-file-system",
        files,
        transactionId: event.transactionId,
      });
      break;
    }

    case "start:spool-files-to-printer": {
      const nextJob = state.transactions[event.transactionId].jobs.find(
        (job) => job.id === event.jobId,
      );
      const { queueName, transactionId } = event;
      if (nextJob) {
        operations.push({
          operationId: generateOperationId(),
          type: "spool-files-to-printer",
          job: nextJob,
          transactionId,
          queueName,
        });
      } else {
        log.warn("A job was not found during 'start:spool-files-to-printer'");
      }
      break;
    }

    case "start:initialize-job-monitoring": {
      const { jobId, transactionId, printJobIdentifier, queueName } = event;
      operations.push({
        operationId: generateOperationId(),
        type: "initialize-job-monitoring",
        jobId,
        transactionId,
        queueName,
        printJobIdentifier,
        timeoutMs: 30_000,
      });
      break;
    }
    default: {
      break;
    }
  }

  return [nextState, operations];
};
