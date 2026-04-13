import { type VendorPresenceDto } from "@/api/gen/cloud-api-types";
import { useWsEvent } from "@/hooks/useWsHandler";
import { useAuthStore } from "@/store/useAuthStore";
import {
  connectWebSocket,
  onOAuthComplete,
  updatePresence,
} from "@app/preload";
import { useEffect, useRef, useState } from "react";
import { PresenceContext } from "./PresenceContext";

type Presence = VendorPresenceDto["status"];

const RETRY_DELAYS = [1000, 2000, 4000];

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((store) => store.accessToken);
  const [presence, setPresence] = useState<Presence>("online");
  const [pendingPresence, setPendingPresence] = useState<Presence | null>(null);
  const syncingRef = useRef(false);
  const latestIntentRef = useRef<Presence | null>(null);

  useWsEvent("server:connected", () => {
    setPresence("online");
  });

  useWsEvent("server:disconnected", () => {
    setPresence("offline");
  });

  const changePresence = (next: Presence) => {
    setPresence(next);
    setPendingPresence(next);
    latestIntentRef.current = next;
  };

  const syncWithRetry = async (target: Presence): Promise<boolean> => {
    for (const delay of RETRY_DELAYS) {
      try {
        const res = await updatePresence(target);
        if (res.success) return true;
      } catch {
        // ignore
      }

      await new Promise((r) => setTimeout(r, delay));
    }

    return false;
  };

  useEffect(() => {
    if (!token || !pendingPresence) return;
    if (syncingRef.current) return;
    let cancelled = false;
    const run = async () => {
      syncingRef.current = true;
      const target = pendingPresence;
      const success = await syncWithRetry(target);
      if (cancelled) return;
      syncingRef.current = false;
      if (success) {
        if (latestIntentRef.current === target) {
          setPendingPresence(null);
        }
      } else {
        console.warn("Presence sync failed after retries");
      }
      if (latestIntentRef.current !== target) {
        setPendingPresence(latestIntentRef.current);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [pendingPresence, token]);

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
    <PresenceContext
      value={{
        presence,
        setPresence: changePresence,
      }}
    >
      {children}
    </PresenceContext>
  );
}
