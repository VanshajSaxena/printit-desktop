import {
  subscribeToWsEvent,
  type WsChannel,
  type WsChannelTypeMap,
} from "@app/preload";
import { useEffect } from "react";

export function useWsEvent<C extends WsChannel>(
  channel: C,
  handler: (data: WsChannelTypeMap[C]) => void,
) {
  useEffect(() => {
    const subscribe = subscribeToWsEvent;

    const unsubscribe = subscribe(channel, handler);
    return () => {
      unsubscribe();
    };
  }, [channel, handler]);
}
