import { describe, it, expect, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  getDirectionStyles,
  getClosingDelta,
  getTransformString,
  isHorizontalDirection,
  getTouchAction,
  pushDrawer,
  popDrawer,
  isTopDrawer,
  usePrefersReducedMotion,
} from "../utils/helpers";

// ─── getDirectionStyles ──────────────────────────────────────────────────────

describe("getDirectionStyles", () => {
  const size = "400px";
  const fraction = 1; // fully open → closedPercent = 0
  const duration = 300;

  it("returns correct styles for 'left' direction", () => {
    const styles = getDirectionStyles("left", size, fraction, duration);
    expect(styles.top).toBe(0);
    expect(styles.left).toBe(0);
    expect(styles.height).toBe("100vh");
    expect(styles.width).toBe(size);
    expect(String(styles.transform)).toContain("translateX");
    expect(String(styles.transition)).toContain("300ms");
  });

  it("returns correct styles for 'right' direction", () => {
    const styles = getDirectionStyles("right", size, fraction, duration);
    expect(styles.top).toBe(0);
    expect(styles.right).toBe(0);
    expect(styles.height).toBe("100vh");
    expect(styles.width).toBe(size);
    expect(String(styles.transform)).toContain("translateX");
  });

  it("returns correct styles for 'top' direction", () => {
    const styles = getDirectionStyles("top", size, fraction, duration);
    expect(styles.top).toBe(0);
    expect(styles.left).toBe(0);
    expect(styles.width).toBe("100vw");
    expect(styles.height).toBe(size);
    expect(String(styles.transform)).toContain("translateY");
  });

  it("returns correct styles for 'bottom' direction", () => {
    const styles = getDirectionStyles("bottom", size, fraction, duration);
    expect(styles.bottom).toBe(0);
    expect(styles.left).toBe(0);
    expect(styles.width).toBe("100vw");
    expect(styles.height).toBe(size);
    expect(String(styles.transform)).toContain("translateY");
  });

  it("reflects fraction in the transform value", () => {
    // fraction = 0 → closedPercent = 100 (fully closed)
    const closedStyles = getDirectionStyles("right", size, 0, duration);
    expect(String(closedStyles.transform)).toContain("100%");

    // fraction = 1 → closedPercent = 0 (fully open)
    const openStyles = getDirectionStyles("right", size, 1, duration);
    expect(String(openStyles.transform)).toContain("0%");
  });
});

// ─── getClosingDelta ─────────────────────────────────────────────────────────

describe("getClosingDelta", () => {
  it("returns deltaY for 'bottom'", () => {
    expect(getClosingDelta("bottom", 10, 50)).toBe(50);
  });

  it("returns -deltaY for 'top'", () => {
    expect(getClosingDelta("top", 10, 50)).toBe(-50);
  });

  it("returns -deltaX for 'left'", () => {
    expect(getClosingDelta("left", 30, 0)).toBe(-30);
  });

  it("returns deltaX for 'right'", () => {
    expect(getClosingDelta("right", 30, 0)).toBe(30);
  });
});

// ─── getTransformString ──────────────────────────────────────────────────────

describe("getTransformString", () => {
  it("returns translateX with negative percent for 'left'", () => {
    expect(getTransformString("left", 80)).toBe("translateX(-80%)");
  });

  it("returns translateX with positive percent for 'right'", () => {
    expect(getTransformString("right", 80)).toBe("translateX(80%)");
  });

  it("returns translateY with negative percent for 'top'", () => {
    expect(getTransformString("top", 80)).toBe("translateY(-80%)");
  });

  it("returns translateY with positive percent for 'bottom'", () => {
    expect(getTransformString("bottom", 80)).toBe("translateY(80%)");
  });

  it("handles 0% (fully open state)", () => {
    expect(getTransformString("right", 0)).toBe("translateX(0%)");
  });
});

// ─── isHorizontalDirection ───────────────────────────────────────────────────

