"use client";

import { MultiSelectDropdown } from "@chumlab/ui/multi-select-dropdown";

export default function MultiSelectDropdownExample() {
  return (
    <div className="flex flex-wrap gap-8">
      <div className="w-full sm:max-w-72">
        <MultiSelectDropdown
          options={[]}
          value={[]}
          onValueChange={() => {}}
          placeholder="No options..."
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10 dark:text-cl-text",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }
          }
        />
      </div>
      <div className="w-full sm:max-w-72">
        <MultiSelectDropdown
          options={[]}
          value={[]}
          onValueChange={() => {}}
          placeholder="Custom empty..."
          noResultsContent={
            <span className="flex flex-col items-center gap-1 py-2">
              <span className="text-lg text-cl-text-tertiary">📭</span>
              <span className="text-sm text-cl-text-secondary">Nothing here yet</span>
            </span>
          }
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10 dark:text-cl-text",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }
          }
        />
      </div>
    </div>
  );
}
