import { type VendorPresenceDto } from "@/api/gen/cloud-api-types";
import { useWsEvent } from "@/hooks/useWsHandler";
import { useAuthStore } from "@/store/useAuthStore";
import {
  connectWebSocket,
  emitWebSocketEvent,
  onOAuthComplete,
} from "@app/preload";
import { useEffect, useState } from "react";
import { PresenceContext } from "./PresenceContext";

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((store) => store.accessToken);
  const [presence, setPresence] =
    useState<VendorPresenceDto["status"]>("online");
  useWsEvent("server:connected", () => {
    setPresence("online");
  });
  useWsEvent("server:disconnected", () => {
    setPresence("offline");
  });

  useEffect(() => {
    if (token) {
      emitWebSocketEvent("presence:update", { presence });
    }
  }, [presence, token]);

  useEffect(() => {
    const handleConnect = () => {
      if (token) connectWebSocket(token).catch(console.error);
    };

    const unsubscribe = onOAuthComplete(handleConnect);

    if (token) {
      connectWebSocket(token).catch(console.error);
    }

    return () => {
      unsubscribe();
    };
  }, [token]);

  return (
    <PresenceContext value={{ presence, setPresence }}>
      {children}
    </PresenceContext>
  );
}
