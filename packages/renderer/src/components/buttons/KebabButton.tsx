import { KebabIcon } from "@components/icons/KebabIcon";
import { Button } from "./Button";
import type { ButtonProps } from "./types";

export function KebabButton(props: ButtonProps) {
  return (
    <>
      <Button
        icon={<KebabIcon></KebabIcon>}
        className="rounded-xl p-2.25 outline -outline-offset-1 outline-border-default hover:bg-tertiary"
        {...props}
      ></Button>
    </>
  );
}
