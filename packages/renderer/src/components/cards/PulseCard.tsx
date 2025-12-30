import type React from "react";

export interface PulseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  heroText: string;
  heroTextStyle: string;
  subText: string;
  icon: React.ReactNode;
}

export function PulseCard({
  title,
  heroText,
  heroTextStyle,
  subText,
  icon,
}: PulseCardProps) {
  return (
    <div className="flex size-fit min-h-28 min-w-38 flex-col gap-4 rounded-3xl bg-secondary px-4 py-3 outline -outline-offset-1 outline-border-default">
      <div className="flex items-center justify-between">
        <p className="text-xs leading-4 text-secondary-content">{title}</p>
        <div className="stroke-secondary-content">{icon}</div>
      </div>
      <div className="flex flex-col items-start">
        <p className={heroTextStyle}>{heroText}</p>
        <p className="text-xs leading-4 text-tertiary-content">{subText}</p>
      </div>
    </div>
  );
}
