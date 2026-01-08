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

export type TransactionEvent =
  | { type: "transaction:new"; transaction: TransactionObject }
  | { type: "user:print"; files: { id: number }[] }
  | { type: "files:download:started" }
  | { type: "files:download:progress" }
  | { type: "files:download:completed" };

export type TransactionOperation =
  | { type: "files:download"; files: { id: number }[] }
  | { type: "print-documents" }
  | { type: "error" };
