/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ChildProcess, spawn } from "child_process";
import { app } from "electron";
import log from "electron-log";
import fs from "fs";
import path from "path";
import { AppModule } from "src/AppModule.js";
import { ModuleContext } from "src/ModuleContext.js";
import { fileURLToPath } from "url";

interface PrintServiceConfig {
  bin?: string;
  required?: boolean;
  startupTimeout?: number;
}

class PrintServiceModule implements AppModule {
  #process: ChildProcess | null = null;
  readonly #config: PrintServiceConfig;
  private logger: log.LogFunctions;
  constructor(config: PrintServiceConfig = {}) {
    log.info(`Initializing ${PrintServiceModule.name}...`);
    this.#config = {
      startupTimeout: 5000,
      required: false,
      bin: "PrintService.exe",
      ...config,
    };
    this.logger = log.scope(PrintServiceModule.name);
  }

  async enable({ app }: ModuleContext): Promise<void> {
    try {
      await this.startService();
      this.logger.info("Started successfully");
    } catch (error) {
      this.logger.error("Failed to start", error);
      if (this.#config.required) {
        throw error;
      } else {
        this.logger.warn("Continuing without PrintService (non-required)");
      }
    }
    app.on("will-quit", () => {
      this.cleanup();
    });
    app.on("before-quit", () => {
      this.cleanup();
    });
  }

  private async startService(): Promise<void> {
    return new Promise((resolve, reject) => {
      const servicePath = this.getServicePath();
      this.logger.info("Executable path:", servicePath);
      if (!fs.existsSync(servicePath)) {
        const error = new Error(
          `${this.#config.bin} not found at ${servicePath}`,
        );
        reject(error);
        return;
      }

      try {
        this.#process = spawn(servicePath);
        this.#process.on("error", (error) => {
          this.logger.error("Process error: ", error);
          reject(error);
        });
        this.#process.on("spawn", () => {
          this.logger.info(`Process Spawned PID: `, this.#process?.pid);
          resolve();
        });

        this.#process.on("exit", (code, signal) => {
          if (code !== null && code !== 0) {
            this.logger.warn(`Process exited with code: ${code.toString()}`);
          } else if (signal) {
            this.logger.info(`Process exited with signal: ${signal}`);
          } else {
            this.logger.info("Process exited gracefully.");
          }
          this.#process = null;
        });

        setTimeout(() => {
          if (this.#process && !this.#process.pid) {
            const error = new Error(
              `PrintService failed to start within ${String(this.#config.startupTimeout)}ms`,
            );
            reject(error);
          }
        }, this.#config.startupTimeout);
      } catch (error) {
        this.logger.error("Exception during spawn:", error);
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error(`Unknown error occured: ${String(error)}`));
        }
      }
    });
  }

  private getServicePath(): string {
    return app.isPackaged
      ? path.join(process.resourcesPath, `${this.#config.bin}`)
      : path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          `../../../buildResources/${this.#config.bin}`,
        );
  }

  private cleanup(): void {
    if (this.#process && !this.#process.killed) {
      this.logger.info("Terminating process...");
      this.#process.kill("SIGTERM");

      setTimeout(() => {
        if (this.#process && !this.#process.killed) {
          this.logger.warn("Force killing process");
          this.#process.kill("SIGKILL");
        }
      }, 2000);
    }
  }
}

export function startPrintService(config?: PrintServiceConfig) {
  return new PrintServiceModule(config);
}
