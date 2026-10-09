"use client";

import { useState } from "react";
import { Dropdown, DropdownOption } from "@chumlab/ui/dropdown";

const fruitOptions: DropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
];

export default function DropdownExample() {
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
            <Dropdown
              options={fruitOptions}
              value={posBotValue}
              onValueChange={(v) => setPosBotValue(v)}
              dropdownPosition="bottom"
              placeholder="Opens below..."
              classes={
                {
                  root: "w-full",
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary"
                }
              }
            />
          </div>
        </div>
        <div>
          <div className="w-full sm:max-w-64">
            <Dropdown
              options={fruitOptions}
              value={posTopValue}
              onValueChange={(v) => setPosTopValue(v)}
              dropdownPosition="top"
              placeholder="Opens above..."
              classes={
                {
                  root: "w-full",
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
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
            <Dropdown
              options={fruitOptions}
              value={forceBotValue}
              onValueChange={(v) => setForceBotValue(v)}
              dropdownPosition="bottom"
              forceDropdownPosition
              placeholder="Always opens below..."
              classes={
                {
                  root: "w-full",
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                  label: "block text-sm font-medium mb-1 text-cl-text-secondary"
                }
              }
            />
          </div>
        </div>
        <div>
          <div className="w-full sm:max-w-64">
            <Dropdown
              options={fruitOptions}
              value={forceTopValue}
              onValueChange={(v) => setForceTopValue(v)}
              dropdownPosition="top"
              forceDropdownPosition
              placeholder="Always opens above..."
              classes={
                {
                  root: "w-full",
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
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
            <Dropdown
              options={fruitOptions}
              value={forceLockValue}
              onValueChange={(v) => setForceLockValue(v)}
              dropdownPosition="bottom"
              forceDropdownPosition
              lockScroll
              placeholder="Forced bottom + scroll locked"
              classes={
                {
                  root: "w-full",
                  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                  content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
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
