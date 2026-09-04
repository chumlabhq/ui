/** @jsxImportSource react */
/**
 * Every `role="combobox"` trigger has an accessible name, and the
 * active-descendant relationship sits on whatever holds the focus.
 *
 * `combobox` is not a name-from-content role. Six components shipped a trigger
 * whose only text was the selected value or the placeholder, which meant they
 * had no accessible name at all — 63 of the 66 `button-name` nodes on the axe
 * baseline. That baseline is now retired, so this is what holds the fix: the
 * sweep can only report what a fixture happens to render, and it is six minutes
 * of Playwright. This asks the question directly, of every fixture.
 *
 * The name must also be worth having. A trigger named by an empty element would
 * satisfy "has aria-labelledby" while announcing nothing, so the reference is
 * resolved and the text checked.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { COMPONENTS } from "./registry";
import { fixturesFor } from "../fixtures";

import { setReducedMotion } from "../../test/matchMedia";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

/**
 * The accessible name, in the order the accname spec resolves it.
 *
 * `<label for>` and, for an input, `placeholder` are native naming paths, and
 * both `<button>` and `<input>` are labelable — so a check that looked only at
 * the ARIA attributes would fail TimePicker, which is correctly named by its
 * label. Content is deliberately absent: `combobox` is not a name-from-content
 * role, and that omission is the whole defect this contract holds.
 *
 * `placeholder` is a weak name and a poor practice, but it is a name and axe
 * accepts it; flagging it here would be this contract inventing a rule.
 */
const resolveName = (el: Element): string => {
  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const text = labelledby
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
      .filter(Boolean)
      .join(" ")
      .trim();
    if (text) return text;
  }

  const ariaLabel = (el.getAttribute("aria-label") ?? "").trim();
  if (ariaLabel) return ariaLabel;

  if (el.id) {
    const forLabel = document.querySelector(`label[for="${el.id}"]`);
    const text = forLabel?.textContent?.trim();
    if (text) return text;
  }

  return (el.getAttribute("placeholder") ?? "").trim();
};

const comboboxes = () => [...document.querySelectorAll('[role="combobox"]')];

const renderFixture = async (
  Component: React.ComponentType<Record<string, unknown>>,
  fixture: ReturnType<typeof fixturesFor>[number],
) => {
  const element = (
    <Component {...fixture.props}>{fixture.children as React.ReactNode}</Component>
  );
  const { container } = render(
    (fixture.wrap ? fixture.wrap(element) : element) as React.ReactElement,
  );
  if (fixture.act) await fixture.act(container);
};

const withFixtures = COMPONENTS.filter((c) => fixturesFor(c.name).length > 0);

describe("combobox name contract", () => {
  describe("self-check", () => {
    it("reports an empty name when the reference resolves to nothing", () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<span id="probe-empty"></span>' +
        '<div role="combobox" aria-labelledby="probe-empty"></div>';
      document.body.appendChild(host);
      expect(resolveName(host.querySelector('[role="combobox"]')!)).toBe("");
      host.remove();
    });

    it("reports an empty name when nothing names the element at all", () => {
      const el = document.createElement("div");
      el.setAttribute("role", "combobox");
      expect(resolveName(el)).toBe("");
    });

    it("resolves a name that is really there", () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<span id="probe-value">Banana</span>' +
        '<div role="combobox" aria-labelledby="probe-value"></div>';
      document.body.appendChild(host);
      expect(resolveName(host.querySelector('[role="combobox"]')!)).toBe("Banana");
      host.remove();
    });
  });

  for (const component of withFixtures) {
    const fixtures = fixturesFor(component.name);

    describe(component.name, () => {
      it("names every combobox trigger it renders", async () => {
        const unnamed: string[] = [];
        let seen = 0;

        for (const fixture of fixtures) {
          await renderFixture(
            component.Component as React.ComponentType<Record<string, unknown>>,
            fixture,
          );
          for (const el of comboboxes()) {
            seen += 1;
            if (!resolveName(el)) unnamed.push(`${fixture.name} #${el.id || "?"}`);
          }
          cleanup();
        }

        expect(
          unnamed,
          `a role="combobox" with no accessible name — the value text does not ` +
            `supply one, because combobox is not a name-from-content role`,
        ).toEqual([]);
        void seen;
      });

      it("puts aria-activedescendant only on an element that can hold focus", async () => {
        const stranded: string[] = [];

        for (const fixture of fixtures) {
          await renderFixture(
            component.Component as React.ComponentType<Record<string, unknown>>,
            fixture,
          );
          for (const el of document.querySelectorAll("[aria-activedescendant]")) {
            const id = el.getAttribute("aria-activedescendant");
            // An unresolvable reference describes a highlight that is not there.
            if (id && !document.getElementById(id)) {
              stranded.push(`${fixture.name}: ${id} resolves to nothing`);
            }
            // A search field takes the focus when the menu opens, so a trigger
            // that still claims the relationship is describing the highlight to
            // an element nobody is on.
            const searchField = document.querySelector("input[aria-autocomplete]");
            if (searchField && el !== searchField && el.getAttribute("role") === "combobox") {
              stranded.push(`${fixture.name}: trigger claims it while a search field has focus`);
            }
          }
          cleanup();
        }

        expect(stranded, "aria-activedescendant on the wrong element").toEqual([]);
      });
    });
  }
});
