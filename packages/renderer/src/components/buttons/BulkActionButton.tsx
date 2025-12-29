import { GearIcon } from "@components/icons/GearIcon";
import { Button } from "./Button";
import type { ButtonProps } from "./types";
import clsx from "clsx";

export function BulkActionButton({ className = "", ...props }: ButtonProps) {
  return (
    <Button
      size="md"
      icon={<GearIcon size={20}></GearIcon>}
      className={clsx(
        "text-primary-content outline -outline-offset-1 outline-border-default hover:bg-tertiary",
        className,
      )}
      {...props}
    >
      Bulk Action
    </Button>
  );
}
