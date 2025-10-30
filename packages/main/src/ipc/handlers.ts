import { IpcMainInvokeEvent } from 'electron';
import type {
  IpcHandler,
  IpcHandlerRegistry,
} from '../modules/IpcHandlersModule.js';
import { PrintServiceApi } from '@app/common';

const api = new PrintServiceApi();

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function createHandler<TArgs extends unknown[], TReturn>(
  handler: (
    event: IpcMainInvokeEvent,
    ...args: TArgs
  ) => Promise<TReturn> | TReturn,
): IpcHandler {
  return handler as IpcHandler;
}

const pingHandler: IpcHandlerRegistry = {
  ping: createHandler(() => {
    return api.ping();
  }),
};

const printServiceHandlers: IpcHandlerRegistry = {
  'printer:list': createHandler(() => {
    return api.getPrintQueues();
  }),

  'printer:printer': createHandler((_event, printQueue: string) => {
    return api.getPrintQueue(printQueue);
  }),

  'printer:capabilities': createHandler((_event, printQueue: string) => {
    return api.getPrintQueueCapabilities(printQueue);
  }),
};

const appHandlers: IpcHandlerRegistry = {
  'app:getVersion': createHandler(async () => {
    const { app } = await import('electron');
    return app.getVersion();
  }),
};

export const allHandlers: IpcHandlerRegistry = {
  ...pingHandler,
  ...printServiceHandlers,
  ...appHandlers,
};
