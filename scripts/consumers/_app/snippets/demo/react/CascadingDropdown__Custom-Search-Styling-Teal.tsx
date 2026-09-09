import { useState } from "react";
import { CascadingDropdown, CascadingOption, CascadingValue } from "@chumlab/ui/cascading-dropdown";

const searchableCategoryOptions: CascadingOption[] = [
  {
    value: "electronics",
    label: "Electronics",
    selectionMode: "single" as const,
    children: [
      { value: "smartphones", label: "Smartphones" },
      { value: "laptops", label: "Laptops" },
      { value: "tablets", label: "Tablets" },
      { value: "headphones", label: "Headphones" },
      { value: "cameras", label: "Cameras" },
      { value: "speakers", label: "Speakers" },
      { value: "monitors", label: "Monitors" },
      { value: "keyboards", label: "Keyboards" },
      { value: "mice", label: "Mice" },
      { value: "printers", label: "Printers" },
    ],
  },
  {
    value: "clothing",
    label: "Clothing",
    selectionMode: "multi" as const,
    children: [
      { value: "shirts", label: "Shirts" },
      { value: "pants", label: "Pants" },
      { value: "dresses", label: "Dresses" },
      { value: "jackets", label: "Jackets" },
      { value: "shoes", label: "Shoes" },
      { value: "hats", label: "Hats" },
      { value: "socks", label: "Socks" },
      { value: "scarves", label: "Scarves" },
      { value: "belts", label: "Belts" },
      { value: "gloves", label: "Gloves" },
    ],
  },
  {
    value: "home",
    label: "Home & Garden",
    selectionMode: "single" as const,
    children: [
      { value: "furniture", label: "Furniture" },
      { value: "lighting", label: "Lighting" },
      { value: "rugs", label: "Rugs" },
      { value: "curtains", label: "Curtains" },
      { value: "bedding", label: "Bedding" },
      { value: "kitchenware", label: "Kitchenware" },
      { value: "gardening", label: "Gardening Tools" },
      { value: "plants", label: "Plants" },
    ],
  },
  {
    value: "sports",
    label: "Sports & Outdoors",
    selectionMode: "multi" as const,
    children: [
      { value: "running", label: "Running" },
      { value: "cycling", label: "Cycling" },
      { value: "swimming", label: "Swimming" },
      { value: "yoga", label: "Yoga" },
      { value: "camping", label: "Camping" },
      { value: "hiking", label: "Hiking" },
      { value: "fishing", label: "Fishing" },
      { value: "basketball", label: "Basketball" },
    ],
  },
  {
    value: "books",
    label: "Books",
    selectionMode: "single" as const,
    children: [
      { value: "fiction", label: "Fiction" },
      { value: "non-fiction", label: "Non-Fiction" },
      { value: "science", label: "Science" },
      { value: "history", label: "History" },
      { value: "biography", label: "Biography" },
      { value: "poetry", label: "Poetry" },
      { value: "comics", label: "Comics & Manga" },
    ],
  },
];

export default function CascadingDropdownExample() {
  const [styledSearchValue1, setStyledSearchValue1] = useState<CascadingValue>({});
  return (
    <div className="w-full sm:max-w-96">
      <CascadingDropdown
        options={searchableCategoryOptions}
        value={styledSearchValue1}
        onValueChange={(val) => setStyledSearchValue1(val)}
        placeholder="Teal search theme..."
        showMenuSearch
        showSubmenuSearch
        menuSearchPlaceholder="Search categories..."
        submenuSearchPlaceholder="Filter items..."
        SearchIcon={
          ({ className }) => (
            <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          )
        }
        classes={
          {
            searchControl: "flex items-center gap-2 px-3 py-2.5 border-b-2 border border-cl-border-input-focus bg-cl-accent/30 dark:border dark:border-cl-border-input-focus dark:bg-cl-bg-elevated/50",
            searchInput: "flex-1 bg-transparent text-sm focus:outline-none text-cl-text placeholder-teal-500/50 dark:text-white dark:placeholder-teal-400/60",
            searchIcon: "w-5 h-5 shrink-0 text-cl-accent dark:text-cl-accent",
            subSearchControl: "flex items-center gap-1.5 mx-2 my-1.5 px-2.5 py-1 rounded-full bg-cl-accent/10 ring-1 ring-cl-accent dark:bg-cl-accent/30 dark:ring-1 dark:ring-cl-accent/20",
            subSearchInput: "flex-1 bg-transparent text-xs focus:outline-none text-cl-accent placeholder-teal-500/60 dark:text-cl-accent dark:placeholder-teal-400/50",
            subSearchIcon: "w-3 h-3 shrink-0 text-cl-accent dark:text-cl-accent/70"
          }
        }
      />
    </div>
  );
}
