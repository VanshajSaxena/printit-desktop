import { IconColorFilter } from "@tabler/icons-react";
import { Badge } from "./Badge";
import type { BadgeProps } from "./types";

export function ColorPalatteBadge(props: BadgeProps) {
  return (
    <Badge
      icon={<IconColorFilter className="size-3"></IconColorFilter>}
      label="Color"
      count={props.count}
    ></Badge>
  );
}
