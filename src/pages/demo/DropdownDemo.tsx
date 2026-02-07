import { useState, useCallback } from "react";
import { Dropdown } from "../../components/Dropdown";
import type { DropdownOption } from "../../components/Dropdown";
import { Section, ComponentHeader } from "./components";

const fruitOptions: DropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
];

const countryOptions: DropdownOption[] = [
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

const statusOptions: DropdownOption[] = [
  {
    value: "active",
    label: "Active",
    content: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span>Active</span>
      </div>
    ),
    selectedContent: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span>Active</span>
      </div>
    ),
  },
  {
    value: "pending",
    label: "Pending",
    content: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
        <span>Pending</span>
      </div>
    ),
    selectedContent: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
        <span>Pending</span>
      </div>
    ),
  },
  {
    value: "inactive",
    label: "Inactive",
    content: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
        <span>Inactive</span>
      </div>
    ),
    selectedContent: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
        <span>Inactive</span>
      </div>
    ),
  },
];

const disabledItemOptions: DropdownOption[] = [
  { value: "option1", label: "Available Option 1" },
  { value: "option2", label: "Disabled Option", disabled: true },
  { value: "option3", label: "Available Option 2" },
  { value: "option4", label: "Disabled Option 2", disabled: true },
  { value: "option5", label: "Available Option 3" },
];

const triggerStyle = "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const dropdownStyle = "absolute z-50 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden";
const optionListStyle = "max-h-60 overflow-y-auto";
const optionStyle = "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 data-[focused]:bg-gray-100 data-[selected]:bg-blue-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const selectedOptionStyle = "bg-blue-50 font-medium";
const chevronStyle = "w-4 h-4 shrink-0 transition-transform duration-200";
const checkIconStyle = "w-4 h-4 shrink-0 text-blue-600";
const noResultsStyle = "px-3 py-4 text-sm text-gray-500 text-center";
const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
const errorStyle = "text-sm text-red-500 mt-1";
const shimmerItemStyle = "px-3 py-2";

