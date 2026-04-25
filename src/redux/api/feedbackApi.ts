import { baseApi } from "./baseApi";

export interface CreateFeedbackRequest {
  rating?: number;
  feedback?: string;
  amount: number;
  currency?: string;
  selected?: number;
  user?: { name?: string; email?: string };
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateFeedbackResponse {
  success: boolean;
  feedback: {
    _id: string;
    rating: number;
    feedback: string;
    amount: number;
    currency: string;
    createdAt: string;
  };
}

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFeedback: builder.mutation<CreateFeedbackResponse, CreateFeedbackRequest>({
      query: (body) => ({
        url: "/feedback",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Feedback"],
    }),
  }),
});

export const { useCreateFeedbackMutation } = feedbackApi;
