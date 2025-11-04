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
      reconnectionAttempts: 15,
      reconnectionDelay: 5000,
    });

    this.notificationsApi = new WsNotificationsApi();

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      log.info(`WsHandlerModule: Socket ID: ${String(this.client.id)}`);
      this.notificationsApi.handleConnection();
    });

    this.client.on('connect_error', (error) => {
      log.error('WsHandlerModule: Connection error:', error.message);
      this.notificationsApi.handleConnectError();
    });

    this.client.on('disconnect', (reason) => {
      log.warn('WsHandlerModule: Disconnected:', reason);
      this.notificationsApi.handleDisconnection();
    });

    this.client.on('ping', () => {
      log.warn('WsHandlerModule: Pinged');
      this.notificationsApi.handlePing();
    });

    this.client.on('reconnect', (attemptNumber) => {
      log.info(
        `WsHandlerModule: Reconnected after ${String(attemptNumber)} attempts`,
      );
      this.notificationsApi.handleReconnect();
    });

    this.client.on('reconnect_attempt', (attemptNumber) => {
      log.info(
        `WsHandlerModule: Reconnection attempt ${String(attemptNumber)}`,
      );
      this.notificationsApi.handleReconnectAttempt();
    });

    this.client.on('reconnect_error', (error) => {
      log.info(
        `WsHandlerModule: Error reconnecting with error ${String(error)}`,
      );
      this.notificationsApi.handleReconnectError();
    });

    this.client.on('reconnect_failed', () => {
      log.error('WsHandlerModule: Failed to reconnect after maximum attempts');
      this.notificationsApi.handleReconnectFailed();
    });

    this.client.on('notification', () => {
      log.info('WsHandlerModule: Received notification:');
      this.notificationsApi.handleNotification();
    });
  }

  enable(context: ModuleContext): Promise<void> | void {
    log.info('WsHandlerModule: Module enabled');

    context.app.on('will-quit', () => {
      log.info('WsHandlerModule: App quitting, disconnecting socket...');
      this.client.disconnect();
    });

    context.app.on('window-all-closed', () => {
      log.info('WsHandlerModule: All windows closed');
    });
  }
}

export function wsHandlers() {
  return new WsHandlerModule();
}
