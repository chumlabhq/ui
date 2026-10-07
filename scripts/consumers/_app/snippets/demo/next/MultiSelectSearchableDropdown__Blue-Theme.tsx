"use client";

import { useState } from "react";
import { MultiSelectOption, MultiSelectSearchableDropdown } from "@chumlab/ui/multi-select-searchable-dropdown";

const staticOptions: MultiSelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
];

export default function MultiSelectSearchableDropdownExample() {
  const [purpleThemeValue, setPurpleThemeValue] = useState<string[]>([]);
  return (
    <div className="w-full sm:max-w-72">
      <MultiSelectSearchableDropdown
        options={staticOptions}
        value={purpleThemeValue}
        onValueChange={(values) => setPurpleThemeValue(values)}
        placeholder="Select fruits..."
        maxDisplayedChips={2}
        classes={
          {
                        ...({
            root: "",
            trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
            content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
            searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-border dark:bg-cl-bg-elevated",
            searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
            loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
            label: "block text-sm font-medium mb-1 text-cl-text-secondary",
            chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10 dark:text-cl-text",
            chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
          }),
                        trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-cl-accent min-h-[42px] border-cl-border-input-focus bg-cl-accent/10 text-cl-text hover:border-cl-border-input-focus dark:border dark:border-cl-border-input-focus dark:bg-cl-accent/60 dark:text-cl-accent dark:hover:border-cl-border-input-focus",
                        value:
                          "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                        content: "rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-accent)_10%,var(--color-cl-bg-elevated))] border border-cl-border-input-focus dark:bg-[color-mix(in_oklab,var(--color-cl-accent)_20%,var(--color-cl-bg-elevated))] dark:border dark:border-cl-border-input-focus",
                        searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-border-input-focus bg-cl-accent/10 dark:border dark:border-cl-border-input-focus dark:bg-cl-accent/20",
                        item: "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-accent hover:bg-cl-accent/10 dark:text-cl-accent dark:hover:bg-cl-accent/60",
                        icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent",
                        itemControl: "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input-focus dark:border dark:border-cl-border-input-focus",
                        searchIcon: "w-4 h-4 shrink-0 text-cl-accent",
                        chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-accent/60 dark:text-cl-accent",
                        chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-accent",
                        count: "inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-accent/10 text-cl-text dark:bg-cl-accent/40 dark:text-cl-accent",
                        label: "block text-sm font-medium mb-1 text-cl-accent",
                        message: "text-sm mt-1 text-cl-accent"
                      }
        }
        aria-label="Blue theme fruits"
      />
    </div>
  );
}
