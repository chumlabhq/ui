/** @jsxImportSource react */
/**
 * AUDIT-GAP.md §1.7 — the cl-s marker had zero coverage across 47 test files.
 *
 * The pragma above is load-bearing. This project runs the contracts tier with
 * `jsxImportSource: src/jsx`, so the LIBRARY compiles against the marking JSX
 * runtime — exactly as `vite build --mode lib` compiles it. Forcing this file
 * back onto React's own runtime makes the JSX written here behave like a
 * CONSUMER's, which is the only way the asChild assertions below mean anything:
 * if the test's own elements were pre-marked, they would pass regardless of
 * whether Slot propagates the marker.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { MARKER, cn } from "../../utils/scopedCn";
import { cn as publicCn } from "../../utils/cn";
import { MARKER as RUNTIME_MARKER } from "../../jsx/mark";
import { COMPONENTS, classTokens } from "./registry";

import { setReducedMotion } from "../../test/matchMedia";

// Fixtures render motion-aware components; the stub answers nothing
// until asked. reduced-motion.contract is where the true branch is tested.
beforeEach(() => setReducedMotion(false));

const marked = (el: Element | null) =>
  !!el?.getAttribute("class")?.split(/\s+/).includes(MARKER);

describe("marker contract", () => {
  it("the public cn never marks", () => {
    // The library's utilities are confined to .cl-s so they cannot match a
    // consumer's markup. Stamping the marker onto a consumer's class string
    // would undo that — see src/utils/cn.ts.
    expect(publicCn("flex items-center")).toBe("flex items-center");
    expect(publicCn("p-2 p-4")).toBe("p-4");
    expect(publicCn()).toBe("");
  });

  it("cn() and the JSX runtime agree on the marker", () => {
    // Two literals, one in the runtime (which must stay dependency-free) and
    // one in cn(). Nothing else keeps them in sync.
    expect(MARKER).toBe(RUNTIME_MARKER);
    expect(MARKER).toBe("cl-s");
  });

  describe("cn()", () => {
    it("appends the marker to a non-empty class string", () => {
      expect(cn("flex items-center")).toBe("flex items-center cl-s");
    });

    it("leaves an empty result empty", () => {
      // "cl-s" here would make every `className={cn(...) || undefined}` guard
      // in the library truthy.
      expect(cn()).toBe("");
      expect(cn("", null, undefined, false)).toBe("");
    });

    it("is idempotent", () => {
      expect(cn(cn("flex"))).toBe("flex cl-s");
      expect(cn("flex cl-s cl-s")).toBe("flex cl-s");
    });

    it("keeps the marker last, after tailwind-merge has run", () => {
      const result = cn("p-2 p-4");
      expect(result.split(" ").at(-1)).toBe(MARKER);
      expect(result).toBe("p-4 cl-s");
    });

    it("does not let the marker survive a merge as a duplicate", () => {
      const tokens = cn("cl-s", "flex", "cl-s").split(" ");
      expect(tokens.filter((t) => t === MARKER)).toHaveLength(1);
    });
  });

  describe.each(COMPONENTS)("$name", ({ Component, props, wrap }) => {
    const mount = (node: React.ReactNode) => (wrap ? wrap(node) : node);
    it("renders at least one marked element", () => {
      const { container } = render(
        mount(<Component {...props} />) as React.ReactElement,
      );
      const tokens = classTokens(container);
      // A component that renders no class at all needs no marker; one that
      // renders classes must scope them, or none of dist/styles.css applies.
      if (tokens.size === 0 || (tokens.size === 1 && tokens.has(MARKER))) return;
      expect(tokens.has(MARKER)).toBe(true);
    });

    it("never carries the marker twice on one element", () => {
      const { container } = render(
        mount(<Component {...props} />) as React.ReactElement,
      );
      for (const el of [container, ...Array.from(container.querySelectorAll("*"))]) {
        const cls = el.getAttribute?.("class");
        if (!cls) continue;
        const count = cls.split(/\s+/).filter((t) => t === MARKER).length;
        expect(count, `${el.tagName}.class="${cls}"`).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("asChild", () => {
    const asChildComponents = COMPONENTS.filter((c) => c.supports.asChild);

    it("the index reports at least one asChild component", () => {
      expect(asChildComponents.length).toBeGreaterThan(0);
    });

    describe.each(asChildComponents)("$name", ({ name, Component, props }) => {
      it("marks whatever element it merges its classes onto", () => {
        // <a> is authored here, by React's own runtime, so it arrives unmarked.
        // If the library's class string reaches it without the marker, every
        // utility in that string is inert — AUDIT-GAP.md §1.1.
        const { container } = render(
          <Component {...props} asChild>
            <a href="#target" data-consumer-element>
              {name}
            </a>
          </Component>,
        );

        // Not every asChild adopts the consumer's element. Avatar renders its
        // own subtree and uses Slot to merge props onto that instead, so the
        // marker comes from the JSX runtime and the root is what must carry it.
        const consumerEl = container.querySelector("[data-consumer-element]");
        const target = consumerEl ?? container.firstElementChild;
        expect(target, "asChild rendered nothing at all").not.toBeNull();

        const cls = target?.getAttribute("class") ?? "";
        // Nothing was merged onto it, so there is nothing to scope.
        if (!cls) return;
        expect(marked(target), `class="${cls}"`).toBe(true);
      });
    });
  });
});
