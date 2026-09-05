import { Dropdown } from "../../components/Dropdown/index.js";
import { fireEvent } from "@testing-library/react";
import type { Fixtures } from "./types.js";
import { OPTIONS } from "./_data.js";
import {
  neverResolves,
  openMenu,
  openMenuAndSettle,
  resolvesTo,
  settleAsync,
} from "./_async.js";


const fixtures: Fixtures<typeof Dropdown> = [
  { name: "closed", props: { options: OPTIONS } },
  { name: "labelled", props: { options: OPTIONS, label: "Fruit", description: "Pick one." } },
  { name: "open", props: { options: OPTIONS, defaultOpen: true } },
  {
    name: "open-with-selection",
    props: { options: OPTIONS, defaultOpen: true, defaultValue: "a", clearable: true },
    note: "Drives the selected item, its indicator, and the clear control.",
  },
  {
    name: "open-keyboard-focus",
    props: { options: OPTIONS, defaultOpen: true },
    note: "Highlight state has no prop; arrow-down is the only way in.",
    act: (c) => {
      const trigger = c.querySelector("[role='combobox'], button");
      if (trigger) fireEvent.keyDown(trigger, { key: "ArrowDown" });
    },
  },
  { name: "open-empty", props: { options: [], defaultOpen: true } },
  { name: "loading", props: { options: OPTIONS, loading: true, defaultOpen: true } },
  { name: "error", props: { options: OPTIONS, label: "Fruit", error: true, errorMessage: "Required" } },
  { name: "success", props: { options: OPTIONS, label: "Fruit", success: true, successMessage: "Saved" } },
  { name: "disabled", props: { options: OPTIONS, disabled: true } },
  // The load-on-open branch. `loadOnOpen` + `onLoadOptions` is a discriminated
  // union prop-unions.type-test proves cannot be half-supplied; these are what
  // prove it renders. The menu is opened by clicking the trigger because
  // `loadOptions()` runs from the open handlers, not from an effect — see
  // `openMenu` in _async.
  {
    name: "async-load-initial",
    props: { onLoadOptions: resolvesTo(OPTIONS), loadOnOpen: true },
    note: "Before the first open: a trigger with no menu and nothing fetched yet.",
  },
  {
    name: "async-load-pending",
    props: { onLoadOptions: neverResolves(), loadOnOpen: true, loadingText: "Loading fruit" },
    act: openMenu,
    note: "Opened, loader never settles — the in-flight menu holds still.",
  },
  {
    name: "async-load-resolved",
    props: { onLoadOptions: resolvesTo(OPTIONS), loadOnOpen: true },
    act: openMenuAndSettle,
  },
  {
    name: "async-load-empty",
    props: { onLoadOptions: resolvesTo([]), loadOnOpen: true },
    act: openMenuAndSettle,
    note: "Resolving to nothing is a different state from still loading.",
  },
  {
    name: "async-load-default-open",
    props: {
      onLoadOptions: resolvesTo(OPTIONS),
      loadOnOpen: true,
      defaultOpen: true,
    },
    act: settleAsync,
    note: "Starts open without either open handler running. This asserted against a permanently empty menu until the fetch moved to an effect keyed on isOpen.",
  },
];
export default fixtures;
