import type { IconProps } from "./types";

export function ColorPalatteIcon({ ...props }: IconProps) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 16 16"
      className="stroke-secondary-content"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.053 9.193A3.995 3.995 0 018 13.64m0 0a3.953 3.953 0 01-2.667 1.026c-2.206 0-4-1.793-4-4a4.01 4.01 0 012.947-3.86M8 13.64a3.953 3.953 0 002.667 1.026c2.206 0 4-1.793 4-4a4.01 4.01 0 00-2.947-3.86M4 5.333a4 4 0 108 0 4 4 0 00-8 0z"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
