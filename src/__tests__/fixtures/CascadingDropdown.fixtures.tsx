import { CascadingDropdown } from "../../components/CascadingDropdown";
import { fireEvent } from "@testing-library/react";
import type { Fixtures } from "./types";
import { tick } from "./_act";

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
];
export default fixtures;
