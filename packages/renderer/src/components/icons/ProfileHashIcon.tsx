import { useWsEvent } from "src/hooks/useWsHandler.ts";
import { useEffect, useState } from "react";
import type { IconProps } from "./types.ts";
import { isWebSocketConnected } from "@app/preload";

function ProfileHash({ size, ...props }: IconProps) {
  const [connected, setConnected] = useState(false);

  useWsEvent("ws:disconnected", ({ reason }) => {
    console.log(reason);
    setConnected(false);
  });
  useWsEvent("ws:connected", ({ socketId }) => {
    console.log(socketId);
    setConnected(true);
  });

  useEffect(() => {
    let isMounted = true;

    const checkWebSocket = async () => {
      try {
        const result = await isWebSocketConnected();
        if (isMounted) setConnected(result);
      } catch (error) {
        console.error(error);
        if (isMounted) setConnected(false);
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
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
      {...props}
    >
      <rect width={size} height={size} rx={8} className="fill-tertiary" />

      {connected && <circle cx="36" cy="36" r="5" className="fill-green-600" />}

      <path
        d="M18.31 10l-4.543 20m12.854-20l-4.505 20M10 24.056h18.718m-17.087-8.635H30"
        className="stroke-primary-content"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ProfileHash;
