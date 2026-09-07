import { useState } from "react";
import { Dropdown } from "@chumlab/ui/dropdown";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

export default function Example() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Dropdown
      options={options}
      value={value}
      onValueChange={(v) => setValue(v)}
      placeholder="Select a fruit..."
    />
  );
}
