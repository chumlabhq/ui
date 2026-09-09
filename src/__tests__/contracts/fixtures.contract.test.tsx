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
import { COMPONENTS } from "./registry.js";
import { fixturesFor } from "../fixtures/index.js";
import { applyAct } from "../fixtures/_act.contract.js";
import unrenderable from "../../../docs/adr/002-unrenderable-keys.json";

import { setReducedMotion } from "../../test/matchMedia.js";

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
  overrides: Record<string, unknown>,
) => {
  const element = (
    <Component {...fixture.props} classes={overrides}>
      {fixture.children as React.ReactNode}
    </Component>
  );
  const { container } = render(
    (fixture.wrap ? fixture.wrap(element) : element) as React.ReactElement,
  );
  await applyAct(fixture, container);
  // Portalled content lives outside `container`; read the whole document.
  const html = document.body.innerHTML;
  cleanup();
  return html;
};

const candidates = COMPONENTS.filter((c) => c.supports.classes && c.defaults);

describe("fixtures contract", () => {
  // A run that iterates nothing reports nothing, which reads exactly like a
  // pass. `overrides.contract` asserted on 3 of 340 slots for months on that
  // basis, guarding the very bug it was written for.
  it("iterates a non-empty set", () => {
    expect(candidates.length, "the candidate set is empty — this contract asserts nothing").toBeGreaterThan(30);
  });

  it("every component with a classes prop has fixtures", () => {
    const missing = candidates
      .filter((c) => fixturesFor(c.name).length === 0)
      .map((c) => c.name);
    expect(
      missing,
      `components with no fixture module: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("every component keeps a fixture the sentinel contracts can drive", () => {
    // `render` is an escape hatch that opts a fixture out of five suites at
    // once — this one, overrides, unstyled, reduced-motion and hydration — and
    // it does it silently. Each of those filters `render` out and then returns
    // early on an empty list, so a component whose fixtures were ALL `render`
    // would pass every one of them without asserting anything. The per-key
    // check below already proves each key is reachable from a non-render
    // fixture; this is the case that check cannot see, because it never runs.
    const unusable = candidates
      .filter((c) => {
        const all = fixturesFor(c.name);
        return all.length > 0 && all.every((f) => f.render);
      })
      .map((c) => c.name);
    expect(
      unusable,
      `components whose fixtures are all \`render\`, so the classes contracts skip them entirely — add one static fixture: ${unusable.join(", ")}`,
    ).toEqual([]);
  });

  describe.each(candidates)("$name", ({ name, Component, defaults }) => {
    /**
     * ADR 002 R6: a key whose value is a child component's bag is not a class
     * string, so it can never "render". Its SLOTS are what reach the DOM, and
     * they are what this has to prove — otherwise nesting a key would silently
     * drop every class inside it from the coverage this suite provides.
     */
    const paths = (bag: object, prefix = ""): string[] =>
      Object.entries(bag).flatMap(([k, v]) =>
        typeof v === "string"
          ? [prefix + k]
          : v && typeof v === "object"
            ? paths(v as object, `${prefix}${k}.`)
            : [],
      );
    const setPath = (target: Record<string, unknown>, path: string, value: string) => {
      const parts = path.split(".");
      let node = target;
      for (const part of parts.slice(0, -1)) {
        node[part] = (node[part] as Record<string, unknown>) ?? {};
        node = node[part] as Record<string, unknown>;
      }
      node[parts[parts.length - 1]] = value;
    };
    const buildOverrides = (list: string[]) => {
      const out: Record<string, unknown> = {};
      for (const k of list) setPath(out, k, `ovr-${k.replace(/\./g, "-")}`);
      return out;
    };
    const token = (k: string) => `ovr-${k.replace(/\./g, "-")}`;
    const keys = paths(defaults!);
    // `render` fixtures own their markup and never receive the sentinel
    // `classes` map, so they cannot answer this question either way.
    const fixtures = fixturesFor(name).filter((f) => !f.render);
    const waived = waivedFor(name);

    it("renders every documented classes key across its fixtures", async () => {
      if (fixtures.length === 0) return; // reported by the check above
      const overrides = buildOverrides(keys);

      const seen = new Set<string>();
      for (const fixture of fixtures) {
        const html = await tokensFrom(Component, fixture, overrides);
        for (const k of keys) if (html.includes(token(k))) seen.add(k);
      }

      // A key can be shadowed when its siblings are set — Table's `table` only
      // applies when neither `pinnedTable` nor `unpinnedTable` claims the
      // element, so overriding everything at once hides it. Retry the stragglers
      // one at a time, which is also how a consumer would actually use them.
      for (const k of keys) {
        if (seen.has(k)) continue;
        for (const fixture of fixtures) {
          const html = await tokensFrom(Component, fixture, buildOverrides([k]));
          if (html.includes(token(k))) {
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

  /**
   * The rot this record actually suffered.
   *
   * Sixteen of its seventeen entries named keys that had already been deleted
   * from the API by the key migration, and nothing noticed: a waiver for a key
   * that does not exist is vacuous, so every check above passed. RELEASE-
   * READINESS then reported "17 waived keys — seventeen pieces of public API
   * that do nothing", which was false in the other direction.
   */
  it("waives no key that no longer exists", () => {
    const stale: string[] = [];
    for (const [component, keys] of Object.entries(WAIVED.waived)) {
      const entry = COMPONENTS.find((c) => c.name === component);
      const defaults = entry?.defaults;
      if (!defaults) {
        stale.push(`${component} (no component or no default classes map)`);
        continue;
      }
      const declared = new Set(
        Object.entries(defaults).flatMap(([key, value]) =>
          typeof value === "string"
            ? [key]
            : value && typeof value === "object"
              ? Object.keys(value as object).map((nested) => `${key}.${nested}`)
              : [],
        ),
      );
      for (const key of Object.keys(keys)) {
        if (!declared.has(key)) stale.push(`${component}.${key}`);
      }
    }
    expect(
      stale.sort(),
      "waived keys that are not in the component's classes map any more. A waiver for a " +
        "key that does not exist is vacuous — delete the entry from " +
        "docs/adr/002-unrenderable-keys.json",
    ).toEqual([]);
  });
});
