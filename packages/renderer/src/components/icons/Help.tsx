import * as React from 'react';
import type { JSX } from 'react/jsx-runtime';

export function Help(
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
      <g
        clipPath="url(#clip0_120_16211)"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 12.83A5.833 5.833 0 107 1.163 5.833 5.833 0 007 12.83z" />
        <path d="M5.306 5.252a1.75 1.75 0 013.401.584c0 1.166-1.75 1.75-1.75 1.75M7.002 9.913h.003" />
      </g>
      <defs>
        <clipPath id="clip0_120_16211">
          <path fill={stroke} d="M0 0H14V14H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
