// packages/main/src/modules/WsEventListenerModule.ts
import { ipcMain } from "electron";
import log from "electron-log";
import { AppModule } from "../AppModule.js";
import { ModuleContext } from "../ModuleContext.js";
import { WsNotificationsApi } from "@app/common";
import type { WebSocketEvent, WebSocketEventMap } from "@app/common";

class WsEventListenerModule implements AppModule {
  private api: WsNotificationsApi;
  private logger: log.LogFunctions;

  private events: WebSocketEvent[] = [
    "presence:update",
    "job:status:updated",
    "job:completed",
    "job:failed",
    "job:incomplete",
    "transaction:status:updated",
    "transaction:completed",
    "transaction:failed",
    "milestone:transaction:queued",
    "milestone:transaction:printing",
  ];

  constructor(api: WsNotificationsApi) {
    log.info(`Initializing ${WsEventListenerModule.name}...`);
    this.api = api;
    this.logger = log.scope(WsEventListenerModule.name);
  }

  enable(context: ModuleContext): void {
    this.logger.info("Registering event listeners...");

    this.events.forEach((event) => {
      this.registerListener(event);
    });

    this.logger.info(
      `Registered ${this.events.length.toString()} event listeners`,
    );

    context.app.on("will-quit", () => {
      this.logger.info("Removing event listeners...");
      this.removeAllListeners();
    });
  }

  private registerListener(eventName: WebSocketEvent): void {
    ipcMain.on(
      eventName,
      (_event, payload: WebSocketEventMap[WebSocketEvent]) => {
        this.logger.info(`Received '${eventName}' from renderer`, payload);

        this.api.emitToServer(eventName, payload);
      },
    );
  }

  private removeAllListeners(): void {
    this.events.forEach((event) => {
      ipcMain.removeAllListeners(event);
    });
  }
}

export function wsEventListeners(api: WsNotificationsApi) {
  return new WsEventListenerModule(api);
}
