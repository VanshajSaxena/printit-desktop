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
import { SearchInput } from "./dashboard/SearchInput";

export function Dashboard() {
  const { toggleTheme } = useTheme();
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
              console.log("clicked");
            }}
          ></GetQRCodeButton>
        </div>
      </TopBar>
      <div className="flex h-full flex-col gap-5 overflow-x-hidden overflow-y-auto p-5">
        <div className="flex h-fit w-full justify-start gap-5">
          <SheetsPrintedCard heroText="24" subText="Today" />
          <SheetsPrintedCard heroText="425" subText="Weekly" />
          <PrinterStatusCard heroText="Working" subText="HP Laserjet" />
        </div>
        <div className="flex h-fit w-full justify-between gap-4">
          <SearchInput />
          <div className="flex size-fit justify-start gap-4">
            <DisplayButton />
            <BulkActionButton />
          </div>
        </div>
        <TransactionListContainer />
      </div>
    </>
  );
}
