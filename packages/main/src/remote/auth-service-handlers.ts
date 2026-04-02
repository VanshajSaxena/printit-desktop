import { shell } from "electron";
import type { IpcHandlerRegistry } from "src/modules/IpcHandlersModule.js";
import { createHandler } from "./ipc-handlers.js";
import { KeychainService } from "../services/kyechain.service.js";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const API_BASE_URL = import.meta.env.PROD
  ? "api.printit.ink"
  : "dev.api.printit.ink";

let _accessToken: string | null = null;

async function fetchJson<T>(
  path: string,
  options: RequestInit & { body?: unknown } = {},
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
    throw new Error(`HTTP ${res.status.toString()}: ${text || res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export function getAuthHandlers(): IpcHandlerRegistry {
  return {
    "auth:login": createHandler(
      async (_event, email: string, password: string) => {
        const tokens = await fetchJson<TokenPair>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        _accessToken = tokens.accessToken;
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
          body: JSON.stringify({ refreshToken }),
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
          body: JSON.stringify({ refreshToken }),
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
