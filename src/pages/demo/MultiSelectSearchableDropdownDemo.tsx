import type { MultiSelectSearchableDropdownClasses } from "../../components/MultiSelectSearchableDropdown/index.js";
import {
  useState,
  useCallback } from "react";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown/index.js";
import { CountryFlag } from "../../components/CountryFlag/index.js";
import type { MultiSelectOption } from "../../components/MultiSelectSearchableDropdown/index.js";
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
  ComponentAnatomy,
  CopyPasteBlock,
  SetupNote,
} from "./components/index.js";
import { FormDemo } from "./components/FormDemo.js";
import { COUNTRIES, type Country } from "./lib/countryCatalog.js";
import { PhoneFrame } from "./components/PhoneFrame.js";
import { NextLoadControl, useFakeLoader } from "./components/FakeLoader.js";

/**
 * The async examples' data source: a static country list, filtered here and
 * resolved after LATENCY_MS so the loading state shows. It replaced calls to
 * this site's own API, which no copied example could reach.
 */
const LATENCY_MS = 400;
const withLatency = (value: Country[]): Promise<Country[]> =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
const fetchCountries = (): Promise<Country[]> => withLatency(COUNTRIES);
const searchCountries = (query: string): Promise<Country[]> => {
  const q = query.trim().toLowerCase();
  return withLatency(q ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q)) : []);
};

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

const getClasses = () => ({
  dropdown: {
    root: "",
    trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success`,
    content: `rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border`,
    searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-elevated`,
    searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
    loading: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
    label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
    chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent-surface text-cl-text`,
    chipRemoveTrigger: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent`,
  } satisfies MultiSelectSearchableDropdownClasses,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
});

/** What a good search of the skills returns; declared here so its identity holds across renders. */
const SKILL_LIST = ["CSS", "Figma", "GraphQL", "Go", "Node.js", "Python", "React", "Rust", "SQL", "TypeScript"];
const answerSkills = (query: string) =>
  SKILL_LIST.filter((skill) => skill.toLowerCase().includes(query.toLowerCase())).map((skill) => ({ value: skill.toLowerCase(), label: skill }));

