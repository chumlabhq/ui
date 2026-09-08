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
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Default (bordered)</p>
                  <div className="w-full sm:max-w-72">
                    <MultiSelectSearchableDropdown
                      options={staticOptions}
                      value={variantDefaultValue}
                      onValueChange={(values) => setVariantDefaultValue(values)}
                      placeholder="Select..."
                      maxDisplayedChips={2}
                      classes={({
          root: "",
          trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
          content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
          searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-border dark:bg-cl-bg-elevated`,
          searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
          loading: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
          label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
          chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text`,
          chipRemove: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary`
        })}
                      aria-label="Default variant"
                    />
                  </div>
                </div>
      <div>
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Borderless</p>
                  <div className="w-full sm:max-w-72">
                    <MultiSelectSearchableDropdown
                      options={staticOptions}
                      value={variantBorderlessValue}
                      onValueChange={(values) => setVariantBorderlessValue(values)}
                      placeholder="Select..."
                      maxDisplayedChips={2}
                      classes={{
                        ...({
          root: "",
          trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
          content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
          searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-border dark:bg-cl-bg-elevated`,
          searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
          loading: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
          label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
          chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text`,
          chipRemove: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary`
        }),
                        trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer min-h-[42px] bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover dark:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-bg-hover`,
                        value:
                          "flex-1 flex items-center gap-1.5 flex-wrap min-w-0"
                      }}
                      aria-label="Borderless variant"
                    />
                  </div>
                </div>
      <div>
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Bottom border only</p>
                  <div className="w-full sm:max-w-72">
                    <MultiSelectSearchableDropdown
                      options={staticOptions}
                      value={variantBottomValue}
                      onValueChange={(values) => setVariantBottomValue(values)}
                      placeholder="Select..."
                      maxDisplayedChips={2}
                      classes={{
                        ...({
          root: "",
          trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
          content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
          searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-border dark:bg-cl-bg-elevated`,
          searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
          loading: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
          label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
          chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text`,
          chipRemove: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary`
        }),
                        trigger: `flex items-center gap-2 w-full px-1 py-2 text-sm border-b-2 rounded-none transition-colors cursor-pointer min-h-[42px] border border-cl-border text-cl-text hover:border-cl-border-input-focus focus-within:border-cl-border-input-focus dark:border dark:border-cl-border dark:text-cl-text dark:hover:border-cl-border-input-focus dark:focus-within:border-cl-border-input-focus`,
                        value:
                          "flex-1 flex items-center gap-1.5 flex-wrap min-w-0"
                      }}
                      aria-label="Bottom border variant"
                    />
                  </div>
                </div>
      <div>
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Ghost</p>
                  <div className="w-full sm:max-w-72">
                    <MultiSelectSearchableDropdown
                      options={staticOptions}
                      value={variantGhostValue}
                      onValueChange={(values) => setVariantGhostValue(values)}
                      placeholder="Select..."
                      maxDisplayedChips={2}
                      classes={{
                        ...({
          root: "",
          trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
          content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
          searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-border dark:bg-cl-bg-elevated`,
          searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
          loading: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
          label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
          chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text`,
          chipRemove: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary`
        }),
                        trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer min-h-[42px] text-cl-text-secondary hover:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-text/60`,
                        value:
                          "flex-1 flex items-center gap-1.5 flex-wrap min-w-0"
                      }}
                      aria-label="Ghost variant"
                    />
                  </div>
                </div>
      <div>
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Pill</p>
                  <div className="w-full sm:max-w-72">
                    <MultiSelectSearchableDropdown
                      options={staticOptions}
                      value={variantPillValue}
                      onValueChange={(values) => setVariantPillValue(values)}
                      placeholder="Select..."
                      maxDisplayedChips={2}
                      classes={{
                        ...({
          root: "",
          trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
          content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
          searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-border dark:bg-cl-bg-elevated`,
          searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
          loading: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
          label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
          chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text`,
          chipRemove: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary`
        }),
       trigger: `flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-colors cursor-pointer min-h-[42px] border border-cl-border bg-white text-cl-text hover:border-cl-border-input shadow-sm dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:border-cl-border`,
                        value:
                          "flex-1 flex items-center gap-1.5 flex-wrap min-w-0"
                      }}
                      aria-label="Pill variant"
                    />
                  </div>
                </div>
    </>
  );
}
