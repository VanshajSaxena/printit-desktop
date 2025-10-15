import { useTheme } from '../../context/theme/useTheme';
import type { IconProps } from './types';
export function QRCodeIcon({ size = 14, ...props }: IconProps) {
  const { colors } = useTheme();
  return (
    <svg
      width={size}
      height={size}
      stroke={colors.fg.primary}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7 17v.01M7 7v.01M17 7v.01M17 14h-3v3m6-3v.01M14 20h3m0-3h3v3M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
