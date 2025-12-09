import type { IconProps } from "./types";

export function DiamondIcon({ ...props }: IconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.587 8.571L12 4 7.413 8.571M7.413 15.429L12 20l4.587-4.571"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
