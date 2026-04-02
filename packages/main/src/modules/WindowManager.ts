import type { AppModule } from "../AppModule.js";
import { ModuleContext } from "../ModuleContext.js";
import { BrowserWindow, Menu } from "electron";
import type { AppInitConfig } from "../AppInitConfig.js";
import { exchangeOAuthCode } from "../remote/auth-service-handlers.js";

const PROTOCOL = "printit";

class WindowManager implements AppModule {
  readonly #preload: { path: string };
  readonly #renderer: { path: string } | URL;
  readonly #openDevTools;

  constructor({
    initConfig,
    openDevTools = false,
  }: {
    initConfig: AppInitConfig;
    openDevTools?: boolean;
  }) {
    this.#preload = initConfig.preload;
    this.#renderer = initConfig.renderer;
    this.#openDevTools = openDevTools;
  }

  async enable({ app }: ModuleContext): Promise<void> {
    await app.whenReady();
    await this.restoreOrCreateWindow(true);
    app.on("second-instance", (_event, argv) => {
      void this.restoreOrCreateWindow(true);
      const url = argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));
      if (url) this.handleProtocolUrl(url);
    });
    app.on("activate", () => void this.restoreOrCreateWindow(true));
  }

  handleProtocolUrl(url: string) {
    const mainWindow = BrowserWindow.getAllWindows().find(
      (w) => !w.isDestroyed(),
    );
    const parsed = new URL(url);

    if (parsed.hostname === "auth") {
      const code = parsed.searchParams.get("code");
      if (code) {
        exchangeOAuthCode(code)
          .then((tokens) => {
            mainWindow?.webContents.send("auth:oauth-complete", {
              success: true,
              accessToken: tokens.accessToken,
            });
          })
          .catch(() => {
            mainWindow?.webContents.send("auth:oauth-complete", {
              success: false,
            });
          });
      }
    }
  }

  async createWindow(): Promise<BrowserWindow> {
    const browserWindow = new BrowserWindow({
      show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
      autoHideMenuBar: true,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
        webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
        preload: this.#preload.path,
      },
    });

    if (!this.#openDevTools) {
      Menu.setApplicationMenu(null);
    }

    if (this.#renderer instanceof URL) {
      await browserWindow.loadURL(this.#renderer.href);
    } else {
      await browserWindow.loadFile(this.#renderer.path);
    }

    return browserWindow;
  }

  async restoreOrCreateWindow(show = false) {
    let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

    window ??= await this.createWindow();

    if (!show) {
      return window;
    }

    if (window.isMinimized()) {
      window.restore();
    }

    window.show();

    if (this.#openDevTools) {
      window.webContents.openDevTools();
    }

    window.focus();

    return window;
  }
}

export function createWindowManagerModule(
  ...args: ConstructorParameters<typeof WindowManager>
) {
  return new WindowManager(...args);
}
