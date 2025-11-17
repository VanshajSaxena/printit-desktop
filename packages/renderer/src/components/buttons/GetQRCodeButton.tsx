import { Button } from './Button';
import { QRCodeIcon } from '@components/icons/QRCodeIcon';
import type { ButtonProps } from './types';

export function GetQRCodeButton({ className = '', ...props }: ButtonProps) {
  return (
    <Button
      size="lg"
      icon={<QRCodeIcon size={24}></QRCodeIcon>}
      className={`outline -outline-offset-1 outline-border-default bg-tertiary text-primary-content  ${className}`}
      onClick={props.onClick}
      {...props}
    >
      Get QR Code
    </Button>
  );
}
