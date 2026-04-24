import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogoMark } from "../brand/Logo";
import { CoffeeMiniIcon } from "./BuyMeCoffee";
import { useBuyMeCoffee } from "./useBuyMeCoffee";

/**
 * Shared footer used on every top-level page (Home, FAQ, Blog listing, Blog
 * post). Centralising the markup here is the only way to guarantee the footer
 * stays visually identical across routes — and it puts the AI-Playground nav
 * logic in exactly one place so cross-page navigation + same-page smooth
 * scroll both work correctly.
 */
export function SiteFooter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open: openBuyCoffee } = useBuyMeCoffee();

  const goToAIPlayground = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document
        .getElementById("ai-playground")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Home.tsx reads window.location.hash on mount and scrolls accordingly.
      navigate("/#ai-playground");
    }
  };

  return (
    <footer className="w-full px-6 sm:px-10 pt-16 pb-8">
      <div className="border-t border-white/[0.08] pt-8">
        {/* Row: logo — nav links — social */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8">
          <LogoMark size={120} />
          <div className="flex items-center gap-6">
            <Link
              to="/accordion"
              className="text-sm text-white transition-colors duration-300"
            >
              Components
            </Link>
            <a
              href="/#ai-playground"
              onClick={goToAIPlayground}
              className="text-sm text-white transition-colors duration-300"
            >
              AI Playground
            </a>
            <Link
              to="/blog"
              className="text-sm text-white transition-colors duration-300"
            >
              Blog
            </Link>
            <Link
              to="/faq"
              className="text-sm text-white transition-colors duration-300"
            >
              FAQ
            </Link>
            <button
              type="button"
              onClick={openBuyCoffee}
              className="cursor-pointer inline-flex items-center gap-1.5 text-sm text-white transition-colors duration-300"
            >
              <CoffeeMiniIcon className="text-amber-300" />
              Support
            </button>
            <a
              href="https://github.com/chumlabhq/ui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors duration-300"
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
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-white">
          <span className="text-xs sm:text-sm text-left w-full sm:w-auto">
            &copy; {new Date().getFullYear()} Chumlab &middot; MIT License
            <br className="sm:hidden" />
            <span className="hidden sm:inline">&middot; </span>Built with{" "}
            {"☕"} and way too many tabs
          </span>
          <a
            href="mailto:hello@chumlab.com"
            className="text-xs sm:text-sm text-white transition-colors duration-300 text-left sm:text-right w-full sm:w-auto shrink-0"
          >
            {"💬"} Got feedback? Ping us at{" "}
            <span className="underline underline-offset-2">
              hello@chumlab.com
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
