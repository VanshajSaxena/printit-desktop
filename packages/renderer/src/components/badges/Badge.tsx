import { useTheme } from '@context/theme/useTheme';
import type { ReactNode } from 'react';

interface BadgeProps {
  icon: ReactNode;
  name: string;
}
export function Badge(props: BadgeProps) {
  const { colors } = useTheme();
  const name = props.name;
  const icon = props.icon;
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
      </div>
    </div>
  );
}
