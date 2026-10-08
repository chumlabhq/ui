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
  const [posBotValue, setPosBotValue] = useState<string[]>([]);
  const [posTopValue, setPosTopValue] = useState<string[]>([]);
  const [forceBotValue, setForceBotValue] = useState<string[]>([]);
  const [forceTopValue, setForceTopValue] = useState<string[]>([]);
  const [forceLockValue, setForceLockValue] = useState<string[]>([]);
  return (
    <>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={posBotValue}
              onValueChange={setPosBotValue}
              dropdownPosition="bottom"
              placeholder="Opens below..."
              maxDisplayedChips={2}
              classes={
                {
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border dark:border",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                  description: "text-xs mb-1 text-cl-text-secondary",
                  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10",
                  chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
                }
              }
            />
          </div>
        </div>
        <div>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={posTopValue}
              onValueChange={setPosTopValue}
              dropdownPosition="top"
              placeholder="Opens above..."
              maxDisplayedChips={2}
              classes={
                {
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border dark:border",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                  description: "text-xs mb-1 text-cl-text-secondary",
                  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10",
                  chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
                }
              }
            />
          </div>
        </div>
      </div>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-64">
            <MultiSelectDropdown
              options={staticOptions}
              value={forceBotValue}
              onValueChange={setForceBotValue}
              dropdownPosition="bottom"
              forceDropdownPosition
              placeholder="Always opens below..."
              classes={
                {
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border dark:border",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                  description: "text-xs mb-1 text-cl-text-secondary",
                  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10",
                  chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
                }
              }
            />
          </div>
        </div>
        <div>
          <div className="w-full sm:max-w-64">
            <MultiSelectDropdown
              options={staticOptions}
              value={forceTopValue}
              onValueChange={setForceTopValue}
              dropdownPosition="top"
              forceDropdownPosition
              placeholder="Always opens above..."
              classes={
                {
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border dark:border",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                  description: "text-xs mb-1 text-cl-text-secondary",
                  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10",
                  chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
                }
              }
            />
          </div>
        </div>
      </div>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-64">
            <MultiSelectDropdown
              options={staticOptions}
              value={forceLockValue}
              onValueChange={setForceLockValue}
              dropdownPosition="bottom"
              forceDropdownPosition
              lockScroll
              placeholder="Forced bottom + scroll locked"
              classes={
                {
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border dark:border",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                  description: "text-xs mb-1 text-cl-text-secondary",
                  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10",
                  chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
                }
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
