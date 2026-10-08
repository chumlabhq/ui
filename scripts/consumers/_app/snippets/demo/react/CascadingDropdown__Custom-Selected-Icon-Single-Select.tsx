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
  const [customSelectedIconValue, setCustomSelectedIconValue] =
    useState<CascadingValue>({});
  return (
    <div className="w-full sm:max-w-72">
      <CascadingDropdown
        options={categoryOptions}
        value={customSelectedIconValue}
        onValueChange={(val) => setCustomSelectedIconValue(val)}
        placeholder="Select category..."
        selectedIcon={
          <svg className="w-4 h-4 text-cl-accent" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        }
        classes={
          {
                         ...({
             root: "",
             control: "",
          trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
          content: "rounded-cl-md shadow-lg overflow-visible bg-cl-bg-panel border border-cl-border dark:border",
             item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-black/5 data-[highlighted]:bg-black/5 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed dark:text-cl-text dark:hover:bg-white/10 dark:data-[highlighted]:bg-white/10 dark:data-[disabled]:opacity-50 dark:data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
          subContent: "min-w-[180px] rounded-cl-md shadow-lg ml-1 bg-cl-bg-panel border border-cl-border dark:border",
             subPositioner: "",
             subItem: "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-black/5 data-[highlighted]:bg-black/5 data-[selected]:bg-cl-accent/10 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed dark:text-cl-text dark:hover:bg-white/10 dark:data-[highlighted]:bg-white/10 dark:data-[selected]:bg-cl-accent/50 dark:data-[disabled]:opacity-50 dark:data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
             label: "block text-sm font-medium mb-1 text-cl-text-secondary",
             message: "text-sm mt-1 text-cl-error data-[valid]:text-cl-success",
             icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-secondary",
             itemIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
             itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
             itemControl: "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input",
             empty: "px-3 py-4 text-sm text-center text-cl-text-secondary",
             loading: "px-3 py-4 text-sm text-center text-cl-text-secondary"
           })
                       }
        }
      />
    </div>
  );
}
