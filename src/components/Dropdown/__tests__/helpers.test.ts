import { describe, it, expect, vi } from "vitest";
import { scrollOptionIntoView } from "../utils/helpers.js";

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
