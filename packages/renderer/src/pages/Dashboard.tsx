import { Button } from '@components/buttons/Button';
import { GearIcon } from '@components/icons/GearIcon';
import { QRCodeIcon } from '@components/icons/QRCodeIcon';
import { SlidersIcon } from '@components/icons/SlidersIcon';
import { TopBar } from '@components/layout/TopBar';
import { getPrintQueues } from '@app/preload';
import { RequestListContainer } from '@components/layout/RequestListContainer';

export function Dashboard() {
  return (
    <>
      <TopBar title="Dashboard">
        <Button
          size="lg"
          varient="default"
          icon={<QRCodeIcon size={24}></QRCodeIcon>}
          onClick={() => {
            getPrintQueues()
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
      <div className="flex flex-col p-5 gap-5">
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
        <RequestListContainer></RequestListContainer>
      </div>
    </>
  );
}
