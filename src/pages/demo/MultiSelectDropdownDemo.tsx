import { useState, useCallback } from "react";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown";
import type { MultiSelectOption } from "../../components/MultiSelectDropdown";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper, DemoLabel } from "./components";

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
  { value: "active", label: "Active", content: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /><span>Active</span></div>), selectedContent: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /><span>Active</span></div>) },
  { value: "pending", label: "Pending", content: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500" /><span>Pending</span></div>), selectedContent: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500" /><span>Pending</span></div>) },
  { value: "inactive", label: "Inactive", content: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-400" /><span>Inactive</span></div>), selectedContent: (<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-400" /><span>Inactive</span></div>) },
];

const disabledItemOptions: MultiSelectOption[] = [
  { value: "option1", label: "Available Option 1" },
  { value: "option2", label: "Disabled Option", disabled: true },
  { value: "option3", label: "Available Option 2" },
  { value: "option4", label: "Disabled Option 2", disabled: true },
  { value: "option5", label: "Available Option 3" },
];

const CustomChevronIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} style={style} aria-hidden="true" width={16} height={16}>
    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

interface RestCountryResponse {
  name: { common: string; official: string };
  cca2: string;
  flag: string;
  flags: { png: string; svg: string };
  capital?: string[];
  region: string;
}

