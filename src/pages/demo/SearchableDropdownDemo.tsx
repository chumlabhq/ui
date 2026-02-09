import { useState, useCallback } from "react";
import { SearchableDropdown } from "../../components/SearchableDropdown";
import type { SearchableDropdownOption } from "../../components/SearchableDropdown";
import { Section, ComponentHeader } from "./components";

const staticOptions: SearchableDropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
];

const countryOptions: SearchableDropdownOption[] = [
  { value: "us", label: "United States", content: <span>🇺🇸 United States</span> },
  { value: "gb", label: "United Kingdom", content: <span>🇬🇧 United Kingdom</span> },
  { value: "ca", label: "Canada", content: <span>🇨🇦 Canada</span> },
  { value: "au", label: "Australia", content: <span>🇦🇺 Australia</span> },
  { value: "de", label: "Germany", content: <span>🇩🇪 Germany</span> },
  { value: "fr", label: "France", content: <span>🇫🇷 France</span> },
  { value: "jp", label: "Japan", content: <span>🇯🇵 Japan</span> },
];

interface RestCountryResponse {
  name: { common: string; official: string };
  cca2: string;
  flag: string;
  flags: { png: string; svg: string };
  capital?: string[];
  region: string;
}

const defaultClasses = {
  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  content: "absolute z-50 top-full left-0 mt-1 w-full border border-gray-200 rounded-lg shadow-lg overflow-hidden",
  searchInput: "flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50",
  searchInputElement: "bg-transparent text-gray-900 placeholder:text-gray-400",
  optionList: "max-h-60 overflow-y-auto bg-white",
  option: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  optionSelected: "bg-blue-50",
  optionFocused: "bg-gray-100",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200",
  checkIcon: "w-4 h-4 shrink-0 text-blue-600",
  searchIcon: "w-4 h-4 shrink-0 text-gray-400",
  noResults: "px-3 py-4 text-sm text-gray-500 text-center",
  loading: "px-3 py-4 text-sm text-gray-500 text-center",
  label: "block text-sm font-medium text-gray-700 mb-1",
  error: "text-sm text-red-500 mt-1",
};

