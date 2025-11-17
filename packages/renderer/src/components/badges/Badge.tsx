import type { BadgeProps } from './types';

export function Badge(props: BadgeProps) {
  const name = props.label;
  const icon = props.icon;
  const count = props.count;
  return (
    <div className="flex gap-2 -outline-offset-1 outline px-2 py-1 rounded-lg outline-border-default">
      {icon}
      <div className="text-xs leading-4 text-secondary-content">
        {name}
        {count && <span className="ml-1 text-xs">{count}</span>}
      </div>
    </div>
  );
}
