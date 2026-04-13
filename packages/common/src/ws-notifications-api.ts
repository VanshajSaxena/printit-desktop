import log from "electron-log";
import { EventEmitter } from "events";
import { io, Socket } from "socket.io-client";

export interface WsNotificationsApiConfig {
  url: string;
  protocol: string;
  namespace: string;
  reconnection?: boolean;
  reconnectionAttempt?: number;
  reconnectionDelay?: number;
  debug?: boolean;
}

export interface WebSocketEventMap {
  "presence:update": {
    presence: "online" | "offline" | "away";
  };
  "job:status:updated": {
    transactionId: number;
    jobId: number;
    status: string;
    timestamp: string;
  };
  "job:completed": {
    transactionId: number;
    jobId: number;
    timestamp: string;
  };
  "job:failed": {
    transactionId: number;
    jobId: number;
    timestamp: string;
  };
  "job:incomplete": {
    transactionId: number;
    jobId: number;
    pagesPrinted?: number;
    totalPages?: number;
    timestamp: string;
  };
  "transaction:status:updated": {
    transactionId: number;
    status: string;
    timestamp: string;
  };
  "transaction:completed": {
    transactionId: number;
    timestamp: string;
  };
  "transaction:failed": {
    transactionId: number;
    timestamp: string;
  };
  "milestone:transaction:queued": {
    vendorId: number;
    transactionId: number;
    timestamp: string;
  };
  "milestone:transaction:printing": {
    vendorId: number;
    transactionId: number;
    timestamp: string;
  };
}

export type WebSocketEvent = keyof WebSocketEventMap;

export class WsNotificationsApi extends EventEmitter {
  private client: Socket;
  private config: WsNotificationsApiConfig;
  constructor(config: WsNotificationsApiConfig) {
    super();
    this.config = {
      reconnection: true,
      reconnectionAttempt: 15,
      reconnectionDelay: 10000,
      debug: true,
      ...config,
    };
    log.info("WsNotificationsApi config: ", this.config);
    const uri = `${this.config.protocol}://${this.config.url}/${this.config.namespace}`;
    log.info("WsNotificationsApi: ", uri);

    this.client = io(uri, {
      reconnection: this.config.reconnection,
      reconnectionDelay: this.config.reconnectionDelay,
      reconnectionAttempts: this.config.reconnectionAttempt,
      tryAllTransports: true,
      autoConnect: false,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on("connect", () => {
      log.info("WsHandlerModule: Socket ID: ", this.client.id);
      log.debug(
        "WsHandlerModule: Connected Initial Transport: ",
        this.client.io.engine.transport.name,
      );

      this.client.io.engine.on("upgrade", () => {
        log.info("WsHandlerModule: Upgraded: ", this.client.io.engine.id);
        log.debug(
          "WsHandlerModule: Upgraded New Transport: ",
          this.client.io.engine.transport.name,
        );
      });

      this.emit("server:connected", { socketId: this.client.id });
    });

    this.client.on("connect_error", (error) => {
      log.error("WsHandlerModule: Connection error: ", error.message);
    });

    this.client.on("disconnect", (reason) => {
      log.warn("WsHandlerModule: Disconnected:", reason);
      this.emit("server:disconnected", reason);
    });

    this.client.on("ping", () => {
      log.info("WsHandlerModule: Pinged");
    });

    this.client.on("reconnect", (attemptNumber: number) => {
      log.info(`WsHandlerModule: Reconnected after attempts: `, {
        attemptNumber,
      });
    });

    this.client.on("reconnect_attempt", (attemptNumber: number) => {
      log.info(`WsHandlerModule: Reconnection attempt number: `, {
        attemptNumber,
      });
    });

    this.client.on("reconnect_error", (error) => {
      log.error(`WsHandlerModule: Error reconnecting with error: `, error);
    });

    this.client.on("reconnect_failed", () => {
      log.warn("WsHandlerModule: Failed to reconnect after maximum attempts");
    });

    this.client.on("transaction:new", (data) => {
      log.info("WsHandlerModule: New transaction received");
      this.emit("transaction:new", data);
    });
  }

  emitToServer<K extends WebSocketEvent>(
    eventName: K,
    payload: WebSocketEventMap[K],
  ): void {
    log.info(`WsNotificationsApi: Emitting '${eventName}' to server`, payload);
    this.client.emit(eventName, payload);
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

  connect(token: string): void {
    if (this.client.disconnected) {
      this.client.auth = (cb) => {
        cb({
          clientType: "vendor",
          token: token,
        });
      };
      this.client.connect();
    }
  }

  async updatePresence(
    presence: "online" | "offline" | "away",
  ): Promise<{ success: boolean }> {
    return (await this.client
      .timeout(5000)
      .emitWithAck("presence:update", { presence })) as { success: boolean };
  }
}
