import { useTheme } from '@context/theme/useTheme';
import type { IconProps } from './types.ts';

export function PrinterIcon({ size = 14, ...props }: IconProps) {
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
        d="M9.917 9.917h1.166A1.167 1.167 0 0012.25 8.75V6.417a1.167 1.167 0 00-1.167-1.167H2.917A1.167 1.167 0 001.75 6.417V8.75a1.167 1.167 0 001.167 1.167h1.166M9.917 5.25V2.917A1.167 1.167 0 008.75 1.75h-3.5a1.167 1.167 0 00-1.167 1.167V5.25m0 3.5A1.167 1.167 0 015.25 7.583h3.5A1.167 1.167 0 019.917 8.75v2.333A1.167 1.167 0 018.75 12.25h-3.5a1.167 1.167 0 01-1.167-1.167V8.75z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