const darkClasses = {
  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500",
  content: "absolute z-50 top-full left-0 mt-1 w-full border border-gray-600 rounded-lg shadow-lg overflow-hidden",
  searchInput: "flex items-center gap-2 px-3 py-2 border-b border-gray-600 bg-gray-900",
  searchInputElement: "bg-transparent text-white placeholder:text-gray-400",
  optionList: "max-h-60 overflow-y-auto bg-gray-800",
  option: "flex items-center justify-between px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  optionSelected: "bg-purple-900/50",
  optionFocused: "bg-gray-700",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200",
  checkIcon: "w-4 h-4 shrink-0 text-purple-400",
  searchIcon: "w-4 h-4 shrink-0 text-gray-400",
  noResults: "px-3 py-4 text-sm text-gray-400 text-center",
  loading: "px-3 py-4 text-sm text-gray-400 text-center",
};

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const SearchableDropdownDemo = () => {
  const [basicValue, setBasicValue] = useState<string | null>(null);
  const [countryValue, setCountryValue] = useState<string | null>(null);
  const [asyncValue, setAsyncValue] = useState<string | null>(null);
  const [asyncPrefetchValue, setAsyncPrefetchValue] = useState<string | null>(null);
  const [asyncStaticInitialValue, setAsyncStaticInitialValue] = useState<string | null>(null);
  const [disabledValue, setDisabledValue] = useState<string | null>("apple");
  const [errorValue, setErrorValue] = useState<string | null>(null);
  const [focusStyleValue, setFocusStyleValue] = useState<string | null>(null);
  const [customIconValue, setCustomIconValue] = useState<string | null>(null);
  const [customIconHeartValue, setCustomIconHeartValue] = useState<string | null>(null);
  const [darkThemeValue, setDarkThemeValue] = useState<string | null>(null);
  const [noIconValue, setNoIconValue] = useState<string | null>(null);
  const [labelValue, setLabelValue] = useState<string | null>(null);
  const [noSearchValue, setNoSearchValue] = useState<string | null>(null);

  const mapCountryToOption = useCallback((country: RestCountryResponse): SearchableDropdownOption => ({
    value: country.cca2,
    label: country.name.common,
    content: (
      <div className="flex items-center gap-2">
        <img src={country.flags.png} alt={`${country.name.common} flag`} className="w-5 h-4 object-cover rounded-sm" />
        <div className="flex flex-col">
          <span className="text-sm">{country.name.common}</span>
          <span className="text-xs text-gray-500">{country.capital?.[0] || country.region}</span>
        </div>
      </div>
    ),
    selectedContent: (
      <div className="flex items-center gap-2">
        <img src={country.flags.png} alt={`${country.name.common} flag`} className="w-5 h-4 object-cover rounded-sm" />
        <span>{country.name.common}</span>
      </div>
    ),
  }), []);

  const handleAsyncSearch = useCallback(async (query: string): Promise<SearchableDropdownOption[]> => {
    if (!query.trim()) return [];
    const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error("Failed to fetch countries");
    }
    const data: RestCountryResponse[] = await response.json();
    return data.slice(0, 10).map(mapCountryToOption);
  }, [mapCountryToOption]);

  const handleLoadInitialOptions = useCallback(async (): Promise<SearchableDropdownOption[]> => {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2,capital,region");
    if (!response.ok) throw new Error("Failed to fetch countries");
    const data: RestCountryResponse[] = await response.json();
    const codes = ["US", "GB", "DE", "FR", "JP", "CA", "AU", "IN", "BR", "IT"];
    return codes
      .map((code) => data.find((c) => c.cca2 === code))
      .filter((c): c is RestCountryResponse => c !== undefined)
      .map(mapCountryToOption);
  }, [mapCountryToOption]);

  return (
    <>
      <ComponentHeader
        title="SearchableDropdown"
        description="A flexible dropdown component with sync and async search support."
      />

      <Section title="Basic Usage">
        <div className="w-64">
          <SearchableDropdown
            options={staticOptions}
            value={basicValue}
            onValueChange={(value) => setBasicValue(value)}
            placeholder="Select a fruit..."
            classes={defaultClasses}
          />
        </div>
      </Section>

      <Section title="With Custom Content">
        <div className="w-64">
          <SearchableDropdown
            options={countryOptions}
            value={countryValue}
            onValueChange={(value) => setCountryValue(value)}
            placeholder="Select a country..."
            classes={defaultClasses}
          />
        </div>
      </Section>

      <Section title="Separate Focus Styling">
        <div className="w-64">
          <SearchableDropdown
            options={staticOptions}
            value={focusStyleValue}
            onValueChange={(value) => setFocusStyleValue(value)}
            placeholder="Hover or navigate..."
            classes={{
              ...defaultClasses,
              option: "flex items-center justify-between px-3 py-2 cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
              optionSelected: "bg-green-100 text-green-800",
              optionFocused: "bg-yellow-100",
              checkIcon: "w-4 h-4 shrink-0 text-green-600",
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use <code className="bg-gray-100 px-1 rounded">classes.optionSelected</code> and{" "}
          <code className="bg-gray-100 px-1 rounded">classes.optionFocused</code> for independent styling.
        </p>
      </Section>

      <Section title="Custom Selected Icon">
        <div className="flex gap-4">
          <div className="w-64">
            <SearchableDropdown
              options={staticOptions}
              value={customIconValue}
              onValueChange={(value) => setCustomIconValue(value)}
              placeholder="Select with star..."
              selectedIcon={<StarIcon className="w-4 h-4 shrink-0 text-yellow-500" />}
              classes={defaultClasses}
            />
            <p className="text-xs text-gray-500 mt-1">Star icon</p>
          </div>
          <div className="w-64">
            <SearchableDropdown
              options={staticOptions}
              value={customIconHeartValue}
              onValueChange={(value) => setCustomIconHeartValue(value)}
              placeholder="Select (heart icon)..."
              selectedIcon={<HeartIcon className="w-4 h-4 shrink-0 text-red-500" />}
              classes={defaultClasses}
            />
            <p className="text-xs text-gray-500 mt-1">Heart icon</p>
          </div>
        </div>
      </Section>

      <Section title="Hide Selected Icon">
        <div className="w-64">
          <SearchableDropdown
            options={staticOptions}
            value={noIconValue}
            onValueChange={(value) => setNoIconValue(value)}
            placeholder="No selected indicator..."
            showSelectedIcon={false}
            classes={{
              ...defaultClasses,
              optionSelected: "bg-blue-100 font-medium",
            }}
          />
        </div>
      </Section>

      <Section title="Dark Theme (Custom Backgrounds)">
        <div className="w-64">
          <SearchableDropdown
            options={staticOptions}
            value={darkThemeValue}
            onValueChange={(value) => setDarkThemeValue(value)}
            placeholder="Select a fruit..."
            classes={darkClasses}
          />
        </div>
      </Section>

      <Section title="Async Search (Real API)">
        <div className="w-80">
          <SearchableDropdown
            value={asyncValue}
            onValueChange={(value) => setAsyncValue(value)}
            placeholder="Search countries..."
            onSearch={handleAsyncSearch}
            searchDebounceMs={300}
            loadingText="Searching countries..."
            noResultsText="No countries found"
            classes={defaultClasses}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Type to search countries using the REST Countries API. Results are debounced (300ms).
        </p>
      </Section>

      <Section title="Async with Static Initial Options">
        <div className="w-80">
          <SearchableDropdown
            value={asyncStaticInitialValue}
            onValueChange={(value) => setAsyncStaticInitialValue(value)}
            placeholder="Select or search countries..."
            onSearch={handleAsyncSearch}
            initialOptions={countryOptions}
            searchDebounceMs={300}
            loadingText="Searching..."
            noResultsText="No countries found"
            classes={defaultClasses}
          />
        </div>
      </Section>

      <Section title="Async with Dynamic Prefetch">
        <div className="w-80">
          <SearchableDropdown
            value={asyncPrefetchValue}
            onValueChange={(value) => setAsyncPrefetchValue(value)}
            placeholder="Select or search countries..."
            onSearch={handleAsyncSearch}
            onLoadInitialOptions={handleLoadInitialOptions}
            loadInitialOnOpen
            searchDebounceMs={300}
            loadingText="Loading..."
            noResultsText="No countries found"
            classes={defaultClasses}
          />
        </div>
      </Section>

      <Section title="With Label">
        <div className="w-64">
          <SearchableDropdown
            label="Favorite Fruit"
            options={staticOptions}
            value={labelValue}
            onValueChange={(value) => setLabelValue(value)}
            placeholder="Select a fruit..."
            classes={defaultClasses}
          />
        </div>
      </Section>

      <Section title="Disabled State">
        <div className="w-64">
          <SearchableDropdown
            options={staticOptions}
            value={disabledValue}
            onValueChange={(value) => setDisabledValue(value)}
            disabled
            placeholder="Select a fruit..."
            classes={{
              ...defaultClasses,
              trigger: `${defaultClasses.trigger} opacity-50 cursor-not-allowed`,
            }}
          />
        </div>
      </Section>

      <Section title="Error State">
        <div className="w-64">
          <SearchableDropdown
            label="Required Field"
            options={staticOptions}
            value={errorValue}
            onValueChange={(value) => setErrorValue(value)}
            required
            error
            errorMessage="This field is required"
            placeholder="Select a fruit..."
            classes={{
              ...defaultClasses,
              trigger: `${defaultClasses.trigger} border-red-500 focus:ring-red-500`,
            }}
          />
        </div>
      </Section>

      <Section title="Without Search">
        <div className="w-64">
          <SearchableDropdown
            options={staticOptions}
            value={noSearchValue}
            onValueChange={(value) => setNoSearchValue(value)}
            showSearch={false}
            placeholder="Select a fruit..."
            classes={defaultClasses}
          />
        </div>
      </Section>

      <Section title="SearchableDropdown Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Default</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["options", "SearchableDropdownOption[]", "[]", "Static options array"],
                ["value", "string | null", "-", "Selected value (required)"],
                ["onValueChange", "(value, option) => void", "-", "Change handler (required)"],
                ["classes", "SearchableDropdownClasses", "-", "Class names for all internal elements"],
                ["className", "string", "-", "Root class name"],
                ["label", "ReactNode", "-", "Label for the dropdown"],
                ["placeholder", "string", '"Select an option"', "Placeholder text"],
                ["disabled", "boolean", "false", "Disable the dropdown"],
                ["error", "boolean", "false", "Show error state"],
                ["errorMessage", "ReactNode", "-", "Error message to display"],
                ["required", "boolean", "false", "Whether field is required"],
                ["showSearch", "boolean", "true", "Show search input"],
                ["searchPlaceholder", "string", '"Search..."', "Search input placeholder"],
                ["noResultsText", "string", '"No results found"', "Text when no results"],
                ["loadingText", "string", '"Loading..."', "Text while loading"],
                ["showChevron", "boolean", "true", "Show dropdown chevron"],
                ["showSelectedIcon", "boolean", "true", "Show selected indicator icon"],
                ["selectedIcon", "ReactNode", "CheckIcon", "Custom icon for selected state"],
                ["fullWidth", "boolean", "false", "Take full container width"],
                ["loading", "boolean", "false", "External loading state"],
                ["onSearch", "(query) => Promise<Option[]>", "-", "Async search function"],
                ["searchDebounceMs", "number", "300", "Debounce delay for async search"],
                ["initialOptions", "SearchableDropdownOption[]", "[]", "Static initial options for async dropdown"],
                ["onLoadInitialOptions", "() => Promise<Option[]>", "-", "Async function to load initial options"],
                ["loadInitialOnOpen", "boolean", "false", "Load initial options when dropdown opens"],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop}>
                  <td className="py-2 pr-4 font-mono text-blue-600">{prop}</td>
                  <td className="py-2 pr-4 text-gray-600">{type}</td>
                  <td className="py-2 pr-4 text-gray-500">{def}</td>
                  <td className="py-2 text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="classes Record (SearchableDropdownClasses)">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Key</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["root", "Root container"],
                ["wrapper", "Inner wrapper (relative positioned)"],
                ["trigger", "Trigger button"],
                ["triggerFocused", "Additional class when trigger is focused"],
                ["triggerText", "Text span inside trigger"],
                ["content", "Dropdown outer container (positioning, shadow, border)"],
                ["optionList", "Options list wrapper (background, max-height, overflow)"],
                ["option", "Individual option base styles"],
                ["optionSelected", "Additional class for selected options"],
                ["optionFocused", "Additional class for focused options (keyboard/hover)"],
                ["chevron", "Chevron icon"],
                ["checkIcon", "Selected indicator icon"],
                ["searchInput", "Search input area (background, padding, border)"],
                ["searchInputElement", "Search input element (text color, placeholder)"],
                ["searchIcon", "Search icon"],
                ["noResults", "No results message"],
                ["loading", "Loading message"],
                ["label", "Label element"],
                ["error", "Error message"],
              ].map(([key, desc]) => (
                <tr key={key}>
                  <td className="py-2 pr-4 font-mono text-blue-600">{key}</td>
                  <td className="py-2 text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default SearchableDropdownDemo;
