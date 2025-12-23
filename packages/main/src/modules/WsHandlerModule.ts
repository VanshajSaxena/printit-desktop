import log from "electron-log";
import { AppModule } from "src/AppModule.js";
import { ModuleContext } from "src/ModuleContext.js";
import { WsNotificationsApi } from "@app/common";

class WsHandlerModule implements AppModule {
  api: WsNotificationsApi;

  constructor(api: WsNotificationsApi) {
    log.info("WsHandlerModule: Initializing...");
    this.api = api;
  }

  enable(context: ModuleContext): Promise<void> | void {
    log.info("WsHandlerModule: Module enabled");

    context.app.on("will-quit", () => {
      log.info("WsHandlerModule: App quitting, disconnecting socket...");
      this.api.disconnect();
    });

    context.app.on("window-all-closed", () => {
      log.info("WsHandlerModule: All windows closed");
    });
  }
}

export function wsHandlers(api: WsNotificationsApi) {
  return new WsHandlerModule(api);
}
