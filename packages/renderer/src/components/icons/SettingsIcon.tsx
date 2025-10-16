import { useTheme } from '@context/theme/useTheme';
import type { IconProps } from './types';

export function SettingsIcon({ size = 14, ...props }: IconProps) {
  const { colors } = useTheme();
  return (
    <svg
      width={size}
      height={size}
      stroke={colors.fg.primary}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.444 10.123l-5.086 5.03m0-5.03l5.086 5.03M8.024 4.675H6.62A2.62 2.62 0 004 7.295V8.84m11.753-4.166h1.628A2.62 2.62 0 0120 7.295V8.84M4 16.508v1.547a2.62 2.62 0 002.62 2.62h1.43m7.703 0h1.628A2.62 2.62 0 0020 18.055V16.36"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
