import { downloadManager, type PrintServiceApi } from "@app/common";
import type { IpcHandlerRegistry } from "src/modules/IpcHandlersModule.js";
import { createHandler } from "./ipc-handlers.js";
import { PrintJobDto } from "@app/common/gen/types/print-service-api-types.js";
import { generateQrCodePdf } from "../services/qr-code.service.js";

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

    "printQueue:status": createHandler((_event, printQueue: string) => {
      return printServiceApi.getPrintQueueStatus(printQueue);
    }),

    "printQueue:capabilities": createHandler((_event, printQueue: string) => {
      return printServiceApi.getPrintQueueCapabilities(printQueue);
    }),

    "printQueue:job": createHandler(
      (_event, printQueue: string, jobId: number) => {
        return printServiceApi.getPrintJob(printQueue, jobId);
      },
    ),

    "printQueue:job:cancel": createHandler(
      (_event, printQueue: string, jobId: number) => {
        return printServiceApi.cancelPrintJob(printQueue, jobId);
      },
    ),

    "printQueue:jobs": createHandler((_event, printQueue: string) => {
      return printServiceApi.getPrintJobs(printQueue);
    }),

    "printQueue:jobs:cancel": createHandler((_event, printQueue: string) => {
      return printServiceApi.cancelAllPrintJobs(printQueue);
    }),

    "printQueue:print": createHandler(
      (_event, printQueue: string, printJob: PrintJobDto) => {
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

    "generate:qr-code": createHandler(async (_event, qrDataUrl: string) => {
      return await generateQrCodePdf(qrDataUrl);
    }),
  };
}
