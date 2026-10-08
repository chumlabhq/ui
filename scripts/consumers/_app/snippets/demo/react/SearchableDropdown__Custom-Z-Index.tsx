import { useState } from "react";
import { SearchableDropdown, SearchableDropdownOption } from "@chumlab/ui/searchable-dropdown";

const fruitOptions: SearchableDropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
  { value: "kiwi", label: "Kiwi" },
  { value: "lemon", label: "Lemon" },
];

export default function SearchableDropdownExample() {
  const [zIndexValue, setZIndexValue] = useState<string | null>(null);
  return (
    <div className="w-full sm:max-w-64">
      <SearchableDropdown
        options={fruitOptions}
        value={zIndexValue}
        onValueChange={(v) => setZIndexValue(v)}
        dropdownZIndex={9999}
        placeholder="Search (z-index: 9999)..."
        classes={
          {
            trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
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
