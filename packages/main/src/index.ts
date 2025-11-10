import type { AppInitConfig } from './AppInitConfig.js';
import { createModuleRunner } from './ModuleRunner.js';
import { disallowMultipleAppInstance } from './modules/SingleInstanceApp.js';
import { createWindowManagerModule } from './modules/WindowManager.js';
import { terminateAppOnLastWindowClose } from './modules/ApplicationTerminatorOnLastWindowClose.js';
import { hardwareAccelerationMode } from './modules/HardwareAccelerationModule.js';
import { autoUpdater } from './modules/AutoUpdater.js';
import { allowInternalOrigins } from './modules/BlockNotAllowdOrigins.js';
import { allowExternalUrls } from './modules/ExternalUrls.js';
import { startPrintService } from './modules/PrintServiceModule.js';
import { ipcHandlers } from './modules/IpcHandlersModule.js';
import { wsHandlers } from './modules/WsHandlerModule.js';
import log from 'electron-log';
import { createIpcHandlers } from './remote/ipc-handlers.js';
import {
  CloudServiceApi,
  PrintServiceApi,
  WsNotificationsApi,
} from '@app/common';

export async function initApp(initConfig: AppInitConfig) {
  log.info('### Main Process Initialization Started ###');
  const printServiceApi = new PrintServiceApi();
  const cloudServiceApi = new CloudServiceApi();
  const webSocketApi = new WsNotificationsApi({
    url: 'localhost:3000',
    protocol: 'http',
    namespace: `notifications`,
  });
  const allHandlers = createIpcHandlers(
    printServiceApi,
    cloudServiceApi,
    webSocketApi,
  );
  const moduleRunner = createModuleRunner()
    .init(
      createWindowManagerModule({
        initConfig,
        openDevTools: import.meta.env.DEV,
      }),
    )
    .init(disallowMultipleAppInstance())
    .init(terminateAppOnLastWindowClose())
    .init(hardwareAccelerationMode({ enable: false }))
    .init(ipcHandlers(allHandlers))
    .init(wsHandlers(webSocketApi))
    .init(autoUpdater())
    .init(startPrintService({ required: !import.meta.env.DEV }))

    // Install DevTools extension if needed
    // .init(chromeDevToolsExtension({extension: 'VUEJS3_DEVTOOLS'}))

    // Security
    .init(
      allowInternalOrigins(
        new Set(
          initConfig.renderer instanceof URL
            ? [initConfig.renderer.origin]
            : [],
        ),
      ),
    )
    .init(
      allowExternalUrls(
        new Set(
          initConfig.renderer instanceof URL
            ? [
                'https://vite.dev',
                'https://developer.mozilla.org',
                'https://solidjs.com',
                'https://qwik.dev',
                'https://lit.dev',
                'https://react.dev',
                'https://preactjs.com',
                'https://www.typescriptlang.org',
                'https://vuejs.org',
              ]
            : [],
        ),
      ),
    );

  await moduleRunner;

  log.info('### Main Process Initialization Completed ###');
}
