import { describe, it, expect, afterEach, vi } from "vitest";
import { readDirection, isRtl } from "../isBrowser";
import { acquireScrollLock, releaseScrollLock, resetScrollLock } from "../scrollLock";

const inside = (...dirs: Array<string | null>) => {
  let parent: HTMLElement = document.body;
  for (const dir of dirs) {
    const el = document.createElement("div");
    if (dir !== null) el.setAttribute("dir", dir);
    parent.appendChild(el);
    parent = el;
  }
  return parent;
};

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("dir");
  vi.restoreAllMocks();
});

describe("readDirection", () => {
  it("reads the nearest dir, so an inner ltr inside an rtl page is ltr", () => {
    expect(readDirection(inside("rtl", null))).toBe("rtl");
    expect(readDirection(inside("rtl", "ltr", null))).toBe("ltr");
    expect(readDirection(inside("ltr", "RTL"))).toBe("rtl");
  });

  it("falls back to the document's direction", () => {
    const el = inside(null);
    expect(readDirection(el)).toBe("ltr");
    document.documentElement.dir = "rtl";
    expect(readDirection(el)).toBe("rtl");
    expect(readDirection(null)).toBe("rtl");
  });

  it("takes the computed direction where no dir attribute decides, as a stylesheet's `direction` does", () => {
    const el = inside("auto", null);
    const real = window.getComputedStyle;
    vi.spyOn(window, "getComputedStyle").mockImplementation((node) => {
      const style = real(node);
      return new Proxy(style, { get: (t, p) => (p === "direction" ? "rtl" : Reflect.get(t, p)) });
    });
    expect(readDirection(el)).toBe("rtl");
  });

  it("isRtl answers the same question as a boolean", () => {
    expect(isRtl(inside("rtl"))).toBe(true);
    expect(isRtl(inside("ltr"))).toBe(false);
  });
});

describe("scroll lock padding", () => {
  const withGutter = (width: number, probeLeft: number) => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1000);
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1000 - width);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ left: probeLeft } as DOMRect);
  };

  afterEach(() => resetScrollLock());

  it("pads the right where the gutter is on the right, and restores it", () => {
    withGutter(15, 0);
    acquireScrollLock();
    expect(document.body.style.paddingRight).toBe("15px");
    expect(document.body.style.paddingLeft).toBe("");
    releaseScrollLock();
    expect(document.body.style.paddingRight).toBe("");
  });

  it("pads the left where the gutter is measured on the left, as an RTL page can put it", () => {
    withGutter(15, 15);
    acquireScrollLock();
    expect(document.body.style.paddingLeft).toBe("15px");
    expect(document.body.style.paddingRight).toBe("");
    releaseScrollLock();
    expect(document.body.style.paddingLeft).toBe("");
  });

  it("pads nothing without a gutter, and leaves no probe behind", () => {
    withGutter(0, 0);
    acquireScrollLock();
    expect(document.body.style.paddingRight).toBe("");
    expect(document.body.children).toHaveLength(0);
  });

  it("pads neither side on an RTL page without a gutter, as overlay scrollbars leave it", () => {
    document.documentElement.dir = "rtl";
    withGutter(0, 0);
    acquireScrollLock();
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingLeft).toBe("");
    expect(document.body.style.paddingRight).toBe("");
    releaseScrollLock();
    expect(document.body.style.overflow).toBe("");
  });
});
