import { BnWIcon } from "@components/icons/BnWIcon";
import { Badge } from "./Badge";
import type { BadgeProps } from "./types";

export function BnWBadge(props: BadgeProps) {
  return (
    <Badge
      icon={<BnWIcon size={16}></BnWIcon>}
      label="B&W"
      count={props.count}
    ></Badge>
  );
}
