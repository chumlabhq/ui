import { baseApi } from "./baseApi.js";
import type {
  PlaygroundOnboardingRecord,
  PlaygroundOnboardingStatus,
} from "../../pages/playground/types.js";

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

/**
 * The playground's tags live with the playground, not in `baseApi`: the site
 * ships `baseApi`, and a tag name is a string in the bundle. Restoring the
 * feature needs nothing here — this file already carries them.
 */
const playgroundBaseApi = baseApi.enhanceEndpoints({ addTagTypes: ["PlaygroundOnboarding"] });

export const adminApi = playgroundBaseApi.injectEndpoints({
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
