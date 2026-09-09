import { CascadingDropdown, CascadingOption } from "@chumlab/ui/cascading-dropdown";

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
  return (
    <CascadingDropdown
      options={categoryOptions}
      value={{}}
      onValueChange={() => {}}
      placeholder="Minimal..."
      showChevron={false}
      showSelectedIcon={false}
      classes={
        {
           root: "",
           control: "",
        trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
        content: "rounded-cl-md shadow-lg overflow-visible bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
           item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-black/5 data-[focused]:bg-black/5 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed dark:text-cl-text dark:hover:bg-white/10 dark:data-[focused]:bg-white/10 dark:data-[disabled]:opacity-50 dark:data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
        subContent: "min-w-[180px] rounded-cl-md shadow-lg ml-1 bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
           subPositioner: "",
           subItem: "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-black/5 data-[focused]:bg-black/5 data-[selected]:bg-cl-accent/10 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed dark:text-cl-text dark:hover:bg-white/10 dark:data-[focused]:bg-white/10 dark:data-[selected]:bg-cl-accent/50 dark:data-[disabled]:opacity-50 dark:data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
           label: "block text-sm font-medium mb-1 text-cl-text-secondary",
           message: "text-sm mt-1 text-cl-error",
           icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-secondary",
           itemIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
           itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
           itemControl: "w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input dark:border dark:border-cl-border",
           empty: "px-3 py-4 text-sm text-center text-cl-text-secondary",
           loading: "px-3 py-4 text-sm text-center text-cl-text-secondary"
         }
      }
    />
  );
}
