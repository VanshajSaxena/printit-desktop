import { PrintServiceApi, WsNotificationsApi } from "@app/common";
import log from "electron-log";
import type { AppInitConfig } from "./AppInitConfig.js";
import { createModuleRunner } from "./ModuleRunner.js";
import { terminateAppOnLastWindowClose } from "./modules/ApplicationTerminatorOnLastWindowClose.js";
import { autoUpdater } from "./modules/AutoUpdater.js";
import { allowInternalOrigins } from "./modules/BlockNotAllowdOrigins.js";
import { setAsDefaultProtocolClient } from "./modules/DefaultProtocolClient.js";
import { allowExternalUrls } from "./modules/ExternalUrls.js";
import { hardwareAccelerationMode } from "./modules/HardwareAccelerationModule.js";
import { ipcHandlers } from "./modules/IpcHandlersModule.js";
import { startPrintService } from "./modules/PrintServiceModule.js";
import { disallowMultipleAppInstance } from "./modules/SingleInstanceApp.js";
import { createWindowManagerModule } from "./modules/WindowManager.js";
import { wsHandlers } from "./modules/WsHandlerModule.js";
import { wsEventListeners } from "./modules/WsListenerModule.js";
import { createIpcHandlerRegistry } from "./remote/ipc-handlers.js";

const wsNotificationsApiConfig = {
  url: import.meta.env.PROD ? "dev.api.printit.ink" : "dev.api.printit.ink",
  protocol: "https",
  namespace: `notifications`,
};
export async function initApp(initConfig: AppInitConfig) {
  log.info("### Main Process Initialization Started ###");
  const printServiceApi = new PrintServiceApi();
  const webSocketApi = new WsNotificationsApi(wsNotificationsApiConfig);
  const allHandlers = createIpcHandlerRegistry(printServiceApi, webSocketApi);
  const moduleRunner = createModuleRunner()
    .init(
      createWindowManagerModule({
        initConfig,
        openDevTools: import.meta.env.DEV,
      }),
    )
    .init(disallowMultipleAppInstance())
    .init(setAsDefaultProtocolClient(initConfig.preload.protocol))
    .init(terminateAppOnLastWindowClose())
    .init(hardwareAccelerationMode({ enable: false }))
    .init(ipcHandlers(allHandlers))
    .init(wsHandlers(webSocketApi))
    .init(wsEventListeners(webSocketApi))
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
                "https://vite.dev",
                "https://developer.mozilla.org",
                "https://solidjs.com",
                "https://qwik.dev",
                "https://lit.dev",
                "https://react.dev",
                "https://preactjs.com",
                "https://www.typescriptlang.org",
                "https://vuejs.org",
              ]
            : [],
        ),
      ),
    );

  await moduleRunner;

  log.info("### Main Process Initialization Completed ###");
}
