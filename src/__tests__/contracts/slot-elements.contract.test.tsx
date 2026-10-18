/** @jsxImportSource react */
/**
 * Every slot's element in the generated Anatomy table is the element it styles.
 *
 * `scripts/slot-elements.mjs` reads the element off the source, by following
 * each slot's class to the JSX attribute that applies it, and
 * `build-component-docs.mjs` writes it into `componentDocs.ts` as the slot
 * table's Element column. Nothing rendered anything to check it: a climb that
 * stopped one hop short, or followed a class to the wrong element, would ship
 * a wrong table with every gate green.
 *
 * This renders every fixture of every class set with one marker class per
 * slot, all at once (the overrides contract's technique), and reads the tag of
 * each element the marker lands on. Each tag must be one the table states for
 * that slot. A slot the table states as `Slot` is the consumer's own element
 * under `asChild`, so any tag passes there in a fixture that sets `asChild`,
 * and none of them does otherwise.
 *
 * A slot whose default is a map of its own (Pagination's `rowsPerPage`, the
 * `loading` shimmers) takes the marker on every key of that map. A class set
 * the registry has no entry for, because it ships no default constant
 * (AvatarGroup), is rendered from its barrel with its own fixtures.
 *
 * A slot no fixture renders is listed, not passed: there was nothing to read.
 */
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import type { ComponentType, ReactElement, ReactNode } from "react";
import { COMPONENTS } from "./registry.js";
import { fixturesFor } from "../fixtures/index.js";
import { fixtureSession } from "../fixtures/_act.contract.js";
import { setReducedMotion } from "../../test/matchMedia.js";
import { COMPONENT_DOCS } from "../../pages/demo/generated/componentDocs.js";

beforeEach(() => setReducedMotion(false));

/** The public slots when the table was first checked (D11's 400). */
const FLOOR = 400;

const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

/** What the table states for each slot, by `Index/Part` and slot. */
const stated = new Map<string, Map<string, string[]>>();
for (const [name, doc] of Object.entries(COMPONENT_DOCS)) {
  for (const s of doc.parts.slots) {
    const key = `${name}/${s.part}`;
    if (!stated.has(key)) stated.set(key, new Map());
    stated.get(key)!.set(s.slot, s.element.split(", ").filter(Boolean));
  }
}

/** Whether a rendered tag is one the table states; `asChild` lets a `Slot` be anything. */
const allowed = (elements: string[], tag: string, asChild: boolean) =>
  elements.some((e) => e === tag || (e === "h1–h6" && HEADINGS.includes(tag)) || (e === "Slot" && asChild));

const totals = { slots: 0, verified: 0 };
const mismatched: string[] = [];
const unrendered: string[] = [];
const checked = new Set<string>();

const barrels = import.meta.glob("../../components/*/index.ts", { eager: true }) as Record<string, Record<string, unknown>>;

/** What renders each class set: its registry entry, or its export and its own fixtures. */
const subjects = [...stated.keys()].map((typeId) => {
  const entry = COMPONENTS.find((c) => c.supports.classes && c.typeId === typeId);
  if (entry) return { typeId, fixtures: entry.name, Component: entry.Component, props: entry.props, defaults: entry.defaults };
  const [index, part] = typeId.split("/");
  const Component = barrels[`../../components/${index}/index.ts`]?.[part] as ComponentType<Record<string, unknown>> | undefined;
  return { typeId, fixtures: typeId, Component, props: {}, defaults: null };
});

describe("slot elements: the Anatomy table names the element each slot styles", () => {
  for (const { typeId, fixtures, Component, props, defaults } of subjects) {
    const slots = stated.get(typeId)!;
    it(`${typeId}`, async () => {
      if (!Component) throw new Error(`${typeId}: no export renders this class set`);
      checked.add(typeId);
      const keys = [...slots.keys()];
      const markers = new Map(keys.map((key, i) => [key, `slot-el-${i}`]));
      const slotOf = new Map([...markers].map(([key, marker]) => [marker, key]));
      // A slot that is a map of its own carries the marker on each of its keys.
      const classes = Object.fromEntries(
        [...markers].map(([key, marker]) => {
          const value = defaults?.[key] as unknown;
          return [key, value && typeof value === "object" ? Object.fromEntries(Object.keys(value).map((k) => [k, marker])) : marker];
        }),
      );
      const seen = new Map<string, Set<string>>();
      const wrong = new Map<string, Set<string>>();
      const session = fixtureSession();

      for (const f of fixturesFor(fixtures).filter((x) => !x.render)) {
        const asChild = Boolean((f.props as Record<string, unknown>).asChild);
        const element = (
          <Component {...props} {...f.props} classes={classes}>
            {f.children as ReactNode}
          </Component>
        );
        const { container } = session.render((f.wrap ? f.wrap(element) : element) as ReactElement);
        await session.act(f, container);
        for (const el of document.body.querySelectorAll('[class*="slot-el-"]')) {
          const tag = el.tagName.toLowerCase();
          for (const token of (el.getAttribute("class") ?? "").split(/\s+/)) {
            const key = slotOf.get(token);
            if (!key) continue;
            if (!seen.has(key)) seen.set(key, new Set());
            seen.get(key)!.add(tag);
            if (!allowed(slots.get(key)!, tag, asChild)) {
              if (!wrong.has(key)) wrong.set(key, new Set());
              wrong.get(key)!.add(`<${tag}> in ${f.name}`);
            }
          }
        }
        session.unmount();
      }

      const found: string[] = [];
      for (const key of keys) {
        totals.slots += 1;
        if (!seen.has(key)) unrendered.push(`${typeId}.${key} (stated ${slots.get(key)!.join(", ")})`);
        else if (wrong.has(key)) found.push(`${typeId}.${key}: stated ${slots.get(key)!.join(", ")}, rendered ${[...wrong.get(key)!].join("; ")}`);
        else totals.verified += 1;
      }
      mismatched.push(...found);
      expect(found, `${typeId}: a slot styles an element its Anatomy table does not name`).toEqual([]);
    });
  }

  it(`checks every class set in the table, and at least the ${FLOOR} slots it had when first checked`, () => {
    expect(subjects.filter((x) => !checked.has(x.typeId)).map((x) => x.typeId)).toEqual([]);
    expect(totals.slots).toBeGreaterThanOrEqual(FLOOR);
  });

  afterAll(() => {
    console.log(`SLOT_ELEMENTS slots ${totals.slots} (floor ${FLOOR}), verified ${totals.verified}, mismatched ${mismatched.length}`);
    console.log(`SLOT_ELEMENTS_UNRENDERED ${unrendered.length}${unrendered.length ? `\n  ${unrendered.join("\n  ")}` : ""}`);
    for (const m of mismatched) console.log(`SLOT_ELEMENTS_MISMATCH ${m}`);
  });
});
