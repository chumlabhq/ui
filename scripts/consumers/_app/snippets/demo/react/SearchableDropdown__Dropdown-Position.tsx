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
  const [posTopValue, setPosTopValue] = useState<string | null>(null);
  const [posBotValue, setPosBotValue] = useState<string | null>(null);
  const [forceBotValue, setForceBotValue] = useState<string | null>(null);
  const [forceTopValue, setForceTopValue] = useState<string | null>(null);
  const [forceLockValue, setForceLockValue] = useState<string | null>(null);
  return (
    <>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              label="Fruit"
              options={fruitOptions}
              value={posBotValue}
              onValueChange={(v) => setPosBotValue(v)}
              dropdownSide="bottom"
              placeholder="Opens below..."
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
        </div>
        <div>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              label="Fruit"
              options={fruitOptions}
              value={posTopValue}
              onValueChange={(v) => setPosTopValue(v)}
              dropdownSide="top"
              placeholder="Opens above..."
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
        </div>
      </div>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              label="Fruit"
              options={fruitOptions}
              value={forceBotValue}
              onValueChange={(v) => setForceBotValue(v)}
              dropdownSide="bottom"
              forceDropdownSide
              placeholder="Always opens below..."
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
        </div>
        <div>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              label="Fruit"
              options={fruitOptions}
              value={forceTopValue}
              onValueChange={(v) => setForceTopValue(v)}
              dropdownSide="top"
              forceDropdownSide
              placeholder="Always opens above..."
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
        </div>
      </div>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              label="Fruit"
              options={fruitOptions}
              value={forceLockValue}
              onValueChange={(v) => setForceLockValue(v)}
              dropdownSide="bottom"
              forceDropdownSide
              lockScroll
              placeholder="Forced bottom + scroll locked"
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
        </div>
      </div>
    </>
  );
}
