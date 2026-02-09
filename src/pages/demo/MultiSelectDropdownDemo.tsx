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
  { value: "active", label: "Active", content: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span><span>Active</span></div>), selectedContent: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span><span>Active</span></div>) },
  { value: "pending", label: "Pending", content: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span>Pending</span></div>), selectedContent: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span>Pending</span></div>) },
  { value: "inactive", label: "Inactive", content: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-400"></span><span>Inactive</span></div>), selectedContent: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-400"></span><span>Inactive</span></div>) },
];

const disabledItemOptions: MultiSelectOption[] = [
  { value: "option1", label: "Available Option 1" },
  { value: "option2", label: "Disabled Option", disabled: true },
  { value: "option3", label: "Available Option 2" },
  { value: "option4", label: "Disabled Option 2", disabled: true },
  { value: "option5", label: "Available Option 3" },
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
  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[42px]",
  content: "absolute z-50 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden",
  optionList: "max-h-60 overflow-y-auto",
  option: "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  optionSelected: "bg-blue-50",
  optionFocused: "bg-gray-100",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200",
  checkbox: "w-4 h-4 shrink-0 border border-gray-300 rounded flex items-center justify-center",
  checkboxChecked: "bg-blue-600 border-blue-600 text-white",
  checkboxIcon: "w-full h-full",
  noResults: "px-3 py-4 text-sm text-gray-500 text-center",
  label: "block text-sm font-medium text-gray-700 mb-1",
  error: "text-sm text-red-500 mt-1",
  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-md shrink-0 max-w-[100px]",
  chipRemove: "w-3 h-3 shrink-0 hover:text-blue-600",
  moreCount: "inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md shrink-0",
  shimmerItem: "px-3 py-2",
};

const darkClasses = {
  ...defaultClasses,
  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[42px]",
  content: "absolute z-50 top-full left-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden",
  option: "flex items-center gap-2 px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  optionSelected: "bg-gray-700",
  optionFocused: "bg-gray-600",
  checkbox: "w-4 h-4 shrink-0 border border-gray-500 rounded flex items-center justify-center",
  checkboxChecked: "bg-blue-500 border-blue-500 text-white",
  noResults: "px-3 py-4 text-sm text-gray-400 text-center",
  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-600 text-gray-200 rounded-md shrink-0 max-w-[100px]",
  chipRemove: "w-3 h-3 shrink-0 hover:text-gray-300",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400",
};

