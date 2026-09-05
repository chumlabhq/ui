/** @jsxImportSource react */
/**
 * One key, one element — checked at render time.
 *
 * R9 asserts the same thing over `002-key-migration.json`, but that table records
 * which keys MERGE, not where a key is applied. Toast reached its inner body by
 * applying `mergedClasses.root` to a second element, so an override on `root`
 * styled the container and the body together. No table could show that: it is a
 * fact about the render, not about the migration.
 *
 * Each key is given a unique sentinel and every fixture rendered; a sentinel
 * landing on two elements is one key owning two boxes.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { COMPONENTS } from "./registry.js";
import { fixturesFor } from "../fixtures/index.js";
import { applyAct } from "../fixtures/_act.contract.js";
import { setReducedMotion } from "../../test/matchMedia.js";
import waivers from "../../../docs/adr/002-unrenderable-keys.json";

beforeEach(() => setReducedMotion(false));

/**
 * Known nested carriers, with the merge that caused each. Every one is a key the
 * migration folded from two keys into one, where the two elements turned out to
 * be nested rather than alternatives — R9 approved them because the table
 * declared the merge, and the table cannot see a DOM shape.
 *
 * Ratchets down only. Fixing one means giving the inner element its own key
 * through the full gates, as Toast.body and Toast.track were.
 */
const DECLARED: Record<string, string> = {
  // Empty. All five entries were fixed by giving the inner element its own key
  // (Accordion.itemIndicator, MultiSelectDropdown.loadingItem,
  // MultiSelectSearchableDropdown.loadingItem, Table.headerRow,
  // Table.searchControl), so nothing is waived here.
};

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

const candidates = COMPONENTS.filter((c) => c.defaults && fixturesFor(c.name).length);

/** The rule has to catch the shape it was written for, or it proves nothing. */
const nestedCarriers = (root: HTMLElement, token: string) => {
  const hits = Array.from(root.querySelectorAll(`.${token}`));
  return hits.some((el) => hits.some((other) => other !== el && other.contains(el)));
};

describe("key uniqueness contract", () => {
  describe("self-check", () => {
    it("catches a key on an element and its own ancestor", () => {
      const host = document.createElement("div");
      host.innerHTML = `<div class="clu-probe"><span class="clu-probe">x</span></div>`;
      document.body.appendChild(host);
      expect(nestedCarriers(host, "clu-probe")).toBe(true);
      host.remove();
    });

    it("does not flag the same part repeated as siblings", () => {
      const host = document.createElement("div");
      host.innerHTML = `<ul><li class="clu-probe">a</li><li class="clu-probe">b</li></ul>`;
      document.body.appendChild(host);
      expect(nestedCarriers(host, "clu-probe")).toBe(false);
      host.remove();
    });
  });

  describe.each(candidates.map((c) => [c.name, c] as const))("%s", (name, entry) => {
    it("applies no key to two different elements", async () => {
      const keys = paths(entry.defaults!);
      const overrides: Record<string, unknown> = {};
      for (const k of keys) setPath(overrides, k, `clu-${k.replace(/\./g, "-")}`);

      const doubled = new Map<string, number>();
      for (const f of fixturesFor(name).filter((x) => !x.render)) {
        const element = (
          <entry.Component {...entry.props} {...(f.props as Record<string, unknown>)} classes={overrides}>
            {f.children as React.ReactNode}
          </entry.Component>
        );
        const { container } = render(
          (f.wrap ? f.wrap(element) : entry.wrap ? entry.wrap(element) : element) as React.ReactElement,
        );
        await applyAct(f, container);

        for (const k of keys) {
          const token = `clu-${k.replace(/\./g, "-")}`;
          const hits = Array.from(document.body.querySelectorAll(`.${token}`));
          // The test is NESTING, not shape. A part repeated down a list is one
          // part; a part that renders as <a> or <span> depending on state is
          // still one part. But a key on an element AND on that element's own
          // ancestor is two different boxes wearing one name — Toast's `root`
          // on the container and the body inside it.
          const nested = hits.some((el) => hits.some((other) => other !== el && other.contains(el)));
          if (nested) doubled.set(k, Math.max(doubled.get(k) ?? 0, hits.length));
        }
        cleanup();
      }

      const offenders = [...doubled.entries()]
        .filter(([k]) => !DECLARED[`${name}.${k}`])
        .filter(([k]) => !(waivers.waived as Record<string, Record<string, string>>)[name]?.[k])
        .map(([k, n]) => `${name}.${k} is applied to an element and its own ancestor (${n} carriers)`);
      expect(offenders, offenders.join("\n")).toEqual([]);
    });
  });
});
