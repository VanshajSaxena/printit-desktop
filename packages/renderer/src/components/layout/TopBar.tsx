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
      className="flex h-18 max-w-full min-w-0 items-center justify-between gap-4 border-b border-border-default px-6 py-4"
      {...props}
    >
      <h2 className="text-xl leading-7 font-semibold text-primary-content">
        {title}
      </h2>
      {children}
    </div>
  );
}
