import type { IconProps } from "./types";

export function FileIcon({ ...props }: IconProps) {
  const { size } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className="stroke-secondary-content"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.333 2v2.667a.667.667 0 00.667.666h2.667M9.333 2H4.667a1.333 1.333 0 00-1.334 1.333v9.334A1.333 1.333 0 004.667 14h6.666a1.334 1.334 0 001.334-1.333V5.333M9.333 2l3.334 3.333"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
