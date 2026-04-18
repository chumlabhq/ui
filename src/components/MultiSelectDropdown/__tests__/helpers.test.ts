import { describe, it, expect, vi, beforeEach } from "vitest";
import { computeDropdownCoords, scrollOptionIntoView } from "../utils/helpers";

// ─── helpers for mocking getBoundingClientRect / window dimensions ────────────

function mockTriggerRect(overrides: Partial<DOMRect> = {}): DOMRect {
  return {
    top: 100,
    bottom: 140,
    left: 50,
    right: 350,
    width: 300,
    height: 40,
    x: 50,
    y: 100,
    toJSON: () => ({}),
    ...overrides,
  } as DOMRect;
}

function makeEl(
  triggerRect: Partial<DOMRect> = {},
  dropdownHeight = 200,
): { triggerEl: HTMLElement; dropdownEl: HTMLElement } {
  const triggerEl = document.createElement("div");
  const dropdownEl = document.createElement("div");

  vi.spyOn(triggerEl, "getBoundingClientRect").mockReturnValue(
    mockTriggerRect(triggerRect),
  );
  vi.spyOn(dropdownEl, "getBoundingClientRect").mockReturnValue({
    height: dropdownHeight,
    top: 0,
    bottom: dropdownHeight,
    left: 0,
    right: 300,
    width: 300,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);

  return { triggerEl, dropdownEl };
}

function setViewport(height: number, width: number) {
  Object.defineProperty(window, "innerHeight", { value: height, configurable: true });
  Object.defineProperty(window, "innerWidth", { value: width, configurable: true });
  // Ensure visualViewport is undefined so helpers fall back to innerHeight/innerWidth
  Object.defineProperty(window, "visualViewport", { value: undefined, configurable: true });
}

// ─── computeDropdownCoords ────────────────────────────────────────────────────

describe("computeDropdownCoords", () => {
  beforeEach(() => {
    setViewport(800, 1024);
  });

  it("returns 'bottom' position when there is enough space below", () => {
    // trigger bottom=140, gap=8, dropdownHeight=200 → 140+8+200=348 < 800 → fits below
    const { triggerEl, dropdownEl } = makeEl({ bottom: 140 }, 200);
    const coords = computeDropdownCoords(triggerEl, dropdownEl, "bottom", 8);

    expect(coords.position).toBe("bottom");
    expect(coords.top).toBe(140 + 8); // rect.bottom + gap
    expect(coords.left).toBe(50);
    expect(coords.width).toBe(300);
  });

  it("flips to 'top' when not enough space below but enough space above", () => {
    // trigger near the bottom so there's not enough room below but enough above
    // bottom=750, gap=8, dropdownHeight=200 → 750+8+200=958 > 800 → flip
    // rect.top=710, 710-8-200=502 > 0 → flip to top
    const { triggerEl, dropdownEl } = makeEl(
      { top: 710, bottom: 750, left: 50, width: 300 },
      200,
    );
    const coords = computeDropdownCoords(triggerEl, dropdownEl, "bottom", 8);

    expect(coords.position).toBe("top");
    // top = rect.top - dropdownHeight - gap = 710 - 200 - 8 = 502
    expect(coords.top).toBe(502);
  });

  it("stays 'bottom' when preferred='bottom', no room below, and no room above", () => {
    // bottom=750 → not enough below; top=20 → 20-8-200 < 0 → can't flip → stays bottom
    const { triggerEl, dropdownEl } = makeEl(
      { top: 20, bottom: 750, left: 50, width: 300 },
      200,
    );
    const coords = computeDropdownCoords(triggerEl, dropdownEl, "bottom", 8);
    // Can't flip because rect.top - gap - dropdownHeight = 20-8-200 < 0
    expect(coords.position).toBe("bottom");
  });

  it("flips from 'top' to 'bottom' when not enough space above but enough below", () => {
    // preferred=top, but rect.top=50, 50-8-200 < 0 → try bottom: 140+8+200=348 ≤ 800 → flip
    const { triggerEl, dropdownEl } = makeEl(
      { top: 50, bottom: 140, left: 50, width: 300 },
      200,
    );
    const coords = computeDropdownCoords(triggerEl, dropdownEl, "top", 8);
    expect(coords.position).toBe("bottom");
    expect(coords.top).toBe(140 + 8);
  });

  it("stays 'top' when forcePosition=true even without enough room above", () => {
    const { triggerEl, dropdownEl } = makeEl(
      { top: 50, bottom: 140, left: 50, width: 300 },
      200,
    );
    const coords = computeDropdownCoords(triggerEl, dropdownEl, "top", 8, true);
    expect(coords.position).toBe("top");
  });

  it("clamps left when dropdown would overflow right edge of viewport", () => {
    // left=900, dropdownWidth=300 → 900+300=1200 > 1024 → clamp to 1024-300=724
    const { triggerEl, dropdownEl } = makeEl(
      { top: 100, bottom: 140, left: 900, right: 1200, width: 300 },
      200,
    );
    const coords = computeDropdownCoords(triggerEl, dropdownEl, "bottom", 8);
    expect(coords.left).toBe(1024 - 300);
  });

  it("returns correct width equal to the trigger's rect.width", () => {
    const { triggerEl, dropdownEl } = makeEl({ width: 250 }, 100);
    const coords = computeDropdownCoords(triggerEl, dropdownEl, "bottom", 4);
    expect(coords.width).toBe(250);
  });
});

// ─── scrollOptionIntoView ─────────────────────────────────────────────────────

describe("scrollOptionIntoView", () => {
  it("calls scrollIntoView with block:nearest", () => {
    const el = document.createElement("div");
    const spy = vi.spyOn(el, "scrollIntoView").mockImplementation(() => {});
    scrollOptionIntoView(el);
    expect(spy).toHaveBeenCalledWith({ block: "nearest" });
  });

  it("falls back to scrollIntoView(false) when the block option throws", () => {
    const el = document.createElement("div");
    let callCount = 0;
    vi.spyOn(el, "scrollIntoView").mockImplementation((arg?: boolean | ScrollIntoViewOptions) => {
      callCount++;
      if (typeof arg === "object") {
        throw new Error("Options not supported");
      }
    });
    scrollOptionIntoView(el);
    // It should have been called twice: first with options (throws), then with false
    expect(callCount).toBe(2);
  });
});
