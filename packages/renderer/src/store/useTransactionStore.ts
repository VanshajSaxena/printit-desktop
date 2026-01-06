import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createIdbStorage } from "./createIdbStorage";

export interface TransactionObject {
  id: number;
}

export interface TransactionState {
  transactions: TransactionObject[];
}

export interface TransactionStore {
  state: TransactionState;
  setState: (state: TransactionState) => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      state: { transactions: [] },
      setState: (state: TransactionState) => {
        set({ state });
      },
    }),
    {
      name: "transaction-storage",
      storage: createIdbStorage<Pick<TransactionStore, "state">>(),
    },
  ),
);
