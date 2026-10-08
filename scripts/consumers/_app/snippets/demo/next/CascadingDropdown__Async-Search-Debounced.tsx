"use client";

import { useState } from "react";
import { CascadingDropdown, CascadingOption, CascadingValue } from "@chumlab/ui/cascading-dropdown";
import { CountryFlag } from "@chumlab/ui/country-flag";

const LATENCY_MS = 400;

const withLatency = (value: Country[]): Promise<Country[]> =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));

const searchCountries = (query: string): Promise<Country[]> => {
  const q = query.trim().toLowerCase();
  return withLatency(q ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q)) : []);
};

const fetchCountriesByRegion = (region: string): Promise<Country[]> =>
  withLatency(COUNTRIES.filter((c) => c.region.toLowerCase() === region.toLowerCase()));

const asyncSearchCountries = async (
  query: string,
  parent: CascadingOption,
): Promise<CascadingOption[]> => {
  const data = await fetchCountriesByRegion(parent.value);
  const q = query.toLowerCase();
  return data
    .filter((c) => c.name.toLowerCase().includes(q))
    .map((country) => ({
      value: country.code,
      label: country.name,
      content: (
        <span className="flex items-center gap-2">
          {/* CountryFlag draws the flag from the ISO alpha-2 code. */}
          <CountryFlag
            code={country.code}
            size="md"
            alt={`${country.name} flag`}
            className="rounded-cl-sm"
          />
          <span className="truncate">{country.name}</span>
        </span>
      ),
    }));
};

const asyncSearchRegions = async (
  query: string,
): Promise<CascadingOption[]> => {
  const data = await searchCountries(query);
  const regionSet = new Set(data.map((c) => c.region).filter(Boolean));
  return Array.from(regionSet)
    .sort()
    .map((r) => ({
      value: r,
      label: `${r} (${data.filter((c) => c.region === r).length} matches)`,
      hasChildren: true,
      selectionMode: "multi" as const,
    }));
};

const loadCountriesForRegion = async (
  parent: CascadingOption,
): Promise<CascadingOption[]> => {
  const data = await fetchCountriesByRegion(parent.value);

  return data
    .map((country) => ({
      value: country.code,
      label: country.name,
      content: (
        <span className="flex items-center gap-2">
          {/* CountryFlag draws the flag from the ISO alpha-2 code. */}
          <CountryFlag
            code={country.code}
            size="md"
            alt={`${country.name} flag`}
            className="rounded-cl-sm"
          />
          <span className="truncate">{country.name}</span>
        </span>
      ),
    }));
};

const regionOptionsMulti: CascadingOption[] = [
  {
    value: "Africa",
    label: "Africa",
    hasChildren: true,
    selectionMode: "multi",
  },
  {
    value: "Americas",
    label: "Americas",
    hasChildren: true,
    selectionMode: "multi",
  },
  { value: "Asia", label: "Asia", hasChildren: true, selectionMode: "multi" },
  {
    value: "Europe",
    label: "Europe",
    hasChildren: true,
    selectionMode: "multi",
  },
  {
    value: "Oceania",
    label: "Oceania",
    hasChildren: true,
    selectionMode: "multi",
  },
];

interface Country {
  name: string;
  /** ISO 3166-1 alpha-2, which CountryFlag takes. */
  code: string;
  capital: string;
  region: string;
}

const COUNTRIES: Country[] = [
  { name: "Egypt", code: "EG", capital: "Cairo", region: "Africa" },
  { name: "Ghana", code: "GH", capital: "Accra", region: "Africa" },
  { name: "Kenya", code: "KE", capital: "Nairobi", region: "Africa" },
  { name: "Morocco", code: "MA", capital: "Rabat", region: "Africa" },
  { name: "Nigeria", code: "NG", capital: "Abuja", region: "Africa" },
  { name: "South Africa", code: "ZA", capital: "Pretoria", region: "Africa" },
  { name: "Argentina", code: "AR", capital: "Buenos Aires", region: "Americas" },
  { name: "Brazil", code: "BR", capital: "Brasília", region: "Americas" },
  { name: "Canada", code: "CA", capital: "Ottawa", region: "Americas" },
  { name: "Chile", code: "CL", capital: "Santiago", region: "Americas" },
  { name: "Colombia", code: "CO", capital: "Bogotá", region: "Americas" },
  { name: "Mexico", code: "MX", capital: "Mexico City", region: "Americas" },
  { name: "United States", code: "US", capital: "Washington, D.C.", region: "Americas" },
  { name: "China", code: "CN", capital: "Beijing", region: "Asia" },
  { name: "India", code: "IN", capital: "New Delhi", region: "Asia" },
  { name: "Indonesia", code: "ID", capital: "Jakarta", region: "Asia" },
  { name: "Japan", code: "JP", capital: "Tokyo", region: "Asia" },
  { name: "Singapore", code: "SG", capital: "Singapore", region: "Asia" },
  { name: "South Korea", code: "KR", capital: "Seoul", region: "Asia" },
  { name: "Vietnam", code: "VN", capital: "Hanoi", region: "Asia" },
  { name: "France", code: "FR", capital: "Paris", region: "Europe" },
  { name: "Germany", code: "DE", capital: "Berlin", region: "Europe" },
  { name: "Ireland", code: "IE", capital: "Dublin", region: "Europe" },
  { name: "Italy", code: "IT", capital: "Rome", region: "Europe" },
  { name: "Netherlands", code: "NL", capital: "Amsterdam", region: "Europe" },
  { name: "Spain", code: "ES", capital: "Madrid", region: "Europe" },
  { name: "Sweden", code: "SE", capital: "Stockholm", region: "Europe" },
  { name: "United Kingdom", code: "GB", capital: "London", region: "Europe" },
  { name: "Australia", code: "AU", capital: "Canberra", region: "Oceania" },
  { name: "Fiji", code: "FJ", capital: "Suva", region: "Oceania" },
  { name: "New Zealand", code: "NZ", capital: "Wellington", region: "Oceania" },
  { name: "Papua New Guinea", code: "PG", capital: "Port Moresby", region: "Oceania" },
];

export default function CascadingDropdownExample() {
  const [asyncSearchValue, setAsyncSearchValue] = useState<CascadingValue>({});
  return (
    <div className="w-full sm:max-w-96">
      <CascadingDropdown
        options={regionOptionsMulti}
        value={asyncSearchValue}
        onValueChange={(val) => setAsyncSearchValue(val)}
        onLoadChildren={loadCountriesForRegion}
        placeholder="Search regions & countries..."
        showMenuSearch
        showSubmenuSearch
        menuSearchPlaceholder="Search regions..."
        submenuSearchPlaceholder="Search countries..."
        onMenuSearch={asyncSearchRegions}
        onSubmenuSearch={asyncSearchCountries}
        searchDebounceMs={300}
      />
    </div>
  );
}
