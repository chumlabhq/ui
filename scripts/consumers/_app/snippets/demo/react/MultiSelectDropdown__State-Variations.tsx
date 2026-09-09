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
  const [stateDefaultValue, setStateDefaultValue] = useState<string[]>([]);
  const [stateSelectedValue, setStateSelectedValue] = useState<string[]>([
    "apple",
    "banana",
  ]);
  const [stateErrorValue, setStateErrorValue] = useState<string[]>([]);
  const [stateNoChipsValue, setStateNoChipsValue] = useState<string[]>([
    "apple",
    "banana",
    "cherry",
  ]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <MultiSelectDropdown
          options={staticOptions}
          value={stateDefaultValue}
          onValueChange={setStateDefaultValue}
          placeholder="Select fruits..."
          maxDisplayedChips={2}
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }
          }
        />
      </div>
      <div>
        <MultiSelectDropdown
          options={staticOptions}
          value={stateSelectedValue}
          onValueChange={setStateSelectedValue}
          placeholder="Select fruits..."
          maxDisplayedChips={2}
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }
          }
        />
      </div>
      <div>
        <MultiSelectDropdown
          options={staticOptions}
          value={["apple", "banana"]}
          onValueChange={() => {}}
          disabled
          placeholder="Select fruits..."
          maxDisplayedChips={2}
          classes={
            {
                            ...({
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }),
                            trigger: `${({
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }).trigger} opacity-50 cursor-not-allowed`
                          }
          }
        />
      </div>
      <div>
        <MultiSelectDropdown
          options={staticOptions}
          value={stateErrorValue}
          onValueChange={setStateErrorValue}
          error={stateErrorValue.length === 0}
          errorMessage="Please select at least one"
          placeholder="Select fruits..."
          classes={
            {
                            ...({
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }),
                            trigger: `${({
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }).trigger} border border-cl-error focus:ring-cl-error`
                          }
          }
        />
      </div>
      <div>
        <MultiSelectDropdown
          options={[]}
          value={[]}
          onValueChange={() => {}}
          placeholder="Loading..."
          loading
          shimmerCount={4}
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }
          }
        />
      </div>
      <div>
        <MultiSelectDropdown
          options={staticOptions}
          value={stateNoChipsValue}
          onValueChange={setStateNoChipsValue}
          placeholder="Select fruits..."
          showSelectedChips={false}
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }
          }
        />
      </div>
    </div>
  );
}
