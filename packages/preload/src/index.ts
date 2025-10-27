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

export { sha256sum, versions, send };
