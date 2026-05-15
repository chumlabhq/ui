import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent, trackPageView } from "../lib/analytics";

/**
 * Marketing-site analytics wiring. Mount once at the root of the React
 * tree (App.tsx).
 *
 * Two things happen here:
 *
 * 1. Page-view tracking on every React Router navigation. We skip the
 *    very first emission because gtag.js's initial `config` call in
 *    index.html already fires a `page_view` for the entry URL — sending
 *    a second one from here on mount would double-count.
 *
 * 2. Delegated click tracking. Any element in the page that carries a
 *    `data-track-event="<event_name>"` attribute will fire a custom GA4
 *    event when clicked. Extra `data-track-*` attributes become event
 *    parameters (camelCased, lower-snake_case-friendly), e.g.
 *
 *      <a href="/blog"
 *         data-track-event="nav_click"
 *         data-track-location="header"
 *         data-track-target="blog">
 *
 *    emits `nav_click` with `{ location: "header", target: "blog" }`.
 *
 *    Why delegation over per-element handlers? Two reasons: (a) we want
 *    to track ~100 surfaces across the marketing site without sprinkling
 *    onClick wrappers everywhere, and (b) adding a new tracked element
 *    is just a markup change — no JS edits, no analytics-library import.
 */
export function useAnalytics() {
  const location = useLocation();
  const isFirstNavigation = useRef(true);

  // Page views on route change.
  useEffect(() => {
    if (isFirstNavigation.current) {
      isFirstNavigation.current = false;
      return;
    }
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  // Delegated click tracking — capture phase so it fires even when a
  // child handler stops propagation (e.g. dropdown trigger close).
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const tracked = target.closest<HTMLElement>("[data-track-event]");
      if (!tracked) return;

      const eventName = tracked.dataset.trackEvent;
      if (!eventName) return;

      // Collect every `data-track-*` attribute besides `data-track-event`
      // itself. Keys come out as camelCase from `dataset`; we normalize
      // them to lower_snake_case which is the GA4 convention.
      const params: Record<string, string> = {};
      for (const [key, value] of Object.entries(tracked.dataset)) {
        if (key === "trackEvent" || !key.startsWith("track")) continue;
        if (value == null) continue;
        const paramName = key
          .slice("track".length)
          .replace(/([A-Z])/g, "_$1")
          .toLowerCase()
          .replace(/^_/, "");
        if (paramName) params[paramName] = value;
      }

      trackEvent(eventName, params);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
}
