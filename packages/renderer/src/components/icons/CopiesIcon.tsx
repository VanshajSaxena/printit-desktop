import type { IconProps } from './types';

export function CopiesIcon({ ...props }: IconProps) {
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
        d="M3.266 10.807a1.188 1.188 0 01-.6-1.029V3.852c0-.652.534-1.185 1.186-1.185h5.926c.444 0 .686.228.889.593m-5.63 3.358a1.58 1.58 0 011.58-1.58h5.136a1.58 1.58 0 011.58 1.58v5.135a1.58 1.58 0 01-1.58 1.58H6.617a1.58 1.58 0 01-1.58-1.58V6.618z"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
