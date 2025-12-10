import { Button } from "./Button";
import type { ButtonProps } from "./types";
import { TrashXIcon } from "@components/icons/TrashXIcon";

export function RejectButton({ ...props }: ButtonProps) {
  return (
    <>
      <Button
        size="md"
        onClick={props.onClick}
        icon={<TrashXIcon size={20}></TrashXIcon>}
        className="text-primary-content outline-none hover:bg-error hover:text-error-content"
        {...props}
      >
        Reject
      </Button>
    </>
  );
}
