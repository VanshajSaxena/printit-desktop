import { EmptyTrayIcon } from "@components/icons/EmptyTrayIcon";

export function TransactionListContainer() {
  // useWsEvent("transaction:new", ({ id }) => {});
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
    </div>
  );
}