describe("isHorizontalDirection", () => {
  it("returns true for 'left'", () => {
    expect(isHorizontalDirection("left")).toBe(true);
  });

  it("returns true for 'right'", () => {
    expect(isHorizontalDirection("right")).toBe(true);
  });

  it("returns false for 'top'", () => {
    expect(isHorizontalDirection("top")).toBe(false);
  });

  it("returns false for 'bottom'", () => {
    expect(isHorizontalDirection("bottom")).toBe(false);
  });
});

// ─── getTouchAction ──────────────────────────────────────────────────────────

describe("getTouchAction", () => {
  it("returns 'pan-y' for horizontal drawers (left/right)", () => {
    expect(getTouchAction("left")).toBe("pan-y");
    expect(getTouchAction("right")).toBe("pan-y");
  });

  it("returns 'pan-x' for vertical drawers (top/bottom)", () => {
    expect(getTouchAction("top")).toBe("pan-x");
    expect(getTouchAction("bottom")).toBe("pan-x");
  });
});

// ─── pushDrawer / popDrawer / isTopDrawer ────────────────────────────────────
// The drawer stack is a module-level singleton so we manage state carefully.

describe("Drawer stack management", () => {
  // Clean up after each test by popping any IDs we push.
  afterEach(() => {
    // Force-clear by popping all known test IDs
    popDrawer("drawer-a");
    popDrawer("drawer-b");
    popDrawer("drawer-c");
  });

  it("isTopDrawer returns false when stack is empty", () => {
    expect(isTopDrawer("drawer-a")).toBe(false);
  });

  it("pushDrawer makes the pushed ID the top drawer", () => {
    pushDrawer("drawer-a");
    expect(isTopDrawer("drawer-a")).toBe(true);
  });

  it("last pushed drawer is the top drawer", () => {
    pushDrawer("drawer-a");
    pushDrawer("drawer-b");
    expect(isTopDrawer("drawer-b")).toBe(true);
    expect(isTopDrawer("drawer-a")).toBe(false);
  });

  it("pushDrawer moves an existing ID to the top (deduplication)", () => {
    pushDrawer("drawer-a");
    pushDrawer("drawer-b");
    // Re-push drawer-a → it should become the top
    pushDrawer("drawer-a");
    expect(isTopDrawer("drawer-a")).toBe(true);
    expect(isTopDrawer("drawer-b")).toBe(false);
  });

  it("popDrawer removes an ID from the stack", () => {
    pushDrawer("drawer-a");
    popDrawer("drawer-a");
    expect(isTopDrawer("drawer-a")).toBe(false);
  });

  it("popDrawer restores the previous top drawer", () => {
    pushDrawer("drawer-a");
    pushDrawer("drawer-b");
    popDrawer("drawer-b");
    expect(isTopDrawer("drawer-a")).toBe(true);
  });

  it("popDrawer on an ID not in the stack is a no-op", () => {
    pushDrawer("drawer-a");
    // drawer-c was never pushed – should not throw and drawer-a stays on top
    popDrawer("drawer-c");
    expect(isTopDrawer("drawer-a")).toBe(true);
  });
});

// ─── usePrefersReducedMotion ─────────────────────────────────────────────────
// Covers lines 9-21: subscribeReducedMotion + getReducedMotionSnapshot

describe("usePrefersReducedMotion", () => {
  it("returns false when window.matchMedia reports no reduced-motion preference", () => {
    // jsdom does not implement matchMedia; provide a stub that returns matches=false
    const addEventListenerMock = vi.fn();
    const removeEventListenerMock = vi.fn();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when window.matchMedia reports prefers-reduced-motion: reduce", () => {
    const addEventListenerMock = vi.fn();
    const removeEventListenerMock = vi.fn();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: true,
        media: query,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("subscribes and unsubscribes from matchMedia change events", () => {
    const addEventListenerMock = vi.fn();
    const removeEventListenerMock = vi.fn();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        dispatchEvent: vi.fn(),
      })),
    });

    const { unmount } = renderHook(() => usePrefersReducedMotion());
    expect(addEventListenerMock).toHaveBeenCalledWith("change", expect.any(Function));

    unmount();
    expect(removeEventListenerMock).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
