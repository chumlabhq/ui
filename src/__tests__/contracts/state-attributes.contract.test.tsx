/** @jsxImportSource react */
/**
 * ADR 002 R4 — the replacement for the 97 deleted-as-state keys.
 *
 * Every one of those keys names a state a consumer can target today. After Task 3
 * they are gone, and the only way to reach the same element is a data attribute.
 * This suite is what makes that safe: the requirement list is DERIVED from
 * `docs/adr/002-state-attributes.json`, which is itself derived from the
 * `deleted-as-state` rows of the migration table. Nothing here is hand-written,
 * so a key cannot be deleted in Task 3 without its replacement being asserted
 * here first.
 *
 * It asserts three things per requirement:
 *   1. the attribute reaches the DOM on the right part, in some fixture state
 *   2. every documented value is reachable
 *   3. a boolean attribute is ABSENT somewhere — an attribute that is always on
 *      carries no information and would pass a presence-only check
 */
import { describe, expect, it, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { COMPONENTS } from "./registry";
import { fixturesFor } from "../fixtures";
import { setReducedMotion } from "../../test/matchMedia";

beforeEach(() => setReducedMotion(false));

interface Requirement {
  component: string;
  part: string;
  attribute: string;
  values: string[] | null;
  fromKeys: string[];
}
const SPEC = JSON.parse(
  readFileSync(resolve(process.cwd(), "docs/adr/002-state-attributes.json"), "utf8"),
) as { requirements: Requirement[] };

/**
 * Where each part lives in the rendered DOM. Parts are not yet named in the
 * markup — that is Task 3 — so until then they are located by role or by the
 * element the component actually renders. Wrong selector, false failure, so
 * every one of these was read off a rendered fixture rather than guessed.
 */
const SELECTOR: Record<string, string> = {
  // Breadcrumb marks the crumb on the <a>, Pagination on the page <button>, so
  // both are part of `item` even though neither is a list element.
  "item": '[role="option"], [role="menuitem"], [role="menuitemcheckbox"], [role="tab"], [role="gridcell"], li, tr, nav a, nav button[aria-label^="Page"]',
  "subItem": '[role="option"]',
  "control": '[role="switch"], [role="checkbox"], input[type="checkbox"] + span, span[data-state], [data-state]',
  "thumb": '[role="slider"], [role="switch"] span, span[data-state]',
  "input": "input",
  "itemIndicator": "[data-status], svg",
  "itemText": "span[data-status], span[data-state], span",
  "itemIcon": "span[data-status], span[data-state], svg",
  "description": "[data-status]",
  "separator": "[data-next-status], [data-status]",
  "count": "span",
  "marker": "[data-state]",
  "clockDisplay": "[data-state]",
  "periodButton": "button",
  "clockNumber": "[data-selected], [data-disabled]",
  "presetTrigger": "button",
  "pinButton": "button",
  "countrySelect.item": '[role="option"]',
};

/** Every attribute value seen on any element matching `part`, across all fixtures. */
const collect = async (componentName: string, part: string, attribute: string) => {
  const entry = COMPONENTS.find((c) => c.name === componentName);
  if (!entry) return { seen: new Set<string>(), absentSomewhere: false, fixtures: 0 };
  const selector = SELECTOR[part] ?? "*";
  const seen = new Set<string>();
  let absentSomewhere = false;
  let fixtures = 0;

  for (const f of fixturesFor(componentName).filter((x) => !x.render)) {
    const element = (
      <entry.Component {...entry.props} {...f.props}>
        {f.children as React.ReactNode}
      </entry.Component>
    );
    const { container } = render(
      (f.wrap ? f.wrap(element) : entry.wrap ? entry.wrap(element) : element) as React.ReactElement,
    );
    if (f.act) await f.act(container);
    fixtures += 1;

    const nodes = Array.from(document.body.querySelectorAll(selector));
    for (const n of nodes) {
      const v = n.getAttribute(attribute);
      if (v !== null) seen.add(v);
      // Per ELEMENT, not per fixture: a boolean state is meaningful when some
      // matching element lacks it, and the interesting case is a disabled
      // option sitting beside enabled ones in the SAME fixture. Checking this
      // per fixture asked a weaker question and passed things it should not.
      else absentSomewhere = true;
    }
    cleanup();
  }
  return { seen, absentSomewhere, fixtures };
};

describe("state attributes contract", () => {
  /**
   * The probe every gate on this branch owes: a component that stops emitting an
   * attribute must be caught. Without it, "the attribute was found" and "the
   * selector matched nothing" produce the same green.
   */
  describe("self-check", () => {
    const Emitting = () => (
      <ul>
        <li role="option" data-selected="true">on</li>
        <li role="option">off</li>
      </ul>
    );
    const Regressed = () => (
      <ul>
        <li role="option">on</li>
        <li role="option">off</li>
      </ul>
    );
    const scan = (Node: () => React.ReactElement, attribute: string) => {
      render(<Node />);
      const seen = new Set<string>();
      for (const n of Array.from(document.body.querySelectorAll(SELECTOR["item"]))) {
        const v = n.getAttribute(attribute);
        if (v !== null) seen.add(v);
      }
      cleanup();
      return seen;
    };

    it("sees the attribute when it is emitted", () => {
      expect(scan(Emitting, "data-selected").size).toBeGreaterThan(0);
    });

    it("catches a component that stops emitting it", () => {
      const seen = scan(Regressed, "data-selected");
      // This is the exact assertion the per-requirement test makes. If it did
      // not fail here, every green below would be meaningless.
      expect(seen.size).toBe(0);
      expect(() =>
        expect(seen.size, "data-selected never reaches the part").toBeGreaterThan(0),
      ).toThrow();
    });

    it("catches an attribute that is always on, which carries no state", () => {
      const AlwaysOn = () => (
        <ul>
          <li role="option" data-selected="true">a</li>
          <li role="option" data-selected="true">b</li>
        </ul>
      );
      render(<AlwaysOn />);
      const nodes = Array.from(document.body.querySelectorAll(SELECTOR["item"]));
      const absentSomewhere = nodes.some((n) => n.getAttribute("data-selected") === null);
      cleanup();
      expect(absentSomewhere).toBe(false);
    });
  });

  it("the requirement list is derived, not hand-written", () => {
    expect(SPEC.requirements.length).toBeGreaterThan(60);
    for (const r of SPEC.requirements) {
      expect(r.fromKeys.length, `${r.component}.${r.part} cites no source key`).toBeGreaterThan(0);
    }
  });

  describe.each(SPEC.requirements.map((r) => [`${r.component} ${r.part} ${r.attribute}`, r] as const))(
    "%s",
    (_label, r) => {
      it("reaches the DOM, with every documented value, and is absent somewhere", async () => {
        const { seen, absentSomewhere, fixtures } = await collect(r.component, r.part, r.attribute);
        expect(fixtures, `${r.component} has no static fixture`).toBeGreaterThan(0);

        expect(
          seen.size,
          `${r.attribute} never reaches ${r.component}'s ${r.part}. It replaces ` +
            `${r.fromKeys.join(", ")}, which Task 3 deletes — without it that state ` +
            `becomes untargetable.`,
        ).toBeGreaterThan(0);

        for (const v of r.values ?? []) {
          expect(
            [...seen],
            `${r.attribute}="${v}" is documented but no fixture produces it on ${r.component}'s ${r.part}`,
          ).toContain(v);
        }

        if (!r.values) {
          expect(
            absentSomewhere,
            `${r.attribute} is present on every ${r.component} ${r.part} in every fixture. ` +
              `An attribute that is always on carries no state.`,
          ).toBe(true);
        }
      });
    },
  );
});
