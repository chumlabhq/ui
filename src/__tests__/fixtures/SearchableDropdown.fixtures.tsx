import { SearchableDropdown } from "../../components/SearchableDropdown/index.js";
import type { Fixtures } from "./types.js";
import { ChevronGlyph, CrossGlyph, SearchGlyph } from "./_icons.js";
import { RtlBoundary } from "./_harness.js";
import { OPTIONS } from "./_data.js";
import { neverResolves, resolvesTo, settleAsync } from "./_async.js";


const fixtures: Fixtures<typeof SearchableDropdown> = [
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
  { name: "open-empty", props: { options: [], defaultOpen: true } },
  { name: "loading", props: { options: OPTIONS, loading: true, defaultOpen: true } },
  { name: "error", props: { options: OPTIONS, label: "Fruit", error: true, errorMessage: "Required" } },
  { name: "success", props: { options: OPTIONS, label: "Fruit", success: true, successMessage: "Saved" } },
  { name: "disabled", props: { options: OPTIONS, disabled: true } },
  { name: "open-search", props: { options: OPTIONS, defaultOpen: true, showSearch: true } },
  {
    name: "open-custom-chevron-icon",
    props: { options: OPTIONS, defaultOpen: true, chevronIcon: <ChevronGlyph /> },
    note: "Passes a real SVG in place of the default chevron; icon-slots holds it to SearchableDropdown/open's box and position.",
  },
  {
    name: "open-with-selection-custom-clear-icon",
    props: { options: OPTIONS, defaultOpen: true, defaultValue: "a", clearable: true, clearIcon: <CrossGlyph /> },
    note: "Passes a real SVG in place of the default clear glyph; icon-slots holds it to SearchableDropdown/open-with-selection's box and position.",
  },
  {
    name: "open-search-custom-search-icon",
    props: { options: OPTIONS, defaultOpen: true, showSearch: true, searchIcon: <SearchGlyph /> },
    note: "Passes a real SVG in place of the default search magnifier; icon-slots holds it to SearchableDropdown/open-search's box and position.",
  },
  // Both branches of the option source, which is now a discriminated union:
  // passing `options` AND `searchOptions` no longer typechecks, because useDropdown
  // drops `options` entirely once searchOptions is a function.
  {
    name: "async-initial",
    props: {
      searchOptions: async () => OPTIONS,
      initialOptions: OPTIONS,
      defaultOpen: true,
      showSearch: true,
    },
  },
  {
    name: "async-searched",
    props: { searchOptions: async () => OPTIONS, defaultOpen: true, showSearch: true },
    note: "Async with no initialOptions: the menu is empty until a query resolves.",
  },
  // The initial-load branch: `loadInitialOnOpen` + `loadInitialOptions`, which
  // sits on the async half of the option-source union and is separate from the
  // `searchOptions` states above. Unlike Dropdown this one loads from an effect keyed
  // on `isOpen`, so `defaultOpen` is enough to reach it.
  {
    name: "async-initial-load-pending",
    props: {
      searchOptions: resolvesTo(OPTIONS),
      loadInitialOptions: neverResolves(),
      loadInitialOnOpen: true,
      defaultOpen: true,
      showSearch: true,
    },
    note: "Opened with the prefetch in flight — the menu is mounted and empty.",
  },
  {
    name: "async-initial-load-resolved",
    props: {
      searchOptions: resolvesTo(OPTIONS),
      loadInitialOptions: resolvesTo(OPTIONS),
      loadInitialOnOpen: true,
      defaultOpen: true,
      showSearch: true,
    },
    act: settleAsync,
  },
  {
    name: "async-initial-load-empty",
    props: {
      searchOptions: resolvesTo(OPTIONS),
      loadInitialOptions: resolvesTo([]),
      loadInitialOnOpen: true,
      defaultOpen: true,
      showSearch: true,
    },
    act: settleAsync,
    note: "Prefetch returned nothing: the empty state, not the loading state.",
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
  },
];
export default fixtures;
