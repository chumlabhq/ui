"use client";

import { useState } from "react";
import { SearchableDropdown, SearchableDropdownOption } from "@chumlab/ui/searchable-dropdown";

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
    width={16}
    height={16}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

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
  const [customSelectedValue, setCustomSelectedValue] = useState<string | null>(
    null,
  );
  const [noIconValue, setNoIconValue] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap gap-8">
      <div className="w-full sm:max-w-64">
        <SearchableDropdown
          label="Fruit"
          options={fruitOptions}
          value={customSelectedValue}
          onValueChange={(v) => setCustomSelectedValue(v)}
          placeholder="Search with star..."
          selectedIcon={<StarIcon className="w-4 h-4 shrink-0 text-cl-text" />}
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
      <div className="w-full sm:max-w-64">
        <SearchableDropdown
          label="Fruit"
          options={fruitOptions}
          value={noIconValue}
          onValueChange={(v) => setNoIconValue(v)}
          placeholder="No selected indicator..."
          showSelectedIcon={false}
          classes={
            {
                            ...({
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
              searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-recessed",
              searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            })
                          }
          }
        />
      </div>
    </div>
  );
}
