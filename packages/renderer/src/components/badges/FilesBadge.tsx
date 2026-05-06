import { File } from "lucide-react";
import { Badge } from "./Badge";
import type { BadgeProps } from "./types";

export function FilesBadge(props: BadgeProps) {
  return (
    <Badge
      icon={<File className="size-3"></File>}
      label={`File${props.count !== 1 ? "s" : ""}`}
      count={props.count}
    ></Badge>
  );
}
