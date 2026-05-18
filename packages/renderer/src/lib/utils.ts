import type { TransactionStore } from "@/store/structure";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const selectDefaultQueue = (state: TransactionStore) =>
  Object.values(state.state.printQueues).find((q) => q.default);
