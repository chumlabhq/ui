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
          <MultiSelectDropdown
            options={staticOptions}
            value={variantDefaultValue}
            onValueChange={setVariantDefaultValue}
            placeholder="Select..."
            maxDisplayedChips={2}
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
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Borderless</p>
        <div className="w-full sm:max-w-72">
          <MultiSelectDropdown
            options={staticOptions}
            value={variantBorderlessValue}
            onValueChange={setVariantBorderlessValue}
            placeholder="Select..."
            maxDisplayedChips={2}
            classes={
              {
                              ...({
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                description: "text-xs mb-1 text-cl-text-secondary",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
              }),
                              trigger: "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md border-0 transition-colors cursor-pointer min-h-[42px] bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover",
                              value:
                                "flex-1 flex items-center gap-1 min-w-0 overflow-hidden"
                            }
            }
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Bottom border only</p>
        <div className="w-full sm:max-w-72">
          <MultiSelectDropdown
            options={staticOptions}
            value={variantBottomValue}
            onValueChange={setVariantBottomValue}
            placeholder="Select..."
            maxDisplayedChips={2}
            classes={
              {
                              ...({
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                description: "text-xs mb-1 text-cl-text-secondary",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
              }),
                              trigger: "flex items-center gap-2 w-full px-1 py-2 text-sm border-0 border-b-2 rounded-none transition-colors cursor-pointer min-h-[42px] border-cl-border text-cl-text hover:border-cl-border-input-focus focus-within:border-cl-border-input-focus",
                              value:
                                "flex-1 flex items-center gap-1 min-w-0 overflow-hidden"
                            }
            }
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Ghost</p>
        <div className="w-full sm:max-w-72">
          <MultiSelectDropdown
            options={staticOptions}
            value={variantGhostValue}
            onValueChange={setVariantGhostValue}
            placeholder="Select..."
            maxDisplayedChips={2}
            classes={
              {
                              ...({
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                description: "text-xs mb-1 text-cl-text-secondary",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
              }),
                              trigger: "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md border-0 bg-transparent transition-colors cursor-pointer min-h-[42px] text-cl-text-secondary hover:bg-cl-bg-hover",
                              value:
                                "flex-1 flex items-center gap-1 min-w-0 overflow-hidden"
                            }
            }
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Pill</p>
        <div className="w-full sm:max-w-72">
          <MultiSelectDropdown
            options={staticOptions}
            value={variantPillValue}
            onValueChange={setVariantPillValue}
            placeholder="Select..."
            maxDisplayedChips={2}
            classes={
              {
                               ...({
                 trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                 content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                 label: "block text-sm font-medium mb-1 text-cl-text-secondary",
                 description: "text-xs mb-1 text-cl-text-secondary",
                 chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text",
                 chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent"
               }),
              trigger: "flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-colors cursor-pointer min-h-[42px] border border-cl-border bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover shadow-sm",
                               value:
                                 "flex-1 flex items-center gap-1 min-w-0 overflow-hidden"
                             }
            }
          />
        </div>
      </div>
    </>
  );
}