const purpleClasses = {
  ...defaultClasses,
  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-purple-300 rounded-lg bg-white hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[42px]",
  content: "absolute z-50 top-full left-0 mt-1 w-full bg-purple-50 border border-purple-200 rounded-lg shadow-lg overflow-hidden",
  option: "flex items-center gap-2 px-3 py-2 cursor-pointer text-purple-900 hover:bg-purple-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  optionSelected: "bg-purple-200",
  optionFocused: "bg-purple-100",
  checkbox: "w-4 h-4 shrink-0 border border-purple-400 rounded flex items-center justify-center",
  checkboxChecked: "bg-purple-600 border-purple-600 text-white",
  noResults: "px-3 py-4 text-sm text-purple-500 text-center",
  chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-200 text-purple-800 rounded-md shrink-0 max-w-[100px]",
  chipRemove: "w-3 h-3 shrink-0 hover:text-purple-600",
};

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
        <img src={country.flags.png} alt={`${country.name.common} flag`} className="w-5 h-4 object-cover rounded-sm" />
        <div className="flex flex-col">
          <span className="text-sm">{country.name.common}</span>
          <span className="text-xs text-gray-500">{country.capital?.[0] || country.region}</span>
        </div>
      </div>
    ),
    selectedContent: <span className="truncate">{country.name.common}</span>,
  }), []);

  const handleLoadOptions = useCallback(async (): Promise<MultiSelectOption[]> => {
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
        title="MultiSelectDropdown"
        description="A multi-select dropdown component without search functionality."
      />

      <Section title="Basic Usage">
        <div className="w-72">
          <MultiSelectDropdown options={staticOptions} value={basicValue} onValueChange={(values) => setBasicValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={defaultClasses} />
          {basicValue.length > 0 && <p className="text-sm text-gray-500 mt-2">Selected: {basicValue.join(", ")}</p>}
        </div>
      </Section>

      <Section title="With Custom Content">
        <div className="w-72">
          <MultiSelectDropdown options={countryOptions} value={countryValue} onValueChange={(values) => setCountryValue(values)} placeholder="Select countries..." maxDisplayedChips={2} classes={defaultClasses} />
        </div>
      </Section>

      <Section title="With Status Indicators">
        <div className="w-72">
          <MultiSelectDropdown options={statusOptions} value={statusValue} onValueChange={(values) => setStatusValue(values)} placeholder="Select statuses..." maxDisplayedChips={2} classes={defaultClasses} />
        </div>
      </Section>

      <Section title="Async Data Fetching with Shimmer">
        <div className="w-80">
          <MultiSelectDropdown value={asyncValue} onValueChange={(values) => setAsyncValue(values)} placeholder="Select countries..." onLoadOptions={handleLoadOptions} loadOnOpen shimmerCount={5} maxDisplayedChips={2} classes={defaultClasses} />
        </div>
        <p className="text-sm text-gray-500 mt-2">Options are fetched from the REST Countries API when dropdown opens.</p>
      </Section>

      <Section title="With Disabled Options">
        <div className="w-72">
          <MultiSelectDropdown options={disabledItemOptions} value={disabledItemValue} onValueChange={(values) => setDisabledItemValue(values)} placeholder="Select options..." maxDisplayedChips={2} classes={defaultClasses} />
        </div>
      </Section>

      <Section title="With Label">
        <div className="w-72">
          <MultiSelectDropdown label="Favorite Fruits" required options={staticOptions} value={labelValue} onValueChange={(values) => setLabelValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={defaultClasses} />
        </div>
      </Section>

      <Section title="Without Chips (Count Only)">
        <div className="w-72">
          <MultiSelectDropdown options={staticOptions} value={noChipsValue} onValueChange={(values) => setNoChipsValue(values)} placeholder="Select fruits..." showSelectedChips={false} classes={defaultClasses} />
        </div>
        <p className="text-sm text-gray-500 mt-2">Shows &quot;X selected&quot; instead of individual chips.</p>
      </Section>

      <Section title="Disabled State">
        <div className="w-72">
          <MultiSelectDropdown options={staticOptions} value={disabledValue} onValueChange={(values) => setDisabledValue(values)} disabled placeholder="Select fruits..." maxDisplayedChips={2} classes={{ ...defaultClasses, trigger: `${defaultClasses.trigger} opacity-50 cursor-not-allowed` }} />
        </div>
      </Section>

      <Section title="Error State">
        <div className="w-72">
          <MultiSelectDropdown label="Required Field" options={staticOptions} value={errorValue} onValueChange={(values) => setErrorValue(values)} required error errorMessage="Please select at least one option" placeholder="Select fruits..." maxDisplayedChips={2} classes={{ ...defaultClasses, trigger: `${defaultClasses.trigger} border-red-500 focus:ring-red-500` }} />
        </div>
      </Section>

      <Section title="Without Chevron">
        <div className="w-72">
          <MultiSelectDropdown options={staticOptions} value={noChevronValue} onValueChange={(values) => setNoChevronValue(values)} showChevron={false} placeholder="Select fruits..." maxDisplayedChips={2} classes={defaultClasses} />
        </div>
      </Section>

      <Section title="Full Width">
        <div className="w-full max-w-md">
          <MultiSelectDropdown options={staticOptions} value={fullWidthValue} onValueChange={(values) => setFullWidthValue(values)} fullWidth placeholder="Select fruits..." maxDisplayedChips={3} classes={defaultClasses} />
        </div>
      </Section>

      <Section title="Dark Theme">
        <div className="w-72">
          <MultiSelectDropdown options={staticOptions} value={darkThemeValue} onValueChange={(values) => setDarkThemeValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={darkClasses} />
        </div>
      </Section>

      <Section title="Purple Theme">
        <div className="w-72">
          <MultiSelectDropdown options={staticOptions} value={purpleThemeValue} onValueChange={(values) => setPurpleThemeValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={purpleClasses} />
        </div>
      </Section>

      <Section title="Custom Checkbox - Green Rounded">
        <div className="w-72">
          <MultiSelectDropdown options={staticOptions} value={greenCheckboxValue} onValueChange={(values) => setGreenCheckboxValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={{ ...defaultClasses, checkbox: "w-4 h-4 shrink-0 border border-gray-300 rounded-full flex items-center justify-center", checkboxChecked: "bg-emerald-500 border-emerald-500 text-white" }} />
        </div>
      </Section>

      <Section title="Custom Checkbox - Orange Square">
        <div className="w-72">
          <MultiSelectDropdown options={staticOptions} value={orangeCheckboxValue} onValueChange={(values) => setOrangeCheckboxValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={{ ...defaultClasses, checkbox: "w-5 h-5 shrink-0 border-2 border-orange-300 rounded-sm flex items-center justify-center", checkboxChecked: "bg-orange-500 border-orange-500 text-white" }} />
        </div>
      </Section>

      <Section title="Custom Checkbox Icon">
        <div className="w-72">
          <MultiSelectDropdown
            options={staticOptions}
            value={customIconValue}
            onValueChange={(values) => setCustomIconValue(values)}
            placeholder="Select fruits..."
            maxDisplayedChips={2}
            checkboxIcon={
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
            classes={{ ...defaultClasses, checkbox: "w-4 h-4 shrink-0 border border-amber-400 rounded flex items-center justify-center", checkboxChecked: "bg-amber-500 border-amber-500 text-white" }}
          />
        </div>
      </Section>

      <Section title="Empty Options">
        <div className="w-72">
          <MultiSelectDropdown options={[]} value={[]} onValueChange={() => {}} placeholder="No options available..." classes={defaultClasses} />
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
              {[
                ["options", "MultiSelectOption[]", "[]", "Array of options to display"],
                ["value", "string[]", "-", "Selected values (required)"],
                ["onValueChange", "(values, options) => void", "-", "Change handler (required)"],
                ["classes", "MultiSelectDropdownClasses", "-", "Class names for all internal elements"],
                ["className", "string", "-", "Root class name"],
                ["placeholder", "string", '"Select options..."', "Placeholder text"],
                ["disabled", "boolean", "false", "Disable the dropdown"],
                ["error", "boolean", "false", "Show error state"],
                ["errorMessage", "ReactNode", "-", "Error message to display"],
                ["label", "ReactNode", "-", "Label for the dropdown"],
                ["required", "boolean", "false", "Whether field is required"],
                ["showChevron", "boolean", "true", "Show dropdown chevron"],
                ["fullWidth", "boolean", "false", "Take full container width"],
                ["loading", "boolean", "false", "External loading state"],
                ["onLoadOptions", "() => Promise<Option[]>", "-", "Async function to load options"],
                ["loadOnOpen", "boolean", "false", "Load options when dropdown opens"],
                ["shimmerCount", "number", "5", "Number of shimmer items"],
                ["maxDisplayedChips", "number", "3", "Max chips before showing +N"],
                ["showSelectedChips", "boolean", "true", "Show chips or count only"],
                ["checkboxIcon", "ReactNode", "CheckIcon", "Custom checkbox icon"],
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

      <Section title="classes Record (MultiSelectDropdownClasses)">
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
                ["triggerText", "Text span inside trigger"],
                ["content", "Dropdown menu container"],
                ["optionList", "Options list wrapper"],
                ["option", "Base option styling"],
                ["optionSelected", "Additional class for selected options"],
                ["optionFocused", "Additional class for keyboard-focused options"],
                ["optionDisabled", "Additional class for disabled options"],
                ["chevron", "Chevron icon"],
                ["checkbox", "Base checkbox styling"],
                ["checkboxChecked", "Additional class for checked checkbox"],
                ["checkboxIcon", "Checkbox icon styling"],
                ["chip", "Selected chip styling"],
                ["chipRemove", "Chip remove button"],
                ["moreCount", '"+N more" badge'],
                ["noResults", "No results message"],
                ["label", "Label element"],
                ["error", "Error message"],
                ["shimmer", "Shimmer container"],
                ["shimmerItem", "Individual shimmer item"],
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

export default MultiSelectDropdownDemo;
