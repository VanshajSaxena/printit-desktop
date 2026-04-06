import { shell } from "electron";
import type { IpcHandlerRegistry } from "src/modules/IpcHandlersModule.js";
import { KeychainService } from "../services/kyechain.service.js";
import { createHandler } from "./ipc-handlers.js";
import log from "electron-log";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const API_BASE_URL = import.meta.env.PROD
  ? "https://dev.api.printit.ink/api"
  : "https://dev.api.printit.ink/api";

let _accessToken: string | null = null;

export async function exchangeOAuthCode(code: string): Promise<TokenPair> {
  const tokens = await fetchJson<TokenPair>("/auth/exchange", {
    method: "POST",
    body: { code },
  });
  log.debug("exchangeOAuthCode exchangeOAuthCode:", tokens);

  _accessToken = tokens.accessToken;
  await KeychainService.setAccessToken(tokens.accessToken);
  await KeychainService.setRefreshToken(tokens.refreshToken);

  return tokens;
}

async function fetchJson<T>(
  path: string,
  options: Omit<RequestInit, "body"> & { body?: unknown } = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(!!_accessToken && {
        Authorization: `Bearer ${_accessToken}`,
      }),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    log.error(
      `HTTP ${options.method ?? "unknown"} ${path} returned: ${res.status.toString()}: ${text || res.statusText}`,
    );
  }

  return res.json() as Promise<T>;
}

export function getAuthHandlers(): IpcHandlerRegistry {
  return {
    "auth:login": createHandler(
      async (_event, email: string, password: string) => {
        const tokens = await fetchJson<TokenPair>("/auth/login", {
          method: "POST",
          body: { email, password },
        });

        _accessToken = tokens.accessToken;
        await KeychainService.setAccessToken(tokens.accessToken);
        await KeychainService.setRefreshToken(tokens.refreshToken);
        await KeychainService.setEmail(email);

        return { accessToken: tokens.accessToken };
      },
    ),

    "auth:oauth-start": createHandler(
      async (_event, provider: "google" | "microsoft") => {
        const url = `${API_BASE_URL}/v1/auth/${provider}`;
        await shell.openExternal(url);
      },
    ),

    "auth:refresh": createHandler(async () => {
      const refreshToken = await KeychainService.getRefreshToken();
      if (!refreshToken) return null;

      try {
        const tokens = await fetchJson<TokenPair>("/auth/refresh", {
          method: "POST",
          body: { refreshToken },
        });

        _accessToken = tokens.accessToken;
        await KeychainService.setRefreshToken(tokens.refreshToken);

        return { accessToken: tokens.accessToken };
      } catch {
        await KeychainService.clearAll();
        return null;
      }
    }),

    "auth:logout": createHandler(async () => {
      const refreshToken = await KeychainService.getRefreshToken();

      if (refreshToken) {
        await fetchJson("/auth/logout", {
          method: "POST",
          body: { refreshToken },
        });
      }

      _accessToken = null;
      await KeychainService.clearAll();
    }),
  };
}

export function getAccessToken() {
  return _accessToken;
}
