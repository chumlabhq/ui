import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogoMark } from "../brand/Logo";
import { CoffeeMiniIcon } from "./BuyMeCoffee";
import { useBuyMeCoffee } from "./useBuyMeCoffee";
import { UserMenu } from "./UserMenu";

/**
 * Shared top navigation used on every top-level page (Home, FAQ, Blog listing,
 * Blog post). Includes the fixed header bar, the mobile hamburger, and the
 * mobile slide-in drawer — all in one component so every page renders an
 * identical nav.
 *
 * AI Playground link behaviour:
 *  • On the home page ("/"): preventDefault + smooth scroll to #ai-playground.
 *  • On any other page: navigate to /#ai-playground; Home's mount-time hash
 *    useEffect handles the scroll.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { open: openBuyCoffee } = useBuyMeCoffee();

  const goToAIPlayground = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname === "/") {
      document
        .getElementById("ai-playground")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Give the drawer close animation a tick before routing away.
      window.setTimeout(() => navigate("/#ai-playground"), 150);
    }
  };

  return (
    <>
      <header className="pointer-events-auto fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#04040a]/60">
        <div className="w-full px-5">
          <div className="flex items-center justify-between py-5">
            <Link to="/" className="flex items-center gap-3">
              <LogoMark size={160} />
            </Link>
            <div className="flex items-center gap-1">
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  to="/accordion"
                  className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                >
                  Components
                </Link>
                <Link
                  to="/blog"
                  className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                >
                  Blog
                </Link>
                <Link
                  to="/faq"
                  className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                >
                  FAQ
                </Link>
                {/* Support — amber-tinted pill that reads as a CTA rather
                    than a nav link, so users with an impulse to back open
                    source get a visible target instead of plain text. */}
                <button
                  type="button"
                  onClick={openBuyCoffee}
                  className="cursor-pointer group inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400/18 via-orange-400/18 to-rose-400/15 hover:from-amber-400/28 hover:via-orange-400/28 hover:to-rose-400/25 border border-amber-300/30 hover:border-amber-300/55 shadow-[0_0_14px_-6px_rgba(251,191,36,0.55)] hover:shadow-[0_0_20px_-4px_rgba(251,191,36,0.7)] transition-all duration-300"
                >
                  <CoffeeMiniIcon className="text-amber-200 transition-transform duration-300 group-hover:-rotate-6" />
                  <span className="bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 bg-clip-text text-transparent">
                    Support
                  </span>
                </button>
              </div>
              {/* AI Playground — primary CTA. Gradient pill + animated sparkle
                  icon and soft glow make it the most prominent nav item, per
                  the design direction to drive clicks toward the playground. */}
              <a
                href="/#ai-playground"
                onClick={goToAIPlayground}
                className="group hidden sm:inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/30 via-indigo-500/35 to-violet-500/30 hover:from-blue-500/40 hover:via-indigo-500/45 hover:to-violet-500/40 border border-indigo-400/50 hover:border-indigo-300/70 shadow-[0_0_22px_-5px_rgba(129,140,248,0.6)] hover:shadow-[0_0_28px_-4px_rgba(129,140,248,0.8)] transition-all duration-300 sm:ml-2"
              >
                <SparklesIcon />
                <span className="bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 bg-clip-text text-transparent">
                  AI Playground
                </span>
              </a>
              <Link
                to="/getting-started"
                className="text-[12px] font-medium px-5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/12 border border-white/8 hover:border-blue-500/25 transition-all duration-300 ml-1"
              >
                Get Started
              </Link>
              <a
                href="https://github.com/chumlabhq/ui"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center justify-center text-white/90 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-white/6"
                aria-label="GitHub"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>

              {/* Account chip - renders only when signed in. Avatar+chevron
                  on mobile, full name+email chip from md+ (handled inside the
                  component's responsive classes). */}
              <div className="ml-1">
                <UserMenu />
              </div>

              {/* Hamburger button — mobile only */}
              <button
                className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/[0.08] transition-colors duration-300 ml-1"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/90"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU OVERLAY ── */}
      {menuOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[60] sm:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute top-0 right-0 h-full w-64 max-w-[80vw] bg-[#0a0a14] border-l border-white/[0.08] shadow-2xl animate-slide-in-right flex flex-col py-6 px-5">
            <button
              className="self-end mb-6 flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/[0.08] transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/90"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {/* AI Playground — promoted to the top of the mobile drawer with
                gradient fill + sparkle + "New" badge so it matches the desktop
                treatment and is the first thing users see when the menu opens. */}
            <a
              href="/#ai-playground"
              onClick={goToAIPlayground}
              className="group flex items-center gap-2 text-[15px] font-semibold px-3.5 py-3 rounded-xl mb-3 bg-gradient-to-r from-blue-500/32 via-indigo-500/38 to-violet-500/32 border border-indigo-400/55 shadow-[0_0_26px_-6px_rgba(129,140,248,0.7)]"
            >
              <SparklesIcon />
              <span className="bg-gradient-to-r from-blue-100 via-indigo-100 to-violet-100 bg-clip-text text-transparent">
                AI Playground
              </span>
            </a>
            <Link
              to="/accordion"
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-medium text-white/90 hover:text-white py-3 border-b border-white/[0.06] transition-colors duration-300"
            >
              Components
            </Link>
            <Link
              to="/blog"
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-medium text-white/90 hover:text-white py-3 border-b border-white/[0.06] transition-colors duration-300"
            >
              Blog
            </Link>
            <Link
              to="/faq"
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-medium text-white/90 hover:text-white py-3 border-b border-white/[0.06] transition-colors duration-300"
            >
              FAQ
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openBuyCoffee();
              }}
              className="cursor-pointer flex items-center gap-2 text-[15px] font-medium text-white/90 hover:text-white py-3 border-b border-white/[0.06] transition-colors duration-300"
            >
              <CoffeeMiniIcon className="text-amber-300" />
              Support us
            </button>
            <a
              href="https://github.com/chumlabhq/ui"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-medium text-white/90 hover:text-white py-3 border-b border-white/[0.06] transition-colors duration-300 flex items-center gap-2"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

/**
 * Small Heroicons "sparkles" (solid) used on the AI Playground nav pill.
 * Given its own component so desktop and mobile stay visually identical and
 * a single tweak updates both. A subtle pulse on hover lifts the CTA.
 */
function SparklesIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-indigo-100 shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576L1.044 12.72a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 006.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.194.777.802 1.384 1.578 1.579l1.036.258a.75.75 0 010 1.456l-1.036.258c-.777.195-1.384.802-1.579 1.578l-.258 1.036a.75.75 0 01-1.455 0l-.26-1.036a2.25 2.25 0 00-1.577-1.578l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.25 2.25 0 001.577-1.579l.26-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395a1.5 1.5 0 00-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395a1.5 1.5 0 00.948-.948l.395-1.183A.75.75 0 0116.5 15z"
      />
    </svg>
  );
}

export default SiteHeader;
