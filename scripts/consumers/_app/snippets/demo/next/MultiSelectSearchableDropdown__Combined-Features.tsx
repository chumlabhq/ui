"use client";

import { useState } from "react";
import { MultiSelectOption, MultiSelectSearchableDropdown } from "@chumlab/ui/multi-select-searchable-dropdown";

const countryOptions: MultiSelectOption[] = [
  { value: "us", label: "United States", content: <span>United States</span> },
  {
    value: "gb",
    label: "United Kingdom",
    content: <span>United Kingdom</span>,
  },
  { value: "ca", label: "Canada", content: <span>Canada</span> },
  { value: "au", label: "Australia", content: <span>Australia</span> },
  { value: "de", label: "Germany", content: <span>Germany</span> },
  { value: "fr", label: "France", content: <span>France</span> },
  { value: "jp", label: "Japan", content: <span>Japan</span> },
  { value: "in", label: "India", content: <span>India</span> },
];

export default function MultiSelectSearchableDropdownExample() {
  const [combinedValue, setCombinedValue] = useState<string[]>([]);
  return (
    <div className="w-full sm:max-w-80">
      <MultiSelectSearchableDropdown
        label="Select Countries"
        required
        options={countryOptions}
        value={combinedValue}
        onValueChange={(values) => setCombinedValue(values)}
        error={combinedValue.length === 0}
        errorMessage={
          combinedValue.length === 0
          ? "Please select at least one country"
          : undefined
        }
        placeholder="Pick countries..."
        maxDisplayedChips={2}
        fullWidth
        keepMounted
        dropdownGap={8}
        dropdownZIndex={100}
        searchPlaceholder="Filter countries..."
        onFocus={() => console.log("Combined: focus")}
        onBlur={() => console.log("Combined: blur")}
        onKeyDown={(e) => console.log("Combined keydown:", e.key)}
        classes={
          {
                        ...({
            root: "",
            trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
            content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
            searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-border dark:bg-cl-bg-elevated",
            searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
            loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
            label: "block text-sm font-medium mb-1 text-cl-text-secondary",
            chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10 dark:text-cl-text",
            chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
          }),
                        trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors min-h-[42px] border-cl-border-input-focus bg-cl-accent/10 text-cl-text hover:border-cl-border-input-focus focus:outline-none focus:ring-2 focus:ring-cl-accent dark:border dark:border-cl-border-input-focus dark:bg-cl-accent/40 dark:text-cl-accent dark:hover:border-cl-border-input-focus dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
                        value:
                          "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                        content: "rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-accent)_10%,var(--color-cl-bg-elevated))] border border-cl-border-input-focus dark:bg-[color-mix(in_oklab,var(--color-cl-accent)_20%,var(--color-cl-bg-elevated))] dark:border dark:border-cl-border-input-focus",
                        chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-accent/60 dark:text-cl-accent"
                      }
        }
      />
    </div>
  );
}
