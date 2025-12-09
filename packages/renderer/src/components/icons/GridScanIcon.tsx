import type { IconProps } from "./types";

export function GridScanIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      className="stroke-secondary-content"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.5 6v6m3-6v6M6 7.5h6m-6 3h6M3 6V4.5A1.5 1.5 0 014.5 3H6m-3 9v1.5A1.5 1.5 0 004.5 15H6m6-12h1.5A1.5 1.5 0 0115 4.5V6m-3 9h1.5a1.5 1.5 0 001.5-1.5V12"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
