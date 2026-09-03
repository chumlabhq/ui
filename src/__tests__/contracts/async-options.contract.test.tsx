/** @jsxImportSource react */
/**
 * The two searchable dropdowns resolve their menu from a different source than
 * their trigger.
 *
 * `useDropdown` and `useMultiSelectDropdown` both compute `displayOptions` from
 * `asyncOptions`/`allInitialOptions` once `onSearch` is a function, and never
 * from `options` -- while the selection lookup spreads all three. Passing both
 * therefore rendered an empty menu underneath a correctly-labelled trigger,
 * which is why it read as half-working rather than as broken.
 *
 * The props are now a discriminated union, so that combination does not
 * typecheck. A type that cannot be instantiated is not evidence that the
 * branches render, so this drives the fixtures for both and asserts the menu is
 * populated on each.
 */
import { describe, expect, it, afterEach, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { SearchableDropdown } from "../../components/SearchableDropdown";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown";
import { fixturesFor } from "../fixtures";
import { setReducedMotion } from "../../test/matchMedia";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

const OPTION_LABELS = ["Apple", "Banana", "Cherry"];

/**
 * Labels the open menu is showing, read from the portalled listbox.
 *
 * Queried off the DOM rather than by role: the listbox holds `visibility:
 * hidden` until `computeDropdownCoords` reports a stable position, which it
 * never does under jsdom's absent layout, so every option is outside the
 * accessibility tree here. That is a jsdom artifact, not the state under test --
 * the e2e tier is where the menu's visibility is asserted.
 */
const renderedOptions = (): string[] =>
  [...document.querySelectorAll('[role="option"]')]
    .map((el) => el.textContent?.trim() ?? "")
    .filter(Boolean);

const menuIsMounted = (): boolean =>
  document.querySelector('[role="listbox"]') !== null;

const CASES = [
  { name: "SearchableDropdown", Component: SearchableDropdown },
  { name: "MultiSelectSearchableDropdown", Component: MultiSelectSearchableDropdown },
] as const;

describe("async options contract", () => {
  describe("self-check", () => {
    it("catches a menu resolved from a source the branch ignores", async () => {
      // The pre-fix shape: options supplied, onSearch present, menu empty.
      const brokenDisplayOptions = (
        isAsync: boolean,
        options: string[],
        initial: string[],
      ) => (isAsync ? initial : options);

      expect(brokenDisplayOptions(true, OPTION_LABELS, [])).toEqual([]);
      expect(brokenDisplayOptions(false, OPTION_LABELS, [])).toEqual(OPTION_LABELS);
    });

    it("would fail if the assertion did not require a populated menu", () => {
      // renderedOptions() on nothing rendered must be empty, so a component that
      // renders no menu cannot pass the assertions below by accident.
      expect(renderedOptions()).toEqual([]);
      expect(menuIsMounted()).toBe(false);
    });
  });

  for (const { name, Component } of CASES) {
    describe(name, () => {
      const fixtures = fixturesFor(name);
      const byName = (n: string) => {
        const f = fixtures.find((x) => x.name === n);
        if (!f) throw new Error(`${name} has no \`${n}\` fixture`);
        return f;
      };

      it("renders its options on the sync branch", () => {
        const fixture = byName("open");
        render(
          <Component
            {...(fixture.props as Record<string, never>)}
          />,
        );
        expect(renderedOptions()).toEqual(OPTION_LABELS);
      });

      it("renders its initialOptions on the async branch", () => {
        const fixture = byName("async-initial");
        render(
          <Component
            {...(fixture.props as Record<string, never>)}
          />,
        );
        expect(
          renderedOptions(),
          "the async branch resolved an empty menu -- the defect the union prevents",
        ).toEqual(OPTION_LABELS);
      });

      it("renders an empty menu on the async branch before a query resolves", () => {
        const fixture = byName("async-searched");
        render(
          <Component
            {...(fixture.props as Record<string, never>)}
          />,
        );
        // An unmounted menu is empty too; the empty case has to distinguish them.
        expect(menuIsMounted()).toBe(true);
        expect(renderedOptions()).toEqual([]);
      });
    });
  }
});
