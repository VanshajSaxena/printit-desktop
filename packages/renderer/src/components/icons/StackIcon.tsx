import type { IconProps } from "./types.ts";

export function StackIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="stroke-secondary-content"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 12l8 4 8-4M4 16l8 4 8-4M12 4L4 8l8 4 8-4-8-4z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
