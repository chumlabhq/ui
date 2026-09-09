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
  const [customSelectedValue, setCustomSelectedValue] = useState<string | null>(
    null,
  );
  const [customIconValue, setCustomIconValue] = useState<string | null>(null);
  const [noIconValue, setNoIconValue] = useState<string | null>(null);
  return (
    <>
      <div>
        <div className="w-full sm:max-w-64">
          <Dropdown
            options={fruitOptions}
            value={customSelectedValue}
            onValueChange={(v) => setCustomSelectedValue(v)}
            placeholder="Select a fruit..."
            classes={
              {
                              ...({
                root: "w-full",
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary"
              }),
                              itemIndicator: "text-cl-success"
                            }
            }
          />
        </div>
      </div>
      <div>
        <div className="w-full sm:max-w-64">
          <Dropdown
            options={fruitOptions}
            value={customIconValue}
            onValueChange={(v) => setCustomIconValue(v)}
            placeholder="Select a fruit..."
            selectedIcon={
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 shrink-0 text-cl-warning"
                aria-hidden="true"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            }
            classes={
              {
                root: "w-full",
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
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
            placeholder="Select a fruit..."
            selectedIcon={
              <span
                className="w-2 h-2 rounded-full shrink-0 bg-cl-accent dark:bg-cl-accent/90"
              />
            }
            classes={
              {
                root: "w-full",
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
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
            value={noIconValue}
            onValueChange={(v) => setNoIconValue(v)}
            placeholder="Select a fruit..."
            showSelectedIcon={false}
            classes={
              {
                              ...({
                root: "w-full",
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary"
              })
                            }
            }
          />
        </div>
      </div>
    </>
  );
}
