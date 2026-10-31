"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
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
  const [formSubmit, setFormSubmit] = useState("not fired yet");
  const [formIntegrationValue, setFormIntegrationValue] = useState<
    string | null
  >(null);
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
        <div className="w-full sm:max-w-64">
          <SearchableDropdown
            name="fruit"
            label="Fruit"
            options={fruitOptions}
            value={formIntegrationValue}
            onValueChange={(v) => setFormIntegrationValue(v)}
            placeholder="Search fruits..."
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
