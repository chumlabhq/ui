/** @jsxImportSource react */
/**
 * The gate that makes the rest of the tier mean something.
 *
 * Every other contract suite asserts a property of a rendered slot. GATE-HONESTY
 * §3 showed that for 377 of 495 `classes` keys no slot was ever rendered, so
 * those assertions were vacuous rather than passing. This suite asserts the
 * precondition directly: the union of a component's fixtures must drive every
 * documented key into the DOM at least once.
 *
 * Keys are read from each component's own DEFAULT_*_CLASSES at runtime, never
 * from a list in a test file, so a new key is covered — or fails here — the
 * moment it is declared. (ADR 002 R1 moves the anatomy into
 * component-index.json; until that lands the constant is the source of truth,
 * and it is the same object the components merge against.)
 *
 * A key no fixture can render is not deleted here. It is recorded in
 * docs/adr/002-unrenderable-keys.json with a reason and stays in the API until
 * ADR 002 R7/R8 retires it in the vocabulary phase.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { COMPONENTS } from "./registry";
import { fixturesFor } from "../fixtures";
import unrenderable from "../../../docs/adr/002-unrenderable-keys.json";

import { setReducedMotion } from "../../test/matchMedia";

// Fixtures render motion-aware components; the stub answers nothing
// until asked. reduced-motion.contract is where the true branch is tested.
beforeEach(() => setReducedMotion(false));

const WAIVED = unrenderable as { waived: Record<string, Record<string, string>> };

const waivedFor = (component: string) =>
  new Set(Object.keys(WAIVED.waived[component] ?? {}));

/** Renders one fixture with every key sentinel-ed and returns the class tokens. */
const tokensFrom = async (
  Component: React.ComponentType<Record<string, unknown>>,
  fixture: ReturnType<typeof fixturesFor>[number],
  overrides: Record<string, string>,
) => {
  const element = (
    <Component {...fixture.props} classes={overrides}>
      {fixture.children as React.ReactNode}
    </Component>
  );
  const { container } = render(
    (fixture.wrap ? fixture.wrap(element) : element) as React.ReactElement,
  );
  if (fixture.act) await fixture.act(container);
  // Portalled content lives outside `container`; read the whole document.
  const html = document.body.innerHTML;
  cleanup();
  return html;
};

const candidates = COMPONENTS.filter((c) => c.supports.classes && c.defaults);

describe("fixtures contract", () => {
  it("every component with a classes prop has fixtures", () => {
    const missing = candidates
      .filter((c) => fixturesFor(c.name).length === 0)
      .map((c) => c.name);
    expect(
      missing,
      `components with no fixture module: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  describe.each(candidates)("$name", ({ name, Component, defaults }) => {
    const keys = Object.keys(defaults!);
    const fixtures = fixturesFor(name);
    const waived = waivedFor(name);

    it("renders every documented classes key across its fixtures", async () => {
      if (fixtures.length === 0) return; // reported by the check above
      const overrides = Object.fromEntries(keys.map((k) => [k, `ovr-${k}`]));

      const seen = new Set<string>();
      for (const fixture of fixtures) {
        const html = await tokensFrom(Component, fixture, overrides);
        for (const k of keys) if (html.includes(`ovr-${k}`)) seen.add(k);
      }

      // A key can be shadowed when its siblings are set — Table's `table` only
      // applies when neither `pinnedTable` nor `unpinnedTable` claims the
      // element, so overriding everything at once hides it. Retry the stragglers
      // one at a time, which is also how a consumer would actually use them.
      for (const k of keys) {
        if (seen.has(k)) continue;
        for (const fixture of fixtures) {
          const html = await tokensFrom(Component, fixture, { [k]: `ovr-${k}` });
          if (html.includes(`ovr-${k}`)) {
            seen.add(k);
            break;
          }
        }
      }

      const missed = keys.filter((k) => !seen.has(k) && !waived.has(k));
      expect(
        missed,
        `keys no fixture renders (add a fixture, or waive in docs/adr/002-unrenderable-keys.json): ${missed.join(", ")}`,
      ).toEqual([]);
    });

    it("waives no key that a fixture actually renders", async () => {
      // A stale waiver hides a key that has since become reachable, which is how
      // the baseline in constants.contract could have rotted. Same ratchet rule.
      if (waived.size === 0 || fixtures.length === 0) return;
      const overrides = Object.fromEntries(
        [...waived].map((k) => [k, `ovr-${k}`]),
      );
      const reachable: string[] = [];
      for (const fixture of fixtures) {
        const html = await tokensFrom(Component, fixture, overrides);
        for (const k of waived) if (html.includes(`ovr-${k}`)) reachable.push(k);
      }
      expect(
        [...new Set(reachable)],
        `waived keys that now render — remove them from 002-unrenderable-keys.json`,
      ).toEqual([]);
    });
  });
});
