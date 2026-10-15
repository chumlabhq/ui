import { CascadingDropdown } from "../../components/CascadingDropdown/index.js";
import type { Fixtures } from "./types.js";
import { CrossGlyph, SearchGlyph } from "./_icons.js";
import { RtlBoundary } from "./_harness.js";
import type { ActTools } from "./_act.js";
import { neverResolves, rejectsWith, resolvesTo } from "./_async.js";

const MULTI = [
  {
    value: "fruit",
    label: "Fruit",
    selectionMode: "multi" as const,
    children: [
      { value: "a", label: "Apple" },
      { value: "b", label: "Banana" },
    ],
  },
];

const NESTED = [
  {
    value: "fruit",
    label: "Fruit",
    children: [
      { value: "a", label: "Apple" },
      { value: "b", label: "Banana", disabled: true },
    ],
  },
  { value: "veg", label: "Veg", children: [{ value: "c", label: "Carrot" }] },
];

/**
 * NESTED marks a disabled option inside a parent's children, so only submenu
 * items ever carried data-disabled. `menuItemDisabled` was twice recorded
 * "attempted, still unreachable" against fixtures that could not reach it: the
 * disabled flag has to be on a TOP-LEVEL option.
 */
const DISABLED_TOP = [
  { value: "fruit", label: "Fruit", children: [{ value: "a", label: "Apple" }] },
  { value: "veg", label: "Veg", disabled: true, children: [{ value: "c", label: "Carrot" }] },
];

/** Twenty-four top-level items, one of them a parent near the end: taller than a 720px viewport. */
const LONG = Array.from({ length: 24 }, (_, i) =>
  i === 21
    ? { value: `item-${i + 1}`, label: `Item ${i + 1}`, children: [{ value: "sub-a", label: "Sub A" }, { value: "sub-b", label: "Sub B" }] }
    : { value: `item-${i + 1}`, label: `Item ${i + 1}` },
);

/** The menu is portalled from a layout effect, so it is absent until effects flush. */
const settle = (_c: HTMLElement, ui: ActTools) => ui.settle();

const openSubmenu = async (c: HTMLElement, ui: ActTools) => {
  await ui.settle();
  const parent = c.ownerDocument.querySelector("[role='menuitem']");
  ui.mouseEnter(parent);
  ui.click(parent);
  await ui.settle();
};


/** Types a query into the menu's search input, then flushes past the debounce. */
const searchMenu = async (c: HTMLElement, ui: ActTools) => {
  await ui.settle();
  ui.change(c.ownerDocument.querySelector("input"), "ap");
  await ui.settle(SEARCH_DEBOUNCE + 10);
};

/** Opens a submenu, then searches inside it. */
const searchSubmenu = async (c: HTMLElement, ui: ActTools) => {
  await openSubmenu(c, ui);
  const inputs = c.ownerDocument.querySelectorAll("input");
  ui.change(inputs[inputs.length - 1], "ap");
  await ui.settle(SEARCH_DEBOUNCE + 10);
};

/**
 * A parent whose children are fetched rather than declared. `hasChildren` is
 * what makes the submenu reachable when `children` is absent — without it the
 * option is a leaf and `loadChildren` can never fire.
 */
const LAZY = [
  { value: "fruit", label: "Fruit", hasChildren: true },
  { value: "veg", label: "Veg", hasChildren: true },
];

/** Debounce the async search callbacks wait out before firing. */
const SEARCH_DEBOUNCE = 20;


/**
 * Opens a submenu by hover alone, with no click.
 *
 * Paired with `clickSubmenu` below: both gestures must open a lazy parent, and
 * they did not — click read `option.children` only, so a `hasChildren` parent
 * was a leaf to it. Keeping each interaction on its own fixture is what makes
 * a future divergence show up as a failure rather than as one path quietly
 * carrying the other.
 */
const hoverSubmenu = async (c: HTMLElement, ui: ActTools) => {
  await ui.settle();
  ui.mouseEnter(c.ownerDocument.querySelector("[role='menuitem']"));
  await ui.settle();
};

/** Opens a submenu by clicking the parent, with no hover first. */
const clickSubmenu = async (c: HTMLElement, ui: ActTools) => {
  await ui.settle();
  ui.click(c.ownerDocument.querySelector("[role='menuitem']"));
  await ui.settle();
};

