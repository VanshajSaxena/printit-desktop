import log from "electron-log";
import { AppModule } from "src/AppModule.js";
import { ModuleContext } from "src/ModuleContext.js";
import { WsNotificationsApi } from "@app/common";
import { BrowserWindow } from "electron";
import { EventEmitter } from "node:events";

class WsHandlerModule implements AppModule {
  readonly #api: WsNotificationsApi;

  constructor(api: WsNotificationsApi) {
    log.info("WsHandlerModule: Initializing...");
    this.#api = api;
  }

  enable(context: ModuleContext): Promise<void> | void {
    log.info("WsHandlerModule: Module enabled");

    context.app.on("will-quit", () => {
      log.info("WsHandlerModule: App quitting, disconnecting socket...");
      this.#api.disconnect();
    });

    context.app.on("window-all-closed", () => {
      log.info("WsHandlerModule: All windows closed");
    });

    console.log("api is EventEmitter:", this.#api instanceof EventEmitter);
    console.log("on exists:", typeof this.#api.on);
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
      log.info(`WsHandlerModule: Sent '${channel}' to renderer`);
    } else {
      log.warn(
        `WsHandlerModule: Cannot send '${channel}' - no window available`,
      );
    }
  }

  private getMainWindow(): BrowserWindow | undefined {
    return BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
  }
}

export function wsHandlers(api: WsNotificationsApi) {
  return new WsHandlerModule(api);
}
