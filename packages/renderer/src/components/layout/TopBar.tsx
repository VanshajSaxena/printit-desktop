import React from 'react';
import { useTheme } from '@context/theme/useTheme';

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function TopBar({
  title = 'Dashboard',
  children,
  ...props
}: TopBarProps) {
  const { colors } = useTheme();
  return (
    <div
      className="flex border-b h-fit px-6 py-4 justify-between items-center"
      style={{ borderColor: colors.border.default }}
      {...props}
    >
      <h2
        className="text-lg font-semibold"
        style={{ color: colors.fg.primary }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
