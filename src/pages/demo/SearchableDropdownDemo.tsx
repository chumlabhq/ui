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
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  flag: string;
  flags: {
    png: string;
    svg: string;
  };
  capital?: string[];
  region: string;
}

const triggerStyle = "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const dropdownStyle = "absolute z-50 top-full left-0 mt-1 w-full border border-gray-200 rounded-lg shadow-lg overflow-hidden";
const searchInputStyle = "flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50";
const searchInputElementStyle = "bg-transparent text-gray-900 placeholder:text-gray-400";
const optionListStyle = "max-h-60 overflow-y-auto bg-white";
const optionStyle = "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const optionSelectedStyle = "bg-blue-50";
const optionFocusedStyle = "bg-gray-100";
const chevronStyle = "w-4 h-4 shrink-0 transition-transform duration-200";
const checkIconStyle = "w-4 h-4 shrink-0 text-blue-600";
const searchIconStyle = "w-4 h-4 shrink-0 text-gray-400";
const noResultsStyle = "px-3 py-4 text-sm text-gray-500 text-center";
const loadingStyle = "px-3 py-4 text-sm text-gray-500 text-center";
const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
const errorStyle = "text-sm text-red-500 mt-1";

// Dark theme styles - different input background vs menu background
const darkTriggerStyle = "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500";
const darkDropdownStyle = "absolute z-50 top-full left-0 mt-1 w-full border border-gray-600 rounded-lg shadow-lg overflow-hidden";
const darkSearchInputStyle = "flex items-center gap-2 px-3 py-2 border-b border-gray-600 bg-gray-900";
const darkSearchInputElementStyle = "bg-transparent text-white placeholder:text-gray-400";
const darkOptionListStyle = "max-h-60 overflow-y-auto bg-gray-800";
const darkOptionStyle = "flex items-center justify-between px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const darkOptionSelectedStyle = "bg-purple-900/50";
const darkOptionFocusedStyle = "bg-gray-700";
const darkCheckIconStyle = "w-4 h-4 shrink-0 text-purple-400";
const darkSearchIconStyle = "w-4 h-4 shrink-0 text-gray-400";
const darkNoResultsStyle = "px-3 py-4 text-sm text-gray-400 text-center";
const darkLoadingStyle = "px-3 py-4 text-sm text-gray-400 text-center";

