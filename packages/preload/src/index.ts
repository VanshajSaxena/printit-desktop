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
  return ipcRenderer.invoke("printer:list");
}
export function getPrintQueue() {
  return ipcRenderer.invoke("printer:printer");
}
export function getPrintQueueCapabilitites() {
  return ipcRenderer.invoke("printer:capabilities");
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
export function getPrintTransactions() {
  return ipcRenderer.invoke("cs:transactions:get");
}
export function downloadFiles(
  transactionId: number,
  files: {
    id: number;
    url: string;
    contentType: string;
  }[],
) {
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

export { send, sha256sum, versions };
