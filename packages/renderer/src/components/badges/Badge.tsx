import { useTheme } from '@context/theme/useTheme';
import type { BadgeProps } from './types';

export function Badge(props: BadgeProps) {
  const { colors } = useTheme();
  const name = props.label;
  const icon = props.icon;
  const count = props.count;
  return (
    <div
      className="flex gap-2 -outline-offset-1 outline px-2 py-1 rounded-lg"
      style={{
        outlineColor: colors.border.default,
      }}
    >
      {icon}
      <div className="text-xs leading-4" style={{ color: colors.fg.secondary }}>
        {name}
        {count && <span className="ml-1 text-xs">{count}</span>}
      </div>
    </div>
  );
}
