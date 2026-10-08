import { useCallback, useState } from "react";
import { CascadingDropdown, CascadingOption, CascadingValue } from "@chumlab/ui/cascading-dropdown";
import { CountryFlag } from "@chumlab/ui/country-flag";

const LATENCY_MS = 400;

const withLatency = (value: Country[]): Promise<Country[]> =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));

const fetchCountriesByRegion = (region: string): Promise<Country[]> =>
  withLatency(COUNTRIES.filter((c) => c.region.toLowerCase() === region.toLowerCase()));

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
  const [prefetchOptions, setPrefetchOptions] = useState<CascadingOption[]>([]);
  const [prefetchValue, setPrefetchValue] = useState<CascadingValue>({});
  const [isPrefetchLoading, setIsPrefetchLoading] = useState(true);
  const [hasPrefetchLoaded, setHasPrefetchLoaded] = useState(false);
  const handleLoadChildrenAsync = useCallback(
    async (parent: CascadingOption) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return loadCountriesForRegion(parent);
    },
    [],
  );
  return (
    <>
      <div className="w-full sm:max-w-96">
        <CascadingDropdown
          options={prefetchOptions}
          value={prefetchValue}
          onValueChange={(val) => setPrefetchValue(val)}
          onLoadChildren={handleLoadChildrenAsync}
          placeholder="Select region and country..."
          loading={isPrefetchLoading}
          loadingText="Loading regions..."
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
             }),
                           subContent: `${"min-w-[180px] rounded-cl-md shadow-lg ml-1 bg-cl-bg-panel border border-cl-border dark:border"} max-h-64 overflow-y-auto`
                         }
          }
        />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-cl-text-secondary">
          Main menu:
          {" "}
          {
            isPrefetchLoading
            ? "Loading..."
            : hasPrefetchLoaded
              ? `${prefetchOptions.length} regions loaded`
              : "Failed to load"
          }
        </span>
      </div>
      {
        Object.keys(prefetchValue).length > 0 && (
          <div
            className="mt-3 p-3 rounded-cl-md w-full bg-cl-bg-hover dark:bg-cl-bg-elevated dark:border dark:border-cl-border"
          >
            <p className="text-xs font-medium mb-1 text-cl-text-secondary">Selected Value:</p>
            <pre className="text-xs overflow-x-auto text-cl-text-chrome">
              {JSON.stringify(prefetchValue, null, 2)}
            </pre>
          </div>
        )
      }
    </>
  );
}
