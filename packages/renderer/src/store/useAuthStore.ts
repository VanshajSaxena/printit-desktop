import {
  login,
  logout,
  oauthStart,
  onOAuthComplete,
  refresh,
} from "@app/preload";
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setAccessToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  oauthStart: (provider: "google" | "microsoft") => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isBootstrapping: true,

  setAccessToken: (token) => {
    set({ accessToken: token, isAuthenticated: !!token });
  },

  login: async (email, password) => {
    const { accessToken } = await login(email, password);
    set({ accessToken, isAuthenticated: true });
  },

  oauthStart: async (provider) => {
    await oauthStart(provider);
  },

  logout: async () => {
    await logout();
    set({ accessToken: null, isAuthenticated: false });
  },

  bootstrap: async () => {
    onOAuthComplete((result) => {
      if (result.success && result.accessToken) {
        set({ accessToken: result.accessToken, isAuthenticated: true });
      }
    });

    const result = await refresh();
    set({
      accessToken: result?.accessToken ?? null,
      isAuthenticated: !!result?.accessToken,
      isBootstrapping: false,
    });
  },
}));
