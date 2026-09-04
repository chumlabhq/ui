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
import { Dropdown } from "../../components/Dropdown";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown";
import { CascadingDropdown } from "../../components/CascadingDropdown";
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

/**
 * Menu items for the cascading menus.
 *
 * All three `menuitem` roles, not the bare one: a leaf carries
 * `menuitemradio` or `menuitemcheckbox` depending on its parent's
 * `selectionMode`, so matching `[role="menuitem"]` alone reads a populated
 * async result as an empty menu.
 */
const renderedMenuItems = (): string[] =>
  [...document.querySelectorAll('[role^="menuitem"]')]
    .map((el) => el.textContent?.trim() ?? "")
    .filter(Boolean);

/** A shimmer is the loading state; `role="status"` is the empty state. */
const isLoading = (): boolean =>
  document.querySelector('[class*="animate-pulse"], [data-loading]') !== null;

/**
 * Renders one named fixture and runs its interaction.
 *
 * The fixture is the subject, not a convenience: a fixture that stops reaching
 * its state must fail here rather than quietly become a second copy of the
 * synchronous render, which is how the async branch went unrendered for as long
 * as it did.
 */
const drive = async (
  Component: React.ComponentType<Record<string, never>>,
  component: string,
  name: string,
) => {
  const fixture = fixturesFor(component).find((f) => f.name === name);
  if (!fixture) throw new Error(`${component} has no \`${name}\` fixture`);
  const { container } = render(<Component {...(fixture.props as Record<string, never>)} />);
  if (fixture.act) await fixture.act(container);
  return container;
};

/**
 * `loadOnOpen` + `onLoadOptions`: the menu is fetched when the trigger opens it.
 *
 * These two load from `handleOpen`/`handleToggle` rather than from an effect, so
 * every assertion here depends on the fixture opening the menu by clicking.
 * A fixture using `defaultOpen` would render an empty menu forever and the
 * "resolved" assertion below would be the thing that caught it.
 */
describe("load-on-open branch", () => {
  const CASES = [
    { name: "Dropdown", Component: Dropdown },
    { name: "MultiSelectDropdown", Component: MultiSelectDropdown },
  ] as const;

  for (const { name, Component } of CASES) {
    describe(name, () => {
      it("fetches nothing until the menu is opened", async () => {
        await drive(Component as never, name, "async-load-initial");
        expect(menuIsMounted()).toBe(false);
      });

      it("shows the loading state while the loader is in flight", async () => {
        await drive(Component as never, name, "async-load-pending");
        expect(menuIsMounted()).toBe(true);
        expect(renderedOptions()).toEqual([]);
        expect(isLoading(), "an in-flight load must be distinguishable from an empty result").toBe(true);
      });

      it("renders the fetched options once the loader resolves", async () => {
        await drive(Component as never, name, "async-load-resolved");
        expect(
          renderedOptions(),
          "the load-on-open branch resolved an empty menu",
        ).toEqual(OPTION_LABELS);
      });

      it("distinguishes an empty result from a load still running", async () => {
        await drive(Component as never, name, "async-load-empty");
        expect(menuIsMounted()).toBe(true);
        expect(renderedOptions()).toEqual([]);
        expect(isLoading(), "a resolved-empty load must not still read as loading").toBe(false);
      });
    });
  }
});

/**
 * `loadInitialOnOpen` + `onLoadInitialOptions`: the prefetch that populates the
 * menu before the first query, distinct from `onSearch` above.
 */
describe("initial-load branch", () => {
  const CASES = [
    { name: "SearchableDropdown", Component: SearchableDropdown },
    { name: "MultiSelectSearchableDropdown", Component: MultiSelectSearchableDropdown },
  ] as const;

  for (const { name, Component } of CASES) {
    describe(name, () => {
      it("mounts an empty menu while the prefetch is in flight", async () => {
        await drive(Component as never, name, "async-initial-load-pending");
        expect(menuIsMounted()).toBe(true);
        expect(renderedOptions()).toEqual([]);
      });

      it("renders the prefetched options once they resolve", async () => {
        await drive(Component as never, name, "async-initial-load-resolved");
        expect(
          renderedOptions(),
          "the prefetch resolved but the menu did not take its options",
        ).toEqual(OPTION_LABELS);
      });

      it("renders an empty menu when the prefetch returns nothing", async () => {
        await drive(Component as never, name, "async-initial-load-empty");
        expect(menuIsMounted()).toBe(true);
        expect(renderedOptions()).toEqual([]);
      });
    });
  }
});

/**
 * CascadingDropdown's three async callbacks. Unlike the other four this
 * component has no option-source union — `options` stays required and is still
 * read on the async path — so the branch is reachable only by driving it.
 */
describe("cascading async branches", () => {
  it("replaces the menu with async search results", async () => {
    await drive(CascadingDropdown as never, "CascadingDropdown", "async-menu-search-resolved");
    expect(
      renderedMenuItems(),
      "onMenuSearch resolved but the menu kept showing the client-side list",
    ).toEqual(["Apple"]);
  });

  it("reaches an empty menu when the async search matches nothing", async () => {
    await drive(CascadingDropdown as never, "CascadingDropdown", "async-menu-search-empty");
    expect(
      renderedMenuItems(),
      "an empty async result fell back to the full option list",
    ).toEqual([]);
  });

  it("loads a lazy parent's children on hover", async () => {
    await drive(CascadingDropdown as never, "CascadingDropdown", "async-children-resolved");
    expect(
      renderedMenuItems().includes("Apple"),
      "onLoadChildren resolved but the submenu did not render its children",
    ).toBe(true);
  });

  it("fetches nothing before a lazy parent is hovered", async () => {
    await drive(CascadingDropdown as never, "CascadingDropdown", "async-children-initial");
    expect(renderedMenuItems()).toEqual(["Fruit", "Veg"]);
  });
});
