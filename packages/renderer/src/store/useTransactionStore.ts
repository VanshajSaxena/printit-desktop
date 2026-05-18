import { fetchClient } from "@api/client";
import log from "electron-log/renderer";
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { createIdbStorage } from "./createIdbStorage";
import { ObservableExecutor } from "./executor";
import { reducer } from "./reducer";
import type { PrintQueue, TransactionStore } from "./structure";

export const useTransactionStore = create<TransactionStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => {
        const executor = new ObservableExecutor((event) => {
          log.verbose("Dispatch Event Fired:", event.type);
          const [newState, operations] = reducer(get().state, event);

          set({ state: newState });

          operations.forEach((operation) => void executor.execute(operation));
        }, fetchClient);
        return {
          state: {
            transactions: {},
            printQueues: {},
            defaultQueue: "",
          },
          dispatch: (event) => {
            const [newState, operations] = reducer(get().state, event);

            set({ state: newState });

            operations.forEach((operation) => void executor.execute(operation));
          },
          setDefaultQueue: (queueName: string) => {
            set((store) => {
              const queues = store.state.printQueues;

              const queueExists = Boolean(queues[queueName]);

              // If it doesn't exist, create it
              const nextQueues = queueExists
                ? { ...queues }
                : {
                    ...queues,
                    [queueName]: {
                      name: queueName,
                      default: true,
                      status: "idle",
                      items: [],
                    } satisfies PrintQueue,
                  };

              const updatedQueues = Object.fromEntries(
                Object.entries(nextQueues).map(([name, queue]) => [
                  name,
                  {
                    ...queue,
                    default: name === queueName,
                  },
                ]),
              );

              return {
                state: {
                  ...store.state,
                  printQueues: updatedQueues,
                },
              };
            });
          },
          initializeAfterHydration: () => {
            // const currentState = get().state;
            // const queues = Object.keys(currentState.printQueues);
            //
            // const queueAndResponse = await Promise.all(
            //   queues.map(async (queueName) => {
            //     const response = await getPrintJobs(queueName);
            //     return { queueName, response };
            //   }),
            // );
            // const updatedPrintQueues = { ...currentState.printQueues };
            // queueAndResponse.forEach(({ queueName, response }) => {
            //   if (!response.success) return;
            //   const jobIdSet = new Set(
            //     (response.data ?? []).map((job) => job.jobIdentifier),
            //   );
            //   const queueState = currentState.printQueues[queueName];
            //   updatedPrintQueues[queueName] = {
            //     ...queueState,
            //     items: queueState.items.filter(
            //       (item) =>
            //         !!item.printJobIdentifier &&
            //         jobIdSet.has(item.printJobIdentifier),
            //     ),
            //   };
            // });
            // set({
            //   state: {
            //     ...currentState,
            //     printQueues: updatedPrintQueues,
            //   },
            // });
            Object.entries(get().state.printQueues).forEach(
              ([queueName, printQueue]) => {
                printQueue.items.forEach(
                  ({ printJobIdentifier, jobId, transactionId }) => {
                    if (!printJobIdentifier) return;
                    get().dispatch({
                      type: "start:initialize-job-monitoring",
                      queueName,
                      jobId,
                      transactionId,
                      printJobIdentifier,
                    });
                  },
                );
              },
            );
          },
        };
      },
      {
        name: "transaction-storage",
        storage: createIdbStorage<Pick<TransactionStore, "state">>(),
        partialize: (store) => ({ state: store.state }),
        onRehydrateStorage(store) {
          return () => {
            log.debug("Rehydration Finished");
            store.initializeAfterHydration();
          };
        },
        version: 1,
      },
    ),
  ),
);
