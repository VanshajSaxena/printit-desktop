import type { IconProps } from "./types";

export function HistoryIcon({ size = 24, ...props }: IconProps) {
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
        d="M10 20.777a8.94 8.94 0 01-2.48-.97M14 3.224a9.003 9.003 0 010 17.554m-9.421-3.684a8.963 8.963 0 01-1.227-2.592m-.228-4.002c.16-.95.468-1.85.9-2.674l.169-.305m2.714-2.941A8.954 8.954 0 0110 3.223M12 8v4l3 3"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
