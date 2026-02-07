import { useState, useCallback } from "react";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown";
import type { MultiSelectOption } from "../../components/MultiSelectSearchableDropdown";
import { Section, ComponentHeader } from "./components";

const staticOptions: MultiSelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
];

const countryOptions: MultiSelectOption[] = [
  { value: "us", label: "United States", content: <span>🇺🇸 United States</span> },
  { value: "gb", label: "United Kingdom", content: <span>🇬🇧 United Kingdom</span> },
  { value: "ca", label: "Canada", content: <span>🇨🇦 Canada</span> },
  { value: "au", label: "Australia", content: <span>🇦🇺 Australia</span> },
  { value: "de", label: "Germany", content: <span>🇩🇪 Germany</span> },
  { value: "fr", label: "France", content: <span>🇫🇷 France</span> },
  { value: "jp", label: "Japan", content: <span>🇯🇵 Japan</span> },
  { value: "in", label: "India", content: <span>🇮🇳 India</span> },
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

const triggerStyle = "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[42px]";
const dropdownStyle = "absolute z-50 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden";
const searchInputStyle = "flex items-center gap-2 px-3 py-2 border-b border-gray-200";
const optionListStyle = "max-h-60 overflow-y-auto";
const optionStyle = "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const selectedOptionStyle = "bg-blue-50";
const focusedOptionStyle = "bg-gray-100";
const chevronStyle = "w-4 h-4 shrink-0 transition-transform duration-200";
const checkboxStyle = "w-4 h-4 shrink-0 border border-gray-300 rounded flex items-center justify-center";
const checkboxCheckedStyle = "bg-blue-600 border-blue-600 text-white";
const checkboxIconStyle = "w-full h-full";
const searchIconStyle = "w-4 h-4 shrink-0 text-gray-400";
const noResultsStyle = "px-3 py-4 text-sm text-gray-500 text-center";
const loadingStyle = "px-3 py-4 text-sm text-gray-500 text-center";
const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
const errorStyle = "text-sm text-red-500 mt-1";
const chipStyle = "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-md shrink-0 max-w-[100px]";
const chipRemoveStyle = "w-3 h-3 shrink-0 hover:text-blue-600";
const moreCountStyle = "inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md shrink-0";

// Dark theme styles
const darkDropdownStyle = "absolute z-50 top-full left-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden";
const darkSearchInputStyle = "flex items-center gap-2 px-3 py-2 border-b border-gray-700 bg-gray-800";
const darkSearchInputTextStyle = "text-gray-200 placeholder:text-gray-500";
const darkOptionStyle = "flex items-center gap-2 px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const darkSelectedOptionStyle = "bg-gray-700";
const darkFocusedOptionStyle = "bg-gray-600";
const darkCheckboxStyle = "w-4 h-4 shrink-0 border border-gray-500 rounded flex items-center justify-center";
const darkCheckboxCheckedStyle = "bg-blue-500 border-blue-500 text-white";
const darkSearchIconStyle = "w-4 h-4 shrink-0 text-gray-500";
const darkNoResultsStyle = "px-3 py-4 text-sm text-gray-400 text-center";

// Purple theme styles
const purpleDropdownStyle = "absolute z-50 top-full left-0 mt-1 w-full bg-purple-50 border border-purple-200 rounded-lg shadow-lg overflow-hidden";
const purpleSearchInputStyle = "flex items-center gap-2 px-3 py-2 border-b border-purple-200 bg-purple-50";
const purpleOptionStyle = "flex items-center gap-2 px-3 py-2 cursor-pointer text-purple-900 hover:bg-purple-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const purpleSelectedOptionStyle = "bg-purple-200";
const purpleFocusedOptionStyle = "bg-purple-100";
const purpleCheckboxStyle = "w-4 h-4 shrink-0 border border-purple-400 rounded flex items-center justify-center";
const purpleCheckboxCheckedStyle = "bg-purple-600 border-purple-600 text-white";
const purpleSearchIconStyle = "w-4 h-4 shrink-0 text-purple-400";
const purpleNoResultsStyle = "px-3 py-4 text-sm text-purple-500 text-center";
const purpleChipStyle = "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-200 text-purple-800 rounded-md shrink-0 max-w-[100px]";
const purpleChipRemoveStyle = "w-3 h-3 shrink-0 hover:text-purple-600";
const purpleTriggerStyle = "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-purple-300 rounded-lg bg-white hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[42px]";

// Green checkbox styles
const greenCheckboxStyle = "w-4 h-4 shrink-0 border border-gray-300 rounded-full flex items-center justify-center";
const greenCheckboxCheckedStyle = "bg-emerald-500 border-emerald-500 text-white";

// Orange checkbox styles
const orangeCheckboxStyle = "w-5 h-5 shrink-0 border-2 border-orange-300 rounded-sm flex items-center justify-center";
const orangeCheckboxCheckedStyle = "bg-orange-500 border-orange-500 text-white";

const MultiSelectSearchableDropdownDemo = () => {
  const [basicValue, setBasicValue] = useState<string[]>([]);
  const [countryValue, setCountryValue] = useState<string[]>([]);
  const [asyncValue, setAsyncValue] = useState<string[]>([]);
  const [asyncPrefetchValue, setAsyncPrefetchValue] = useState<string[]>([]);
  const [disabledValue, setDisabledValue] = useState<string[]>(["apple", "banana"]);
  const [errorValue, setErrorValue] = useState<string[]>([]);
  const [noChipsValue, setNoChipsValue] = useState<string[]>([]);
  const [darkThemeValue, setDarkThemeValue] = useState<string[]>([]);
  const [purpleThemeValue, setPurpleThemeValue] = useState<string[]>([]);
  const [greenCheckboxValue, setGreenCheckboxValue] = useState<string[]>([]);
  const [orangeCheckboxValue, setOrangeCheckboxValue] = useState<string[]>([]);
  const [customIconValue, setCustomIconValue] = useState<string[]>([]);
  const [labelValue, setLabelValue] = useState<string[]>([]);
  const [noSearchValue, setNoSearchValue] = useState<string[]>([]);

  const mapCountryToOption = useCallback((country: RestCountryResponse): MultiSelectOption => ({
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
      <span className="truncate">{country.name.common}</span>
    ),
  }), []);

  const handleAsyncSearch = useCallback(async (query: string): Promise<MultiSelectOption[]> => {
    if (!query.trim()) return [];

    const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error("Failed to fetch countries");
    }

    const data: RestCountryResponse[] = await response.json();

    return data.slice(0, 10).map(mapCountryToOption);
  }, [mapCountryToOption]);

  const handleLoadInitialOptions = useCallback(async (): Promise<MultiSelectOption[]> => {
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
        title="MultiSelectSearchableDropdown"
        description="A multi-select dropdown with sync and async search support."
      />

      <Section title="Basic Usage">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={basicValue}
            onChange={(values) => setBasicValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
          {basicValue.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Selected: {basicValue.join(", ")}
            </p>
          )}
        </div>
      </Section>

      <Section title="With Custom Content">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            options={countryOptions}
            value={countryValue}
            onChange={(values) => setCountryValue(values)}
            placeholder="Select countries..."
            maxDisplayedChips={2}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
      </Section>

      <Section title="Async Search (Real API)">
        <div className="w-80">
          <MultiSelectSearchableDropdown
            value={asyncValue}
            onChange={(values) => setAsyncValue(values)}
            placeholder="Search countries..."
            onSearch={handleAsyncSearch}
            searchDebounceMs={300}
            maxDisplayedChips={2}
            loadingText="Searching countries..."
            noResultsText="No countries found"
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            loadingClassName={loadingStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Type to search countries using the REST Countries API.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Try: "germany", "united", "japan", "aus"
        </p>
      </Section>

      <Section title="Async with Dynamic Prefetch">
        <div className="w-80">
          <MultiSelectSearchableDropdown
            value={asyncPrefetchValue}
            onChange={(values) => setAsyncPrefetchValue(values)}
            placeholder="Select or search countries..."
            onSearch={handleAsyncSearch}
            onLoadInitialOptions={handleLoadInitialOptions}
            loadInitialOnOpen
            searchDebounceMs={300}
            maxDisplayedChips={2}
            loadingText="Loading..."
            noResultsText="No countries found"
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            loadingClassName={loadingStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Fetches popular countries when dropdown opens, searches API when user types.
        </p>
      </Section>

      <Section title="With Label">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            label="Favorite Fruits"
            required
            options={staticOptions}
            value={labelValue}
            onChange={(values) => setLabelValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            labelClassName={labelStyle}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
      </Section>

      <Section title="Without Chips (Count Only)">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={noChipsValue}
            onChange={(values) => setNoChipsValue(values)}
            placeholder="Select fruits..."
            showSelectedChips={false}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Shows "X selected" instead of individual chips.
        </p>
      </Section>

      <Section title="Disabled State">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={disabledValue}
            onChange={(values) => setDisabledValue(values)}
            disabled
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={`${triggerStyle} opacity-50 cursor-not-allowed`}
            dropdownClassName={dropdownStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
      </Section>

      <Section title="Error State">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            label="Required Field"
            options={staticOptions}
            value={errorValue}
            onChange={(values) => setErrorValue(values)}
            required
            error
            errorMessage="Please select at least one option"
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            labelClassName={labelStyle}
            triggerClassName={`${triggerStyle} border-red-500 focus:ring-red-500`}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            errorClassName={errorStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
      </Section>

      <Section title="Without Search">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={noSearchValue}
            onChange={(values) => setNoSearchValue(values)}
            showSearch={false}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            noResultsClassName={noResultsStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
      </Section>

      <Section title="Dark Theme Menu">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={darkThemeValue}
            onChange={(values) => setDarkThemeValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={triggerStyle}
            dropdownClassName={darkDropdownStyle}
            searchInputClassName={darkSearchInputStyle}
            searchInputTextClassName={darkSearchInputTextStyle}
            optionListClassName={optionListStyle}
            optionClassName={darkOptionStyle}
            selectedOptionClassName={darkSelectedOptionStyle}
            focusedOptionClassName={darkFocusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={darkCheckboxStyle}
            checkboxCheckedClassName={darkCheckboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            searchIconClassName={darkSearchIconStyle}
            noResultsClassName={darkNoResultsStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Dark themed dropdown menu with custom background colors.
        </p>
      </Section>

      <Section title="Purple Theme Menu">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={purpleThemeValue}
            onChange={(values) => setPurpleThemeValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={purpleTriggerStyle}
            dropdownClassName={purpleDropdownStyle}
            searchInputClassName={purpleSearchInputStyle}
            optionListClassName={optionListStyle}
            optionClassName={purpleOptionStyle}
            selectedOptionClassName={purpleSelectedOptionStyle}
            focusedOptionClassName={purpleFocusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={purpleCheckboxStyle}
            checkboxCheckedClassName={purpleCheckboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            searchIconClassName={purpleSearchIconStyle}
            noResultsClassName={purpleNoResultsStyle}
            chipClassName={purpleChipStyle}
            chipRemoveClassName={purpleChipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Purple themed dropdown with matching checkbox and chips.
        </p>
      </Section>

      <Section title="Custom Checkbox - Green Rounded">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={greenCheckboxValue}
            onChange={(values) => setGreenCheckboxValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={greenCheckboxStyle}
            checkboxCheckedClassName={greenCheckboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Round checkbox with green checked state.
        </p>
      </Section>

      <Section title="Custom Checkbox - Orange Square">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={orangeCheckboxValue}
            onChange={(values) => setOrangeCheckboxValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={orangeCheckboxStyle}
            checkboxCheckedClassName={orangeCheckboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Larger square checkbox with orange checked state and thicker border.
        </p>
      </Section>

      <Section title="Custom Checkbox Icon">
        <div className="w-72">
          <MultiSelectSearchableDropdown
            options={staticOptions}
            value={customIconValue}
            onChange={(values) => setCustomIconValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            checkboxIcon={
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            searchInputClassName={searchInputStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName="w-4 h-4 shrink-0 border border-amber-400 rounded flex items-center justify-center"
            checkboxCheckedClassName="bg-amber-500 border-amber-500 text-white"
            searchIconClassName={searchIconStyle}
            noResultsClassName={noResultsStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Custom star icon instead of default checkmark.
        </p>
      </Section>

      <Section title="MultiSelectOption Interface">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Property</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Required</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">value</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">Yes</td>
                <td className="py-2 text-gray-600">Unique identifier for the option</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">Yes</td>
                <td className="py-2 text-gray-600">Display text (used for search filtering)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">content</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Custom content to render in dropdown (overrides label)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">selectedContent</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Custom content for selected chips (defaults to content or label)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Disable this specific option</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Props Reference">
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
                <td className="py-2 pr-4 text-gray-600">MultiSelectOption[]</td>
                <td className="py-2 pr-4 text-gray-500">[]</td>
                <td className="py-2 text-gray-600">Static options array</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">value</td>
                <td className="py-2 pr-4 text-gray-600">string[]</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Selected values (required)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onChange</td>
                <td className="py-2 pr-4 text-gray-600">(values, options) =&gt; void</td>
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
                <td className="py-2 pr-4 text-gray-500">"Select options..."</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">fullWidth</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Take full container width</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">loading</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">External loading state</td>
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
                <td className="py-2 pr-4 text-gray-600">MultiSelectOption[]</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">maxDisplayedChips</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">3</td>
                <td className="py-2 text-gray-600">Max chips before showing +N</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showSelectedChips</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show chips or count only</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">checkboxIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">CheckIcon</td>
                <td className="py-2 text-gray-600">Custom checkbox icon when checked</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">dropdownClassName</td>
                <td className="py-2 text-gray-600">Dropdown menu container (background, border, shadow)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">searchInputClassName</td>
                <td className="py-2 text-gray-600">Search input wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">searchInputTextClassName</td>
                <td className="py-2 text-gray-600">Search input text element (text color, placeholder styling)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">optionListClassName</td>
                <td className="py-2 text-gray-600">Options list wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">optionClassName</td>
                <td className="py-2 text-gray-600">Base option styling (layout, hover)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">selectedOptionClassName</td>
                <td className="py-2 text-gray-600">Additional class for selected options</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">focusedOptionClassName</td>
                <td className="py-2 text-gray-600">Additional class for keyboard-focused options</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkboxClassName</td>
                <td className="py-2 text-gray-600">Base checkbox styling (size, border, shape)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkboxCheckedClassName</td>
                <td className="py-2 text-gray-600">Additional class for checked checkbox (background, color)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkboxIconClassName</td>
                <td className="py-2 text-gray-600">Checkbox icon styling (size)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">chipClassName</td>
                <td className="py-2 text-gray-600">Selected chip</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">chipRemoveClassName</td>
                <td className="py-2 text-gray-600">Chip remove button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">moreCountClassName</td>
                <td className="py-2 text-gray-600">"+N more" badge</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">chevronClassName</td>
                <td className="py-2 text-gray-600">Chevron icon</td>
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

export default MultiSelectSearchableDropdownDemo;
