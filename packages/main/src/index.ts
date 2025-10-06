import type { AppInitConfig } from './AppInitConfig.js';
import { createModuleRunner } from './ModuleRunner.js';
import { disallowMultipleAppInstance } from './modules/SingleInstanceApp.js';
import { createWindowManagerModule } from './modules/WindowManager.js';
import { terminateAppOnLastWindowClose } from './modules/ApplicationTerminatorOnLastWindowClose.js';
import { hardwareAccelerationMode } from './modules/HardwareAccelerationModule.js';
import { autoUpdater } from './modules/AutoUpdater.js';
import { allowInternalOrigins } from './modules/BlockNotAllowdOrigins.js';
import { allowExternalUrls } from './modules/ExternalUrls.js';
import { ChildProcess, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import log from 'electron-log';

export async function initApp(initConfig: AppInitConfig) {
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
    .init(autoUpdater())

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

  let printServiceProcess: ChildProcess | null = null;
  function startPrintService() {
    const servicePath = import.meta.env.DEV
      ? path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          '../../../buildResources/PrintService.exe',
        )
      : path.join(process.resourcesPath, 'PrintService.exe');

    printServiceProcess = spawn(servicePath);

    printServiceProcess.on('error', (err) => {
      log.error('Failed to start PrintService:', err);
    });

    printServiceProcess.on('close', (code) => {
      if (code != null) {
        log.info(`PrintService exited with code ${code.toString()}`);
      }
    });
  }
  startPrintService();
  log.info('PrintService Started...');
}