const fixtures: Fixtures<typeof CascadingDropdown> = [
  { name: "closed", props: { options: NESTED } },
  {
    name: "disabled-top-level",
    props: { options: DISABLED_TOP, defaultOpen: true, keepMounted: true },
    act: settle,
  },
  { name: "labelled", props: { options: NESTED, label: "Produce", description: "Pick one." } },
  { name: "open", props: { options: NESTED, defaultOpen: true, keepMounted: true }, act: settle },
  {
    name: "open-long",
    props: { options: LONG, defaultOpen: true, keepMounted: true },
    wrap: (node) => <div style={{ width: 240 }}>{node}</div>,
    act: settle,
    note: "A top-level menu taller than the viewport, with a submenu near its end: the menu has to fit the space and scroll. 240px wide, so the submenu has room beside it.",
  },
  {
    name: "open-long-low",
    props: { options: LONG, defaultOpen: true, keepMounted: true },
    wrap: (node) => <div style={{ paddingTop: "75vh", width: 240 }}>{node}</div>,
    act: settle,
    note: "The same menu from a trigger near the bottom of the viewport, where the space is above it.",
  },
  {
    name: "open-search",
    props: { options: NESTED, defaultOpen: true, keepMounted: true, showMenuSearch: true, showSubmenuSearch: true },
    act: settle,
  },
  {
    name: "open-search-custom-search-icon",
    props: { options: NESTED, defaultOpen: true, keepMounted: true, showMenuSearch: true, showSubmenuSearch: true, searchIcon: <SearchGlyph /> },
    note: "Passes a real SVG in place of the default search magnifier; icon-slots holds it to CascadingDropdown/open-search's box and position.",
    act: settle,
  },
  {
    name: "open-submenu",
    props: { options: NESTED, defaultOpen: true, keepMounted: true, showMenuSearch: true, showSubmenuSearch: true },
    note: "Submenu parts, and their own search box, only exist once a parent row is entered.",
    act: openSubmenu,
  },
  /**
   * The two anchor positions the clamp and the flip are about.
   *
   * The submenu was CSS-positioned until it moved onto MenuSurface, so it was
   * the one floating surface with neither: at 1024 it opened at x=1003 with a
   * width of 220 and left the frame, and at 320 it painted nothing at all.
   * `cascading-submenu.spec.ts` measures both of these against their anchor.
   */
  {
    name: "open-submenu-near-right",
    props: { options: NESTED, defaultOpen: true, keepMounted: true, showSubmenuSearch: true },
    wrap: (node) => <div style={{ width: 260, marginLeft: "auto" }}>{node}</div>,
    act: openSubmenu,
  },
  {
    name: "open-submenu-left",
    props: {
      options: NESTED,
      defaultOpen: true,
      keepMounted: true,
      showSubmenuSearch: true,
      submenuSide: "start",
    },
    wrap: (node) => <div style={{ width: 260, marginLeft: "auto" }}>{node}</div>,
    note: "submenuSide honoured when the preferred side has room; the side is a layout answer and jsdom has none.",
    act: openSubmenu,
  },
  {
    name: "open-submenu-near-left",
    props: { options: NESTED, defaultOpen: true, keepMounted: true, showSubmenuSearch: true },
    wrap: (node) => <div style={{ width: 260, marginRight: "auto" }}>{node}</div>,
    act: openSubmenu,
  },
  {
    name: "open-with-selection",
    props: {
      options: NESTED,
      defaultOpen: true,
      keepMounted: true,
      defaultValue: { fruit: "a" },
      clearable: true,
    },
    act: openSubmenu,
  },
  {
    name: "open-with-selection-custom-clear-icon",
    props: { options: NESTED, defaultOpen: true, keepMounted: true, defaultValue: { fruit: "a" }, clearable: true, clearIcon: <CrossGlyph /> },
    note: "Passes a real SVG in place of the default clear glyph; icon-slots holds it to CascadingDropdown/open-with-selection's box and position.",
    act: openSubmenu,
  },
  {
    name: "open-multi",
    props: { options: MULTI, defaultOpen: true, keepMounted: true },
    note: "`selectionMode` is per-option and read from the PARENT (CascadingDropdown.tsx:192), so a multi-select submenu needs it on the parent, not on the dropdown.",
    act: openSubmenu,
  },
  {
    name: "open-multi-selected",
    props: {
      options: MULTI,
      defaultOpen: true,
      keepMounted: true,
      defaultValue: { fruit: ["a"] },
    },
    note: "The only fixture rendering `checkboxChecked` — it needs multi mode AND a selection.",
    act: openSubmenu,
  },
  { name: "open-empty", props: { options: [], defaultOpen: true, keepMounted: true }, act: settle },
  {
    name: "loading",
    props: { options: NESTED, loading: true, defaultOpen: true, keepMounted: true },
    act: settle,
  },
  { name: "error", props: { options: NESTED, label: "Produce", error: true, errorMessage: "Required" } },
  { name: "success", props: { options: NESTED, label: "Produce", success: true, successMessage: "Saved" } },
  { name: "disabled", props: { options: NESTED, disabled: true } },
  // The async half of the menu. `searchMenu` and `searchSubmenu` replace
  // client-side filtering; `loadChildren` fetches a submenu's contents. All
  // three are Promise-returning and none had a fixture, so every contract below
  // has only ever seen this component's synchronous tree.
  {
    name: "async-menu-search-pending",
    props: {
      options: NESTED,
      defaultOpen: true,
      keepMounted: true,
      showMenuSearch: true,
      searchMenu: neverResolves(),
      searchDebounce: SEARCH_DEBOUNCE,
    },
    act: searchMenu,
    note: "Query typed, results outstanding: the menu still shows the sync options.",
  },
  {
    name: "async-menu-search-resolved",
    props: {
      options: NESTED,
      defaultOpen: true,
      keepMounted: true,
      showMenuSearch: true,
      searchMenu: resolvesTo([{ value: "a", label: "Apple" }]),
      searchDebounce: SEARCH_DEBOUNCE,
    },
    act: searchMenu,
  },
  {
    name: "async-menu-search-empty",
    props: {
      options: NESTED,
      defaultOpen: true,
      keepMounted: true,
      showMenuSearch: true,
      searchMenu: resolvesTo([]),
      searchDebounce: SEARCH_DEBOUNCE,
    },
    act: searchMenu,
    note: "An async search that matches nothing must reach the empty state, not fall back to the full list.",
  },
  {
    name: "async-submenu-search-resolved",
    props: {
      options: NESTED,
      defaultOpen: true,
      keepMounted: true,
      showSubmenuSearch: true,
      searchSubmenu: resolvesTo([{ value: "a", label: "Apple" }]),
      searchDebounce: SEARCH_DEBOUNCE,
    },
    act: searchSubmenu,
  },
  {
    name: "async-children-initial",
    props: { options: LAZY, defaultOpen: true, keepMounted: true, loadChildren: resolvesTo([]) },
    act: settle,
    note: "Lazy parents before any submenu is opened: nothing fetched yet.",
  },
  {
    name: "async-children-pending",
    props: { options: LAZY, defaultOpen: true, keepMounted: true, loadChildren: neverResolves() },
    act: hoverSubmenu,
    note: "Submenu opened, children outstanding — the loading item.",
  },
  {
    name: "async-children-resolved",
    props: {
      options: LAZY,
      defaultOpen: true,
      keepMounted: true,
      loadChildren: resolvesTo([{ value: "a", label: "Apple" }]),
    },
    act: hoverSubmenu,
  },
  {
    name: "async-children-empty",
    props: { options: LAZY, defaultOpen: true, keepMounted: true, loadChildren: resolvesTo([]) },
    act: hoverSubmenu,
    note: "A parent that turns out to have no children.",
  },
  {
    name: "async-children-error",
    props: {
      options: LAZY,
      defaultOpen: true,
      keepMounted: true,
      loadChildren: rejectsWith("network"),
      onLoadError: () => {},
    },
    act: hoverSubmenu,
    note: "onLoadError is the only route to the rejected path.",
  },
  {
    name: "async-children-clicked",
    props: {
      options: LAZY,
      defaultOpen: true,
      keepMounted: true,
      loadChildren: resolvesTo([{ value: "a", label: "Apple" }]),
    },
    act: clickSubmenu,
    note: "Click with no hover. handleMenuItemClick used to read this parent as a leaf and commit a value instead of opening the submenu.",
  },
  { name: "required", props: { options: NESTED, label: "Category", required: true } },
  {
    name: "custom-trigger",
    props: {
      options: NESTED,
      label: "Category",
      renderTrigger: (triggerProps) => (
        <button {...triggerProps} type="button" data-custom-trigger>
          Pick one
        </button>
      ),
    },
  },
  {
    name: "open-submenu-rtl",
    props: { options: NESTED, defaultOpen: true, keepMounted: true, showSubmenuSearch: true },
    wrap: (node) => (
      <RtlBoundary>
        <div style={{ width: 260, margin: "0 auto" }}>{node}</div>
      </RtlBoundary>
    ),
    note: "Centred, so either side has room: the side it opens on is the one `submenuSide` resolves to, not the one that fits.",
    act: openSubmenu,
  },
];
export default fixtures;
