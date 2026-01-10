import { EmptyTrayIcon } from "@components/icons/EmptyTrayIcon";
import { TransactionItem } from "@components/list-items/TransactionItem";
import { useTransactionStore } from "@store/useTransactionStore";
import { useEffect, useMemo } from "react";

export function TransactionListContainer() {
  const transactionsMap = useTransactionStore(
    (store) => store.state.transactions,
  );

  const dispatch = useTransactionStore((store) => store.dispatch);

  const transactionList = useMemo(() => {
    return Object.values(transactionsMap);
  }, [transactionsMap]);

  useEffect(() => {
    dispatch({ type: "transaction:request" });
  }, [dispatch]);

  return (
    <div className="h-full w-full overflow-y-auto rounded-3xl border border-border-default mask-[linear-gradient(black,black)]">
      {
        <div className="flex size-full flex-col items-center justify-center gap-y-6">
          <EmptyTrayIcon />
          <p className="text-sm font-normal text-secondary-content">
            This feels empty, have you shared your QR Code with others?
          </p>
        </div>
      }
      {transactionList.map((transaction) => {
        return <TransactionItem key={transaction.id} {...transaction} />;
      })}
    </div>
  );
}
