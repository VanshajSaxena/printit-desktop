import { CheckIcon, RotateCcwIcon, XIcon } from "lucide-react";

import { KebabButton } from "@/components/buttons/KebabButton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StatusType } from "@/store/structure";

interface ActionsMenuProps {
  status: StatusType;
  onMarkComplete: () => void;
  onRetry: () => void;
  onCancel: () => void;
}

export function ActionsMenu({
  status,
  onMarkComplete,
  onRetry,
  onCancel,
}: ActionsMenuProps) {
  const inQueue =
    status === "QUEUED" ||
    status === "TIMEOUT" ||
    status === "DOWNLOADING" ||
    status === "READY" ||
    status === "SPOOLED" ||
    status === "PRINTING";
  const hasError =
    status === "ERROR" || status === "DISAPPEARED" || status === "CRITICAL";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <KebabButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onMarkComplete}>
          <CheckIcon />
          Mark as Complete
        </DropdownMenuItem>
        {hasError && (
          <DropdownMenuItem onClick={onRetry}>
            <RotateCcwIcon />
            Retry
          </DropdownMenuItem>
        )}
        {inQueue && (
          <DropdownMenuItem onClick={onCancel}>
            <XIcon />
            Cancle
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
