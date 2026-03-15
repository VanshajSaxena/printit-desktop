import { FileIcon } from "../icons/FileIcon";
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
      icon={<FileIcon size={16}></FileIcon>}
      label={label}
      count={props.count}
    ></Badge>
  );
}
