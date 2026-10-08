"use client";

import { useCallback, useState } from "react";
import { CountryFlag } from "@chumlab/ui/country-flag";
import { Dropdown, DropdownOption } from "@chumlab/ui/dropdown";

const LATENCY_MS = 400;

const withLatency = (value: Country[]): Promise<Country[]> =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));

const fetchCountries = (): Promise<Country[]> => withLatency(COUNTRIES);

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

export default function DropdownExample() {
  const [asyncCountryValue, setAsyncCountryValue] = useState<string | null>(
    null,
  );
  const [asyncLoadError, setAsyncLoadError] = useState("no error");
  const mapCountryToOption = useCallback(
    (country: Country): DropdownOption => ({
      value: country.code,
      label: country.name,
      content: (
        <span className="flex items-center gap-2">
          <CountryFlag
            code={country.code}
            size="md"
            alt={`${country.name} flag`}
            className="rounded-cl-sm"
          />
          <span className="flex flex-col">
            <span className="text-sm">{country.name}</span>
            <span
              className={"text-xs text-cl-text-secondary"}
            >
              {country.capital || country.region}
            </span>
          </span>
        </span>
      ),
      selectedContent: (
        <span className="flex items-center gap-2">
          <CountryFlag
            code={country.code}
            size="md"
            alt={`${country.name} flag`}
            className="rounded-cl-sm"
          />
          <span>{country.name}</span>
        </span>
      ),
    }),
    [],
  );
  const handleLoadCountries = useCallback(async (): Promise<
    DropdownOption[]
  > => {
    const data = await fetchCountries();
    const codes = ["US", "GB", "DE", "FR", "JP", "CA", "AU", "IN", "BR", "IT"];
    return codes
      .map((code) => data.find((ct) => ct.code === code))
      .filter((ct): ct is Country => ct !== undefined)
      .map(mapCountryToOption);
  }, [mapCountryToOption]);
  return (
    <div className="w-full sm:max-w-80">
      <Dropdown
        value={asyncCountryValue}
        onValueChange={(v) => setAsyncCountryValue(v)}
        placeholder="Select a country..."
        onLoadOptions={handleLoadCountries}
        loadOnOpen
        shimmerCount={5}
        onLoadError={(err) => setAsyncLoadError(err instanceof Error ? err.message : String(err))}
        classes={
          {
            root: "w-full",
            trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
            content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
            label: "block text-sm font-medium mb-1 text-cl-text-secondary"
          }
        }
      />
      <div
        className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        onLoadError:
        {asyncLoadError}
      </div>
    </div>
  );
}
