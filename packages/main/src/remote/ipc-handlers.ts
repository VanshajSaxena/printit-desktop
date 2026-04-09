import type { PrintServiceApi, WsNotificationsApi } from "@app/common";
import { IpcMainInvokeEvent } from "electron";
import type {
  IpcHandler,
  IpcHandlerRegistry,
} from "../modules/IpcHandlersModule.js";
import { getPrintServiceHandlers } from "./print-service-handlers.js";
import { getWsNotificationSeriveHandlers } from "./ws-notification-handlers.js";
import { getAuthHandlers } from "./auth-service-handlers.js";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function createHandler<TArgs extends unknown[], TReturn>(
  handler: (
    event: IpcMainInvokeEvent,
    ...args: TArgs
  ) => Promise<TReturn> | TReturn,
): IpcHandler {
  return handler as IpcHandler;
}

export function createIpcHandlerRegistry(
  printServiceApi: PrintServiceApi,
  webSocketApi: WsNotificationsApi,
) {
  const authServiceHandlers: IpcHandlerRegistry = getAuthHandlers();

  const printServiceHandlers: IpcHandlerRegistry =
    getPrintServiceHandlers(printServiceApi);

  const webSocketNotifications: IpcHandlerRegistry =
    getWsNotificationSeriveHandlers(webSocketApi);

  const allHandlers: IpcHandlerRegistry = {
    ...printServiceHandlers,
    ...webSocketNotifications,
    ...authServiceHandlers,
  };

  return allHandlers;
}
