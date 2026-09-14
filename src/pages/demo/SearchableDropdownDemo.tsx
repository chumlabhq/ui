import type { SearchableDropdownClasses } from "../../components/SearchableDropdown/index.js";
import {
  useState,
  useCallback } from "react";
import { SearchableDropdown } from "../../components/SearchableDropdown/index.js";
import { CountryFlag } from "../../components/CountryFlag/index.js";
import type { SearchableDropdownOption } from "../../components/SearchableDropdown/index.js";
import { Button } from "../../components/Button/index.js";
import { useTheme } from "./ThemeContext.js";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DemoLabel,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
  ComponentDocs,
  CopyPasteBlock,
  SetupNote,
} from "./components/index.js";
import {
  fetchCountries,
  searchCountries,
  type Country,
} from "./lib/countries.js";

const fruitOptions: SearchableDropdownOption[] = [
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

const countryOptions: SearchableDropdownOption[] = [
  {
    value: "us",
    label: "United States",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="US" size="md" className="rounded-cl-sm" />
        United States
      </span>
    ),
  },
  {
    value: "gb",
    label: "United Kingdom",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="GB" size="md" className="rounded-cl-sm" />
        United Kingdom
      </span>
    ),
  },
  {
    value: "ca",
    label: "Canada",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="CA" size="md" className="rounded-cl-sm" />
        Canada
      </span>
    ),
  },
  {
    value: "au",
    label: "Australia",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="AU" size="md" className="rounded-cl-sm" />
        Australia
      </span>
    ),
  },
  {
    value: "de",
    label: "Germany",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="DE" size="md" className="rounded-cl-sm" />
        Germany
      </span>
    ),
  },
  {
    value: "fr",
    label: "France",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="FR" size="md" className="rounded-cl-sm" />
        France
      </span>
    ),
  },
  {
    value: "jp",
    label: "Japan",
    content: (
      <span className="flex items-center gap-2">
        <CountryFlag code="JP" size="md" className="rounded-cl-sm" />
        Japan
      </span>
    ),
  },
];

const statusOptions: SearchableDropdownOption[] = [
  {
    value: "active",
    label: "Active",
    content: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-success" />
        <span>Active</span>
      </span>
    ),
    selectedContent: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-success" />
        <span>Active</span>
      </span>
    ),
  },
  {
    value: "pending",
    label: "Pending",
    content: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-warning" />
        <span>Pending</span>
      </span>
    ),
    selectedContent: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-warning" />
        <span>Pending</span>
      </span>
    ),
  },
  {
    value: "inactive",
    label: "Inactive",
    content: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-text/10" />
        <span>Inactive</span>
      </span>
    ),
    selectedContent: (
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-text/10" />
        <span>Inactive</span>
      </span>
    ),
  },
];

