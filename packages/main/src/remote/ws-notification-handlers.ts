import type { WsNotificationsApi } from "@app/common";
import type { IpcHandlerRegistry } from "src/modules/IpcHandlersModule.js";
import { createHandler } from "./ipc-handlers.js";

export function getWsNotificationSeriveHandlers(
  webSocketApi: WsNotificationsApi,
): IpcHandlerRegistry {
  return {
    "ws:is-connected": createHandler(() => {
      return webSocketApi.isConnected();
    }),

    "ws:is-active": createHandler(() => {
      return webSocketApi.isActive();
    }),

    "ws:disconnect": createHandler(() => {
      webSocketApi.disconnect();
    }),
  };
}
