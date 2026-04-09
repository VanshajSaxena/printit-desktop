import { type VendorPresenceDto } from "@/api/gen/cloud-api-types";
import { useWsEvent } from "@/hooks/useWsHandler";
import { connectWebSocket, onOAuthComplete } from "@app/preload";
import { useEffect, useState } from "react";
import { PresenceContext } from "./PresenceContext";
import { useAuthStore } from "@/store/useAuthStore";

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((store) => store.accessToken);
  const [presence, setPresence] =
    useState<VendorPresenceDto["status"]>("offline");
  useWsEvent("server:connected", () => {
    setPresence("online");
  });
  useWsEvent("server:disconnected", () => {
    setPresence("offline");
  });
  useEffect(() => {
    onOAuthComplete(() => {
      if (token) {
        connectWebSocket(token).catch(console.error);
      }
    });

    if (token) {
      connectWebSocket(token).catch(console.error);
    }
  }, [token]);

  return (
    <PresenceContext value={{ presence, setPresence }}>
      {children}
    </PresenceContext>
  );
}
