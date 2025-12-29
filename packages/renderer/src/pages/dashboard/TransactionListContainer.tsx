import { client } from "@api/client";
import { TransactionItem } from "@components/list-items/TransactionItem";

export function TransactionListContainer() {
  const { data } = client.useQuery(
    "get",
    "/api/v1/transactions",
    {},
    { refetchOnWindowFocus: false },
  );

  return (
    <div className="h-full w-full overflow-y-auto rounded-3xl border border-border-default mask-[linear-gradient(black,black)]">
      {data?.map((transaction) => {
        return <TransactionItem key={transaction.id} {...transaction} />;
      })}
    </div>
  );
}
