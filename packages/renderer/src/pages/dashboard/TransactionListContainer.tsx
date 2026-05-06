import type { TransactionObject } from "@/store/structure";
import { EmptyTrayIcon } from "@components/icons/EmptyTrayIcon";
import { TransactionItem } from "@components/list-items/TransactionItem";
import { useMemo } from "react";

export function TransactionListContainer({
  transactions,
  onTransactionClick,
}: {
  transactions: TransactionObject[];
  onTransactionClick: (transactionId: number) => void;
}) {
  const transactionList = useMemo(() => {
    return transactions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [transactions]);

  return (
    <div className="h-full min-h-fit max-w-full min-w-0 overflow-y-auto rounded-3xl border border-border-default mask-[linear-gradient(black,black)]">
      {transactionList.length === 0 && (
        <div className="flex size-full flex-col items-center justify-center gap-y-6 px-4 py-8">
          <EmptyTrayIcon />
          <p className="text-center text-sm font-normal text-secondary-content">
            This is empty, share the QR Code to start receiving orders.
          </p>
        </div>
      )}
      {transactionList.map((transaction) => {
        return (
          <TransactionItem
            key={transaction.id}
            {...transaction}
            onClick={() => {
              onTransactionClick(transaction.id);
            }}
          />
        );
      })}
    </div>
  );
}