// Custom check icon component
const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CircleCheckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const DropdownDemo = () => {
  const [basicValue, setBasicValue] = useState<string | null>(null);
  const [countryValue, setCountryValue] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState<string | null>(null);
  const [disabledItemValue, setDisabledItemValue] = useState<string | null>(null);
  const [disabledValue, setDisabledValue] = useState<string | null>("apple");
  const [errorValue, setErrorValue] = useState<string | null>(null);
  const [labeledValue, setLabeledValue] = useState<string | null>(null);
  const [asyncCountryValue, setAsyncCountryValue] = useState<string | null>(null);
  const [customSelectedValue, setCustomSelectedValue] = useState<string | null>(null);
  const [customIconValue, setCustomIconValue] = useState<string | null>(null);
  const [customIconValue2, setCustomIconValue2] = useState<string | null>(null);
  const [noIconValue, setNoIconValue] = useState<string | null>(null);
  const [customFocusPurpleValue, setCustomFocusPurpleValue] = useState<string | null>(null);
  const [customFocusGreenValue, setCustomFocusGreenValue] = useState<string | null>(null);
  const [customFocusOrangeValue, setCustomFocusOrangeValue] = useState<string | null>(null);
  const [darkThemeValue, setDarkThemeValue] = useState<string | null>(null);
  const [warmThemeValue, setWarmThemeValue] = useState<string | null>(null);
  const [coolThemeValue, setCoolThemeValue] = useState<string | null>(null);
  const [minimalThemeValue, setMinimalThemeValue] = useState<string | null>(null);
  const [contrastTheme1Value, setContrastTheme1Value] = useState<string | null>(null);
  const [contrastTheme2Value, setContrastTheme2Value] = useState<string | null>(null);
  const [contrastTheme3Value, setContrastTheme3Value] = useState<string | null>(null);
  const [requiredFieldValue, setRequiredFieldValue] = useState<string | null>(null);
  const [noChevronValue, setNoChevronValue] = useState<string | null>(null);
  const [fullWidthValue, setFullWidthValue] = useState<string | null>(null);

  const mapCountryToOption = useCallback((country: RestCountryResponse): DropdownOption => ({
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

  const handleLoadCountries = useCallback(async (): Promise<DropdownOption[]> => {
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
        title="Dropdown"
        description="A simple dropdown component for selecting from a list of options."
      />

      <Section title="Basic Usage">
        <div className="w-64">
          <Dropdown
            options={fruitOptions}
            value={basicValue}
            onChange={(value) => setBasicValue(value)}
            placeholder="Select a fruit..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="With Custom Content">
        <div className="w-64">
          <Dropdown
            options={countryOptions}
            value={countryValue}
            onChange={(value) => setCountryValue(value)}
            placeholder="Select a country..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Async Data Fetching with Shimmer">
        <div className="w-80">
          <Dropdown
            value={asyncCountryValue}
            onChange={(value) => setAsyncCountryValue(value)}
            placeholder="Select a country..."
            onLoadOptions={handleLoadCountries}
            loadOnOpen
            shimmerCount={5}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
            shimmerItemClassName={shimmerItemStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Options are fetched from the REST Countries API when dropdown opens. Shows shimmer while loading.
        </p>
      </Section>

      <Section title="With Status Indicators">
        <div className="w-64">
          <Dropdown
            options={statusOptions}
            value={statusValue}
            onChange={(value) => setStatusValue(value)}
            placeholder="Select status..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Custom Selected State Styling">
        <div className="space-y-4">
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2">With selectedOptionClassName:</p>
            <Dropdown
              options={fruitOptions}
              value={customSelectedValue}
              onChange={(value) => setCustomSelectedValue(value)}
              placeholder="Select a fruit..."
              triggerClassName={triggerStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName="!bg-green-100 border-l-4 border-green-500"
              chevronClassName={chevronStyle}
              checkIconClassName={checkIconStyle}
              noResultsClassName={noResultsStyle}
            />
          </div>
          <p className="text-sm text-gray-500">
            Use <code className="bg-gray-100 px-1 rounded">selectedOptionClassName</code> to add additional styles to the selected option.
          </p>
        </div>
      </Section>

      <Section title="Custom Selected Icon">
        <div className="flex flex-wrap gap-8">
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2">Star icon:</p>
            <Dropdown
              options={fruitOptions}
              value={customIconValue}
              onChange={(value) => setCustomIconValue(value)}
              placeholder="Select a fruit..."
              triggerClassName={triggerStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              chevronClassName={chevronStyle}
              selectedIcon={<StarIcon className="w-4 h-4 shrink-0 text-yellow-500" />}
              noResultsClassName={noResultsStyle}
            />
          </div>
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2">Circle check icon:</p>
            <Dropdown
              options={fruitOptions}
              value={customIconValue2}
              onChange={(value) => setCustomIconValue2(value)}
              placeholder="Select a fruit..."
              triggerClassName={triggerStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              chevronClassName={chevronStyle}
              selectedIcon={<CircleCheckIcon className="w-4 h-4 shrink-0 text-green-600" />}
              noResultsClassName={noResultsStyle}
            />
          </div>
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2">No icon (hidden):</p>
            <Dropdown
              options={fruitOptions}
              value={noIconValue}
              onChange={(value) => setNoIconValue(value)}
              placeholder="Select a fruit..."
              triggerClassName={triggerStyle}
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName={optionStyle}
              selectedOptionClassName={selectedOptionStyle}
              chevronClassName={chevronStyle}
              showSelectedIcon={false}
              noResultsClassName={noResultsStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use <code className="bg-gray-100 px-1 rounded">selectedIcon</code> to provide a custom icon, or <code className="bg-gray-100 px-1 rounded">showSelectedIcon=false</code> to hide it entirely.
        </p>
      </Section>

      <Section title="Custom Focus State Styling">
        <div className="flex flex-wrap gap-8">
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2">Purple focus ring:</p>
            <Dropdown
              options={fruitOptions}
              value={customFocusPurpleValue}
              onChange={(value) => setCustomFocusPurpleValue(value)}
              placeholder="Select a fruit..."
              triggerClassName="flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-purple-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              focusedOptionClassName="bg-purple-100"
              selectedOptionClassName="bg-purple-50"
              chevronClassName={chevronStyle}
              checkIconClassName="w-4 h-4 shrink-0 text-purple-600"
              noResultsClassName={noResultsStyle}
            />
          </div>
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2">Green focus ring:</p>
            <Dropdown
              options={fruitOptions}
              value={customFocusGreenValue}
              onChange={(value) => setCustomFocusGreenValue(value)}
              placeholder="Select a fruit..."
              triggerClassName="flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-green-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              focusedOptionClassName="bg-green-100"
              selectedOptionClassName="bg-green-50"
              chevronClassName={chevronStyle}
              checkIconClassName="w-4 h-4 shrink-0 text-green-600"
              noResultsClassName={noResultsStyle}
            />
          </div>
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2">Orange focus ring:</p>
            <Dropdown
              options={fruitOptions}
              value={customFocusOrangeValue}
              onChange={(value) => setCustomFocusOrangeValue(value)}
              placeholder="Select a fruit..."
              triggerClassName="flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              dropdownClassName={dropdownStyle}
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-orange-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              focusedOptionClassName="bg-orange-100"
              selectedOptionClassName="bg-orange-50"
              chevronClassName={chevronStyle}
              checkIconClassName="w-4 h-4 shrink-0 text-orange-600"
              noResultsClassName={noResultsStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use <code className="bg-gray-100 px-1 rounded">focusedOptionClassName</code> to customize the keyboard/hover focus state, and <code className="bg-gray-100 px-1 rounded">triggerClassName</code> for the trigger button focus ring.
        </p>
      </Section>

      <Section title="Custom Theme Examples">
        <p className="text-sm text-gray-600 mb-4">
          Customize the trigger, menu, and list item backgrounds to match your design system.
        </p>
        <div className="flex flex-wrap gap-8">
          {/* Dark Theme */}
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Dark Theme:</p>
            <Dropdown
              options={fruitOptions}
              value={darkThemeValue}
              onChange={(value) => setDarkThemeValue(value)}
              placeholder="Select a fruit..."
              triggerClassName="flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              focusedOptionClassName="bg-gray-700"
              selectedOptionClassName="bg-gray-600"
              chevronClassName="w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400"
              checkIconClassName="w-4 h-4 shrink-0 text-blue-400"
              noResultsClassName="px-3 py-4 text-sm text-gray-400 text-center"
            />
          </div>

          {/* Warm Theme */}
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Warm Theme:</p>
            <Dropdown
              options={fruitOptions}
              value={warmThemeValue}
              onChange={(value) => setWarmThemeValue(value)}
              placeholder="Select a fruit..."
              triggerClassName="flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-amber-300 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-amber-50 border border-amber-200 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-amber-900 hover:bg-amber-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              focusedOptionClassName="bg-amber-100"
              selectedOptionClassName="bg-amber-200"
              chevronClassName="w-4 h-4 shrink-0 transition-transform duration-200 text-amber-600"
              checkIconClassName="w-4 h-4 shrink-0 text-amber-700"
              noResultsClassName="px-3 py-4 text-sm text-amber-600 text-center"
            />
          </div>

          {/* Cool Theme */}
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Cool Theme:</p>
            <Dropdown
              options={fruitOptions}
              value={coolThemeValue}
              onChange={(value) => setCoolThemeValue(value)}
              placeholder="Select a fruit..."
              triggerClassName="flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-cyan-300 rounded-lg bg-cyan-50 text-cyan-900 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-cyan-50 border border-cyan-200 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-cyan-900 hover:bg-cyan-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              focusedOptionClassName="bg-cyan-100"
              selectedOptionClassName="bg-cyan-200"
              chevronClassName="w-4 h-4 shrink-0 transition-transform duration-200 text-cyan-600"
              checkIconClassName="w-4 h-4 shrink-0 text-cyan-700"
              noResultsClassName="px-3 py-4 text-sm text-cyan-600 text-center"
            />
          </div>

          {/* Minimal Theme */}
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Minimal Theme:</p>
            <Dropdown
              options={fruitOptions}
              value={minimalThemeValue}
              onChange={(value) => setMinimalThemeValue(value)}
              placeholder="Select a fruit..."
              triggerClassName="flex items-center justify-between gap-2 w-full px-3 py-2 text-left border-b border-gray-300 bg-transparent text-gray-800 hover:border-gray-500 focus:outline-none focus:border-gray-800"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded shadow-sm overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              focusedOptionClassName="bg-gray-50"
              selectedOptionClassName="font-medium"
              chevronClassName="w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400"
              checkIconClassName="w-4 h-4 shrink-0 text-gray-600"
              showSelectedIcon={false}
              noResultsClassName="px-3 py-4 text-sm text-gray-400 text-center"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Key styling props used:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <code className="bg-gray-200 px-1 rounded">triggerClassName</code> - Trigger/input background, border, text color</li>
            <li>• <code className="bg-gray-200 px-1 rounded">dropdownClassName</code> - Menu container background and border</li>
            <li>• <code className="bg-gray-200 px-1 rounded">optionClassName</code> - Base option styling (background, text, hover)</li>
            <li>• <code className="bg-gray-200 px-1 rounded">focusedOptionClassName</code> - Keyboard/hover focused option</li>
            <li>• <code className="bg-gray-200 px-1 rounded">selectedOptionClassName</code> - Currently selected option</li>
            <li>• <code className="bg-gray-200 px-1 rounded">chevronClassName</code> - Dropdown arrow color</li>
            <li>• <code className="bg-gray-200 px-1 rounded">checkIconClassName</code> - Selected icon color</li>
          </ul>
        </div>
      </Section>

      <Section title="Contrasting Trigger & Menu Colors">
        <p className="text-sm text-gray-600 mb-4">
          Use different colors for the trigger and dropdown menu to create visual contrast or match brand guidelines.
        </p>
        <div className="flex flex-wrap gap-8">
          {/* Blue trigger, White menu */}
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Blue Trigger + White Menu:</p>
            <Dropdown
              options={fruitOptions}
              value={contrastTheme1Value}
              onChange={(value) => setContrastTheme1Value(value)}
              placeholder="Select a fruit..."
              triggerClassName="flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              focusedOptionClassName="bg-blue-50"
              selectedOptionClassName="bg-blue-50"
              chevronClassName="w-4 h-4 shrink-0 transition-transform duration-200 text-blue-200"
              checkIconClassName="w-4 h-4 shrink-0 text-blue-600"
              noResultsClassName={noResultsStyle}
            />
          </div>

          {/* Dark trigger, Light menu */}
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Dark Trigger + Light Menu:</p>
            <Dropdown
              options={fruitOptions}
              value={contrastTheme2Value}
              onChange={(value) => setContrastTheme2Value(value)}
              placeholder="Select a fruit..."
              triggerClassName="flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-lg bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-800 hover:bg-gray-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              focusedOptionClassName="bg-gray-200"
              selectedOptionClassName="bg-gray-200 font-medium"
              chevronClassName="w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400"
              checkIconClassName="w-4 h-4 shrink-0 text-gray-700"
              noResultsClassName={noResultsStyle}
            />
          </div>

          {/* Gradient trigger, White menu */}
          <div className="w-64">
            <p className="text-sm text-gray-600 mb-2 font-medium">Gradient Trigger + White Menu:</p>
            <Dropdown
              options={fruitOptions}
              value={contrastTheme3Value}
              onChange={(value) => setContrastTheme3Value(value)}
              placeholder="Select a fruit..."
              triggerClassName="flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              dropdownClassName="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-purple-100 rounded-lg shadow-lg overflow-hidden"
              optionListClassName={optionListStyle}
              optionClassName="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-700 hover:bg-purple-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              focusedOptionClassName="bg-purple-50"
              selectedOptionClassName="bg-purple-100"
              chevronClassName="w-4 h-4 shrink-0 transition-transform duration-200 text-purple-200"
              checkIconClassName="w-4 h-4 shrink-0 text-purple-600"
              noResultsClassName={noResultsStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          The trigger and menu can be styled independently using <code className="bg-gray-100 px-1 rounded">triggerClassName</code> and <code className="bg-gray-100 px-1 rounded">dropdownClassName</code>.
        </p>
      </Section>

      <Section title="With Disabled Options">
        <div className="w-64">
          <Dropdown
            options={disabledItemOptions}
            value={disabledItemValue}
            onChange={(value) => setDisabledItemValue(value)}
            placeholder="Select an option..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Some options are disabled and cannot be selected.
        </p>
      </Section>

      <Section title="With Label">
        <div className="w-64">
          <Dropdown
            label="Favorite Fruit"
            options={fruitOptions}
            value={labeledValue}
            onChange={(value) => setLabeledValue(value)}
            placeholder="Select a fruit..."
            labelClassName={labelStyle}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Required Field">
        <div className="w-64">
          <Dropdown
            label="Required Field"
            required
            options={fruitOptions}
            value={requiredFieldValue}
            onChange={(value) => setRequiredFieldValue(value)}
            placeholder="Select a fruit..."
            labelClassName={labelStyle}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Disabled State">
        <div className="w-64">
          <Dropdown
            options={fruitOptions}
            value={disabledValue}
            onChange={(value) => setDisabledValue(value)}
            disabled
            placeholder="Select a fruit..."
            triggerClassName={`${triggerStyle} opacity-50 cursor-not-allowed`}
            dropdownClassName={dropdownStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
          />
        </div>
      </Section>

      <Section title="Error State">
        <div className="w-64">
          <Dropdown
            label="Required Field"
            options={fruitOptions}
            value={errorValue}
            onChange={(value) => setErrorValue(value)}
            required
            error
            errorMessage="This field is required"
            placeholder="Select a fruit..."
            labelClassName={labelStyle}
            triggerClassName={`${triggerStyle} border-red-500 focus:ring-red-500`}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
            errorClassName={errorStyle}
          />
        </div>
      </Section>

      <Section title="Without Chevron">
        <div className="w-64">
          <Dropdown
            options={fruitOptions}
            value={noChevronValue}
            onChange={(value) => setNoChevronValue(value)}
            showChevron={false}
            placeholder="Select a fruit..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Full Width">
        <div className="w-full max-w-md">
          <Dropdown
            options={fruitOptions}
            value={fullWidthValue}
            onChange={(value) => setFullWidthValue(value)}
            fullWidth
            placeholder="Select a fruit..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Empty Options">
        <div className="w-64">
          <Dropdown
            options={[]}
            value={null}
            onChange={() => {}}
            placeholder="No options available..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Dropdown Props">
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
                <td className="py-2 pr-4 font-mono text-blue-600">options</td>
                <td className="py-2 pr-4 text-gray-600">DropdownOption[]</td>
                <td className="py-2 pr-4 text-gray-500">[]</td>
                <td className="py-2 text-gray-600">Array of options to display</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">value</td>
                <td className="py-2 pr-4 text-gray-600">string | null</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Selected value (required)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onChange</td>
                <td className="py-2 pr-4 text-gray-600">(value: string, option: DropdownOption | null) =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Change handler with selected value and option (required)</td>
              </tr>
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
                <td className="py-2 pr-4 font-mono text-blue-600">placeholder</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"Select an option"</td>
                <td className="py-2 text-gray-600">Placeholder text</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">errorMessage</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Error message to display</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">noResultsText</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"No options available"</td>
                <td className="py-2 text-gray-600">Text when no options</td>
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
                <td className="py-2 text-gray-600">Show icon for selected option</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">selectedIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Custom icon for selected state</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">onLoadOptions</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; Promise&lt;DropdownOption[]&gt;</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Async function to load options</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">loadOnOpen</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Load options when dropdown opens</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">shimmerCount</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">5</td>
                <td className="py-2 text-gray-600">Number of shimmer items to show</td>
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
                <td className="py-2 text-gray-600">Dropdown menu container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">optionListClassName</td>
                <td className="py-2 text-gray-600">Options list wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">optionClassName</td>
                <td className="py-2 text-gray-600">Individual option</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">selectedOptionClassName</td>
                <td className="py-2 text-gray-600">Additional styles for selected option</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">focusedOptionClassName</td>
                <td className="py-2 text-gray-600">Additional styles for focused option (keyboard/hover)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">chevronClassName</td>
                <td className="py-2 text-gray-600">Chevron icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkIconClassName</td>
                <td className="py-2 text-gray-600">Check icon for selected</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">noResultsClassName</td>
                <td className="py-2 text-gray-600">No results message</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">shimmerClassName</td>
                <td className="py-2 text-gray-600">Shimmer container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">shimmerItemClassName</td>
                <td className="py-2 text-gray-600">Individual shimmer item</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="DropdownOption Interface">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Property</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">value</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Unique value for the option (required)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Display label for the option (required)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">content</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 text-gray-600">Custom content to display in dropdown</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">selectedContent</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 text-gray-600">Custom content when selected in trigger</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 text-gray-600">Whether the option is disabled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default DropdownDemo;
