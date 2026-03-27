import { fetchClient } from "@api/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createIdbStorage } from "./createIdbStorage";
import type { ReducerEvent, TransactionStore } from "./events";
import { ObservableExecutor } from "./executor";
import { reducer } from "./reducer";

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => {
      const executor = new ObservableExecutor((event) => {
        // __AUTO_GENERATED_PRINT_VAR_START__
        console.log("Dispatch Event Fired:", event.type); // __AUTO_GENERATED_PRINT_VAR_END__
        const [newState, operations] = reducer(get().state, event);

        set({ state: newState });

        operations.forEach((operation) => void executor.execute(operation));
      }, fetchClient);
      return {
        state: { transactions: {}, printQueue: { items: [], status: "idle" } },
        dispatch: (event: ReducerEvent) => {
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
          console.log("Rehydration Complete");
        };
      },
      version: 1,
    },
  ),
);
