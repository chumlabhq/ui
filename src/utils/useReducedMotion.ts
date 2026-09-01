import { useSyncExternalStore } from "react";
import { isBrowser } from "./isBrowser";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Subscribed once per query, not per hook call: 34 components now read this and
 * a listener each would be 34 listeners on one MediaQueryList.
 */
let shared: MediaQueryList | null = null;
const mediaQuery = (): MediaQueryList | null => {
  if (!isBrowser) return null;
  if (!shared) shared = window.matchMedia(QUERY);
  return shared;
};

const subscribe = (onChange: () => void): (() => void) => {
  const mql = mediaQuery();
  if (!mql) return () => {};
  // Safari 14+ supports addEventListener; older Safari only addListener.
  if (mql.addEventListener) {
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }
  mql.addListener(onChange);
  return () => mql.removeListener(onChange);
};

const getSnapshot = (): boolean => mediaQuery()?.matches ?? false;

/**
 * Whether motion should be suppressed.
 *
 * `useSyncExternalStore` rather than a `useState` initializer, and the third
 * argument is the point: it gives React a server snapshot, so hydration renders
 * what the server rendered and then updates. The previous implementation read
 * `matchMedia` from a state initializer, which runs on the client during
 * hydration and produces markup the server never sent — a mismatch for every
 * user who has the preference set (AUDIT-GAP §2.5). Drawer already did it this
 * way; this is that implementation, shared.
 *
 * Pass `true`/`false` to override the query, `"auto"` (the default) to follow it.
 */
export function useReducedMotion(
  reduceMotion: boolean | "auto" = "auto",
): boolean {
  const prefersReducedMotion = useSyncExternalStore(
    subscribe,
    getSnapshot,
    // The server cannot know the preference, so it assumes none and lets the
    // first client render correct it.
    () => false,
  );
  return reduceMotion === "auto" ? prefersReducedMotion : reduceMotion;
}

/** Test-only: the module-level MediaQueryList outlives a stubbed matchMedia. */
export const resetReducedMotionCache = (): void => {
  shared = null;
};
