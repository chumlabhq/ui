import { useState } from "react";
import { SearchableDropdown, SearchableDropdownOption } from "@chumlab/ui/searchable-dropdown";

const warmTheme = {
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-cl-warning rounded-cl-md bg-cl-warning/15 text-cl-warning hover:bg-cl-warning/15 focus:outline-none focus:ring-2 focus:ring-cl-warning",
  triggerText: "flex-1 truncate",
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-cl-warning/15 border border-cl-warning",
  searchInput:
    "flex items-center gap-2 px-3 py-2 border-b border-cl-warning bg-cl-warning/15",
  searchInputElement:
    "flex-1 bg-transparent text-cl-warning placeholder:text-cl-warning focus:outline-none",
  searchIcon: "w-4 h-4 shrink-0 text-cl-warning",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-cl-warning hover:bg-cl-warning/15 transition-colors",
  optionSelected: "bg-cl-warning/15",
  optionFocused: "bg-cl-warning/15",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-warning",
  checkIcon: "w-4 h-4 shrink-0 text-cl-warning",
  noResults: "px-3 py-4 text-sm text-cl-warning text-center",
};

const darkTheme = {
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-[#2a2f3a] bg-[#0a0d12] text-white hover:bg-[#11151c] focus:outline-none focus:ring-2 focus:ring-cl-accent",
  triggerText: "flex-1 truncate",
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-[#0a0d12] border border-[#2a2f3a]",
  searchInput:
    "flex items-center gap-2 px-3 py-2 border-b border-[#2a2f3a] bg-[#0a0d12]",
  searchInputElement:
    "flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none",
  searchIcon: "w-4 h-4 shrink-0 text-white/60",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-white hover:bg-white/[0.08] transition-colors",
  optionSelected: "bg-white/[0.12] font-medium",
  optionFocused: "bg-white/[0.08]",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-white/60",
  checkIcon: "w-4 h-4 shrink-0 text-cl-accent",
  noResults: "px-3 py-4 text-sm text-white/60 text-center",
};

const fruitOptions: SearchableDropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
  { value: "kiwi", label: "Kiwi" },
  { value: "lemon", label: "Lemon" },
];

export default function SearchableDropdownExample() {
  const [darkThemeValue, setDarkThemeValue] = useState<string | null>(null);
  const [warmThemeValue, setWarmThemeValue] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap gap-8">
      <div className="w-full sm:max-w-64">
        <SearchableDropdown
          options={fruitOptions}
          value={darkThemeValue}
          onValueChange={(v) => setDarkThemeValue(v)}
          placeholder="Search fruits..."
          classes={darkTheme}
        />
      </div>
      <div className="w-full sm:max-w-64">
        <SearchableDropdown
          options={fruitOptions}
          value={warmThemeValue}
          onValueChange={(v) => setWarmThemeValue(v)}
          placeholder="Search fruits..."
          classes={warmTheme}
        />
      </div>
    </div>
  );
}
