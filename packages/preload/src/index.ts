import { type IPCResponse } from "@app/common";
import type {
  PrintJobDto,
  PrintJobInfoDto,
  PrintQueueStatusDto,
} from "@app/common/gen/types/print-service-api-types.js";
import type { WebSocketEvent, WebSocketEventMap } from "@app/common";
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

interface OAuthResult {
  success: boolean;
  accessToken?: string;
}

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
export function connectWebSocket(token: string) {
  return ipcRenderer.invoke("server:connect", token);
}

export function updatePresence(
  presence: "online" | "offline" | "away",
): Promise<{ success: boolean }> {
  return ipcRenderer.invoke("presence:update", presence);
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

export function register(
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
): Promise<{ accessToken: string }> {
  return ipcRenderer.invoke(
    "auth:register",
    firstName,
    lastName,
    username,
    email,
    password,
  );
}

export function onOAuthComplete(cb: (result: OAuthResult) => void) {
  ipcRenderer.on("auth:oauth-complete", (_event, result) => cb(result));
  return () => ipcRenderer.removeAllListeners("auth:oauth-complete");
}

export function login(
  email: string,
  password: string,
): Promise<{ accessToken: string }> {
  return ipcRenderer.invoke("auth:login", email, password);
}

export function oauthStart(provider: "google" | "microsoft"): Promise<void> {
  return ipcRenderer.invoke("auth:oauth-start", provider);
}

export function refresh(): Promise<{ accessToken: string } | null> {
  return ipcRenderer.invoke("auth:refresh");
}

export function getAccessToken(): Promise<{ accessToken: string } | null> {
  return ipcRenderer.invoke("auth:get-access-token");
}

export function logout(): Promise<void> {
  return ipcRenderer.invoke("auth:logout");
}

export function emitWebSocketEvent<K extends WebSocketEvent>(
  eventName: K,
  payload: WebSocketEventMap[K],
): void {
  ipcRenderer.send(eventName, payload);
}

export { send, sha256sum, versions };
