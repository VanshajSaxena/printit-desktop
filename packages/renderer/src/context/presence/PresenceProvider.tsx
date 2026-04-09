import { type VendorPresenceDto } from "@/api/gen/cloud-api-types";
import { useWsEvent } from "@/hooks/useWsHandler";
import { useEffect, useState } from "react";
import { PresenceContext } from "./PresenceContext";
import { isWebSocketConnected } from "@app/preload";

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [presence, setPresence] =
    useState<VendorPresenceDto["status"]>("offline");
  useWsEvent("server:connected", () => {
    setPresence("online");
  });
  useWsEvent("server:disconnected", () => {
    setPresence("offline");
  });
  useEffect(() => {
    let isMounted = true;
    const checkWebSocket = async () => {
      try {
        const result = await isWebSocketConnected();
        if (isMounted) setPresence(result ? "online" : "offline");
      } catch (error) {
        console.error(error);
        if (isMounted) setPresence("offline");
      }
    };
    checkWebSocket().catch((error: unknown) => {
      console.log(error);
    });
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <PresenceContext value={{ presence, setPresence }}>
      {children}
    </PresenceContext>
  );
}
