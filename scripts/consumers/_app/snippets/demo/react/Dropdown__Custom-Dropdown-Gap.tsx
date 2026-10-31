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
  const [customGapValue, setCustomGapValue] = useState<string | null>(null);
  return (
    <div className="w-full space-y-8">
      <div>
        <p className="text-xs font-medium text-cl-text-tertiary">No gap (0px)</p>
        <div className="w-full sm:max-w-64 mt-2">
          <Dropdown
            label="Fruit"
            options={fruitOptions}
            dropdownOffset={0}
            placeholder="No gap..."
            classes={
              {
                root: "w-full",
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary"
              }
            }
          />
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-cl-text-tertiary">Large gap (16px)</p>
        <div className="w-full sm:max-w-64 mt-2">
          <Dropdown
            label="Fruit"
            options={fruitOptions}
            value={customGapValue}
            onValueChange={(v) => setCustomGapValue(v)}
            dropdownOffset={16}
            placeholder="Large gap..."
            classes={
              {
                root: "w-full",
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary"
              }
            }
          />
        </div>
      </div>
    </div>
  );
}
