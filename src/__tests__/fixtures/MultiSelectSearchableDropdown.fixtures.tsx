import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown";
import { fireEvent } from "@testing-library/react";
import type { Fixtures } from "./types";
import { OPTIONS } from "./_data";

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
];
export default fixtures;
