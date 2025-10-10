import * as React from 'react';
import type { JSX } from 'react/jsx-runtime';

export function FileInfo(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.167 1.75v2.333a.583.583 0 00.583.584h2.333M8.167 1.75H4.083a1.167 1.167 0 00-1.166 1.167v8.166a1.167 1.167 0 001.166 1.167h5.834a1.167 1.167 0 001.166-1.167V4.667M8.167 1.75l2.916 2.917m-4.666 3.5H7V10.5h.583M7 6.417h.006"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
