import React from 'react';

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function TopBar({
  title = 'Dashboard',
  children,
  ...props
}: TopBarProps) {
  return (
    <div
      className="flex border-b h-[4.5rem] px-6 py-4 gap-4 justify-between items-center"
      // style={{ borderColor: colors.border.default }}
      {...props}
    >
      <h2 className="text-lg font-semibold text-primary-content">{title}</h2>
      {children}
    </div>
  );
}
