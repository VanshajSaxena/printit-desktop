import { GearIcon } from '@components/icons/GearIcon';
import { Button } from './Button';
import type { ButtonProps } from './types';

export function BulkActionButton({ className = '', ...props }: ButtonProps) {
  return (
    <Button
      size="md"
      icon={<GearIcon size={20}></GearIcon>}
      className={`outline -outline-offset-1 outline-border-default text-primary-content  ${className}`}
      {...props}
    >
      Bulk Action
    </Button>
  );
}
