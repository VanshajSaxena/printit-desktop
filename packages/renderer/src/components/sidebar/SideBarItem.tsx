import type { IconProps } from '@components/icons/types';
import { useTheme } from '@context/theme/useTheme';
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
  const { colors } = useTheme();

  const activeStyle = isActive
    ? { backgroundColor: colors.bg.tertiary, color: colors.fg.primary }
    : { backgroundColor: colors.bg.secondary, color: colors.fg.secondary };
  const iconColor = isActive ? colors.fg.primary : colors.fg.secondary;

  return (
    <>
      <div
        className={`flex gap-2 w-full h-fit font-normal rounded-xl px-4 py-2 ${className}`}
        style={activeStyle}
        {...props}
      >
        {IconComponent && <IconComponent stroke={iconColor}></IconComponent>}
        {children}
      </div>
    </>
  );
}
