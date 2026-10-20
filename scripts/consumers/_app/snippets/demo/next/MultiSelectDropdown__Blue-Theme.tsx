"use client";

import { useState } from "react";
import { MultiSelectDropdown, MultiSelectOption } from "@chumlab/ui/multi-select-dropdown";

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

export default function MultiSelectDropdownExample() {
  const [purpleThemeValue, setPurpleThemeValue] = useState<string[]>([]);
  return (
    <div className="w-full sm:max-w-72">
      <MultiSelectDropdown
        aria-label="Fruits"
        options={staticOptions}
        value={purpleThemeValue}
        onValueChange={(values) => setPurpleThemeValue(values)}
        placeholder="Select fruits..."
        maxVisible={2}
        classes={
          {
                        ...({
            trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
            content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
            label: "block text-sm font-medium mb-1 text-cl-text-secondary",
            description: "text-xs mb-1 text-cl-text-secondary",
            chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
            chipRemoveTrigger: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
          }),
                        trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-cl-accent min-h-[42px] border-cl-border-input-focus bg-cl-accent/10 text-cl-text hover:border-cl-border-input-focus",
                        value:
                          "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                        content: "rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-accent)_10%,var(--color-cl-bg-elevated))] border border-cl-border-input-focus",
                        item: "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-accent-hover hover:bg-cl-accent/10",
                        icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent",
                        itemControl: "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input-focus",
                        chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text",
                        chipRemoveTrigger: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent",
                        count: "inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-accent/10 text-cl-text",
                        label: "block text-sm font-medium mb-1 text-cl-accent",
                        message: "text-sm mt-1 text-cl-accent"
                      }
        }
      />
    </div>
  );
}
