import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown/index.js";
import type { Fixtures } from "./types.js";
import { OPTIONS } from "./_data.js";
import { neverResolves, resolvesTo, settleAsync } from "./_async.js";


const fixtures: Fixtures<typeof MultiSelectSearchableDropdown> = [
  { name: "closed", props: { options: OPTIONS } },
  { name: "labelled", props: { options: OPTIONS, label: "Fruit", description: "Pick one." } },
  { name: "open", props: { options: OPTIONS, defaultOpen: true } },
  {
    name: "open-with-selection",
    props: { options: OPTIONS, defaultOpen: true, defaultValue: ["a"], clearable: true },
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
  { name: "multi-value", props: { options: OPTIONS, defaultOpen: true, defaultValue: ["a", "b"], clearable: true, showSelectedChips: true } },
  { name: "chips-overflow", props: { options: OPTIONS, defaultValue: ["a", "b", "c"], showSelectedChips: true, maxDisplayedChips: 1 }, note: "moreCount needs more selections than maxDisplayedChips." },
  // Both branches of the option source, which is now a discriminated union:
  // passing `options` AND `onSearch` no longer typechecks, because
  // useMultiSelectDropdown drops `options` once onSearch is a function.
  {
    name: "async-initial",
    props: {
      onSearch: async () => OPTIONS,
      initialOptions: OPTIONS,
      defaultOpen: true,
      showSearch: true,
    },
  },
  {
    name: "async-searched",
    props: { onSearch: async () => OPTIONS, defaultOpen: true, showSearch: true },
    note: "Async with no initialOptions: the menu is empty until a query resolves.",
  },
  // The initial-load branch: `loadInitialOnOpen` + `onLoadInitialOptions`, which
  // sits on the async half of the option-source union and is separate from the
  // `onSearch` states above. Unlike Dropdown this one loads from an effect keyed
  // on `isOpen`, so `defaultOpen` is enough to reach it.
  {
    name: "async-initial-load-pending",
    props: {
      onSearch: resolvesTo(OPTIONS),
      onLoadInitialOptions: neverResolves(),
      loadInitialOnOpen: true,
      defaultOpen: true,
      showSearch: true,
    },
    note: "Opened with the prefetch in flight — the menu is mounted and empty.",
  },
  {
    name: "async-initial-load-resolved",
    props: {
      onSearch: resolvesTo(OPTIONS),
      onLoadInitialOptions: resolvesTo(OPTIONS),
      loadInitialOnOpen: true,
      defaultOpen: true,
      showSearch: true,
    },
    act: settleAsync,
  },
  {
    name: "async-initial-load-empty",
    props: {
      onSearch: resolvesTo(OPTIONS),
      onLoadInitialOptions: resolvesTo([]),
      loadInitialOnOpen: true,
      defaultOpen: true,
      showSearch: true,
    },
    act: settleAsync,
    note: "Prefetch returned nothing: the empty state, not the loading state.",
  },
];
export default fixtures;
