import {
  downloadManager,
  type PrintTypes,
  type PrintServiceApi,
} from "@app/common";
import type { IpcHandlerRegistry } from "src/modules/IpcHandlersModule.js";
import { createHandler } from "./ipc-handlers.js";

export function getPrintServiceHandlers(
  printServiceApi: PrintServiceApi,
): IpcHandlerRegistry {
  return {
    ping: createHandler(() => {
      return printServiceApi.ping();
    }),
    "printQueue:list": createHandler(() => {
      return printServiceApi.getPrintQueues();
    }),

    "printQueue:info": createHandler((_event, printQueue: string) => {
      return printServiceApi.getPrintQueue(printQueue);
    }),

    "printQueue:capabilities": createHandler((_event, printQueue: string) => {
      return printServiceApi.getPrintQueueCapabilities(printQueue);
    }),

    "printQueue:job": createHandler(
      (_event, printQueue: string, jobId: number) => {
        return printServiceApi.getPrintJob(printQueue, jobId);
      },
    ),

    "printQueue:print": createHandler(
      (_event, printQueue: string, printJob: PrintTypes.PrintJobDto) => {
        return printServiceApi.cratePrintJob(printQueue, printJob);
      },
    ),

    "files:download": createHandler(
      async (
        _event,
        transactionId: number,
        files: {
          id: number;
          url: string;
          contentType: string;
        }[],
      ) => {
        return await downloadManager.downloadFiles(transactionId, files);
      },
    ),
  };
}
