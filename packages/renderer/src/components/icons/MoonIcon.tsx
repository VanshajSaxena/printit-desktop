import type { IconProps } from "./types";

export function MoonIcon({ size = 14, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 1.992a10 10 0 109.236 13.838c.341-.82-.476-1.644-1.298-1.31a6.5 6.5 0 01-6.864-10.787l.077-.08c.551-.63.113-1.653-.758-1.653h-.266l-.068-.006-.06-.002H12z"
        className="fill-secondary-content"
      />
    </svg>
  );
}
