import * as React from 'react';
import type { JSX } from 'react/jsx-runtime';

export function Reject(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  const { stroke = '#000', ...restProps } = props;
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M3.325 3.325l7.35 7.35M1.75 7a5.25 5.25 0 1010.5 0 5.25 5.25 0 00-10.5 0z"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
