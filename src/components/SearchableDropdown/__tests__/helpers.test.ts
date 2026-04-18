import { describe, it, expect, vi, beforeEach } from "vitest";
import { computeDropdownCoords, scrollOptionIntoView } from "../utils/helpers";

function makeTriggerEl(rect: Partial<DOMRect>): HTMLElement {
  const el = document.createElement("div");
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 200,
    height: 40,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  } as DOMRect);
  return el;
}

function makeDropdownEl(height: number, width = 200): HTMLElement {
  const el = document.createElement("div");
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    top: 0,
    bottom: height,
    left: 0,
    right: width,
    width,
    height,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
  return el;
}

describe("SearchableDropdown computeDropdownCoords", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerHeight", { value: 768, configurable: true });
    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
    Object.defineProperty(window, "visualViewport", { value: null, configurable: true });
  });

  it("positions below the trigger when preferred position is bottom and there is room", () => {
    const trigger = makeTriggerEl({ top: 50, bottom: 90, left: 100, right: 300, width: 200, height: 40 });
    const dropdown = makeDropdownEl(150);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, false);

    expect(result.position).toBe("bottom");
    expect(result.top).toBe(90 + 4);
  });

  it("flips to top when bottom would overflow viewport (lines 27-28)", () => {
    // trigger near bottom so dropdown overflows downward
    const trigger = makeTriggerEl({ top: 650, bottom: 690, left: 100, right: 300, width: 200, height: 40 });
    // 690 + 4 + 150 = 844 > 768 → flip check: 650 - 4 - 150 = 496 > 0 ✓
    const dropdown = makeDropdownEl(150);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, false);

    expect(result.position).toBe("top");
    expect(result.top).toBe(650 - 150 - 4);
  });

  it("stays bottom when there is not enough room above either", () => {
    // trigger bottom-ish but not enough space above
    const trigger = makeTriggerEl({ top: 100, bottom: 140, left: 100, right: 300, width: 200, height: 40 });
    // 700px dropdown: 140 + 4 + 700 = 844 > 768 → flip: 100 - 4 - 700 = -604 NOT > 0 → stay bottom
    const dropdown = makeDropdownEl(700);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, false);

    expect(result.position).toBe("bottom");
  });

  it("flips preferred top to bottom when not enough room above (line 45 path)", () => {
    // trigger near top
    const trigger = makeTriggerEl({ top: 30, bottom: 70, left: 100, right: 300, width: 200, height: 40 });
    // 30 - 4 - 100 = -74 < 0 → try bottom: 70 + 4 + 100 = 174 <= 768 ✓
    const dropdown = makeDropdownEl(100);

    const result = computeDropdownCoords(trigger, dropdown, "top", 4, false);

    expect(result.position).toBe("bottom");
  });

  it("stays top when bottom also overflows (preferred top, both overflow)", () => {
    const trigger = makeTriggerEl({ top: 30, bottom: 70, left: 100, right: 300, width: 200, height: 40 });
    // 700px dropdown: top: 30-4-700=-674<0 → try bottom: 70+4+700=774 > 768 NOT <= → stay top
    const dropdown = makeDropdownEl(700);

    const result = computeDropdownCoords(trigger, dropdown, "top", 4, false);

    expect(result.position).toBe("top");
  });

  it("respects forcePosition and never flips", () => {
    const trigger = makeTriggerEl({ top: 650, bottom: 690, left: 100, right: 300, width: 200, height: 40 });
    const dropdown = makeDropdownEl(150);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, true);

    expect(result.position).toBe("bottom");
  });

  it("clamps left when dropdown actual width causes right overflow (line 45 — left clamping)", () => {
    // trigger near right edge; dropdown is wider than trigger
    const trigger = makeTriggerEl({ top: 100, bottom: 140, left: 900, right: 1000, width: 100, height: 40 });
    // dropdown actualWidth = max(100, 200) = 200; 900 + 200 = 1100 > 1024 → clamp: 1024 - 200 = 824
    const dropdown = makeDropdownEl(100, 200);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, false);

    expect(result.left).toBe(1024 - 200);
  });

  it("does not clamp left when there is sufficient space", () => {
    const trigger = makeTriggerEl({ top: 100, bottom: 140, left: 100, right: 300, width: 200, height: 40 });
    const dropdown = makeDropdownEl(100, 200);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, false);

    expect(result.left).toBe(100);
  });

  it("returns trigger width in result", () => {
    const trigger = makeTriggerEl({ top: 100, bottom: 140, left: 100, right: 300, width: 200, height: 40 });
    const dropdown = makeDropdownEl(100);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, false);

    expect(result.width).toBe(200);
  });
});

describe("SearchableDropdown scrollOptionIntoView", () => {
  it("calls scrollIntoView with block: nearest", () => {
    const el = document.createElement("div");
    const spy = vi.spyOn(el, "scrollIntoView");

    scrollOptionIntoView(el);

    expect(spy).toHaveBeenCalledWith({ block: "nearest" });
  });

  it("falls back to scrollIntoView(false) when options object throws (line 55)", () => {
    const el = document.createElement("div");
    let callCount = 0;
    vi.spyOn(el, "scrollIntoView").mockImplementation((arg?: unknown) => {
      callCount++;
      if (typeof arg === "object") {
        throw new Error("not supported");
      }
    });

    scrollOptionIntoView(el);

    expect(callCount).toBe(2);
  });
});
