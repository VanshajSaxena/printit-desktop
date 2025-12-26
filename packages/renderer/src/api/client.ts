import type { paths } from "./gen/cloud-api-types";
import { QueryClient } from "@tanstack/react-query";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const fetchClient = createFetchClient<paths>({
  baseUrl,
});

export const queryClient = new QueryClient({});

export const client = createClient<paths>(fetchClient);
