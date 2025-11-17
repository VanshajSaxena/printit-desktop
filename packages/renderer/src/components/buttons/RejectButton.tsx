import { Button } from './Button';
import { RejectIcon } from '@components/icons/RejectIcon';
import type { ButtonProps } from './types';

export function RejectButton({ ...props }: ButtonProps) {
  return (
    <>
      <Button
        size="md"
        onClick={props.onClick}
        icon={<RejectIcon size={20}></RejectIcon>}
        className="outline -outline-offset-1 outline-border-default hover:bg-tertiary text-primary-content "
        {...props}
      >
        Reject
      </Button>
    </>
  );
}
