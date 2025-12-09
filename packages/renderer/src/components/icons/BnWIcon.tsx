import type { IconProps } from "./types";

export function BnWIcon({ ...props }: IconProps) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 16 16"
      className="fill-secondary-content"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M13.333 3.211c0-.3-.243-.544-.544-.544H3.211c-.3 0-.544.244-.544.544v9.578c0 .301.243.545.544.545h9.578c.3 0 .544-.244.544-.545V3.211zM8 12.21H3.791V3.828H8v8.38z" />
    </svg>
  );
}
