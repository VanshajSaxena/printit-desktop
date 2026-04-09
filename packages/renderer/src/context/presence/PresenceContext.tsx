import type { VendorPresenceDto } from "@/api/gen/cloud-api-types";
import { createContext } from "react";

export interface PresenceContextState {
  presence: VendorPresenceDto["status"];
  setPresence: (presence: VendorPresenceDto["status"]) => void;
}

export const PresenceContext = createContext<PresenceContextState | undefined>(
  undefined,
);
