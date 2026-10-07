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
  const [darkThemeValue, setDarkThemeValue] = useState<string[]>([]);
  return (
    <div className="w-full sm:max-w-72">
      <MultiSelectDropdown
        options={staticOptions}
        value={darkThemeValue}
        onValueChange={(values) => setDarkThemeValue(values)}
        placeholder="Select fruits..."
        maxDisplayedChips={2}
        classes={
          {
                        ...({
            trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
            content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
            label: "block text-sm font-medium mb-1 text-cl-text-secondary",
            description: "text-xs mb-1 text-cl-text-secondary",
            chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10 dark:text-cl-text",
            chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
          }),
                        trigger:
                          "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-[#2a2f3a] bg-[#0a0d12] text-white hover:bg-[#11151c] focus:outline-none focus:ring-2 focus:ring-cl-accent min-h-[42px]",
                        content:
                          "rounded-cl-md shadow-lg overflow-hidden bg-[#0a0d12] border border-[#2a2f3a]",
                        item:
                          "flex items-center gap-2 px-3 py-2 cursor-pointer text-white hover:bg-white/[0.08] transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
                        icon:
                          "w-4 h-4 shrink-0 transition-transform duration-200 text-white/60",
                        itemControl:
                          "w-4 h-4 shrink-0 border border-white/30 rounded flex items-center justify-center",
                        chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white/[0.10] text-white rounded-cl-md shrink-0 max-w-[100px]",
                        chipRemove:
                          "w-3 h-3 shrink-0 cursor-pointer text-white/70 hover:text-white",
                        count:
                          "inline-flex items-center px-2 py-0.5 text-xs bg-white/[0.10] text-white/80 rounded-cl-md shrink-0"
                      }
        }
      />
    </div>
  );
}
