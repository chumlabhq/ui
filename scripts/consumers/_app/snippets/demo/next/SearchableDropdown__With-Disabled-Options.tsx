"use client";

import { useState } from "react";
import { SearchableDropdown, SearchableDropdownOption } from "@chumlab/ui/searchable-dropdown";

const disabledItemOptions: SearchableDropdownOption[] = [
  { value: "option1", label: "Available Option 1" },
  { value: "option2", label: "Disabled Option", disabled: true },
  { value: "option3", label: "Available Option 2" },
  { value: "option4", label: "Disabled Option 2", disabled: true },
  { value: "option5", label: "Available Option 3" },
];

export default function SearchableDropdownExample() {
  const [disabledItemValue, setDisabledItemValue] = useState<string | null>(
    null,
  );
  return (
    <div className="w-full sm:max-w-64">
      <SearchableDropdown
        label="Option"
        options={disabledItemOptions}
        value={disabledItemValue}
        onValueChange={(v) => setDisabledItemValue(v)}
        placeholder="Search options..."
        classes={
          {
            trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
            content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
            searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-recessed",
            searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
            label: "block text-sm font-medium mb-1 text-cl-text-secondary"
          }
        }
      />
    </div>
  );
}
