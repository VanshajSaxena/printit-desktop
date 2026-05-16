import { useAuthStore } from "@/store/useAuthStore";
import { QueryClient } from "@tanstack/react-query";
import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./gen/cloud-api-types";

const baseUrl = `https://${import.meta.env.VITE_API_BASE_URL}`;

export type FetchClientType = typeof fetchClient;

export const fetchClient = createFetchClient<paths>({
  baseUrl,
});

const authMiddleware: Middleware = {
  onRequest({ request }) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
};

fetchClient.use(authMiddleware);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export const client = createClient<paths>(fetchClient);
