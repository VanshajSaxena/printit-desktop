import type {
  CloudServiceApi,
  PrintServiceApi,
  WsNotificationsApi,
} from "@app/common";
import { IpcMainInvokeEvent } from "electron";
import type {
  IpcHandler,
  IpcHandlerRegistry,
} from "../modules/IpcHandlersModule.js";
import { getPrintServiceHandlers } from "./print-service-handlers.js";
import { getCloudSeriveHandlers } from "./cloud-service-handlers.js";
import { getWsNotificationSeriveHandlers } from "./ws-notification-handlers.js";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function createHandler<TArgs extends unknown[], TReturn>(
  handler: (
    event: IpcMainInvokeEvent,
    ...args: TArgs
  ) => Promise<TReturn> | TReturn,
): IpcHandler {
  return handler as IpcHandler;
}

export function createIpcHandlers(
  printServiceApi: PrintServiceApi,
  cloudServiceApi: CloudServiceApi,
  webSocketApi: WsNotificationsApi,
) {
  const {
    printServiceHandlers,
    cloudServiceHandlers,
    webSocketNotifications,
  }: {
    printServiceHandlers: IpcHandlerRegistry;
    cloudServiceHandlers: IpcHandlerRegistry;
    webSocketNotifications: IpcHandlerRegistry;
  } = getAllIpcHandlers(printServiceApi, cloudServiceApi, webSocketApi);

  const allHandlers: IpcHandlerRegistry = {
    ...printServiceHandlers,
    ...cloudServiceHandlers,
    ...webSocketNotifications,
  };

  return allHandlers;
}

function getAllIpcHandlers(
  printServiceApi: PrintServiceApi,
  cloudServiceApi: CloudServiceApi,
  webSocketApi: WsNotificationsApi,
) {
  const printServiceHandlers: IpcHandlerRegistry =
    getPrintServiceHandlers(printServiceApi);

  const cloudServiceHandlers: IpcHandlerRegistry =
    getCloudSeriveHandlers(cloudServiceApi);

  const webSocketNotifications: IpcHandlerRegistry =
    getWsNotificationSeriveHandlers(webSocketApi);

  return {
    printServiceHandlers,
    cloudServiceHandlers,
    webSocketNotifications,
  };
}
