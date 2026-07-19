import { baseApi } from "./baseApi";
import type {
  PlaygroundChat,
  PlaygroundChatMessage,
  PlaygroundOnboardingStatus,
  PlaygroundRunDetail,
  PlaygroundSettings,
} from "../../pages/playground/types";

interface MyOnboardingResponse {
  success: boolean;
  onboarding: { _id: string; status?: PlaygroundOnboardingStatus } | null;
  // Server-computed gate: true for everyone unless invite-only mode is on.
  access?: boolean;
  submittedAt?: string;
  position?: number;
  estimatedWait?: string;
}

export const playgroundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyPlaygroundOnboarding: builder.query<MyOnboardingResponse, void>({
      query: () => ({ url: "/playground/me" }),
      providesTags: ["PlaygroundOnboarding"],
    }),

    // Chat CRUD only - the generation stream is raw fetch + reader in
    // useGenerationStream, not RTK Query.
    // Page 1 of the sidebar recents — tagged so a new build refreshes the top.
    listMyChats: builder.query<ChatsResponse, { limit?: number } | void>({
      query: (arg) => ({ url: "/chats", params: { limit: (arg && arg.limit) || 30 } }),
      providesTags: ["Chat"],
    }),

    // Older recents pages (cursor scroll). Untagged so scrolling back doesn't
    // reshuffle when a new chat lands at the top.
    getChatsPage: builder.query<ChatsResponse, { cursor: string; limit?: number }>({
      query: ({ cursor, limit }) => ({ url: "/chats", params: { cursor, limit: limit || 30 } }),
    }),

    getChatMessages: builder.query<ChatMessagesResponse, string>({
      query: (chatId) => ({ url: `/chats/${chatId}/messages` }),
      providesTags: (_result, _error, chatId) => [{ type: "Chat", id: chatId }],
    }),

    deleteChat: builder.mutation<{ success: boolean }, string>({
      query: (chatId) => ({ url: `/chats/${chatId}`, method: "DELETE" }),
      invalidatesTags: ["Chat"],
    }),

    // Latest run for a chat — rehydrates the Build view's timeline + cluster
    // when re-opening a past build (C3). The runs API stays under /generation.
    getRun: builder.query<RunResponse, string>({
      query: (runId) => ({ url: `/generation/runs/${runId}` }),
    }),

    listChatRuns: builder.query<RunsResponse, string>({
      query: (chatId) => ({ url: `/generation/runs?chatId=${chatId}&limit=1` }),
      // Refetch after a build so the rehydrated timeline/cluster stays current.
      providesTags: (_r, _e, chatId) => [{ type: "Chat", id: chatId }],
    }),

    getPlaygroundSettings: builder.query<SettingsResponse, void>({
      query: () => ({ url: "/playground/settings" }),
      providesTags: ["PlaygroundSettings"],
    }),

    updatePlaygroundSettings: builder.mutation<SettingsResponse, Partial<PlaygroundSettings>>({
      query: (body) => ({ url: "/playground/settings", method: "PATCH", body }),
      invalidatesTags: ["PlaygroundSettings"],
    }),
  }),
});

interface ChatsResponse {
  success: boolean;
  chats: PlaygroundChat[];
  nextCursor?: string | null;
  hasMore?: boolean;
}

interface ChatMessagesResponse {
  success: boolean;
  messages: PlaygroundChatMessage[];
}

interface RunResponse {
  success: boolean;
  run: PlaygroundRunDetail;
}

interface RunsResponse {
  success: boolean;
  runs: PlaygroundRunDetail[];
}

interface SettingsResponse {
  success: boolean;
  settings: PlaygroundSettings;
}

export const {
  useGetMyPlaygroundOnboardingQuery,
  useListMyChatsQuery,
  useLazyGetChatsPageQuery,
  useGetChatMessagesQuery,
  useDeleteChatMutation,
  useGetRunQuery,
  useListChatRunsQuery,
  useGetPlaygroundSettingsQuery,
  useUpdatePlaygroundSettingsMutation,
} = playgroundApi;
