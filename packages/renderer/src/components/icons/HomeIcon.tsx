import type { IconProps } from "./types";

export function HomeIcon({ size = 24, ...props }: IconProps) {
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
        d="M18.326 9.28l1.392 1.549c.181.202.282.465.282.737v6.736a2.206 2.206 0 01-2.206 2.206H6.206A2.206 2.206 0 014 18.302v-6.987c0-.31.13-.605.359-.814l6.212-5.677a2.206 2.206 0 012.922-.047l2.726 2.332c.048.041.121.007.121-.056V5.282m-7.274 11.97h5.511"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
