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
  const [controlledValue, setControlledValue] = useState<string[]>([]);
  const [controlledOpen, setControlledOpen] = useState(false);
  return (
    <div className="flex items-end gap-4">
      <div className="w-full sm:max-w-72">
        <MultiSelectDropdown
          options={staticOptions}
          value={controlledValue}
          onValueChange={setControlledValue}
          open={controlledOpen}
          onOpenChange={setControlledOpen}
          placeholder="Controlled dropdown..."
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
      <button
        type="button"
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated cursor-pointer"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setControlledOpen((o) => !o)}
      >
        {controlledOpen ? "Close" : "Open"}
      </button>
      {
        controlledValue.length > 0 && (
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated cursor-pointer"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setControlledValue([])}
          >
            Clear
          </button>
        )
      }
    </div>
  );
}
