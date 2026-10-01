/** @jsxImportSource react */
/**
 * A role that promises a name has one — or the component said so in development.
 *
 * Three instances in four slices, each found by something other than a gate:
 * `Modal` behind `showHeader={false}` and four combobox triggers behind
 * `renderTrigger` pointed `aria-labelledby` at elements that were not rendered,
 * and `Drawer` composed without a `DrawerHeader` did the same. All three were a
 * container role naming an id nobody wrote, and axe could only see the two that
 * a fixture happened to render.
 *
 * So the property is stated over every fixture instead. The roles below are the
 * ones whose name CANNOT come from their contents — a dialog is not named by the
 * text inside it, and a landmark is not named by the section it wraps — which is
 * why they are the roles that go silently unnamed. `button`, `menuitem`, `tab`
 * and their relatives are deliberately absent: their name is their content, and
 * `keyboard-reachable.contract` already covers the empty case.
 *
 * A component that cannot know the name is not at fault for rendering without
 * one — `<Input />` beside an external `<label for>` is legitimate. It is at
 * fault for doing it in silence, which is what `useAccessibleNameWarning`
 * exists for, so a development warning satisfies this contract.
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { COMPONENTS } from "./registry.js";
import { fixturesFor } from "../fixtures/index.js";
import { fixtureSession } from "../fixtures/_act.contract.js";
import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(() => {
  cleanup();
  // The self-checks mount bare markup on the body and the scan reads body-level
  // nodes as portals, so one left behind is a finding in the next test.
  document.body.innerHTML = "";
});

/**
 * Roles whose accessible name has to be supplied, because the role's own
 * name-from-content rule does not apply to it.
 */
const NEEDS_NAME = new Set([
  "dialog",
  "alertdialog",
  "region",
  "navigation",
  "search",
  "form",
  "complementary",
  "banner",
  "contentinfo",
  "combobox",
  "listbox",
  "menu",
  "menubar",
  "grid",
  "treegrid",
  "tree",
  "table",
  "radiogroup",
  "tablist",
  "toolbar",
  "img",
  "progressbar",
  "meter",
  "slider",
  "spinbutton",
  "textbox",
  "searchbox",
]);

/** Implicit roles this package actually renders. Enough to catch, not a full map. */
const IMPLICIT: Record<string, string> = {
  DIALOG: "dialog",
  NAV: "navigation",
  TABLE: "table",
  IMG: "img",
  PROGRESS: "progressbar",
  METER: "meter",
  TEXTAREA: "textbox",
};

const roleOf = (el: Element): string | null => {
  const explicit = el.getAttribute("role");
  if (explicit) return explicit.trim().split(/\s+/)[0];
  if (el.tagName === "INPUT") {
    const type = (el as HTMLInputElement).type;
    if (type === "text" || type === "email" || type === "tel" || type === "url") return "textbox";
    if (type === "search") return "searchbox";
    if (type === "range") return "slider";
    if (type === "number") return "spinbutton";
    return null;
  }
  return IMPLICIT[el.tagName] ?? null;
};

/**
 * The accessible name, near enough for this question.
 *
 * `aria-labelledby` first, then `aria-label`, then a native `<label>`, then
 * `title` — the order the platform uses. A `labelledby` pointing at nothing
 * resolves to the empty string, which is the whole defect this catches.
 */
function accessibleName(el: Element): string {
  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    const text = labelledBy
      .split(/\s+/)
      .map((id) => el.ownerDocument.getElementById(id)?.textContent?.trim() ?? "")
      .join(" ")
      .trim();
    if (text) return text;
  }
  const label = el.getAttribute("aria-label")?.trim();
  if (label) return label;
  // `alt` is the name of an image, and the only element whose content attribute
  // is its name. `placeholder` deliberately is not: axe accepts it, which is
  // how TimePicker's combobox passed the sweep unnamed.
  const alt = el.tagName === "IMG" ? el.getAttribute("alt")?.trim() : "";
  if (alt) return alt;
  if (el.id) {
    const native = el.ownerDocument.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    const text = native?.textContent?.trim();
    if (text) return text;
  }
  if (el.closest("label")?.textContent?.trim()) return el.closest("label")!.textContent!.trim();
  const title = el.getAttribute("title")?.trim();
  if (title) return title;
  return "";
}

