import { fetchClient } from "@api/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createIdbStorage } from "./createIdbStorage";
import { ObservableExecutor } from "./executor";
import { reducer } from "./reducer";
import type {
  TransactionEvent,
  TransactionState,
  TransactionStore,
} from "./types";

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => {
      const executor = new ObservableExecutor((event) => {
        const [newState, operations] = reducer(get().state, event);

        set({ state: newState });

        operations.forEach((operation) => void executor.execute(operation));
      }, fetchClient);
      return {
        state: { transactions: [] },
        dispatch: (event: TransactionEvent) => {
          const [newState, operations] = reducer(get().state, event);

          set({ state: newState });

          operations.forEach((operation) => void executor.execute(operation));
        },
      };
    },
    {
      name: "transaction-storage",
      storage: createIdbStorage<TransactionState>(),
      partialize: (store) => store.state,
    },
  ),
);
