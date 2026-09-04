import { describe, it, expect, vi } from "vitest";
import { scrollOptionIntoView } from "../utils/helpers";

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
