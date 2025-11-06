import { sha256sum } from './nodeCrypto.js';
import { versions } from './versions.js';
import { ipcRenderer } from 'electron';

function send(channel: string, message: string) {
  return ipcRenderer.invoke(channel, message);
}

export function ping() {
  return ipcRenderer.invoke('ping');
}
export function getPrintQueues() {
  return ipcRenderer.invoke('printer:list');
}
export function getPrintQueue() {
  return ipcRenderer.invoke('printer:printer');
}
export function getPrintQueueCapabilitites() {
  return ipcRenderer.invoke('printer:capabilities');
}
export function isWebSocketConnected(): Promise<boolean> {
  return ipcRenderer.invoke('ws:is-connected');
}
export function isWebSocketActive() {
  return ipcRenderer.invoke('ws:is-active');
}
export function disconnectWebSocket() {
  return ipcRenderer.invoke('ws:disconnect');
}

export { sha256sum, versions, send };
