import type { IconProps } from '@components/icons/types';
import React from 'react';

interface SideBarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  IconComponent?: React.ComponentType<IconProps>;
  children?: React.ReactNode;
  isActive?: boolean;
}

export function SideBarItem({
  IconComponent,
  children,
  className = '',
  isActive = false,
  ...props
}: SideBarItemProps) {
  const activeStyle = isActive
    ? 'bg-tertiary text-primary-content'
    : 'bg-secondary text-secondary-content';
  // const iconColor = isActive ? colors.fg.primary : colors.fg.secondary;

  return (
    <>
      <div
        className={`flex gap-4 w-full h-fit font-normal rounded-xl px-4 py-2 ${className} ${activeStyle}`}
        {...props}
      >
        {IconComponent && <IconComponent stroke="currentColor"></IconComponent>}
        {children}
      </div>
    </>
  );
}
