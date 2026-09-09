"use client";

import { useState } from "react";
import { CascadingDropdown, CascadingOption, CascadingValue } from "@chumlab/ui/cascading-dropdown";

const categoryOptions: CascadingOption[] = [
  {
    value: "electronics",
    label: "Electronics",
    selectionMode: "single",
    children: [
      { value: "phones", label: "Phones" },
      { value: "laptops", label: "Laptops" },
      { value: "tablets", label: "Tablets" },
      { value: "accessories", label: "Accessories" },
    ],
  },
  {
    value: "clothing",
    label: "Clothing",
    selectionMode: "single",
    children: [
      { value: "mens", label: "Men's" },
      { value: "womens", label: "Women's" },
      { value: "kids", label: "Kids" },
    ],
  },
  {
    value: "home",
    label: "Home & Garden",
    selectionMode: "single",
    children: [
      { value: "furniture", label: "Furniture" },
      { value: "decor", label: "Decor" },
      { value: "garden", label: "Garden" },
    ],
  },
];

export default function CascadingDropdownExample() {
  const [basicValue, setBasicValue] = useState<CascadingValue>({});
  return (
    <div className="w-full sm:max-w-96">
      <CascadingDropdown
        options={categoryOptions}
        value={basicValue}
        onValueChange={(val) => setBasicValue(val)}
        placeholder="Select a category..."
      />
    </div>
  );
}
