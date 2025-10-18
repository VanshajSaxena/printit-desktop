import { AppModule } from '../AppModule.js';
import { ModuleContext } from '../ModuleContext.js';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import log from 'electron-log';

/**
 * Generic IPC handler that accepts any arguments and returns any type
 */
export type IpcHandler = (
  event: IpcMainInvokeEvent,
  ...args: any[]
) => Promise<any> | any;

/**
 * IPC channel registry - maps channel names to their handlers
 */
export type IpcHandlerRegistry = Record<string, IpcHandler>;

/**
 * Module responsible for registering all IPC handlers
 */
class IpcHandlersModule implements AppModule {
  readonly #handlers: IpcHandlerRegistry;

  constructor(handlers: IpcHandlerRegistry) {
    this.#handlers = handlers;
  }

  enable(context: ModuleContext): void {
    log.info('IpcHandlersModule: Registering handlers...');

    const registeredChannels: string[] = [];

    // Register all handlers
    for (const [channel, handler] of Object.entries(this.#handlers)) {
      try {
        ipcMain.handle(channel, async (event, ...args) => {
          log.debug(`IPC: ${channel} called with args:`, args);
          try {
            const result = await handler(event, ...args);
            log.debug(`IPC: ${channel} returned:`, result);
            return result;
          } catch (error) {
            log.error(`IPC: ${channel} handler error:`, error);
            throw error;
          }
        });
        registeredChannels.push(channel);
      } catch (error) {
        log.error(`IpcHandlersModule: Failed to register ${channel}:`, error);
      }
    }

    log.info(
      `IpcHandlersModule: Registered ${registeredChannels.length} handlers:`,
      registeredChannels,
    );

    // Cleanup on app quit
    context.app.on('will-quit', () => {
      log.info('IpcHandlersModule: Cleaning up handlers...');
      registeredChannels.forEach((channel) => {
        ipcMain.removeHandler(channel);
      });
    });
  }
}

export function ipcHandlers(handlers: IpcHandlerRegistry) {
  return new IpcHandlersModule(handlers);
}
