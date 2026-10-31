import { describe, it, expect, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  getSideStyles,
  getClosingDelta,
  getTransformString,
  isHorizontalSide,
  getTouchAction,
  pushDrawer,
  popDrawer,
  isTopDrawer,
  usePrefersReducedMotion,
} from "../utils/helpers.js";

describe("getSideStyles", () => {
  const size = "400px";
  const fraction = 1; // fully open → closedPercent = 0
  const duration = 300;

  it("returns correct styles for 'start' direction", () => {
    const styles = getSideStyles("start", size, fraction, duration);
    expect(styles.top).toBe(0);
    expect(styles.insetInlineStart).toBe(0);
    expect(styles.height).toBe("100vh");
    expect(styles.width).toBe(size);
    expect(String(styles.transform)).toContain("translateX");
    expect(String(styles.transition)).toContain("300ms");
  });

  it("returns correct styles for 'end' direction", () => {
    const styles = getSideStyles("end", size, fraction, duration);
    expect(styles.top).toBe(0);
    expect(styles.insetInlineEnd).toBe(0);
    expect(styles.height).toBe("100vh");
    expect(styles.width).toBe(size);
    expect(String(styles.transform)).toContain("translateX");
  });

  it("returns correct styles for 'top' direction", () => {
    const styles = getSideStyles("top", size, fraction, duration);
    expect(styles.top).toBe(0);
    expect(styles.insetInlineStart).toBe(0);
    expect(styles.width).toBe("100vw");
    expect(styles.height).toBe(size);
    expect(String(styles.transform)).toContain("translateY");
  });

  it("returns correct styles for 'bottom' direction", () => {
    const styles = getSideStyles("bottom", size, fraction, duration);
    expect(styles.bottom).toBe(0);
    expect(styles.insetInlineStart).toBe(0);
    expect(styles.width).toBe("100vw");
    expect(styles.height).toBe(size);
    expect(String(styles.transform)).toContain("translateY");
  });

  it("reflects fraction in the transform value", () => {
    // fraction = 0 → closedPercent = 100 (fully closed)
    const closedStyles = getSideStyles("end", size, 0, duration);
    expect(String(closedStyles.transform)).toContain("100%");

    // fraction = 1 → closedPercent = 0 (fully open)
    const openStyles = getSideStyles("end", size, 1, duration);
    expect(String(openStyles.transform)).toContain("0%");
  });
});

describe("getClosingDelta", () => {
  it("returns deltaY for 'bottom'", () => {
    expect(getClosingDelta("bottom", 10, 50, false)).toBe(50);
  });

  it("returns -deltaY for 'top'", () => {
    expect(getClosingDelta("top", 10, 50, false)).toBe(-50);
  });

  it("returns -deltaX for 'start' left to right", () => {
    expect(getClosingDelta("start", 30, 0, false)).toBe(-30);
  });

  it("returns deltaX for 'end' left to right", () => {
    expect(getClosingDelta("end", 30, 0, false)).toBe(30);
  });

  it("closes a 'start' drawer on a rightward drag right to left, where start is the right edge", () => {
    expect(getClosingDelta("start", 30, 0, true)).toBe(30);
  });

  it("closes an 'end' drawer on a leftward drag right to left", () => {
    expect(getClosingDelta("end", -30, 0, true)).toBe(30);
  });
});

describe("getTransformString", () => {
  it("returns translateX toward the inline start for 'start', signed by the page direction", () => {
    expect(getTransformString("start", 80)).toBe("translateX(calc(var(--cl-inline-sign, 1) * -80%))");
  });

  it("returns translateX toward the inline end for 'end', signed by the page direction", () => {
    expect(getTransformString("end", 80)).toBe("translateX(calc(var(--cl-inline-sign, 1) * 80%))");
  });

  it("returns translateY with negative percent for 'top'", () => {
    expect(getTransformString("top", 80)).toBe("translateY(-80%)");
  });

  it("returns translateY with positive percent for 'bottom'", () => {
    expect(getTransformString("bottom", 80)).toBe("translateY(80%)");
  });

  it("handles 0% (fully open state)", () => {
    expect(getTransformString("end", 0)).toBe("translateX(calc(var(--cl-inline-sign, 1) * 0%))");
  });
});

describe("isHorizontalSide", () => {
  it("returns true for 'start'", () => {
    expect(isHorizontalSide("start")).toBe(true);
  });

  it("returns true for 'end'", () => {
    expect(isHorizontalSide("end")).toBe(true);
  });

  it("returns false for 'top'", () => {
    expect(isHorizontalSide("top")).toBe(false);
  });

  it("returns false for 'bottom'", () => {
    expect(isHorizontalSide("bottom")).toBe(false);
  });
});

describe("getTouchAction", () => {
  it("returns 'pan-y' for horizontal drawers (start/end)", () => {
    expect(getTouchAction("start")).toBe("pan-y");
    expect(getTouchAction("end")).toBe("pan-y");
  });

  // A sheet's content scrolls along the axis it dismisses on, so the panel
  // leaves touch to the browser and the drag starts from the handle or header.
  it("returns 'auto' for vertical drawers (top/bottom)", () => {
    expect(getTouchAction("top")).toBe("auto");
    expect(getTouchAction("bottom")).toBe("auto");
  });
});

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
