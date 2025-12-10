import { Button } from "@components/buttons/Button";
import { TopBar } from "@components/layout/TopBar";
import { getPrintTransactions } from "@app/preload";
import { RequestListContainer } from "@pages/dashboard/RequestListContainer";
import { useTheme } from "@context/theme/useTheme";
import { RequestListItem } from "@components/list-items/RequestListItem";
import { MoonIcon } from "@components/icons/MoonIcon";
import { GetQRCodeButton } from "@components/buttons/GetQRCodeButton";
import { SheetsPrintedCard } from "@components/cards/SheetsPrintedCard";
import { PrinterStatusCard } from "@components/cards/PrinterStatusCard";
import { SearchInput } from "./dashboard/SearchInput";
import { DisplayButton } from "@components/buttons/DisplayButton";
import { BulkActionButton } from "@components/buttons/BulkActionButton";

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
              getPrintTransactions()
                .then((response) => {
                  console.log(response);
                })
                .catch((error: unknown) => {
                  console.log(error);
                });
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
        <div className="flex h-fit w-full justify-between">
          <SearchInput />
          <div className="flex size-fit justify-start gap-4">
            <DisplayButton />
            <BulkActionButton />
          </div>
        </div>
        <RequestListContainer>
          <RequestListItem></RequestListItem>
          <RequestListItem></RequestListItem>
          <RequestListItem></RequestListItem>
          <RequestListItem></RequestListItem>
          <RequestListItem></RequestListItem>
          <RequestListItem></RequestListItem>
        </RequestListContainer>
      </div>
    </>
  );
}
