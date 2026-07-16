import { baseApi } from "./baseApi";
import type {
  PlaygroundOnboardingSubmission,
  OnboardingResult,
  PlaygroundChat,
  PlaygroundChatMessage,
} from "../../pages/playground/types";

interface OnboardResponse extends OnboardingResult {
  success: boolean;
  alreadyOnboarded: boolean;
}

interface MyOnboardingResponse {
  success: boolean;
  onboarding: { _id: string } | null;
  submittedAt?: string;
  position?: number;
  estimatedWait?: string;
}

export const playgroundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitPlaygroundOnboarding: builder.mutation<
      OnboardResponse,
      Omit<PlaygroundOnboardingSubmission, "user">
    >({
      query: (body) => ({
        url: "/playground/onboard",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PlaygroundOnboarding"],
    }),

    getMyPlaygroundOnboarding: builder.query<MyOnboardingResponse, void>({
      query: () => ({ url: "/playground/me" }),
      providesTags: ["PlaygroundOnboarding"],
    }),

    // Chat CRUD only - the generation stream is raw fetch + reader in
    // useGenerationStream, not RTK Query.
    listMyChats: builder.query<ChatsResponse, void>({
      query: () => ({ url: "/chats" }),
      providesTags: ["Chat"],
    }),

    getChatMessages: builder.query<ChatMessagesResponse, string>({
      query: (chatId) => ({ url: `/chats/${chatId}/messages` }),
      providesTags: (_result, _error, chatId) => [{ type: "Chat", id: chatId }],
    }),

    deleteChat: builder.mutation<{ success: boolean }, string>({
      query: (chatId) => ({ url: `/chats/${chatId}`, method: "DELETE" }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

interface ChatsResponse {
  success: boolean;
  chats: PlaygroundChat[];
}

interface ChatMessagesResponse {
  success: boolean;
  messages: PlaygroundChatMessage[];
}

export const {
  useSubmitPlaygroundOnboardingMutation,
  useGetMyPlaygroundOnboardingQuery,
  useListMyChatsQuery,
  useGetChatMessagesQuery,
  useDeleteChatMutation,
} = playgroundApi;
