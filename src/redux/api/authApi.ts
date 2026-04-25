import { baseApi } from "./baseApi";

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  picture?: string;
  initials: string;
}

interface MeResponse {
  success: boolean;
  user: AuthUser;
}

interface LogoutResponse {
  success: boolean;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<MeResponse, void>({
      query: () => ({ url: "/auth/me" }),
      providesTags: ["Auth"],
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useGetMeQuery, useLazyGetMeQuery, useLogoutMutation } = authApi;
