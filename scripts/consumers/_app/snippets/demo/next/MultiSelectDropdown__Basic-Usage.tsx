"use client";

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
  const [basicValue, setBasicValue] = useState<string[]>([]);
  return (
    <div className="w-full sm:max-w-72">
                {/* Basic usage — works out-of-the-box with built-in styles */}
                <MultiSelectDropdown
                  options={staticOptions}
                  value={basicValue}
                  onValueChange={(values) => setBasicValue(values)}
                  placeholder="Select fruits..."
                />
              </div>
  );
}
