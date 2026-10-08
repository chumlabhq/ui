import { useState } from "react";
import { SearchableDropdown, SearchableDropdownOption } from "@chumlab/ui/searchable-dropdown";

const fruitOptions: SearchableDropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
  { value: "kiwi", label: "Kiwi" },
  { value: "lemon", label: "Lemon" },
];

export default function SearchableDropdownExample() {
  const [customKeyDownValue, setCustomKeyDownValue] = useState<string | null>(
    null,
  );
  const [keyDownMessage, setKeyDownMessage] = useState<string>("");
  return (
    <>
      <div className="w-full sm:max-w-64">
        <SearchableDropdown
          options={fruitOptions}
          value={customKeyDownValue}
          onValueChange={(v) => setCustomKeyDownValue(v)}
          placeholder="Try pressing 'x'..."
          onKeyDown={
            (event) => {
              if (event.key === "x" || event.key === "X") {
                event.preventDefault();
                setKeyDownMessage(
                  "You pressed 'x' - custom handler intercepted!",
                );
                setTimeout(() => setKeyDownMessage(""), 2000);
              }
            }
          }
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border dark:border",
              searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-recessed dark:border",
              searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }
          }
        />
      </div>
      {
        keyDownMessage && (
          <p className="w-full text-sm mt-2 text-cl-success">
            {keyDownMessage}
          </p>
        )
      }
    </>
  );
}
