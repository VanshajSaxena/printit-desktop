import { WsNotificationsApi } from "@app/common";
import { BrowserWindow } from "electron";
import log from "electron-log";
import { AppModule } from "src/AppModule.js";
import { ModuleContext } from "src/ModuleContext.js";

class WsHandlerModule implements AppModule {
  readonly #api: WsNotificationsApi;
  private logger: log.LogFunctions;

  constructor(api: WsNotificationsApi) {
    log.info(`Initializing ${WsHandlerModule.name}...`);
    this.#api = api;
    this.logger = log.scope(WsHandlerModule.name);
  }

  enable(context: ModuleContext): Promise<void> | void {
    context.app.on("will-quit", () => {
      this.logger.info("App quitting, disconnecting socket...");
      this.#api.disconnect();
    });

    context.app.on("window-all-closed", () => {
      this.logger.info("All windows closed");
    });

    this.logger = log.scope(WsNotificationsApi.name);
    this.setupRendererForwarding();
  }

  private setupRendererForwarding() {
    this.#api.on("transaction:new", (data) => {
      this.sendToRenderer("transaction:new", data);
    });
    this.#api.on("server:disconnected", (reason) => {
      this.sendToRenderer("server:disconnected", reason);
    });
    this.#api.on("server:connected", (data) => {
      this.sendToRenderer("server:connected", data);
    });
  }

  private sendToRenderer(channel: string, data: unknown): void {
    const mainWindow = this.getMainWindow();

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(channel, data);
      this.logger.info(`Sent '${channel}' to renderer`);
    } else {
      this.logger.info(`Cannot send '${channel}' - no window available`);
    }
  }

  private getMainWindow(): BrowserWindow | undefined {
    return BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
  }
}

export function wsHandlers(api: WsNotificationsApi) {
  return new WsHandlerModule(api);
}
