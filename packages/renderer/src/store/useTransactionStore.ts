import { fetchClient } from "@api/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createIdbStorage } from "./createIdbStorage";
import { ObservableExecutor } from "./executor";
import { reducer, type TransactionEvent } from "./reducer";

export interface TransactionObject {
  id: number;
}

export interface TransactionState {
  transactions: TransactionObject[];
}

export interface TransactionStore {
  state: TransactionState;
  dispatch: (event: TransactionEvent) => void;
}

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
      storage: createIdbStorage<Pick<TransactionStore, "state">>(),
    },
  ),
);
