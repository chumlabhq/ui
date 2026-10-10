"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
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
  const [formIntegrationValue, setFormIntegrationValue] = useState<string[]>(
    [],
  );
  const [formSubmit, setFormSubmit] = useState("not fired yet");
  return (
    <>
      <form
        onSubmit={
          (e) => {
            e.preventDefault();
            setFormSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
          }
        }
        className="flex items-end gap-4"
      >
        <div className="w-full sm:max-w-72">
          <MultiSelectDropdown
            name="fruits"
            label="Fruits (in form)"
            options={staticOptions}
            value={formIntegrationValue}
            onValueChange={setFormIntegrationValue}
            placeholder="Select fruits..."
            maxVisible={2}
            classes={
              {
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                description: "text-xs mb-1 text-cl-text-secondary",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
              }
            }
          />
        </div>
        <Button
          type="submit"
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer"
        >
          Submit
        </Button>
      </form>
      <div
        className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        onSubmit:
        {formSubmit}
      </div>
    </>
  );
}
