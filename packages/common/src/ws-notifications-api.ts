import { Socket } from 'socket.io-client';
import log from 'electron-log';
class WsService {
  private client: Socket;
  constructor(client: Socket) {
    this.client = client;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      log.info('WsHandlerModule: Socket ID: ', this.client.id);
    });

    this.client.on('connect_error', (error) => {
      log.error('WsHandlerModule: Connection error: ', error.message);
    });

    this.client.on('disconnect', (reason) => {
      log.warn('WsHandlerModule: Disconnected:', reason);
    });

    this.client.on('ping', () => {
      log.warn('WsHandlerModule: Pinged');
    });

    this.client.on('reconnect', (attemptNumber: number) => {
      log.info(`WsHandlerModule: Reconnected after attempts: `, {
        attemptNumber,
      });
    });

    this.client.on('reconnect_attempt', (attemptNumber: number) => {
      log.info(`WsHandlerModule: Reconnection attempt number: `, {
        attemptNumber,
      });
    });

    this.client.on('reconnect_error', (error) => {
      log.info(`WsHandlerModule: Error reconnecting with error: `, error);
    });

    this.client.on('reconnect_failed', () => {
      log.error('WsHandlerModule: Failed to reconnect after maximum attempts');
    });

    this.client.on('new_transactions', () => {
      log.info('WsHandlerModule: New transaction received');
    });
  }

  isActive(): boolean {
    return this.client.active;
  }

  isConnected(): boolean {
    return this.client.connected;
  }

  disconnect(): void {
    if (this.client.connected) {
      this.client.disconnect();
    }
  }
}

export function setupHandlersAndInitializeApi(client: Socket) {
  new WsService(client);
}
