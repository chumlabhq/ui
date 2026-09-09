"use client";

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
  const [basicValue, setBasicValue] = useState<string | null>(null);
  return (
    <div className="w-full sm:max-w-64">
      <SearchableDropdown
        options={fruitOptions}
        value={basicValue}
        onValueChange={(value) => setBasicValue(value)}
        placeholder="Search fruits..."
      />
    </div>
  );
}