const MultiSelectSearchableDropdownDemo = () => {
  const skills = useFakeLoader(answerSkills, "Couldn't search the skills. Type again to retry.");
  const { isDarkMode: dark } = useTheme();
  const c = getClasses();

  const [basicValue, setBasicValue] = useState<string[]>([]);
  const [countryValue, setCountryValue] = useState<string[]>([]);
  const [asyncValue, setAsyncValue] = useState<string[]>([]);
  const [asyncPrefetchValue, setAsyncPrefetchValue] = useState<string[]>([]);
  const [labelValue, setLabelValue] = useState<string[]>([]);
  const [noChipsValue, setNoChipsValue] = useState<string[]>([]);
  const [disabledValue, setDisabledValue] = useState<string[]>([
    "apple",
    "banana",
  ]);
  const [errorValue, setErrorValue] = useState<string[]>([]);
  const [descriptionValue, setDescriptionValue] = useState<string[]>([]);
  const [successValue, setSuccessValue] = useState<string[]>([]);
  const [noSearchValue, setNoSearchValue] = useState<string[]>([]);
  const [controlledOpen, setControlledOpen] = useState(false);
  const [controlledValue, setControlledValue] = useState<string[]>([]);
  const [darkThemeValue, setDarkThemeValue] = useState<string[]>([]);
  const [purpleThemeValue, setPurpleThemeValue] = useState<string[]>([]);
  const [greenCheckboxValue, setGreenCheckboxValue] = useState<string[]>([]);
  const [orangeCheckboxValue, setOrangeCheckboxValue] = useState<string[]>([]);
  const [customIconValue, setCustomIconValue] = useState<string[]>([]);
  const [scrollLockValue, setScrollLockValue] = useState<string[]>([]);
  const [scrollUnlockedValue, setScrollUnlockedValue] = useState<string[]>([]);
  const [posBotValue, setPosBotValue] = useState<string[]>([]);
  const [posTopValue, setPosTopValue] = useState<string[]>([]);
  const [forceBotValue, setForceBotValue] = useState<string[]>([]);
  const [forceTopValue, setForceTopValue] = useState<string[]>([]);
  const [forceLockValue, setForceLockValue] = useState<string[]>([]);
  const [variantDefaultValue, setVariantDefaultValue] = useState<string[]>([]);
  const [variantBorderlessValue, setVariantBorderlessValue] = useState<
    string[]
  >([]);
  const [variantBottomValue, setVariantBottomValue] = useState<string[]>([]);
  const [variantGhostValue, setVariantGhostValue] = useState<string[]>([]);
  const [variantPillValue, setVariantPillValue] = useState<string[]>([]);
  const [uncontrolledChange, setUncontrolledChange] = useState("not fired yet");
  const [combinedFocusCount, setCombinedFocusCount] = useState(0);
  const [combinedBlurCount, setCombinedBlurCount] = useState(0);
  const [combinedKey, setCombinedKey] = useState("not fired yet");
  const [formValue, setFormValue] = useState<string[]>([]);
  const [formEvents, setFormEvents] = useState<string[]>([]);
  const [keyDownValue, setKeyDownValue] = useState<string[]>([]);
  const [keyDownLog, setKeyDownLog] = useState<string[]>([]);
  const [classNameValue, setClassNameValue] = useState<string[]>([]);
  const [ariaLabelValue, setAriaLabelValue] = useState<string[]>([]);
  const [keepMountedValue, setKeepMountedValue] = useState<string[]>([]);
  const [portalValue, setPortalValue] = useState<string[]>([]);
  const [portalEl, setPortalEl] = useState<HTMLDivElement | null>(null);
  const [gapValue, setGapValue] = useState<string[]>([]);
  const [gapValue2, setGapValue2] = useState<string[]>([]);
  const [zIndexValue, setZIndexValue] = useState<string[]>([]);
  const [fullWidthValue, setFullWidthValue] = useState<string[]>([]);
  const [combinedValue, setCombinedValue] = useState<string[]>([]);

  const mapCountryToOption = useCallback(
    (country: Country): MultiSelectOption => ({
      value: country.code,
      label: country.name,
      content: (
        <div className="flex items-center gap-2">
          <CountryFlag
            code={country.code}
            size="md"
            alt={`${country.name} flag`}
            className="rounded-cl-sm"
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

      <SetupNote />

      <ComponentAnatomy name="MultiSelectSearchableDropdown" />

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
              maxVisible={2}
              classes={c.dropdown}
              aria-label="Select countries"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Async Search ─────────────────────────────────────────────────── */}
      <Section
        title="Async Search"
        description="Type to search a country list; results arrive after a simulated delay."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
            <MultiSelectSearchableDropdown
              value={asyncValue}
              onValueChange={(values) => setAsyncValue(values)}
              placeholder="Search countries..."
              searchOptions={handleAsyncSearch}
              searchDebounce={300}
              maxVisible={2}
              loadingContent="Searching countries..."
              emptyContent="No countries found"
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
        description="Fetches popular countries when the dropdown opens, and searches the list as you type."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
            <MultiSelectSearchableDropdown
              value={asyncPrefetchValue}
              onValueChange={(values) => setAsyncPrefetchValue(values)}
              placeholder="Select or search countries..."
              searchOptions={handleAsyncSearch}
              loadInitialOptions={handleLoadInitialOptions}
              loadInitialOnOpen
              searchDebounce={300}
              maxVisible={2}
              loadingContent="Loading..."
              emptyContent="No countries found"
              classes={c.dropdown}
              aria-label="Select or search countries"
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Options come from a static country list, resolved after a simulated
          400 ms delay when the dropdown opens.
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
              maxVisible={2}
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
              maxVisible={2}
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
              maxVisible={2}
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
              maxVisible={2}
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
              maxVisible={2}
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
              maxVisible={2}
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
                maxVisible={2}
                classes={c.dropdown}
                aria-label="Controlled dropdown"
              />
            </div>
            <Button
              type="button"
              className={c.btn}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setControlledOpen((o) => !o)}
            >
              {controlledOpen ? "Close" : "Open"}
            </Button>
            {controlledValue.length > 0 && (
              <Button
                type="button"
                className={c.btn}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setControlledValue([])}
              >
                Clear
              </Button>
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
              maxVisible={2}
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
              maxVisible={2}
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
                dropdownSide=&quot;bottom&quot; (default)
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <MultiSelectSearchableDropdown
                  label="Fruits"
                  options={staticOptions}
                  value={posBotValue}
                  onValueChange={setPosBotValue}
                  dropdownSide="bottom"
                  placeholder="Opens below..."
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>
                dropdownSide=&quot;top&quot;
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <MultiSelectSearchableDropdown
                  label="Fruits"
                  options={staticOptions}
                  value={posTopValue}
                  onValueChange={setPosTopValue}
                  dropdownSide="top"
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
                forceDropdownSide (forced bottom)
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <MultiSelectSearchableDropdown
                  label="Fruits"
                  options={staticOptions}
                  value={forceBotValue}
                  onValueChange={setForceBotValue}
                  dropdownSide="bottom"
                  forceDropdownSide
                  placeholder="Always opens below..."
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>
                forceDropdownSide (forced top)
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <MultiSelectSearchableDropdown
                  label="Fruits"
                  options={staticOptions}
                  value={forceTopValue}
                  onValueChange={setForceTopValue}
                  dropdownSide="top"
                  forceDropdownSide
                  placeholder="Always opens above..."
                  classes={c.dropdown}
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
        <div className={c.note}>
          When forceDropdownSide is true, the dropdown will always open in
          the specified direction regardless of available viewport space.
        </div>
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-8">
            <div>
              <DemoLabel isDarkMode={dark}>
                forceDropdownSide + lockScroll
              </DemoLabel>
              <div className="w-full sm:max-w-64">
                <MultiSelectSearchableDropdown
                  label="Fruits"
                  options={staticOptions}
                  value={forceLockValue}
                  onValueChange={setForceLockValue}
                  dropdownSide="bottom"
                  forceDropdownSide
                  lockScroll
                  placeholder="Forced bottom + scroll locked"
                  classes={c.dropdown}
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Combining forceDropdownSide with lockScroll prevents the page from
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
                maxVisible={2}
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
                maxVisible={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md border-0 transition-colors cursor-pointer min-h-[42px] bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover`,
                  value:
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
                maxVisible={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-1 py-2 text-sm border-0 border-b-2 rounded-none transition-colors cursor-pointer min-h-[42px] border-cl-border text-cl-text hover:border-cl-border-input-focus focus-within:border-cl-border-input-focus`,
                  value:
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
                maxVisible={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md border-0 bg-transparent transition-colors cursor-pointer min-h-[42px] text-cl-text-secondary hover:bg-cl-bg-hover`,
                  value:
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
                maxVisible={2}
                classes={{
                  ...c.dropdown,
 trigger: `flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-colors cursor-pointer min-h-[42px] border border-cl-border bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover shadow-sm`,
                  value:
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
              maxVisible={2}
              classes={{
                ...c.dropdown,
                trigger:
                  "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-[#2a2f3a] bg-[#0a0d12] text-white hover:bg-[#11151c] focus:outline-none focus:ring-2 focus:ring-cl-accent min-h-[42px]",
                content:
                  "rounded-cl-md shadow-lg overflow-hidden bg-[#0a0d12] border border-[#2a2f3a]",
                searchControl:
                  "flex items-center gap-2 px-3 py-2 border-b border-[#2a2f3a] bg-[#0a0d12]",
                searchInput: "text-white placeholder:text-white/50",
                item:
                  "flex items-center gap-2 px-3 py-2 cursor-pointer text-white hover:bg-white/[0.08] transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
                icon:
                  "w-4 h-4 shrink-0 transition-transform duration-200 text-white/60",
                itemControl:
                  "w-4 h-4 shrink-0 border border-white/30 rounded flex items-center justify-center",
                searchIcon: "w-4 h-4 shrink-0 text-white/60",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white/[0.10] text-white rounded-cl-md shrink-0 max-w-[100px]",
                chipRemoveTrigger:
                  "w-3 h-3 shrink-0 cursor-pointer text-white/70 hover:text-white",
                count:
                  "inline-flex items-center px-2 py-0.5 text-xs bg-white/[0.10] text-white/80 rounded-cl-md shrink-0",
                empty: "px-3 py-4 text-sm text-white/60 text-center",
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
              maxVisible={2}
              classes={{
                ...c.dropdown,
                trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-cl-accent min-h-[42px] border-cl-border-input-focus bg-cl-accent/10 text-cl-text hover:border-cl-border-input-focus`,
                value:
                  "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                content: `rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-accent)_10%,var(--color-cl-bg-elevated))] border border-cl-border-input-focus`,
                searchControl: `flex items-center gap-2 px-3 py-2 border-b border-cl-border-input-focus bg-cl-accent-surface`,
                item: `flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-accent-hover hover:bg-cl-accent/10`,
                icon: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent`,
                itemControl: `w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input-focus`,
                searchIcon: `w-4 h-4 shrink-0 text-cl-accent`,
                chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text`,
                chipRemoveTrigger: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent`,
                count: `inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-accent/10 text-cl-text`,
                label: `block text-sm font-medium mb-1 text-cl-accent`,
                message: `text-sm mt-1 text-cl-accent`,
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
              maxVisible={2}
              classes={{
                ...c.dropdown,
                itemControl: `w-4 h-4 shrink-0 border rounded-full flex items-center justify-center border-cl-border-input`,
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
              maxVisible={2}
              classes={{
                ...c.dropdown,
                itemControl:
                  "w-5 h-5 shrink-0 border-2 border-cl-warning rounded-cl-sm flex items-center justify-center",
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
              maxVisible={2}
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
                itemControl: `w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-warning`,
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
              onValueChange={(values, options) =>
                setUncontrolledChange(JSON.stringify({ values, options }))
              }
              placeholder="Select fruits..."
              maxVisible={3}
              classes={c.dropdown}
              aria-label="Uncontrolled fruits"
            />
            <div
              className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
              data-demo-action
            >
              onValueChange: {uncontrolledChange}
            </div>
          </div>
        </DemoWrapper>
        <div className={c.note}>
          The dropdown starts with Apple and Cherry pre-selected via
          defaultValue. No useState needed.
        </div>
      </Section>

      {/* ─── Focus and blur events ─────────────────────────────────────────── */}
      <Section
        title="Focus and blur events"
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
              maxVisible={2}
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
            <Button
              type="button"
              className={c.btn}
              onClick={() => setFormEvents([])}
            >
              Clear log
            </Button>
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
              maxVisible={2}
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
            <Button
              type="button"
              className={c.btn}
              onClick={() => setKeyDownLog([])}
            >
              Clear log
            </Button>
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
              maxVisible={2}
              className="my-custom-dropdown"
              style={{
                border: `2px dashed #818cf8`,
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
              maxVisible={2}
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
              maxVisible={2}
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
                maxVisible={2}
                classes={c.dropdown}
                aria-label="Portal container demo"
              />
            </div>
            <div
              ref={setPortalEl}
              className={`relative min-h-[60px] rounded-cl-md border-2 border-dashed p-3 border-cl-border-input bg-cl-bg-hover`}
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
        description="Adjust the spacing between the trigger and dropdown list using dropdownOffset."
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
                  maxVisible={1}
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
                  value={gapValue2}
                  onValueChange={(values) => setGapValue2(values)}
                  dropdownOffset={16}
                  placeholder="Gap: 16px..."
                  maxVisible={1}
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
              maxVisible={2}
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
              maxVisible={3}
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
                  emptyContent={
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
              maxVisible={2}
              fullWidth
              keepMounted
              dropdownOffset={8}
              dropdownZIndex={100}
              searchPlaceholder="Filter countries..."
              onFocus={() => setCombinedFocusCount((n) => n + 1)}
              onBlur={() => setCombinedBlurCount((n) => n + 1)}
              onKeyDown={(e) => setCombinedKey(JSON.stringify(e.key))}
              classes={{
                ...c.dropdown,
                trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors min-h-[42px] border-cl-border-input-focus bg-cl-accent/10 text-cl-text hover:border-cl-border-input-focus focus:outline-none focus:ring-2 focus:ring-cl-accent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success`,
                value:
                  "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                content: `rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-accent)_10%,var(--color-cl-bg-elevated))] border border-cl-border-input-focus`,
                chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text`,
              }}
            />
            <div
              className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
              data-demo-action
            >
              <div>onFocus: {combinedFocusCount ? `fired ${combinedFocusCount}×` : "not fired yet"}</div>
              <div>onBlur: {combinedBlurCount ? `fired ${combinedBlurCount}×` : "not fired yet"}</div>
              <div>onKeyDown: {combinedKey}</div>
            </div>
          </div>
          {combinedValue.length > 0 && (
            <p
              className={`w-full text-sm mt-2 text-cl-accent`}
            >
              Selected: {combinedValue.join(", ")}
            </p>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── In a form ───────────────────────────────────────────────────── */}
      <Section
        title="In a form"
        description="A real form: the field with name and required, Submit and Reset, and the FormData the browser built, read back."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <FormDemo onEmpty="Submit with nothing selected: a required field needs one value, so the submit is blocked and focus moves to the trigger. It submits one entry per selected value, as a native multiple select does.">
            <MultiSelectSearchableDropdown name="fruits" label="Fruits" required options={[{ value: "a", label: "Apple" }, { value: "b", label: "Banana" }, { value: "c", label: "Cherry" }]} />
          </FormDemo>
        </DemoWrapper>
      </Section>

      {/* ─── When loading fails ──────────────────────────────────────────── */}
      <Section
        title="When loading fails"
        description="A load that rejects reaches onLoadError, which sets error and errorMessage; the field announces the message. Typing again searches again. Make the next load fail, be slow (loadingContent shows) or return nothing (emptyContent shows); each applies to one load."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-full sm:max-w-sm space-y-4">
            <MultiSelectSearchableDropdown
              label="Skills"
              placeholder="Search skills"
              searchOptions={skills.load}
              onLoadError={skills.onLoadError}
              error={skills.error !== null}
              errorMessage={skills.error}
              loadingContent="Searching…"
              emptyContent="No skills match."
            />
            <NextLoadControl loader={skills} />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      {/* ─── At phone width ──────────────────────────────────────────────── */}
      <Section
        title="At phone width"
        codeless="the same component at a 360 px viewport, in a frame; its code is in the sections above"
      >
        <PhoneFrame
          route="/preview/MultiSelectSearchableDropdown/phone"
          lookFor="The chips and the search fit the field, and the open list fits the screen's width."
        />
      </Section>

      <ComponentDocs name="MultiSelectSearchableDropdown" />

      {/* ─── Accessibility ────────────────────────────────────────────────── */}

      <DocControlledPattern
        isDarkMode={dark}
        summary="Combine multi-value state with search or async `searchOptions`. Parent owns the array of selected ids; debounce network calls and keep `options` consistent with results."
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

      <CopyPasteBlock name="MultiSelectSearchableDropdown" />
    </div>
  );
};

export default MultiSelectSearchableDropdownDemo;
