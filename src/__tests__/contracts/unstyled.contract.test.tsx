/** @jsxImportSource react */
/**
 * The contract from docs/adr/001-unstyled-contract.md, asserted across every
 * component: `unstyled` strips decoration, not layout.
 *
 * Each component's UNSTYLED_*_CLASSES is now derived from its own defaults via
 * structuralOnly() rather than hand-written as an all-empty mirror, so the two
 * sets share one source of truth. This suite is what proves the derivation
 * actually reaches the DOM.
 *
 * Expectations are derived, never listed: for each component the structural
 * tokens are computed from its own DEFAULT_*_CLASSES via the ADR classifier,
 * then narrowed to the tokens that actually reach the DOM.
 *
 * Iterates FIXTURES, not default props. Under minimal props most of the library
 * never renders — GATE-HONESTY §3 measured 377 of 495 slots missing — so this
 * suite was previously asserting the contract only on whichever handful of slots
 * a bare render happened to produce.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { COMPONENTS, classTokens } from "./registry";
import { fixturesFor } from "../fixtures";
import waivers from "../../../docs/adr/002-unrenderable-keys.json";

/**
 * Tokens that survive `unstyled` because they are written as literals at a JSX
 * call site rather than in a constants file. constants.contract owns them — it
 * holds the ratcheting baseline of 125 such literals — so listing them here
 * routes each defect to one gate instead of two, without hiding any. The
 * staleness check below stops the list rotting.
 */
const LEAKS = (waivers as { decorativeLeaks: Record<string, string[]> })
  .decorativeLeaks;
import { isStructural, splitLayers } from "../../utils/classLayers";

import { setReducedMotion } from "../../test/matchMedia";

// Fixtures render motion-aware components; the stub answers nothing
// until asked. reduced-motion.contract is where the true branch is tested.
beforeEach(() => setReducedMotion(false));

const candidates = COMPONENTS.filter((c) => c.supports.unstyled && c.defaults);

describe("unstyled contract", () => {
  it("the index reports components with an unstyled prop and default classes", () => {
    expect(candidates.length).toBeGreaterThan(0);
  });

  describe.each(candidates)("$name", ({ name, Component, props, defaults }) => {
    const fixtures = fixturesFor(name).filter((f) => !f.render);
    // Tokens the component's own defaults declare as structural.
    const declaredStructural = new Set(
      Object.values(defaults!).flatMap((value) =>
        typeof value === "string" ? splitLayers(value).structural : [],
      ),
    );

    it("keeps structural utilities that the styled render puts in the DOM", async () => {
      const styled = new Set<string>();
      const unstyled = new Set<string>();
      for (const f of fixtures) {
        for (const [target, on] of [[styled, false], [unstyled, true]] as const) {
          const { container } = render(
            (f.wrap ? f.wrap(
              <Component {...props} {...f.props} unstyled={on}>
              {f.children as React.ReactNode}
            </Component>
            ) : (
              <Component {...props} {...f.props} unstyled={on}>
              {f.children as React.ReactNode}
            </Component>
            )) as React.ReactElement,
          );
          if (f.act) await f.act(container);
          for (const t of classTokens(document.body)) target.add(t);
          cleanup();
        }
      }

      // Only tokens that genuinely reached the DOM styled are in scope. This is
      // what keeps unreachable slots (error text, shimmers, open-only surfaces)
      // from producing false failures.
      const reachable = [...declaredStructural].filter((t) => styled.has(t));
      if (reachable.length === 0) return;

      const dropped = reachable.filter((t) => !unstyled.has(t));
      expect(
        dropped,
        `unstyled dropped structural utilities: ${dropped.join(" ")}`,
      ).toEqual([]);
    });

    it("drops decorative utilities", async () => {
      const styled = new Set<string>();
      const unstyled = new Set<string>();
      for (const f of fixtures) {
        for (const [target, on] of [[styled, false], [unstyled, true]] as const) {
          const { container } = render(
            (f.wrap ? f.wrap(
              <Component {...props} {...f.props} unstyled={on}>
              {f.children as React.ReactNode}
            </Component>
            ) : (
              <Component {...props} {...f.props} unstyled={on}>
              {f.children as React.ReactNode}
            </Component>
            )) as React.ReactElement,
          );
          if (f.act) await f.act(container);
          for (const t of classTokens(document.body)) target.add(t);
          cleanup();
        }
      }

      // Anything still present after unstyled that is decorative AND came from
      // a default class set is a leak. Tokens the component hardcodes outside
      // its constants (AUDIT-GAP.md §4.6) would show up here too, which is
      // intentional — they are the same category of defect.
      const declaredDecorative = new Set(
        Object.values(defaults!).flatMap((value) =>
          typeof value === "string" ? splitLayers(value).decorative : [],
        ),
      );

      const waived = new Set(LEAKS[name] ?? []);
      const leaked = [...declaredDecorative].filter(
        (t) => styled.has(t) && unstyled.has(t) && !waived.has(t),
      );
      expect(
        leaked,
        `unstyled kept decorative utilities: ${leaked.join(" ")}`,
      ).toEqual([]);

      const stale = [...waived].filter((t) => !unstyled.has(t));
      expect(
        stale,
        `decorativeLeaks entries that no longer leak — remove them from 002-unrenderable-keys.json: ${stale.join(" ")}`,
      ).toEqual([]);
    });
  });

  describe("classifier", () => {
    it("applies the ADR tie-breaks", () => {
      // Recorded in the ADR because both are genuinely ambiguous and a future
      // reader will want to re-decide them.
      expect(isStructural("gap-1")).toBe(false); // spacing, not participation
      expect(isStructural("space-x-2")).toBe(false); // margin utility
      expect(isStructural("z-50")).toBe(true); // stacking is layout
      expect(isStructural("z-999999")).toBe(true);
    });

    it("classifies through variants", () => {
      expect(isStructural("dark:flex")).toBe(true);
      expect(isStructural("sm:absolute")).toBe(true);
      expect(isStructural("hover:bg-white")).toBe(false);
      expect(isStructural("!fixed")).toBe(true);
    });

    it("separates text utilities by what they do", () => {
      expect(isStructural("truncate")).toBe(true);
      expect(isStructural("text-ellipsis")).toBe(true);
      expect(isStructural("text-sm")).toBe(false);
      expect(isStructural("text-cl-text")).toBe(false);
    });
  });
});
