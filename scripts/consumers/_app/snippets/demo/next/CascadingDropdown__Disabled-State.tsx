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
  const [disabledDropdownValue] = useState<CascadingValue>({
    electronics: "phones",
  });
  return (
    <div className="w-full sm:max-w-72">
      <CascadingDropdown
        options={categoryOptions}
        value={disabledDropdownValue}
        disabled
        placeholder="Select category..."
        classes={
          {
                         ...({
             root: "",
             control: "",
          trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
          content: "rounded-cl-md shadow-lg overflow-visible bg-cl-bg-panel border border-cl-border",
             item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[highlighted]:bg-cl-bg-hover data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text first:rounded-t-cl-md last:rounded-b-cl-md",
          subContent: "min-w-[180px] rounded-cl-md shadow-lg ml-1 bg-cl-bg-panel border border-cl-border",
             subPositioner: "",
             subItem: "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[highlighted]:bg-cl-bg-hover data-[selected]:bg-cl-accent/10 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text first:rounded-t-cl-md last:rounded-b-cl-md",
             label: "block text-sm font-medium mb-1 text-cl-text-secondary",
             message: "text-sm mt-1 text-cl-error data-[valid]:text-cl-success",
             icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-secondary",
             itemIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
             itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
             itemControl: "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input",
             empty: "px-3 py-4 text-sm text-center text-cl-text-secondary",
             loading: "px-3 py-4 text-sm text-center text-cl-text-secondary"
           }),
                         trigger: `${"flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success"} opacity-50 cursor-not-allowed`
                       }
        }
      />
    </div>
  );
}
