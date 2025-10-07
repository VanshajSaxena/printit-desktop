import { ChildProcess, spawn } from 'child_process';
import { AppModule } from 'src/AppModule.js';
import { ModuleContext } from 'src/ModuleContext.js';
import { fileURLToPath } from 'url';
import log from 'electron-log';
import fs from 'fs';
import path from 'path';

interface PrintServiceConfig {
  bin: string;
  devPath?: string;
  prodPath?: string;
  required?: boolean;
  startupTimeout?: number;
}

class PrintServiceModule implements AppModule {
  #process: ChildProcess | null = null;
  readonly #config: PrintServiceConfig;
  constructor(config: PrintServiceConfig = { bin: 'PrintService.exe' }) {
    this.#config = {
      startupTimeout: 5000,
      required: false,
      ...config,
    };
  }

  async enable({ app }: ModuleContext): Promise<void> {
    log.info('PrintServiceModule: Starting...');
    try {
      await this.startService();
      log.info('PrintServiceModule: Started successfully');
    } catch (error) {
      log.error('PrintServiceModule: Failed to start', error);
      if (this.#config.required) {
        throw error;
      } else {
        log.warn(
          'PrintServiceModule: Continuing without PrintService (non-required)',
        );
      }
    }
    app.on('will-quit', () => {
      this.cleanup();
    });
    app.on('before-quit', () => {
      this.cleanup();
    });
  }

  private async startService(): Promise<void> {
    return new Promise((resolve, reject) => {
      const servicePath = this.getServicePath();
      log.info('PrintServiceModule: Executable path:', servicePath);
      if (!fs.existsSync(servicePath)) {
        const error = new Error(
          `${this.#config.bin} not found at ${servicePath}`,
        );
        reject(error);
        return;
      }

      try {
        this.#process = spawn(servicePath);
        this.#process.on('error', (error) => {
          log.error('PrintServiceModule: Process error: ', error);
          reject(error);
        });
        this.#process.on('spawn', () => {
          log.info(
            `PrintServiceModule: Process Spawned PID: `,
            this.#process?.pid,
          );
          resolve();
        });

        this.#process.on('exit', (code, signal) => {
          if (code !== null && code !== 0) {
            log.warn(
              `PrintServiceModule: Process exited with code: ${code.toString()}`,
            );
          } else if (signal) {
            log.info(
              `PrintServiceModule: Process exited with signal: ${signal}`,
            );
          } else {
            log.info('PrintServiceModule: Process exited gracefully.');
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
        log.error('PrintServiceModule: Exception during spawn:', error);
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(
            new Error(
              `PrintServiceModule: Unknown error occured: ${String(error)}`,
            ),
          );
        }
      }
    });
  }

  private getServicePath(): string {
    const isDev = import.meta.env.DEV;

    if (isDev && this.#config.devPath) {
      return this.#config.devPath;
    }
    if (!isDev && this.#config.prodPath) {
      return this.#config.prodPath;
    }

    return isDev
      ? path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          `../../../buildResources/${this.#config.bin}`,
        )
      : path.join(process.resourcesPath, this.#config.bin);
  }

  private cleanup(): void {
    if (this.#process && !this.#process.killed) {
      log.info('PrintServiceModule: Terminating process...');
      this.#process.kill('SIGTERM');

      setTimeout(() => {
        if (this.#process && !this.#process.killed) {
          log.warn('PrintServiceModule: Force killing process');
          this.#process.kill('SIGKILL');
        }
      }, 2000);
    }
  }
}
export function printService(config?: PrintServiceConfig) {
  return new PrintServiceModule(config);
}
