import log, { LogFunctions } from "electron-log";
import electronUpdater, { type AppUpdater } from "electron-updater";
import { AppModule } from "../AppModule.js";

type DownloadNotification = Parameters<
  AppUpdater["checkForUpdatesAndNotify"]
>[0];

export class AutoUpdater implements AppModule {
  readonly #logger: LogFunctions;
  readonly #notification: DownloadNotification;

  constructor({
    downloadNotification,
  }: {
    downloadNotification?: DownloadNotification;
  } = {}) {
    const logAutoUpdate = log.scope(AutoUpdater.name);
    this.#logger = logAutoUpdate;
    this.#notification = downloadNotification ?? {
      title: "Update Ready",
      body: "Restart the app to install updates",
    };
  }

  async enable(): Promise<void> {
    await this.runAutoUpdater();
  }

  getAutoUpdater(): AppUpdater {
    // Using destructuring to access autoUpdater due to the CommonJS module of 'electron-updater'.
    // It is a workaround for ESM compatibility issues, see https://github.com/electron-userland/electron-builder/issues/7976.
    const { autoUpdater } = electronUpdater;
    return autoUpdater;
  }

  async runAutoUpdater() {
    const updater = this.getAutoUpdater();
    updater.on("checking-for-update", () => {
      this.#logger.info("Checking for update...");
    });

    updater.on("update-available", (info) => {
      this.#logger.info("Update available:", info);
    });

    updater.on("update-not-available", () => {
      this.#logger.info("No updates available");
    });

    updater.on("download-progress", (progress) => {
      this.#logger.debug(
        `Download speed: ${progress.bytesPerSecond.toString()}`,
      );
      this.#logger.debug(`Downloaded ${progress.percent.toString()}%`);
    });

    updater.on("update-downloaded", () => {
      this.#logger.info("Update downloaded");
    });

    updater.on("error", (err) => {
      this.#logger.error("Updater error:", err);
    });

    try {
      updater.logger = this.#logger;
      updater.fullChangelog = true;
      updater.channel = import.meta.env.VITE_DISTRIBUTION_CHANNEL ?? "unstable";

      return await updater.checkForUpdatesAndNotify(this.#notification);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("No published versions")) {
          return null;
        }
      }

      this.#logger.error("Auto Update Failed...");
    }
  }
}

export function autoUpdater(
  ...args: ConstructorParameters<typeof AutoUpdater>
) {
  return new AutoUpdater(...args);
}
