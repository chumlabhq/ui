import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLazyGetMeQuery } from "../../redux/api/authApi";

/**
 * Landing page after server-side Google OAuth callback. The backend has
 * already set the auth cookie and 302'd here with `?flow=...` (and `?error=...`
 * on failure). We hydrate the user via `/api/auth/me` (cookie auto-sent), then
 * route the user back to wherever they came from based on `flow`.
 */
export default function OauthRedirect() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [getMe] = useLazyGetMeQuery();

  const errorParam = params.get("error");
  const [meError, setMeError] = useState<string | null>(null);
  const errorMessage = errorParam ? decodeURIComponent(errorParam) : meError;

  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    if (errorParam) return;

    (async () => {
      try {
        await getMe().unwrap();
        const flow = params.get("flow") || "";
        // Track C: both playground flows land in the guarded app now — the
        // legacy onboard flow no longer reopens a waitlist.
        if (flow === "playground" || flow === "playground-onboard") {
          navigate("/playground", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch {
        setMeError("Could not load your account. Please try again.");
      }
    })();
  }, [getMe, navigate, params, errorParam]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] text-white px-6">
      <div className="text-center max-w-sm">
        {errorMessage ? (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-400/40 flex items-center justify-center mx-auto mb-4 text-red-300">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold mb-2">Sign-in failed</h1>
            <p className="text-sm text-white/65 leading-relaxed mb-6">{errorMessage}</p>
            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              className="cursor-pointer px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm text-white/85 hover:bg-white/[0.1] transition-colors"
            >
              Back home
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 border-2 border-blue-300/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-white/70">Completing sign-in&hellip;</p>
          </>
        )}
      </div>
    </div>
  );
}