const getStyles = (isDarkMode: boolean) => ({
  default: {
    wrapper: "relative",
    trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors min-h-[42px] ${
      isDarkMode
        ? "border-gray-700 bg-gray-800 text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    }`,
    triggerText: "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
    content: `rounded-lg shadow-lg overflow-hidden ${
      isDarkMode
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-200"
    }`,
    optionList: "max-h-60 overflow-y-auto",
    option: `flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed ${
      isDarkMode
        ? "text-gray-200 hover:bg-gray-700"
        : "text-gray-700 hover:bg-gray-50"
    }`,
    optionSelected: isDarkMode ? "bg-blue-900/50" : "bg-blue-50",
    optionFocused: isDarkMode ? "bg-gray-600" : "bg-gray-100",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron: `w-4 h-4 shrink-0 transition-transform duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`,
    checkbox: `w-4 h-4 shrink-0 border rounded flex items-center justify-center ${isDarkMode ? "border-gray-500" : "border-gray-300"}`,
    checkboxChecked: "bg-blue-600 border-blue-600 text-white",
    checkboxIcon: "w-full h-full",
    noResults: `px-3 py-4 text-sm text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`,
    label: `block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`,
    error: `text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`,
    chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md shrink-0 max-w-[100px] ${isDarkMode ? "bg-gray-600 text-gray-200" : "bg-blue-100 text-blue-800"}`,
    chipRemove: `w-3 h-3 shrink-0 cursor-pointer ${isDarkMode ? "hover:text-gray-300" : "hover:text-blue-600"}`,
    moreCount: `inline-flex items-center px-2 py-0.5 text-xs rounded-md shrink-0 ${isDarkMode ? "bg-gray-600 text-gray-300" : "bg-gray-100 text-gray-600"}`,
    shimmerItem: `px-3 py-2 ${isDarkMode ? "bg-gray-700 animate-pulse" : "bg-gray-200 animate-pulse"}`,
  },
  dark: {
    wrapper: "relative",
    trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[42px]",
    triggerText: "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
    content: "rounded-lg shadow-lg overflow-hidden bg-gray-800 border border-gray-700",
    optionList: "max-h-60 overflow-y-auto",
    option: "flex items-center gap-2 px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
    optionSelected: "bg-gray-700",
    optionFocused: "bg-gray-600",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400",
    checkbox: "w-4 h-4 shrink-0 border border-gray-500 rounded flex items-center justify-center",
    checkboxChecked: "bg-blue-500 border-blue-500 text-white",
    checkboxIcon: "w-full h-full",
    noResults: "px-3 py-4 text-sm text-gray-400 text-center",
    label: "block text-sm font-medium text-gray-300 mb-1",
    error: "text-sm text-red-400 mt-1",
    chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-600 text-gray-200 rounded-md shrink-0 max-w-[100px]",
    chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-gray-300",
    moreCount: "inline-flex items-center px-2 py-0.5 text-xs bg-gray-600 text-gray-300 rounded-md shrink-0",
    shimmerItem: "px-3 py-2 bg-gray-700 animate-pulse",
  },
  purple: {
    wrapper: "relative",
    trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-purple-300 rounded-lg bg-white hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[42px]",
    triggerText: "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
    content: "rounded-lg shadow-lg overflow-hidden bg-purple-50 border border-purple-200",
    optionList: "max-h-60 overflow-y-auto",
    option: "flex items-center gap-2 px-3 py-2 cursor-pointer text-purple-900 hover:bg-purple-100 transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
    optionSelected: "bg-purple-200",
    optionFocused: "bg-purple-100",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-purple-600",
    checkbox: "w-4 h-4 shrink-0 border border-purple-400 rounded flex items-center justify-center",
    checkboxChecked: "bg-purple-600 border-purple-600 text-white",
    checkboxIcon: "w-full h-full",
    noResults: "px-3 py-4 text-sm text-purple-500 text-center",
    label: "block text-sm font-medium text-purple-900 mb-1",
    error: "text-sm text-purple-600 mt-1",
    chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-200 text-purple-800 rounded-md shrink-0 max-w-[100px]",
    chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-purple-600",
    moreCount: "inline-flex items-center px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-md shrink-0",
    shimmerItem: "px-3 py-2",
  },
});

const MultiSelectDropdownDemo = () => {
  const { isDarkMode } = useTheme();
  const s = getStyles(isDarkMode);

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
  const [keyboardDemoValue, setKeyboardDemoValue] = useState<string[]>([]);
  const [controlledOpen, setControlledOpen] = useState(false);
  const [controlledValue, setControlledValue] = useState<string[]>([]);
  const [formIntegrationValue, setFormIntegrationValue] = useState<string[]>([]);
  const [posTopValue, setPosTopValue] = useState<string[]>([]);
  const [posBotValue, setPosBotValue] = useState<string[]>([]);
  const [keepMountedValue, setKeepMountedValue] = useState<string[]>([]);
  const [customGapValue, setCustomGapValue] = useState<string[]>([]);
  const [zIndexValue, setZIndexValue] = useState<string[]>([]);
  const [customKeyDownValue, setCustomKeyDownValue] = useState<string[]>([]);
  const [classNameStyleValue, setClassNameStyleValue] = useState<string[]>([]);
  const [classNameDemoValue, setClassNameDemoValue] = useState<string[]>([]);
  const [ariaLabelDemoValue, setAriaLabelDemoValue] = useState<string[]>([]);
  const [focusMessage, setFocusMessage] = useState("");
  const [keyDownMessage, setKeyDownMessage] = useState("");

  const mapCountryToOption = useCallback((country: RestCountryResponse): MultiSelectOption => ({
    value: country.cca2,
    label: country.name.common,
    content: (
      <div className="flex items-center gap-2">
        <img src={country.flags.png} alt="" className="w-5 h-4 object-cover rounded-sm" />
        <div className="flex flex-col">
          <span className="text-sm">{country.name.common}</span>
          <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{country.capital?.[0] || country.region}</span>
        </div>
      </div>
    ),
    selectedContent: <span className="truncate">{country.name.common}</span>,
  }), [isDarkMode]);

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
    <div className="space-y-16">
      <header>
        <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          MultiSelectDropdown
        </h1>
        <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          A multi-select dropdown component without search. Supports keyboard navigation,
          async option loading, chips or count display, and full customization via the classes prop.
        </p>
        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Installation
          </h3>
          <CodeBlock isDarkMode={isDarkMode} code={`import { MultiSelectDropdown } from "@kern-ui/multi-select-dropdown";`} />
        </div>
      </header>

      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Examples
        </h2>

        <Section title="Basic Usage" description="Standard multi-select with chips." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={basicValue} onValueChange={(values) => setBasicValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={s.default} />
            </div>
          </DemoWrapper>
          {basicValue.length > 0 && (
            <p className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              Selected: {basicValue.join(", ")}
            </p>
          )}
        </Section>

        <Section title="State Variations" description="Overview of different states: default, selected, disabled, error, and loading." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Default (empty)</DemoLabel>
                <MultiSelectDropdown options={staticOptions} value={[]} onValueChange={() => {}} placeholder="Select fruits..." maxDisplayedChips={2} classes={s.default} />
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Selected (with chips)</DemoLabel>
                <MultiSelectDropdown options={staticOptions} value={["apple", "banana"]} onValueChange={() => {}} placeholder="Select fruits..." maxDisplayedChips={2} classes={s.default} />
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Disabled</DemoLabel>
                <MultiSelectDropdown options={staticOptions} value={["apple", "banana"]} onValueChange={() => {}} disabled placeholder="Select fruits..." maxDisplayedChips={2} classes={{ ...s.default, trigger: `${s.default.trigger} opacity-50 cursor-not-allowed` }} />
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Error state</DemoLabel>
                <MultiSelectDropdown options={staticOptions} value={[]} onValueChange={() => {}} error errorMessage="Please select at least one" placeholder="Select fruits..." classes={{ ...s.default, trigger: `${s.default.trigger} border-red-500 focus:ring-red-500` }} />
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Loading state</DemoLabel>
                <MultiSelectDropdown options={[]} value={[]} onValueChange={() => {}} placeholder="Loading..." loading shimmerCount={4} classes={s.default} />
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Count only (no chips)</DemoLabel>
                <MultiSelectDropdown options={staticOptions} value={["apple", "banana", "cherry"]} onValueChange={() => {}} placeholder="Select fruits..." showSelectedChips={false} classes={s.default} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="With Custom Content" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={countryOptions} value={countryValue} onValueChange={(values) => setCountryValue(values)} placeholder="Select countries..." maxDisplayedChips={2} classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="With Status Indicators" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={statusOptions} value={statusValue} onValueChange={(values) => setStatusValue(values)} placeholder="Select statuses..." maxDisplayedChips={2} classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Async Data Fetching with Shimmer" description="Options loaded when dropdown opens." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-80">
              <MultiSelectDropdown value={asyncValue} onValueChange={(values) => setAsyncValue(values)} placeholder="Select countries..." onLoadOptions={handleLoadOptions} loadOnOpen shimmerCount={5} maxDisplayedChips={2} classes={s.default} />
            </div>
          </DemoWrapper>
          <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Options are fetched from the REST Countries API when the dropdown opens.
          </p>
        </Section>

        <Section title="With Disabled Options" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={disabledItemOptions} value={disabledItemValue} onValueChange={(values) => setDisabledItemValue(values)} placeholder="Select options..." maxDisplayedChips={2} classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="With Label" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown label="Favorite Fruits" required options={staticOptions} value={labelValue} onValueChange={(values) => setLabelValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Controlled Open State" description="Use open and onOpenChange to control the dropdown programmatically." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-end gap-4">
              <div className="w-72">
                <MultiSelectDropdown options={staticOptions} value={controlledValue} onValueChange={setControlledValue} open={controlledOpen} onOpenChange={setControlledOpen} placeholder="Controlled dropdown..." maxDisplayedChips={2} classes={s.default} />
              </div>
              <button type="button" className={`px-4 py-2 text-sm rounded-lg border transition-colors ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`} onClick={() => setControlledOpen((o) => !o)}>
                {controlledOpen ? "Close" : "Open"}
              </button>
              {controlledValue.length > 0 && (
                <button type="button" className={`px-4 py-2 text-sm rounded-lg border transition-colors ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`} onClick={() => setControlledValue([])}>
                  Clear
                </button>
              )}
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Without Chips (Count Only)" description='Shows "X selected" instead of chips.' isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={noChipsValue} onValueChange={(values) => setNoChipsValue(values)} placeholder="Select fruits..." showSelectedChips={false} classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Disabled State" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={disabledValue} onValueChange={(values) => setDisabledValue(values)} disabled placeholder="Select fruits..." maxDisplayedChips={2} classes={{ ...s.default, trigger: `${s.default.trigger} opacity-50 cursor-not-allowed` }} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Error State" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown label="Required Field" options={staticOptions} value={errorValue} onValueChange={(values) => setErrorValue(values)} required error errorMessage="Please select at least one option" placeholder="Select fruits..." maxDisplayedChips={2} classes={{ ...s.default, trigger: `${s.default.trigger} border-red-500 focus:ring-red-500` }} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Native Form Participation" description="When name is set, a hidden input is rendered so the value participates in native form submissions and FormData." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); alert(`FormData: fruits = ${fd.get("fruits")}`); }} className="flex items-end gap-4">
              <div className="w-72">
                <MultiSelectDropdown name="fruits" label="Fruits (in form)" options={staticOptions} value={formIntegrationValue} onValueChange={setFormIntegrationValue} placeholder="Select fruits..." maxDisplayedChips={2} classes={s.default} />
              </div>
              <button type="submit" className={`px-4 py-2 text-sm rounded-lg border transition-colors ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>Submit</button>
            </form>
          </DemoWrapper>
        </Section>

        <Section title="Without Chevron" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={noChevronValue} onValueChange={(values) => setNoChevronValue(values)} showChevron={false} placeholder="Select fruits..." maxDisplayedChips={2} classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Full Width" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full max-w-md">
              <MultiSelectDropdown options={staticOptions} value={fullWidthValue} onValueChange={(values) => setFullWidthValue(values)} fullWidth placeholder="Select fruits..." maxDisplayedChips={3} classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Dropdown Position" description="Control whether the popup opens above or below the trigger. Auto-flips when there isn't enough space." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-8">
              <div>
                <DemoLabel isDarkMode={isDarkMode}>dropdownPosition=&quot;bottom&quot; (default)</DemoLabel>
                <div className="w-72">
                  <MultiSelectDropdown options={staticOptions} value={posBotValue} onValueChange={setPosBotValue} dropdownPosition="bottom" placeholder="Opens below..." maxDisplayedChips={2} classes={s.default} />
                </div>
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>dropdownPosition=&quot;top&quot;</DemoLabel>
                <div className="w-72">
                  <MultiSelectDropdown options={staticOptions} value={posTopValue} onValueChange={setPosTopValue} dropdownPosition="top" placeholder="Opens above..." maxDisplayedChips={2} classes={s.default} />
                </div>
              </div>
            </div>
          </DemoWrapper>
          <div className={`mt-3 p-3 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}>
            <p>The dropdown renders via a <code className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}>React Portal</code> into <code className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}>document.body</code> (or a custom container via portalContainer).</p>
          </div>
        </Section>

        <Section title="Custom Portal Container" description="Use portalContainer to render the dropdown into a specific DOM element instead of document.body." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={[]} onValueChange={() => {}} placeholder="Renders to document.body..." portalContainer={null} classes={s.default} />
            </div>
          </DemoWrapper>
          <p className={`text-sm mt-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Pass a specific HTMLElement to <code className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>portalContainer</code> or <code className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>null</code> for document.body (default).</p>
        </Section>

        <Section title="Keep Mounted" description="Use keepMounted to keep the dropdown portal in the DOM when closed (hidden with display: none)." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={keepMountedValue} onValueChange={setKeepMountedValue} keepMounted placeholder="Select fruits..." maxDisplayedChips={2} classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Dropdown Gap" description="Control the gap between the trigger and dropdown with dropdownGap (pixels). Default is 4." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-8">
              <div>
                <DemoLabel isDarkMode={isDarkMode}>No gap (0px)</DemoLabel>
                <div className="w-72">
                  <MultiSelectDropdown options={staticOptions} value={[]} onValueChange={() => {}} dropdownGap={0} placeholder="No gap..." classes={s.default} />
                </div>
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Large gap (16px)</DemoLabel>
                <div className="w-72">
                  <MultiSelectDropdown options={staticOptions} value={customGapValue} onValueChange={setCustomGapValue} dropdownGap={16} placeholder="Large gap..." maxDisplayedChips={2} classes={s.default} />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Z-Index" description="Control the z-index of the dropdown portal with dropdownZIndex. Default is 50." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={zIndexValue} onValueChange={setZIndexValue} dropdownZIndex={9999} placeholder="Select (z-index: 9999)..." maxDisplayedChips={2} classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Form Integration (onBlur / onFocus)" description="Use onBlur and onFocus for integration with form libraries like React Hook Form or Formik." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={[]} onValueChange={() => {}} placeholder="Focus or blur me..." onFocus={() => setFocusMessage("Dropdown focused")} onBlur={() => setFocusMessage("Dropdown blurred")} maxDisplayedChips={2} classes={s.default} />
            </div>
          </DemoWrapper>
          {focusMessage && <p className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{focusMessage}</p>}
        </Section>

        <Section title="Custom KeyDown Handler" description="Provide onKeyDown to intercept or extend keyboard behavior. Call preventDefault() to override internal behavior." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={customKeyDownValue} onValueChange={setCustomKeyDownValue} placeholder="Try pressing 'x'..." maxDisplayedChips={2} onKeyDown={(e) => { if (e.key === "x" || e.key === "X") { e.preventDefault(); setKeyDownMessage("You pressed 'x' - custom handler!"); setTimeout(() => setKeyDownMessage(""), 2000); } }} classes={s.default} />
            </div>
          </DemoWrapper>
          {keyDownMessage && <p className={`text-sm mt-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>{keyDownMessage}</p>}
        </Section>

        <Section title="className, style & aria-label" description="Use className for root, style for inline styles, and aria-label to customize the listbox accessible label." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-6">
              <div>
                <DemoLabel isDarkMode={isDarkMode}>className (root)</DemoLabel>
                <div className="w-72">
                  <MultiSelectDropdown options={staticOptions} value={classNameDemoValue} onValueChange={setClassNameDemoValue} placeholder="Select fruits..." className={isDarkMode ? "opacity-90" : "opacity-95"} maxDisplayedChips={2} classes={s.default} />
                </div>
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>style (inline on root)</DemoLabel>
                <div className="w-72">
                  <MultiSelectDropdown options={staticOptions} value={classNameStyleValue} onValueChange={setClassNameStyleValue} placeholder="Select fruits..." style={{ maxWidth: "320px", margin: "0 auto" }} maxDisplayedChips={2} classes={s.default} />
                </div>
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>aria-label=&quot;Fruit options&quot;</DemoLabel>
                <div className="w-72">
                  <MultiSelectDropdown options={staticOptions} value={ariaLabelDemoValue} onValueChange={setAriaLabelDemoValue} placeholder="Select fruits..." aria-label="Fruit options" maxDisplayedChips={2} classes={s.default} />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Dark Theme" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={darkThemeValue} onValueChange={(values) => setDarkThemeValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={s.dark} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Purple Theme" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={purpleThemeValue} onValueChange={(values) => setPurpleThemeValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={s.purple} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Checkbox - Green Rounded" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={greenCheckboxValue} onValueChange={(values) => setGreenCheckboxValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={{ ...s.default, checkbox: `w-4 h-4 shrink-0 border rounded-full flex items-center justify-center ${isDarkMode ? "border-gray-500" : "border-gray-300"}`, checkboxChecked: "bg-emerald-500 border-emerald-500 text-white" }} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Checkbox - Orange Square" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown options={staticOptions} value={orangeCheckboxValue} onValueChange={(values) => setOrangeCheckboxValue(values)} placeholder="Select fruits..." maxDisplayedChips={2} classes={{ ...s.default, checkbox: "w-5 h-5 shrink-0 border-2 border-orange-300 rounded-sm flex items-center justify-center", checkboxChecked: "bg-orange-500 border-orange-500 text-white" }} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Checkbox Icon" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <MultiSelectDropdown
                options={staticOptions}
                value={customIconValue}
                onValueChange={(values) => setCustomIconValue(values)}
                placeholder="Select fruits..."
                maxDisplayedChips={2}
                checkboxIcon={
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                }
                classes={{ ...s.default, checkbox: "w-4 h-4 shrink-0 border border-amber-400 rounded flex items-center justify-center", checkboxChecked: "bg-amber-500 border-amber-500 text-white" }}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Shimmer Count Variations" description="Control the number of shimmer items during loading with shimmerCount." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-8">
              <div className="w-72">
                <DemoLabel isDarkMode={isDarkMode}>3 shimmer items</DemoLabel>
                <MultiSelectDropdown options={[]} value={[]} onValueChange={() => {}} placeholder="Loading..." loading shimmerCount={3} classes={s.default} />
              </div>
              <div className="w-72">
                <DemoLabel isDarkMode={isDarkMode}>8 shimmer items</DemoLabel>
                <MultiSelectDropdown options={[]} value={[]} onValueChange={() => {}} placeholder="Loading..." loading shimmerCount={8} classes={s.default} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Empty Options" description="When no options are available, noResultsText or noResultsContent is shown." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-8">
              <div className="w-72">
                <DemoLabel isDarkMode={isDarkMode}>Default text (noResultsText)</DemoLabel>
                <MultiSelectDropdown options={[]} value={[]} onValueChange={() => {}} placeholder="No options..." classes={s.default} />
              </div>
              <div className="w-72">
                <DemoLabel isDarkMode={isDarkMode}>Custom noResultsContent</DemoLabel>
                <MultiSelectDropdown options={[]} value={[]} onValueChange={() => {}} placeholder="Custom empty..." noResultsContent={<span className="flex flex-col items-center gap-1 py-2"><span className={`text-lg ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>📭</span><span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Nothing here yet</span></span>} classes={s.default} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Combined: All Features" description="Label, required, custom chevron, chips, and classes together." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-80">
              <MultiSelectDropdown label="Favorite Fruits" required options={staticOptions} value={[]} onValueChange={() => {}} placeholder="Select fruits..." maxDisplayedChips={3} ChevronIcon={CustomChevronIcon} classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Keyboard Navigation" isDarkMode={isDarkMode}>
          <div className={`mb-4 p-4 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}>
            <p className="font-semibold mb-2">Keyboard shortcuts</p>
            <ul className="space-y-2">
              {[
                ["Enter / Space", "Open dropdown / toggle focused option"],
                ["↓", "Open dropdown / move to next option"],
                ["↑", "Move to previous option"],
                ["Home", "Move to first option"],
                ["End", "Move to last option"],
                ["Escape", "Close dropdown, restore focus to trigger"],
                ["Tab", "Close dropdown, move focus forward"],
              ].map(([key, desc]) => (
                <li key={key} className="flex items-center gap-2">
                  <kbd className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}>{key}</kbd>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <MultiSelectDropdown options={staticOptions} value={keyboardDemoValue} onValueChange={setKeyboardDemoValue} placeholder="Try keyboard navigation..." classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Data Attributes" isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="overflow-x-auto">
              <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
                <thead>
                  <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <th className="text-left py-3 pr-4 font-semibold">Attribute</th>
                    <th className="text-left py-3 pr-4 font-semibold">Applied To</th>
                    <th className="text-left py-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                  {[
                    ["data-open", "root, trigger", "Present when the dropdown is open"],
                    ["data-disabled", "root, trigger, option", "Present when disabled"],
                    ["data-error", "root, trigger", "Present when in error state"],
                    ["data-full-width", "root", "Present when fullWidth is true"],
                    ["data-state", "content (portal)", '"open" or "closed"'],
                    ["data-position", "content (portal)", '"top" or "bottom" (actual position)'],
                  ].map(([attr, target, desc]) => (
                    <tr key={attr}>
                      <td className={`py-3 pr-4 font-mono ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{attr}</td>
                      <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{target}</td>
                      <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`text-sm mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Example usage:{" "}
              <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>data-[selected]:font-bold</code>
              ,{" "}
              <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>data-[disabled]:opacity-50</code>
            </p>
          </DemoWrapper>
        </Section>
      </div>

      <div className="space-y-8">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          API Reference
        </h2>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            MultiSelectDropdown Props
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                {[
                  ["options", "MultiSelectOption[]", "[]", "Array of options to display"],
                  ["value", "string[]", "-", "Selected values (required)"],
                  ["onValueChange", "(values, options) => void", "-", "Change handler (required)"],
                  ["id", "string", "auto-generated", "ID for ARIA and form association"],
                  ["name", "string", "-", "Form field name — hidden input with comma-separated values"],
                  ["classes", "MultiSelectDropdownClasses", "-", "Class names for internal elements"],
                  ["className", "string", "-", "Root class name"],
                  ["placeholder", "ReactNode", '"Select options..."', "Placeholder when nothing selected"],
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
                  ["onLoadError", "(error: unknown) => void", "-", "Callback when async loading fails"],
                  ["shimmerCount", "number", "5", "Number of shimmer items"],
                  ["maxDisplayedChips", "number", "3", "Max chips before showing +N"],
                  ["showSelectedChips", "boolean", "true", "Show chips or count only"],
                  ["checkboxIcon", "ReactNode", "CheckIcon", "Custom checkbox icon"],
                  ["open", "boolean", "-", "Controlled open state"],
                  ["defaultOpen", "boolean", "false", "Initial open state (uncontrolled)"],
                  ["onOpenChange", "(open: boolean) => void", "-", "Called when open state changes"],
                  ["style", "CSSProperties", "-", "Root inline styles"],
                  ["aria-label", "string", "-", "Listbox aria-label override"],
                  ["onBlur", "() => void", "-", "Trigger blur callback"],
                  ["onFocus", "() => void", "-", "Trigger focus callback"],
                  ["onKeyDown", "(e: KeyboardEvent) => void", "-", "Custom keydown (preventDefault to override)"],
                  ["ChevronIcon", "ComponentType", "ChevronDownIcon", "Custom chevron icon"],
                  ["noResultsText", "string", '"No options available"', "Default empty state text"],
                  ["noResultsContent", "ReactNode", "-", "Empty state (overrides noResultsText when set)"],
                  ["keepMounted", "boolean", "false", "Keep listbox in DOM when closed"],
                  ["portalContainer", "HTMLElement | null", "document.body", "Portal target"],
                  ["dropdownPosition", '"top" | "bottom"', '"bottom"', "Preferred list position"],
                  ["dropdownZIndex", "number", "50", "Listbox z-index"],
                  ["dropdownGap", "number", "4", "Gap between trigger and list (px)"],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop}>
                    <td className={`py-3 pr-4 font-mono ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{prop}</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{type}</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>{def}</td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            classes Record (MultiSelectDropdownClasses)
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Key</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
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
                    <td className={`py-3 pr-4 font-mono ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{key}</td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Performance & Best Practices</h2>
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Recommended Limits</h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li><strong>Maximum options:</strong> The list is not virtualized. For optimal performance, limit static options to 500 or fewer. For larger datasets, use <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>onLoadOptions</code> with server-side data.</li>
            <li><strong>Controlled vs Uncontrolled open:</strong> Choose one mode for <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>open</code> / <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>defaultOpen</code> at mount and do not switch.</li>
            <li><strong>Async loading:</strong> Use <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>onLoadError</code> to handle network failures gracefully.</li>
            <li><strong>keepMounted:</strong> Use sparingly; keeping many dropdowns in the DOM when closed can increase memory use.</li>
          </ul>
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Form Integration</h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>Use the <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>name</code> prop for native form submission; a hidden input is rendered with the selected values (comma-separated).</li>
            <li>Use <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>onBlur</code> and <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>onFocus</code> for React Hook Form, Formik, etc.</li>
            <li>Use <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>error</code> and <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>errorMessage</code> for validation; the message uses <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>role=&quot;alert&quot;</code>.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Accessibility</h2>
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Features</h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>Trigger uses <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>role=&quot;combobox&quot;</code> with <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-expanded</code>, <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-haspopup=&quot;listbox&quot;</code>, <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-controls</code>, and <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-activedescendant</code>.</li>
            <li>Listbox uses <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>role=&quot;listbox&quot;</code> with <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-multiselectable=&quot;true&quot;</code> and <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>role=&quot;option&quot;</code> items.</li>
            <li>Full keyboard navigation: Enter/Space (toggle option), ArrowDown/Up, Home, End, Escape, Tab. Focus restores to trigger on close.</li>
            <li><code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-live=&quot;polite&quot;</code> status region announces loading and selection count. Disabled options have <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-disabled</code> and are skipped by keyboard.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectDropdownDemo;
