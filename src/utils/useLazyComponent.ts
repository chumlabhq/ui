import { useEffect, useState, type ComponentType } from "react";

/**
 * A component fetched only when the prop that renders it is set.
 *
 * `assert-bundle-size.mjs` measures the EAGER closure — it deliberately does
 * not follow `import()`, because CountryFlag lazy-loads one chunk per country
 * and summing all 250 would report a cost no consumer pays. So a half of a
 * component that most consumers never render belongs behind a dynamic import,
 * and this is the shape: `usePackagedFlag` did it for a string, this does it
 * for a subtree.
 *
 * Null on a server and on the first client render — the cache is empty and the
 * effect has not run — so the two trees agree and the subtree arrives on a
 * later render. That is ADR 003's rule applied to a chunk rather than a portal,
 * and the SSR record in the consumer matrix is what proves it.
 *
 * Call sites carry an `eslint-disable` for `react-hooks/static-components`:
 * the rule sees a capitalised binding assigned during render and assumes a new
 * component identity each pass, which would remount the subtree. The identity
 * here is the same function object out of the cache below, every render.
 *
 * `load` must be a module-scope constant. An inline `() => import("./X.js")` is
 * a new function on every render, which would miss the cache every time and
 * re-enter the effect forever.
 */
const cache = new Map<() => Promise<unknown>, unknown>();

export function useLazyComponent<P>(
  enabled: boolean,
  load: () => Promise<ComponentType<P>>,
): ComponentType<P> | null {
  // A counter rather than the component itself: `useState` treats a function
  // as a lazy initializer and would call the component with no props.
  const [, bump] = useState(0);

  useEffect(() => {
    if (!enabled || cache.has(load)) return;

    let active = true;
    void load().then((component) => {
      cache.set(load, component);
      if (active) bump((n) => n + 1);
    });

    return () => {
      active = false;
    };
  }, [enabled, load]);

  // Read during render, so a second instance on the page paints on its first
  // pass with no effect round-trip.
  return enabled ? ((cache.get(load) as ComponentType<P> | undefined) ?? null) : null;
}
