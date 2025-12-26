import { initApp } from "@app/main";
import { app } from "electron";
import { fileURLToPath } from "node:url";
import log from "electron-log";
import fs from "fs";
import path from "node:path";

log.transports.file.resolvePathFn = () => {
  const appName = app.getName();
  const baseDir = path.join(app.getPath("appData"), appName);
  const logDir = path.join(baseDir, "logs");
  // "%APPDATA%\printly\logs\main.log"

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return path.join(logDir, "main.log");
};

log.transports.file.maxSize = 5 * 1024 * 1024;
log.initialize({ spyRendererConsole: true, preload: true });

log.info("### Application Entry Point Started ###\n");
if (process.env.NODE_ENV === "development") {
  log.info(String.raw`
      ___           ___                       ___           ___           ___       ___
     /\  \         /\  \          ___        /\__\         /\  \         /\__\     |\__\
    /::\  \       /::\  \        /\  \      /::|  |        \:\  \       /:/  /     |:|  |
   /:/\:\  \     /:/\:\  \       \:\  \    /:|:|  |         \:\  \     /:/  /      |:|  |
  /::\~\:\  \   /::\~\:\  \      /::\__\  /:/|:|  |__       /::\  \   /:/  /       |:|__|__
 /:/\:\ \:\__\ /:/\:\ \:\__\  __/:/\/__/ /:/ |:| /\__\     /:/\:\__\ /:/__/        /::::\__\
 \/__\:\/:/  / \/_|::\/:/  / /\/:/  /    \/__|:|/:/  /    /:/  \/__/ \:\  \       /:/~~/~
      \::/  /     |:|::/  /  \::/__/         |:/:/  /    /:/  /       \:\  \     /:/  /
       \/__/      |:|\/__/    \:\__\         |::/  /     \/__/         \:\  \    \/__/
                  |:|  |       \/__/         /:/  /                     \:\__\
                   \|__|                     \/__/                       \/__/
    `);
}

if (
  process.env.NODE_ENV === "development" ||
  process.env.PLAYWRIGHT_TEST === "true" ||
  !!process.env.CI
) {
  function showAndExit(...args) {
    console.error(...args);
    process.exit(1);
  }

  process.on("uncaughtException", showAndExit);
  process.on("unhandledRejection", showAndExit);
}

// noinspection JSIgnoredPromiseFromCall
/**
 * We resolve '@app/renderer' and '@app/preload'
 * here and not in '@app/main'
 * to observe good practices of modular design.
 * This allows fewer dependencies and better separation of concerns in '@app/main'.
 * Thus,
 * the main module remains simplistic and efficient
 * as it receives initialization instructions rather than direct module imports.
 */
initApp({
  renderer:
    process.env.MODE === "development" && !!process.env.VITE_DEV_SERVER_URL
      ? new URL(process.env.VITE_DEV_SERVER_URL)
      : {
          path: fileURLToPath(import.meta.resolve("@app/renderer")),
        },

  preload: {
    path: fileURLToPath(import.meta.resolve("@app/preload/exposed.mjs")),
  },
})
  .then(() => {
    log.info("### Application Entry Point Completed ###");
  })
  .catch((error) => {
    log.error("### Application Entry Point Failed with errors ###", error);
    app.quit();
  });

log.info("### Entry Point Script End ###");
