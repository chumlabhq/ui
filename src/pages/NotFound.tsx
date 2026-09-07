import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { usePageMeta } from "../hooks/useJsonLd.js";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";

/**
 * The catch-all used to be `<Navigate to="/" replace />`, which made every
 * unknown URL answer 200 with the homepage — a soft 404 that a crawler indexes
 * as a duplicate of `/`. This says "gone" instead, and `noindex` is the only
 * status signal a static SPA can send from the client.
 *
 * `data-route-404` is what scripts/assert-playground-removed.mjs looks for: it
 * has to distinguish "the route 404s" from "the route renders something". The
 * requested path is deliberately not echoed back — the same gate reads the
 * rendered text, and a page that repeats whatever the visitor typed would put
 * "playground" back on screen for anyone who asks for it.
 */
const META = [{ name: "robots", content: "noindex, nofollow" }];

export default function NotFound() {
  useDocumentTitle("Page not found");
  usePageMeta(META);

  return (
    <div className="min-h-screen bg-bg-base text-fg" data-route-404>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-[1200px] flex-col items-center justify-center gap-5 px-4 text-center sm:px-6">
        <p className="eyebrow">404</p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">
          This page doesn't exist.
        </h1>
        <p className="text-fg-muted max-w-[52ch]">
          The link may be out of date, or the page may have moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-md border border-border-soft px-4 py-2 text-sm transition-colors hover:border-border-active"
          >
            Home
          </Link>
          <Link
            to="/introduction"
            className="rounded-md border border-border-soft px-4 py-2 text-sm transition-colors hover:border-border-active"
          >
            Documentation
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
