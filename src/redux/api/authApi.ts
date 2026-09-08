import { baseApi } from "./baseApi.js";

/**
 * Whether the site has a way to sign in.
 *
 * `false` since the playground and its `/oauth/google` route left the site on
 * 2026-09-07 (see the note in `App.tsx`). Nothing sets the auth cookie any
 * more, so `/api/auth/me` answered 401 on every page load of every route —
 * a guaranteed-failing request on a page that has no signed-in state to show.
 *
 * The endpoints stay wired and typed. Callers pass `skip: !AUTH_ENABLED`, so
 * restoring sign-in is this one flag rather than a hunt through components.
 */
export const AUTH_ENABLED = false;

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
