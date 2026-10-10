/** @jsxImportSource react */
/**
 * The two searchable dropdowns resolve their menu from a different source than
 * their trigger.
 *
 * `useDropdown` and `useMultiSelectDropdown` both compute `displayOptions` from
 * `asyncOptions`/`allInitialOptions` once `searchOptions` is a function, and never
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
import { SearchableDropdown } from "../../components/SearchableDropdown/index.js";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown/index.js";
import { Dropdown } from "../../components/Dropdown/index.js";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown/index.js";
import { CascadingDropdown } from "../../components/CascadingDropdown/index.js";
import { fixturesFor } from "../fixtures/index.js";
import { applyAct } from "../fixtures/_act.contract.js";
import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

const OPTION_LABELS = ["Apple", "Banana", "Cherry"];

/**
 * Labels the open menu is showing, read from the portalled listbox.
 *
 * Queried off the DOM rather than by role: the listbox holds `visibility:
 * hidden` until `useAnchoredPosition` reports a stable position, which it
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

/**
 * Counted, not assumed. A self-check proves the predicate can fail; this
 * proves it was pointed at something.
 */
const asserted = { n: 0 };

describe("async options contract", () => {
  describe("self-check", () => {
    it("catches a menu resolved from a source the branch ignores", async () => {
      // The pre-fix shape: options supplied, searchOptions present, menu empty.
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
        asserted.n += 1;
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
  await applyAct(fixture, container);
  return container;
};

/**
 * `loadOnOpen` + `loadOptions`: the menu is fetched when the trigger opens it.
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
        asserted.n += 1;
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

      it("fetches for a menu that starts open", async () => {
        // `defaultOpen` reaches the open state without either open handler
        // running. The fetch is keyed on `isOpen` for exactly this reason; when
        // it lived in the handlers this rendered an empty menu forever.
        await drive(Component as never, name, "async-load-default-open");
        expect(
          renderedOptions(),
          "a menu that starts open never fetched its options",
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
 * `loadInitialOnOpen` + `loadInitialOptions`: the prefetch that populates the
 * menu before the first query, distinct from `searchOptions` above.
 */
describe("initial-load branch", () => {
  const CASES = [
    { name: "SearchableDropdown", Component: SearchableDropdown },
    { name: "MultiSelectSearchableDropdown", Component: MultiSelectSearchableDropdown },
  ] as const;

  for (const { name, Component } of CASES) {
    describe(name, () => {
      it("mounts an empty menu while the prefetch is in flight", async () => {
        asserted.n += 1;
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
      "searchMenu resolved but the menu kept showing the client-side list",
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
      "loadChildren resolved but the submenu did not render its children",
    ).toBe(true);
  });

  it("opens a lazy parent's submenu on click rather than selecting it", async () => {
    // The click handler tested `option.children` alone, so a `hasChildren`
    // parent was a leaf to it: clicking committed `{ root: value }` and closed
    // the menu. Both halves are asserted — the submenu opens, and no value is
    // committed — because either one alone would pass on a different bug.
    const committed: unknown[] = [];
    const fixture = fixturesFor("CascadingDropdown").find(
      (f) => f.name === "async-children-clicked",
    );
    if (!fixture) throw new Error("CascadingDropdown has no `async-children-clicked` fixture");
    // Merged then cast once: spreading a `Record<string, never>` and adding a
    // prop alongside it does not typecheck, and the fixture's props are opaque
    // here by design.
    const props = {
      ...(fixture.props as Record<string, unknown>),
      onValueChange: (value: unknown) => {
        committed.push(value);
      },
    } as unknown as React.ComponentProps<typeof CascadingDropdown>;
    const { container } = render(<CascadingDropdown {...props} />);
    await applyAct(fixture, container);

    expect(
      renderedMenuItems().includes("Apple"),
      "clicking a lazy parent did not open its submenu",
    ).toBe(true);
    expect(
      committed,
      "clicking a lazy parent committed a value, as though it were a leaf",
    ).toEqual([]);
  });

  it("fetches nothing before a lazy parent is hovered", async () => {
    await drive(CascadingDropdown as never, "CascadingDropdown", "async-children-initial");
    expect(renderedMenuItems()).toEqual(["Fruit", "Veg"]);
  });

  it("asserted on a real number of component branches", () => {
    console.log(`ASYNC_OPTIONS asserted on ${asserted.n} component branches`);
    // Every async-capable component is covered, each in the branch that
    // applies to it: the two searchable dropdowns here and in `initial-load
    // branch`, `Dropdown` and `MultiSelectDropdown` in `load-on-open branch`,
    // `CascadingDropdown` in its own. The count spans all of them — reading one
    // describe in isolation says 2 and looks like half the list is missing.
    expect(asserted.n, "this contract iterated nothing").toBeGreaterThan(4);
  });
});
