import type { ViewType } from "@components/layout/AppLayout";
import clsx from "clsx";
import React from "react";

export interface SideBarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  type: ViewType;
  label: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  isCollapsed?: boolean;
}

export function SideBarItem({
  icon,
  isSelected,
  isCollapsed,
  label,
  ...props
}: SideBarItemProps) {
  return (
    <>
      <div
        className={clsx(
          "flex h-fit w-full shrink-0 gap-4 rounded-xl px-3 py-2 font-normal whitespace-nowrap hover:bg-tertiary",
          isSelected
            ? "bg-tertiary text-primary-content"
            : "bg-secondary text-secondary-content",
        )}
        {...props}
      >
        {icon}
        {!isCollapsed && label}
      </div>
    </>
  );
}
