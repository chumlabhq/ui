import { vi } from "vitest";

/**
 * A `matchMedia` stub that starts with NO answer for any query.
 *
 * The previous stub answered `matches: false` for everything, which meant a
 * component that reads `prefers-reduced-motion` correctly and one that ignores
 * it produced identical output — GATE-HONESTY §5.2 recorded the
 * reduced-motion gate as inert for exactly this reason. Defaulting to "no
 * preference" is not neutral: it is the answer that hides the bug.
 *
 * So an unregistered query throws. A test that renders a component reading a
 * media query has to say what that query answers, which is the only way the
 * answer can be varied and therefore the only way the branch can be tested.
 */
const answers = new Map<string, boolean>();
const listeners = new Map<string, Set<(event: MediaQueryListEvent) => void>>();

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Declares what `query` answers for the rest of the test. */
export const setMediaQuery = (query: string, matches: boolean): void => {
  answers.set(query, matches);
  const event = { matches, media: query } as MediaQueryListEvent;
  for (const listener of listeners.get(query) ?? []) listener(event);
};

/** Convenience for the only query the library actually reads. */
export const setReducedMotion = (matches: boolean): void =>
  setMediaQuery(REDUCED_MOTION, matches);

export const resetMediaQueries = (): void => {
  answers.clear();
  listeners.clear();
};

const unanswered = (query: string) =>
  new Error(
    `matchMedia("${query}") was called but the test has not said what it answers.\n` +
      `Call setMediaQuery("${query}", false) — or setReducedMotion(false) — from src/test/matchMedia.\n` +
      `Defaulting to false is what made the reduced-motion gate inert (GATE-HONESTY §5.2).`,
  );

export const installMatchMedia = (): void => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => {
      if (!answers.has(query)) throw unanswered(query);
      const on = (listener: (event: MediaQueryListEvent) => void) => {
        if (!listeners.has(query)) listeners.set(query, new Set());
        listeners.get(query)!.add(listener);
      };
      const off = (listener: (event: MediaQueryListEvent) => void) =>
        listeners.get(query)?.delete(listener);
      return {
        get matches() {
          return answers.get(query)!;
        },
        media: query,
        onchange: null,
        addEventListener: (_: string, l: (e: MediaQueryListEvent) => void) => on(l),
        removeEventListener: (_: string, l: (e: MediaQueryListEvent) => void) => off(l),
        addListener: on,
        removeListener: off,
        dispatchEvent: () => true,
      } as unknown as MediaQueryList;
    }),
  });
};
