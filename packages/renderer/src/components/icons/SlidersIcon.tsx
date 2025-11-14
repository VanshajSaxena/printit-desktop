import type { IconProps } from './types.ts';

export function SlidersIcon({ size = 14, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 6a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0H4m12 0h4M6 12a2 2 0 004 0m-4 0a2 2 0 014 0m-4 0H4m6 0h10m-5 6a2 2 0 004 0m-4 0a2 2 0 014 0m-4 0H4m15 0h1"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
