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
  const [posBotValue, setPosBotValue] = useState<string[]>([]);
  const [posTopValue, setPosTopValue] = useState<string[]>([]);
  const [forceBotValue, setForceBotValue] = useState<string[]>([]);
  const [forceTopValue, setForceTopValue] = useState<string[]>([]);
  const [forceLockValue, setForceLockValue] = useState<string[]>([]);
  return (
    <>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-64">
            <MultiSelectSearchableDropdown
              label="Fruits"
              options={staticOptions}
              value={posBotValue}
              onValueChange={setPosBotValue}
              dropdownSide="bottom"
              placeholder="Opens below..."
              classes={
                {
                  root: "",
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                  searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-elevated",
                  searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                  loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                  chipRemoveTrigger: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
                }
              }
            />
          </div>
        </div>
        <div>
          <div className="w-full sm:max-w-64">
            <MultiSelectSearchableDropdown
              label="Fruits"
              options={staticOptions}
              value={posTopValue}
              onValueChange={setPosTopValue}
              dropdownSide="top"
              placeholder="Opens above..."
              classes={
                {
                  root: "",
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                  searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-elevated",
                  searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                  loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                  chipRemoveTrigger: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
                }
              }
            />
          </div>
        </div>
      </div>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-64">
            <MultiSelectSearchableDropdown
              label="Fruits"
              options={staticOptions}
              value={forceBotValue}
              onValueChange={setForceBotValue}
              dropdownSide="bottom"
              forceDropdownSide
              placeholder="Always opens below..."
              classes={
                {
                  root: "",
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                  searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-elevated",
                  searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                  loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                  chipRemoveTrigger: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
                }
              }
            />
          </div>
        </div>
        <div>
          <div className="w-full sm:max-w-64">
            <MultiSelectSearchableDropdown
              label="Fruits"
              options={staticOptions}
              value={forceTopValue}
              onValueChange={setForceTopValue}
              dropdownSide="top"
              forceDropdownSide
              placeholder="Always opens above..."
              classes={
                {
                  root: "",
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                  searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-elevated",
                  searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                  loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                  chipRemoveTrigger: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
                }
              }
            />
          </div>
        </div>
      </div>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-64">
            <MultiSelectSearchableDropdown
              label="Fruits"
              options={staticOptions}
              value={forceLockValue}
              onValueChange={setForceLockValue}
              dropdownSide="bottom"
              forceDropdownSide
              lockScroll
              placeholder="Forced bottom + scroll locked"
              classes={
                {
                  root: "",
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                  searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-elevated",
                  searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                  loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                  chipRemoveTrigger: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
                }
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
