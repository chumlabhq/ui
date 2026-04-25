import { baseApi } from "./baseApi";
import type {
  PlaygroundOnboardingSubmission,
  OnboardingResult,
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
  }),
});

export const {
  useSubmitPlaygroundOnboardingMutation,
  useGetMyPlaygroundOnboardingQuery,
} = playgroundApi;
