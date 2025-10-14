import React from 'react';
import { useTheme } from '../../context/theme/useTheme';

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
    <div className="flex flex-1 gap-4 items-center h-20 mx-6" {...props}>
      <h2
        className="text-2xl font-semibold"
        style={{ color: colors.fg.primary }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
