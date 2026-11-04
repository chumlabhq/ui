import type { ReactNode } from "react";

/**
 * A field either side of the component, so Tab and Shift+Tab have somewhere to
 * go, room below for a surface to open into, and a blank corner to press. Inputs
 * rather than buttons: WebKit leaves buttons out of the tab order by default, and
 * a Tab that skipped the target would read as the component's fault.
 */
export const withNeighbours = (node: ReactNode) => (
  <div style={{ padding: 40, width: 420 }}>
    <input data-before aria-label="Before" style={{ marginBottom: 12, display: "block" }} />
    {node}
    <input data-after aria-label="After" style={{ marginTop: 340, display: "block" }} />
  </div>
);

/** Disabled at both ends and in the middle: each breaks a different part of a wrap-and-skip loop. */
export const KEY_OPTIONS = [
  { value: "a", label: "Apple", disabled: true },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry", disabled: true },
  { value: "d", label: "Damson" },
  { value: "e", label: "Elder", disabled: true },
];

export const KEY_TABS = [
  { id: "one", label: "First" },
  { id: "two", label: "Second", disabled: true },
  { id: "three", label: "Third" },
  { id: "four", label: "Fourth" },
];

export const KEY_CASCADE = [
  {
    value: "fruit",
    label: "Fruit",
    children: [
      { value: "apple", label: "Apple", disabled: true },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry", disabled: true },
      { value: "damson", label: "Damson" },
    ],
  },
  { value: "veg", label: "Veg", disabled: true, children: [{ value: "carrot", label: "Carrot" }] },
  { value: "leaf", label: "Leaf" },
  { value: "nuts", label: "Nuts", children: [{ value: "pecan", label: "Pecan" }] },
];

/** Three collapsed items around disabled ones, with hrefs a press can be seen to follow. */
export const KEY_CRUMBS = [
  { id: "home", label: "Home", href: "#home" },
  { id: "one", label: "One", href: "#one", disabled: true },
  { id: "two", label: "Two", href: "#two" },
  { id: "three", label: "Three", href: "#three", disabled: true },
  { id: "four", label: "Four", href: "#four" },
  { id: "five", label: "Five", href: "#five", disabled: true },
  { id: "kept", label: "Kept", href: "#kept" },
  { id: "here", label: "Here" },
];
