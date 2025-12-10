import { FileIcon } from "@components/icons/FileIcon";
import { Badge } from "./Badge";
import type { BadgeProps } from "./types";

export function FilesBadge(props: BadgeProps) {
  return (
    <Badge
      icon={<FileIcon size={16}></FileIcon>}
      label="Files"
      count={props.count}
    ></Badge>
  );
}
