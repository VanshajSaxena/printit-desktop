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
      className="flex flex-1 gap-4 border-b items-center max-h-20 px-6"
      style={{ borderColor: colors.border.default }}
      {...props}
    >
      <h2
        className="text-xl font-semibold"
        style={{ color: colors.fg.primary }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
