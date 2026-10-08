"use client";

import { useState } from "react";
import { CountryFlag } from "@chumlab/ui/country-flag";
import { SearchableDropdown, SearchableDropdownOption } from "@chumlab/ui/searchable-dropdown";

const countryOptions: SearchableDropdownOption[] = [
  {
    value: "us",
    label: "United States",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="US" size="md" className="rounded-cl-sm" />
        United States
      </span>
    ),
  },
  {
    value: "gb",
    label: "United Kingdom",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="GB" size="md" className="rounded-cl-sm" />
        United Kingdom
      </span>
    ),
  },
  {
    value: "ca",
    label: "Canada",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="CA" size="md" className="rounded-cl-sm" />
        Canada
      </span>
    ),
  },
  {
    value: "au",
    label: "Australia",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="AU" size="md" className="rounded-cl-sm" />
        Australia
      </span>
    ),
  },
  {
    value: "de",
    label: "Germany",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="DE" size="md" className="rounded-cl-sm" />
        Germany
      </span>
    ),
  },
  {
    value: "fr",
    label: "France",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="FR" size="md" className="rounded-cl-sm" />
        France
      </span>
    ),
  },
  {
    value: "jp",
    label: "Japan",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="JP" size="md" className="rounded-cl-sm" />
        Japan
      </span>
    ),
  },
];

export default function SearchableDropdownExample() {
  const [countryValue, setCountryValue] = useState<string | null>(null);
  return (
    <div className="w-full sm:max-w-64">
      <SearchableDropdown
        options={countryOptions}
        value={countryValue}
        onValueChange={(v) => setCountryValue(v)}
        placeholder="Search countries..."
        classes={
          {
            trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2",
            content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border dark:border",
            searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-recessed dark:border",
            searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
            label: "block text-sm font-medium mb-1 text-cl-text-secondary"
          }
        }
      />
    </div>
  );
}
