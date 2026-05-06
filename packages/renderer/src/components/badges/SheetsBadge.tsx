import { Layers2 } from "lucide-react";
import { Badge } from "./Badge";
import type { BadgeProps } from "./types";

export function SheetsBadge(props: BadgeProps) {
  return (
    <Badge
      icon={<Layers2 className="size-3"></Layers2>}
      label={`Sheet${props.count !== 1 ? "s" : ""}`}
      count={props.count}
    ></Badge>
  );
}
