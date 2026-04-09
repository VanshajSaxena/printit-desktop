import { use } from "react";
import { PresenceContext } from "./PresenceContext";

export function usePresence() {
  const context = use(PresenceContext);
  if (!context) {
    throw new Error("usePresence must be used within ThemeProvider");
  }
  return context;
}
