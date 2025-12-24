import type { PrintServiceApi } from "@app/common";
import type { IpcHandlerRegistry } from "src/modules/IpcHandlersModule.js";
import { createHandler } from "./ipc-handlers.js";

export function getPrintServiceHandlers(
  printServiceApi: PrintServiceApi,
): IpcHandlerRegistry {
  return {
    "ps:ping": createHandler(() => {
      return printServiceApi.ping();
    }),
    "printer:list": createHandler(() => {
      return printServiceApi.getPrintQueues();
    }),

    "printer:printer": createHandler((_event, printQueue: string) => {
      return printServiceApi.getPrintQueue(printQueue);
    }),

    "printer:capabilities": createHandler((_event, printQueue: string) => {
      return printServiceApi.getPrintQueueCapabilities(printQueue);
    }),
  };
}
