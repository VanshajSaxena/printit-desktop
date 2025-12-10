import clsx from "clsx";
import type { ButtonProps } from "./types";

export function Button({
  size,
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "group inline-flex h-fit w-fit items-center gap-2 rounded-xl transition-colors duration-100",
        size === "md"
          ? "px-3 py-1.75 text-sm leading-5"
          : "px-3 py-2 text-base leading-6",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
