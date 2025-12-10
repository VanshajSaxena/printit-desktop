import { SlidersIcon } from "@components/icons/SlidersIcon";
import { Button } from "./Button";
import type { ButtonProps } from "./types";
import clsx from "clsx";

export function DisplayButton({ className = "", ...props }: ButtonProps) {
  return (
    <Button
      size="md"
      icon={<SlidersIcon size={20}></SlidersIcon>}
      className={clsx(
        "text-primary-content outline -outline-offset-1 outline-border-default",
        className,
      )}
      {...props}
    >
      Display
    </Button>
  );
}
