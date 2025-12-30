import { ipcRenderer } from "electron";
import { sha256sum } from "./nodeCrypto.js";
import { versions } from "./versions.js";

export type WsChannelTypeMap = {
  "ws:connected": {
    socketId: string | undefined;
  };
  "ws:disconnected": {
    reason: string | undefined;
  };
  "ws:new_transaction": {
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
  return ipcRenderer.invoke("ws:is-connected");
}
export function isWebSocketActive() {
  return ipcRenderer.invoke("ws:is-active");
}
export function disconnectWebSocket() {
  return ipcRenderer.invoke("ws:disconnect");
}
export function getPrintTransactions() {
  return ipcRenderer.invoke("cs:transactions:get");
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
