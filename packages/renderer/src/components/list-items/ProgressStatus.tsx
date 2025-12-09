import { DotIcon } from "@components/icons/DotIcon";
import type { ProgressStatusProps } from "./types";

export function ProgressStatus({ type }: ProgressStatusProps) {
  return (
    <>
      <div className="flex h-fit w-fit items-center gap-1.5 rounded-xl px-3 py-1.75 text-sm leading-5 text-primary-content outline -outline-offset-1 outline-border-default">
        {type === "progress" ? (
          <DotIcon type="green"></DotIcon>
        ) : (
          <DotIcon type="gray"></DotIcon>
        )}
        {type === "progress" ? "Progress" : "Waiting"}
      </div>
    </>
  );
}
