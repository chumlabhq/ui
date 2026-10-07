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
  const [customCheckboxIconValue, setCustomCheckboxIconValue] =
    useState<CascadingValue>({});
  return (
    <div className="w-full sm:max-w-72">
      <CascadingDropdown
        options={filterOptions}
        value={customCheckboxIconValue}
        onValueChange={(val) => setCustomCheckboxIconValue(val)}
        placeholder="Select filters..."
        closeOnSelect={false}
        checkboxIcon={
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        }
        classes={
          {
                         ...({
             root: "",
             control: "",
          trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
          content: "rounded-cl-md shadow-lg overflow-visible bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
             item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-black/5 data-[highlighted]:bg-black/5 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed dark:text-cl-text dark:hover:bg-white/10 dark:data-[highlighted]:bg-white/10 dark:data-[disabled]:opacity-50 dark:data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
          subContent: "min-w-[180px] rounded-cl-md shadow-lg ml-1 bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
             subPositioner: "",
             subItem: "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-black/5 data-[highlighted]:bg-black/5 data-[selected]:bg-cl-accent/10 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed dark:text-cl-text dark:hover:bg-white/10 dark:data-[highlighted]:bg-white/10 dark:data-[selected]:bg-cl-accent/50 dark:data-[disabled]:opacity-50 dark:data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
             label: "block text-sm font-medium mb-1 text-cl-text-secondary",
             message: "text-sm mt-1 text-cl-error data-[valid]:text-cl-success",
             icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-secondary",
             itemIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
             itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
             itemControl: "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input dark:border dark:border-cl-border",
             empty: "px-3 py-4 text-sm text-center text-cl-text-secondary",
             loading: "px-3 py-4 text-sm text-center text-cl-text-secondary"
           }),
                         itemControl:
                           "w-4 h-4 shrink-0 border border-cl-warning rounded flex items-center justify-center"
                       }
        }
      />
    </div>
  );
}
