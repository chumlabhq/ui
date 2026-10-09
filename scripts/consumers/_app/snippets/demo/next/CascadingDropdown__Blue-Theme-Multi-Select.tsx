"use client";

import { useState } from "react";
import { CascadingDropdown, CascadingDropdownClasses, CascadingOption, CascadingValue } from "@chumlab/ui/cascading-dropdown";

const getBlueClasses = (): CascadingDropdownClasses => ({
  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-cl-accent border-cl-accent bg-cl-accent/10 text-cl-text hover:bg-cl-accent/15",
  content: "rounded-cl-md shadow-cl-md bg-cl-bg-elevated border border-cl-accent",
  item: "flex items-center justify-between px-3 py-2 cursor-pointer text-cl-text hover:bg-cl-accent/10 data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
  subContent: "min-w-[180px] rounded-cl-md shadow-cl-md ml-1 max-h-[320px] overflow-y-auto bg-cl-bg-elevated border border-cl-accent",
  subItem: "flex items-center gap-2 px-3 py-2 cursor-pointer text-cl-text hover:bg-cl-accent/10 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
  icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent",
  itemIcon: "w-4 h-4 shrink-0 text-cl-accent",
  itemIndicator: "w-4 h-4 shrink-0 text-cl-on-accent",
  itemControl: "w-4 h-4 shrink-0 border rounded-cl-sm flex items-center justify-center border-cl-accent",
  empty: "px-3 py-4 text-sm text-center text-cl-text-secondary",
});

const getPurpleClasses = getBlueClasses;

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
  const [purpleThemeMultiValue, setPurpleThemeMultiValue] =
    useState<CascadingValue>({});
  return (
    <div className="w-full sm:max-w-72">
      <CascadingDropdown
        options={filterOptions}
        value={purpleThemeMultiValue}
        onValueChange={(val) => setPurpleThemeMultiValue(val)}
        placeholder="Select filters..."
        closeOnSelect={false}
        classes={getPurpleClasses()}
      />
    </div>
  );
}
