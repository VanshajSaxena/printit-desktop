import type React from "react";

export interface PulseCardProps {
  title: string;
  heroText: string;
  subText: string;
  icon: React.ReactNode;
}

export function PulseCard({ title, heroText, subText, icon }: PulseCardProps) {
  return (
    <div className="flex flex-col gap-4 bg-secondary px-4 py-3 outline -outline-offset-1 outline-border-default">
      <div className="flex gap-3">
        <p className="text-xs leading-4 text-secondary-content">{title}</p>
        {icon}
      </div>
      <div className="flex flex-col items-start">
        <p className="text-2xl leading-8 font-semibold">{heroText}</p>
        <p className="text-xs leading-4 text-tertiary-content">{subText}</p>
      </div>
    </div>
  );
}
