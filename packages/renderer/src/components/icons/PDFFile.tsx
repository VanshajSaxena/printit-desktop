import * as React from 'react';
import type { JSX } from 'react/jsx-runtime';

export function PDFFile(
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
        d="M8.167 1.75v2.333a.583.583 0 00.583.584h2.333M8.167 1.75H4.083a1.167 1.167 0 00-1.166 1.167V7m5.25-5.25l2.916 2.917m0 0V7m-8.166 3.5h.875a.875.875 0 000-1.75h-.875v3.5m7-1.75h1.166m.584-1.75h-1.75v3.5m-3.5-3.5v3.5H7a1.167 1.167 0 001.167-1.167V9.917A1.167 1.167 0 007 8.75h-.583z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
