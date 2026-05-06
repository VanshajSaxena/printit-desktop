import type { BadgeProps } from "./types";

export function Badge(props: BadgeProps) {
  const name = props.label;
  const icon = props.icon;
  const count = props.count;
  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-tertiary/70 px-2 py-1 text-xs text-secondary-content">
      {icon}
      <div className="text-xs leading-4">
        {count && <span className="text-xs">{count}</span>} {name}
      </div>
    </div>
  );
}
