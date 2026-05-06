import { File } from "lucide-react";
import { Badge } from "./Badge";
import type { BadgeProps } from "./types";

export function PagesBadge(props: BadgeProps) {
  let label = "";
  if (typeof props.count === "string") {
    label = props.count !== "1" ? " Pages" : "Page";
  } else if (typeof props.count === "number") {
    label = props.count > 1 ? "Pages" : "Page";
  }
  return (
    <Badge
      icon={<File className="size-3"></File>}
      label={label}
      count={props.count}
    ></Badge>
  );
}
