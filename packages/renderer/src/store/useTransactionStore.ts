import { fetchClient } from "@api/client";
import log from "electron-log/renderer";
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { createIdbStorage } from "./createIdbStorage";
import { ObservableExecutor } from "./executor";
import { reducer } from "./reducer";
import type { TransactionStore } from "./structure";

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
            printQueues: {
              "hp smart tank 580": {
                status: "idle",
                items: [],
              },
              "hp smart tank 999": {
                status: "idle",
                items: [],
              },
            },
          },
          dispatch: (event) => {
            const [newState, operations] = reducer(get().state, event);

            set({ state: newState });

            operations.forEach((operation) => void executor.execute(operation));
          },
        };
      },
      {
        name: "transaction-storage",
        storage: createIdbStorage<Pick<TransactionStore, "state">>(),
        partialize: (store) => ({ state: store.state }),
        onRehydrateStorage() {
          return () => {
            log.debug("Rehydration Finished");
          };
        },
        version: 1,
      },
    ),
  ),
);
