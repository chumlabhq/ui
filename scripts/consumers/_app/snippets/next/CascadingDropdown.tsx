"use client";

import { CascadingDropdown } from "@chumlab/ui/cascading-dropdown";
import type { CascadingOption, CascadingValue } from "@chumlab/ui/cascading-dropdown";
import { useState } from "react";

const options: CascadingOption[] = [
  {
    value: "electronics",
    label: "Electronics",
    children: [
      { value: "phones", label: "Phones" },
      { value: "laptops", label: "Laptops" },
    ],
  },
  {
    value: "clothing",
    label: "Clothing",
    children: [
      { value: "shirts", label: "Shirts" },
      { value: "pants", label: "Pants" },
    ],
  },
];

export default function Example() {
  const [value, setValue] = useState<CascadingValue>({});
  return (
    <CascadingDropdown
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select category..."
    />
  );
}
