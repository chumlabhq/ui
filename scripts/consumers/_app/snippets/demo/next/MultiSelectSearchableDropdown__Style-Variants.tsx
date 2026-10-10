"use client";

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
  const [variantDefaultValue, setVariantDefaultValue] = useState<string[]>([]);
  const [variantBorderlessValue, setVariantBorderlessValue] = useState<
    string[]
  >([]);
  const [variantBottomValue, setVariantBottomValue] = useState<string[]>([]);
  const [variantGhostValue, setVariantGhostValue] = useState<string[]>([]);
  const [variantPillValue, setVariantPillValue] = useState<string[]>([]);
  return (
    <>
      <div>
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Default (bordered)</p>
        <div className="w-full sm:max-w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={variantDefaultValue}
            onValueChange={(values) => setVariantDefaultValue(values)}
            placeholder="Select..."
            maxVisible={2}
            classes={
              {
                root: "",
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-elevated",
                searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
              }
            }
            aria-label="Default variant"
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Borderless</p>
        <div className="w-full sm:max-w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={variantBorderlessValue}
            onValueChange={(values) => setVariantBorderlessValue(values)}
            placeholder="Select..."
            maxVisible={2}
            classes={
              {
                              ...({
                root: "",
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-elevated",
                searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
              }),
                              trigger: "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md border-0 transition-colors cursor-pointer min-h-[42px] bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover",
                              value:
                                "flex-1 flex items-center gap-1.5 flex-wrap min-w-0"
                            }
            }
            aria-label="Borderless variant"
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Bottom border only</p>
        <div className="w-full sm:max-w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={variantBottomValue}
            onValueChange={(values) => setVariantBottomValue(values)}
            placeholder="Select..."
            maxVisible={2}
            classes={
              {
                              ...({
                root: "",
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-elevated",
                searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
              }),
                              trigger: "flex items-center gap-2 w-full px-1 py-2 text-sm border-0 border-b-2 rounded-none transition-colors cursor-pointer min-h-[42px] border-cl-border text-cl-text hover:border-cl-border-input-focus focus-within:border-cl-border-input-focus",
                              value:
                                "flex-1 flex items-center gap-1.5 flex-wrap min-w-0"
                            }
            }
            aria-label="Bottom border variant"
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Ghost</p>
        <div className="w-full sm:max-w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={variantGhostValue}
            onValueChange={(values) => setVariantGhostValue(values)}
            placeholder="Select..."
            maxVisible={2}
            classes={
              {
                              ...({
                root: "",
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-elevated",
                searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
              }),
                              trigger: "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md border-0 bg-transparent transition-colors cursor-pointer min-h-[42px] text-cl-text-secondary hover:bg-cl-bg-hover",
                              value:
                                "flex-1 flex items-center gap-1.5 flex-wrap min-w-0"
                            }
            }
            aria-label="Ghost variant"
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Pill</p>
        <div className="w-full sm:max-w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={variantPillValue}
            onValueChange={(values) => setVariantPillValue(values)}
            placeholder="Select..."
            maxVisible={2}
            classes={
              {
                               ...({
                 root: "",
                 trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                 content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                 searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-elevated",
                 searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                 loading: "px-3 py-4 text-sm text-center text-cl-text-secondary",
                 label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                 chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                 chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
               }),
              trigger: "flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-colors cursor-pointer min-h-[42px] border border-cl-border bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover shadow-sm",
                               value:
                                 "flex-1 flex items-center gap-1.5 flex-wrap min-w-0"
                             }
            }
            aria-label="Pill variant"
          />
        </div>
      </div>
    </>
  );
}
