import { useState, useCallback } from "react";
import { SearchableDropdown } from "../../components/SearchableDropdown";
import type { SearchableDropdownOptionType } from "../../components/SearchableDropdown";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper, DemoLabel } from "./components";

interface RestCountryResponse {
  name: { common: string; official: string };
  cca2: string;
  flag: string;
  flags: { png: string; svg: string };
  capital?: string[];
  region: string;
}

const fruitOptions: SearchableDropdownOptionType[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
  { value: "kiwi", label: "Kiwi" },
  { value: "lemon", label: "Lemon" },
];

const countryOptions: SearchableDropdownOptionType[] = [
  { value: "us", label: "United States", content: <span>🇺🇸 United States</span> },
  { value: "gb", label: "United Kingdom", content: <span>🇬🇧 United Kingdom</span> },
  { value: "ca", label: "Canada", content: <span>🇨🇦 Canada</span> },
  { value: "au", label: "Australia", content: <span>🇦🇺 Australia</span> },
  { value: "de", label: "Germany", content: <span>🇩🇪 Germany</span> },
  { value: "fr", label: "France", content: <span>🇫🇷 France</span> },
  { value: "jp", label: "Japan", content: <span>🇯🇵 Japan</span> },
];

const statusOptions: SearchableDropdownOptionType[] = [
  {
    value: "active",
    label: "Active",
    content: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span>Active</span>
      </span>
    ),
    selectedContent: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span>Active</span>
      </span>
    ),
  },
  {
    value: "pending",
    label: "Pending",
    content: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-500" />
        <span>Pending</span>
      </span>
    ),
    selectedContent: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-500" />
        <span>Pending</span>
      </span>
    ),
  },
  {
    value: "inactive",
    label: "Inactive",
    content: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gray-400" />
        <span>Inactive</span>
      </span>
    ),
    selectedContent: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gray-400" />
        <span>Inactive</span>
      </span>
    ),
  },
];

const disabledItemOptions: SearchableDropdownOptionType[] = [
  { value: "option1", label: "Available Option 1" },
  { value: "option2", label: "Disabled Option", disabled: true },
  { value: "option3", label: "Available Option 2" },
  { value: "option4", label: "Disabled Option 2", disabled: true },
  { value: "option5", label: "Available Option 3" },
];

const StarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true" width={16} height={16}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CustomChevronIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} style={style} aria-hidden="true" width={16} height={16}>
    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const getStyles = (isDarkMode: boolean) => ({
  default: {
    wrapper: "relative",
    trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors ${
      isDarkMode
        ? "border-gray-700 bg-gray-800 text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    }`,
    triggerText: "flex-1 truncate",
    content: `rounded-lg shadow-lg overflow-hidden ${
      isDarkMode
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-200"
    }`,
    searchInput: `flex items-center gap-2 px-3 py-2 border-b ${
      isDarkMode
        ? "border-gray-700 bg-gray-900"
        : "border-gray-200 bg-gray-50"
    }`,
    searchInputElement: `flex-1 bg-transparent focus:outline-none ${
      isDarkMode
        ? "text-white placeholder:text-gray-400"
        : "text-gray-900 placeholder:text-gray-400"
    }`,
    searchIcon: `w-4 h-4 shrink-0 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`,
    optionList: "max-h-60 overflow-y-auto",
    option: `flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
      isDarkMode
        ? "text-gray-200 hover:bg-gray-700"
        : "text-gray-700 hover:bg-gray-50"
    }`,
    optionSelected: isDarkMode ? "bg-blue-900/50 font-medium" : "bg-blue-50 font-medium",
    optionFocused: isDarkMode ? "bg-gray-700" : "bg-gray-100",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron: `w-4 h-4 shrink-0 transition-transform duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`,
    checkIcon: `w-4 h-4 shrink-0 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`,
    clearIcon: `absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${isDarkMode ? "text-gray-400" : "text-gray-500"}`,
    noResults: `px-3 py-4 text-sm text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`,
    label: `block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`,
    error: `text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`,
    shimmerItem: `mx-2 my-1.5 h-4 rounded ${isDarkMode ? "bg-gray-700 animate-pulse" : "bg-gray-200 animate-pulse"}`,
  },
  dark: {
    wrapper: "relative",
    trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500",
    triggerText: "flex-1 truncate",
    content: "rounded-lg shadow-lg overflow-hidden bg-gray-800 border border-gray-700",
    searchInput: "flex items-center gap-2 px-3 py-2 border-b border-gray-600 bg-gray-900",
    searchInputElement: "flex-1 bg-transparent text-white placeholder:text-gray-400 focus:outline-none",
    searchIcon: "w-4 h-4 shrink-0 text-gray-400",
    optionList: "max-h-60 overflow-y-auto",
    option: "flex items-center justify-between px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 transition-colors",
    optionSelected: "bg-gray-600",
    optionFocused: "bg-gray-700",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400",
    checkIcon: "w-4 h-4 shrink-0 text-blue-400",
    noResults: "px-3 py-4 text-sm text-gray-400 text-center",
  },
  warm: {
    wrapper: "relative",
    trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-amber-300 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400",
    triggerText: "flex-1 truncate",
    content: "rounded-lg shadow-lg overflow-hidden bg-amber-50 border border-amber-200",
    searchInput: "flex items-center gap-2 px-3 py-2 border-b border-amber-200 bg-amber-100",
    searchInputElement: "flex-1 bg-transparent text-amber-900 placeholder:text-amber-600 focus:outline-none",
    searchIcon: "w-4 h-4 shrink-0 text-amber-600",
    optionList: "max-h-60 overflow-y-auto",
    option: "flex items-center justify-between px-3 py-2 cursor-pointer text-amber-900 hover:bg-amber-100 transition-colors",
    optionSelected: "bg-amber-200",
    optionFocused: "bg-amber-100",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-amber-600",
    checkIcon: "w-4 h-4 shrink-0 text-amber-700",
    noResults: "px-3 py-4 text-sm text-amber-600 text-center",
  },
  content: isDarkMode ? "text-gray-300" : "text-gray-700",
  contentStrong: isDarkMode ? "text-white" : "text-gray-900",
});

const SearchableDropdownDemo = () => {
  const { isDarkMode } = useTheme();
  const s = getStyles(isDarkMode);

  const [basicValue, setBasicValue] = useState<string | null>(null);
  const [countryValue, setCountryValue] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState<string | null>(null);
  const [disabledItemValue, setDisabledItemValue] = useState<string | null>(null);
  const [disabledValue] = useState<string | null>("apple");
  const [errorValue, setErrorValue] = useState<string | null>(null);
  const [labeledValue, setLabeledValue] = useState<string | null>(null);
  const [asyncCountryValue, setAsyncCountryValue] = useState<string | null>(null);
  const [asyncStaticInitialValue, setAsyncStaticInitialValue] = useState<string | null>(null);
  const [asyncPrefetchValue, setAsyncPrefetchValue] = useState<string | null>(null);
  const [customSelectedValue, setCustomSelectedValue] = useState<string | null>(null);
  const [noIconValue, setNoIconValue] = useState<string | null>(null);
  const [darkThemeValue, setDarkThemeValue] = useState<string | null>(null);
  const [warmThemeValue, setWarmThemeValue] = useState<string | null>(null);
  const [clearableValue, setClearableValue] = useState<string | null>(null);
  const [noSearchValue, setNoSearchValue] = useState<string | null>(null);
  const [fullWidthValue, setFullWidthValue] = useState<string | null>(null);
  const [requiredValue, setRequiredValue] = useState<string | null>(null);
  const [keepMountedValue, setKeepMountedValue] = useState<string | null>(null);
  const [formIntegrationValue, setFormIntegrationValue] = useState<string | null>(null);
  const [renderTriggerValue, setRenderTriggerValue] = useState<string | null>(null);
  const [posTopValue, setPosTopValue] = useState<string | null>(null);
  const [posBotValue, setPosBotValue] = useState<string | null>(null);
  const [focusBlurValue, setFocusBlurValue] = useState<string | null>(null);
  const [noChevronValue, setNoChevronValue] = useState<string | null>(null);
  const [customChevronValue, setCustomChevronValue] = useState<string | null>(null);
  const [customGapValue, setCustomGapValue] = useState<string | null>(null);
  const [zIndexValue, setZIndexValue] = useState<string | null>(null);
  const [customClearIconValue, setCustomClearIconValue] = useState<string | null>("apple");
  const [customCheckIconValue, setCustomCheckIconValue] = useState<string | null>(null);
  const [customKeyDownValue, setCustomKeyDownValue] = useState<string | null>(null);
  const [classNameStyleValue, setClassNameStyleValue] = useState<string | null>(null);

  const [controlledOpen, setControlledOpen] = useState(false);
  const [controlledValue, setControlledValue] = useState<string | null>(null);
  const [focusMessage, setFocusMessage] = useState<string>("");
  const [keyDownMessage, setKeyDownMessage] = useState<string>("");

  const mapCountryToOption = useCallback(
    (country: RestCountryResponse): SearchableDropdownOptionType => ({
      value: country.cca2,
      label: country.name.common,
      content: (
        <span className="flex items-center gap-2">
          <img src={country.flags.png} alt={`${country.name.common} flag`} className="w-5 h-4 object-cover rounded-sm" />
          <span className="flex flex-col">
            <span className="text-sm">{country.name.common}</span>
            <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{country.capital?.[0] || country.region}</span>
          </span>
        </span>
      ),
      selectedContent: (
        <span className="flex items-center gap-2">
          <img src={country.flags.png} alt={`${country.name.common} flag`} className="w-5 h-4 object-cover rounded-sm" />
          <span>{country.name.common}</span>
        </span>
      ),
    }),
    [isDarkMode],
  );

  const handleAsyncSearch = useCallback(
    async (query: string): Promise<SearchableDropdownOptionType[]> => {
      if (!query.trim()) return [];
      const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error("Failed to fetch countries");
      }
      const data: RestCountryResponse[] = await response.json();
      return data.slice(0, 10).map(mapCountryToOption);
    },
    [mapCountryToOption],
  );

  const handleLoadInitialOptions = useCallback(async (): Promise<SearchableDropdownOptionType[]> => {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,cca2,capital,region",
    );
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
          SearchableDropdown
        </h1>
        <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          A fully accessible searchable select component with real-time filtering. Supports synchronous
          static options and asynchronous search with debouncing. Built on the same architecture as Dropdown
          with portal rendering, keyboard navigation, and complete customization.
        </p>
        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { SearchableDropdown } from "@kern-ui/searchable-dropdown";`}
          />
        </div>
      </header>

      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Examples
        </h2>

        <Section title="Basic Usage" description="Standard searchable dropdown with string options." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown
                options={fruitOptions}
                value={basicValue}
                onValueChange={(value) => setBasicValue(value)}
                placeholder="Search fruits..."
                classes={s.default}
              />
            </div>
          </DemoWrapper>
          {basicValue && (
            <p className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              Selected: {basicValue}
            </p>
          )}
        </Section>

        <Section title="State Variations" description="Overview of different dropdown states: default, selected, disabled, error, and loading." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Default (empty)</DemoLabel>
                <SearchableDropdown options={fruitOptions} placeholder="Search fruits..." classes={s.default} />
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Selected</DemoLabel>
                <SearchableDropdown options={fruitOptions} defaultValue="banana" placeholder="Search fruits..." classes={s.default} />
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Disabled</DemoLabel>
                <SearchableDropdown options={fruitOptions} defaultValue="cherry" disabled placeholder="Search fruits..." classes={{ ...s.default, trigger: `${s.default.trigger} opacity-50 cursor-not-allowed` }} />
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Error state</DemoLabel>
                <SearchableDropdown options={fruitOptions} placeholder="Search fruits..." error errorMessage="This field is required" classes={{ ...s.default, trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors ${isDarkMode ? "border-red-500 bg-gray-800 text-white hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500" : "border-red-500 bg-white text-gray-900 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"}` }} />
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Loading state</DemoLabel>
                <SearchableDropdown options={[]} placeholder="Loading..." loading={true} shimmerCount={4} classes={s.default} />
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Clearable (selected)</DemoLabel>
                <SearchableDropdown options={fruitOptions} defaultValue="grape" clearable placeholder="Search fruits..." classes={s.default} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Uncontrolled (defaultValue)" description="Use defaultValue for uncontrolled mode. No value or onValueChange needed for basic usage." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown options={fruitOptions} defaultValue="cherry" placeholder="Search fruits..." classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Controlled Open State" description="Use open and onOpenChange to control the dropdown programmatically." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-end gap-4">
              <div className="w-64">
                <SearchableDropdown options={fruitOptions} value={controlledValue} onValueChange={(v) => setControlledValue(v)} open={controlledOpen} onOpenChange={setControlledOpen} placeholder="Controlled dropdown..." classes={s.default} />
              </div>
              <button type="button" className={`px-4 py-2 text-sm rounded-lg border transition-colors ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`} onClick={() => setControlledOpen((o) => !o)}>
                {controlledOpen ? "Close" : "Open"}
              </button>
              {controlledValue && (
                <button type="button" className={`px-4 py-2 text-sm rounded-lg border transition-colors ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`} onClick={() => setControlledValue(null)}>
                  Clear
                </button>
              )}
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Clearable" description="When clearable is true, a clear button appears after selection. Press Delete/Backspace on the trigger to clear." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown options={fruitOptions} value={clearableValue} onValueChange={(v) => setClearableValue(v)} clearable placeholder="Search (clearable)..." classes={s.default} />
            </div>
          </DemoWrapper>
          {clearableValue && (
            <p className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>Selected: {clearableValue}</p>
          )}
        </Section>

        <Section title="Custom Trigger (renderTrigger)" description="Use renderTrigger to fully customize the trigger element while retaining all keyboard and ARIA behavior." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-72">
              <SearchableDropdown
                options={fruitOptions}
                value={renderTriggerValue}
                onValueChange={(v) => setRenderTriggerValue(v)}
                placeholder="Pick a fruit..."
                classes={s.default}
                renderTrigger={({ ref, isOpen, selectedOption, placeholder: ph, ...rest }) => (
                  <button
                    ref={ref as React.RefCallback<HTMLButtonElement>}
                    {...rest}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl border-2 transition-all ${isOpen ? (isDarkMode ? "border-blue-500 bg-gray-800 text-white shadow-lg shadow-blue-500/20" : "border-blue-500 bg-white text-gray-900 shadow-lg shadow-blue-500/20") : (isDarkMode ? "border-gray-700 bg-gray-800 text-white hover:border-gray-500" : "border-gray-300 bg-white text-gray-900 hover:border-gray-400")}`}
                  >
                    <span className={`text-xl ${selectedOption ? "" : "opacity-50"}`}>{selectedOption ? "🍎" : "🔍"}</span>
                    <span className="flex-1 truncate font-medium">{selectedOption?.label ?? ph}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isOpen ? (isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700") : (isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500")}`}>{isOpen ? "Open" : "Closed"}</span>
                  </button>
                )}
              />
            </div>
          </DemoWrapper>
          <div className={`mt-3 p-3 rounded-lg text-sm ${isDarkMode ? "bg-yellow-900/30 border border-yellow-800 text-yellow-200" : "bg-yellow-50 border border-yellow-200 text-yellow-800"}`}>
            <p className="font-semibold mb-1">⚠️ Important: renderTrigger must return a {'<button>'} element</p>
            <p>The props passed to renderTrigger include <code className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}>type=&quot;button&quot;</code> so spreading <code className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}>...rest</code> onto the button prevents accidental form submission. A development warning will be shown if a non-button element is detected.</p>
          </div>
        </Section>

        <Section title="With Custom Content" description="Options can render custom ReactNode via the content and selectedContent properties." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown options={countryOptions} value={countryValue} onValueChange={(v) => setCountryValue(v)} placeholder="Search countries..." classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Async Search (Real API)" description="Use onSearch to fetch options asynchronously. Results are debounced and a shimmer skeleton displays while loading." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-80">
              <SearchableDropdown value={asyncCountryValue} onValueChange={(v) => setAsyncCountryValue(v)} placeholder="Search countries..." onSearch={handleAsyncSearch} searchDebounceMs={300} noResultsContent="No countries found" classes={s.default} />
            </div>
          </DemoWrapper>
          <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Type to search countries using REST Countries API. Results are debounced (300ms).</p>
        </Section>

        <Section title="Async with Static Initial Options" description="Combine onSearch with initialOptions to show static options before the user starts typing." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-80">
              <SearchableDropdown value={asyncStaticInitialValue} onValueChange={(v) => setAsyncStaticInitialValue(v)} placeholder="Select or search countries..." onSearch={handleAsyncSearch} initialOptions={countryOptions} searchDebounceMs={300} noResultsContent="No countries found" classes={s.default} />
            </div>
          </DemoWrapper>
          <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Shows static initial options, then switches to async search when user types.</p>
        </Section>

        <Section title="Async with Dynamic Prefetch" description="Use onLoadInitialOptions with loadInitialOnOpen to fetch options when the dropdown first opens." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-80">
              <SearchableDropdown value={asyncPrefetchValue} onValueChange={(v) => setAsyncPrefetchValue(v)} placeholder="Select or search countries..." onSearch={handleAsyncSearch} onLoadInitialOptions={handleLoadInitialOptions} loadInitialOnOpen searchDebounceMs={300} noResultsContent="No countries found" onLoadError={(err) => console.error("Load failed:", err)} classes={s.default} />
            </div>
          </DemoWrapper>
          <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Fetches popular countries on first open. Shows shimmer while loading.</p>
        </Section>

        <Section title="With Status Indicators" description="Use content and selectedContent for rich option rendering." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown options={statusOptions} value={statusValue} onValueChange={(v) => setStatusValue(v)} placeholder="Search status..." classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Selected State & Icon" description="Customize how selected options appear with optionSelected class and custom icons." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-8">
              <div className="w-64">
                <DemoLabel isDarkMode={isDarkMode}>Star icon</DemoLabel>
                <SearchableDropdown options={fruitOptions} value={customSelectedValue} onValueChange={(v) => setCustomSelectedValue(v)} placeholder="Search with star..." selectedIcon={<StarIcon className={`w-4 h-4 shrink-0 ${isDarkMode ? "text-yellow-400" : "text-yellow-500"}`} />} classes={s.default} />
              </div>
              <div className="w-64">
                <DemoLabel isDarkMode={isDarkMode}>No icon</DemoLabel>
                <SearchableDropdown options={fruitOptions} value={noIconValue} onValueChange={(v) => setNoIconValue(v)} placeholder="No selected indicator..." showSelectedIcon={false} classes={{ ...s.default, optionSelected: isDarkMode ? "bg-blue-900/50 font-medium" : "bg-blue-100 font-medium" }} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Without Search Input" description="Set showSearch to false to hide the search input. Behaves like Dropdown with keyboard type-ahead." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown options={fruitOptions} value={noSearchValue} onValueChange={(v) => setNoSearchValue(v)} showSearch={false} placeholder="Select a fruit..." classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Theme Examples" description="Fully customizable themes via the classes prop." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-8">
              <div className="w-64">
                <DemoLabel isDarkMode={isDarkMode}>Dark Theme</DemoLabel>
                <SearchableDropdown options={fruitOptions} value={darkThemeValue} onValueChange={(v) => setDarkThemeValue(v)} placeholder="Search fruits..." classes={s.dark} />
              </div>
              <div className="w-64">
                <DemoLabel isDarkMode={isDarkMode}>Warm Theme</DemoLabel>
                <SearchableDropdown options={fruitOptions} value={warmThemeValue} onValueChange={(v) => setWarmThemeValue(v)} placeholder="Search fruits..." classes={s.warm} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="With Disabled Options" description="Individual options can be disabled. Disabled items are skipped during keyboard navigation." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown options={disabledItemOptions} value={disabledItemValue} onValueChange={(v) => setDisabledItemValue(v)} placeholder="Search options..." classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="With Label & Required" description="Renders an associated label element linked to the trigger via htmlFor/id." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-8">
              <div className="w-64">
                <SearchableDropdown label="Favorite Fruit" options={fruitOptions} value={labeledValue} onValueChange={(v) => setLabeledValue(v)} placeholder="Search fruits..." classes={s.default} />
              </div>
              <div className="w-64">
                <SearchableDropdown label="Required Field" required options={fruitOptions} value={requiredValue} onValueChange={(v) => setRequiredValue(v)} placeholder="Search fruits..." classes={s.default} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Native Form Participation" description="When name is set, a hidden input is rendered so the value participates in native form submissions and FormData." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); alert(`FormData: fruit = ${fd.get("fruit")}`); }} className="flex items-end gap-4">
              <div className="w-64">
                <SearchableDropdown name="fruit" label="Fruit (in form)" options={fruitOptions} value={formIntegrationValue} onValueChange={(v) => setFormIntegrationValue(v)} placeholder="Search fruits..." classes={s.default} />
              </div>
              <button type="submit" className={`px-4 py-2 text-sm rounded-lg border transition-colors ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>Submit</button>
            </form>
          </DemoWrapper>
        </Section>

        <Section title="Disabled State" description="The entire dropdown can be disabled." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown options={fruitOptions} value={disabledValue} disabled placeholder="Search fruits..." classes={{ ...s.default, trigger: `${s.default.trigger} opacity-50 cursor-not-allowed` }} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Error State" description="Use error and errorMessage to display validation errors. The trigger receives data-error for custom styling." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown label="Required Field" options={fruitOptions} value={errorValue} onValueChange={(v) => setErrorValue(v)} required error errorMessage="This field is required" placeholder="Search fruits..." classes={{ ...s.default, trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors ${isDarkMode ? "border-red-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500" : "border-red-500 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"}` }} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Chevron & No Chevron" description="Replace the chevron icon or hide it entirely." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-8">
              <div className="w-64">
                <DemoLabel isDarkMode={isDarkMode}>Custom chevron</DemoLabel>
                <SearchableDropdown options={fruitOptions} value={customChevronValue} onValueChange={(v) => setCustomChevronValue(v)} placeholder="Search fruits..." ChevronIcon={CustomChevronIcon} classes={s.default} />
              </div>
              <div className="w-64">
                <DemoLabel isDarkMode={isDarkMode}>No chevron</DemoLabel>
                <SearchableDropdown options={fruitOptions} value={noChevronValue} onValueChange={(v) => setNoChevronValue(v)} showChevron={false} placeholder="Search fruits..." classes={s.default} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Full Width" description="The fullWidth prop stretches the dropdown to fill its container." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full max-w-md">
              <SearchableDropdown options={fruitOptions} value={fullWidthValue} onValueChange={(v) => setFullWidthValue(v)} fullWidth placeholder="Search fruits..." classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Dropdown Position" description="Control whether the popup opens above or below the trigger. Auto-flips when there isn't enough space." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-8">
              <div>
                <DemoLabel isDarkMode={isDarkMode}>dropdownPosition=&quot;bottom&quot; (default)</DemoLabel>
                <div className="w-64">
                  <SearchableDropdown options={fruitOptions} value={posBotValue} onValueChange={(v) => setPosBotValue(v)} dropdownPosition="bottom" placeholder="Opens below..." classes={s.default} />
                </div>
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>dropdownPosition=&quot;top&quot;</DemoLabel>
                <div className="w-64">
                  <SearchableDropdown options={fruitOptions} value={posTopValue} onValueChange={(v) => setPosTopValue(v)} dropdownPosition="top" placeholder="Opens above..." classes={s.default} />
                </div>
              </div>
            </div>
          </DemoWrapper>
          <div className={`mt-3 p-3 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}>
            <p>
              The dropdown renders via a <code className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}>React Portal</code> into <code className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}>document.body</code> (or a custom container via portalContainer), so it is never clipped by <code className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}>overflow: hidden</code> ancestors.
            </p>
          </div>
        </Section>

        <Section title="Custom Portal Container" description="Use portalContainer to render the dropdown into a specific DOM element instead of document.body. Useful for nested stacking contexts or shadow DOM." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown options={fruitOptions} placeholder="Renders to document.body..." portalContainer={null} classes={s.default} />
            </div>
          </DemoWrapper>
          <div className={`mt-3 p-3 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}>
            <p>Pass a specific HTMLElement to <code className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}>portalContainer</code> or <code className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}>null</code> for document.body (default).</p>
          </div>
        </Section>

        <Section title="Keep Mounted" description="Use keepMounted to keep the dropdown portal in the DOM when closed (hidden with display: none). Useful for animations or when you need the dropdown content to persist." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown options={fruitOptions} value={keepMountedValue} onValueChange={(v) => setKeepMountedValue(v)} keepMounted placeholder="Search fruits..." classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Dropdown Gap" description="Control the gap between the trigger and dropdown with the dropdownGap prop (in pixels). Default is 4px." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-8">
              <div>
                <DemoLabel isDarkMode={isDarkMode}>No gap (0px)</DemoLabel>
                <div className="w-64">
                  <SearchableDropdown options={fruitOptions} dropdownGap={0} placeholder="No gap..." classes={s.default} />
                </div>
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>Large gap (16px)</DemoLabel>
                <div className="w-64">
                  <SearchableDropdown options={fruitOptions} value={customGapValue} onValueChange={(v) => setCustomGapValue(v)} dropdownGap={16} placeholder="Large gap..." classes={s.default} />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Z-Index" description="Control the z-index of the dropdown portal. Useful when working with modals, overlays, or complex layered UIs." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown options={fruitOptions} value={zIndexValue} onValueChange={(v) => setZIndexValue(v)} dropdownZIndex={9999} placeholder="Search (z-index: 9999)..." classes={s.default} />
            </div>
          </DemoWrapper>
          <div className={`mt-3 p-3 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}>
            Default z-index is 50. Increase it when the dropdown needs to appear above other positioned elements like modals or tooltips.
          </div>
        </Section>

        <Section title="Custom Clear Icon" description="Replace the default clear icon with a custom icon component via the ClearIcon prop." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown
                options={fruitOptions}
                value={customClearIconValue}
                onValueChange={(v) => setCustomClearIconValue(v)}
                clearable
                placeholder="Search fruits..."
                ClearIcon={() => (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                classes={s.default}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Check Icon" description="Replace the default check icon with a custom icon component via the CheckIcon prop." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown
                options={fruitOptions}
                value={customCheckIconValue}
                onValueChange={(v) => setCustomCheckIconValue(v)}
                placeholder="Search fruits..."
                CheckIcon={({ className }) => (
                  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                classes={s.default}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Custom Search Icon" description="Replace the default search icon with a custom icon component via the SearchIcon prop. This is unique to SearchableDropdown." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown
                options={fruitOptions}
                placeholder="Custom search icon..."
                SearchIcon={({ className }) => (
                  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                )}
                classes={s.default}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Form Integration (onBlur / onFocus)" description="Use onBlur and onFocus callbacks for integration with form libraries like React Hook Form or Formik." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown options={fruitOptions} value={focusBlurValue} onValueChange={(v) => setFocusBlurValue(v)} placeholder="Focus or blur me..." onFocus={() => setFocusMessage("Dropdown focused")} onBlur={() => setFocusMessage("Dropdown blurred")} classes={s.default} />
            </div>
          </DemoWrapper>
          {focusMessage && (
            <p className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{focusMessage}</p>
          )}
          <div className={`mt-3 p-3 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}>
            These callbacks fire on the trigger button's focus/blur events. Perfect for form validation libraries that track field touch state.
          </div>
        </Section>

        <Section title="Custom KeyDown Handler" description="Provide a custom onKeyDown handler to intercept or extend keyboard behavior. Call preventDefault() to override internal behavior." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-64">
              <SearchableDropdown
                options={fruitOptions}
                value={customKeyDownValue}
                onValueChange={(v) => setCustomKeyDownValue(v)}
                placeholder="Try pressing 'x'..."
                onKeyDown={(event) => {
                  if (event.key === "x" || event.key === "X") {
                    event.preventDefault();
                    setKeyDownMessage("You pressed 'x' - custom handler intercepted!");
                    setTimeout(() => setKeyDownMessage(""), 2000);
                  }
                }}
                classes={s.default}
              />
            </div>
          </DemoWrapper>
          {keyDownMessage && (
            <p className={`text-sm mt-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>{keyDownMessage}</p>
          )}
        </Section>

        <Section title="className, style & aria-label" description="Use className as a fallback for classes.root, style for inline styles, and aria-label to customize the listbox's accessible label." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-6">
              <div>
                <DemoLabel isDarkMode={isDarkMode}>className (fallback for classes.root)</DemoLabel>
                <div className="w-64">
                  <SearchableDropdown options={fruitOptions} placeholder="Search fruits..." className={`${isDarkMode ? "opacity-90" : "opacity-95"}`} classes={s.default} />
                </div>
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>style (inline styles on root)</DemoLabel>
                <div className="w-64">
                  <SearchableDropdown options={fruitOptions} value={classNameStyleValue} onValueChange={(v) => setClassNameStyleValue(v)} placeholder="Search fruits..." style={{ maxWidth: "300px", margin: "0 auto" }} classes={s.default} />
                </div>
              </div>
              <div>
                <DemoLabel isDarkMode={isDarkMode}>aria-label=&quot;Fruit search&quot;</DemoLabel>
                <div className="w-64">
                  <SearchableDropdown options={fruitOptions} placeholder="Search fruits..." aria-label="Fruit search" classes={s.default} />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Shimmer Count Variations" description="Control the number of shimmer skeleton items displayed during loading with the shimmerCount prop." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-8">
              <div className="w-64">
                <DemoLabel isDarkMode={isDarkMode}>3 shimmer items</DemoLabel>
                <SearchableDropdown options={[]} placeholder="Loading..." loading={true} shimmerCount={3} classes={s.default} />
              </div>
              <div className="w-64">
                <DemoLabel isDarkMode={isDarkMode}>8 shimmer items</DemoLabel>
                <SearchableDropdown options={[]} placeholder="Loading..." loading={true} shimmerCount={8} classes={s.default} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Empty Options" description="When no options are available, a configurable empty state is displayed." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-8">
              <div className="w-64">
                <DemoLabel isDarkMode={isDarkMode}>Default text</DemoLabel>
                <SearchableDropdown options={[]} placeholder="No options..." classes={s.default} />
              </div>
              <div className="w-64">
                <DemoLabel isDarkMode={isDarkMode}>Custom ReactNode</DemoLabel>
                <SearchableDropdown options={[]} placeholder="Custom empty..." noResultsContent={<span className="flex flex-col items-center gap-1 py-2"><span className={`text-lg ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>🔍</span><span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Nothing here yet</span></span>} classes={s.default} />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Combined: All Features" description="A comprehensive example combining multiple features: label, required, clearable, custom icons, search, and async." isDarkMode={isDarkMode}>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-80">
              <SearchableDropdown
                label="Favorite Fruit"
                required
                options={fruitOptions}
                defaultValue="apple"
                clearable
                placeholder="Search fruits..."
                searchPlaceholder="Type to filter..."
                ChevronIcon={CustomChevronIcon}
                CheckIcon={({ className }) => (
                  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                classes={s.default}
              />
            </div>
          </DemoWrapper>
          <div className={`mt-3 p-3 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}>
            This dropdown combines label, required indicator, clearable selection, custom chevron and check icons, and a custom search placeholder, all working together seamlessly.
          </div>
        </Section>

        <Section title="Keyboard Navigation" description="The dropdown supports full WAI-ARIA combobox keyboard patterns." isDarkMode={isDarkMode}>
          <div className={`mb-4 p-4 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}>
            <p className="font-semibold mb-2">Keyboard shortcuts:</p>
            <ul className="space-y-2">
              {[
                ["Enter / Space", "Open dropdown / select focused option"],
                ["↓", "Open dropdown / move to next option"],
                ["↑", "Open dropdown / move to previous option"],
                ["Home", "Move to first option"],
                ["End", "Move to last option"],
                ["Escape", "Close dropdown, restore focus to trigger"],
                ["Tab", "Close dropdown, move focus forward"],
                ["Delete / Backspace", "Clear selection (when clearable)"],
                ["A-Z, 0-9", "Type-ahead: jump to matching option (when search hidden)"],
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
              <SearchableDropdown options={fruitOptions} placeholder="Try keyboard navigation..." classes={s.default} />
            </div>
          </DemoWrapper>
        </Section>

        <Section title="Data Attributes" description="Data attributes applied to internal elements for CSS-based styling." isDarkMode={isDarkMode}>
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
                    ["data-placeholder", "trigger", "Present when no option is selected"],
                    ["data-selected", "option", "Present on the selected option"],
                    ["data-focused", "option", "Present on the keyboard-focused option"],
                    ["data-value", "option", "The option's value string"],
                    ["data-state", "content (portal)", '"open" or "closed"'],
                    ["data-position", "content (portal)", '"top" or "bottom" (actual position)'],
                  ].map(([attr, target, desc]) => (
                    <tr key={attr}>
                      <td className="py-3 pr-4 font-mono text-blue-500">{attr}</td>
                      <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{target}</td>
                      <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`text-sm mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Example usage: <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>data-[selected]:font-bold</code>, <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>data-[disabled]:opacity-50</code>
            </p>
          </DemoWrapper>
        </Section>
      </div>

      <div className="space-y-8">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>API Reference</h2>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>SearchableDropdown Props</h3>
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
                  ["options", "SearchableDropdownOption[]", "[]", "Array of selectable options"],
                  ["value", "string | null", "-", "Controlled selected value"],
                  ["defaultValue", "string", "-", "Initial value in uncontrolled mode"],
                  ["onValueChange", "(value: string | null, option) => void", "-", "Callback when selection changes (null when cleared)"],
                  ["open", "boolean", "-", "Controlled open state"],
                  ["defaultOpen", "boolean", "false", "Initial open state in uncontrolled mode"],
                  ["onOpenChange", "(open: boolean) => void", "-", "Callback when open state changes"],
                  ["onSearch", "(query: string) => Promise<Option[]>", "-", "Async search function"],
                  ["searchDebounceMs", "number", "300", "Search debounce delay (ms)"],
                  ["initialOptions", "SearchableDropdownOption[]", "[]", "Static initial options for async mode"],
                  ["onLoadInitialOptions", "() => Promise<Option[]>", "-", "Async function to load initial options"],
                  ["loadInitialOnOpen", "boolean", "false", "Load initial options when dropdown first opens"],
                  ["onLoadError", "(error: unknown) => void", "-", "Callback when async loading fails"],
                  ["showSearch", "boolean", "true", "Show search input in dropdown"],
                  ["searchPlaceholder", "string", '"Search..."', "Search input placeholder text"],
                  ["id", "string", "auto-generated", "ID for ARIA attribute generation"],
                  ["name", "string", "-", "Form field name — renders a hidden input"],
                  ["placeholder", "ReactNode", '"Select an option"', "Placeholder content when no selection"],
                  ["disabled", "boolean", "false", "Disable the entire dropdown"],
                  ["error", "boolean", "false", "Show error state"],
                  ["errorMessage", "ReactNode", "-", "Error message displayed below trigger"],
                  ["label", "ReactNode", "-", "Accessible label element"],
                  ["required", "boolean", "false", "Whether the field is required"],
                  ["clearable", "boolean", "false", "Show clear button and allow deselection"],
                  ["noResultsContent", "ReactNode", '"No results found"', "Content shown when no options match"],
                  ["showChevron", "boolean", "true", "Show the dropdown chevron icon"],
                  ["showSelectedIcon", "boolean", "true", "Show check icon on selected option"],
                  ["selectedIcon", "ReactNode", "-", "Custom icon for selected option"],
                  ["fullWidth", "boolean", "false", "Stretch to fill container width"],
                  ["loading", "boolean", "false", "External loading state"],
                  ["shimmerCount", "number", "5", "Number of shimmer skeleton items"],
                  ["classes", "SearchableDropdownClasses", "-", "Class names for all internal elements"],
                  ["className", "string", "-", "Root class name (merged with classes.root)"],
                  ["style", "CSSProperties", "-", "Root inline styles"],
                  ["keepMounted", "boolean", "false", "Keep portal in DOM when closed"],
                  ["portalContainer", "HTMLElement | null", "document.body", "Portal target container"],
                  ["dropdownPosition", '"top" | "bottom"', '"bottom"', "Preferred popup position (auto-flips)"],
                  ["dropdownZIndex", "number", "50", "z-index of the popup"],
                  ["dropdownGap", "number", "4", "Gap between trigger and popup (px)"],
                  ["typeaheadTimeout", "number", "500", "Typeahead buffer timeout in ms"],
                  ["aria-label", "string", "-", "Listbox aria-label (falls back to label text)"],
                  ["onBlur", "() => void", "-", "Called when trigger loses focus"],
                  ["onFocus", "() => void", "-", "Called when trigger gains focus"],
                  ["onKeyDown", "(event: React.KeyboardEvent) => void", "-", "Custom keydown handler (preventDefault to override)"],
                  ["renderTrigger", "(props) => ReactNode", "-", "Custom trigger render function"],
                  ["ChevronIcon", "ComponentType", "DefaultChevron", "Custom chevron icon component"],
                  ["CheckIcon", "ComponentType", "DefaultCheck", "Custom check icon component"],
                  ["ClearIcon", "ComponentType", "DefaultClear", "Custom clear icon component"],
                  ["SearchIcon", "ComponentType", "DefaultSearch", "Custom search icon component"],
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
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>classes Record (SearchableDropdownClasses)</h3>
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
                  ["root", "Root container element"],
                  ["wrapper", "Inner wrapper around trigger and portal"],
                  ["trigger", "Trigger button (combobox)"],
                  ["triggerText", "Text span inside trigger"],
                  ["content", "Dropdown popup container (portal)"],
                  ["searchInput", "Search input area wrapper"],
                  ["searchInputElement", "Search input element"],
                  ["searchIcon", "Search icon element"],
                  ["optionList", "Scrollable option list wrapper"],
                  ["option", "Individual option element"],
                  ["optionSelected", "Additional class for selected option"],
                  ["optionFocused", "Additional class for keyboard-focused option"],
                  ["optionDisabled", "Additional class for disabled option"],
                  ["chevron", "Chevron icon element"],
                  ["checkIcon", "Check/selected icon element"],
                  ["clearIcon", "Clear button element (shown when clearable)"],
                  ["noResults", "Empty state container"],
                  ["label", "Label element"],
                  ["error", "Error message element"],
                  ["shimmer", "Shimmer container"],
                  ["shimmerItem", "Individual shimmer skeleton item"],
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

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>SearchableDropdownOption Interface</h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Property</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Required</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                {[
                  ["value", "string", "Yes", "Unique value for the option"],
                  ["label", "string", "Yes", "Display label (used for search matching and type-ahead)"],
                  ["content", "ReactNode", "No", "Custom content rendered in the option list"],
                  ["selectedContent", "ReactNode", "No", "Custom content shown in trigger when selected"],
                  ["disabled", "boolean", "No", "Whether the option is disabled"],
                ].map(([prop, type, req, desc]) => (
                  <tr key={prop}>
                    <td className={`py-3 pr-4 font-mono ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{prop}</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{type}</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>{req}</td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>SearchableDropdownTriggerRenderProps Interface</h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Property</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                {[
                  ["ref", "React.RefCallback<HTMLButtonElement>", "Ref callback for the trigger button"],
                  ["isOpen", "boolean", "Whether the dropdown is currently open"],
                  ["selectedOption", "SearchableDropdownOption | null", "The currently selected option object"],
                  ["placeholder", "ReactNode", "The placeholder content"],
                  ["type", '"button"', "Always \"button\" to prevent form submit when inside a form"],
                  ["...rest", "HTML button attributes", "All standard button attributes (id, role, aria-*, disabled, onClick, etc.)"],
                ].map(([prop, type, desc]) => (
                  <tr key={prop}>
                    <td className={`py-3 pr-4 font-mono ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{prop}</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{type}</td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Type Definitions</h3>
          <CodeBlock isDarkMode={isDarkMode} code={`interface SearchableDropdownOption {
  value: string;
  label: string;
  content?: ReactNode;
  selectedContent?: ReactNode;
  disabled?: boolean;
}

interface SearchableDropdownClasses {
  root?: string;
  wrapper?: string;
  trigger?: string;
  triggerText?: string;
  content?: string;
  searchInput?: string;
  searchInputElement?: string;
  searchIcon?: string;
  optionList?: string;
  option?: string;
  optionSelected?: string;
  optionFocused?: string;
  optionDisabled?: string;
  chevron?: string;
  checkIcon?: string;
  clearIcon?: string;
  noResults?: string;
  label?: string;
  error?: string;
  shimmer?: string;
  shimmerItem?: string;
}

interface SearchableDropdownTriggerRenderProps {
  ref: React.RefCallback<HTMLButtonElement>;
  isOpen: boolean;
  selectedOption: SearchableDropdownOption | null;
  placeholder: ReactNode;
  type: "button";
  id: string;
  role: "combobox";
  "aria-expanded": boolean;
  "aria-haspopup": "listbox";
  "aria-controls": string;
  "aria-activedescendant"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
  "aria-labelledby"?: string;
  disabled?: boolean;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  "data-disabled"?: true;
  "data-error"?: true;
  "data-open"?: true;
  "data-placeholder"?: true;
}

interface SearchableDropdownProps {
  options?: SearchableDropdownOption[];
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string | null, option: SearchableDropdownOption | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  name?: string;
  placeholder?: ReactNode;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  label?: ReactNode;
  required?: boolean;
  clearable?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  noResultsContent?: ReactNode;
  showChevron?: boolean;
  showSelectedIcon?: boolean;
  selectedIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => Promise<SearchableDropdownOption[]>;
  searchDebounceMs?: number;
  initialOptions?: SearchableDropdownOption[];
  onLoadInitialOptions?: () => Promise<SearchableDropdownOption[]>;
  loadInitialOnOpen?: boolean;
  onLoadError?: (error: unknown) => void;
  shimmerCount?: number;
  classes?: SearchableDropdownClasses;
  className?: string;
  style?: CSSProperties;
  keepMounted?: boolean;
  portalContainer?: HTMLElement | null;
  dropdownPosition?: "top" | "bottom";
  dropdownZIndex?: number;
  dropdownGap?: number;
  typeaheadTimeout?: number;
  "aria-label"?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  renderTrigger?: (props: SearchableDropdownTriggerRenderProps) => ReactNode;
  ChevronIcon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  CheckIcon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  ClearIcon?: ComponentType<{ className?: string }>;
  SearchIcon?: ComponentType<{ className?: string }>;
}`} />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Performance & Best Practices</h2>
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Recommended Limits</h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li><strong>Maximum options:</strong> The dropdown is not virtualized. For optimal performance, limit static options to 500 or fewer. For larger datasets, use the async <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>onSearch</code> API with server-side filtering.</li>
            <li><strong>Controlled vs Uncontrolled:</strong> Choose one mode (controlled or uncontrolled) at mount and do not switch during the component&apos;s lifetime.</li>
            <li><strong>Async search:</strong> When using <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>onSearch</code>, implement proper error handling via <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>onLoadError</code> to gracefully handle network failures. The component includes built-in race condition protection for rapid queries.</li>
            <li><strong>Dropdown width:</strong> The dropdown width always matches the trigger width. Plan your trigger sizing accordingly.</li>
            <li><strong>Memory management:</strong> Use <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>keepMounted</code> sparingly. While it preserves the dropdown in the DOM when closed, excessive use across many dropdowns can increase memory footprint.</li>
          </ul>
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Form Integration Best Practices</h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li><strong>Native forms:</strong> Use the <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>name</code> prop to enable native form submission. A hidden input will be rendered with the selected value. If the controlled value is not present in the current options (e.g. options changed), the hidden input submits an empty value to avoid stale form data.</li>
            <li><strong>Form libraries:</strong> For React Hook Form or Formik, use <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>onBlur</code> and <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>onFocus</code> callbacks to track field touch state and validation timing.</li>
            <li><strong>Validation:</strong> Use the <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>error</code> and <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>errorMessage</code> props to display validation errors. The error message is announced to screen readers via <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>role=&quot;alert&quot;</code>.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Accessibility</h2>
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Features</h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>Trigger uses <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>role=&quot;combobox&quot;</code> with <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-expanded</code>, <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-haspopup=&quot;listbox&quot;</code>, and <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-controls</code></li>
            <li><code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-activedescendant</code> tracks the currently focused option for screen readers</li>
            <li>Popup uses <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>role=&quot;listbox&quot;</code> with <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>role=&quot;option&quot;</code> items</li>
            <li>Search input has <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-autocomplete=&quot;list&quot;</code> for proper screen reader announcement</li>
            <li>Associated label linked via <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>htmlFor</code> and <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-labelledby</code></li>
            <li>Error messages linked via <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-describedby</code> with <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>role=&quot;alert&quot;</code></li>
            <li>Full keyboard navigation: ArrowDown, ArrowUp, Home, End, Enter, Space, Escape, Tab</li>
            <li>Type-ahead character search when search input is hidden</li>
            <li>Focus automatically restores to trigger on close via Escape or selection</li>
            <li>Focused options automatically scroll into view</li>
            <li><code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-live=&quot;polite&quot;</code> status region announces loading state and option count to screen readers</li>
            <li>Hidden <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>&lt;input type=&quot;hidden&quot;&gt;</code> for native form participation when <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>name</code> is set</li>
            <li>Disabled options receive <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-disabled</code> and are skipped during keyboard navigation</li>
            <li>All decorative icons have <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-hidden=&quot;true&quot;</code> and <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>focusable=&quot;false&quot;</code> with explicit width/height</li>
            <li>Click-outside detection handles both mouse and touch events</li>
            <li>Portal rendering prevents overflow clipping while maintaining ARIA relationships</li>
            <li><code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>ref</code> is forwarded to the trigger button for programmatic focus management</li>
            <li><code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>onBlur</code> and <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>onFocus</code> callbacks for form library integration (React Hook Form, Formik, etc.)</li>
          </ul>
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Keyboard Navigation</h3>
          <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {[
              ["Tab", "Move focus to/from the trigger button"],
              ["Enter / Space", "Open dropdown or select focused option"],
              ["↓", "Open dropdown or move to next enabled option"],
              ["↑", "Open dropdown or move to previous enabled option"],
              ["Home", "Move to first enabled option"],
              ["End", "Move to last enabled option"],
              ["Escape", "Close dropdown, restore focus to trigger"],
              ["Delete / Backspace", "Clear selection (when clearable)"],
            ].map(([key, desc]) => (
              <li key={key}>
                <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>{key}</kbd> - {desc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchableDropdownDemo;
