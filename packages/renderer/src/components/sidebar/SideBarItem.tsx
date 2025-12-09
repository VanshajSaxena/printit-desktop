import type { ViewType } from '@components/layout/AppLayout';
import clsx from 'clsx';
import React from 'react';

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
          'flex gap-4 w-full h-fit font-normal hover:bg-tertiary rounded-xl px-3 py-2 shrink-0 whitespace-nowrap',
          isSelected
            ? 'bg-tertiary text-primary-content'
            : 'bg-secondary text-secondary-content',
        )}
        {...props}
      >
        {icon}
        {!isCollapsed && label}
      </div>
    </>
  );
}