const disabledItemOptions: SearchableDropdownOption[] = [
  { value: "option1", label: "Available Option 1" },
  { value: "option2", label: "Disabled Option", disabled: true },
  { value: "option3", label: "Available Option 2" },
  { value: "option4", label: "Disabled Option 2", disabled: true },
  { value: "option5", label: "Available Option 3" },
];

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
    width={16}
    height={16}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CustomChevronIcon = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
    width={16}
    height={16}
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const getClasses = () => ({
  dropdown: {
    trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
    content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
    searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-hover dark:border dark:border-cl-border dark:bg-cl-bg`,
    searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
    label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
  } satisfies SearchableDropdownClasses,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
});

const darkTheme = {
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-[#2a2f3a] bg-[#0a0d12] text-white hover:bg-[#11151c] focus:outline-none focus:ring-2 focus:ring-cl-accent",
  triggerText: "flex-1 truncate",
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-[#0a0d12] border border-[#2a2f3a]",
  searchInput:
    "flex items-center gap-2 px-3 py-2 border-b border-[#2a2f3a] bg-[#0a0d12]",
  searchInputElement:
    "flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none",
  searchIcon: "w-4 h-4 shrink-0 text-white/60",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-white hover:bg-white/[0.08] transition-colors",
  optionSelected: "bg-white/[0.12] font-medium",
  optionFocused: "bg-white/[0.08]",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-white/60",
  checkIcon: "w-4 h-4 shrink-0 text-cl-accent",
  noResults: "px-3 py-4 text-sm text-white/60 text-center",
};

const warmTheme = {
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-cl-warning rounded-cl-md bg-cl-warning/15 text-cl-text hover:bg-cl-warning/15 focus:outline-none focus:ring-2 focus:ring-cl-warning",
  triggerText: "flex-1 truncate",
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-cl-warning/15 border border-cl-warning",
  searchInput:
    "flex items-center gap-2 px-3 py-2 border-b border-cl-warning bg-cl-warning/15",
  searchInputElement:
    "flex-1 bg-transparent text-cl-warning placeholder:text-cl-warning focus:outline-none",
  searchIcon: "w-4 h-4 shrink-0 text-cl-warning",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-cl-warning hover:bg-cl-warning/15 transition-colors",
  optionSelected: "bg-cl-warning/15",
  optionFocused: "bg-cl-warning/15",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-warning",
  checkIcon: "w-4 h-4 shrink-0 text-cl-warning",
  noResults: "px-3 py-4 text-sm text-cl-warning text-center",
};

const SearchableDropdownDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses();

  const [basicValue, setBasicValue] = useState<string | null>(null);
  const [countryValue, setCountryValue] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState<string | null>(null);
  const [disabledItemValue, setDisabledItemValue] = useState<string | null>(
    null,
  );
  const [disabledValue] = useState<string | null>("apple");
  const [errorValue, setErrorValue] = useState<string | null>(null);
  const [labeledValue, setLabeledValue] = useState<string | null>(null);
  const [asyncCountryValue, setAsyncCountryValue] = useState<string | null>(
    null,
  );
  const [asyncStaticInitialValue, setAsyncStaticInitialValue] = useState<
    string | null
  >(null);
  const [asyncPrefetchValue, setAsyncPrefetchValue] = useState<string | null>(
    null,
  );
  const [asyncLoadError, setAsyncLoadError] = useState("no error");
  const [formSubmit, setFormSubmit] = useState("not fired yet");
  const [customSelectedValue, setCustomSelectedValue] = useState<string | null>(
    null,
  );
  const [noIconValue, setNoIconValue] = useState<string | null>(null);
  const [darkThemeValue, setDarkThemeValue] = useState<string | null>(null);
  const [warmThemeValue, setWarmThemeValue] = useState<string | null>(null);
  const [clearableValue, setClearableValue] = useState<string | null>(null);
  const [noSearchValue, setNoSearchValue] = useState<string | null>(null);
  const [fullWidthValue, setFullWidthValue] = useState<string | null>(null);
  const [requiredValue, setRequiredValue] = useState<string | null>(null);
  const [keepMountedValue, setKeepMountedValue] = useState<string | null>(null);
  const [formIntegrationValue, setFormIntegrationValue] = useState<
    string | null
  >(null);
  const [renderTriggerValue, setRenderTriggerValue] = useState<string | null>(
    null,
  );
  const [posTopValue, setPosTopValue] = useState<string | null>(null);
  const [posBotValue, setPosBotValue] = useState<string | null>(null);
  const [forceBotValue, setForceBotValue] = useState<string | null>(null);
  const [forceTopValue, setForceTopValue] = useState<string | null>(null);
  const [forceLockValue, setForceLockValue] = useState<string | null>(null);
  const [focusBlurValue, setFocusBlurValue] = useState<string | null>(null);
  const [noChevronValue, setNoChevronValue] = useState<string | null>(null);
  const [customChevronValue, setCustomChevronValue] = useState<string | null>(
    null,
  );
  const [customGapValue, setCustomGapValue] = useState<string | null>(null);
  const [zIndexValue, setZIndexValue] = useState<string | null>(null);
  const [customClearIconValue, setCustomClearIconValue] = useState<
    string | null
  >("apple");
  const [customCheckIconValue, setCustomCheckIconValue] = useState<
    string | null
  >(null);
  const [customKeyDownValue, setCustomKeyDownValue] = useState<string | null>(
    null,
  );
  const [classNameStyleValue, setClassNameStyleValue] = useState<string | null>(
    null,
  );
  const [descriptionValue, setDescriptionValue] = useState<string | null>(null);
  const [successValue, setSuccessValue] = useState<string | null>(null);

  const [controlledOpen, setControlledOpen] = useState(false);
  const [controlledValue, setControlledValue] = useState<string | null>(null);
  const [focusMessage, setFocusMessage] = useState<string>("");
  const [keyDownMessage, setKeyDownMessage] = useState<string>("");

  const mapCountryToOption = useCallback(
    (country: Country): SearchableDropdownOption => ({
      value: country.code,
      label: country.name,
      content: (
        <span className="flex items-center gap-2">
          <CountryFlag
            code={country.code}
            size="md"
            alt={`${country.name} flag`}
            className="rounded-cl-sm"
          />
          <span className="flex flex-col">
            <span className="text-sm">{country.name}</span>
            <span
              className={`text-xs text-cl-text-secondary`}
            >
              {country.capital || country.region}
            </span>
          </span>
        </span>
      ),
      selectedContent: (
        <span className="flex items-center gap-2">
          <CountryFlag
            code={country.code}
            size="md"
            alt={`${country.name} flag`}
            className="rounded-cl-sm"
          />
          <span>{country.name}</span>
        </span>
      ),
    }),
    [],
  );

  const handleAsyncSearch = useCallback(
    async (query: string): Promise<SearchableDropdownOption[]> => {
      const data = await searchCountries(query);
      return data.slice(0, 10).map(mapCountryToOption);
    },
    [mapCountryToOption],
  );

  const handleLoadInitialOptions = useCallback(async (): Promise<
    SearchableDropdownOption[]
  > => {
    const data = await fetchCountries();
    const codes = ["US", "GB", "DE", "FR", "JP", "CA", "AU", "IN", "BR", "IT"];
    return codes
      .map((code) => data.find((c) => c.code === code))
      .filter((c): c is Country => c !== undefined)
      .map(mapCountryToOption);
  }, [mapCountryToOption]);

  return (
    <div className="space-y-10">
      <DocsHero
        title="Searchable Dropdown"
        description="A fully accessible searchable select component with real-time filtering. Supports synchronous static options and asynchronous search with debouncing. Built on the same architecture as Dropdown with portal rendering, keyboard navigation, and complete customization."
        code={`import { SearchableDropdown } from "@chumlab/ui/searchable-dropdown";`}
      />

      <SetupNote />

      <CopyPasteBlock name="SearchableDropdown" />

      {/* ─── Basic Usage ─────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Standard searchable dropdown with string options."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            {/* Basic usage — works out-of-the-box with built-in styles */}
            <SearchableDropdown
              options={fruitOptions}
              value={basicValue}
              onValueChange={(value) => setBasicValue(value)}
              placeholder="Search fruits..."
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── State Variations ────────────────────────────────────────────── */}
      <Section
        title="State Variations"
        description="Overview of different dropdown states: default, selected, disabled, error, and loading."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <DemoLabel isDarkMode={dark}>Default (empty)</DemoLabel>
              <SearchableDropdown
                options={fruitOptions}
                placeholder="Search fruits..."
                classes={c.dropdown}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Selected</DemoLabel>
              <SearchableDropdown
                options={fruitOptions}
                defaultValue="banana"
                placeholder="Search fruits..."
                classes={c.dropdown}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Disabled</DemoLabel>
              <SearchableDropdown
                options={fruitOptions}
                defaultValue="cherry"
                disabled
                placeholder="Search fruits..."
                classes={{
                  ...c.dropdown,
                  trigger: `${c.dropdown.trigger} opacity-50 cursor-not-allowed`,
                }}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Error state</DemoLabel>
              <SearchableDropdown
                options={fruitOptions}
                placeholder="Search fruits..."
                error
                errorMessage="This field is required"
                classes={{
                  ...c.dropdown,
 trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-error bg-white text-cl-text hover:border-cl-error focus:outline-none focus:ring-2 focus:ring-cl-error dark:border dark:border-cl-error dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-error dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-error`,
                }}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Loading state</DemoLabel>
              <SearchableDropdown
                options={[]}
                placeholder="Loading..."
                loading={true}
                shimmerCount={4}
                classes={c.dropdown}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Clearable (selected)</DemoLabel>
              <SearchableDropdown
                options={fruitOptions}
                defaultValue="grape"
                clearable
                placeholder="Search fruits..."
                classes={c.dropdown}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Uncontrolled ────────────────────────────────────────────────── */}
      <Section
        title="Uncontrolled (defaultValue)"
        description="Use defaultValue for uncontrolled mode. No value or onValueChange needed for basic usage."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              defaultValue="cherry"
              placeholder="Search fruits..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Controlled Open State ───────────────────────────────────────── */}
      <Section
        title="Controlled Open State"
        description="Use open and onOpenChange to control the dropdown programmatically."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-end gap-4">
            <div className="w-full sm:max-w-64">
              <SearchableDropdown
                options={fruitOptions}
                value={controlledValue}
                onValueChange={(v) => setControlledValue(v)}
                open={controlledOpen}
                onOpenChange={setControlledOpen}
                placeholder="Controlled dropdown..."
                classes={c.dropdown}
              />
            </div>
            <button
              type="button"
              className={c.btn}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setControlledOpen(!controlledOpen)}
            >
              {controlledOpen ? "Close" : "Open"}
            </button>
            {controlledValue && (
              <button
                type="button"
                className={c.btn}
                onClick={() => setControlledValue(null)}
              >
                Clear
              </button>
            )}
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Clearable ───────────────────────────────────────────────────── */}
      <Section
        title="Clearable"
        description="When clearable is true, a clear button appears after selection. Press Delete/Backspace on the trigger to clear."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              value={clearableValue}
              onValueChange={(v) => setClearableValue(v)}
              clearable
              placeholder="Search (clearable)..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        {clearableValue && (
          <p
            className={`text-sm mt-2 text-cl-accent`}
          >
            Selected: {clearableValue}
          </p>
        )}
      </Section>

      {/* ─── Custom Trigger ──────────────────────────────────────────────── */}
      <Section
        title="Custom Trigger (renderTrigger)"
        description="Use renderTrigger to fully customize the trigger element while retaining all keyboard and ARIA behavior."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <SearchableDropdown
              options={fruitOptions}
              value={renderTriggerValue}
              onValueChange={(v) => setRenderTriggerValue(v)}
              placeholder="Pick a fruit..."
              classes={c.dropdown}
              renderTrigger={({
                ref,
                isOpen,
                selectedOption,
                placeholder: ph,
                ...rest
              }) => (
                <button
                  ref={ref as React.RefCallback<HTMLButtonElement>}
                  {...rest}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-cl-lg border-2 transition-all ${isOpen ? (dark ? "border-cl-border-input-focus bg-cl-bg-elevated text-white shadow-lg shadow-accent/20" : "border-cl-border-input-focus bg-white text-cl-text shadow-lg shadow-accent/20") : dark ? "border-cl-border bg-cl-bg-elevated text-white hover:border-cl-border" : "border-cl-border-input bg-white text-cl-text hover:border-cl-border-input"} cursor-pointer`}
                >
                  <span
                    className={`text-xl ${selectedOption ? "" : "opacity-50"}`}
                  >
                    {selectedOption ? "🍎" : "🔍"}
                  </span>
                  <span className="flex-1 truncate font-medium">
                    {selectedOption?.label ?? ph}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${isOpen ? (dark ? "bg-cl-accent/20 text-cl-text" : "bg-cl-accent/10 text-cl-text") : dark ? "bg-cl-bg-elevated text-cl-text-tertiary" : "bg-cl-bg-hover text-cl-text-tertiary"}`}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </span>
                </button>
              )}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          <p className="font-semibold mb-1">
            Important: renderTrigger must return a {"<button>"} element
          </p>
          <p>
            The props include type=&quot;button&quot; so spreading ...rest
            prevents accidental form submission. Use `renderTrigger` to return a
            native `button` for listbox accessibility.
          </p>
        </div>
      </Section>

      {/* ─── With Custom Content ─────────────────────────────────────────── */}
      <Section
        title="With Custom Content"
        description="Options can render custom ReactNode via the content and selectedContent properties."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={countryOptions}
              value={countryValue}
              onValueChange={(v) => setCountryValue(v)}
              placeholder="Search countries..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Async Search ────────────────────────────────────────────────── */}
      <Section
        title="Async Search (Real API)"
        description="Use onSearch to fetch options asynchronously. Results are debounced and a shimmer skeleton displays while loading."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
            <SearchableDropdown
              value={asyncCountryValue}
              onValueChange={(v) => setAsyncCountryValue(v)}
              placeholder="Search countries..."
              onSearch={handleAsyncSearch}
              searchDebounceMs={300}
              noResultsContent="No countries found"
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <p
          className={`text-sm mt-2 text-cl-text-secondary`}
        >
          Type to search countries using REST Countries API. Results are
          debounced (300ms).
        </p>
      </Section>

      {/* ─── Async with Static Initial Options ───────────────────────────── */}
      <Section
        title="Async with Static Initial Options"
        description="Combine onSearch with initialOptions to show static options before the user starts typing."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
            <SearchableDropdown
              value={asyncStaticInitialValue}
              onValueChange={(v) => setAsyncStaticInitialValue(v)}
              placeholder="Select or search countries..."
              onSearch={handleAsyncSearch}
              initialOptions={countryOptions}
              searchDebounceMs={300}
              noResultsContent="No countries found"
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <p
          className={`text-sm mt-2 text-cl-text-secondary`}
        >
          Shows static initial options, then switches to async search when user
          types.
        </p>
      </Section>

      {/* ─── Async with Dynamic Prefetch ─────────────────────────────────── */}
      <Section
        title="Async with Dynamic Prefetch"
        description="Use onLoadInitialOptions with loadInitialOnOpen to fetch options when the dropdown first opens."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
            <SearchableDropdown
              value={asyncPrefetchValue}
              onValueChange={(v) => setAsyncPrefetchValue(v)}
              placeholder="Select or search countries..."
              onSearch={handleAsyncSearch}
              onLoadInitialOptions={handleLoadInitialOptions}
              loadInitialOnOpen
              searchDebounceMs={300}
              noResultsContent="No countries found"
              onLoadError={(err) => setAsyncLoadError(err instanceof Error ? err.message : String(err))}
              classes={c.dropdown}
            />
            <div className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary" data-demo-action>
              onLoadError: {asyncLoadError}
            </div>
          </div>
        </DemoWrapper>
        <p
          className={`text-sm mt-2 text-cl-text-secondary`}
        >
          Fetches popular countries on first open. Shows shimmer while loading.
        </p>
      </Section>

      {/* ─── With Status Indicators ──────────────────────────────────────── */}
      <Section
        title="With Status Indicators"
        description="Use content and selectedContent for rich option rendering."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={statusOptions}
              value={statusValue}
              onValueChange={(v) => setStatusValue(v)}
              placeholder="Search status..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Selected State & Icon ────────────────────────────────── */}
      <Section
        title="Custom Selected State & Icon"
        description="Customize how selected options appear with optionSelected class and custom icons."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Star icon</DemoLabel>
              <SearchableDropdown
                options={fruitOptions}
                value={customSelectedValue}
                onValueChange={(v) => setCustomSelectedValue(v)}
                placeholder="Search with star..."
                selectedIcon={
                  <StarIcon
                    className={`w-4 h-4 shrink-0 text-cl-text`}
                  />
                }
                classes={c.dropdown}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>No icon</DemoLabel>
              <SearchableDropdown
                options={fruitOptions}
                value={noIconValue}
                onValueChange={(v) => setNoIconValue(v)}
                placeholder="No selected indicator..."
                showSelectedIcon={false}
                classes={{
                  ...c.dropdown,
                }}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Without Search Input ────────────────────────────────────────── */}
      <Section
        title="Without Search Input"
        description="Set showSearch to false to hide the search input. Behaves like Dropdown with keyboard type-ahead."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              value={noSearchValue}
              onValueChange={(v) => setNoSearchValue(v)}
              showSearch={false}
              placeholder="Select a fruit..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Theme Examples ───────────────────────────────────────── */}
      <Section
        title="Custom Theme Examples"
        description="Fully customizable themes via the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Dark Theme</DemoLabel>
              <SearchableDropdown
                options={fruitOptions}
                value={darkThemeValue}
                onValueChange={(v) => setDarkThemeValue(v)}
                placeholder="Search fruits..."
                classes={darkTheme}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Warm Theme</DemoLabel>
              <SearchableDropdown
                options={fruitOptions}
                value={warmThemeValue}
                onValueChange={(v) => setWarmThemeValue(v)}
                placeholder="Search fruits..."
                classes={warmTheme}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Disabled Options ───────────────────────────────────────── */}
      <Section
        title="With Disabled Options"
        description="Individual options can be disabled. Disabled items are skipped during keyboard navigation."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={disabledItemOptions}
              value={disabledItemValue}
              onValueChange={(v) => setDisabledItemValue(v)}
              placeholder="Search options..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Label & Required ───────────────────────────────────────── */}
      <Section
        title="With Label & Required"
        description="Renders an associated label element linked to the trigger via htmlFor/id."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <SearchableDropdown
                label="Favorite Fruit"
                options={fruitOptions}
                value={labeledValue}
                onValueChange={(v) => setLabeledValue(v)}
                placeholder="Search fruits..."
                classes={c.dropdown}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <SearchableDropdown
                label="Required Field"
                required
                options={fruitOptions}
                value={requiredValue}
                onValueChange={(v) => setRequiredValue(v)}
                placeholder="Search fruits..."
                classes={c.dropdown}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Native Form Participation ───────────────────────────────────── */}
      <Section
        title="Native Form Participation"
        description="When name is set, a hidden input is rendered so the value participates in native form submissions and FormData."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFormSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
            }}
            className="flex items-end gap-4"
          >
            <div className="w-full sm:max-w-64">
              <SearchableDropdown
                name="fruit"
                label="Fruit (in form)"
                options={fruitOptions}
                value={formIntegrationValue}
                onValueChange={(v) => setFormIntegrationValue(v)}
                placeholder="Search fruits..."
                classes={c.dropdown}
              />
            </div>
            <Button type="submit" className={c.btn}>
              Submit
            </Button>
          </form>
          <div className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary" data-demo-action>
            onSubmit: {formSubmit}
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Disabled State ──────────────────────────────────────────────── */}
      <Section
        title="Disabled State"
        description="The entire dropdown can be disabled."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              value={disabledValue}
              disabled
              placeholder="Search fruits..."
              classes={{
                ...c.dropdown,
                trigger: `${c.dropdown.trigger} opacity-50 cursor-not-allowed`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Error State ─────────────────────────────────────────────────── */}
      <Section
        title="Error State"
        description="Use error and errorMessage to display validation errors. The trigger receives data-error for custom styling."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              label="Required Field"
              options={fruitOptions}
              value={errorValue}
              onValueChange={(v) => setErrorValue(v)}
              required
              error
              errorMessage="This field is required"
              placeholder="Search fruits..."
              classes={{
                ...c.dropdown,
 trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-error bg-white text-cl-text focus:outline-none focus:ring-2 focus:ring-cl-error dark:border dark:border-cl-error dark:bg-cl-bg-elevated dark:text-white dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-error`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Description ────────────────────────────────────────────── */}
      <Section
        title="With Description"
        description="Use the description prop to show helper text below the label."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              label="Favorite Fruit"
              description="Pick the fruit you enjoy the most."
              options={fruitOptions}
              value={descriptionValue}
              onValueChange={(v) => setDescriptionValue(v)}
              placeholder="Search fruits..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Success State ─────────────────────────────────────────────────── */}
      <Section
        title="Success State"
        description="Use success and successMessage to display a success confirmation. The trigger receives data-valid for custom styling."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              label="Favorite Fruit"
              options={fruitOptions}
              value={successValue}
              onValueChange={(v) => setSuccessValue(v)}
              success={!!successValue}
              successMessage={successValue ? "Great choice!" : undefined}
              placeholder="Search fruits..."
              classes={{
                ...c.dropdown,
 trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors ${successValue ? (dark ? "border border-cl-success bg-cl-bg-elevated text-white focus:outline-none focus:ring-2 focus:ring-cl-success" : "border-cl-success bg-white text-cl-text focus:outline-none focus:ring-2 focus:ring-cl-success") : dark ? "border-cl-border bg-cl-bg-elevated text-white hover:border-cl-border focus:outline-none focus:ring-2 focus:ring-cl-accent" : "border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent"}`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Chevron & No Chevron ──────────────────────────────────── */}
      <Section
        title="Custom Chevron & No Chevron"
        description="Replace the chevron icon or hide it entirely."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Custom chevron</DemoLabel>
              <SearchableDropdown
                options={fruitOptions}
                value={customChevronValue}
                onValueChange={(v) => setCustomChevronValue(v)}
                placeholder="Search fruits..."
                ChevronIcon={CustomChevronIcon}
                classes={c.dropdown}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>No chevron</DemoLabel>
              <SearchableDropdown
                options={fruitOptions}
                value={noChevronValue}
                onValueChange={(v) => setNoChevronValue(v)}
                showChevron={false}
                placeholder="Search fruits..."
                classes={c.dropdown}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Full Width ──────────────────────────────────────────────────── */}
      <Section
        title="Full Width"
        description="The fullWidth prop stretches the dropdown to fill its container."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full">
            <SearchableDropdown
              options={fruitOptions}
              value={fullWidthValue}
              onValueChange={(v) => setFullWidthValue(v)}
              fullWidth
              placeholder="Search fruits..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Scroll Lock ──────────────────────────────────────────────── */}
      <Section
        title="Scroll Lock"
        description="By default, the page remains scrollable when the dropdown is open. Set lockScroll to lock body scroll while open."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <SearchableDropdown
            options={fruitOptions}
            placeholder="Default (scrollable)"
            classes={c.dropdown}
          />
          <SearchableDropdown
            options={fruitOptions}
            placeholder="lockScroll enabled"
            lockScroll
            classes={c.dropdown}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Dropdown Position ───────────────────────────────────────────── */}
      <Section
        title="Dropdown Position"
        description="Control whether the popup opens above or below the trigger. Auto-flips when there isn't enough space."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-8">
            <div>
              <DemoLabel isDarkMode={dark}>
                dropdownPosition=&quot;bottom&quot; (default)
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <SearchableDropdown
                  options={fruitOptions}
                  value={posBotValue}
                  onValueChange={(v) => setPosBotValue(v)}
                  dropdownPosition="bottom"
                  placeholder="Opens below..."
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>
                dropdownPosition=&quot;top&quot;
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <SearchableDropdown
                  options={fruitOptions}
                  value={posTopValue}
                  onValueChange={(v) => setPosTopValue(v)}
                  dropdownPosition="top"
                  placeholder="Opens above..."
                  classes={c.dropdown}
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
        <div className={c.note}>
          The dropdown renders via a React Portal into document.body (or a
          custom container via portalContainer), so it is never clipped by
          overflow: hidden ancestors. Position updates react to window resize,
          scroll, container resize (via ResizeObserver), and iOS Safari virtual
          keyboard changes (via visualViewport).
        </div>
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-8">
            <div>
              <DemoLabel isDarkMode={dark}>
                forceDropdownPosition (forced bottom)
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <SearchableDropdown
                  options={fruitOptions}
                  value={forceBotValue}
                  onValueChange={(v) => setForceBotValue(v)}
                  dropdownPosition="bottom"
                  forceDropdownPosition
                  placeholder="Always opens below..."
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>
                forceDropdownPosition (forced top)
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <SearchableDropdown
                  options={fruitOptions}
                  value={forceTopValue}
                  onValueChange={(v) => setForceTopValue(v)}
                  dropdownPosition="top"
                  forceDropdownPosition
                  placeholder="Always opens above..."
                  classes={c.dropdown}
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
        <div className={c.note}>
          When forceDropdownPosition is true, the dropdown will always open in
          the specified direction regardless of available viewport space.
        </div>
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-8">
            <div>
              <DemoLabel isDarkMode={dark}>
                forceDropdownPosition + lockScroll
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <SearchableDropdown
                  options={fruitOptions}
                  value={forceLockValue}
                  onValueChange={(v) => setForceLockValue(v)}
                  dropdownPosition="bottom"
                  forceDropdownPosition
                  lockScroll
                  placeholder="Forced bottom + scroll locked"
                  classes={c.dropdown}
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Combining forceDropdownPosition with lockScroll prevents the page from
          scrolling while the dropdown is open, ensuring the menu stays anchored
          in place.
        </div>
      </Section>

      {/* ─── Custom Portal Container ─────────────────────────────────────── */}
      <Section
        title="Custom Portal Container"
        description="Use portalContainer to render the dropdown into a specific DOM element instead of document.body."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              placeholder="Renders to document.body..."
              portalContainer={null}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Pass a specific HTMLElement to portalContainer or null for
          document.body (default).
        </div>
      </Section>

      {/* ─── Keep Mounted ────────────────────────────────────────────────── */}
      <Section
        title="Keep Mounted"
        description="Use keepMounted to keep the dropdown portal in the DOM when closed (hidden with display: none)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              value={keepMountedValue}
              onValueChange={(v) => setKeepMountedValue(v)}
              keepMounted
              placeholder="Search fruits..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Dropdown Gap ─────────────────────────────────────────── */}
      <Section
        title="Custom Dropdown Gap"
        description="Control the gap between the trigger and dropdown with the dropdownGap prop (in pixels). Default is 4px."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-8">
            <div>
              <DemoLabel isDarkMode={dark}>No gap (0px)</DemoLabel>
              <div className="w-full sm:max-w-64">
                <SearchableDropdown
                  options={fruitOptions}
                  dropdownGap={0}
                  placeholder="No gap..."
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Large gap (16px)</DemoLabel>
              <div className="w-full sm:max-w-64">
                <SearchableDropdown
                  options={fruitOptions}
                  value={customGapValue}
                  onValueChange={(v) => setCustomGapValue(v)}
                  dropdownGap={16}
                  placeholder="Large gap..."
                  classes={c.dropdown}
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Z-Index ──────────────────────────────────────────────── */}
      <Section
        title="Custom Z-Index"
        description="Control the z-index of the dropdown portal. Useful when working with modals, overlays, or complex layered UIs."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              value={zIndexValue}
              onValueChange={(v) => setZIndexValue(v)}
              dropdownZIndex={9999}
              placeholder="Search (z-index: 9999)..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Default z-index is 50. Increase it when the dropdown needs to appear
          above other positioned elements like modals or tooltips.
        </div>
      </Section>

      {/* ─── Custom Clear Icon ───────────────────────────────────────────── */}
      <Section
        title="Custom Clear Icon"
        description="Replace the default clear icon with a custom icon component via the ClearIcon prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              value={customClearIconValue}
              onValueChange={(v) => setCustomClearIconValue(v)}
              clearable
              placeholder="Search fruits..."
              ClearIcon={() => (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Check Icon ───────────────────────────────────────────── */}
      <Section
        title="Custom Check Icon"
        description="Replace the default check icon with a custom icon component via the CheckIcon prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              value={customCheckIconValue}
              onValueChange={(v) => setCustomCheckIconValue(v)}
              placeholder="Search fruits..."
              CheckIcon={({ className }) => (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={className}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Search Icon ──────────────────────────────────────────── */}
      <Section
        title="Custom Search Icon"
        description="Replace the default search icon with a custom icon component via the SearchIcon prop. This is unique to SearchableDropdown."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              placeholder="Custom search icon..."
              SearchIcon={({ className }) => (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={className}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Form Integration (onBlur / onFocus) ─────────────────────────── */}
      <Section
        title="Form Integration (onBlur / onFocus)"
        description="Use onBlur and onFocus callbacks for integration with form libraries like React Hook Form or Formik."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              value={focusBlurValue}
              onValueChange={(v) => setFocusBlurValue(v)}
              placeholder="Focus or blur me..."
              onFocus={() => setFocusMessage("Dropdown focused")}
              onBlur={() => setFocusMessage("Dropdown blurred")}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        {focusMessage && (
          <p
            className={`text-sm mt-2 text-cl-accent`}
            data-demo-action
          >
            {focusMessage}
          </p>
        )}
        <div className={c.note}>
          These callbacks fire on the trigger button's focus/blur events.
          Perfect for form validation libraries that track field touch state.
        </div>
      </Section>

      {/* ─── Custom KeyDown Handler ──────────────────────────────────────── */}
      <Section
        title="Custom KeyDown Handler"
        description="Provide a custom onKeyDown handler to intercept or extend keyboard behavior. Call preventDefault() to override internal behavior."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <SearchableDropdown
              options={fruitOptions}
              value={customKeyDownValue}
              onValueChange={(v) => setCustomKeyDownValue(v)}
              placeholder="Try pressing 'x'..."
              onKeyDown={(event) => {
                if (event.key === "x" || event.key === "X") {
                  event.preventDefault();
                  setKeyDownMessage(
                    "You pressed 'x' - custom handler intercepted!",
                  );
                  setTimeout(() => setKeyDownMessage(""), 2000);
                }
              }}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        {keyDownMessage && (
          <p
            className={`text-sm mt-2 text-cl-success`}
          >
            {keyDownMessage}
          </p>
        )}
      </Section>

      {/* ─── className, style & aria-label ───────────────────────────────── */}
      <Section
        title="className, style & aria-label"
        description="Use className as a fallback for classes.root, style for inline styles, and aria-label to customize the listbox's accessible label."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-6">
            <div>
              <DemoLabel isDarkMode={dark}>
                className (fallback for classes.root)
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <SearchableDropdown
                  options={fruitOptions}
                  placeholder="Search fruits..."
                  className={`opacity-90`}
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>
                style (inline styles on root)
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <SearchableDropdown
                  options={fruitOptions}
                  value={classNameStyleValue}
                  onValueChange={(v) => setClassNameStyleValue(v)}
                  placeholder="Search fruits..."
                  style={{ maxWidth: "300px", margin: "0 auto" }}
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>
                aria-label=&quot;Fruit search&quot;
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <SearchableDropdown
                  options={fruitOptions}
                  placeholder="Search fruits..."
                  aria-label="Fruit search"
                  classes={c.dropdown}
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Shimmer Count Variations ────────────────────────────────────── */}
      <Section
        title="Shimmer Count Variations"
        description="Control the number of shimmer skeleton items displayed during loading with the shimmerCount prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>3 shimmer items</DemoLabel>
              <SearchableDropdown
                options={[]}
                placeholder="Loading..."
                loading={true}
                shimmerCount={3}
                classes={c.dropdown}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>8 shimmer items</DemoLabel>
              <SearchableDropdown
                options={[]}
                placeholder="Loading..."
                loading={true}
                shimmerCount={8}
                classes={c.dropdown}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Empty Options ───────────────────────────────────────────────── */}
      <Section
        title="Empty Options"
        description="When no options are available, a configurable empty state is displayed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Default text</DemoLabel>
              <SearchableDropdown
                options={[]}
                placeholder="No options..."
                classes={c.dropdown}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Custom ReactNode</DemoLabel>
              <SearchableDropdown
                options={[]}
                placeholder="Custom empty..."
                noResultsContent={
                  <span className="flex flex-col items-center gap-1 py-2">
                    <span
                      className={`text-lg text-cl-text-tertiary`}
                    >
                      🔍
                    </span>
                    <span
                      className={`text-sm text-cl-text-secondary`}
                    >
                      Nothing here yet
                    </span>
                  </span>
                }
                classes={c.dropdown}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Combined: All Features ──────────────────────────────────────── */}
      <Section
        title="Combined: All Features"
        description="A comprehensive example combining multiple features: label, required, clearable, custom icons, search, and async."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
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
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={className}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          This dropdown combines label, required indicator, clearable selection,
          custom chevron and check icons, and a custom search placeholder, all
          working together seamlessly.
        </div>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="SearchableDropdown" />

      {/* ─── Accessibility ───────────────────────────────────────────────── */}

      <DocControlledPattern
        isDarkMode={dark}
        summary="Combine `value` / `onValueChange` with async `onSearch` or static `options`. Control `open` when coordinating with other overlays. Debounce network search in the parent."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Empty search results need a clear empty state and SR message.",
          "Race conditions: ignore stale responses when queries overlap.",
          "Highlighting active options must stay in sync with `aria-activedescendant`.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `label` or `aria-label` on the trigger.",
          "Return a `<button>` from `renderTrigger`.",
          "Debounce and cancel in-flight fetches for remote search.",
        ]}
        donts={[
          "Do not fetch on every keystroke without debouncing.",
          "Do not hide focus outlines on the trigger or listbox.",
          "Do not use duplicate option values.",
        ]}
      />
    </div>
  );
};

export default SearchableDropdownDemo;
