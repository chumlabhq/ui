"use client";

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
  const [posBotValue, setPosBotValue] = useState<string | null>(null);
  const [posTopValue, setPosTopValue] = useState<string | null>(null);
  return (
    <div className="w-full space-y-8">
                <div>
                  
                  <div className="w-full sm:max-w-64">
                    <SearchableDropdown
                      options={fruitOptions}
                      value={posBotValue}
                      onValueChange={(v) => setPosBotValue(v)}
                      dropdownPosition="bottom"
                      placeholder="Opens below..."
                      classes={({
        trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
        content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
        searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-hover dark:border dark:border-cl-border dark:bg-cl-bg`,
        searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
        label: `block text-sm font-medium mb-1 text-cl-text-secondary`
      })}
                    />
                  </div>
                </div>
                <div>
                  
                  <div className="w-full sm:max-w-64">
                    <SearchableDropdown
                      options={fruitOptions}
                      value={posTopValue}
                      onValueChange={(v) => setPosTopValue(v)}
                      dropdownPosition="top"
                      placeholder="Opens above..."
                      classes={({
        trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
        content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
        searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-hover dark:border dark:border-cl-border dark:bg-cl-bg`,
        searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
        label: `block text-sm font-medium mb-1 text-cl-text-secondary`
      })}
                    />
                  </div>
                </div>
              </div>
  );
}
