import { IpcMainInvokeEvent } from 'electron';
import type {
  IpcHandler,
  IpcHandlerRegistry,
} from '../modules/IpcHandlersModule.js';
import type {
  CloudServiceApi,
  PrintServiceApi,
  WsNotificationsApi,
} from '@app/common';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function createHandler<TArgs extends unknown[], TReturn>(
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
  const pingHandler: IpcHandlerRegistry = {
    'ps:ping': createHandler(() => {
      return printServiceApi.ping();
    }),
    'cs:ping': createHandler(() => {
      return cloudServiceApi.ping();
    }),
  };

  const printServiceHandlers: IpcHandlerRegistry = {
    'printer:list': createHandler(() => {
      return printServiceApi.getPrintQueues();
    }),

    'printer:printer': createHandler((_event, printQueue: string) => {
      return printServiceApi.getPrintQueue(printQueue);
    }),

    'printer:capabilities': createHandler((_event, printQueue: string) => {
      return printServiceApi.getPrintQueueCapabilities(printQueue);
    }),
  };

  const cloudServiceHandlers: IpcHandlerRegistry = {
    'cs:transactions:get': createHandler(async () => {
      return cloudServiceApi.getTransactions();
    }),
  };

  const webSocketNotifications: IpcHandlerRegistry = {
    'ws:is-connected': createHandler(() => {
      return webSocketApi.isConnected();
    }),

    'ws:is-active': createHandler(() => {
      return webSocketApi.isActive();
    }),

    'ws:disconnect': createHandler(() => {
      webSocketApi.disconnect();
    }),
  };

  const appHandlers: IpcHandlerRegistry = {
    'app:getVersion': createHandler(async () => {
      const { app } = await import('electron');
      return app.getVersion();
    }),
  };

  const allHandlers: IpcHandlerRegistry = {
    ...pingHandler,
    ...printServiceHandlers,
    ...cloudServiceHandlers,
    ...appHandlers,
    ...webSocketNotifications,
  };

  return allHandlers;
}
