import { useTheme } from '../../context/theme/useTheme';
import type { IconProps } from './types.ts';

export function GearIcon({ size = 14, ...props }: IconProps) {
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
      <g
        clipPath="url(#clip0_104_4752)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 8.751a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5z" />
        <path d="M11.318 8.75a.962.962 0 00.193 1.061l.035.035a1.166 1.166 0 11-1.651 1.651l-.035-.035a.962.962 0 00-1.062-.192.962.962 0 00-.583.88v.1a1.167 1.167 0 01-2.333 0v-.053a.962.962 0 00-.63-.88.963.963 0 00-1.062.192l-.035.035a1.166 1.166 0 11-1.65-1.651l.034-.035a.962.962 0 00.193-1.062.963.963 0 00-.881-.583h-.1a1.167 1.167 0 010-2.333h.053a.962.962 0 00.881-.63.962.962 0 00-.193-1.062l-.035-.035a1.167 1.167 0 111.651-1.65l.035.034a.963.963 0 001.062.193h.047a.963.963 0 00.583-.881v-.1a1.167 1.167 0 012.333 0v.053a.962.962 0 00.584.881.962.962 0 001.061-.192l.035-.035a1.167 1.167 0 111.651 1.65l-.035.035a.962.962 0 00-.192 1.062v.047a.963.963 0 00.88.583h.1a1.167 1.167 0 010 2.333h-.053a.963.963 0 00-.88.584z" />
      </g>
      <defs>
        <clipPath id="clip0_104_4752">
          <path d="M0 0H14V14H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
