import { Button } from '@components/buttons/Button';
import { GearIcon } from '@components/icons/GearIcon';
import { SlidersIcon } from '@components/icons/SlidersIcon';
import { TopBar } from '@components/layout/TopBar';
import { getPrintTransactions } from '@app/preload';
import { RequestListContainer } from '@pages/dashboard/RequestListContainer';
import { useTheme } from '@context/theme/useTheme';
import { RequestListItem } from '@components/list-items/RequestListItem';
import { MoonIcon } from '@components/icons/MoonIcon';
import { GetQRCodeButton } from '@components/buttons/GetQRCodeButton';
import { DisplayButton } from '@components/buttons/DisplayButton';
import { BulkActionButton } from '@components/buttons/BulkActionButton';

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
      {/* Root content area for dashboard*/}
      <div className="flex flex-col p-5 gap-5 h-full overflow-y-auto overflow-x-hidden">
        {/* Button Area */}
        <div className="flex items-start gap-4">
          <DisplayButton></DisplayButton>
          <BulkActionButton></BulkActionButton>
        </div>
        {/* List and Graph Area */}
        <RequestListContainer>
          <RequestListItem></RequestListItem>
          <RequestListItem></RequestListItem>
          <RequestListItem></RequestListItem>
          <RequestListItem></RequestListItem>
          <RequestListItem></RequestListItem>
          <RequestListItem></RequestListItem>
        </RequestListContainer>
        <div className="grid grid-cols-1 2xl:grid-cols-2 w-full h-full min-h-[48rem] max-h-1/3 2xl:min-h-1/3 gap-5 ">
          <div className="border rounded-3xl border-border-default"></div>
          <div className="border rounded-3xl border-border-default"></div>
        </div>
      </div>
    </>
  );
}
