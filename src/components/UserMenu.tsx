import { useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar/Avatar";
import { useGetMeQuery, useLogoutMutation } from "../redux/api/authApi";

/**
 * Deep-space account chip. Renders nothing when there's no signed-in user.
 * Dropdown sits on bg-overlay with a hairline border. No gradients.
 */
export function UserMenu() {
  const { data, isLoading, isError } = useGetMeQuery();
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const user = isError ? null : data?.user;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
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
      /* Logout endpoint clears the cookie unconditionally on the server side. */
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="cursor-pointer flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-cl-bg-elevated transition-colors"
      >
        <Avatar size={26} name={user.name} src={user.picture} autoColor />
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-cl-text-tertiary transition-transform duration-200 ${
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
          className="absolute right-0 top-full mt-2 w-64 rounded-md bg-cl-bg-elevated overflow-hidden z-50 rule"
          style={{
            border: "0.5px solid var(--border-soft)",
          }}
        >
          <div className="flex items-center gap-3 px-4 py-3 rule rule-b">
            <Avatar size={36} name={user.name} src={user.picture} autoColor />
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-cl-text truncate">
                {user.name}
              </div>
              <div className="text-[11.5px] text-cl-text-tertiary truncate">
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
              className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2 rounded text-[13px] text-cl-text hover:bg-cl-bg-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cl-text-tertiary"
                aria-hidden
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {loggingOut ? "Signing out..." : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
