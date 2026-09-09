import { useState } from "react";
import { Dropdown, DropdownOption } from "@chumlab/ui/dropdown";

const disabledItemOptions: DropdownOption[] = [
  { value: "option1", label: "Available Option 1" },
  { value: "option2", label: "Disabled Option", disabled: true },
  { value: "option3", label: "Available Option 2" },
  { value: "option4", label: "Disabled Option 2", disabled: true },
  { value: "option5", label: "Available Option 3" },
];

export default function DropdownExample() {
  const [disabledItemValue, setDisabledItemValue] = useState<string | null>(
    null,
  );
  return (
    <div className="w-full sm:max-w-64">
      <Dropdown
        options={disabledItemOptions}
        value={disabledItemValue}
        onValueChange={(v) => setDisabledItemValue(v)}
        placeholder="Select an option..."
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
  );
}
