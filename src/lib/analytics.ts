/**
 * Thin wrappers around the Google Analytics 4 (gtag.js) and Microsoft
 * Clarity globals injected by index.html. All event tracking on the
 * marketing site funnels through here so we have one place to:
 *   - swap providers
 *   - add consent gating
 *   - silence calls in dev / SSR
 *
 * The hook in src/hooks/useAnalytics.ts owns the route-change page-view
 * tracking and the delegated [data-track-event] click listener — tag
 * elements with that attribute rather than wiring trackEvent() everywhere.
 */

type Primitive = string | number | boolean | null | undefined;
export type EventParams = Record<string, Primitive>;

const isBrowser = typeof window !== "undefined";
const isDev = import.meta.env.DEV;

interface ClarityFn {
  (action: "set", key: string, value: string): void;
  (action: "event", name: string): void;
  (action: "identify", id: string, sessionId?: string, pageId?: string, name?: string): void;
  (action: "consent"): void;
  (action: string, ...args: unknown[]): void;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ClarityFn;
  }
}

const safeGtag = (...args: unknown[]) => {
  if (!isBrowser) return;
  if (isDev) {
    console.debug("[analytics] gtag", ...args);
    return;
  }
  window.gtag?.(...args);
};

const safeClarity = (...args: Parameters<ClarityFn>) => {
  if (!isBrowser) return;
  if (isDev) {
    console.debug("[analytics] clarity", ...args);
    return;
  }
  window.clarity?.(...(args as unknown[] as [string, ...unknown[]]));
};

export function trackPageView(path: string, title?: string) {
  safeGtag("event", "page_view", {
    page_path: path,
    page_location: isBrowser ? window.location.href : path,
    page_title: title ?? (isBrowser ? document.title : undefined),
  });
  safeClarity("set", "page", path);
}

export function trackEvent(name: string, params?: EventParams) {
  safeGtag("event", name, params ?? {});
  safeClarity("event", name);
}