// Custom Star Icon for selected state
const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Custom Heart Icon for selected state
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
        <img
          src={country.flags.png}
          alt={`${country.name.common} flag`}
          className="w-5 h-4 object-cover rounded-sm"
        />
        <div className="flex flex-col">
          <span className="text-sm">{country.name.common}</span>
          <span className="text-xs text-gray-500">{country.capital?.[0] || country.region}</span>
        </div>
      </div>
    ),
    selectedContent: (
      <div className="flex items-center gap-2">
        <img
          src={country.flags.png}
          alt={`${country.name.common} flag`}
          className="w-5 h-4 object-cover rounded-sm"
        />
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

    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    const data: RestCountryResponse[] = await response.json();

    const popularCountryCodes = ["US", "GB", "DE", "FR", "JP", "CA", "AU", "IN", "BR", "IT"];
    const popularCountries = popularCountryCodes
      .map((code) => data.find((c) => c.cca2 === code))
      .filter((c): c is RestCountryResponse => c !== undefined);

    return popularCountries.map(mapCountryToOption);
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
            onChange={(value) => setBasicValue(value)}
            placeholder="Select a fruit..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            searchInputElementClassName={searchInputElementStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            optionSelectedClassName={optionSelectedStyle}
            optionFocusedClassName={optionFocusedStyle}
            chevronClassName={chevronStyle}
            selectedIndicatorClassName={checkIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="With Custom Content">
        <div className="w-64">
          <SearchableDropdown
            options={countryOptions}
            value={countryValue}
            onChange={(value) => setCountryValue(value)}
            placeholder="Select a country..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            searchInputElementClassName={searchInputElementStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            optionSelectedClassName={optionSelectedStyle}
            optionFocusedClassName={optionFocusedStyle}
            chevronClassName={chevronStyle}
            selectedIndicatorClassName={checkIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Separate Focus Styling">
        <div className="w-64">
          <SearchableDropdown
            options={staticOptions}
            value={focusStyleValue}
            onChange={(value) => setFocusStyleValue(value)}
            placeholder="Hover or navigate..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            searchInputElementClassName={searchInputElementStyle}
            optionListClassName={optionListStyle}
            optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
            optionSelectedClassName="bg-green-100 text-green-800"
            optionFocusedClassName="bg-yellow-100"
            chevronClassName={chevronStyle}
            selectedIndicatorClassName="w-4 h-4 shrink-0 text-green-600"
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use <code className="bg-gray-100 px-1 rounded">optionSelectedClassName</code> and{" "}
          <code className="bg-gray-100 px-1 rounded">optionFocusedClassName</code> for independent styling.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Selected: green background | Focused (keyboard/hover): yellow background
        </p>
      </Section>

      <Section title="Custom Selected Icon">
        <div className="flex gap-4">
          <div className="w-64">
            <SearchableDropdown
              options={staticOptions}
              value={customIconValue}
              onChange={(value) => setCustomIconValue(value)}
              placeholder="Select with star..."
              triggerClassName={triggerStyle}
              dropdownClassName={dropdownStyle}
              searchInputClassName={searchInputStyle}
              searchInputElementClassName={searchInputElementStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              optionSelectedClassName={optionSelectedStyle}
              optionFocusedClassName={optionFocusedStyle}
              chevronClassName={chevronStyle}
              selectedIcon={<StarIcon className="w-4 h-4 shrink-0 text-yellow-500" />}
              searchIconClassName={searchIconStyle}
              noResultsClassName={noResultsStyle}
            />
            <p className="text-xs text-gray-500 mt-1">Star icon</p>
          </div>
          <div className="w-64">
            <SearchableDropdown
              options={staticOptions}
              value={customIconHeartValue}
              onChange={(value) => setCustomIconHeartValue(value)}
              placeholder="Select (heart icon)..."
              triggerClassName={triggerStyle}
              dropdownClassName={dropdownStyle}
              searchInputClassName={searchInputStyle}
              searchInputElementClassName={searchInputElementStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              optionSelectedClassName={optionSelectedStyle}
              optionFocusedClassName={optionFocusedStyle}
              chevronClassName={chevronStyle}
              selectedIcon={<HeartIcon className="w-4 h-4 shrink-0 text-red-500" />}
              searchIconClassName={searchIconStyle}
              noResultsClassName={noResultsStyle}
            />
            <p className="text-xs text-gray-500 mt-1">Heart icon</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use <code className="bg-gray-100 px-1 rounded">selectedIcon</code> to customize the indicator.
        </p>
      </Section>

      <Section title="Hide Selected Icon">
        <div className="w-64">
          <SearchableDropdown
            options={staticOptions}
            value={noIconValue}
            onChange={(value) => setNoIconValue(value)}
            placeholder="No selected indicator..."
            showSelectedIcon={false}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            searchInputElementClassName={searchInputElementStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            optionSelectedClassName="bg-blue-100 font-medium"
            optionFocusedClassName={optionFocusedStyle}
            chevronClassName={chevronStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Set <code className="bg-gray-100 px-1 rounded">showSelectedIcon=false</code> to hide the indicator.
        </p>
      </Section>

      <Section title="Dark Theme (Custom Backgrounds)">
        <div className="w-64">
          <SearchableDropdown
            options={staticOptions}
            value={darkThemeValue}
            onChange={(value) => setDarkThemeValue(value)}
            placeholder="Select a fruit..."
            triggerClassName={darkTriggerStyle}
            dropdownClassName={darkDropdownStyle}
            searchInputClassName={darkSearchInputStyle}
            searchInputElementClassName={darkSearchInputElementStyle}
            optionListClassName={darkOptionListStyle}
            optionClassName={darkOptionStyle}
            optionSelectedClassName={darkOptionSelectedStyle}
            optionFocusedClassName={darkOptionFocusedStyle}
            chevronClassName={chevronStyle}
            selectedIndicatorClassName={darkCheckIconStyle}
            searchIconClassName={darkSearchIconStyle}
            noResultsClassName={darkNoResultsStyle}
            loadingClassName={darkLoadingStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use <code className="bg-gray-100 px-1 rounded">searchInputClassName</code> for input area background and{" "}
          <code className="bg-gray-100 px-1 rounded">optionListClassName</code> for menu background.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          <code className="bg-gray-100 px-1 rounded">searchInputElementClassName</code> controls input text/placeholder styling.
        </p>
      </Section>

      <Section title="Async Search (Real API)">
        <div className="w-80">
          <SearchableDropdown
            value={asyncValue}
            onChange={(value) => setAsyncValue(value)}
            placeholder="Search countries..."
            onSearch={handleAsyncSearch}
            searchDebounceMs={300}
            loadingText="Searching countries..."
            noResultsText="No countries found"
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            searchInputElementClassName={searchInputElementStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            optionSelectedClassName={optionSelectedStyle}
            optionFocusedClassName={optionFocusedStyle}
            chevronClassName={chevronStyle}
            selectedIndicatorClassName={checkIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            loadingClassName={loadingStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Type to search countries using the REST Countries API. Results are debounced (300ms).
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Try: "germany", "united", "japan", "aus"
        </p>
      </Section>

      <Section title="Async with Static Initial Options">
        <div className="w-80">
          <SearchableDropdown
            value={asyncStaticInitialValue}
            onChange={(value) => setAsyncStaticInitialValue(value)}
            placeholder="Select or search countries..."
            onSearch={handleAsyncSearch}
            initialOptions={countryOptions}
            searchDebounceMs={300}
            loadingText="Searching..."
            noResultsText="No countries found"
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            searchInputElementClassName={searchInputElementStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            optionSelectedClassName={optionSelectedStyle}
            optionFocusedClassName={optionFocusedStyle}
            chevronClassName={chevronStyle}
            selectedIndicatorClassName={checkIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            loadingClassName={loadingStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Shows static popular countries immediately, searches API when user types.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Use <code className="bg-gray-100 px-1 rounded">initialOptions</code> for pre-defined options that display before searching.
        </p>
      </Section>

      <Section title="Async with Dynamic Prefetch">
        <div className="w-80">
          <SearchableDropdown
            value={asyncPrefetchValue}
            onChange={(value) => setAsyncPrefetchValue(value)}
            placeholder="Select or search countries..."
            onSearch={handleAsyncSearch}
            onLoadInitialOptions={handleLoadInitialOptions}
            loadInitialOnOpen
            searchDebounceMs={300}
            loadingText="Loading..."
            noResultsText="No countries found"
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            searchInputElementClassName={searchInputElementStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            optionSelectedClassName={optionSelectedStyle}
            optionFocusedClassName={optionFocusedStyle}
            chevronClassName={chevronStyle}
            selectedIndicatorClassName={checkIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            loadingClassName={loadingStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Fetches popular countries when dropdown opens, then searches for more when user types.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Use <code className="bg-gray-100 px-1 rounded">onLoadInitialOptions</code> + <code className="bg-gray-100 px-1 rounded">loadInitialOnOpen</code> for lazy-loaded initial options.
        </p>
      </Section>

      <Section title="With Label">
        <div className="w-64">
          <SearchableDropdown
            label="Favorite Fruit"
            options={staticOptions}
            value={labelValue}
            onChange={(value) => setLabelValue(value)}
            placeholder="Select a fruit..."
            labelClassName={labelStyle}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            searchInputElementClassName={searchInputElementStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            optionSelectedClassName={optionSelectedStyle}
            optionFocusedClassName={optionFocusedStyle}
            chevronClassName={chevronStyle}
            selectedIndicatorClassName={checkIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Disabled State">
        <div className="w-64">
          <SearchableDropdown
            options={staticOptions}
            value={disabledValue}
            onChange={(value) => setDisabledValue(value)}
            disabled
            placeholder="Select a fruit..."
            triggerClassName={`${triggerStyle} opacity-50 cursor-not-allowed`}
            dropdownClassName={dropdownStyle}
            optionClassName={optionStyle}
            optionSelectedClassName={optionSelectedStyle}
            optionFocusedClassName={optionFocusedStyle}
            chevronClassName={chevronStyle}
          />
        </div>
      </Section>

      <Section title="Error State">
        <div className="w-64">
          <SearchableDropdown
            label="Required Field"
            options={staticOptions}
            value={errorValue}
            onChange={(value) => setErrorValue(value)}
            required
            error
            errorMessage="This field is required"
            placeholder="Select a fruit..."
            labelClassName={labelStyle}
            triggerClassName={`${triggerStyle} border-red-500 focus:ring-red-500`}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            searchInputElementClassName={searchInputElementStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            optionSelectedClassName={optionSelectedStyle}
            optionFocusedClassName={optionFocusedStyle}
            chevronClassName={chevronStyle}
            selectedIndicatorClassName={checkIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            errorClassName={errorStyle}
          />
        </div>
      </Section>

      <Section title="Without Search">
        <div className="w-64">
          <SearchableDropdown
            options={staticOptions}
            value={noSearchValue}
            onChange={(value) => setNoSearchValue(value)}
            showSearch={false}
            placeholder="Select a fruit..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            optionSelectedClassName={optionSelectedStyle}
            optionFocusedClassName={optionFocusedStyle}
            chevronClassName={chevronStyle}
            selectedIndicatorClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
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
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">auto-generated</td>
                <td className="py-2 text-gray-600">Custom ID for the dropdown</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">name</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Name attribute</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">options</td>
                <td className="py-2 pr-4 text-gray-600">SearchableDropdownOption[]</td>
                <td className="py-2 pr-4 text-gray-500">[]</td>
                <td className="py-2 text-gray-600">Static options array</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">value</td>
                <td className="py-2 pr-4 text-gray-600">string | null</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Selected value (required)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onChange</td>
                <td className="py-2 pr-4 text-gray-600">(value, option) =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Change handler (required)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Label for the dropdown</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">required</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Whether field is required</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">placeholder</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"Select an option"</td>
                <td className="py-2 text-gray-600">Placeholder text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">errorMessage</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Error message to display</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">searchPlaceholder</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"Search..."</td>
                <td className="py-2 text-gray-600">Search input placeholder</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">noResultsText</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"No results found"</td>
                <td className="py-2 text-gray-600">Text when no results</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">loadingText</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"Loading..."</td>
                <td className="py-2 text-gray-600">Text while loading</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showChevron</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show dropdown chevron</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showSelectedIcon</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show selected indicator icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">selectedIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">CheckIcon</td>
                <td className="py-2 text-gray-600">Custom icon for selected state</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fullWidth</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Take full container width</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onSearch</td>
                <td className="py-2 pr-4 text-gray-600">(query) =&gt; Promise&lt;Option[]&gt;</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Async search function</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">searchDebounceMs</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">300</td>
                <td className="py-2 text-gray-600">Debounce delay for async search</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">initialOptions</td>
                <td className="py-2 pr-4 text-gray-600">SearchableDropdownOption[]</td>
                <td className="py-2 pr-4 text-gray-500">[]</td>
                <td className="py-2 text-gray-600">Static initial options for async dropdown</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onLoadInitialOptions</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; Promise&lt;Option[]&gt;</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Async function to load initial options</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">loadInitialOnOpen</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Load initial options when dropdown opens</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showSearch</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show search input</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Disable the dropdown</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">error</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Show error state</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">isLoading</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">External loading state</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Styling Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 text-gray-600">Dropdown wrapper (relative positioned)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">containerClassName</td>
                <td className="py-2 text-gray-600">Root container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">labelClassName</td>
                <td className="py-2 text-gray-600">Label element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">errorClassName</td>
                <td className="py-2 text-gray-600">Error message</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">triggerClassName</td>
                <td className="py-2 text-gray-600">Trigger button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">triggerFocusClassName</td>
                <td className="py-2 text-gray-600">Trigger button when focused</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">dropdownClassName</td>
                <td className="py-2 text-gray-600">Dropdown outer container (positioning, shadow, border)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">searchInputClassName</td>
                <td className="py-2 text-gray-600">Search input area (background, padding, border)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">searchInputElementClassName</td>
                <td className="py-2 text-gray-600">Search input element (background, text color, placeholder)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">optionListClassName</td>
                <td className="py-2 text-gray-600">Options list wrapper (background, max-height, overflow)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">optionClassName</td>
                <td className="py-2 text-gray-600">Individual option base styles</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">optionSelectedClassName</td>
                <td className="py-2 text-gray-600">Additional class for selected options</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">optionFocusedClassName</td>
                <td className="py-2 text-gray-600">Additional class for focused options (keyboard/hover)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">chevronClassName</td>
                <td className="py-2 text-gray-600">Chevron icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">selectedIndicatorClassName</td>
                <td className="py-2 text-gray-600">Selected indicator icon (check icon)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">searchIconClassName</td>
                <td className="py-2 text-gray-600">Search icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">noResultsClassName</td>
                <td className="py-2 text-gray-600">No results message</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">loadingClassName</td>
                <td className="py-2 text-gray-600">Loading message</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default SearchableDropdownDemo;
