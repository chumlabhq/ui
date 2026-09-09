"use client";

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
  const [syncSearchValue, setSyncSearchValue] = useState<CascadingValue>({});
  return (
    <div className="w-full sm:max-w-96">
      <CascadingDropdown
        options={searchableCategoryOptions}
        value={syncSearchValue}
        onValueChange={(val) => setSyncSearchValue(val)}
        placeholder="Search categories & items..."
        showMenuSearch
        showSubmenuSearch
        menuSearchPlaceholder="Filter categories..."
        submenuSearchPlaceholder="Filter items..."
      />
    </div>
  );
}
