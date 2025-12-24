import type { CloudServiceApi } from "@app/common";
import type { IpcHandlerRegistry } from "src/modules/IpcHandlersModule.js";
import { createHandler } from "./ipc-handlers.js";

export function getCloudSeriveHandlers(
  cloudServiceApi: CloudServiceApi,
): IpcHandlerRegistry {
  return {
    "cs:ping": createHandler(() => {
      return cloudServiceApi.ping();
    }),
    "cs:transactions:get": createHandler(async () => {
      return cloudServiceApi.getTransactions();
    }),
  };
}
