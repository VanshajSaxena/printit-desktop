import { useTheme } from '../../context/theme/useTheme';
import type { IconProps } from './types';

function DiamondIcon({ ...props }: IconProps) {
  const { colors } = useTheme();
  return (
    <svg
      width={11}
      height={18}
      viewBox="0 0 11 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 5.571L5.413 1 .826 5.571M.826 12.429L5.413 17 10 12.429"
        stroke={colors.fg.tertiary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default DiamondIcon;
