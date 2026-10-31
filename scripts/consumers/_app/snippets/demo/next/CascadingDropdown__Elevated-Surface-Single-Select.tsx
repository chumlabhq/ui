"use client";

import { useState } from "react";
import { CascadingDropdown, CascadingDropdownClasses, CascadingOption, CascadingValue } from "@chumlab/ui/cascading-dropdown";

const themedSurfaceClasses: CascadingDropdownClasses = {
    trigger:
      "flex items-center justify-between gap-2 w-full px-3 py-2 text-start border border-cl-border rounded-cl-md bg-cl-bg-elevated text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent",
    content: "bg-cl-bg-elevated border border-cl-border rounded-cl-md shadow-cl-md overflow-visible",
    item:
      "flex items-center justify-between px-3 py-2 cursor-pointer text-cl-text hover:bg-cl-bg-hover data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
    subContent:
      "min-w-[180px] bg-cl-bg-elevated border border-cl-border rounded-cl-md shadow-cl-md ms-1",
    subItem:
      "flex items-center gap-2 px-3 py-2 cursor-pointer text-cl-text hover:bg-cl-bg-hover data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
    icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
    itemIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
    itemIndicator: "w-4 h-4 shrink-0 text-cl-on-accent",
    itemControl:
      "w-4 h-4 shrink-0 border border-cl-border-input rounded-cl-sm flex items-center justify-center",
    empty: "px-3 py-4 text-sm text-cl-text-tertiary text-center",
  };

const darkOnlyClasses = themedSurfaceClasses;

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
  const [darkThemeValue, setDarkThemeValue] = useState<CascadingValue>({});
  return (
    <div className="w-full sm:max-w-72">
      <CascadingDropdown
        options={categoryOptions}
        value={darkThemeValue}
        onValueChange={(val) => setDarkThemeValue(val)}
        placeholder="Select category..."
        classes={darkOnlyClasses}
      />
    </div>
  );
}
