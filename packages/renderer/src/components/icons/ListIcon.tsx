import { useTheme } from '../../context/theme/useTheme';
import type { IconProps } from './types.ts';

export function ListIcon({ size = 14, ...props }: IconProps) {
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
        d="M7.583 2.917h4.667M7.583 5.25H10.5m-2.917 3.5h4.667m-4.667 2.334H10.5M1.75 2.917a.583.583 0 01.583-.583h2.334a.583.583 0 01.583.583V5.25a.583.583 0 01-.583.583H2.333a.583.583 0 01-.583-.583V2.917zm0 5.833a.583.583 0 01.583-.583h2.334a.583.583 0 01.583.583v2.334a.583.583 0 01-.583.583H2.333a.583.583 0 01-.583-.583V8.75z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
