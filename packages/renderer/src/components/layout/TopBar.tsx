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
      className="flex border-border-default border-b h-18 px-6 py-4 gap-4 justify-between items-center"
      {...props}
    >
      <h2 className="text-lg font-semibold text-primary-content">{title}</h2>
      {children}
    </div>
  );
}
