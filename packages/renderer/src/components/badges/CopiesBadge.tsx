import { Copy } from "lucide-react";
import { Badge } from "./Badge";
import type { BadgeProps } from "./types";

export function CopiesBadge(props: BadgeProps) {
  return (
    <Badge
      icon={<Copy className="size-3 text-secondary-content"></Copy>}
      label={`Cop${props.count === 1 ? "y" : "ies"}`}
      count={props.count}
    ></Badge>
  );
}
