import { StackIcon } from "@components/icons/StackIcon";
import { Badge } from "./Badge";
import type { BadgeProps } from "./types";

export function SheetsBadge(props: BadgeProps) {
  return (
    <Badge
      icon={<StackIcon size={16} />}
      label="Sheets"
      count={props.count}
    ></Badge>
  );
}
