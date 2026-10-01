/** @jsxImportSource react */
/**
 * SC 1.3.1 Info and Relationships — the programmatic half.
 *
 * Every ARIA relationship this package renders points at an element that is
 * really there. A dangling `aria-labelledby` is worse than none: the control
 * reports a name to nobody, and nothing in the type system, the render or an
 * axe run against one fixture will say so.
 *
 * Rendered over every fixture of every component, so a relationship that only
 * appears in one state is still checked.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { COMPONENTS } from "./registry.js";
import { fixturesFor } from "../fixtures/index.js";
import { fixtureSession } from "../fixtures/_act.contract.js";

import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

/** Attributes whose value is one or more ids that must resolve. */
const IDREF_ATTRS = [
  "aria-labelledby",
  "aria-describedby",
  "aria-controls",
  "aria-activedescendant",
  "aria-owns",
  "aria-errormessage",
  "aria-details",
];

/**
 * `aria-controls` is the one reference allowed to dangle, and only while the
 * control says it is collapsed: the popup, panel or listbox it names is not
 * rendered yet. ARIA permits it and axe exempts it for exactly that case.
 * Every other relationship names something that should exist right now.
 */
const isExcusedControls = (el: Element, attr: string): boolean =>
  attr === "aria-controls" && el.getAttribute("aria-expanded") === "false";

const danglingRefs = (): string[] => {
  const bad: string[] = [];
  for (const attr of IDREF_ATTRS) {
    for (const el of document.querySelectorAll(`[${attr}]`)) {
      const value = el.getAttribute(attr);
      if (!value || isExcusedControls(el, attr)) continue;
      for (const id of value.split(/\s+/).filter(Boolean)) {
        if (!document.getElementById(id)) {
          bad.push(`${el.tagName.toLowerCase()}[${attr}="${id}"] resolves to nothing`);
        }
      }
    }
  }
  return bad;
};
const withFixtures = COMPONENTS.filter((c) => fixturesFor(c.name).length > 0);

describe("aria relationships contract", () => {
  // A run that iterates nothing reports nothing, which reads exactly like a
  // pass. `overrides.contract` asserted on 3 of 340 slots for months on that
  // basis, guarding the very bug it was written for.
  it("iterates a non-empty set", () => {
    expect(withFixtures.length, "the candidate set is empty — this contract asserts nothing").toBeGreaterThan(30);
  });

  describe("self-check", () => {
    it("catches a reference that resolves to nothing", () => {
      const host = document.createElement("div");
      host.innerHTML = '<div aria-labelledby="nowhere"></div>';
      document.body.appendChild(host);
      expect(danglingRefs()).toEqual([
        'div[aria-labelledby="nowhere"] resolves to nothing',
      ]);
      host.remove();
    });

    it("accepts a reference that resolves", () => {
      const host = document.createElement("div");
      host.innerHTML = '<span id="real">x</span><div aria-labelledby="real"></div>';
      document.body.appendChild(host);
      expect(danglingRefs()).toEqual([]);
      host.remove();
    });

    it("excuses aria-controls only while the control is collapsed", () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<button aria-expanded="false" aria-controls="later"></button>' +
        '<button aria-expanded="true" aria-controls="missing"></button>';
      document.body.appendChild(host);
      expect(danglingRefs()).toEqual([
        'button[aria-controls="missing"] resolves to nothing',
      ]);
      host.remove();
    });

    it("checks every id in a multi-id value", () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<span id="one">x</span><div aria-labelledby="one two"></div>';
      document.body.appendChild(host);
      expect(danglingRefs()).toEqual([
        'div[aria-labelledby="two"] resolves to nothing',
      ]);
      host.remove();
    });
  });

  for (const component of withFixtures) {
    it(`${component.name} points every ARIA relationship at a real element`, async () => {
      const session = fixtureSession();
      const bad: string[] = [];
      for (const fixture of fixturesFor(component.name)) {
        await session.mountFixture(
          component.Component as React.ComponentType<Record<string, unknown>>,
          fixture,
        );
        bad.push(...danglingRefs().map((b) => `${fixture.name}: ${b}`));
        session.unmount();
      }
      expect(bad, "a dangling ARIA reference names nothing").toEqual([]);
    });
  }
});
