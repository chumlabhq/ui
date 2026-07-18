import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  timeout: 30000,
  // Send the HTTP-only auth cookie set by the backend after Google OAuth.
  // Backend CORS must echo a specific origin (not "*") for this to work.
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    const isFormData =
      typeof args === "object" && args?.body instanceof FormData;
    if (!isFormData && typeof args === "object" && args?.body) {
      args = {
        ...args,
        headers: {
          ...(args.headers as Record<string, string>),
          "Content-Type": "application/json",
        },
      };
    }
    return rawBaseQuery(args, api, extraOptions);
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["PlaygroundOnboarding", "PlaygroundSettings", "Feedback", "Auth", "Chat"],
  endpoints: () => ({}),
});
