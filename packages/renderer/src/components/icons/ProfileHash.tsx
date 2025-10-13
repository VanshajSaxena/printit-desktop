import * as React from 'react';
import type { JSX } from 'react/jsx-runtime';

function ProfileHash(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      width={43}
      height={43}
      viewBox="0 0 43 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width={42.1411} height={42.1411} rx={8} fill="#1F1F1F" />
      <path
        d="M19.31 11l-4.543 20m12.854-20l-4.505 20M11 25.056h18.718m-17.087-8.635H31"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ProfileHash;
