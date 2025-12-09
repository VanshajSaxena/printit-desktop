import type { IconProps } from "./types.ts";

export function ListIconFile({ size = 14, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className="stroke-primary-content"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14 3v4a1 1 0 001 1h4m-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8m-5-5l5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
