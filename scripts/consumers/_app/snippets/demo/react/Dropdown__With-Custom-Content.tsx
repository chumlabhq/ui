import { useState } from "react";
import { Dropdown, DropdownOption } from "@chumlab/ui/dropdown";

const countryOptions: DropdownOption[] = [
  {
    value: "us",
    label: "United States",
    content: <span>🇺🇸 United States</span>,
  },
  {
    value: "gb",
    label: "United Kingdom",
    content: <span>🇬🇧 United Kingdom</span>,
  },
  { value: "ca", label: "Canada", content: <span>🇨🇦 Canada</span> },
  { value: "au", label: "Australia", content: <span>🇦🇺 Australia</span> },
  { value: "de", label: "Germany", content: <span>🇩🇪 Germany</span> },
  { value: "fr", label: "France", content: <span>🇫🇷 France</span> },
  { value: "jp", label: "Japan", content: <span>🇯🇵 Japan</span> },
];

export default function DropdownExample() {
  const [countryValue, setCountryValue] = useState<string | null>(null);
  return (
    <div className="w-full sm:max-w-64">
      <Dropdown
        options={countryOptions}
        value={countryValue}
        onValueChange={(v) => setCountryValue(v)}
        placeholder="Select a country..."
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
