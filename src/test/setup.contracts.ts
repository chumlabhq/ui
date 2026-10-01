import { vi } from "vitest";

/**
 * Contracts only: every lazy half's `load` goes through `trackLoad`, so
 * `applyAct` can wait for the component's own pending loads rather than for the
 * modules behind them. The real hook still does all the work; this only hands
 * it a tracked `load`. See `src/test/lazyLoads.ts`.
 */
vi.mock("../utils/useLazyComponent.js", async (importOriginal) => {
  const real = await importOriginal<typeof import("../utils/useLazyComponent.js")>();
  const { trackLoad } = await import("./lazyLoads.js");
  return {
    ...real,
    useLazyComponent: <P,>(enabled: boolean, load: Parameters<typeof real.useLazyComponent<P>>[1]) =>
      real.useLazyComponent<P>(enabled, trackLoad(load)),
  };
});
