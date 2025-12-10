import type { IconProps } from "./types.ts";

export function TrashXIcon({ size = 24, ...props }: IconProps) {
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
        d="M4 7h16M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-5 5l4 4m0-4l-4 4"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
