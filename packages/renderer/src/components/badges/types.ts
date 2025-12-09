import type { ReactNode } from "react";

export interface BadgeProps {
  icon?: ReactNode;
  label?: string;
  count?: string | number;
}
