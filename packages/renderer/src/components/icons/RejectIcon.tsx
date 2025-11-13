import type { IconProps } from './types.ts';

export function RejectIcon({ size = 14, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      stroke="currentColor"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.325 3.325l7.35 7.35M1.75 7a5.25 5.25 0 1010.5 0 5.25 5.25 0 00-10.5 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
