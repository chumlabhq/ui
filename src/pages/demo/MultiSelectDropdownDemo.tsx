import { useState, useCallback } from "react";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown";
import type { MultiSelectOption } from "../../components/MultiSelectDropdown";
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

const statusOptions: MultiSelectOption[] = [
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

const disabledItemOptions: MultiSelectOption[] = [
  { value: "option1", label: "Available Option 1" },
  { value: "option2", label: "Disabled Option", disabled: true },
  { value: "option3", label: "Available Option 2" },
  { value: "option4", label: "Disabled Option 2", disabled: true },
  { value: "option5", label: "Available Option 3" },
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
const optionListStyle = "max-h-60 overflow-y-auto";
const optionStyle = "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const selectedOptionStyle = "bg-blue-50";
const focusedOptionStyle = "bg-gray-100";
const chevronStyle = "w-4 h-4 shrink-0 transition-transform duration-200";
const checkboxStyle = "w-4 h-4 shrink-0 border border-gray-300 rounded flex items-center justify-center";
const checkboxCheckedStyle = "bg-blue-600 border-blue-600 text-white";
const checkboxIconStyle = "w-full h-full";
const noResultsStyle = "px-3 py-4 text-sm text-gray-500 text-center";
const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
const errorStyle = "text-sm text-red-500 mt-1";
const chipStyle = "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-md shrink-0 max-w-[100px]";
const chipRemoveStyle = "w-3 h-3 shrink-0 hover:text-blue-600";
const moreCountStyle = "inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md shrink-0";
const shimmerItemStyle = "px-3 py-2";

// Dark theme styles
const darkTriggerStyle = "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[42px]";
const darkDropdownStyle = "absolute z-50 top-full left-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden";
const darkOptionStyle = "flex items-center gap-2 px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const darkSelectedOptionStyle = "bg-gray-700";
const darkFocusedOptionStyle = "bg-gray-600";
const darkCheckboxStyle = "w-4 h-4 shrink-0 border border-gray-500 rounded flex items-center justify-center";
const darkCheckboxCheckedStyle = "bg-blue-500 border-blue-500 text-white";
const darkNoResultsStyle = "px-3 py-4 text-sm text-gray-400 text-center";
const darkChipStyle = "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-600 text-gray-200 rounded-md shrink-0 max-w-[100px]";
const darkChipRemoveStyle = "w-3 h-3 shrink-0 hover:text-gray-300";
const darkChevronStyle = "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400";

// Purple theme styles
const purpleTriggerStyle = "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-purple-300 rounded-lg bg-white hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[42px]";
const purpleDropdownStyle = "absolute z-50 top-full left-0 mt-1 w-full bg-purple-50 border border-purple-200 rounded-lg shadow-lg overflow-hidden";
const purpleOptionStyle = "flex items-center gap-2 px-3 py-2 cursor-pointer text-purple-900 hover:bg-purple-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const purpleSelectedOptionStyle = "bg-purple-200";
const purpleFocusedOptionStyle = "bg-purple-100";
const purpleCheckboxStyle = "w-4 h-4 shrink-0 border border-purple-400 rounded flex items-center justify-center";
const purpleCheckboxCheckedStyle = "bg-purple-600 border-purple-600 text-white";
const purpleNoResultsStyle = "px-3 py-4 text-sm text-purple-500 text-center";
const purpleChipStyle = "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-200 text-purple-800 rounded-md shrink-0 max-w-[100px]";
const purpleChipRemoveStyle = "w-3 h-3 shrink-0 hover:text-purple-600";

// Green checkbox styles
const greenCheckboxStyle = "w-4 h-4 shrink-0 border border-gray-300 rounded-full flex items-center justify-center";
const greenCheckboxCheckedStyle = "bg-emerald-500 border-emerald-500 text-white";

// Orange checkbox styles
const orangeCheckboxStyle = "w-5 h-5 shrink-0 border-2 border-orange-300 rounded-sm flex items-center justify-center";
const orangeCheckboxCheckedStyle = "bg-orange-500 border-orange-500 text-white";

const MultiSelectDropdownDemo = () => {
  const [basicValue, setBasicValue] = useState<string[]>([]);
  const [countryValue, setCountryValue] = useState<string[]>([]);
  const [statusValue, setStatusValue] = useState<string[]>([]);
  const [disabledItemValue, setDisabledItemValue] = useState<string[]>([]);
  const [asyncValue, setAsyncValue] = useState<string[]>([]);
  const [disabledValue, setDisabledValue] = useState<string[]>(["apple", "banana"]);
  const [errorValue, setErrorValue] = useState<string[]>([]);
  const [noChipsValue, setNoChipsValue] = useState<string[]>([]);
  const [darkThemeValue, setDarkThemeValue] = useState<string[]>([]);
  const [purpleThemeValue, setPurpleThemeValue] = useState<string[]>([]);
  const [greenCheckboxValue, setGreenCheckboxValue] = useState<string[]>([]);
  const [orangeCheckboxValue, setOrangeCheckboxValue] = useState<string[]>([]);
  const [customIconValue, setCustomIconValue] = useState<string[]>([]);
  const [labelValue, setLabelValue] = useState<string[]>([]);
  const [fullWidthValue, setFullWidthValue] = useState<string[]>([]);
  const [noChevronValue, setNoChevronValue] = useState<string[]>([]);

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

  const handleLoadOptions = useCallback(async (): Promise<MultiSelectOption[]> => {
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
        title="MultiSelectDropdown"
        description="A multi-select dropdown component without search functionality."
      />

      <Section title="Basic Usage">
        <div className="w-72">
          <MultiSelectDropdown
            options={staticOptions}
            value={basicValue}
            onChange={(values) => setBasicValue(values)}
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
          {basicValue.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Selected: {basicValue.join(", ")}
            </p>
          )}
        </div>
      </Section>

      <Section title="With Custom Content">
        <div className="w-72">
          <MultiSelectDropdown
            options={countryOptions}
            value={countryValue}
            onChange={(values) => setCountryValue(values)}
            placeholder="Select countries..."
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

      <Section title="With Status Indicators">
        <div className="w-72">
          <MultiSelectDropdown
            options={statusOptions}
            value={statusValue}
            onChange={(values) => setStatusValue(values)}
            placeholder="Select statuses..."
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

      <Section title="Async Data Fetching with Shimmer">
        <div className="w-80">
          <MultiSelectDropdown
            value={asyncValue}
            onChange={(values) => setAsyncValue(values)}
            placeholder="Select countries..."
            onLoadOptions={handleLoadOptions}
            loadOnOpen
            shimmerCount={5}
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
            shimmerItemClassName={shimmerItemStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Options are fetched from the REST Countries API when dropdown opens. Shows shimmer while loading.
        </p>
      </Section>

      <Section title="With Disabled Options">
        <div className="w-72">
          <MultiSelectDropdown
            options={disabledItemOptions}
            value={disabledItemValue}
            onChange={(values) => setDisabledItemValue(values)}
            placeholder="Select options..."
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
        <p className="text-sm text-gray-500 mt-2">
          Some options are disabled and cannot be selected.
        </p>
      </Section>

      <Section title="With Label">
        <div className="w-72">
          <MultiSelectDropdown
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

      <Section title="Without Chips (Count Only)">
        <div className="w-72">
          <MultiSelectDropdown
            options={staticOptions}
            value={noChipsValue}
            onChange={(values) => setNoChipsValue(values)}
            placeholder="Select fruits..."
            showSelectedChips={false}
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
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Shows "X selected" instead of individual chips.
        </p>
      </Section>

      <Section title="Disabled State">
        <div className="w-72">
          <MultiSelectDropdown
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
          <MultiSelectDropdown
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
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            noResultsClassName={noResultsStyle}
            errorClassName={errorStyle}
            chipClassName={chipStyle}
            chipRemoveClassName={chipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
      </Section>

      <Section title="Without Chevron">
        <div className="w-72">
          <MultiSelectDropdown
            options={staticOptions}
            value={noChevronValue}
            onChange={(values) => setNoChevronValue(values)}
            showChevron={false}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
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

      <Section title="Full Width">
        <div className="w-full max-w-md">
          <MultiSelectDropdown
            options={staticOptions}
            value={fullWidthValue}
            onChange={(values) => setFullWidthValue(values)}
            fullWidth
            placeholder="Select fruits..."
            maxDisplayedChips={3}
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

      <Section title="Dark Theme">
        <div className="w-72">
          <MultiSelectDropdown
            options={staticOptions}
            value={darkThemeValue}
            onChange={(values) => setDarkThemeValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={darkTriggerStyle}
            dropdownClassName={darkDropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={darkOptionStyle}
            selectedOptionClassName={darkSelectedOptionStyle}
            focusedOptionClassName={darkFocusedOptionStyle}
            chevronClassName={darkChevronStyle}
            checkboxClassName={darkCheckboxStyle}
            checkboxCheckedClassName={darkCheckboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
            noResultsClassName={darkNoResultsStyle}
            chipClassName={darkChipStyle}
            chipRemoveClassName={darkChipRemoveStyle}
            moreCountClassName={moreCountStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Dark themed dropdown with custom background colors.
        </p>
      </Section>

      <Section title="Purple Theme">
        <div className="w-72">
          <MultiSelectDropdown
            options={staticOptions}
            value={purpleThemeValue}
            onChange={(values) => setPurpleThemeValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={purpleTriggerStyle}
            dropdownClassName={purpleDropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={purpleOptionStyle}
            selectedOptionClassName={purpleSelectedOptionStyle}
            focusedOptionClassName={purpleFocusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={purpleCheckboxStyle}
            checkboxCheckedClassName={purpleCheckboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
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
          <MultiSelectDropdown
            options={staticOptions}
            value={greenCheckboxValue}
            onChange={(values) => setGreenCheckboxValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={greenCheckboxStyle}
            checkboxCheckedClassName={greenCheckboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
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
          <MultiSelectDropdown
            options={staticOptions}
            value={orangeCheckboxValue}
            onChange={(values) => setOrangeCheckboxValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={orangeCheckboxStyle}
            checkboxCheckedClassName={orangeCheckboxCheckedStyle}
            checkboxIconClassName={checkboxIconStyle}
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
          <MultiSelectDropdown
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
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            selectedOptionClassName={selectedOptionStyle}
            focusedOptionClassName={focusedOptionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName="w-4 h-4 shrink-0 border border-amber-400 rounded flex items-center justify-center"
            checkboxCheckedClassName="bg-amber-500 border-amber-500 text-white"
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

      <Section title="Empty Options">
        <div className="w-72">
          <MultiSelectDropdown
            options={[]}
            value={[]}
            onChange={() => {}}
            placeholder="No options available..."
            triggerClassName={triggerStyle}
            dropdownClassName={dropdownStyle}
            optionListClassName={optionListStyle}
            optionClassName={optionStyle}
            chevronClassName={chevronStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
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
                <td className="py-2 text-gray-600">Display text for the option</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">options</td>
                <td className="py-2 pr-4 text-gray-600">MultiSelectOption[]</td>
                <td className="py-2 pr-4 text-gray-500">[]</td>
                <td className="py-2 text-gray-600">Array of options to display</td>
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
                <td className="py-2 pr-4 text-gray-500">"Select options..."</td>
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
                <td className="py-2 pr-4 font-mono text-blue-600">fullWidth</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Take full container width</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">isLoading</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">External loading state</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onLoadOptions</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; Promise&lt;Option[]&gt;</td>
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
                <td className="py-2 text-gray-600">Dropdown menu container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">optionListClassName</td>
                <td className="py-2 text-gray-600">Options list wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">optionClassName</td>
                <td className="py-2 text-gray-600">Base option styling</td>
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
                <td className="py-2 text-gray-600">Base checkbox styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkboxCheckedClassName</td>
                <td className="py-2 text-gray-600">Additional class for checked checkbox</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">checkboxIconClassName</td>
                <td className="py-2 text-gray-600">Checkbox icon styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">chipClassName</td>
                <td className="py-2 text-gray-600">Selected chip styling</td>
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
    </>
  );
};

export default MultiSelectDropdownDemo;
