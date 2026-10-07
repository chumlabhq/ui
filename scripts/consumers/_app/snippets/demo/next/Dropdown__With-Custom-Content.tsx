"use client";

import { useState } from "react";
import { CountryFlag } from "@chumlab/ui/country-flag";
import { Dropdown, DropdownOption } from "@chumlab/ui/dropdown";

const countryOptions: DropdownOption[] = [
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

export default function DropdownExample() {
  const [countryValue, setCountryValue] = useState<string | null>(null);
  return (
    <div className="w-full sm:max-w-64">
      <Dropdown
        options={countryOptions}
        value={countryValue}
        onValueChange={(v) => setCountryValue(v)}
        placeholder="Select a country..."
        classes={
          {
            root: "w-full",
            trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
            content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
            label: "block text-sm font-medium mb-1 text-cl-text-secondary"
          }
        }
      />
    </div>
  );
}
