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
  const [renderTriggerValue, setRenderTriggerValue] = useState<string | null>(
    null,
  );
  return (
    <div className="w-full sm:max-w-72">
      <Dropdown
        options={fruitOptions}
        value={renderTriggerValue}
        onValueChange={(v) => setRenderTriggerValue(v)}
        placeholder="Pick a fruit..."
        classes={
          {
            root: "w-full",
            trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
            content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
            label: "block text-sm font-medium mb-1 text-cl-text-secondary"
          }
        }
        renderTrigger={
          (
            { ref, ...triggerProps },
            { isOpen, selectedOption, placeholder },
          ) => (
            <button
              ref={ref as React.RefCallback<HTMLButtonElement>}
              {...triggerProps}
              type="button"
              className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-cl-lg border-2 transition-all ${
                isOpen
                  ? "border-cl-border-input-focus bg-cl-bg-input text-cl-text shadow-lg shadow-accent/20"
                  : "border-cl-border-input bg-cl-bg-input text-cl-text hover:border-cl-border-input"
              } cursor-pointer`}
            >
              <span
                className={`text-xl ${selectedOption ? "" : "opacity-50"}`}
              >
                {selectedOption ? "🍎" : "🔍"}
              </span>
              <span className="flex-1 truncate font-medium">
                {selectedOption?.label ?? placeholder}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isOpen
                    ? "bg-cl-accent/10 text-cl-text"
                    : "bg-cl-bg-hover text-cl-text-secondary"
                }`}
              >
                {isOpen ? "Open" : "Closed"}
              </span>
            </button>
          )
        }
      />
    </div>
  );
}
