import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../../../redux/api/authApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Kick off Google OAuth and return the user to `returnTo` after sign-in. The
// backend sets the cookie and 302s to /oauth/google?flow=playground, which
// routes on into /playground (see OauthRedirect).
export function startAuth(returnTo = "/playground") {
  const fallbackUrl = `${window.location.origin}/oauth/google`;
  const params = new URLSearchParams({ fallbackUrl, flow: "playground", returnTo });
  window.location.href = `${API_BASE_URL}/auth/google/login?${params.toString()}`;
}

// The single entry guard behind every CTA and a direct /playground visit
// (Track C): authenticated → /playground; otherwise start auth and come back.
// No waitlist, no multi-step onboarding.
export function useEnterPlayground() {
  const navigate = useNavigate();
  const { data, isError } = useGetMeQuery();
  const authed = !isError && !!data?.user;
  return useCallback(() => {
    if (authed) navigate("/playground");
    else startAuth("/playground");
  }, [authed, navigate]);
}
