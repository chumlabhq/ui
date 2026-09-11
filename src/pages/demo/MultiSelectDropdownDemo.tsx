import type { MultiSelectDropdownClasses } from "../../components/MultiSelectDropdown/index.js";
import {
  useState,
  useCallback } from "react";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown/index.js";
import type { MultiSelectOption } from "../../components/MultiSelectDropdown/index.js";
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
import { fetchCountries, type Country } from "./lib/countries.js";

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
  {
    value: "us",
    label: "United States",
    content: <span>🇺🇸 United States</span>,
  },
  {
    value: "gb",
    label: "United Kingdom",
    content: <span>🇬🇧 United Kingdom</span>,
  },
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
        <span className="w-2 h-2 rounded-full bg-cl-success" />
        <span>Active</span>
      </div>
    ),
    selectedContent: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-success" />
        <span>Active</span>
      </div>
    ),
  },
  {
    value: "pending",
    label: "Pending",
    content: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-warning" />
        <span>Pending</span>
      </div>
    ),
    selectedContent: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-warning" />
        <span>Pending</span>
      </div>
    ),
  },
  {
    value: "inactive",
    label: "Inactive",
    content: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-text/10" />
        <span>Inactive</span>
      </div>
    ),
    selectedContent: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-text/10" />
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
    trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
    content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
    label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
    description: `text-xs mb-1 text-cl-text-secondary`,
    chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10 dark:text-cl-text`,
    chipRemove: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary`,
  } satisfies MultiSelectDropdownClasses,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated cursor-pointer`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
});

const MultiSelectDropdownDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses();

  const [basicValue, setBasicValue] = useState<string[]>([]);
  const [countryValue, setCountryValue] = useState<string[]>([]);
  const [statusValue, setStatusValue] = useState<string[]>([]);
  const [disabledItemValue, setDisabledItemValue] = useState<string[]>([]);
  const [asyncValue, setAsyncValue] = useState<string[]>([]);
  const [labelValue, setLabelValue] = useState<string[]>([]);
  const [controlledOpen, setControlledOpen] = useState(false);
  const [controlledValue, setControlledValue] = useState<string[]>([]);
  // State Variations section — independent state per card so each card is
  // interactive on its own without bleeding into the dedicated state demos
  // further down the page.
  const [stateDefaultValue, setStateDefaultValue] = useState<string[]>([]);
  const [stateSelectedValue, setStateSelectedValue] = useState<string[]>([
    "apple",
    "banana",
  ]);
  const [stateErrorValue, setStateErrorValue] = useState<string[]>([]);
  const [stateNoChipsValue, setStateNoChipsValue] = useState<string[]>([
    "apple",
    "banana",
    "cherry",
  ]);
  const [noChipsValue, setNoChipsValue] = useState<string[]>([]);
  const [disabledValue, setDisabledValue] = useState<string[]>([
    "apple",
    "banana",
  ]);
  const [errorValue, setErrorValue] = useState<string[]>([]);
  const [descriptionValue, setDescriptionValue] = useState<string[]>([]);
  const [successValue, setSuccessValue] = useState<string[]>([]);
  const [formIntegrationValue, setFormIntegrationValue] = useState<string[]>(
    [],
  );
  const [noChevronValue, setNoChevronValue] = useState<string[]>([]);
  const [fullWidthValue, setFullWidthValue] = useState<string[]>([]);
  const [posTopValue, setPosTopValue] = useState<string[]>([]);
  const [posBotValue, setPosBotValue] = useState<string[]>([]);
  const [forceBotValue, setForceBotValue] = useState<string[]>([]);
  const [forceTopValue, setForceTopValue] = useState<string[]>([]);
  const [forceLockValue, setForceLockValue] = useState<string[]>([]);
  const [keepMountedValue, setKeepMountedValue] = useState<string[]>([]);
  const [customGapValue, setCustomGapValue] = useState<string[]>([]);
  const [zIndexValue, setZIndexValue] = useState<string[]>([]);
  const [focusMessage, setFocusMessage] = useState("");
  const [customKeyDownValue, setCustomKeyDownValue] = useState<string[]>([]);
  const [keyDownMessage, setKeyDownMessage] = useState("");
  const [classNameDemoValue, setClassNameDemoValue] = useState<string[]>([]);
  const [classNameStyleValue, setClassNameStyleValue] = useState<string[]>([]);
  const [ariaLabelDemoValue, setAriaLabelDemoValue] = useState<string[]>([]);
  const [darkThemeValue, setDarkThemeValue] = useState<string[]>([]);
  const [purpleThemeValue, setPurpleThemeValue] = useState<string[]>([]);
  const [greenCheckboxValue, setGreenCheckboxValue] = useState<string[]>([]);
  const [orangeCheckboxValue, setOrangeCheckboxValue] = useState<string[]>([]);
  const [customIconValue, setCustomIconValue] = useState<string[]>([]);
  const [keyboardDemoValue, setKeyboardDemoValue] = useState<string[]>([]);
  const [scrollLockValue, setScrollLockValue] = useState<string[]>([]);
  const [scrollUnlockedValue, setScrollUnlockedValue] = useState<string[]>([]);
  const [variantDefaultValue, setVariantDefaultValue] = useState<string[]>([]);
  const [variantBorderlessValue, setVariantBorderlessValue] = useState<
    string[]
  >([]);
  const [variantBottomValue, setVariantBottomValue] = useState<string[]>([]);
  const [variantGhostValue, setVariantGhostValue] = useState<string[]>([]);
  const [variantPillValue, setVariantPillValue] = useState<string[]>([]);

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
            <span
              className={`text-xs text-cl-text-secondary`}
            >
              {country.capital || country.region}
            </span>
          </div>
        </div>
      ),
      selectedContent: <span className="truncate">{country.name}</span>,
    }),
    [],
  );

  const handleLoadOptions = useCallback(async (): Promise<
    MultiSelectOption[]
  > => {
    const data = await fetchCountries();
    const codes = ["US", "GB", "DE", "FR", "JP", "CA", "AU", "IN", "BR", "IT"];
    return codes
      .map((code) => data.find((r) => r.code === code))
      .filter((r): r is Country => r !== undefined)
      .map(mapCountryToOption);
  }, [mapCountryToOption]);

  return (
    <div className="space-y-10">
      <DocsHero
        title="Multi Select Dropdown"
        description="A multi-select dropdown component without search. Supports keyboard navigation, async option loading, chips or count display, and full customization via the classes prop."
        code={`import { MultiSelectDropdown } from "@chumlab/ui/multi-select-dropdown";`}
      />

      <SetupNote />

      <CopyPasteBlock name="MultiSelectDropdown" />

      {/* ─── Basic Usage ─────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Standard multi-select with chips."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            {/* Basic usage — works out-of-the-box with built-in styles */}
            <MultiSelectDropdown
              options={staticOptions}
              value={basicValue}
              onValueChange={(values) => setBasicValue(values)}
              placeholder="Select fruits..."
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── State Variations ────────────────────────────────────────────── */}
      <Section
        title="State Variations"
        description="Overview of different states: default, selected, disabled, error, and loading."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <DemoLabel isDarkMode={dark}>Default (empty)</DemoLabel>
              <MultiSelectDropdown
                options={staticOptions}
                value={stateDefaultValue}
                onValueChange={setStateDefaultValue}
                placeholder="Select fruits..."
                maxDisplayedChips={2}
                classes={c.dropdown}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Selected (with chips)</DemoLabel>
              <MultiSelectDropdown
                options={staticOptions}
                value={stateSelectedValue}
                onValueChange={setStateSelectedValue}
                placeholder="Select fruits..."
                maxDisplayedChips={2}
                classes={c.dropdown}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Disabled</DemoLabel>
              <MultiSelectDropdown
                options={staticOptions}
                value={["apple", "banana"]}
                onValueChange={() => {}}
                disabled
                placeholder="Select fruits..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `${c.dropdown.trigger} opacity-50 cursor-not-allowed`,
                }}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Error state</DemoLabel>
              <MultiSelectDropdown
                options={staticOptions}
                value={stateErrorValue}
                onValueChange={setStateErrorValue}
                error={stateErrorValue.length === 0}
                errorMessage="Please select at least one"
                placeholder="Select fruits..."
                classes={{
                  ...c.dropdown,
                  trigger: `${c.dropdown.trigger} border border-cl-error focus:ring-cl-error`,
                }}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Loading state</DemoLabel>
              <MultiSelectDropdown
                options={[]}
                value={[]}
                onValueChange={() => {}}
                placeholder="Loading..."
                loading
                shimmerCount={4}
                classes={c.dropdown}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Count only (no chips)</DemoLabel>
              <MultiSelectDropdown
                options={staticOptions}
                value={stateNoChipsValue}
                onValueChange={setStateNoChipsValue}
                placeholder="Select fruits..."
                showSelectedChips={false}
                classes={c.dropdown}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Custom Content ─────────────────────────────────────────── */}
      <Section
        title="With Custom Content"
        description="Use the content prop on options for rich rendering."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={countryOptions}
              value={countryValue}
              onValueChange={(values) => setCountryValue(values)}
              placeholder="Select countries..."
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Status Indicators ──────────────────────────────────────── */}
      <Section
        title="With Status Indicators"
        description="Options with color-coded status indicators."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={statusOptions}
              value={statusValue}
              onValueChange={(values) => setStatusValue(values)}
              placeholder="Select statuses..."
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Async Data Fetching ─────────────────────────────────────────── */}
      <Section
        title="Async Data Fetching with Shimmer"
        description="Options loaded when dropdown opens."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
            <MultiSelectDropdown
              value={asyncValue}
              onValueChange={(values) => setAsyncValue(values)}
              placeholder="Select countries..."
              onLoadOptions={handleLoadOptions}
              loadOnOpen
              shimmerCount={5}
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Options are fetched from the REST Countries API when the dropdown
          opens.
        </div>
      </Section>

      {/* ─── With Disabled Options ───────────────────────────────────────── */}
      <Section
        title="With Disabled Options"
        description="Individual options can be disabled."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={disabledItemOptions}
              value={disabledItemValue}
              onValueChange={(values) => setDisabledItemValue(values)}
              placeholder="Select options..."
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Label ──────────────────────────────────────────────────── */}
      <Section
        title="With Label"
        description="Use the label and required props."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
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

      {/* ─── Controlled Open State ───────────────────────────────────────── */}
      <Section
        title="Controlled Open State"
        description="Use open and onOpenChange to control the dropdown programmatically."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-end gap-4">
            <div className="w-full sm:max-w-72">
              <MultiSelectDropdown
                options={staticOptions}
                value={controlledValue}
                onValueChange={setControlledValue}
                open={controlledOpen}
                onOpenChange={setControlledOpen}
                placeholder="Controlled dropdown..."
                maxDisplayedChips={2}
                classes={c.dropdown}
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

      {/* ─── Without Chips (Count Only) ──────────────────────────────────── */}
      <Section
        title="Without Chips (Count Only)"
        description='Shows "X selected" instead of chips.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={noChipsValue}
              onValueChange={(values) => setNoChipsValue(values)}
              placeholder="Select fruits..."
              showSelectedChips={false}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Disabled State ──────────────────────────────────────────────── */}
      <Section
        title="Disabled State"
        description="Use disabled to prevent interaction."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
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
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Error State ─────────────────────────────────────────────────── */}
      <Section
        title="Error State"
        description="Show validation errors with error and errorMessage props."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
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
            <MultiSelectDropdown
              label="Favorite Fruits"
              description="Pick one or more fruits you enjoy."
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
        description="Use success and successMessage props to indicate valid selections."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              label="Favorite Fruits"
              options={staticOptions}
              value={successValue}
              onValueChange={(values) => setSuccessValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              success={successValue.length > 0}
              successMessage={`${successValue.length} fruit${successValue.length === 1 ? "" : "s"} selected`}
              classes={{
                ...c.dropdown,
                trigger:
                  successValue.length > 0
                    ? `${c.dropdown.trigger} border border-cl-success focus:ring-cl-success`
                    : c.dropdown.trigger,
              }}
            />
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
              const fd = new FormData(e.currentTarget);
              alert(`FormData: fruits = ${fd.get("fruits")}`);
            }}
            className="flex items-end gap-4"
          >
            <div className="w-full sm:max-w-72">
              <MultiSelectDropdown
                name="fruits"
                label="Fruits (in form)"
                options={staticOptions}
                value={formIntegrationValue}
                onValueChange={setFormIntegrationValue}
                placeholder="Select fruits..."
                maxDisplayedChips={2}
                classes={c.dropdown}
              />
            </div>
            <button type="submit" className={c.btn}>
              Submit
            </button>
          </form>
        </DemoWrapper>
      </Section>

      {/* ─── Without Chevron ─────────────────────────────────────────────── */}
      <Section
        title="Without Chevron"
        description="Hide the dropdown chevron icon."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={noChevronValue}
              onValueChange={(values) => setNoChevronValue(values)}
              showChevron={false}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Full Width ──────────────────────────────────────────────────── */}
      <Section
        title="Full Width"
        description="Use fullWidth to stretch to the container."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full">
            <MultiSelectDropdown
              options={staticOptions}
              value={fullWidthValue}
              onValueChange={(values) => setFullWidthValue(values)}
              fullWidth
              placeholder="Select fruits..."
              maxDisplayedChips={3}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Scroll Lock ─────────────────────────────────────────────────── */}
      <Section
        title="Scroll Lock"
        description="By default, the page remains scrollable when the dropdown is open. Set lockScroll to lock body scroll while open."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={scrollUnlockedValue}
              onValueChange={setScrollUnlockedValue}
              placeholder="Default (scrollable)"
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={scrollLockValue}
              onValueChange={setScrollLockValue}
              placeholder="lockScroll enabled"
              lockScroll
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Style Variants ──────────────────────────────────────────────── */}
      <Section
        title="Style Variants"
        description="Different visual treatments using the classes prop — borderless, bottom-border-only, ghost, and pill styles."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div>
            <p className={`mb-2 ${c.label}`}>Default (bordered)</p>
            <div className="w-full sm:max-w-72">
              <MultiSelectDropdown
                options={staticOptions}
                value={variantDefaultValue}
                onValueChange={setVariantDefaultValue}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={c.dropdown}
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Borderless</p>
            <div className="w-full sm:max-w-72">
              <MultiSelectDropdown
                options={staticOptions}
                value={variantBorderlessValue}
                onValueChange={setVariantBorderlessValue}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer min-h-[42px] bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover dark:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-bg-hover`,
                  value:
                    "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
                }}
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Bottom border only</p>
            <div className="w-full sm:max-w-72">
              <MultiSelectDropdown
                options={staticOptions}
                value={variantBottomValue}
                onValueChange={setVariantBottomValue}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-1 py-2 text-sm border-b-2 rounded-none transition-colors cursor-pointer min-h-[42px] border border-cl-border text-cl-text hover:border-cl-border-input-focus focus-within:border-cl-border-input-focus dark:border dark:border-cl-border dark:text-cl-text dark:hover:border-cl-border-input-focus dark:focus-within:border-cl-border-input-focus`,
                  value:
                    "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
                }}
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Ghost</p>
            <div className="w-full sm:max-w-72">
              <MultiSelectDropdown
                options={staticOptions}
                value={variantGhostValue}
                onValueChange={setVariantGhostValue}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer min-h-[42px] text-cl-text-secondary hover:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-text/60`,
                  value:
                    "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
                }}
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Pill</p>
            <div className="w-full sm:max-w-72">
              <MultiSelectDropdown
                options={staticOptions}
                value={variantPillValue}
                onValueChange={setVariantPillValue}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
 trigger: `flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-colors cursor-pointer min-h-[42px] border border-cl-border bg-white text-cl-text hover:border-cl-border-input shadow-sm dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:border-cl-border`,
                  value:
                    "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
                }}
              />
            </div>
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
              <div className="w-full sm:max-w-72">
                <MultiSelectDropdown
                  options={staticOptions}
                  value={posBotValue}
                  onValueChange={setPosBotValue}
                  dropdownPosition="bottom"
                  placeholder="Opens below..."
                  maxDisplayedChips={2}
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>
                dropdownPosition=&quot;top&quot;
              </DemoLabel>
              <div className="w-full sm:max-w-72">
                <MultiSelectDropdown
                  options={staticOptions}
                  value={posTopValue}
                  onValueChange={setPosTopValue}
                  dropdownPosition="top"
                  placeholder="Opens above..."
                  maxDisplayedChips={2}
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
                <MultiSelectDropdown
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
                <MultiSelectDropdown
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
                <MultiSelectDropdown
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

      {/* ─── Custom Portal Container ─────────────────────────────────────── */}
      <Section
        title="Custom Portal Container"
        description="Use portalContainer to render the dropdown into a specific DOM element instead of document.body."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={[]}
              onValueChange={() => {}}
              placeholder="Renders to document.body..."
              portalContainer={null}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Keep Mounted ────────────────────────────────────────────────── */}
      <Section
        title="Keep Mounted"
        description="Use keepMounted to keep the dropdown portal in the DOM when closed (hidden with display: none)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={keepMountedValue}
              onValueChange={setKeepMountedValue}
              keepMounted
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Dropdown Gap ─────────────────────────────────────────── */}
      <Section
        title="Custom Dropdown Gap"
        description="Control the gap between the trigger and dropdown with dropdownGap (pixels). Default is 4."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-8">
            <div>
              <DemoLabel isDarkMode={dark}>No gap (0px)</DemoLabel>
              <div className="w-full sm:max-w-72">
                <MultiSelectDropdown
                  options={staticOptions}
                  value={[]}
                  onValueChange={() => {}}
                  dropdownGap={0}
                  placeholder="No gap..."
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Large gap (16px)</DemoLabel>
              <div className="w-full sm:max-w-72">
                <MultiSelectDropdown
                  options={staticOptions}
                  value={customGapValue}
                  onValueChange={setCustomGapValue}
                  dropdownGap={16}
                  placeholder="Large gap..."
                  maxDisplayedChips={2}
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
        description="Control the z-index of the dropdown portal with dropdownZIndex. Default is 50."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={zIndexValue}
              onValueChange={setZIndexValue}
              dropdownZIndex={9999}
              placeholder="Select (z-index: 9999)..."
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Form Integration (onBlur / onFocus) ─────────────────────────── */}
      <Section
        title="Form Integration (onBlur / onFocus)"
        description="Use onBlur and onFocus for integration with form libraries like React Hook Form or Formik."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={[]}
              onValueChange={() => {}}
              placeholder="Focus or blur me..."
              onFocus={() => setFocusMessage("Dropdown focused")}
              onBlur={() => setFocusMessage("Dropdown blurred")}
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        {focusMessage && (
          <p
            className={`text-sm mt-2 text-cl-accent`}
          >
            {focusMessage}
          </p>
        )}
      </Section>

      {/* ─── Custom KeyDown Handler ──────────────────────────────────────── */}
      <Section
        title="Custom KeyDown Handler"
        description="Provide onKeyDown to intercept or extend keyboard behavior. Call preventDefault() to override internal behavior."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={customKeyDownValue}
              onValueChange={setCustomKeyDownValue}
              placeholder="Try pressing 'x'..."
              maxDisplayedChips={2}
              onKeyDown={(e) => {
                if (e.key === "x" || e.key === "X") {
                  e.preventDefault();
                  setKeyDownMessage("You pressed 'x' - custom handler!");
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
        description="Use className for root, style for inline styles, and aria-label to customize the listbox accessible label."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-6">
            <div>
              <DemoLabel isDarkMode={dark}>className (root)</DemoLabel>
              <div className="w-full sm:max-w-72">
                <MultiSelectDropdown
                  options={staticOptions}
                  value={classNameDemoValue}
                  onValueChange={setClassNameDemoValue}
                  placeholder="Select fruits..."
                  className={dark ? "opacity-90" : "opacity-95"}
                  maxDisplayedChips={2}
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>style (inline on root)</DemoLabel>
              <div className="w-full sm:max-w-72">
                <MultiSelectDropdown
                  options={staticOptions}
                  value={classNameStyleValue}
                  onValueChange={setClassNameStyleValue}
                  placeholder="Select fruits..."
                  style={{ maxWidth: "320px", margin: "0 auto" }}
                  maxDisplayedChips={2}
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>
                aria-label=&quot;Fruit options&quot;
              </DemoLabel>
              <div className="w-full sm:max-w-72">
                <MultiSelectDropdown
                  options={staticOptions}
                  value={ariaLabelDemoValue}
                  onValueChange={setAriaLabelDemoValue}
                  placeholder="Select fruits..."
                  aria-label="Fruit options"
                  maxDisplayedChips={2}
                  classes={c.dropdown}
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Dark Theme ──────────────────────────────────────────────────── */}
      <Section
        title="Dark Theme"
        description="A dedicated dark color scheme using classes override."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
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
                item:
                  "flex items-center gap-2 px-3 py-2 cursor-pointer text-white hover:bg-white/[0.08] transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
                icon:
                  "w-4 h-4 shrink-0 transition-transform duration-200 text-white/60",
                itemControl:
                  "w-4 h-4 shrink-0 border border-white/30 rounded flex items-center justify-center",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white/[0.10] text-white rounded-cl-md shrink-0 max-w-[100px]",
                chipRemove:
                  "w-3 h-3 shrink-0 cursor-pointer text-white/70 hover:text-white",
                count:
                  "inline-flex items-center px-2 py-0.5 text-xs bg-white/[0.10] text-white/80 rounded-cl-md shrink-0",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Blue Theme ──────────────────────────────────────────────────── */}
      <Section
        title="Blue Theme"
        description="Custom color scheme example using the brand accent."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={purpleThemeValue}
              onValueChange={(values) => setPurpleThemeValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-cl-accent min-h-[42px] border-cl-border-input-focus bg-cl-accent/10 text-cl-text hover:border-cl-border-input-focus dark:border dark:border-cl-border-input-focus dark:bg-cl-accent/60 dark:text-cl-accent dark:hover:border-cl-border-input-focus`,
                value:
                  "flex-1 flex items-center gap-1.5 flex-wrap min-w-0",
                content: `rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-accent)_10%,var(--color-cl-bg-elevated))] border border-cl-border-input-focus dark:bg-[color-mix(in_oklab,var(--color-cl-accent)_20%,var(--color-cl-bg-elevated))] dark:border dark:border-cl-border-input-focus`,
                item: `flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-accent hover:bg-cl-accent/10 dark:text-cl-accent dark:hover:bg-cl-accent/60`,
                icon: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent`,
                itemControl: `w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input-focus dark:border dark:border-cl-border-input-focus`,
                chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-accent/60 dark:text-cl-accent`,
                chipRemove: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-accent`,
                count: `inline-flex items-center px-2 py-0.5 text-xs rounded-cl-md shrink-0 bg-cl-accent/10 text-cl-text dark:bg-cl-accent/40 dark:text-cl-accent`,
                label: `block text-sm font-medium mb-1 text-cl-accent`,
                message: `text-sm mt-1 text-cl-accent`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Checkbox - Green Rounded ─────────────────────────────── */}
      <Section
        title="Custom Checkbox - Green Rounded"
        description="Override checkbox classes for custom styling."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={greenCheckboxValue}
              onValueChange={(values) => setGreenCheckboxValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                itemControl: `w-4 h-4 shrink-0 border rounded-full flex items-center justify-center border-cl-border-input`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Checkbox - Orange Square ─────────────────────────────── */}
      <Section
        title="Custom Checkbox - Orange Square"
        description="Another checkbox style variant."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={orangeCheckboxValue}
              onValueChange={(values) => setOrangeCheckboxValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                itemControl:
                  "w-5 h-5 shrink-0 border-2 border-cl-warning rounded-cl-sm flex items-center justify-center",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Checkbox Icon ────────────────────────────────────────── */}
      <Section
        title="Custom Checkbox Icon"
        description="Replace the default check icon with a star."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <MultiSelectDropdown
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
                itemControl:
                  "w-4 h-4 shrink-0 border border-cl-warning rounded flex items-center justify-center",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Shimmer Count Variations ────────────────────────────────────── */}
      <Section
        title="Shimmer Count Variations"
        description="Control the number of shimmer items during loading with shimmerCount."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-wrap gap-8">
            <div className="w-full sm:max-w-72">
              <DemoLabel isDarkMode={dark}>3 shimmer items</DemoLabel>
              <MultiSelectDropdown
                options={[]}
                value={[]}
                onValueChange={() => {}}
                placeholder="Loading..."
                loading
                shimmerCount={3}
                classes={c.dropdown}
              />
            </div>
            <div className="w-full sm:max-w-72">
              <DemoLabel isDarkMode={dark}>8 shimmer items</DemoLabel>
              <MultiSelectDropdown
                options={[]}
                value={[]}
                onValueChange={() => {}}
                placeholder="Loading..."
                loading
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
        description="When no options are available, noResultsContent is shown."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-wrap gap-8">
            <div className="w-full sm:max-w-72">
              <DemoLabel isDarkMode={dark}>Default noResultsContent</DemoLabel>
              <MultiSelectDropdown
                options={[]}
                value={[]}
                onValueChange={() => {}}
                placeholder="No options..."
                classes={c.dropdown}
              />
            </div>
            <div className="w-full sm:max-w-72">
              <DemoLabel isDarkMode={dark}>Custom noResultsContent</DemoLabel>
              <MultiSelectDropdown
                options={[]}
                value={[]}
                onValueChange={() => {}}
                placeholder="Custom empty..."
                noResultsContent={
                  <span className="flex flex-col items-center gap-1 py-2">
                    <span
                      className={`text-lg text-cl-text-tertiary`}
                    >
                      📭
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
        description="Label, required, custom chevron, chips, and classes together."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
            <MultiSelectDropdown
              label="Favorite Fruits"
              required
              options={staticOptions}
              value={[]}
              onValueChange={() => {}}
              placeholder="Select fruits..."
              maxDisplayedChips={3}
              ChevronIcon={CustomChevronIcon}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          This dropdown combines label, required indicator, custom chevron icon,
          all working together seamlessly.
        </div>
      </Section>

      {/* ─── Keyboard Navigation ─────────────────────────────────────────── */}
      <Section
        title="Try it: Keyboard Navigation"
        description="Full keyboard support for accessible interaction."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <MultiSelectDropdown
              options={staticOptions}
              value={keyboardDemoValue}
              onValueChange={setKeyboardDemoValue}
              placeholder="Try keyboard navigation..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="MultiSelectDropdown" />

      {/* ─── Accessibility ───────────────────────────────────────────────── */}

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `value` (array) with `onValueChange` for controlled multi-select. Chips and overflow are presentation—keep canonical values in parent state."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Select-all vs partial selection—align with your data model and SR semantics.",
          "Large lists may require virtualization or search (see Searchable variant).",
          "Form posts may need hidden inputs or JSON—document the contract.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `label` or `aria-label` on the trigger.",
          "Announce selection counts where helpful for screen readers.",
          "Limit max selections in product logic when required.",
        ]}
        donts={[
          "Do not allow duplicate selections in the value array.",
          "Do not omit keyboard access to chip removal.",
          "Do not overload chips with primary navigation actions.",
        ]}
      />
    </div>
  );
};

export default MultiSelectDropdownDemo;
