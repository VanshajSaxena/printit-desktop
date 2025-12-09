import type { DotIconProps } from "./types";

export function DotIcon({ type }: DotIconProps) {
  let outerFill = "";
  let innerFill = "";

  switch (type) {
    case "green":
      outerFill = "fill-success";
      innerFill = "fill-success-content";
      break;
    case "gray":
      outerFill = "fill-waiting";
      innerFill = "fill-waiting-content";
      break;
    default:
      break;
  }

  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={12} cy={12} r={7} className={outerFill} />
      <circle cx={12} cy={12.0002} r={2.91667} className={innerFill} />
    </svg>
  );
}
