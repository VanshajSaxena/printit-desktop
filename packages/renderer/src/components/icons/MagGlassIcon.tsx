import type { IconProps } from "./types.ts";

export function MagGlassIcon({ size = 24, ...props }: IconProps) {
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
        d="M21 21l-6-6M3 10a7 7 0 1014 0 7 7 0 00-14 0z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
