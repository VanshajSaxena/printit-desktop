import { Button } from "@components/buttons/Button";
import { TopBar } from "@components/layout/TopBar";
import { TransactionListContainer } from "@pages/dashboard/TransactionListContainer";
import { useTheme } from "@context/theme/useTheme";
import { TransactionItem } from "@components/list-items/RequestListItem";
import { MoonIcon } from "@components/icons/MoonIcon";
import { GetQRCodeButton } from "@components/buttons/GetQRCodeButton";
import { SheetsPrintedCard } from "@components/cards/SheetsPrintedCard";
import { PrinterStatusCard } from "@components/cards/PrinterStatusCard";
import { SearchInput } from "./dashboard/SearchInput";
import { DisplayButton } from "@components/buttons/DisplayButton";
import { BulkActionButton } from "@components/buttons/BulkActionButton";
import { client } from "@api/client";

export function Dashboard() {
  const { data, error } = client.useQuery("get", "/api/v1/vendors/{selector}", {
    params: { path: { selector: "@harrypotter" } },
  });
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
              console.log(data);
              console.log(error);
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
        <TransactionListContainer children={JSON.stringify(data)} />
      </div>
    </>
  );
}
