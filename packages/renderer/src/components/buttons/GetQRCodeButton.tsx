import { Button } from './Button';
import { QRCodeIcon } from '@components/icons/QRCodeIcon';
import type { ButtonProps } from './types';

export function GetQRCodeButton({ ...props }: ButtonProps) {
  return (
    <>
      <Button
        size="lg"
        varient="default"
        onClick={props.onClick}
        icon={<QRCodeIcon size={24}></QRCodeIcon>}
      >
        Get QR Code
      </Button>
    </>
  );
}
