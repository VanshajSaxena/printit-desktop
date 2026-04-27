import { SectionCards } from "@/components/cards/SectionCards";
import { OrderSheet } from "@/components/sheets/OrderSheet";
import { BulkActionButton } from "@components/buttons/BulkActionButton";
import { Button } from "@components/buttons/Button";
import { GetQRCodeButton } from "@components/buttons/GetQRCodeButton";
import { QRCodeDialog } from "@components/dialogs/QRCodeDialog";
import { MoonIcon } from "@components/icons/MoonIcon";
import { TopBar } from "@components/layout/TopBar";
import { useTheme } from "@context/theme/useTheme";
import { TransactionListContainer } from "@pages/dashboard/TransactionListContainer";
import { useState } from "react";
import { SearchInput } from "./dashboard/SearchInput";

export function Dashboard() {
  const { toggleTheme } = useTheme();
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | undefined
  >(undefined);
  const [orderSheetOpen, setOrderSheetOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const openOrderSheet = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setOrderSheetOpen(true);
  };

  return (
    <>
      <TopBar title="Dashboard">
        <div className="flex gap-4">
          <Button
            size="lg"
            icon={<MoonIcon size={24}></MoonIcon>}
            onClick={toggleTheme}
          />
          <GetQRCodeButton
            onClick={() => {
              setQrDialogOpen(true);
            }}
          />
        </div>
      </TopBar>
      <div className="flex h-full max-w-full min-w-0 flex-col gap-5 overflow-x-hidden overflow-y-auto p-5">
        <SectionCards />
        <div className="flex h-fit max-w-full min-w-0 justify-between gap-4">
          <SearchInput />
          <div className="flex size-fit justify-start gap-4">
            <BulkActionButton></BulkActionButton>
          </div>
        </div>
        <TransactionListContainer onTransactionClick={openOrderSheet} />
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
