import { useTheme } from '../../context/theme/useTheme';
import type { IconProps } from './types.ts';

export function QRCodeIcon({ size = 14, ...props }: IconProps) {
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
        d="M4.083 9.916v.006m0-5.839v.006m5.834-.006v.006m0 4.077h-1.75v1.75m3.5-1.75v.006m-3.5 3.494h1.75m0-1.75h1.75v1.75m-9.334-8.75a.583.583 0 01.584-.583H5.25a.583.583 0 01.583.583V5.25a.583.583 0 01-.583.583H2.917a.583.583 0 01-.584-.583V2.916zm5.834 0a.583.583 0 01.583-.583h2.333a.583.583 0 01.584.583V5.25a.583.583 0 01-.584.583H8.75a.583.583 0 01-.583-.583V2.916zM2.333 8.75a.583.583 0 01.584-.584H5.25a.583.583 0 01.583.584v2.333a.583.583 0 01-.583.583H2.917a.583.583 0 01-.584-.583V8.75z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
