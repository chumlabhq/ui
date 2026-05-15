import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBuyMeCoffee } from "./useBuyMeCoffee";
import { UserMenu } from "./UserMenu";
import { Button } from "./ui";
import { useTheme } from "../contexts/ThemeContext";
import logoLight from "../assets/images/logo-light.png";
import logoDark from "../assets/images/logo-dark.png";

/**
 * Deep-space site header. Solid bg-base, hairline bottom rule, plain text
 * nav links. The single CTA is an off-white pill that sends users to the
 * getting-started page. The AI Playground promotion lives in the hero
 * status pill, not the header.
 *
 * AI Playground link behaviour:
 *   On the home page, prevent default and smooth-scroll to #ai-playground.
 *   On any other page, navigate to /#ai-playground; Home reads the hash on
 *   mount and scrolls.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { open: openBuyCoffee } = useBuyMeCoffee();
  const { theme, toggleTheme } = useTheme();

  const goToAIPlayground = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname === "/") {
      document
        .getElementById("ai-playground")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.setTimeout(() => navigate("/#ai-playground"), 150);
    }
  };

  const navLink =
    "text-[14px] font-normal text-cl-text hover:text-cl-text-secondary transition-colors duration-150";

  return (
    <>
      <div className="header-mount-fade pointer-events-auto fixed top-0 left-0 right-0 z-50">
        {/* Pre-launch announcement strip. Sits above the header at all times
            and is included in the --header-height CSS var so hero/page
            offsets stay aligned. Colors are hard-coded against theme so the
            contrast stays identical across light and dark surfaces. */}
        <div
          className="text-[#050608] bg-gradient-to-r from-[#7eb1ff] via-[#5b9bff] to-[#7eb1ff]"
          role="status"
          aria-label="Pre-launch announcement"
        >
          <div className="w-full px-3 sm:px-6 md:px-8">
            {/* Mobile: stacked column. Pill anchors the top, icon + full
                wrapped message sit below. Height is auto and the responsive
                --header-height var compensates so hero offsets stay aligned. */}
            <div className="sm:hidden flex flex-col items-center gap-2 py-2.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#050608] text-[#7eb1ff] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.12em] uppercase">
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7eb1ff] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7eb1ff]" />
                </span>
                Live soon
              </span>
              <div className="flex items-start justify-center gap-1.5 max-w-[280px]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 15 15"
                  fill="currentColor"
                  className="shrink-0 announcement-sparkle mt-[3px]"
                  aria-hidden
                >
                  <path d="M7.5 0L8.85 5.65L14.5 7L8.85 8.35L7.5 14L6.15 8.35L0.5 7L6.15 5.65L7.5 0Z" />
                </svg>
                <p className="text-[12px] font-semibold tracking-[-0.01em] leading-snug">
                  You found us early. We're in stealth mode. Our GitHub repo
                  and npm package aren't public yet.
                </p>
              </div>
            </div>

            {/* sm+: single horizontal line with separator dots. */}
            <div className="hidden sm:flex items-center justify-center gap-3.5 h-12 text-[14px] md:text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap">
              <svg
                width="18"
                height="18"
                viewBox="0 0 15 15"
                fill="currentColor"
                className="shrink-0 announcement-sparkle"
                aria-hidden
              >
                <path d="M7.5 0L8.85 5.65L14.5 7L8.85 8.35L7.5 14L6.15 8.35L0.5 7L6.15 5.65L7.5 0Z" />
              </svg>

              <span className="hidden lg:inline">You found us early.</span>
              <span className="hidden lg:inline opacity-50" aria-hidden>·</span>
              <span>We're still in stealth mode.</span>
              <span className="opacity-50" aria-hidden>·</span>
              <span>Our GitHub repo and npm package aren't public yet.</span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#050608] text-[#7eb1ff] px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] uppercase shrink-0">
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7eb1ff] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7eb1ff]" />
                </span>
                Live soon
              </span>
            </div>
          </div>
        </div>

        <header
          className="bg-bg-base"
          style={{ borderBottom: "0.5px solid var(--border-faint)" }}
        >
          <div className="w-full px-5 sm:px-6 md:px-8">
            <div className="grid grid-cols-[auto_1fr_auto] items-center h-[64px] gap-4">
            <Link
              to="/"
              className="flex items-center text-cl-text -ml-1"
              aria-label="Chumlab home"
              data-track-event="nav_click"
              data-track-location="header"
              data-track-target="logo"
            >
              {/* The PNG already includes the wordmark — no separate text node.
                  Logo flips with theme: light variant on dark surfaces, dark
                  variant on light surfaces. */}
              <img
                src={theme === "dark" ? logoLight : logoDark}
                alt="Chumlab"
                style={{ height: 36, width: "auto", objectFit: "contain" }}
              />
            </Link>

            <nav className="hidden md:flex items-center justify-center gap-8">
              <Link
                to="/accordion"
                className={navLink}
                data-track-event="nav_click"
                data-track-location="header"
                data-track-target="components"
              >
                Components
              </Link>
              <a
                href="/#ai-playground"
                onClick={goToAIPlayground}
                className={navLink}
                data-track-event="nav_click"
                data-track-location="header"
                data-track-target="playground"
              >
                Playground
              </a>
              <Link
                to="/blog"
                className={navLink}
                data-track-event="nav_click"
                data-track-location="header"
                data-track-target="blog"
              >
                Blog
              </Link>
              <Link
                to="/faq"
                className={navLink}
                data-track-event="nav_click"
                data-track-location="header"
                data-track-target="faq"
              >
                FAQ
              </Link>
              <button
                type="button"
                onClick={openBuyCoffee}
                className={`cursor-pointer ${navLink}`}
                data-track-event="nav_click"
                data-track-location="header"
                data-track-target="support"
              >
                Support
              </button>
            </nav>

            <div className="flex items-center gap-3 justify-self-end -mr-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-text/5 text-cl-text-secondary hover:text-cl-text transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg"
                data-track-event="theme_toggle"
                data-track-from={theme}
                data-track-to={theme === "dark" ? "light" : "dark"}
              >
                {theme === "dark" ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0.5 7C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H2.5C2.77614 8 3 7.77614 3 7.5C3 7.22386 2.77614 7 2.5 7H0.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.90381 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM12.5 7C12.2239 7 12 7.22386 12 7.5C12 7.77614 12.2239 8 12.5 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12.5ZM10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802ZM8 12.5C8 12.2239 7.77614 12 7.5 12C7.22386 12 7 12.2239 7 12.5V14.5C7 14.7761 7.22386 15 7.5 15C7.77614 15 8 14.7761 8 14.5V12.5ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M2.89998 0.499976C2.89998 0.279062 2.72089 0.0999756 2.49998 0.0999756C2.27906 0.0999756 2.09998 0.279062 2.09998 0.499976V1.09998H1.49998C1.27906 1.09998 1.09998 1.27906 1.09998 1.49998C1.09998 1.72089 1.27906 1.89998 1.49998 1.89998H2.09998V2.49998C2.09998 2.72089 2.27906 2.89998 2.49998 2.89998C2.72089 2.89998 2.89998 2.72089 2.89998 2.49998V1.89998H3.49998C3.72089 1.89998 3.89998 1.72089 3.89998 1.49998C3.89998 1.27906 3.72089 1.09998 3.49998 1.09998H2.89998V0.499976ZM5.89998 3.49998C5.89998 3.27906 5.72089 3.09998 5.49998 3.09998C5.27906 3.09998 5.09998 3.27906 5.09998 3.49998V4.09998H4.49998C4.27906 4.09998 4.09998 4.27906 4.09998 4.49998C4.09998 4.72089 4.27906 4.89998 4.49998 4.89998H5.09998V5.49998C5.09998 5.72089 5.27906 5.89998 5.49998 5.89998C5.72089 5.89998 5.89998 5.72089 5.89998 5.49998V4.89998H6.49998C6.72089 4.89998 6.89998 4.72089 6.89998 4.49998C6.89998 4.27906 6.72089 4.09998 6.49998 4.09998H5.89998V3.49998ZM1.89998 6.49998C1.89998 6.27906 1.72089 6.09998 1.49998 6.09998C1.27906 6.09998 1.09998 6.27906 1.09998 6.49998V7.09998H0.499976C0.279062 7.09998 0.0999756 7.27906 0.0999756 7.49998C0.0999756 7.72089 0.279062 7.89998 0.499976 7.89998H1.09998V8.49998C1.09998 8.72089 1.27906 8.89997 1.49998 8.89997C1.72089 8.89997 1.89998 8.72089 1.89998 8.49998V7.89998H2.49998C2.72089 7.89998 2.89998 7.72089 2.89998 7.49998C2.89998 7.27906 2.72089 7.09998 2.49998 7.09998H1.89998V6.49998ZM8.54406 0.98184L8.24618 0.941586C8.03275 0.917676 7.90692 1.1655 8.02936 1.34194C8.17013 1.54479 8.29981 1.75592 8.41754 1.97445C8.91878 2.90485 9.20322 3.96932 9.20322 5.10022C9.20322 8.37201 6.82247 11.0878 3.69887 11.6097C3.45736 11.65 3.20988 11.6772 2.96008 11.6906C2.74563 11.702 2.62729 11.9535 2.77721 12.1072C2.84551 12.1773 2.91535 12.2458 2.98667 12.3128L3.05883 12.3795L3.31883 12.6045L3.50684 12.7532L3.62796 12.8433L3.81491 12.9742L3.99079 13.089C4.11175 13.1651 4.23536 13.2375 4.36157 13.3059L4.62496 13.4412L4.88553 13.5607L5.18837 13.6828L5.43169 13.7686C5.56564 13.8128 5.70149 13.8529 5.83857 13.8885C5.94262 13.9155 6.04767 13.9401 6.15405 13.9622C6.27993 13.9883 6.40713 14.0109 6.53544 14.0298L6.85241 14.0685L7.11934 14.0892C7.24637 14.0965 7.37436 14.1002 7.50322 14.1002C11.1483 14.1002 14.1032 11.1453 14.1032 7.50023C14.1032 7.25044 14.0893 7.00389 14.0623 6.76131L14.0255 6.48407C13.991 6.26083 13.9453 6.04129 13.8891 5.82642C13.8213 5.56709 13.7382 5.31398 13.6409 5.06881L13.5279 4.80132L13.4507 4.63542L13.3766 4.48666C13.2178 4.17773 13.0353 3.88295 12.8312 3.60423L12.6782 3.40352L12.4793 3.16432L12.3157 2.98361L12.1961 2.85951L12.0355 2.70246L11.8134 2.50184L11.4925 2.24191L11.2483 2.06498L10.9562 1.87446L10.6346 1.68894L10.3073 1.52378L10.1938 1.47176L9.95488 1.3706L9.67791 1.2669L9.42566 1.1846L9.10075 1.09489L8.83599 1.03486L8.54406 0.98184ZM10.4032 5.30023C10.4032 4.27588 10.2002 3.29829 9.83244 2.40604C11.7623 3.28995 13.1032 5.23862 13.1032 7.50023C13.1032 10.593 10.596 13.1002 7.50322 13.1002C6.63646 13.1002 5.81597 12.9036 5.08355 12.5522C6.5419 12.0941 7.81081 11.2082 8.74322 10.0416C8.87963 10.2284 9.10028 10.3497 9.34928 10.3497C9.76349 10.3497 10.0993 10.0139 10.0993 9.59971C10.0993 9.24256 9.84965 8.94373 9.51535 8.86816C9.57741 8.75165 9.63653 8.63334 9.6926 8.51332C9.88358 8.63163 10.1088 8.69993 10.35 8.69993C11.0403 8.69993 11.6 8.14028 11.6 7.44993C11.6 6.75976 11.0406 6.20024 10.3505 6.19993C10.3853 5.90487 10.4032 5.60464 10.4032 5.30023Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <a
                href="https://github.com/chumlabhq/ui"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center justify-center text-cl-text hover:text-cl-text-secondary transition-colors duration-150 p-1.5"
                aria-label="GitHub"
                data-track-event="external_link_click"
                data-track-location="header"
                data-track-target="github"
                data-track-url="https://github.com/chumlabhq/ui"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                </svg>
              </a>

              <UserMenu />

              {/* fullWidthMobile={false}: header CTA stays inline next to the
                  hamburger; never stretches at any width. */}
              <Button
                variant="primary"
                size="sm"
                as="a"
                href="/getting-started"
                fullWidthMobile={false}
                className="hidden sm:inline-flex"
                data-track-event="cta_click"
                data-track-location="header"
                data-track-target="get_started"
              >
                Get started
              </Button>

              {/* Hamburger — mobile only. Same 36×36 box as the theme
                  toggle so the right-edge optical balance matches. */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-md border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-text/5 text-cl-text-secondary hover:text-cl-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                data-track-event="mobile_menu_open"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="14" x2="20" y2="14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-bg-base/80"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-bg-base rule rule-l animate-slide-in-right flex flex-col py-6 px-6">
            <button
              className="self-end mb-8 flex items-center justify-center w-9 h-9 text-cl-text hover:text-cl-text-secondary transition-colors"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="eyebrow mb-3">Menu</div>
            <div className="rule rule-t" />

            <Link
              to="/accordion"
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-normal text-cl-text py-3.5 rule rule-b"
              data-track-event="nav_click"
              data-track-location="mobile_menu"
              data-track-target="components"
            >
              Components
            </Link>
            <a
              href="/#ai-playground"
              onClick={goToAIPlayground}
              className="text-[15px] font-normal text-cl-text py-3.5 rule rule-b"
              data-track-event="nav_click"
              data-track-location="mobile_menu"
              data-track-target="playground"
            >
              Playground
            </a>
            <Link
              to="/blog"
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-normal text-cl-text py-3.5 rule rule-b"
              data-track-event="nav_click"
              data-track-location="mobile_menu"
              data-track-target="blog"
            >
              Blog
            </Link>
            <Link
              to="/faq"
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-normal text-cl-text py-3.5 rule rule-b"
              data-track-event="nav_click"
              data-track-location="mobile_menu"
              data-track-target="faq"
            >
              FAQ
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openBuyCoffee();
              }}
              className="cursor-pointer text-left text-[15px] font-normal text-cl-text py-3.5 rule rule-b"
              data-track-event="nav_click"
              data-track-location="mobile_menu"
              data-track-target="support"
            >
              Support
            </button>
            <a
              href="https://github.com/chumlabhq/ui"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-normal text-cl-text py-3.5 rule rule-b"
              data-track-event="external_link_click"
              data-track-location="mobile_menu"
              data-track-target="github"
              data-track-url="https://github.com/chumlabhq/ui"
            >
              GitHub
            </a>

            <Button
              variant="primary"
              size="md"
              as="a"
              href="/getting-started"
              onClick={() => setMenuOpen(false)}
              className="mt-6"
              data-track-event="cta_click"
              data-track-location="mobile_menu"
              data-track-target="get_started"
            >
              Get started
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}

export default SiteHeader;
