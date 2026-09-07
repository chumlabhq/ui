import { useState } from "react";
import { SearchableDropdown } from "@chumlab/ui/searchable-dropdown";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

export default function Example() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <SearchableDropdown
      options={options}
      value={value}
      onValueChange={(v) => setValue(v)}
      placeholder="Search fruits..."
    />
  );
}
