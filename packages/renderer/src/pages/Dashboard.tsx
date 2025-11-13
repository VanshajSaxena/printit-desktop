import { Button } from '@components/buttons/Button';
import { GearIcon } from '@components/icons/GearIcon';
import { QRCodeIcon } from '@components/icons/QRCodeIcon';
import { SlidersIcon } from '@components/icons/SlidersIcon';
import { TopBar } from '@components/layout/TopBar';
import { getPrintTransactions } from '@app/preload';
import { RequestListContainer } from '@pages/dashboard/RequestListContainer';

export function Dashboard() {
  return (
    <>
      <TopBar title="Dashboard">
        <Button
          size="lg"
          varient="default"
          icon={<QRCodeIcon size={24}></QRCodeIcon>}
          onClick={() => {
            getPrintTransactions()
              .then((response) => {
                console.log(response);
              })
              .catch((error: unknown) => {
                console.log(error);
              });
          }}
        >
          Get QR Code
        </Button>
      </TopBar>
      {/* Root content area for dashboard*/}
      <div className="flex flex-col p-5 gap-5 h-full overflow-y-auto overflow-x-hidden">
        {/* Button Area */}
        <div className="flex items-start gap-4">
          <Button
            size="md"
            varient="ghost"
            icon={<SlidersIcon size={20}></SlidersIcon>}
          >
            Display
          </Button>
          <Button
            size="md"
            varient="ghost"
            icon={<GearIcon size={20}></GearIcon>}
          >
            Bulk Action
          </Button>
        </div>
        {/* List and Graph Area */}
        <RequestListContainer></RequestListContainer>
        <div className="grid grid-cols-1 2xl:grid-cols-2 w-full h-full min-h-[48rem] max-h-1/3 2xl:min-h-1/3 gap-5 ">
          <div
            className="border rounded-3xl "
            // style={{ borderColor: colors.border.default }} FIX: border
          ></div>
          <div
            className="border rounded-3xl"
            // style={{ borderColor: colors.border.default }} FIX: border
          ></div>
        </div>
      </div>
    </>
  );
}
