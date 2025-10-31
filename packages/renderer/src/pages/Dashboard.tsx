import { Button } from '@components/buttons/Button';
import { GearIcon } from '@components/icons/GearIcon';
import { QRCodeIcon } from '@components/icons/QRCodeIcon';
import { SlidersIcon } from '@components/icons/SlidersIcon';
import { TopBar } from '@components/layout/TopBar';
import { getPrintQueues } from '@app/preload';

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
      <div className="flex p-6 items-start gap-4">
        <Button
          size="lg"
          varient="ghost"
          icon={<SlidersIcon size={24}></SlidersIcon>}
        >
          Display
        </Button>
        <Button
          size="lg"
          varient="ghost"
          icon={<GearIcon size={24}></GearIcon>}
        >
          Bulk Action
        </Button>
      </div>
    </>
  );
}
