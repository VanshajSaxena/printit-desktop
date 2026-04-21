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
  private logger: log.LogFunctions;

  constructor(config: WsNotificationsApiConfig) {
    super();
    this.config = {
      reconnection: true,
      reconnectionAttempt: 15,
      reconnectionDelay: 10000,
      debug: true,
      ...config,
    };
    log.info(
      `Initializing ${WsNotificationsApi.name} with the following options:`,
      this.config,
    );
    this.logger = log.scope(WsNotificationsApi.name);
    const uri = `${this.config.protocol}://${this.config.url}/${this.config.namespace}`;
    this.logger.verbose(`${WsNotificationsApi.name}: `, uri);

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
      this.logger.verbose("Socket ID: ", this.client.id);
      this.logger.debug(
        "Connected Initial Transport: ",
        this.client.io.engine.transport.name,
      );

      this.client.io.engine.on("upgrade", () => {
        this.logger.verbose("Upgraded: ", this.client.io.engine.id);
        this.logger.debug(
          "Upgraded New Transport: ",
          this.client.io.engine.transport.name,
        );
      });

      this.emit("server:connected", { socketId: this.client.id });
    });

    this.client.on("connect_error", (error) => {
      this.logger.error("Connection error: ", error.message);
    });

    this.client.on("disconnect", (reason) => {
      this.logger.verbose("Disconnected:", reason);
      this.emit("server:disconnected", reason);
    });

    this.client.on("ping", () => {
      this.logger.verbose("Pinged");
    });

    this.client.on("reconnect", (attemptNumber: number) => {
      this.logger.verbose(`Reconnected after attempts: `, {
        attemptNumber,
      });
    });

    this.client.on("reconnect_attempt", (attemptNumber: number) => {
      this.logger.verbose(`Reconnection attempt number: `, {
        attemptNumber,
      });
    });

    this.client.on("reconnect_error", (error) => {
      this.logger.error(`Error reconnecting with error: `, error);
    });

    this.client.on("reconnect_failed", () => {
      this.logger.warn("Failed to reconnect after maximum attempts");
    });

    this.client.on("transaction:new", (data) => {
      this.logger.info("New transaction received");
      this.emit("transaction:new", data);
    });
  }

  emitToServer<K extends WebSocketEvent>(
    eventName: K,
    payload: WebSocketEventMap[K],
  ): void {
    this.logger.info(`Emitting '${eventName}' to server`, payload);
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
