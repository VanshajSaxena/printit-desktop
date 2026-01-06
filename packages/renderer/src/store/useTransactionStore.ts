import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createIdbStorage } from "./createIdbStorage";

interface TransactionObject {
  id: number;
}

interface TransactionState {
  transactions: TransactionObject[];
}

interface TransactionStore {
  state: TransactionState;
  addTransaction: (transaction: TransactionObject) => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    immer((set) => ({
      state: { transactions: [] },
      addTransaction: (transaction: TransactionObject) => {
        set((store) => {
          store.state.transactions.push(transaction);
        });
      },
    })),
    {
      name: "transaction-storage",
      storage: createIdbStorage<Pick<TransactionStore, "state">>(),
    },
  ),
);
