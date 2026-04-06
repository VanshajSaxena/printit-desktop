import * as Electron from "electron";
import { AppModule } from "../AppModule.js";

class DefaultProtocolClient implements AppModule {
  readonly #protocol: string;

  constructor(protocol: string) {
    this.#protocol = protocol;
  }
  enable({ app }: { app: Electron.App }): void {
    if (!app.isPackaged) {
      app.setAsDefaultProtocolClient(this.#protocol, process.execPath, [
        app.getAppPath(),
      ]);
    } else {
      app.setAsDefaultProtocolClient(this.#protocol);
    }
  }
}

export function setAsDefaultProtocolClient(
  ...args: ConstructorParameters<typeof DefaultProtocolClient>
) {
  return new DefaultProtocolClient(...args);
}
