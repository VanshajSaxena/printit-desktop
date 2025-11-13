import { useTheme } from '@context/theme/useTheme';
import type { DotIconProps } from './types';

export function DotIcon({ type }: DotIconProps) {
  const { colors } = useTheme();
  let outerFill = '';
  let innerFill = '';

  switch (type) {
    case 'green':
      outerFill = colors.bg.status.success;
      innerFill = colors.fg.status.success;
      break;
    case 'gray':
      outerFill = colors.bg.status.waiting;
      innerFill = colors.fg.status.waiting;
      break;
    default:
      break;
  }

  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={12} cy={12} r={7} fill={outerFill} />
      <circle cx={12} cy={12.0002} r={2.91667} fill={innerFill} />
    </svg>
  );
}
