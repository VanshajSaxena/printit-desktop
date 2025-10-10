import { useTheme } from '../../context/theme/useTheme';
import type { IconProps } from './types.ts';

export function MouseCursorIcon({ size = 14, ...props }: IconProps) {
  const { theme } = useTheme();
  return (
    <svg
      width={size}
      height={size}
      stroke={theme.colors.fg.primary}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.61 10.245a.7.7 0 001.3.18L7.13 8.62l2.862 2.863a.621.621 0 00.88 0l.61-.611a.623.623 0 000-.88L8.62 7.129l1.816-1.219a.7.7 0 00-.18-1.3L2.333 2.333l2.278 7.912z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
