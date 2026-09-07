import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { installMatchMedia, resetMediaQueries } from "./matchMedia.js";
import { resetReducedMotionCache } from "../utils/useReducedMotion.js";

// The SSR contract suite runs with `environment: "node"`, where there is no
// window to patch. Everything below this guard is jsdom setup; bail rather than
// throw on `Object.defineProperty(window, …)`.
const hasDom = typeof window !== "undefined";

afterEach(() => {
  if (hasDom) {
    cleanup();
    resetMediaQueries();
    resetReducedMotionCache();
  }
});

if (hasDom) {

  // Mock ResizeObserver which is not available in jsdom
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  globalThis.ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver;

  // matchMedia answers nothing until a test says what a query returns.
  // See src/test/matchMedia.ts for why "false by default" was the wrong stub.
  installMatchMedia();

  Element.prototype.scrollIntoView = vi.fn();

  // Suppress React 19 console warnings in tests
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
}
