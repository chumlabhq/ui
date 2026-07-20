import { useState, useCallback } from "react";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown";
import type { MultiSelectOption } from "../../components/MultiSelectSearchableDropdown";
import { useTheme } from "./ThemeContext";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DemoLabel,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";
import {
  fetchCountries,
  searchCountries,
  type Country,
} from "./lib/countries";

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
  {
    value: "gb",
    label: "United Kingdom",
    content: <span>United Kingdom</span>,
  },
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
 trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
    triggerText: "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
 content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
    searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-border dark:bg-cl-bg-elevated`,
    searchInputElement: dark ? "text-cl-text placeholder:text-cl-text-tertiary" : "",
    searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
    optionList: "max-h-60 overflow-y-auto",
    option: `flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text hover:bg-black/5 dark:text-cl-text dark:hover:bg-white/10`,
    optionSelected: dark ? "bg-cl-accent/50 font-medium" : "bg-cl-accent/10 font-medium",
    optionFocused: dark ? "bg-white/10" : "bg-black/5",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-secondary`,
    checkbox: `w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input`,
    checkboxChecked: "bg-cl-accent border-cl-border-input-focus text-white",
    checkboxIcon: "w-full h-full",
    noResults: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
    loading: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
    label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
    error: `text-sm mt-1 text-cl-error`,
    chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text`,
    chipRemove: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary`,
    moreCount: `inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-bg-hover text-cl-text-secondary dark:bg-cl-text/10 dark:text-cl-text-secondary`,
  },
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
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
  const [disabledValue, setDisabledValue] = useState<string[]>([
    "apple",
    "banana",
  ]);
  // Error
  const [errorValue, setErrorValue] = useState<string[]>([]);
  // Description
  const [descriptionValue, setDescriptionValue] = useState<string[]>([]);
  // Success
  const [successValue, setSuccessValue] = useState<string[]>([]);
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
  // Dropdown position
  const [posBotValue, setPosBotValue] = useState<string[]>([]);
  const [posTopValue, setPosTopValue] = useState<string[]>([]);
  const [forceBotValue, setForceBotValue] = useState<string[]>([]);
  const [forceTopValue, setForceTopValue] = useState<string[]>([]);
  const [forceLockValue, setForceLockValue] = useState<string[]>([]);
  // Style variants
  const [variantDefaultValue, setVariantDefaultValue] = useState<string[]>([]);
  const [variantBorderlessValue, setVariantBorderlessValue] = useState<
    string[]
  >([]);
  const [variantBottomValue, setVariantBottomValue] = useState<string[]>([]);
  const [variantGhostValue, setVariantGhostValue] = useState<string[]>([]);
  const [variantPillValue, setVariantPillValue] = useState<string[]>([]);
  // Form integration
  const [formValue, setFormValue] = useState<string[]>([]);
  const [formEvents, setFormEvents] = useState<string[]>([]);
  // Custom keydown
  const [keyDownValue, setKeyDownValue] = useState<string[]>([]);
  const [keyDownLog, setKeyDownLog] = useState<string[]>([]);
  // className & style
  const [classNameValue, setClassNameValue] = useState<string[]>([]);
  // aria-label
  const [ariaLabelValue, setAriaLabelValue] = useState<string[]>([]);
  // Keep mounted
  const [keepMountedValue, setKeepMountedValue] = useState<string[]>([]);
  // Portal container
  const [portalValue, setPortalValue] = useState<string[]>([]);
  const [portalEl, setPortalEl] = useState<HTMLDivElement | null>(null);
  // Custom gap
  const [gapValue, setGapValue] = useState<string[]>([]);
  // Custom z-index
  const [zIndexValue, setZIndexValue] = useState<string[]>([]);
  // Full width
  const [fullWidthValue, setFullWidthValue] = useState<string[]>([]);
  // Empty state
  // Combined features
  const [combinedValue, setCombinedValue] = useState<string[]>([]);

  const mapCountryToOption = useCallback(
    (country: Country): MultiSelectOption => ({
      value: country.code,
      label: country.name,
      content: (
        <div className="flex items-center gap-2">
          <img
            src={`https://chumflagscdn.s3.ap-south-1.amazonaws.com/flags/${country.code.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="w-5 h-4 object-cover rounded-cl-sm border border-cl-border"
          />
          <div className="flex flex-col">
            <span className="text-sm">{country.name}</span>
            <span className="text-xs text-cl-text-tertiary">
              {country.capital || country.region}
            </span>
          </div>
        </div>
      ),
      selectedContent: <span className="truncate">{country.name}</span>,
    }),
    [],
  );

  const handleAsyncSearch = useCallback(
    async (query: string): Promise<MultiSelectOption[]> => {
      const data = await searchCountries(query);

      return data.slice(0, 10).map(mapCountryToOption);
    },
    [mapCountryToOption],
  );

  const handleLoadInitialOptions = useCallback(async (): Promise<
    MultiSelectOption[]
  > => {
    const data = await fetchCountries();

    const popularCountryCodes = [
      "US",
      "GB",
      "DE",
      "FR",
      "JP",
      "CA",
      "AU",
      "IN",
      "BR",
      "IT",
    ];
    const popularCountries = popularCountryCodes
      .map((code) => data.find((r) => r.code === code))
      .filter((r): r is Country => r !== undefined);

    return popularCountries.map(mapCountryToOption);
  }, [mapCountryToOption]);

  return (
    <div className="space-y-10">
      <DocsHero
        title="Multi Select Searchable Dropdown"
        description="A multi-select dropdown with built-in search, async loading, debounced queries, chips display, and full customization via the classes prop."
        code={`import { MultiSelectSearchableDropdown } from "@chumlab/ui/multi-select-searchable-dropdown";`}
      />

      {/* ─── Basic Usage ──────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Standard multi-select with search and chips."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            {/* Basic usage — works out-of-the-box with built-in styles */}
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={basicValue}
              onValueChange={(values) => setBasicValue(values)}
              placeholder="Select fruits..."
              aria-label="Select fruits"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Custom Content ──────────────────────────────────────────── */}
      <Section
        title="With Custom Content"
        description="Use the content prop on options for rich rendering."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-80">
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
          Try: &quot;germany&quot;, &quot;united&quot;, &quot;japan&quot;,
          &quot;aus&quot;
        </div>
      </Section>

      {/* ─── Async with Dynamic Prefetch ──────────────────────────────────── */}
      <Section
        title="Async with Dynamic Prefetch"
        description="Fetches popular countries when dropdown opens, searches API when user types."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
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
          Options are fetched from the REST Countries API when the dropdown
          opens.
        </div>
      </Section>

      {/* ─── With Label ───────────────────────────────────────────────────── */}
      <Section
        title="With Label"
        description="Use the label and required props."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={disabledValue}
              onValueChange={(values) => setDisabledValue(values)}
              disabled
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                trigger: `${c.dropdown.trigger} opacity-50 cursor-not-allowed`,
              }}
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
          <div className="w-full sm:max-w-72">
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
              classes={{
                ...c.dropdown,
                trigger: `${c.dropdown.trigger} border border-cl-error focus:ring-cl-error`,
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
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              label="Favorite Fruits"
              description="Select one or more fruits from the list."
              options={staticOptions}
              value={descriptionValue}
              onValueChange={(values) => setDescriptionValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Success State ─────────────────────────────────────────────────── */}
      <Section
        title="Success State"
        description="Show success feedback with success and successMessage props."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              label="Required Fruits"
              options={staticOptions}
              value={successValue}
              onValueChange={(values) => setSuccessValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              success={successValue.length > 0}
              successMessage="Selection saved successfully"
              classes={{
                ...c.dropdown,
                trigger: `${c.dropdown.trigger}${successValue.length > 0 ? " border border-cl-success focus:ring-cl-success" : ""}`,
              }}
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
          <div className="w-full sm:max-w-72">
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
            <div className="w-full sm:max-w-72">
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
        description="By default, the page remains scrollable when the dropdown is open. Set lockScroll to lock body scroll while open."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={scrollUnlockedValue}
              onValueChange={(values) => setScrollUnlockedValue(values)}
              placeholder="Default (scrollable)"
              maxDisplayedChips={2}
              classes={c.dropdown}
              aria-label="Scroll unlocked dropdown"
            />
          </div>
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={scrollLockValue}
              onValueChange={(values) => setScrollLockValue(values)}
              placeholder="lockScroll enabled"
              lockScroll
              maxDisplayedChips={2}
              classes={c.dropdown}
              aria-label="Scroll locked dropdown"
            />
          </div>
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
                <MultiSelectSearchableDropdown
                  options={staticOptions}
                  value={posBotValue}
                  onValueChange={setPosBotValue}
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
                <MultiSelectSearchableDropdown
                  options={staticOptions}
                  value={posTopValue}
                  onValueChange={setPosTopValue}
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
                <MultiSelectSearchableDropdown
                  options={staticOptions}
                  value={forceBotValue}
                  onValueChange={setForceBotValue}
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
                <MultiSelectSearchableDropdown
                  options={staticOptions}
                  value={forceTopValue}
                  onValueChange={setForceTopValue}
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
                <MultiSelectSearchableDropdown
                  options={staticOptions}
                  value={forceLockValue}
                  onValueChange={setForceLockValue}
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

      {/* ─── Style Variants ───────────────────────────────────────────────── */}
      <Section
        title="Style Variants"
        description="Different visual treatments using the classes prop -- borderless, bottom-border-only, ghost, and pill styles."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div>
            <p className={`mb-2 ${c.label}`}>Default (bordered)</p>
            <div className="w-full sm:max-w-72">
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
            <div className="w-full sm:max-w-72">
              <MultiSelectSearchableDropdown
                options={staticOptions}
                value={variantBorderlessValue}
                onValueChange={(values) => setVariantBorderlessValue(values)}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer min-h-[42px] bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover dark:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-bg-hover`,
                  triggerText:
                    "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                }}
                aria-label="Borderless variant"
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Bottom border only</p>
            <div className="w-full sm:max-w-72">
              <MultiSelectSearchableDropdown
                options={staticOptions}
                value={variantBottomValue}
                onValueChange={(values) => setVariantBottomValue(values)}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-1 py-2 text-sm border-b-2 rounded-none transition-colors cursor-pointer min-h-[42px] border border-cl-border text-cl-text hover:border-cl-border-input-focus focus-within:border-cl-border-input-focus dark:border dark:border-cl-border dark:text-cl-text dark:hover:border-cl-border-input-focus dark:focus-within:border-cl-border-input-focus`,
                  triggerText:
                    "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                }}
                aria-label="Bottom border variant"
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Ghost</p>
            <div className="w-full sm:max-w-72">
              <MultiSelectSearchableDropdown
                options={staticOptions}
                value={variantGhostValue}
                onValueChange={(values) => setVariantGhostValue(values)}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer min-h-[42px] text-cl-text-secondary hover:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-text/60`,
                  triggerText:
                    "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                }}
                aria-label="Ghost variant"
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Pill</p>
            <div className="w-full sm:max-w-72">
              <MultiSelectSearchableDropdown
                options={staticOptions}
                value={variantPillValue}
                onValueChange={(values) => setVariantPillValue(values)}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
 trigger: `flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-colors cursor-pointer min-h-[42px] border border-cl-border bg-white text-cl-text hover:border-cl-border-input shadow-sm dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:border-cl-border`,
                  triggerText:
                    "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
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
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={darkThemeValue}
              onValueChange={(values) => setDarkThemeValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                trigger:
                  "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-[#2a2f3a] bg-[#0a0d12] text-white hover:bg-[#11151c] focus:outline-none focus:ring-2 focus:ring-cl-accent min-h-[42px]",
                content:
                  "rounded-cl-md shadow-lg overflow-hidden bg-[#0a0d12] border border-[#2a2f3a]",
                searchInput:
                  "flex items-center gap-2 px-3 py-2 border-b border-[#2a2f3a] bg-[#0a0d12]",
                searchInputElement: "text-white placeholder:text-white/50",
                option:
                  "flex items-center gap-2 px-3 py-2 cursor-pointer text-white hover:bg-white/[0.08] transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
                optionSelected: "bg-white/[0.12] font-medium",
                optionFocused: "bg-white/[0.08]",
                chevron:
                  "w-4 h-4 shrink-0 transition-transform duration-200 text-white/60",
                checkbox:
                  "w-4 h-4 shrink-0 border border-white/30 rounded flex items-center justify-center",
                checkboxChecked: "bg-cl-accent border-cl-accent text-white",
                searchIcon: "w-4 h-4 shrink-0 text-white/60",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white/[0.10] text-white rounded-cl-md shrink-0 max-w-[100px]",
                chipRemove:
                  "w-3 h-3 shrink-0 cursor-pointer text-white/70 hover:text-white",
                moreCount:
                  "inline-flex items-center px-2 py-0.5 text-xs bg-white/[0.10] text-white/80 rounded-cl-md shrink-0",
                noResults: "px-3 py-4 text-sm text-white/60 text-center",
              }}
              aria-label="Dark theme fruits"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Blue Theme ───────────────────────────────────────────────────── */}
      <Section
        title="Blue Theme"
        description="Custom color scheme example using the brand accent."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={purpleThemeValue}
              onValueChange={(values) => setPurpleThemeValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-cl-accent min-h-[42px] border-cl-border-input-focus bg-cl-accent/10 text-cl-accent hover:border-cl-border-input-focus dark:border dark:border-cl-border-input-focus dark:bg-cl-accent/60 dark:text-cl-accent dark:hover:border-cl-border-input-focus`,
                triggerText:
                  "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                content: `rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-accent)_10%,var(--color-cl-bg-elevated))] border border-cl-border-input-focus dark:bg-[color-mix(in_oklab,var(--color-cl-accent)_20%,var(--color-cl-bg-elevated))] dark:border dark:border-cl-border-input-focus`,
                searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border-input-focus bg-cl-accent/10 dark:border dark:border-cl-border-input-focus dark:bg-cl-accent/20`,
                option: `flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-accent hover:bg-cl-accent/10 dark:text-cl-accent dark:hover:bg-cl-accent/60`,
                optionSelected: dark ? "bg-cl-accent/80" : "bg-cl-accent/10",
                optionFocused: dark ? "bg-cl-accent/60" : "bg-cl-accent/10",
                chevron: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent`,
                checkbox: `w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input-focus dark:border dark:border-cl-border-input-focus`,
                checkboxChecked: dark
                  ? "bg-cl-accent border-cl-border-input-focus text-white"
                  : "bg-cl-accent border-cl-border-input-focus text-white",
                searchIcon: `w-4 h-4 shrink-0 text-cl-accent`,
                chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/60 dark:text-cl-accent`,
                chipRemove: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-accent`,
                moreCount: `inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/40 dark:text-cl-accent`,
                label: `block text-sm font-medium mb-1 text-cl-accent`,
                error: `text-sm mt-1 text-cl-accent`,
              }}
              aria-label="Blue theme fruits"
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
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={greenCheckboxValue}
              onValueChange={(values) => setGreenCheckboxValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                checkbox: `w-4 h-4 shrink-0 border rounded-full flex items-center justify-center border-cl-border-input`,
                checkboxChecked: "bg-cl-success border-cl-success text-white",
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
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={orangeCheckboxValue}
              onValueChange={(values) => setOrangeCheckboxValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                checkbox:
                  "w-5 h-5 shrink-0 border-2 border-cl-warning rounded-cl-sm flex items-center justify-center",
                checkboxChecked: "bg-cl-warning border-cl-warning text-white",
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
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={customIconValue}
              onValueChange={(values) => setCustomIconValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              checkboxIcon={
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              }
              classes={{
                ...c.dropdown,
                checkbox: `w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-warning dark:border dark:border-cl-warning`,
                checkboxChecked: "bg-cl-warning border-cl-warning text-white",
              }}
              aria-label="Custom icon fruits"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Uncontrolled ─────────────────────────────────────────────────── */}
      <Section
        title="Uncontrolled"
        description="Use defaultValue for an uncontrolled component -- no state management needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              defaultValue={["apple", "cherry"]}
              onValueChange={(values) =>
                console.log("Uncontrolled change:", values)
              }
              placeholder="Select fruits..."
              maxDisplayedChips={3}
              classes={c.dropdown}
              aria-label="Uncontrolled fruits"
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          The dropdown starts with Apple and Cherry pre-selected via
          defaultValue. No useState needed.
        </div>
      </Section>

      {/* ─── Form Integration ──────────────────────────────────────────────── */}
      <Section
        title="Form Integration"
        description="Use onBlur and onFocus handlers for form validation and event tracking."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              label="Favorite Fruits"
              required
              options={staticOptions}
              value={formValue}
              onValueChange={(values) => setFormValue(values)}
              onFocus={() =>
                setFormEvents((prev) => [
                  ...prev.slice(-4),
                  `focus @ ${new Date().toLocaleTimeString()}`,
                ])
              }
              onBlur={() =>
                setFormEvents((prev) => [
                  ...prev.slice(-4),
                  `blur @ ${new Date().toLocaleTimeString()}`,
                ])
              }
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        {formEvents.length > 0 && (
          <div className={`mt-2 space-y-1`}>
            {formEvents.map((event, i) => (
              <p
                key={i}
                className={`text-xs font-mono text-cl-text-secondary`}
              >
                {event}
              </p>
            ))}
            <button
              type="button"
              className={c.btn}
              onClick={() => setFormEvents([])}
            >
              Clear log
            </button>
          </div>
        )}
      </Section>

      {/* ─── Custom KeyDown Handler ────────────────────────────────────────── */}
      <Section
        title="Custom KeyDown Handler"
        description="Intercept keyboard events with onKeyDown for custom behavior."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={keyDownValue}
              onValueChange={(values) => setKeyDownValue(values)}
              onKeyDown={(e) =>
                setKeyDownLog((prev) => [
                  ...prev.slice(-4),
                  `${e.key} @ ${new Date().toLocaleTimeString()}`,
                ])
              }
              placeholder="Press keys while open..."
              maxDisplayedChips={2}
              classes={c.dropdown}
              aria-label="KeyDown demo"
            />
          </div>
        </DemoWrapper>
        {keyDownLog.length > 0 && (
          <div className={`mt-2 space-y-1`}>
            {keyDownLog.map((entry, i) => (
              <p
                key={i}
                className={`text-xs font-mono text-cl-text-secondary`}
              >
                {entry}
              </p>
            ))}
            <button
              type="button"
              className={c.btn}
              onClick={() => setKeyDownLog([])}
            >
              Clear log
            </button>
          </div>
        )}
      </Section>

      {/* ─── className & style ─────────────────────────────────────────────── */}
      <Section
        title="className & style"
        description="Apply a custom className and inline style to the root element."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={classNameValue}
              onValueChange={(values) => setClassNameValue(values)}
              placeholder="Styled root..."
              maxDisplayedChips={2}
              className="my-custom-dropdown"
              style={{
                border: `2px dashed #818cf8 dark:#6366f1`,
                borderRadius: 12,
                padding: 4,
              }}
              classes={c.dropdown}
              aria-label="Custom className and style"
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          The root element has className=&quot;my-custom-dropdown&quot; and a
          dashed indigo border via the style prop.
        </div>
      </Section>

      {/* ─── aria-label ────────────────────────────────────────────────────── */}
      <Section
        title="aria-label (No Visible Label)"
        description="When no visible label is provided, use aria-label for screen reader accessibility."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={countryOptions}
              value={ariaLabelValue}
              onValueChange={(values) => setAriaLabelValue(values)}
              placeholder="Select countries..."
              maxDisplayedChips={2}
              classes={c.dropdown}
              aria-label="Country selection without visible label"
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          No label prop is used. Screen readers will announce &quot;Country
          selection without visible label&quot; via aria-label.
        </div>
      </Section>

      {/* ─── Keep Mounted ──────────────────────────────────────────────────── */}
      <Section
        title="Keep Mounted"
        description="Use keepMounted to keep the dropdown content in the DOM when closed (hidden via CSS). Useful for SEO or preserving scroll position."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={keepMountedValue}
              onValueChange={(values) => setKeepMountedValue(values)}
              keepMounted
              placeholder="Keep mounted..."
              maxDisplayedChips={2}
              classes={c.dropdown}
              aria-label="Keep mounted demo"
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          The listbox remains in the DOM even when closed. Inspect the page to
          verify.
        </div>
      </Section>

      {/* ─── Custom Portal Container ──────────────────────────────────────── */}
      <Section
        title="Custom Portal Container"
        description="Render the dropdown into a specific DOM node instead of document.body."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-4">
            <div className="w-full sm:max-w-72">
              <MultiSelectSearchableDropdown
                options={staticOptions}
                value={portalValue}
                onValueChange={(values) => setPortalValue(values)}
                portalContainer={portalEl}
                placeholder="Custom portal target..."
                maxDisplayedChips={2}
                classes={c.dropdown}
                aria-label="Portal container demo"
              />
            </div>
            <div
              ref={setPortalEl}
              className={`relative min-h-[60px] rounded-cl-md border-2 border-dashed p-3 border-cl-border-input bg-cl-bg-hover dark:border dark:border-cl-border dark:bg-cl-bg-elevated/50`}
            >
              <p
                className={`text-xs text-cl-text-tertiary`}
              >
                Portal target container -- the dropdown renders here
              </p>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Dropdown Gap ───────────────────────────────────────────── */}
      <Section
        title="Custom Dropdown Gap"
        description="Adjust the spacing between the trigger and dropdown list using dropdownGap."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-start gap-6">
            <div>
              <p className={`mb-2 ${c.label}`}>Default (4px)</p>
              <div className="w-56">
                <MultiSelectSearchableDropdown
                  options={staticOptions}
                  value={gapValue}
                  onValueChange={(values) => setGapValue(values)}
                  placeholder="Gap: 4px..."
                  maxDisplayedChips={1}
                  classes={c.dropdown}
                  aria-label="Default gap"
                />
              </div>
            </div>
            <div>
              <p className={`mb-2 ${c.label}`}>Large (16px)</p>
              <div className="w-56">
                <MultiSelectSearchableDropdown
                  options={staticOptions}
                  value={gapValue}
                  onValueChange={(values) => setGapValue(values)}
                  dropdownGap={16}
                  placeholder="Gap: 16px..."
                  maxDisplayedChips={1}
                  classes={c.dropdown}
                  aria-label="Large gap"
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Z-Index ────────────────────────────────────────────────── */}
      <Section
        title="Custom Z-Index"
        description="Override the dropdown z-index for layered UIs."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={zIndexValue}
              onValueChange={(values) => setZIndexValue(values)}
              dropdownZIndex={9999}
              placeholder="z-index: 9999..."
              maxDisplayedChips={2}
              classes={c.dropdown}
              aria-label="Custom z-index"
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          The dropdown renders with z-index: 9999 -- useful when layered above
          modals or sticky headers.
        </div>
      </Section>

      {/* ─── Full Width ────────────────────────────────────────────────────── */}
      <Section
        title="Full Width"
        description="Use fullWidth to make the dropdown span its entire container."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full">
            <MultiSelectSearchableDropdown
              options={staticOptions}
              value={fullWidthValue}
              onValueChange={(values) => setFullWidthValue(values)}
              fullWidth
              placeholder="Full width dropdown..."
              maxDisplayedChips={3}
              classes={c.dropdown}
              aria-label="Full width"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Empty State (No Options) ──────────────────────────────────────── */}
      <Section
        title="Empty State (No Options)"
        description='Pass an empty array to show the "no results" state.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-start gap-6">
            <div>
              <p className={`mb-2 ${c.label}`}>Default message</p>
              <div className="w-56">
                <MultiSelectSearchableDropdown
                  options={[]}
                  defaultOpen
                  placeholder="No options..."
                  classes={c.dropdown}
                  aria-label="Empty default"
                />
              </div>
            </div>
            <div>
              <p className={`mb-2 ${c.label}`}>Custom message</p>
              <div className="w-56">
                <MultiSelectSearchableDropdown
                  options={[]}
                  noResultsContent={
                    <div className="flex flex-col items-center gap-1 py-2">
                      <span className="text-lg">🍎</span>
                      <span
                        className={`text-xs text-cl-text-secondary`}
                      >
                        No fruits available right now
                      </span>
                    </div>
                  }
                  placeholder="No options..."
                  classes={c.dropdown}
                  aria-label="Empty custom message"
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Combined Features ─────────────────────────────────────────────── */}
      <Section
        title="Combined Features"
        description="A single dropdown combining many features: label, required, error state, custom classes, keepMounted, custom gap, and event handlers."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
            <MultiSelectSearchableDropdown
              label="Select Countries"
              required
              options={countryOptions}
              value={combinedValue}
              onValueChange={(values) => setCombinedValue(values)}
              error={combinedValue.length === 0}
              errorMessage={
                combinedValue.length === 0
                  ? "Please select at least one country"
                  : undefined
              }
              placeholder="Pick countries..."
              maxDisplayedChips={2}
              fullWidth
              keepMounted
              dropdownGap={8}
              dropdownZIndex={100}
              searchPlaceholder="Filter countries..."
              onFocus={() => console.log("Combined: focus")}
              onBlur={() => console.log("Combined: blur")}
              onKeyDown={(e) => console.log("Combined keydown:", e.key)}
              classes={{
                ...c.dropdown,
                trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors min-h-[42px] border-cl-border-input-focus bg-cl-accent/10 text-cl-accent hover:border-cl-border-input-focus focus:outline-none focus:ring-2 focus:ring-cl-accent dark:border dark:border-cl-border-input-focus dark:bg-cl-accent/40 dark:text-cl-accent dark:hover:border-cl-border-input-focus dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
                triggerText:
                  "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                content: `rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-accent)_10%,var(--color-cl-bg-elevated))] border border-cl-border-input-focus dark:bg-[color-mix(in_oklab,var(--color-cl-accent)_20%,var(--color-cl-bg-elevated))] dark:border dark:border-cl-border-input-focus`,
                optionSelected: dark ? "bg-cl-accent/60" : "bg-cl-accent/10",
                optionFocused: dark ? "bg-cl-accent/40" : "bg-cl-accent/10",
                checkboxChecked: "bg-cl-accent border-cl-border-input-focus text-white",
                chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/60 dark:text-cl-accent`,
              }}
            />
          </div>
        </DemoWrapper>
        {combinedValue.length > 0 && (
          <p
            className={`text-sm mt-2 text-cl-accent`}
          >
            Selected: {combinedValue.join(", ")}
          </p>
        )}
      </Section>

      {/* ─── Props ────────────────────────────────────────────────────────── */}
      <Section title="MultiSelectSearchableDropdown Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="options"
              type="MultiSelectOption[]"
              defaultVal="[]"
              description="Static options array"
              isDarkMode={dark}
            />
            <PropRow
              name="value"
              type="string[]"
              description="Selected values (controlled)"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultValue"
              type="string[]"
              description="Initial selected values (uncontrolled)"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(values, options) => void"
              description="Change handler (required)"
              isDarkMode={dark}
            />
            <PropRow
              name="id"
              type="string"
              description="ID for ARIA and form association"
              isDarkMode={dark}
            />
            <PropRow
              name="name"
              type="string"
              description="Form field name"
              isDarkMode={dark}
            />
            <PropRow
              name="placeholder"
              type="string"
              defaultVal='"Select options..."'
              description="Placeholder when nothing selected"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disable the dropdown"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="boolean"
              defaultVal="false"
              description="Show error state"
              isDarkMode={dark}
            />
            <PropRow
              name="errorMessage"
              type="ReactNode"
              description="Error message to display"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="ReactNode"
              description="Label for the dropdown"
              isDarkMode={dark}
            />
            <PropRow
              name="required"
              type="boolean"
              defaultVal="false"
              description="Whether field is required"
              isDarkMode={dark}
            />
            <PropRow
              name="showSearch"
              type="boolean"
              defaultVal="true"
              description="Show the search input"
              isDarkMode={dark}
            />
            <PropRow
              name="searchPlaceholder"
              type="string"
              defaultVal='"Search..."'
              description="Placeholder for search input"
              isDarkMode={dark}
            />
            <PropRow
              name="showChevron"
              type="boolean"
              defaultVal="true"
              description="Show dropdown chevron"
              isDarkMode={dark}
            />
            <PropRow
              name="fullWidth"
              type="boolean"
              defaultVal="false"
              description="Take full container width"
              isDarkMode={dark}
            />
            <PropRow
              name="loading"
              type="boolean"
              defaultVal="false"
              description="External loading state"
              isDarkMode={dark}
            />
            <PropRow
              name="onSearch"
              type="(query) => Promise<Option[]>"
              description="Async search function"
              isDarkMode={dark}
            />
            <PropRow
              name="searchDebounceMs"
              type="number"
              defaultVal="300"
              description="Debounce delay for search"
              isDarkMode={dark}
            />
            <PropRow
              name="initialOptions"
              type="MultiSelectOption[]"
              description="Pre-loaded initial options"
              isDarkMode={dark}
            />
            <PropRow
              name="onLoadInitialOptions"
              type="() => Promise<Option[]>"
              description="Async function to load initial options"
              isDarkMode={dark}
            />
            <PropRow
              name="loadInitialOnOpen"
              type="boolean"
              defaultVal="false"
              description="Load initial options when dropdown opens"
              isDarkMode={dark}
            />
            <PropRow
              name="maxDisplayedChips"
              type="number"
              defaultVal="3"
              description="Max chips before showing +N"
              isDarkMode={dark}
            />
            <PropRow
              name="showSelectedChips"
              type="boolean"
              defaultVal="true"
              description="Show chips or count only"
              isDarkMode={dark}
            />
            <PropRow
              name="clearable"
              type="boolean"
              defaultVal="false"
              description="Show a clear button to deselect all values"
              isDarkMode={dark}
            />
            <PropRow
              name="checkboxIcon"
              type="ReactNode"
              defaultVal="CheckIcon"
              description="Custom checkbox icon"
              isDarkMode={dark}
            />
            <PropRow
              name="unstyled"
              type="boolean"
              defaultVal="false"
              description="Strip all default classes"
              isDarkMode={dark}
            />
            <PropRow
              name="lockScroll"
              type="boolean"
              defaultVal="false"
              description="Lock body scroll while dropdown is open"
              isDarkMode={dark}
            />
            <PropRow
              name="open"
              type="boolean"
              description="Controlled open state"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultOpen"
              type="boolean"
              defaultVal="false"
              description="Initial open state (uncontrolled)"
              isDarkMode={dark}
            />
            <PropRow
              name="onOpenChange"
              type="(open: boolean) => void"
              description="Called when open state changes"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="MultiSelectSearchableDropdownClasses"
              description="Class names for internal elements"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="Root class name"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Root inline styles"
              isDarkMode={dark}
            />
            <PropRow
              name="keepMounted"
              type="boolean"
              defaultVal="false"
              description="Keep listbox in DOM when closed"
              isDarkMode={dark}
            />
            <PropRow
              name="portalContainer"
              type="HTMLElement | null"
              defaultVal="document.body"
              description="Portal target"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownPosition"
              type='"top" | "bottom"'
              defaultVal='"bottom"'
              description="Preferred list position"
              isDarkMode={dark}
            />
            <PropRow
              name="forceDropdownPosition"
              type="boolean"
              defaultVal="false"
              description="When true, locks the dropdown to the specified dropdownPosition without auto-flipping"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownZIndex"
              type="number"
              defaultVal="50"
              description="Listbox z-index"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownGap"
              type="number"
              defaultVal="4"
              description="Gap between trigger and list (px)"
              isDarkMode={dark}
            />
            <PropRow
              name="noResultsContent"
              type="ReactNode"
              defaultVal='"No results found"'
              description="Custom no-results content"
              isDarkMode={dark}
            />
            <PropRow
              name="loadingText"
              type="string"
              defaultVal='"Loading..."'
              description="Loading state text"
              isDarkMode={dark}
            />
            <PropRow
              name="aria-label"
              type="string"
              description="Accessible label for the dropdown"
              isDarkMode={dark}
            />
            <PropRow
              name="ClearIcon"
              type="ComponentType"
              description="Custom clear icon component"
              isDarkMode={dark}
            />
            <PropRow
              name="renderTrigger"
              type="(props) => ReactNode"
              description="Custom trigger renderer — receives ARIA props, isOpen, selectedOptions, and placeholder"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── MultiSelectSearchableDropdownClasses Slots ───────────────────── */}
      <Section
        title="MultiSelectSearchableDropdownClasses Slots"
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Root container element"
              isDarkMode={dark}
            />
            <PropRow
              name="wrapper"
              type="string"
              description="Inner wrapper (relative positioned)"
              isDarkMode={dark}
            />
            <PropRow
              name="trigger"
              type="string"
              description="Trigger button"
              isDarkMode={dark}
            />
            <PropRow
              name="triggerText"
              type="string"
              description="Trigger text/chips container"
              isDarkMode={dark}
            />
            <PropRow
              name="content"
              type="string"
              description="Dropdown content (portaled, background, border, shadow)"
              isDarkMode={dark}
            />
            <PropRow
              name="optionList"
              type="string"
              description="Options list wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="option"
              type="string"
              description="Base option styling"
              isDarkMode={dark}
            />
            <PropRow
              name="optionSelected"
              type="string"
              description="Additional class for selected options"
              isDarkMode={dark}
            />
            <PropRow
              name="optionFocused"
              type="string"
              description="Additional class for keyboard-focused options"
              isDarkMode={dark}
            />
            <PropRow
              name="optionDisabled"
              type="string"
              description="Additional class for disabled options"
              isDarkMode={dark}
            />
            <PropRow
              name="searchInput"
              type="string"
              description="Search input wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="searchInputElement"
              type="string"
              description="Search input text element"
              isDarkMode={dark}
            />
            <PropRow
              name="searchIcon"
              type="string"
              description="Search icon"
              isDarkMode={dark}
            />
            <PropRow
              name="checkbox"
              type="string"
              description="Checkbox container"
              isDarkMode={dark}
            />
            <PropRow
              name="checkboxChecked"
              type="string"
              description="Additional class for checked checkbox"
              isDarkMode={dark}
            />
            <PropRow
              name="checkboxIcon"
              type="string"
              description="Checkbox icon"
              isDarkMode={dark}
            />
            <PropRow
              name="chip"
              type="string"
              description="Selected chip"
              isDarkMode={dark}
            />
            <PropRow
              name="chipRemove"
              type="string"
              description="Chip remove button"
              isDarkMode={dark}
            />
            <PropRow
              name="chevron"
              type="string"
              description="Chevron icon"
              isDarkMode={dark}
            />
            <PropRow
              name="moreCount"
              type="string"
              description='"+N more" badge'
              isDarkMode={dark}
            />
            <PropRow
              name="noResults"
              type="string"
              description="No results message"
              isDarkMode={dark}
            />
            <PropRow
              name="loading"
              type="string"
              description="Loading message"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="string"
              description="Label element"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="string"
              description="Error message"
              isDarkMode={dark}
            />
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
            <PropRow
              name="data-open"
              type="root, trigger"
              description="Present when the dropdown is open"
              isDarkMode={dark}
            />
            <PropRow
              name="data-disabled"
              type="root, trigger, option"
              description="Present when disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-error"
              type="root, trigger"
              description="Present when in error state"
              isDarkMode={dark}
            />
            <PropRow
              name="data-success"
              type="root, trigger"
              description="Present when in success state"
              isDarkMode={dark}
            />
            <PropRow
              name="data-full-width"
              type="root"
              description="Present when fullWidth is true"
              isDarkMode={dark}
            />
            <PropRow
              name="data-placeholder"
              type="trigger"
              description="Present when no option is selected"
              isDarkMode={dark}
            />
            <PropRow
              name="data-selected"
              type="option"
              description="Present on selected options"
              isDarkMode={dark}
            />
            <PropRow
              name="data-focused"
              type="option"
              description="Present on the keyboard-focused option"
              isDarkMode={dark}
            />
            <PropRow
              name="data-value"
              type="option"
              description="The option's value string"
              isDarkMode={dark}
            />
            <PropRow
              name="data-state"
              type="content (portal)"
              description='"open" or "closed"'
              isDarkMode={dark}
            />
            <PropRow
              name="data-position"
              type="content (portal)"
              description='"top" or "bottom" (actual position)'
              isDarkMode={dark}
            />
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
            className={`space-y-2 text-sm text-cl-text-secondary`}
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
                  className={`mt-0.5 shrink-0 text-cl-success`}
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
            className={`text-xs font-semibold mb-3 text-cl-text-secondary`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
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

      <DocControlledPattern
        isDarkMode={dark}
        summary="Combine multi-value state with search or async `onSearch`. Parent owns the array of selected ids; debounce network calls and keep `options` consistent with results."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Selecting a result while a new search is in flight must resolve races.",
          "Keyboard users need clear focus between search field and options.",
          "Chips may wrap—layout should not break adjacent controls.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `label` or `aria-label`.",
          "Clear search when closing if that matches your UX.",
          "Return stable option `value` keys across renders.",
        ]}
        donts={[
          "Do not fire network search on every keypress without debouncing.",
          "Do not mix incompatible `value` types across options.",
          "Do not hide selected state from assistive tech.",
        ]}
      />
    </div>
  );
};

export default MultiSelectSearchableDropdownDemo;
