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
  const [basicValue, setBasicValue] = useState<string[]>([]);
  return (
    <div className="w-full sm:max-w-72">
                {/* Basic usage — works out-of-the-box with built-in styles */}
                <MultiSelectSearchableDropdown
                  options={staticOptions}
                  value={basicValue}
                  onValueChange={(values) => setBasicValue(values)}
                  placeholder="Select fruits..."
                  aria-label="Select fruits"
                />
              </div>
  );
}
