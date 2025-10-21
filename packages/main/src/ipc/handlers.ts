import { IpcMainInvokeEvent } from 'electron';
import log from 'electron-log';
import type {
  IpcHandler,
  IpcHandlerRegistry,
} from '../modules/IpcHandlersModule.js';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function createHandler<TArgs extends unknown[], TReturn>(
  handler: (
    event: IpcMainInvokeEvent,
    ...args: TArgs
  ) => Promise<TReturn> | TReturn,
): IpcHandler {
  return handler as IpcHandler;
}

const testHandlers: IpcHandlerRegistry = {
  'test:testFunction': createHandler(() => {
    log.info('### test:testFunction handler ran ###');
    return '### test handler ran ###';
  }),

  'test:echo': createHandler((_event, message: string) => {
    log.info('test:echo called with:', message);
    return `Echo: ${message}`;
  }),
};

const printServiceHandlers: IpcHandlerRegistry = {
  'printer:list': createHandler(() => {
    log.info('printer:list called');
    return [
      { id: 'printer1', name: 'HP LaserJet', status: 'ready' },
      { id: 'printer2', name: 'Canon Inkjet', status: 'offline' },
    ];
  }),

  'printer:print': createHandler(
    (_event, printerId: string, documentPath: string) => {
      log.info(
        `printer:print called: printer=${printerId}, document=${documentPath}`,
      );
      return { success: true, jobId: '12345' };
    },
  ),

  'printer:getStatus': createHandler((_event, printerId: string) => {
    log.info(`printer:getStatus called: printer=${printerId}`);
    return { status: 'ready', queueLength: 0 };
  }),
};

const appHandlers: IpcHandlerRegistry = {
  'app:getVersion': createHandler(async () => {
    const { app } = await import('electron');
    return app.getVersion();
  }),
};

export const allHandlers: IpcHandlerRegistry = {
  ...testHandlers,
  ...printServiceHandlers,
  ...appHandlers,
};
