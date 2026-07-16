import { baseApi } from "./baseApi";
import type {
  PlaygroundOnboardingRecord,
  PlaygroundOnboardingStatus,
} from "../../pages/playground/types";

interface OnboardingListResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  items: PlaygroundOnboardingRecord[];
}

interface UpdateOnboardingStatusResponse {
  success: boolean;
  onboarding: PlaygroundOnboardingRecord;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPlaygroundOnboardings: builder.query<
      OnboardingListResponse,
      { status?: PlaygroundOnboardingStatus; page?: number } | void
    >({
      query: (params) => ({
        url: "/playground/onboardings",
        params: params ?? undefined,
      }),
      providesTags: ["PlaygroundOnboarding"],
    }),

    updateOnboardingStatus: builder.mutation<
      UpdateOnboardingStatusResponse,
      { id: string; status: PlaygroundOnboardingStatus }
    >({
      query: ({ id, status }) => ({
        url: `/admin/playground/onboardings/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["PlaygroundOnboarding"],
    }),
  }),
});

export const {
  useListPlaygroundOnboardingsQuery,
  useUpdateOnboardingStatusMutation,
} = adminApi;
