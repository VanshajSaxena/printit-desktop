import { fetchClient } from "@api/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createIdbStorage } from "./createIdbStorage";
import type { TransactionStore } from "./events";
import { ObservableExecutor } from "./executor";
import { reducer } from "./reducer";
import log from "electron-log/renderer";

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => {
      const executor = new ObservableExecutor((event) => {
        log.info("Dispatch Event Fired:", event.type);
        const [newState, operations] = reducer(get().state, event);

        set({ state: newState });

        operations.forEach((operation) => void executor.execute(operation));
      }, fetchClient);
      return {
        state: { transactions: {}, printQueue: { items: [], status: "idle" } },
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
      onRehydrateStorage(store) {
        return () => {
          store.state.printQueue.status = "idle";
        };
      },
      version: 1,
    },
  ),
);
