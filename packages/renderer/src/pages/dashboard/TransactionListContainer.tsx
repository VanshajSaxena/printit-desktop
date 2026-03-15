import { EmptyTrayIcon } from "@components/icons/EmptyTrayIcon";
import { TransactionItem } from "@components/list-items/TransactionItem";
import { useWsEvent } from "@hooks/useWsHandler";
import { useTransactionStore } from "@store/useTransactionStore";
import { useEffect, useMemo } from "react";

export function TransactionListContainer({
  onTransactionClick,
}: {
  onTransactionClick: (transactionId: number) => void;
}) {
  const dispatch = useTransactionStore((store) => store.dispatch);

  const transactionsMap = useTransactionStore(
    (store) => store.state.transactions,
  );

  const transactionList = useMemo(() => {
    return Object.values(transactionsMap);
  }, [transactionsMap]);

  useEffect(() => {
    dispatch({ type: "transaction:request" });
  }, [dispatch]);

  useWsEvent("transaction:new", () => {
    dispatch({ type: "transaction:request" });
  });

  return (
    <div className="h-full max-w-full min-w-0 overflow-y-auto rounded-3xl border border-border-default mask-[linear-gradient(black,black)]">
      {transactionList.length === 0 && (
        <div className="flex size-full flex-col items-center justify-center gap-y-6">
          <EmptyTrayIcon />
          <p className="text-sm font-normal text-secondary-content">
            This feels empty, have you shared your QR Code with others?
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
