import { type IPCResponse } from "@app/common";
import type {
  PrintJobDto,
  PrintJobInfoDto,
  PrintQueueStatusDto,
} from "@app/common/gen/types/print-service-api-types.js";
import { WebSocketEvent, WebSocketEventMap } from "@app/common";
import { ipcRenderer } from "electron";
import { sha256sum } from "./nodeCrypto.js";
import { versions } from "./versions.js";

export type WsChannelTypeMap = {
  "server:connected": {
    socketId: string | undefined;
  };
  "server:disconnected": {
    reason: string | undefined;
  };
  "transaction:new": {
    id: string | undefined;
  };
};

export type WsChannel = keyof WsChannelTypeMap;

function send(channel: string, message: string) {
  return ipcRenderer.invoke(channel, message);
}

export function ping() {
  return ipcRenderer.invoke("ping");
}
export function getPrintQueues() {
  return ipcRenderer.invoke("printQueue:list");
}
export function getPrintQueue() {
  return ipcRenderer.invoke("printQueue:info");
}
export function getPrintQueueStatus(
  printQueue: string,
): Promise<IPCResponse<PrintQueueStatusDto[] | undefined>> {
  return ipcRenderer.invoke("printQueue:status", printQueue);
}
export function getPrintQueueCapabilities() {
  return ipcRenderer.invoke("printQueue:capabilities");
}
export function getPrintJob(
  printQueue: string,
  jobIdentifier: number,
): Promise<IPCResponse<PrintJobInfoDto | undefined>> {
  return ipcRenderer.invoke("printQueue:job", printQueue, jobIdentifier);
}
export function spoolFilesToPrinter(
  printQueue: string,
  printJob: PrintJobDto,
): Promise<IPCResponse<PrintJobInfoDto | undefined>> {
  return ipcRenderer.invoke("printQueue:print", printQueue, printJob);
}
export function isWebSocketConnected(): Promise<boolean> {
  return ipcRenderer.invoke("server:is-connected");
}
export function isWebSocketActive() {
  return ipcRenderer.invoke("server:is-active");
}
export function disconnectWebSocket() {
  return ipcRenderer.invoke("server:disconnect");
}
export function downloadFilesToFileSystem(
  transactionId: number,
  files: {
    id: number;
    url: string;
    contentType: string;
  }[],
): Promise<
  {
    id: number;
    filePath: string;
  }[]
> {
  return ipcRenderer.invoke("files:download", transactionId, files);
}
export function subscribeToWsEvent<C extends WsChannel>(
  channel: C,
  callback: (data: WsChannelTypeMap[C]) => void,
) {
  const subscription = (
    _event: Electron.IpcRendererEvent,
    data: WsChannelTypeMap[C],
  ) => callback(data);
  ipcRenderer.on(channel, subscription);

  return () => {
    ipcRenderer.removeListener(channel, subscription);
  };
}

export function emitWebSocketEvent<K extends WebSocketEvent>(
  eventName: K,
  payload: WebSocketEventMap[K],
): void {
  ipcRenderer.send(eventName, payload);
}

export { send, sha256sum, versions };
