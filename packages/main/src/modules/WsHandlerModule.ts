import { io, Socket } from 'socket.io-client';
import log from 'electron-log';
import { AppModule } from 'src/AppModule.js';
import { ModuleContext } from 'src/ModuleContext.js';
import { setupHandlersAndInitializeApi } from '@app/common';

export interface WsHandlerModuleConfig {
  urlWithoutProtocol: string;
  namespace: string;
  reconnection?: boolean;
  reconnectionAttempt?: number;
  reconnectionDelay?: number;
  debug?: boolean;
}

class WsHandlerModule implements AppModule {
  private client: Socket;
  private config: WsHandlerModuleConfig;

  constructor(
    config: WsHandlerModuleConfig = {
      urlWithoutProtocol: `localhost:3000`,
      namespace: `notifications`,
    },
  ) {
    log.info('WsHandlerModule: Initializing...');
    this.config = config;

    this.client = io(
      `ws://${this.config.urlWithoutProtocol}/${this.config.namespace}`,
      {
        reconnection: config.reconnection ?? true,
        reconnectionAttempts: config.reconnectionAttempt ?? 15,
        reconnectionDelay: config.reconnectionDelay ?? 10000,
      },
    );

    setupHandlersAndInitializeApi(this.client);
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

export function wsHandlers(config?: WsHandlerModuleConfig) {
  return new WsHandlerModule(config);
}
