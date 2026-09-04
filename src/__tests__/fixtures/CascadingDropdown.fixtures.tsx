import { CascadingDropdown } from "../../components/CascadingDropdown";
import { fireEvent } from "@testing-library/react";
import type { Fixtures } from "./types";
import { tick } from "./_act";
import { neverResolves, rejectsWith, resolvesTo } from "./_async";

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

/** The menu is portalled from a layout effect, so it is absent until effects flush. */
const settle = () => tick();

const openSubmenu = async (c: HTMLElement) => {
  await tick();
  const parent = c.ownerDocument.querySelector("[role='menuitem']");
  if (parent) {
    fireEvent.mouseEnter(parent);
    fireEvent.click(parent);
  }
  await tick();
};


/** Types a query into the menu's search input, then flushes past the debounce. */
const searchMenu = async (c: HTMLElement) => {
  await tick();
  const input = c.ownerDocument.querySelector("input");
  if (input) fireEvent.change(input, { target: { value: "ap" } });
  await tick(SEARCH_DEBOUNCE + 10);
};

/** Opens a submenu, then searches inside it. */
const searchSubmenu = async (c: HTMLElement) => {
  await openSubmenu(c);
  const inputs = c.ownerDocument.querySelectorAll("input");
  const submenuInput = inputs[inputs.length - 1];
  if (submenuInput) fireEvent.change(submenuInput, { target: { value: "ap" } });
  await tick(SEARCH_DEBOUNCE + 10);
};

/**
 * A parent whose children are fetched rather than declared. `hasChildren` is
 * what makes the submenu reachable when `children` is absent — without it the
 * option is a leaf and `onLoadChildren` can never fire.
 */
const LAZY = [
  { value: "fruit", label: "Fruit", hasChildren: true },
  { value: "veg", label: "Veg", hasChildren: true },
];

/** Debounce the async search callbacks wait out before firing. */
const SEARCH_DEBOUNCE = 20;


/**
 * Opens a submenu by hover alone.
 *
 * A lazy parent (`hasChildren: true`, no `children` array) must not be clicked:
 * `handleMenuItemClick` branches on `option.children` only, so it treats the
 * parent as a leaf and commits `{ root: value }` instead of opening the
 * submenu — even after `onLoadChildren` has resolved. `handleMenuItemHover` is
 * the handler that checks `hasChildren`, and hover is the interaction that
 * actually reaches this mode.
 */
const hoverSubmenu = async (c: HTMLElement) => {
  await tick();
  const parent = c.ownerDocument.querySelector("[role='menuitem']");
  if (parent) fireEvent.mouseEnter(parent);
  await tick();
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
    name: "open-search",
    props: { options: NESTED, defaultOpen: true, keepMounted: true, showMenuSearch: true, showSubmenuSearch: true },
    act: settle,
  },
  {
    name: "open-submenu",
    props: { options: NESTED, defaultOpen: true, keepMounted: true, showMenuSearch: true, showSubmenuSearch: true },
    note: "Submenu parts, and their own search box, only exist once a parent row is entered.",
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
  // The async half of the menu. `onMenuSearch` and `onSubmenuSearch` replace
  // client-side filtering; `onLoadChildren` fetches a submenu's contents. All
  // three are Promise-returning and none had a fixture, so every contract below
  // has only ever seen this component's synchronous tree.
  {
    name: "async-menu-search-pending",
    props: {
      options: NESTED,
      defaultOpen: true,
      keepMounted: true,
      showMenuSearch: true,
      onMenuSearch: neverResolves(),
      searchDebounceMs: SEARCH_DEBOUNCE,
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
      onMenuSearch: resolvesTo([{ value: "a", label: "Apple" }]),
      searchDebounceMs: SEARCH_DEBOUNCE,
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
      onMenuSearch: resolvesTo([]),
      searchDebounceMs: SEARCH_DEBOUNCE,
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
      onSubmenuSearch: resolvesTo([{ value: "a", label: "Apple" }]),
      searchDebounceMs: SEARCH_DEBOUNCE,
    },
    act: searchSubmenu,
  },
  {
    name: "async-children-initial",
    props: { options: LAZY, defaultOpen: true, keepMounted: true, onLoadChildren: resolvesTo([]) },
    act: settle,
    note: "Lazy parents before any submenu is opened: nothing fetched yet.",
  },
  {
    name: "async-children-pending",
    props: { options: LAZY, defaultOpen: true, keepMounted: true, onLoadChildren: neverResolves() },
    act: hoverSubmenu,
    note: "Submenu opened, children outstanding — the loading item.",
  },
  {
    name: "async-children-resolved",
    props: {
      options: LAZY,
      defaultOpen: true,
      keepMounted: true,
      onLoadChildren: resolvesTo([{ value: "a", label: "Apple" }]),
    },
    act: hoverSubmenu,
  },
  {
    name: "async-children-empty",
    props: { options: LAZY, defaultOpen: true, keepMounted: true, onLoadChildren: resolvesTo([]) },
    act: hoverSubmenu,
    note: "A parent that turns out to have no children.",
  },
  {
    name: "async-children-error",
    props: {
      options: LAZY,
      defaultOpen: true,
      keepMounted: true,
      onLoadChildren: rejectsWith("network"),
      onLoadError: () => {},
    },
    act: hoverSubmenu,
    note: "onLoadError is the only route to the rejected path.",
  },
];
export default fixtures;
