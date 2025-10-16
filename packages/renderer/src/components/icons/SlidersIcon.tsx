import { useTheme } from '@context/theme/useTheme';
import type { IconProps } from './types.ts';

export function SlidersIcon({ size = 14, ...props }: IconProps) {
  const { colors } = useTheme();
  return (
    <svg
      width={size}
      height={size}
      stroke={colors.fg.primary}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.25 11.667H8.165M5.833 11.667H1.75M12.25 7H7M4.667 7H1.75M12.25 2.333H9.332M7 2.333H1.75M8.166 13.417v-3.5M4.667 8.75v-3.5M9.333 4.083v-3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
