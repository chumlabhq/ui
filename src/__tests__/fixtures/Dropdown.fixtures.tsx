import { Dropdown } from "../../components/Dropdown/index.js";
import type { Fixtures } from "./types.js";
import { ChevronGlyph, CrossGlyph } from "./_icons.js";
import { RtlBoundary } from "./_harness.js";
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
    act: (c, ui) => ui.keyDown(c.querySelector("[role='combobox'], button"), "ArrowDown"),
  },
  {
    name: "open-custom-chevron-icon",
    props: { options: OPTIONS, defaultOpen: true, chevronIcon: <ChevronGlyph /> },
    note: "Passes a real SVG in place of the default chevron; icon-slots holds it to Dropdown/open's box and position.",
  },
  {
    name: "open-with-selection-custom-clear-icon",
    props: { options: OPTIONS, defaultOpen: true, defaultValue: "a", clearable: true, clearIcon: <CrossGlyph size={14} /> },
    note: "Passes a real SVG in place of the default clear glyph; icon-slots holds it to Dropdown/open-with-selection's box and position.",
  },
  { name: "open-empty", props: { options: [], defaultOpen: true } },
  { name: "loading", props: { options: OPTIONS, loading: true, defaultOpen: true } },
  { name: "error", props: { options: OPTIONS, label: "Fruit", error: true, errorMessage: "Required" } },
  { name: "success", props: { options: OPTIONS, label: "Fruit", success: true, successMessage: "Saved" } },
  { name: "disabled", props: { options: OPTIONS, disabled: true } },
  // The load-on-open branch. `loadOnOpen` + `loadOptions` is a discriminated
  // union prop-unions.type-test proves cannot be half-supplied; these are what
  // prove it renders. The menu is opened by clicking the trigger because
  // `loadOptions()` runs from the open handlers, not from an effect — see
  // `openMenu` in _async.
  {
    name: "async-load-initial",
    props: { loadOptions: resolvesTo(OPTIONS), loadOnOpen: true },
    note: "Before the first open: a trigger with no menu and nothing fetched yet.",
  },
  {
    name: "async-load-pending",
    props: { loadOptions: neverResolves(), loadOnOpen: true, loadingContent: "Loading fruit" },
    act: openMenu,
    note: "Opened, loader never settles — the in-flight menu holds still.",
  },
  {
    name: "async-load-resolved",
    props: { loadOptions: resolvesTo(OPTIONS), loadOnOpen: true },
    act: openMenuAndSettle,
  },
  {
    name: "async-load-empty",
    props: { loadOptions: resolvesTo([]), loadOnOpen: true },
    act: openMenuAndSettle,
    note: "Resolving to nothing is a different state from still loading.",
  },
  {
    name: "async-load-default-open",
    props: {
      loadOptions: resolvesTo(OPTIONS),
      loadOnOpen: true,
      defaultOpen: true,
    },
    act: settleAsync,
    note: "Starts open without either open handler running. This asserted against a permanently empty menu until the fetch moved to an effect keyed on isOpen.",
  },
  { name: "required", props: { options: OPTIONS, label: "Fruit", required: true } },
  {
    name: "custom-trigger",
    props: {
      options: OPTIONS,
      // Labelled, because the render props no longer carry a name of their own:
      // the value element the fallback pointed at is the consumer's to render,
      // and this fixture is what proved the reference dangled.
      label: "Fruit",
      renderTrigger: (triggerProps) => (
        <button {...triggerProps} type="button" data-custom-trigger>
          Pick one
        </button>
      ),
    },
    note: "The render props carry the combobox contract — role, aria-expanded, aria-controls — onto markup the library did not write.",
  },
  {
    name: "open-rtl",
    props: { options: OPTIONS, defaultOpen: true, label: "Fruit" },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    note: "Every anchored surface in the package aligns to the trigger's left edge; in RTL it should align to the right. e2e/rtl.spec.ts measures it."
  },
];
export default fixtures;
