import { SectionCards } from "@/components/cards/SectionCards";
import { OrderSheet } from "@/components/sheets/OrderSheet";
import { useWsEvent } from "@/hooks/useWsHandler";
import { useTransactionStore } from "@/store/useTransactionStore";
import { BulkActionButton } from "@components/buttons/BulkActionButton";
import { GetQRCodeButton } from "@components/buttons/GetQRCodeButton";
import { QRCodeDialog } from "@components/dialogs/QRCodeDialog";
import { TopBar } from "@components/layout/TopBar";
import { TransactionListContainer } from "@pages/dashboard/TransactionListContainer";
import { useEffect, useMemo, useState } from "react";
import { SearchInput } from "./dashboard/SearchInput";

export function Dashboard() {
  const dispatch = useTransactionStore((store) => store.dispatch);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | undefined
  >(undefined);
  const [orderSheetOpen, setOrderSheetOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const transactionsMap = useTransactionStore(
    (store) => store.state.transactions,
  );

  const filteredTransactions = useMemo(() => {
    const list = Object.values(transactionsMap);

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();

    return list.filter((transaction) => {
      const friendlyMatch = transaction.friendlyId
        .toLowerCase()
        .includes(query);

      const fileMatch = transaction.jobs.some((job) =>
        job.document.filename.toLowerCase().includes(query),
      );

      return friendlyMatch || fileMatch;
    });
  }, [transactionsMap, searchQuery]);

  const openOrderSheet = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setOrderSheetOpen(true);
  };

  useEffect(() => {
    dispatch({ type: "transaction:request" });
  }, [dispatch]);

  useWsEvent("transaction:new", () => {
    dispatch({ type: "transaction:request" });
  });

  return (
    <>
      <TopBar title="Dashboard">
        <GetQRCodeButton
          onClick={() => {
            setQrDialogOpen(true);
          }}
        />
      </TopBar>
      <div className="flex h-full max-w-full min-w-0 flex-col gap-5 overflow-x-hidden overflow-y-auto p-5">
        <SectionCards />
        <div className="flex h-fit max-w-full min-w-0 justify-between gap-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <div className="flex size-fit justify-start gap-4">
            <BulkActionButton></BulkActionButton>
          </div>
        </div>
        <TransactionListContainer
          transactions={filteredTransactions}
          onTransactionClick={openOrderSheet}
        />
        {selectedTransactionId && (
          <OrderSheet
            open={orderSheetOpen}
            onOpenChange={setOrderSheetOpen}
            transactionId={selectedTransactionId}
          />
        )}
      </div>
      <QRCodeDialog open={qrDialogOpen} onOpenChange={setQrDialogOpen} />
    </>
  );
}
