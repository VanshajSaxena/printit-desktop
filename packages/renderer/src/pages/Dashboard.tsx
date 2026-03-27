import { OrderSheet } from "@/components/sheets/OrderSheet";
import { BulkActionButton } from "@components/buttons/BulkActionButton";
import { Button } from "@components/buttons/Button";
import { DisplayButton } from "@components/buttons/DisplayButton";
import { GetQRCodeButton } from "@components/buttons/GetQRCodeButton";
import { PrinterStatusCard } from "@components/cards/PrinterStatusCard";
import { SheetsPrintedCard } from "@components/cards/SheetsPrintedCard";
import { MoonIcon } from "@components/icons/MoonIcon";
import { TopBar } from "@components/layout/TopBar";
import { useTheme } from "@context/theme/useTheme";
import { TransactionListContainer } from "@pages/dashboard/TransactionListContainer";
import { useState } from "react";
import { toast } from "sonner";
import { SearchInput } from "./dashboard/SearchInput";

export function Dashboard() {
  const { toggleTheme } = useTheme();
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | undefined
  >(undefined);
  const [orderSheetOpen, setOrderSheetOpen] = useState(false);

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
          ></Button>
          <GetQRCodeButton
            onClick={() => {
              toast.warning("Will show QR Code", {
                position: "top-center",
              });
            }}
          ></GetQRCodeButton>
        </div>
      </TopBar>
      <div className="flex h-full max-w-full min-w-0 flex-col gap-5 overflow-x-hidden overflow-y-auto p-5">
        <div className="flex h-fit max-w-full min-w-0 justify-start gap-5">
          <SheetsPrintedCard heroText="24" subText="Today" />
          <SheetsPrintedCard heroText="425" subText="Weekly" />
          <PrinterStatusCard subText="HP Laserjet" />
        </div>
        <div className="flex h-fit max-w-full min-w-0 justify-between gap-4">
          <SearchInput />
          <div className="flex size-fit justify-start gap-4">
            <DisplayButton />
            <BulkActionButton />
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
    </>
  );
}
