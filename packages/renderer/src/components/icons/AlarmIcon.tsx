import type { IconProps } from "./types.ts";

export function AlarmIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 10v3h2M7 4L4.25 6M17 4l2.75 2M5 13a7 7 0 1014 0 7 7 0 00-14 0z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
