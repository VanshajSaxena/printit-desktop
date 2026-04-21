import { AppModule } from "../AppModule.js";
import { ModuleContext } from "../ModuleContext.js";
import { ipcMain, IpcMainInvokeEvent } from "electron";
import log from "electron-log";

export type IpcHandler = (
  event: IpcMainInvokeEvent,
  ...args: unknown[]
) => Promise<unknown>;

export type IpcHandlerRegistry = Record<string, IpcHandler>;

class IpcHandlersModule implements AppModule {
  readonly #handlers: IpcHandlerRegistry;
  private logger: log.LogFunctions;

  constructor(handlers: IpcHandlerRegistry) {
    log.info(`Initializing ${IpcHandlersModule.name}...`);
    this.#handlers = handlers;
    this.logger = log.scope(IpcHandlersModule.name);
  }

  enable(context: ModuleContext): void {
    const registeredChannels: string[] = [];

    for (const [channel, handler] of Object.entries(this.#handlers)) {
      try {
        ipcMain.handle(channel, async (event, ...args: unknown[]) => {
          this.logger.debug(`${channel} called with args:`, args);
          try {
            const result = await handler(event, ...args);
            this.logger.debug(`${channel} returned:`, result);
            return result;
          } catch (error) {
            this.logger.error(`${channel} handler error:`, error);
            throw error;
          }
        });
        registeredChannels.push(channel);
      } catch (error) {
        this.logger.error(`Failed to register ${channel}:`, error);
      }
    }

    this.logger.debug(
      `Registered ${String(registeredChannels.length)} handlers:`,
      registeredChannels,
    );

    context.app.on("will-quit", () => {
      this.logger.info("Cleaning up handlers...");
      registeredChannels.forEach((channel) => {
        ipcMain.removeHandler(channel);
      });
    });
  }
}

export function ipcHandlers(handlers: IpcHandlerRegistry) {
  return new IpcHandlersModule(handlers);
}
