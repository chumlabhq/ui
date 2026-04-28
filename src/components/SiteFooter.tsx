import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBuyMeCoffee } from "./useBuyMeCoffee";
import { useTheme } from "../contexts/ThemeContext";
import Reveal from "./Reveal/Reveal";
import logoLight from "../assets/images/logo-light.png";
import logoDark from "../assets/images/logo-dark.png";

/**
 * Deep-space site footer. Four-row layout:
 *   1. Brand block — oversized wordmark + serif italic tagline.
 *   2. Four link columns (Product / Resources / Company / Connect).
 *   3. Status divider — "All systems operational" + version + hairline rule.
 *   4. Bottom row — copyright + feedback line.
 *
 * A handful of decorative starfield dots float at the top to echo the hero.
 * Entrance animations match the rest of the site (IntersectionObserver flips
 * `is-visible` on each row; `prefers-reduced-motion: reduce` short-circuits).
 *
 * Spec hrefs that have no matching `App.tsx` route map to existing
 * conventions: `/components → /accordion`, `/playground → /#ai-playground`,
 * `/docs → /getting-started`, `/changelog → GitHub releases`,
 * `/license → GitHub LICENSE`. The Support button still triggers the
 * existing BuyMeCoffee modal (no `/support` route exists).
 */

const STARS: Array<{ x: string; y: string; size: string; opacity: number }> = [
  { x: "8%", y: "12%", size: "1px", opacity: 0.25 },
  { x: "22%", y: "34%", size: "0.5px", opacity: 0.18 },
  { x: "39%", y: "9%", size: "1.5px", opacity: 0.32 },
  { x: "55%", y: "26%", size: "0.5px", opacity: 0.15 },
  { x: "68%", y: "14%", size: "1px", opacity: 0.28 },
  { x: "82%", y: "30%", size: "0.5px", opacity: 0.2 },
  { x: "92%", y: "11%", size: "1.5px", opacity: 0.35 },
  { x: "47%", y: "42%", size: "0.5px", opacity: 0.16 },
];

export function SiteFooter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open: openBuyCoffee } = useBuyMeCoffee();
  const { theme } = useTheme();

  const goToAIPlayground = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document
        .getElementById("ai-playground")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/#ai-playground");
    }
  };

  return (
    <Reveal
      as="footer"
      delay={0}
      translateY={0}
      duration={200}
      className="relative bg-bg-base border-t border-cl-border mt-12 sm:mt-16 overflow-hidden"
    >
      {/* Decorative starfield (top half only). */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[55%] pointer-events-none"
      >
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-cl-text"
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8">
        {/* ROW 1 — Brand block. Logo flips with theme: the light-variant
            PNG (white wordmark) on dark surfaces, the dark-variant PNG
            (black wordmark) on cream paper. */}
        <div className="mb-6">
          <Link
            to="/"
            aria-label="Chumlab home"
            className="inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-4 focus-visible:ring-offset-cl-bg rounded-md"
          >
            <img
              src={theme === "dark" ? logoLight : logoDark}
              alt="Chumlab"
              className="h-10 sm:h-11 w-auto object-contain group-hover:opacity-85 transition-opacity duration-300"
            />
          </Link>
        </div>

        {/* ROW 2 — Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-6">
          {/* Product */}
          <FooterColumn title="Product">
            <FooterLink>
              <Link to="/accordion" className={LINK_CLASS}>
                Components
              </Link>
            </FooterLink>
            <FooterLink>
              <a
                href="/#ai-playground"
                onClick={goToAIPlayground}
                className={`${LINK_CLASS} inline-flex items-center gap-2`}
              >
                AI Playground
              </a>
            </FooterLink>
            <FooterLink>
              <Link to="/getting-started" className={LINK_CLASS}>
                Docs
              </Link>
            </FooterLink>
          </FooterColumn>

          {/* Resources */}
          <FooterColumn title="Resources">
            <FooterLink>
              <Link to="/blog" className={LINK_CLASS}>
                Blog
              </Link>
            </FooterLink>
            <FooterLink>
              <Link to="/faq" className={LINK_CLASS}>
                FAQ
              </Link>
            </FooterLink>
          </FooterColumn>

          {/* Company */}
          <FooterColumn title="Company">
            <FooterLink>
              <button
                type="button"
                onClick={openBuyCoffee}
                className={`cursor-pointer text-left ${LINK_CLASS}`}
              >
                Support
              </button>
            </FooterLink>
            <FooterLink>
              <a
                href="https://github.com/chumlabhq/ui/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                License (MIT)
              </a>
            </FooterLink>
          </FooterColumn>

          {/* Connect */}
          <FooterColumn title="Connect">
            <FooterLink>
              <a
                href="https://github.com/chumlabhq/ui"
                target="_blank"
                rel="noopener noreferrer"
                className={`${LINK_CLASS} inline-flex items-center gap-2`}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                  aria-hidden
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
            </FooterLink>
            <FooterLink>
              <a
                href="mailto:hello@chumlab.com?subject=Question%20about%20Chumlab&body=Hi%20Chumlab%20team%2C%0A%0A"
                className={`${LINK_CLASS} inline-flex items-center gap-2`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                  aria-hidden
                >
                  <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6Zm-2 0-8 5-8-5h16Zm0 12H4V8l8 5 8-5v10Z" />
                </svg>
                Email
              </a>
            </FooterLink>
          </FooterColumn>
        </div>

        {/* ROW 3 — Bottom row, separated by a hairline rule. */}
        <div className="border-t border-cl-border pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="font-sans text-[12px] text-cl-text-secondary leading-relaxed">
              © 2026 Chumlab
              <span aria-hidden className="text-cl-text-disabled mx-1.5">
                ·
              </span>
              MIT License
              <span aria-hidden className="text-cl-text-disabled mx-1.5">
                ·
              </span>
              Built with <span className="inline-block mx-0.5">☕</span> and way
              too many tabs
            </p>
            <p className="font-sans text-[12px] text-cl-text-secondary leading-relaxed inline-flex items-center gap-2">
              <span aria-hidden>💬</span>
              <span>Got feedback? Ping us at</span>
              <a
                href="mailto:hello@chumlab.com?subject=Feedback%20on%20Chumlab&body=Hi%20Chumlab%20team%2C%0A%0A"
                className="text-cl-text hover:text-cl-accent transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg rounded"
              >
                hello@chumlab.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

const LINK_CLASS =
  "font-sans text-[14px] text-cl-text hover:text-cl-text transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg rounded";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-cl-text-tertiary mb-4">
        {title}
      </div>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

export default SiteFooter;
