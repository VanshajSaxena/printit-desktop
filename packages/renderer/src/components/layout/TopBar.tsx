import React from "react";

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function TopBar({
  title = "Dashboard",
  children,
  ...props
}: TopBarProps) {
  return (
    <div
      className="flex h-18 items-center justify-between gap-4 border-b border-border-default px-6 py-4"
      {...props}
    >
      <h2 className="text-lg font-semibold text-primary-content">{title}</h2>
      {children}
    </div>
  );
}
