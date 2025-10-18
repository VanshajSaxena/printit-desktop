// packages/main/src/ipc/handlers.ts
import { IpcMainInvokeEvent } from 'electron';
import log from 'electron-log';
import type { IpcHandlerRegistry } from '../modules/IpcHandlersModule.js';

// Import your API from common workspace when ready
// import * as PrintServiceAPI from '@printly/common';

/**
 * Helper to create a typed handler
 * This preserves type information while satisfying IpcHandler signature
 */
function createHandler<TArgs extends any[], TReturn>(
  handler: (
    event: IpcMainInvokeEvent,
    ...args: TArgs
  ) => Promise<TReturn> | TReturn,
): (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any {
  return handler;
}

/**
 * Test handlers
 */
export const testHandlers: IpcHandlerRegistry = {
  'test:testFunction': createHandler(async () => {
    log.info('### test:testFunction handler ran ###');
    return '### handler ran ###';
  }),

  'test:echo': createHandler(async (_event, message: string) => {
    log.info('test:echo called with:', message);
    return `Echo: ${message}`;
  }),
};

/**
 * Print service handlers
 * These will eventually call your PrintService API
 */
export const printServiceHandlers: IpcHandlerRegistry = {
  'printer:list': createHandler(async () => {
    log.info('printer:list called');
    // TODO: Call PrintServiceAPI.listPrinters()
    // return await PrintServiceAPI.listPrinters();
    return [
      { id: 'printer1', name: 'HP LaserJet', status: 'ready' },
      { id: 'printer2', name: 'Canon Inkjet', status: 'offline' },
    ];
  }),

  'printer:print': createHandler(
    async (_event, printerId: string, documentPath: string) => {
      log.info(
        `printer:print called: printer=${printerId}, document=${documentPath}`,
      );
      // TODO: Call PrintServiceAPI.print()
      // return await PrintServiceAPI.print(printerId, documentPath);
      return { success: true, jobId: '12345' };
    },
  ),

  'printer:getStatus': createHandler(async (_event, printerId: string) => {
    log.info(`printer:getStatus called: printer=${printerId}`);
    // TODO: Call PrintServiceAPI.getStatus()
    // return await PrintServiceAPI.getStatus(printerId);
    return { status: 'ready', queueLength: 0 };
  }),
};

/**
 * Application handlers
 */
export const appHandlers: IpcHandlerRegistry = {
  'app:getVersion': createHandler(async () => {
    const { app } = await import('electron');
    return app.getVersion();
  }),

  'app:getPath': createHandler(async (_event, name: string) => {
    const { app } = await import('electron');
    return app.getPath(name as any);
  }),
};

/**
 * Combine all handlers
 */
export const allHandlers: IpcHandlerRegistry = {
  ...testHandlers,
  ...printServiceHandlers,
  ...appHandlers,
};
