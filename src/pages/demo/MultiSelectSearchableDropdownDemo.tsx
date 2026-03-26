import { useState, useCallback } from "react";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown";
import type { MultiSelectOption } from "../../components/MultiSelectSearchableDropdown";
import { useTheme } from "./ThemeContext";
import {
  Section,
  CodeBlock,
  DemoWrapper,
  PropsTable,
  PropRow,
} from "./components";

// ─── Types ──────────────────────────────────────────────────────────────────

interface RestCountryResponse {
  name: { common: string; official: string };
  cca2: string;
  flag: string;
  flags: { png: string; svg: string };
  capital?: string[];
  region: string;
}

// ─── Static Data ────────────────────────────────────────────────────────────

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
  { value: "us", label: "United States", content: <span>United States</span> },
  { value: "gb", label: "United Kingdom", content: <span>United Kingdom</span> },
  { value: "ca", label: "Canada", content: <span>Canada</span> },
  { value: "au", label: "Australia", content: <span>Australia</span> },
  { value: "de", label: "Germany", content: <span>Germany</span> },
  { value: "fr", label: "France", content: <span>France</span> },
  { value: "jp", label: "Japan", content: <span>Japan</span> },
  { value: "in", label: "India", content: <span>India</span> },
];

// ─── Themed Classes ─────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  dropdown: {
    root: "",
    wrapper: "relative",
    trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors min-h-[42px] ${
      dark
        ? "border-gray-700 bg-gray-800 text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    }`,
    triggerText: "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
    content: `rounded-lg shadow-lg overflow-hidden ${
      dark
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-200"
    }`,
    searchInput: `flex items-center gap-2 px-3 py-2 border-b ${
      dark ? "border-gray-700 bg-gray-800" : "border-gray-200"
    }`,
    searchInputElement: dark ? "text-gray-200 placeholder:text-gray-500" : "",
    searchIcon: `w-4 h-4 shrink-0 ${dark ? "text-gray-500" : "text-gray-400"}`,
    optionList: "max-h-60 overflow-y-auto",
    option: `flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed ${
      dark
        ? "text-gray-200 hover:bg-gray-700"
        : "text-gray-700 hover:bg-gray-50"
    }`,
    optionSelected: dark ? "bg-blue-900/50" : "bg-blue-50",
    optionFocused: dark ? "bg-gray-600" : "bg-gray-100",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron: `w-4 h-4 shrink-0 transition-transform duration-200 ${dark ? "text-gray-400" : "text-gray-500"}`,
    checkbox: `w-4 h-4 shrink-0 border rounded flex items-center justify-center ${dark ? "border-gray-500" : "border-gray-300"}`,
    checkboxChecked: "bg-blue-600 border-blue-600 text-white",
    checkboxIcon: "w-full h-full",
    noResults: `px-3 py-4 text-sm text-center ${dark ? "text-gray-400" : "text-gray-500"}`,
    loading: `px-3 py-4 text-sm text-center ${dark ? "text-gray-400" : "text-gray-500"}`,
    label: `block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`,
    error: `text-sm mt-1 ${dark ? "text-red-400" : "text-red-500"}`,
    chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md shrink-0 max-w-[100px] ${dark ? "bg-gray-600 text-gray-200" : "bg-blue-100 text-blue-800"}`,
    chipRemove: `w-3 h-3 shrink-0 cursor-pointer ${dark ? "hover:text-gray-300" : "hover:text-blue-600"}`,
    moreCount: `inline-flex items-center px-2 py-0.5 text-xs rounded-md shrink-0 ${dark ? "bg-gray-600 text-gray-300" : "bg-gray-100 text-gray-600"}`,
  },
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
});

// ─── Demo ───────────────────────────────────────────────────────────────────

const MultiSelectSearchableDropdownDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  // Basic
  const [basicValue, setBasicValue] = useState<string[]>([]);
  // Custom content
  const [countryValue, setCountryValue] = useState<string[]>([]);
  // Async search
  const [asyncValue, setAsyncValue] = useState<string[]>([]);
  // Async prefetch
  const [asyncPrefetchValue, setAsyncPrefetchValue] = useState<string[]>([]);
  // Label
  const [labelValue, setLabelValue] = useState<string[]>([]);
  // No chips
  const [noChipsValue, setNoChipsValue] = useState<string[]>([]);
  // Disabled
  const [disabledValue, setDisabledValue] = useState<string[]>(["apple", "banana"]);
  // Error
  const [errorValue, setErrorValue] = useState<string[]>([]);
  // Without search
  const [noSearchValue, setNoSearchValue] = useState<string[]>([]);
  // Controlled open
  const [controlledOpen, setControlledOpen] = useState(false);
  const [controlledValue, setControlledValue] = useState<string[]>([]);
  // Dark theme
  const [darkThemeValue, setDarkThemeValue] = useState<string[]>([]);
  // Purple theme
  const [purpleThemeValue, setPurpleThemeValue] = useState<string[]>([]);
  // Custom checkboxes
  const [greenCheckboxValue, setGreenCheckboxValue] = useState<string[]>([]);
  const [orangeCheckboxValue, setOrangeCheckboxValue] = useState<string[]>([]);
  const [customIconValue, setCustomIconValue] = useState<string[]>([]);
  // Scroll lock
  const [scrollLockValue, setScrollLockValue] = useState<string[]>([]);
  const [scrollUnlockedValue, setScrollUnlockedValue] = useState<string[]>([]);
  // Style variants
  const [variantDefaultValue, setVariantDefaultValue] = useState<string[]>([]);
  const [variantBorderlessValue, setVariantBorderlessValue] = useState<string[]>([]);
  const [variantBottomValue, setVariantBottomValue] = useState<string[]>([]);
  const [variantGhostValue, setVariantGhostValue] = useState<string[]>([]);
  const [variantPillValue, setVariantPillValue] = useState<string[]>([]);

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
      .map((code) => data.find((r) => r.cca2 === code))
      .filter((r): r is RestCountryResponse => r !== undefined);

    return popularCountries.map(mapCountryToOption);
  }, [mapCountryToOption]);

  return (
    <div className="space-y-10">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className={`absolute inset-0 ${dark ? "bg-linear-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50" : "bg-linear-to-br from-indigo-50 via-white to-blue-50/80"}`}
        />
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/40"}`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${dark ? "bg-blue-500/8" : "bg-blue-200/30"}`}
        />
        <div className="relative">
          <h1
            className={`text-3xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}
          >
            MultiSelectSearchableDropdown
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A multi-select dropdown with built-in search, async loading,
            debounced queries, chips display, and full customization via the classes prop.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import { MultiSelectSearchableDropdown } from "@kern-ui/multi-select-searchable-dropdown";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic Usage ──────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Standard multi-select with search and chips."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={basicValue}
              onValueChange={(values) => setBasicValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={c.dropdown}
              aria-label="Select fruits"
            />
          </div>
        </DemoWrapper>
        {basicValue.length > 0 && (
          <p className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}>
            Selected: {basicValue.join(", ")}
          </p>
        )}
      </Section>

      {/* ─── With Custom Content ──────────────────────────────────────────── */}
      <Section
        title="With Custom Content"
        description="Use the content prop on options for rich rendering."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              options={countryOptions}
              value={countryValue}
              onValueChange={(values) => setCountryValue(values)}
              placeholder="Select countries..."
              maxDisplayedChips={2}
              classes={c.dropdown}
              aria-label="Select countries"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Async Search (Real API) ──────────────────────────────────────── */}
      <Section
        title="Async Search (Real API)"
        description="Type to search countries using the REST Countries API."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-80">
            <MultiSelectSearchableDropdown
              value={asyncValue}
              onValueChange={(values) => setAsyncValue(values)}
              placeholder="Search countries..."
              onSearch={handleAsyncSearch}
              searchDebounceMs={300}
              maxDisplayedChips={2}
              loadingText="Searching countries..."
              noResultsContent="No countries found"
              classes={c.dropdown}
              aria-label="Search countries"
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Try: &quot;germany&quot;, &quot;united&quot;, &quot;japan&quot;, &quot;aus&quot;
        </div>
      </Section>

      {/* ─── Async with Dynamic Prefetch ──────────────────────────────────── */}
      <Section
        title="Async with Dynamic Prefetch"
        description="Fetches popular countries when dropdown opens, searches API when user types."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-80">
            <MultiSelectSearchableDropdown
              value={asyncPrefetchValue}
              onValueChange={(values) => setAsyncPrefetchValue(values)}
              placeholder="Select or search countries..."
              onSearch={handleAsyncSearch}
              onLoadInitialOptions={handleLoadInitialOptions}
              loadInitialOnOpen
              searchDebounceMs={300}
              maxDisplayedChips={2}
              loadingText="Loading..."
              noResultsContent="No countries found"
              classes={c.dropdown}
              aria-label="Select or search countries"
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Options are fetched from the REST Countries API when the dropdown opens.
        </div>
      </Section>

      {/* ─── With Label ───────────────────────────────────────────────────── */}
      <Section
        title="With Label"
        description="Use the label and required props."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              label="Favorite Fruits"
              required
              options={staticOptions}
              value={labelValue}
              onValueChange={(values) => setLabelValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Without Chips (Count Only) ───────────────────────────────────── */}
      <Section
        title="Without Chips (Count Only)"
        description='Shows "X selected" instead of individual chips.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={noChipsValue}
              onValueChange={(values) => setNoChipsValue(values)}
              placeholder="Select fruits..."
              showSelectedChips={false}
              classes={c.dropdown}
              aria-label="Select fruits count only"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Disabled State ───────────────────────────────────────────────── */}
      <Section
        title="Disabled State"
        description="Use disabled to prevent interaction."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={disabledValue}
              onValueChange={(values) => setDisabledValue(values)}
              disabled
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{ ...c.dropdown, trigger: `${c.dropdown.trigger} opacity-50 cursor-not-allowed` }}
              aria-label="Disabled fruits"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Error State ──────────────────────────────────────────────────── */}
      <Section
        title="Error State"
        description="Show validation errors with error and errorMessage props."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              label="Required Field"
              options={staticOptions}
              value={errorValue}
              onValueChange={(values) => setErrorValue(values)}
              required
              error
              errorMessage="Please select at least one option"
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{ ...c.dropdown, trigger: `${c.dropdown.trigger} border-red-500 focus:ring-red-500` }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Without Search ───────────────────────────────────────────────── */}
      <Section
        title="Without Search"
        description="Disable the search input with showSearch={false}."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={noSearchValue}
              onValueChange={(values) => setNoSearchValue(values)}
              showSearch={false}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={c.dropdown}
              aria-label="Select fruits no search"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Controlled Open State ────────────────────────────────────────── */}
      <Section
        title="Controlled Open State"
        description="Use open and onOpenChange to control the dropdown programmatically."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-end gap-4">
            <div className="w-72">
              <MultiSelectSearchableDropdown
                options={staticOptions}
                value={controlledValue}
                onValueChange={(values) => setControlledValue(values)}
                open={controlledOpen}
                onOpenChange={setControlledOpen}
                placeholder="Controlled dropdown..."
                maxDisplayedChips={2}
                classes={c.dropdown}
                aria-label="Controlled dropdown"
              />
            </div>
            <button
              type="button"
              className={c.btn}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setControlledOpen((o) => !o)}
            >
              {controlledOpen ? "Close" : "Open"}
            </button>
            {controlledValue.length > 0 && (
              <button
                type="button"
                className={c.btn}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setControlledValue([])}
              >
                Clear
              </button>
            )}
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Scroll Lock ──────────────────────────────────────────────────── */}
      <Section
        title="Scroll Lock"
        description="By default, body scroll is locked when the dropdown is open. Set lockScroll={false} to allow background scrolling."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={scrollLockValue}
              onValueChange={(values) => setScrollLockValue(values)}
              placeholder="Scroll locked (default)"
              maxDisplayedChips={2}
              classes={c.dropdown}
              aria-label="Scroll locked dropdown"
            />
          </div>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={scrollUnlockedValue}
              onValueChange={(values) => setScrollUnlockedValue(values)}
              placeholder="Scroll allowed"
              lockScroll={false}
              maxDisplayedChips={2}
              classes={c.dropdown}
              aria-label="Scroll unlocked dropdown"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Style Variants ───────────────────────────────────────────────── */}
      <Section
        title="Style Variants"
        description="Different visual treatments using the classes prop -- borderless, bottom-border-only, ghost, and pill styles."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div>
            <p className={`mb-2 ${c.label}`}>Default (bordered)</p>
            <div className="w-72">
              <MultiSelectSearchableDropdown
                options={staticOptions}
                value={variantDefaultValue}
                onValueChange={(values) => setVariantDefaultValue(values)}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={c.dropdown}
                aria-label="Default variant"
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Borderless</p>
            <div className="w-72">
              <MultiSelectSearchableDropdown
                options={staticOptions}
                value={variantBorderlessValue}
                onValueChange={(values) => setVariantBorderlessValue(values)}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer min-h-[42px] ${
                    dark
                      ? "bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`,
                  triggerText: "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                }}
                aria-label="Borderless variant"
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Bottom border only</p>
            <div className="w-72">
              <MultiSelectSearchableDropdown
                options={staticOptions}
                value={variantBottomValue}
                onValueChange={(values) => setVariantBottomValue(values)}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-1 py-2 text-sm border-b-2 rounded-none transition-colors cursor-pointer min-h-[42px] ${
                    dark
                      ? "border-gray-600 text-gray-200 hover:border-indigo-400 focus-within:border-indigo-400"
                      : "border-gray-200 text-gray-700 hover:border-indigo-500 focus-within:border-indigo-500"
                  }`,
                  triggerText: "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                }}
                aria-label="Bottom border variant"
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Ghost</p>
            <div className="w-72">
              <MultiSelectSearchableDropdown
                options={staticOptions}
                value={variantGhostValue}
                onValueChange={(values) => setVariantGhostValue(values)}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer min-h-[42px] ${
                    dark
                      ? "text-gray-300 hover:bg-white/[0.06]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`,
                  triggerText: "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                }}
                aria-label="Ghost variant"
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Pill</p>
            <div className="w-72">
              <MultiSelectSearchableDropdown
                options={staticOptions}
                value={variantPillValue}
                onValueChange={(values) => setVariantPillValue(values)}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 px-4 py-2 text-sm rounded-full border transition-colors cursor-pointer min-h-[42px] ${
                    dark
                      ? "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 shadow-sm"
                  }`,
                  triggerText: "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                }}
                aria-label="Pill variant"
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Dark Theme ───────────────────────────────────────────────────── */}
      <Section
        title="Dark Theme"
        description="A dedicated dark color scheme using classes override."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={darkThemeValue}
              onValueChange={(values) => setDarkThemeValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[42px]",
                content: "rounded-lg shadow-lg overflow-hidden bg-gray-800 border border-gray-700",
                searchInput: "flex items-center gap-2 px-3 py-2 border-b border-gray-700 bg-gray-800",
                searchInputElement: "text-gray-200 placeholder:text-gray-500",
                option: "flex items-center gap-2 px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
                optionSelected: "bg-gray-700",
                optionFocused: "bg-gray-600",
                chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400",
                checkbox: "w-4 h-4 shrink-0 border border-gray-500 rounded flex items-center justify-center",
                checkboxChecked: "bg-blue-500 border-blue-500 text-white",
                searchIcon: "w-4 h-4 shrink-0 text-gray-500",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-600 text-gray-200 rounded-md shrink-0 max-w-[100px]",
                chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-gray-300",
                moreCount: "inline-flex items-center px-2 py-0.5 text-xs bg-gray-600 text-gray-300 rounded-md shrink-0",
                noResults: "px-3 py-4 text-sm text-gray-400 text-center",
              }}
              aria-label="Dark theme fruits"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Purple Theme ─────────────────────────────────────────────────── */}
      <Section
        title="Purple Theme"
        description="Custom color scheme example."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={purpleThemeValue}
              onValueChange={(values) => setPurpleThemeValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[42px] ${
                  dark
                    ? "border-purple-700 bg-purple-950/60 text-purple-200 hover:border-purple-500"
                    : "border-purple-300 bg-purple-50 text-purple-900 hover:border-purple-400"
                }`,
                triggerText: "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                content: `rounded-lg shadow-lg overflow-hidden ${
                  dark ? "bg-purple-950 border border-purple-800" : "bg-purple-50 border border-purple-200"
                }`,
                searchInput: `flex items-center gap-2 px-3 py-2 border-b ${
                  dark ? "border-purple-800 bg-purple-950" : "border-purple-200 bg-purple-50"
                }`,
                option: `flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed ${
                  dark ? "text-purple-200 hover:bg-purple-900/60" : "text-purple-900 hover:bg-purple-100"
                }`,
                optionSelected: dark ? "bg-purple-900/80" : "bg-purple-200",
                optionFocused: dark ? "bg-purple-900/60" : "bg-purple-100",
                chevron: `w-4 h-4 shrink-0 transition-transform duration-200 ${dark ? "text-purple-400" : "text-purple-600"}`,
                checkbox: `w-4 h-4 shrink-0 border rounded flex items-center justify-center ${dark ? "border-purple-500" : "border-purple-400"}`,
                checkboxChecked: dark ? "bg-purple-500 border-purple-500 text-white" : "bg-purple-600 border-purple-600 text-white",
                searchIcon: `w-4 h-4 shrink-0 ${dark ? "text-purple-400" : "text-purple-500"}`,
                chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md shrink-0 max-w-[100px] ${
                  dark ? "bg-purple-900/60 text-purple-200" : "bg-purple-200 text-purple-800"
                }`,
                chipRemove: `w-3 h-3 shrink-0 cursor-pointer ${dark ? "hover:text-purple-300" : "hover:text-purple-600"}`,
                moreCount: `inline-flex items-center px-2 py-0.5 text-xs rounded-md shrink-0 ${
                  dark ? "bg-purple-900/40 text-purple-300" : "bg-purple-100 text-purple-700"
                }`,
                label: `block text-sm font-medium mb-1 ${dark ? "text-purple-300" : "text-purple-900"}`,
                error: `text-sm mt-1 ${dark ? "text-purple-400" : "text-purple-600"}`,
              }}
              aria-label="Purple theme fruits"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Checkbox - Green Rounded ──────────────────────────────── */}
      <Section
        title="Custom Checkbox - Green Rounded"
        description="Override checkbox classes for custom styling."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={greenCheckboxValue}
              onValueChange={(values) => setGreenCheckboxValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                checkbox: `w-4 h-4 shrink-0 border rounded-full flex items-center justify-center ${dark ? "border-gray-500" : "border-gray-300"}`,
                checkboxChecked: "bg-emerald-500 border-emerald-500 text-white",
              }}
              aria-label="Green checkbox fruits"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Checkbox - Orange Square ──────────────────────────────── */}
      <Section
        title="Custom Checkbox - Orange Square"
        description="Another checkbox style variant."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={orangeCheckboxValue}
              onValueChange={(values) => setOrangeCheckboxValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                checkbox: "w-5 h-5 shrink-0 border-2 border-orange-300 rounded-sm flex items-center justify-center",
                checkboxChecked: "bg-orange-500 border-orange-500 text-white",
              }}
              aria-label="Orange checkbox fruits"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Checkbox Icon ─────────────────────────────────────────── */}
      <Section
        title="Custom Checkbox Icon"
        description="Replace the default check icon with a star."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectSearchableDropdown
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
              classes={{
                ...c.dropdown,
                checkbox: `w-4 h-4 shrink-0 border rounded flex items-center justify-center ${dark ? "border-amber-500" : "border-amber-400"}`,
                checkboxChecked: "bg-amber-500 border-amber-500 text-white",
              }}
              aria-label="Custom icon fruits"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Props ────────────────────────────────────────────────────────── */}
      <Section title="MultiSelectSearchableDropdown Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="options" type="MultiSelectOption[]" defaultVal="[]" description="Static options array" isDarkMode={dark} />
            <PropRow name="value" type="string[]" description="Selected values (controlled)" isDarkMode={dark} />
            <PropRow name="defaultValue" type="string[]" description="Initial selected values (uncontrolled)" isDarkMode={dark} />
            <PropRow name="onValueChange" type="(values, options) => void" description="Change handler (required)" isDarkMode={dark} />
            <PropRow name="id" type="string" description="ID for ARIA and form association" isDarkMode={dark} />
            <PropRow name="name" type="string" description="Form field name" isDarkMode={dark} />
            <PropRow name="placeholder" type="string" defaultVal='"Select options..."' description="Placeholder when nothing selected" isDarkMode={dark} />
            <PropRow name="disabled" type="boolean" defaultVal="false" description="Disable the dropdown" isDarkMode={dark} />
            <PropRow name="error" type="boolean" defaultVal="false" description="Show error state" isDarkMode={dark} />
            <PropRow name="errorMessage" type="ReactNode" description="Error message to display" isDarkMode={dark} />
            <PropRow name="label" type="ReactNode" description="Label for the dropdown" isDarkMode={dark} />
            <PropRow name="required" type="boolean" defaultVal="false" description="Whether field is required" isDarkMode={dark} />
            <PropRow name="showSearch" type="boolean" defaultVal="true" description="Show the search input" isDarkMode={dark} />
            <PropRow name="searchPlaceholder" type="string" defaultVal='"Search..."' description="Placeholder for search input" isDarkMode={dark} />
            <PropRow name="showChevron" type="boolean" defaultVal="true" description="Show dropdown chevron" isDarkMode={dark} />
            <PropRow name="fullWidth" type="boolean" defaultVal="false" description="Take full container width" isDarkMode={dark} />
            <PropRow name="loading" type="boolean" defaultVal="false" description="External loading state" isDarkMode={dark} />
            <PropRow name="onSearch" type="(query) => Promise<Option[]>" description="Async search function" isDarkMode={dark} />
            <PropRow name="searchDebounceMs" type="number" defaultVal="300" description="Debounce delay for search" isDarkMode={dark} />
            <PropRow name="initialOptions" type="MultiSelectOption[]" description="Pre-loaded initial options" isDarkMode={dark} />
            <PropRow name="onLoadInitialOptions" type="() => Promise<Option[]>" description="Async function to load initial options" isDarkMode={dark} />
            <PropRow name="loadInitialOnOpen" type="boolean" defaultVal="false" description="Load initial options when dropdown opens" isDarkMode={dark} />
            <PropRow name="maxDisplayedChips" type="number" defaultVal="3" description="Max chips before showing +N" isDarkMode={dark} />
            <PropRow name="showSelectedChips" type="boolean" defaultVal="true" description="Show chips or count only" isDarkMode={dark} />
            <PropRow name="checkboxIcon" type="ReactNode" defaultVal="CheckIcon" description="Custom checkbox icon" isDarkMode={dark} />
            <PropRow name="unstyled" type="boolean" defaultVal="false" description="Strip all default classes" isDarkMode={dark} />
            <PropRow name="lockScroll" type="boolean" defaultVal="true" description="Lock body scroll while dropdown is open" isDarkMode={dark} />
            <PropRow name="open" type="boolean" description="Controlled open state" isDarkMode={dark} />
            <PropRow name="defaultOpen" type="boolean" defaultVal="false" description="Initial open state (uncontrolled)" isDarkMode={dark} />
            <PropRow name="onOpenChange" type="(open: boolean) => void" description="Called when open state changes" isDarkMode={dark} />
            <PropRow name="classes" type="MultiSelectSearchableDropdownClasses" description="Class names for internal elements" isDarkMode={dark} />
            <PropRow name="className" type="string" description="Root class name" isDarkMode={dark} />
            <PropRow name="style" type="CSSProperties" description="Root inline styles" isDarkMode={dark} />
            <PropRow name="keepMounted" type="boolean" defaultVal="false" description="Keep listbox in DOM when closed" isDarkMode={dark} />
            <PropRow name="portalContainer" type="HTMLElement | null" defaultVal="document.body" description="Portal target" isDarkMode={dark} />
            <PropRow name="dropdownPosition" type='"top" | "bottom"' defaultVal='"bottom"' description="Preferred list position" isDarkMode={dark} />
            <PropRow name="dropdownZIndex" type="number" defaultVal="50" description="Listbox z-index" isDarkMode={dark} />
            <PropRow name="dropdownGap" type="number" defaultVal="4" description="Gap between trigger and list (px)" isDarkMode={dark} />
            <PropRow name="noResultsContent" type="ReactNode" defaultVal='"No results found"' description="Custom no-results content" isDarkMode={dark} />
            <PropRow name="loadingText" type="string" defaultVal='"Loading..."' description="Loading state text" isDarkMode={dark} />
            <PropRow name="aria-label" type="string" description="Accessible label for the dropdown" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── MultiSelectSearchableDropdownClasses Slots ───────────────────── */}
      <Section title="MultiSelectSearchableDropdownClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="root" type="string" description="Root container element" isDarkMode={dark} />
            <PropRow name="wrapper" type="string" description="Inner wrapper (relative positioned)" isDarkMode={dark} />
            <PropRow name="trigger" type="string" description="Trigger button" isDarkMode={dark} />
            <PropRow name="triggerText" type="string" description="Trigger text/chips container" isDarkMode={dark} />
            <PropRow name="content" type="string" description="Dropdown content (portaled, background, border, shadow)" isDarkMode={dark} />
            <PropRow name="optionList" type="string" description="Options list wrapper" isDarkMode={dark} />
            <PropRow name="option" type="string" description="Base option styling" isDarkMode={dark} />
            <PropRow name="optionSelected" type="string" description="Additional class for selected options" isDarkMode={dark} />
            <PropRow name="optionFocused" type="string" description="Additional class for keyboard-focused options" isDarkMode={dark} />
            <PropRow name="optionDisabled" type="string" description="Additional class for disabled options" isDarkMode={dark} />
            <PropRow name="searchInput" type="string" description="Search input wrapper" isDarkMode={dark} />
            <PropRow name="searchInputElement" type="string" description="Search input text element" isDarkMode={dark} />
            <PropRow name="searchIcon" type="string" description="Search icon" isDarkMode={dark} />
            <PropRow name="checkbox" type="string" description="Checkbox container" isDarkMode={dark} />
            <PropRow name="checkboxChecked" type="string" description="Additional class for checked checkbox" isDarkMode={dark} />
            <PropRow name="checkboxIcon" type="string" description="Checkbox icon" isDarkMode={dark} />
            <PropRow name="chip" type="string" description="Selected chip" isDarkMode={dark} />
            <PropRow name="chipRemove" type="string" description="Chip remove button" isDarkMode={dark} />
            <PropRow name="chevron" type="string" description="Chevron icon" isDarkMode={dark} />
            <PropRow name="moreCount" type="string" description='"+N more" badge' isDarkMode={dark} />
            <PropRow name="noResults" type="string" description="No results message" isDarkMode={dark} />
            <PropRow name="loading" type="string" description="Loading message" isDarkMode={dark} />
            <PropRow name="label" type="string" description="Label element" isDarkMode={dark} />
            <PropRow name="error" type="string" description="Error message" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="data-open" type="root, trigger" description="Present when the dropdown is open" isDarkMode={dark} />
            <PropRow name="data-disabled" type="root, trigger, option" description="Present when disabled" isDarkMode={dark} />
            <PropRow name="data-error" type="root, trigger" description="Present when in error state" isDarkMode={dark} />
            <PropRow name="data-full-width" type="root" description="Present when fullWidth is true" isDarkMode={dark} />
            <PropRow name="data-state" type="content (portal)" description='"open" or "closed"' isDarkMode={dark} />
            <PropRow name="data-position" type="content (portal)" description='"top" or "bottom" (actual position)' isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────────── */}
      <Section
        title="Accessibility"
        description="Built-in accessibility features."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {[
              'Trigger uses role="combobox" with aria-expanded, aria-haspopup="listbox", aria-controls, and aria-activedescendant',
              'Listbox uses role="listbox" with aria-multiselectable="true" and role="option" items',
              "Full keyboard navigation: Enter/Space (toggle option), ArrowDown/Up, Home, End, Escape, Tab",
              "Focus automatically restores to trigger on close via Escape or Tab",
              'aria-live="polite" status region announces loading and selection count',
              "Disabled options have aria-disabled and are skipped by keyboard navigation",
              'Error messages use role="alert" linked via aria-describedby',
              "Associated label linked via htmlFor and aria-labelledby",
              'All decorative icons have aria-hidden="true"',
              "Click-outside detection handles both mouse and touch events",
              "Portal rendering prevents overflow clipping while maintaining ARIA relationships",
              "Search input auto-focused when dropdown opens",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 ${dark ? "text-emerald-400" : "text-emerald-600"}`}
                >
                  &#10003;
                </span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className={`${c.card} mt-3`}>
          <p
            className={`text-xs font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {[
              ["Tab", "Move focus to/from the trigger button"],
              ["Enter / Space", "Open dropdown or toggle focused option"],
              ["\u2193", "Open dropdown or move to next option"],
              ["\u2191", "Move to previous option"],
              ["Home", "Move to first enabled option"],
              ["End", "Move to last enabled option"],
              ["Escape", "Close dropdown, restore focus to trigger"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default MultiSelectSearchableDropdownDemo;
