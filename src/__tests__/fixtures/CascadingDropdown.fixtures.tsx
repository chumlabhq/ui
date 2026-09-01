import { fireEvent } from "@testing-library/react";
import type { Fixtures } from "./types";
import { tick } from "./_act";

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

const fixtures: Fixtures = [
  { name: "closed", props: { options: NESTED } },
  { name: "labelled", props: { options: NESTED, label: "Produce", description: "Pick one." } },
  { name: "open", props: { options: NESTED, defaultOpen: true, keepMounted: true }, act: settle },
  {
    name: "open-search",
    props: { options: NESTED, defaultOpen: true, keepMounted: true, showSearch: true },
    act: settle,
  },
  {
    name: "open-submenu",
    props: { options: NESTED, defaultOpen: true, keepMounted: true, showSearch: true },
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
