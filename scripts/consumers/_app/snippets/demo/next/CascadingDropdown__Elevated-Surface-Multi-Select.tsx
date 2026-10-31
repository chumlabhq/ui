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
  const [darkThemeMultiValue, setDarkThemeMultiValue] =
    useState<CascadingValue>({});
  return (
    <div className="w-full sm:max-w-72">
      <CascadingDropdown
        options={filterOptions}
        value={darkThemeMultiValue}
        onValueChange={(val) => setDarkThemeMultiValue(val)}
        placeholder="Select filters..."
        closeOnSelect={false}
        classes={darkOnlyClasses}
      />
    </div>
  );
}
