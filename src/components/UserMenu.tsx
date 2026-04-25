import { useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar/Avatar";
import { useGetMeQuery, useLogoutMutation } from "../redux/api/authApi";

/**
 * Top-right account chip. Renders nothing when there's no signed-in user
 * (the /api/auth/me query 401s for guests; that's a normal "logged out"
 * state, not an error to surface). Click opens a small popover with the
 * user's avatar/name/email and a Logout action.
 */
export function UserMenu() {
  const { data, isLoading, isError } = useGetMeQuery();
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // After logout, /api/auth/me 401s. RTK Query's default keeps the previous
  // `data` for stale-while-revalidate, so we explicitly treat an error state
  // as "no signed-in user" - otherwise the avatar lingers post-logout.
  const user = isError ? null : data?.user;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (isLoading || !user) return null;

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout().unwrap();
    } catch {
      // Logout endpoint clears the cookie unconditionally on the server side;
      // a network error here just means the local cache won't be invalidated.
      // The Auth-tag invalidation below covers the happy path.
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="cursor-pointer flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-lg hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-colors"
      >
        <Avatar
          size={28}
          name={user.name}
          src={user.picture}
          autoColor
        />
        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-[12.5px] font-medium text-white/95 max-w-[140px] truncate">
            {user.name}
          </span>
          <span className="text-[11px] text-white/45 max-w-[140px] truncate">
            {user.email}
          </span>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-white/55 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/[0.08] bg-[#0a0a14]/95 backdrop-blur-xl shadow-[0_18px_48px_rgba(0,0,0,0.5)] overflow-hidden z-50"
        >
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
            <Avatar
              size={40}
              name={user.name}
              src={user.picture}
              autoColor
            />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-white/95 truncate">
                {user.name}
              </div>
              <div className="text-[11.5px] text-white/55 truncate">
                {user.email}
              </div>
            </div>
          </div>

          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={loggingOut}
              className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-white/90 hover:bg-white/[0.06] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/65"
                aria-hidden
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {loggingOut ? "Signing out…" : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
