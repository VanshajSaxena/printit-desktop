import { client } from "@api/client";
import { EmptyTrayIcon } from "@components/icons/EmptyTrayIcon";
import { TransactionItem } from "@components/list-items/TransactionItem";

export function TransactionListContainer() {
  const { data, isSuccess } = client.useQuery(
    "get",
    "/api/v1/transactions",
    {},
    { refetchOnWindowFocus: false },
  );

  return (
    <div className="h-full w-full overflow-y-auto rounded-3xl border border-border-default mask-[linear-gradient(black,black)]">
      {isSuccess && data.length === 0 && (
        <div className="flex size-full flex-col items-center justify-center gap-y-6">
          <EmptyTrayIcon />
          <p className="text-sm font-normal text-secondary-content">
            This feels empty, have you shared your QR Code with others?
          </p>
        </div>
      )}
      {isSuccess &&
        data.map((transaction) => {
          return <TransactionItem key={transaction.id} {...transaction} />;
        })}
    </div>
  );
}
