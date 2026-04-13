import type { WsNotificationsApi } from "@app/common";
import type { IpcHandlerRegistry } from "src/modules/IpcHandlersModule.js";
import { createHandler } from "./ipc-handlers.js";

export function getWsNotificationSeriveHandlers(
  webSocketApi: WsNotificationsApi,
): IpcHandlerRegistry {
  return {
    "server:is-connected": createHandler(() => {
      return webSocketApi.isConnected();
    }),

    "server:is-active": createHandler(() => {
      return webSocketApi.isActive();
    }),

    "server:disconnect": createHandler(() => {
      webSocketApi.disconnect();
    }),

    "server:connect": createHandler((_event, token: string) => {
      webSocketApi.connect(token);
    }),

    "presence:update": createHandler(
      async (_event, presence: "online" | "offline" | "away") => {
        return await webSocketApi.updatePresence(presence);
      },
    ),
  };
}
