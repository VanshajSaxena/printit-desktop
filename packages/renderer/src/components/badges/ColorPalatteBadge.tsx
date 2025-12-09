import { ColorPalatteIcon } from "@components/icons/ColorPalatteIcon";
import { Badge } from "./Badge";
import type { BadgeProps } from "./types";

export function ColorPalatteBadge(props: BadgeProps) {
  return (
    <Badge
      icon={<ColorPalatteIcon size={16}></ColorPalatteIcon>}
      label="Color"
      count={props.count}
    ></Badge>
  );
}
