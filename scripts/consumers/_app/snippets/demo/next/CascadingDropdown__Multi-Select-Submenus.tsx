"use client";

import { useState } from "react";
import { CascadingDropdown, CascadingOption, CascadingValue } from "@chumlab/ui/cascading-dropdown";

const filterOptions: CascadingOption[] = [
  {
    value: "color",
    label: "Color",
    selectionMode: "multi",
    children: [
      { value: "red", label: "Red" },
      { value: "blue", label: "Blue" },
      { value: "green", label: "Green" },
      { value: "black", label: "Black" },
      { value: "white", label: "White" },
    ],
  },
  {
    value: "size",
    label: "Size",
    selectionMode: "multi",
    children: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
    ],
  },
  {
    value: "brand",
    label: "Brand",
    selectionMode: "multi",
    children: [
      { value: "nike", label: "Nike" },
      { value: "adidas", label: "Adidas" },
      { value: "puma", label: "Puma" },
      { value: "reebok", label: "Reebok" },
    ],
  },
];

export default function CascadingDropdownExample() {
  const [multiValue, setMultiValue] = useState<CascadingValue>({});
  return (
    <div className="w-full sm:max-w-72">
      <CascadingDropdown
        options={filterOptions}
        value={multiValue}
        onValueChange={(val) => setMultiValue(val)}
        placeholder="Select filters..."
        closeOnSelect={false}
        classes={
          {
             root: "",
             control: "",
          trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
          content: "rounded-cl-md shadow-lg overflow-visible bg-cl-bg-panel border border-cl-border",
             item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[highlighted]:bg-cl-bg-hover data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text first:rounded-t-cl-md last:rounded-b-cl-md",
          subContent: "min-w-[180px] rounded-cl-md shadow-lg ms-1 bg-cl-bg-panel border border-cl-border",
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
           }
        }
      />
    </div>
  );
}
