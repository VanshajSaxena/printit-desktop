import { IconContrast2Filled } from "@tabler/icons-react";
import { Badge } from "./Badge";
import type { BadgeProps } from "./types";

export function BnWBadge(props: BadgeProps) {
  return (
    <Badge
      icon={<IconContrast2Filled className="size-3"></IconContrast2Filled>}
      label="B&W"
      count={props.count}
    ></Badge>
  );
}
