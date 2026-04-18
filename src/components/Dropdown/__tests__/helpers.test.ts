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

function makeDropdownEl(height: number): HTMLElement {
  const el = document.createElement("div");
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    top: 0,
    bottom: height,
    left: 0,
    right: 200,
    width: 200,
    height,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
  return el;
}

describe("computeDropdownCoords", () => {
  beforeEach(() => {
    // Set up a standard 1024×768 viewport
    Object.defineProperty(window, "innerHeight", { value: 768, configurable: true });
    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
    // Ensure visualViewport is null so we fall back to innerHeight/innerWidth
    Object.defineProperty(window, "visualViewport", { value: null, configurable: true });
  });

  it("positions below the trigger when preferred position is bottom and there is room", () => {
    // trigger near top of viewport — plenty of space below
    const trigger = makeTriggerEl({ top: 50, bottom: 90, left: 100, right: 300, width: 200, height: 40 });
    const dropdown = makeDropdownEl(150);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, false);

    expect(result.position).toBe("bottom");
    expect(result.top).toBe(90 + 4); // rect.bottom + gap
  });

  it("flips to top when bottom position would overflow viewport (lines 29-30)", () => {
    // trigger near bottom of viewport so dropdown would overflow downward
    const trigger = makeTriggerEl({ top: 650, bottom: 690, left: 100, right: 300, width: 200, height: 40 });
    // dropdown is 150px tall: 690 + 4 + 150 = 844 > 768 (viewport height) → should flip
    // flip condition: rect.top - gap - dropdownHeight > 0 → 650 - 4 - 150 = 496 > 0 ✓
    const dropdown = makeDropdownEl(150);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, false);

    expect(result.position).toBe("top");
    expect(result.top).toBe(650 - 150 - 4); // rect.top - dropdownHeight - gap
  });

  it("stays at bottom when flip would also overflow (not enough room above)", () => {
    // trigger is near bottom but not enough space above either
    const trigger = makeTriggerEl({ top: 100, bottom: 140, left: 100, right: 300, width: 200, height: 40 });
    // dropdown is 700px tall: 140 + 4 + 700 = 844 > 768 → try flip
    // flip: 100 - 4 - 700 = -604, NOT > 0 → stay at bottom
    const dropdown = makeDropdownEl(700);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, false);

    expect(result.position).toBe("bottom");
  });

  it("flips preferred top to bottom when there is not enough room above (line 46 path)", () => {
    // trigger near top — no space above, plenty below
    const trigger = makeTriggerEl({ top: 30, bottom: 70, left: 100, right: 300, width: 200, height: 40 });
    // dropdown is 100px tall: 30 - 4 - 100 = -74 < 0 → try flip to bottom
    // 70 + 4 + 100 = 174 <= 768 ✓
    const dropdown = makeDropdownEl(100);

    const result = computeDropdownCoords(trigger, dropdown, "top", 4, false);

    expect(result.position).toBe("bottom");
  });

  it("stays at top when preferred top and bottom also overflows", () => {
    const trigger = makeTriggerEl({ top: 30, bottom: 70, left: 100, right: 300, width: 200, height: 40 });
    // dropdown 700px tall: top-test: 30 - 4 - 700 = -674 < 0 → try flip
    // bottom-test: 70 + 4 + 700 = 774 > 768 → NOT <=, stay top
    const dropdown = makeDropdownEl(700);

    const result = computeDropdownCoords(trigger, dropdown, "top", 4, false);

    expect(result.position).toBe("top");
  });

  it("respects forcePosition and never flips", () => {
    const trigger = makeTriggerEl({ top: 650, bottom: 690, left: 100, right: 300, width: 200, height: 40 });
    const dropdown = makeDropdownEl(150);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, true);

    // forcePosition=true → should NOT flip
    expect(result.position).toBe("bottom");
  });

  it("clamps left position when dropdown would overflow right edge (line 46 equivalent)", () => {
    // trigger near right edge of viewport
    const trigger = makeTriggerEl({ top: 100, bottom: 140, left: 900, right: 1100, width: 200, height: 40 });
    const dropdown = makeDropdownEl(100);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, false);

    // 900 + 200 = 1100 > 1024 (viewport width) → clamp: max(0, 1024 - 200) = 824
    expect(result.left).toBe(824);
  });

  it("returns trigger width in result", () => {
    const trigger = makeTriggerEl({ top: 100, bottom: 140, left: 100, right: 300, width: 200, height: 40 });
    const dropdown = makeDropdownEl(100);

    const result = computeDropdownCoords(trigger, dropdown, "bottom", 4, false);

    expect(result.width).toBe(200);
  });
});

describe("scrollOptionIntoView", () => {
  it("calls scrollIntoView with block: nearest normally", () => {
    const el = document.createElement("div");
    const spy = vi.spyOn(el, "scrollIntoView");

    scrollOptionIntoView(el);

    expect(spy).toHaveBeenCalledWith({ block: "nearest" });
  });

  it("falls back to scrollIntoView(false) when the first call throws (line 56)", () => {
    const el = document.createElement("div");
    let callCount = 0;
    vi.spyOn(el, "scrollIntoView").mockImplementation((arg?: unknown) => {
      callCount++;
      // Only throw on the first (options-object) call
      if (typeof arg === "object") {
        throw new Error("not supported");
      }
    });

    scrollOptionIntoView(el);

    expect(callCount).toBe(2);
  });
});
