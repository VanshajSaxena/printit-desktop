// d:\Projects\printly-desktop\packages\main\src\modules\WsHandlerModule.ts
import { WsNotificationsApi } from '@app/common';
import { io, Socket } from 'socket.io-client';
import log from 'electron-log';
import { AppModule } from 'src/AppModule.js';
import { ModuleContext } from 'src/ModuleContext.js';

class WsHandlerModule implements AppModule {
  private client: Socket;
  private notificationsApi: WsNotificationsApi;

  constructor() {
    log.info('WsHandlerModule: Initializing...');

    this.client = io('ws://localhost:3000/notifications', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    this.notificationsApi = new WsNotificationsApi();

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      log.info('WsHandlerModule: Connected to server');
      log.info(`WsHandlerModule: Socket ID: ${String(this.client.id)}`);
      this.notificationsApi.handleConnection();
    });
  }

  enable(context: ModuleContext): Promise<void> | void {
    log.info('WsHandlerModule: Module enabled');

    // Cleanup on app quit
    context.app.on('will-quit', () => {
      log.info('WsHandlerModule: App quitting, disconnecting socket...');
      this.client.disconnect();
    });

    // Optional: Handle window close to maintain connection
    context.app.on('window-all-closed', () => {
      log.info('WsHandlerModule: All windows closed');
      // Don't disconnect here if you want to maintain connection
    });
  }
}

export function wsHandlers() {
  return new WsHandlerModule();
}
