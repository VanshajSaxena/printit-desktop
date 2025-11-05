import { io, Socket } from 'socket.io-client';
import log from 'electron-log';
import { Fetch, WebSocket, WebTransport, XHR } from 'engine.io-client';
import debug from 'debug';

export interface WsNotificationsApiConfig {
  url: string;
  namespace: string;
  reconnection?: boolean;
  reconnectionAttempt?: number;
  reconnectionDelay?: number;
  debug?: boolean;
}

export class WsNotificationsApi {
  private client: Socket;
  private config: WsNotificationsApiConfig;
  constructor(config: WsNotificationsApiConfig) {
    this.config = {
      reconnection: true,
      reconnectionAttempt: 15,
      reconnectionDelay: 10000,
      debug: true,
      ...config,
    };
    if (this.config.debug) {
      log.info(
        'WsNotificationsApi: Enabling socket.io-client debug logging...',
      );
      debug.log = log.debug.bind(log);
      debug.enable('socket.io-client:*');
    }

    log.info('WsNotificationsApi: ', this.config);
    const uri = `http://${this.config.url}/${this.config.namespace}`;
    log.info('WsNotificationsApi: ', uri);

    this.client = io(uri, {
      reconnection: this.config.reconnection,
      reconnectionDelay: this.config.reconnectionDelay,
      reconnectionAttempts: this.config.reconnectionAttempt,
      transports: [XHR, Fetch, WebSocket, WebTransport],
      tryAllTransports: true,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      log.info('WsHandlerModule: Socket ID: ', this.client.id);
      log.debug(
        'WsHandlerModule: Connected Initial Transport: ',
        this.client.io.engine.transport.name,
      );
    });

    this.client.io.engine.on('upgrade', () => {
      log.info('WsHandlerModule: Upgraded: ', this.client.io.engine.id);
      log.debug(
        'WsHandlerModule: Upgraded New Transport: ',
        this.client.io.engine.transport.name,
      );
    });

    this.client.on('connect_error', (error) => {
      log.error('WsHandlerModule: Connection error: ', error.message);
    });

    this.client.on('disconnect', (reason) => {
      log.warn('WsHandlerModule: Disconnected:', reason);
    });

    this.client.on('ping', () => {
      log.info('WsHandlerModule: Pinged');
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
      log.error(`WsHandlerModule: Error reconnecting with error: `, error);
    });

    this.client.on('reconnect_failed', () => {
      log.warn('WsHandlerModule: Failed to reconnect after maximum attempts');
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