/** Every element rendered anywhere for this fixture, portals included. */
const rendered = (container: HTMLElement) => [
  ...container.querySelectorAll("*"),
  ...[...document.body.children]
    .filter((child) => child !== container && !child.contains(container))
    .flatMap((root) => [root, ...root.querySelectorAll("*")]),
];

export function unnamed(container: HTMLElement): string[] {
  const found: string[] = [];
  for (const el of rendered(container)) {
    const role = roleOf(el);
    if (!role || !NEEDS_NAME.has(role)) continue;
    if (el.getAttribute("aria-hidden") === "true") continue;
    if (accessibleName(el)) continue;
    found.push(`${el.tagName.toLowerCase()}[role=${role}] ${el.outerHTML.slice(0, 70)}`);
  }
  return found;
}

/**
 * Counted, not assumed.
 *
 * `overrides.contract` was green for months while asserting on 3 of 340
 * slots: its inner filter emptied and the loops ran over nothing, which
 * reads exactly like a pass. A self-check proves the predicate works; this
 * proves it was pointed at something.
 */
const asserted = { n: 0 };

describe("accessible name contract", () => {
  describe("self-check", () => {
    const host = () => {
      const div = document.createElement("div");
      document.body.append(div);
      return div;
    };

    it("catches a dialog with no name", () => {
      const container = host();
      container.innerHTML = '<div role="dialog"><p>Body</p></div>';
      expect(unnamed(container)).toHaveLength(1);
    });

    it("catches a name that resolves to nothing", () => {
      const container = host();
      container.innerHTML = '<div role="dialog" aria-labelledby="missing"><p>Body</p></div>';
      expect(unnamed(container)).toHaveLength(1);
    });

    it("accepts a label, a resolving reference and a native label", () => {
      const container = host();
      container.innerHTML =
        '<div role="dialog" aria-label="Settings"></div>' +
        '<div role="dialog" aria-labelledby="t"><h2 id="t">Title</h2></div>' +
        '<label for="i">Name</label><input id="i" type="text" />';
      expect(unnamed(container)).toEqual([]);
    });
  });

  for (const { name, Component } of COMPONENTS) {
    const fixtures = fixturesFor(name);
    if (!fixtures.length) continue;

    it(`${name} names every role that cannot name itself`, async () => {
      const session = fixtureSession();
      const missing: string[] = [];
      for (const fixture of fixtures) {
        // The warning is the escape hatch, so it has to be observed rather than
        // assumed: a component that cannot know the name has to say so.
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const element = fixture.render ? (
          fixture.render()
        ) : (
          <Component {...fixture.props}>
            {fixture.children as React.ReactNode}
          </Component>
        );
        const { container } = session.render(
          (fixture.wrap ? fixture.wrap(element) : element) as React.ReactElement,
        );
        await session.act(fixture, container);

        const warned = warn.mock.calls.some((call) =>
          String(call[0]).includes("no accessible name"),
        );
        if (!warned) {
          asserted.n += 1;
          for (const element of unnamed(container)) missing.push(`${fixture.name}: ${element}`);
        }
        warn.mockRestore();
        session.unmount();
      }
      expect(
        missing,
        "a role that promises a name and does not have one, with no development warning either",
      ).toEqual([]);
    });
  }

  it("asserted on a real number of rendered fixtures", () => {
    console.log(`ACCESSIBLE_NAME asserted on ${asserted.n} rendered fixture(s)`);
    expect(asserted.n, "this contract iterated nothing").toBeGreaterThan(20);
  });
});
