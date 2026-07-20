import { useState, useCallback } from "react";
import { Dropdown } from "../../components/Dropdown";
import type { DropdownOption } from "../../components/Dropdown";
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
import { fetchCountries, type Country } from "./lib/countries";

// ─── Static Data ────────────────────────────────────────────────────────────

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
];

const statusOptions: DropdownOption[] = [
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

const disabledItemOptions: DropdownOption[] = [
  { value: "option1", label: "Available Option 1" },
  { value: "option2", label: "Disabled Option", disabled: true },
  { value: "option3", label: "Available Option 2" },
  { value: "option4", label: "Disabled Option 2", disabled: true },
  { value: "option5", label: "Available Option 3" },
];

// ─── Icons ──────────────────────────────────────────────────────────────────

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

// ─── Themed Classes ─────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  dropdown: {
    root: "w-full",
    wrapper: "relative w-full",
 trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
    triggerText: "flex-1 text-left truncate",
 content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
    optionList: "max-h-60 overflow-y-auto",
    option: `flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-cl-text hover:bg-black/5 dark:text-cl-text dark:hover:bg-white/10`,
    optionSelected: dark
      ? "bg-cl-accent/50 font-medium"
      : "bg-cl-accent/10 font-medium",
    optionFocused: dark ? "bg-white/10" : "bg-black/5",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-secondary`,
    checkIcon: `w-4 h-4 shrink-0 text-cl-accent`,
    clearIcon: `absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated cursor-pointer text-cl-text-secondary`,
    noResults: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
    label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
    error: `text-sm mt-1 text-cl-error`,
    shimmerItem: `mx-2 my-1.5 h-4 rounded bg-cl-text/10 animate-pulse`,
  },
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
});

// ─── Extra theme variants for the theme demos ───────────────────────────────

const darkTheme = {
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-[#2a2f3a] bg-[#0a0d12] text-white hover:bg-[#11151c] focus:outline-none focus:ring-2 focus:ring-cl-accent",
  triggerText: "flex-1 truncate",
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-[#0a0d12] border border-[#2a2f3a]",
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
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-cl-warning rounded-cl-md bg-cl-warning/15 text-cl-warning hover:bg-cl-warning/15 focus:outline-none focus:ring-2 focus:ring-cl-warning",
  triggerText: "flex-1 truncate",
  // The menu floats over page content, so its background has to be opaque -
  // a translucent tint lets the text underneath bleed through. color-mix keeps
  // the warm wash while compositing it onto the elevated surface.
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-warning)_15%,var(--color-cl-bg-elevated))] border border-cl-warning",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-cl-warning hover:bg-cl-warning/25 transition-colors",
  optionSelected: "bg-cl-warning/30",
  optionFocused: "bg-cl-warning/25",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-warning",
  checkIcon: "w-4 h-4 shrink-0 text-cl-warning",
  noResults: "px-3 py-4 text-sm text-cl-warning text-center",
};

const coolTheme = {
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-cl-border-input-focus rounded-cl-md bg-cl-accent/10 text-cl-accent hover:bg-cl-accent/10 focus:outline-none focus:ring-2 focus:ring-cl-accent",
  triggerText: "flex-1 truncate",
  content:
    "rounded-cl-md shadow-lg overflow-hidden bg-[color-mix(in_oklab,var(--color-cl-accent)_10%,var(--color-cl-bg-elevated))] border border-cl-border-input-focus",
  optionList: "max-h-60 overflow-y-auto",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer text-cl-accent hover:bg-cl-accent/20 transition-colors",
  optionSelected: "bg-cl-accent/25",
  optionFocused: "bg-cl-accent/20",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent",
  checkIcon: "w-4 h-4 shrink-0 text-cl-accent",
  noResults: "px-3 py-4 text-sm text-cl-accent text-center",
};

const getMinimalTheme = (dark: boolean) => ({
  wrapper: "relative",
  trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border-b bg-transparent focus:outline-none border border-cl-border-input text-cl-text hover:border-cl-border focus:border-cl-border dark:border dark:border-cl-border dark:text-white dark:hover:border-cl-border-input dark:focus:border-cl-text`,
  triggerText: "flex-1 truncate",
  content: `rounded shadow-sm overflow-hidden border bg-white border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
  optionList: "max-h-60 overflow-y-auto",
  option: `flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-cl-text hover:bg-black/5 dark:text-cl-text dark:hover:bg-white/10`,
  optionSelected: "font-medium",
  optionFocused: dark ? "bg-white/10" : "bg-black/5",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary`,
  checkIcon: `w-4 h-4 shrink-0 text-cl-text-secondary`,
  noResults: `px-3 py-4 text-sm text-center text-cl-text-tertiary`,
});

// ─── Demo ───────────────────────────────────────────────────────────────────

const DropdownDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const minimalTheme = getMinimalTheme(dark);

  // Basic
  const [basicValue, setBasicValue] = useState<string | null>(null);
  // State variations (uncontrolled, no state needed)
  // Uncontrolled (no state needed)
  // Controlled open
  const [controlledOpen, setControlledOpen] = useState(false);
  const [controlledValue, setControlledValue] = useState<string | null>(null);
  // Clearable
  const [clearableValue, setClearableValue] = useState<string | null>(null);
  // Render trigger
  const [renderTriggerValue, setRenderTriggerValue] = useState<string | null>(
    null,
  );
  // Custom content
  const [countryValue, setCountryValue] = useState<string | null>(null);
  // Async
  const [asyncCountryValue, setAsyncCountryValue] = useState<string | null>(
    null,
  );
  // Status
  const [statusValue, setStatusValue] = useState<string | null>(null);
  // Custom selected & icons
  const [customSelectedValue, setCustomSelectedValue] = useState<string | null>(
    null,
  );
  const [customIconValue, setCustomIconValue] = useState<string | null>(null);
  const [noIconValue, setNoIconValue] = useState<string | null>(null);
  // Focus styling
  const [purpleFocusValue, setPurpleFocusValue] = useState<string | null>(null);
  const [greenFocusValue, setGreenFocusValue] = useState<string | null>(null);
  // Theme demos
  const [darkThemeValue, setDarkThemeValue] = useState<string | null>(null);
  const [warmThemeValue, setWarmThemeValue] = useState<string | null>(null);
  const [coolThemeValue, setCoolThemeValue] = useState<string | null>(null);
  const [minimalThemeValue, setMinimalThemeValue] = useState<string | null>(
    null,
  );
  // Disabled items
  const [disabledItemValue, setDisabledItemValue] = useState<string | null>(
    null,
  );
  // Label & required
  const [labeledValue, setLabeledValue] = useState<string | null>(null);
  const [requiredValue, setRequiredValue] = useState<string | null>(null);
  // Disabled state
  const [disabledValue] = useState<string | null>("apple");
  // Error
  const [errorValue, setErrorValue] = useState<string | null>(null);

  const [successValue, setSuccessValue] = useState<string | null>(null);
  // Chevron
  const [customChevronValue, setCustomChevronValue] = useState<string | null>(
    null,
  );
  const [noChevronValue, setNoChevronValue] = useState<string | null>(null);
  // Full width
  const [fullWidthValue, setFullWidthValue] = useState<string | null>(null);
  // Position
  const [posTopValue, setPosTopValue] = useState<string | null>(null);
  const [posBotValue, setPosBotValue] = useState<string | null>(null);
  const [forceBotValue, setForceBotValue] = useState<string | null>(null);
  const [forceTopValue, setForceTopValue] = useState<string | null>(null);
  const [forceLockValue, setForceLockValue] = useState<string | null>(null);
  // Keep mounted
  const [keepMountedValue, setKeepMountedValue] = useState<string | null>(null);
  // Gap
  const [customGapValue, setCustomGapValue] = useState<string | null>(null);
  // Typeahead timeout
  const [customTimeoutValue, setCustomTimeoutValue] = useState<string | null>(
    null,
  );
  // Z-index
  const [zIndexValue, setZIndexValue] = useState<string | null>(null);
  // Custom clear icon
  const [customClearIconValue, setCustomClearIconValue] = useState<
    string | null
  >("apple");
  // Custom check icon
  const [customCheckIconValue, setCustomCheckIconValue] = useState<
    string | null
  >(null);
  // Form integration
  const [formIntegrationValue, setFormIntegrationValue] = useState<
    string | null
  >(null);
  const [focusMessage, setFocusMessage] = useState<string>("");
  // Custom key down
  const [customKeyDownValue, setCustomKeyDownValue] = useState<string | null>(
    null,
  );
  const [keyDownMessage, setKeyDownMessage] = useState<string>("");
  // className / style
  const [classNameStyleValue, setClassNameStyleValue] = useState<string | null>(
    null,
  );

  const mapCountryToOption = useCallback(
    (country: Country): DropdownOption => ({
      value: country.code,
      label: country.name,
      content: (
        <span className="flex items-center gap-2">
          <img
            src={`https://chumflagscdn.s3.ap-south-1.amazonaws.com/flags/${country.code.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="w-5 h-4 object-cover rounded-cl-sm border border-cl-border"
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
          <img
            src={`https://chumflagscdn.s3.ap-south-1.amazonaws.com/flags/${country.code.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="w-5 h-4 object-cover rounded-cl-sm border border-cl-border"
          />
          <span>{country.name}</span>
        </span>
      ),
    }),
    [],
  );

  const handleLoadCountries = useCallback(async (): Promise<
    DropdownOption[]
  > => {
    const data = await fetchCountries();
    const codes = ["US", "GB", "DE", "FR", "JP", "CA", "AU", "IN", "BR", "IT"];
    return codes
      .map((code) => data.find((ct) => ct.code === code))
      .filter((ct): ct is Country => ct !== undefined)
      .map(mapCountryToOption);
  }, [mapCountryToOption]);

  return (
    <div className="space-y-10">
      <DocsHero
        title="Dropdown"
        description="A fully accessible select dropdown component for choosing from a list of options. Supports controlled and uncontrolled modes, portal rendering, keyboard navigation with type-ahead search, async option loading, clearable selection, custom trigger rendering, and complete style customization via a classes object."
        code={`import { Dropdown } from "@chumlab/ui/dropdown";`}
      />

      {/* ─── Basic Usage ─────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Standard dropdown with string options."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            {/* Basic usage — works out-of-the-box with built-in styles */}
            <Dropdown
              options={fruitOptions}
              value={basicValue}
              onValueChange={(v) => setBasicValue(v)}
              placeholder="Select a fruit..."
              classes={c.dropdown}
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
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <DemoLabel isDarkMode={dark}>Default (empty)</DemoLabel>
              <Dropdown
                options={fruitOptions}
                placeholder="Select a fruit..."
                classes={c.dropdown}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Selected</DemoLabel>
              <Dropdown
                options={fruitOptions}
                defaultValue="banana"
                placeholder="Select a fruit..."
                classes={c.dropdown}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Disabled</DemoLabel>
              <Dropdown
                options={fruitOptions}
                defaultValue="cherry"
                disabled
                placeholder="Select a fruit..."
                classes={{
                  ...c.dropdown,
                  trigger: `${c.dropdown.trigger} opacity-50 cursor-not-allowed`,
                }}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Error state</DemoLabel>
              <Dropdown
                options={fruitOptions}
                placeholder="Select a fruit..."
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
              <Dropdown
                options={[]}
                placeholder="Loading..."
                loading={true}
                shimmerCount={4}
                classes={c.dropdown}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Clearable (selected)</DemoLabel>
              <Dropdown
                options={fruitOptions}
                defaultValue="grape"
                clearable
                placeholder="Select a fruit..."
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
            <Dropdown
              options={fruitOptions}
              defaultValue="cherry"
              placeholder="Select a fruit..."
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
          <div className="w-full flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-full sm:max-w-64">
              <Dropdown
                options={fruitOptions}
                value={controlledValue}
                onValueChange={(v) => setControlledValue(v)}
                open={controlledOpen}
                onOpenChange={setControlledOpen}
                placeholder="Controlled dropdown..."
                classes={c.dropdown}
              />
            </div>
            <div className="flex items-center gap-2">
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
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Clearable ───────────────────────────────────────────────────── */}
      <Section
        title="Clearable"
        description="When clearable is true, a clear button appears after selection. Clicking the already-selected option also deselects it."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <Dropdown
              options={fruitOptions}
              value={clearableValue}
              onValueChange={(v) => setClearableValue(v)}
              clearable
              placeholder="Select (clearable)..."
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

      {/* ─── Custom Trigger (renderTrigger) ──────────────────────────────── */}
      <Section
        title="Custom Trigger (renderTrigger)"
        description="Use renderTrigger to fully customize the trigger element while retaining all keyboard and ARIA behavior."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
            <Dropdown
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
                  type="button"
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-cl-lg border-2 transition-all ${
                    isOpen
                      ? dark
                        ? "border-cl-border-input-focus bg-cl-bg-elevated text-white shadow-lg shadow-accent/20"
                        : "border-cl-border-input-focus bg-white text-cl-text shadow-lg shadow-accent/20"
                      : dark
                        ? "border-cl-border bg-cl-bg-elevated text-white hover:border-cl-border"
                        : "border-cl-border-input bg-white text-cl-text hover:border-cl-border-input"
                  }`}
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
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isOpen
                        ? dark
                          ? "bg-cl-accent/20 text-cl-accent"
                          : "bg-cl-accent/10 text-cl-accent"
                        : dark
                          ? "bg-cl-bg-elevated text-cl-text-tertiary"
                          : "bg-cl-bg-hover text-cl-text-tertiary"
                    }`}
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
            For proper accessibility, the custom trigger MUST be a native button
            element with type=&quot;button&quot;. Using div or span elements
            will break keyboard navigation and screen reader support.
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
            <Dropdown
              options={countryOptions}
              value={countryValue}
              onValueChange={(v) => setCountryValue(v)}
              placeholder="Select a country..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Async Data Fetching with Shimmer ────────────────────────────── */}
      <Section
        title="Async Data Fetching with Shimmer"
        description="Use onLoadOptions and loadOnOpen to fetch options asynchronously. A shimmer skeleton displays while loading."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
            <Dropdown
              value={asyncCountryValue}
              onValueChange={(v) => setAsyncCountryValue(v)}
              placeholder="Select a country..."
              onLoadOptions={handleLoadCountries}
              loadOnOpen
              shimmerCount={5}
              onLoadError={(err) => console.error("Load failed:", err)}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <p
          className={`text-sm mt-2 text-cl-text-secondary`}
        >
          Options are fetched from the REST Countries API when the dropdown
          opens.
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
            <Dropdown
              options={statusOptions}
              value={statusValue}
              onValueChange={(v) => setStatusValue(v)}
              placeholder="Select status..."
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
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div>
            <DemoLabel isDarkMode={dark}>
              Green accent + left border on selected
            </DemoLabel>
            <div className="w-full sm:max-w-64">
              <Dropdown
                options={fruitOptions}
                value={customSelectedValue}
                onValueChange={(v) => setCustomSelectedValue(v)}
                placeholder="Select a fruit..."
                classes={{
                  ...c.dropdown,
                  optionSelected: dark
                    ? "bg-cl-success/40 border-l-[3px] border-cl-success pl-3"
                    : "bg-cl-success/15 border-l-[3px] border-cl-success pl-3",
                  checkIcon: dark ? "text-cl-success" : "text-cl-success",
                }}
              />
            </div>
          </div>
          <div>
            <DemoLabel isDarkMode={dark}>
              Star icon instead of checkmark
            </DemoLabel>
            <div className="w-full sm:max-w-64">
              <Dropdown
                options={fruitOptions}
                value={customIconValue}
                onValueChange={(v) => setCustomIconValue(v)}
                placeholder="Select a fruit..."
                selectedIcon={
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 shrink-0 text-cl-warning`}
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                }
                classes={c.dropdown}
              />
            </div>
          </div>
          <div>
            <DemoLabel isDarkMode={dark}>Circle dot icon</DemoLabel>
            <div className="w-full sm:max-w-64">
              <Dropdown
                options={fruitOptions}
                placeholder="Select a fruit..."
                selectedIcon={
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 bg-cl-accent dark:bg-cl-accent/90`}
                  />
                }
                classes={c.dropdown}
              />
            </div>
          </div>
          <div>
            <DemoLabel isDarkMode={dark}>
              No icon (showSelectedIcon=false)
            </DemoLabel>
            <div className="w-full sm:max-w-64">
              <Dropdown
                options={fruitOptions}
                value={noIconValue}
                onValueChange={(v) => setNoIconValue(v)}
                placeholder="Select a fruit..."
                showSelectedIcon={false}
                classes={{
                  ...c.dropdown,
                  optionSelected: dark
                    ? "bg-cl-accent/40 font-semibold text-cl-accent"
                    : "bg-cl-accent/10 font-semibold text-cl-accent",
                }}
              />
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Focus State Styling ──────────────────────────────────── */}
      <Section
        title="Custom Focus State Styling"
        description="Use optionFocused class to customize keyboard/hover focus appearance."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Purple focus</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={purpleFocusValue}
                onValueChange={(v) => setPurpleFocusValue(v)}
                placeholder="Select a fruit..."
                classes={{
                  ...c.dropdown,
 trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
                  optionFocused: dark ? "bg-cl-accent/50" : "bg-cl-accent/10",
                  optionSelected: dark ? "bg-cl-accent/40" : "bg-cl-accent/10",
                  checkIcon: `w-4 h-4 shrink-0 text-cl-accent`,
                }}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Green focus</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={greenFocusValue}
                onValueChange={(v) => setGreenFocusValue(v)}
                placeholder="Select a fruit..."
                classes={{
                  ...c.dropdown,
 trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-success focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-success`,
                  optionFocused: dark ? "bg-cl-success/50" : "bg-cl-success/15",
                  optionSelected: dark ? "bg-cl-success/40" : "bg-cl-success/15",
                  checkIcon: `w-4 h-4 shrink-0 text-cl-success`,
                }}
              />
            </div>
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
          <div className="w-full flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Dark Theme</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={darkThemeValue}
                onValueChange={(v) => setDarkThemeValue(v)}
                placeholder="Select a fruit..."
                classes={darkTheme}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Warm Theme</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={warmThemeValue}
                onValueChange={(v) => setWarmThemeValue(v)}
                placeholder="Select a fruit..."
                classes={warmTheme}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Cool Theme</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={coolThemeValue}
                onValueChange={(v) => setCoolThemeValue(v)}
                placeholder="Select a fruit..."
                classes={coolTheme}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Minimal Theme</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={minimalThemeValue}
                onValueChange={(v) => setMinimalThemeValue(v)}
                placeholder="Select a fruit..."
                showSelectedIcon={false}
                classes={minimalTheme}
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
            <Dropdown
              options={disabledItemOptions}
              value={disabledItemValue}
              onValueChange={(v) => setDisabledItemValue(v)}
              placeholder="Select an option..."
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
          <div className="w-full flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <Dropdown
                label="Favorite Fruit"
                options={fruitOptions}
                value={labeledValue}
                onValueChange={(v) => setLabeledValue(v)}
                placeholder="Select a fruit..."
                classes={c.dropdown}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <Dropdown
                label="Required Field"
                required
                options={fruitOptions}
                value={requiredValue}
                onValueChange={(v) => setRequiredValue(v)}
                placeholder="Select a fruit..."
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
              const fd = new FormData(e.currentTarget);
              alert(`FormData: fruit = ${fd.get("fruit")}`);
            }}
            className="w-full flex flex-col sm:flex-row sm:items-end gap-4"
          >
            <div className="w-full sm:max-w-64">
              <Dropdown
                name="fruit"
                label="Fruit (in form)"
                options={fruitOptions}
                placeholder="Select a fruit..."
                classes={c.dropdown}
              />
            </div>
            <button type="submit" className={c.btn}>
              Submit
            </button>
          </form>
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
            <Dropdown
              options={fruitOptions}
              value={disabledValue}
              disabled
              placeholder="Select a fruit..."
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
            <Dropdown
              label="Required Field"
              options={fruitOptions}
              value={errorValue}
              onValueChange={(v) => setErrorValue(v)}
              required
              error
              errorMessage="This field is required"
              placeholder="Select a fruit..."
              classes={{
                ...c.dropdown,
 trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-error bg-white text-cl-text focus:outline-none focus:ring-2 focus:ring-cl-error dark:border dark:border-cl-error dark:bg-cl-bg-elevated dark:text-white dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-error`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Description ──────────────────────────────────────────── */}
      <Section
        title="With Description"
        description="Add helper text below the label."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <Dropdown
              label="Country"
              description="Select your country of residence"
              options={fruitOptions}
              placeholder="Choose a country"
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Success State ────────────────────────────────────────────────── */}
      <Section
        title="Success State"
        description="Display a success message when a valid selection is made."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <Dropdown
              label="Plan"
              options={fruitOptions}
              value={successValue}
              onValueChange={(v) => setSuccessValue(v)}
              success={!!successValue}
              successMessage="Great choice!"
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Chevron & No Chevron ─────────────────────────────────── */}
      <Section
        title="Custom Chevron & No Chevron"
        description="Replace the chevron icon or hide it entirely."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Custom chevron</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={customChevronValue}
                onValueChange={(v) => setCustomChevronValue(v)}
                placeholder="Select a fruit..."
                ChevronIcon={CustomChevronIcon}
                classes={c.dropdown}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>No chevron</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={noChevronValue}
                onValueChange={(v) => setNoChevronValue(v)}
                showChevron={false}
                placeholder="Select a fruit..."
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
            <Dropdown
              options={fruitOptions}
              value={fullWidthValue}
              onValueChange={(v) => setFullWidthValue(v)}
              fullWidth
              placeholder="Select a fruit..."
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
          <div className="w-full sm:max-w-64">
            <Dropdown
              options={fruitOptions}
              placeholder="Default (scrollable)"
              classes={c.dropdown}
            />
          </div>
          <div className="w-full sm:max-w-64">
            <Dropdown
              options={fruitOptions}
              placeholder="lockScroll enabled"
              lockScroll
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Style Variants ────────────────────────────────────────────── */}
      <Section
        title="Style Variants"
        description="Different visual treatments using the classes prop — borderless, bottom-border-only, ghost, and pill styles."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full sm:max-w-64">
            <p className={`mb-2 ${c.label}`}>Default (bordered)</p>
            <Dropdown
              options={fruitOptions}
              placeholder="Select..."
              classes={c.dropdown}
            />
          </div>
          <div className="w-full sm:max-w-64">
            <p className={`mb-2 ${c.label}`}>Borderless</p>
            <Dropdown
              options={fruitOptions}
              placeholder="Select..."
              classes={{
                ...c.dropdown,
                trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover dark:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-bg-hover`,
                triggerText: "flex-1 text-left truncate",
              }}
            />
          </div>
          <div className="w-full sm:max-w-64">
            <p className={`mb-2 ${c.label}`}>Bottom border only</p>
            <Dropdown
              options={fruitOptions}
              placeholder="Select..."
              classes={{
                ...c.dropdown,
                trigger: `flex items-center gap-2 w-full px-1 py-2 text-sm border-b-2 rounded-none transition-colors cursor-pointer border border-cl-border text-cl-text hover:border-cl-border-input-focus focus-within:border-cl-border-input-focus dark:border dark:border-cl-border dark:text-cl-text dark:hover:border-cl-border-input-focus dark:focus-within:border-cl-border-input-focus`,
                triggerText: "flex-1 text-left truncate",
              }}
            />
          </div>
          <div className="w-full sm:max-w-64">
            <p className={`mb-2 ${c.label}`}>Ghost</p>
            <Dropdown
              options={fruitOptions}
              placeholder="Select..."
              classes={{
                ...c.dropdown,
                trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer text-cl-text-secondary hover:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-text/60`,
                triggerText: "flex-1 text-left truncate",
              }}
            />
          </div>
          <div className="w-full sm:max-w-64">
            <p className={`mb-2 ${c.label}`}>Pill</p>
            <Dropdown
              options={fruitOptions}
              placeholder="Select..."
              fullWidth
              classes={{
                ...c.dropdown,
 trigger: `flex items-center justify-between gap-2 w-full px-4 py-2 text-sm rounded-full transition-colors cursor-pointer border border-cl-border bg-white text-cl-text hover:border-cl-border-input shadow-sm dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:border-cl-border`,
                triggerText: "flex-1 text-left truncate",
              }}
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
                <Dropdown
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
                <Dropdown
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
                <Dropdown
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
                <Dropdown
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
                <Dropdown
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
            <Dropdown
              options={fruitOptions}
              placeholder="Renders to document.body..."
              portalContainer={null}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Pass a specific HTMLElement to portalContainer or null for
          document.body (default). This is useful when working with modals,
          iframes, or when you need precise control over the portal mount point.
        </div>
      </Section>

      {/* ─── Type-ahead Navigation ──────────────────────────────────────── */}
      <Section
        title="Type-ahead Navigation"
        description="Type while the dropdown is focused to jump to the first matching option, exactly like a native select. Multi-character input is buffered for 500ms."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <Dropdown
              options={fruitOptions}
              placeholder="Type 'g' to jump to Grape..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          This is keyboard navigation, not a search field — there is no text
          input and the typed characters are not displayed, matching native
          select behaviour. Focus moves to the match instead. For a dropdown
          with a visible search box, see Searchable Dropdown.
        </div>
      </Section>

      {/* ─── Custom Typeahead Timeout ────────────────────────────────────── */}
      <Section
        title="Custom Typeahead Timeout"
        description="Adjust the typeaheadTimeout (in milliseconds) to control how long the component waits before resetting the search buffer."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-6">
            <div>
              <p className={c.label}>Fast timeout (200ms)</p>
              <div className="w-full sm:max-w-64 mt-2">
                <Dropdown
                  options={fruitOptions}
                  value={customTimeoutValue}
                  onValueChange={(v) => setCustomTimeoutValue(v)}
                  typeaheadTimeout={200}
                  placeholder="Type quickly..."
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <p className={c.label}>Slow timeout (1500ms)</p>
              <div className="w-full sm:max-w-64 mt-2">
                <Dropdown
                  options={fruitOptions}
                  placeholder="More time to type..."
                  typeaheadTimeout={1500}
                  classes={c.dropdown}
                />
              </div>
            </div>
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
          <div className="w-full sm:max-w-64">
            <Dropdown
              options={fruitOptions}
              value={keepMountedValue}
              onValueChange={(v) => setKeepMountedValue(v)}
              keepMounted
              placeholder="Select a fruit..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          The dropdown portal remains in the DOM when closed, just hidden with
          display: none.
        </div>
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
              <p className={c.label}>No gap (0px)</p>
              <div className="w-full sm:max-w-64 mt-2">
                <Dropdown
                  options={fruitOptions}
                  dropdownGap={0}
                  placeholder="No gap..."
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <p className={c.label}>Large gap (16px)</p>
              <div className="w-full sm:max-w-64 mt-2">
                <Dropdown
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
            <Dropdown
              options={fruitOptions}
              value={zIndexValue}
              onValueChange={(v) => setZIndexValue(v)}
              dropdownZIndex={9999}
              placeholder="Select (z-index: 9999)..."
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
            <Dropdown
              options={fruitOptions}
              value={customClearIconValue}
              onValueChange={(v) => setCustomClearIconValue(v)}
              clearable
              placeholder="Select a fruit..."
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
        description="Replace the default check icon with a custom icon component via the CheckIcon prop. Here a star replaces the checkmark."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <Dropdown
              options={fruitOptions}
              value={customCheckIconValue}
              onValueChange={(v) => setCustomCheckIconValue(v)}
              placeholder="Select a fruit..."
              CheckIcon={({ className }) => (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={
                    className ||
                    `w-4 h-4 shrink-0 text-cl-warning`
                  }
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              classes={{
                ...c.dropdown,
                checkIcon: `w-4 h-4 shrink-0 text-cl-warning`,
              }}
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
            <Dropdown
              options={fruitOptions}
              value={formIntegrationValue}
              onValueChange={(v) => setFormIntegrationValue(v)}
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
        description="Provide a custom onKeyDown handler to intercept or extend keyboard behavior."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-64">
            <Dropdown
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
            <div className="w-full">
              <p className={c.label}>className (fallback for classes.root)</p>
              <div className="w-full sm:max-w-64 mt-2">
                <Dropdown
                  options={fruitOptions}
                  placeholder="Select a fruit..."
                  className={`opacity-90`}
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div className="w-full">
              <p className={c.label}>style (inline styles on root)</p>
              <div className="w-full sm:max-w-64 mt-2">
                <Dropdown
                  options={fruitOptions}
                  value={classNameStyleValue}
                  onValueChange={(v) => setClassNameStyleValue(v)}
                  placeholder="Select a fruit..."
                  style={{ border: "2px dashed gray", padding: "2px" }}
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div className="w-full">
              <p className={c.label}>aria-label="Fruit selection"</p>
              <div className="w-full sm:max-w-64 mt-2">
                <Dropdown
                  options={fruitOptions}
                  placeholder="Select a fruit..."
                  aria-label="Fruit selection"
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
          <div className="w-full flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>3 shimmer items</DemoLabel>
              <Dropdown
                options={[]}
                placeholder="Loading..."
                loading={true}
                shimmerCount={3}
                classes={c.dropdown}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>8 shimmer items</DemoLabel>
              <Dropdown
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
          <div className="w-full flex flex-wrap gap-8">
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Default text</DemoLabel>
              <Dropdown
                options={[]}
                placeholder="No options..."
                classes={c.dropdown}
              />
            </div>
            <div className="w-full sm:max-w-64">
              <DemoLabel isDarkMode={dark}>Custom ReactNode</DemoLabel>
              <Dropdown
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
        description="A comprehensive example combining multiple features: label, required, clearable, custom icons, error handling."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-80">
            <Dropdown
              label="Favorite Fruit"
              required
              options={fruitOptions}
              defaultValue="apple"
              clearable
              placeholder="Select a fruit..."
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
          custom chevron and check icons, all working together seamlessly.
        </div>
      </Section>

      {/* ─── Props ───────────────────────────────────────────────────────── */}
      <Section title="Dropdown Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="options"
              type="DropdownOption[]"
              defaultVal="[]"
              description="Array of selectable options"
              isDarkMode={dark}
            />
            <PropRow
              name="value"
              type="string | null"
              description="Controlled selected value"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultValue"
              type="string"
              description="Initial value in uncontrolled mode"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(value: string | null, option: DropdownOption | null) => void"
              description="Callback when selection changes (null when cleared)"
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
              description="Initial open state in uncontrolled mode"
              isDarkMode={dark}
            />
            <PropRow
              name="onOpenChange"
              type="(open: boolean) => void"
              description="Callback when open state changes"
              isDarkMode={dark}
            />
            <PropRow
              name="id"
              type="string"
              defaultVal="auto-generated"
              description="ID for ARIA attribute generation"
              isDarkMode={dark}
            />
            <PropRow
              name="name"
              type="string"
              description="Form field name -- renders a hidden input for native form submission"
              isDarkMode={dark}
            />
            <PropRow
              name="placeholder"
              type="ReactNode"
              defaultVal='"Select an option"'
              description="Placeholder content when no selection"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disable the entire dropdown"
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
              description="Error message displayed below trigger"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="ReactNode"
              description="Accessible label element"
              isDarkMode={dark}
            />
            <PropRow
              name="required"
              type="boolean"
              defaultVal="false"
              description="Whether the field is required"
              isDarkMode={dark}
            />
            <PropRow
              name="clearable"
              type="boolean"
              defaultVal="false"
              description="Show clear button and allow deselection"
              isDarkMode={dark}
            />
            <PropRow
              name="noResultsContent"
              type="ReactNode"
              defaultVal='"No options available"'
              description="Content shown when options is empty"
              isDarkMode={dark}
            />
            <PropRow
              name="showChevron"
              type="boolean"
              defaultVal="true"
              description="Show the dropdown chevron icon"
              isDarkMode={dark}
            />
            <PropRow
              name="showSelectedIcon"
              type="boolean"
              defaultVal="true"
              description="Show check icon on selected option"
              isDarkMode={dark}
            />
            <PropRow
              name="selectedIcon"
              type="ReactNode"
              description="Custom icon for selected option"
              isDarkMode={dark}
            />
            <PropRow
              name="fullWidth"
              type="boolean"
              defaultVal="false"
              description="Stretch to fill container width"
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
              name="onLoadOptions"
              type="() => Promise<DropdownOption[]>"
              description="Async function to load options"
              isDarkMode={dark}
            />
            <PropRow
              name="loadOnOpen"
              type="boolean"
              defaultVal="false"
              description="Trigger onLoadOptions when dropdown opens"
              isDarkMode={dark}
            />
            <PropRow
              name="onLoadError"
              type="(error: unknown) => void"
              description="Callback when async loading fails"
              isDarkMode={dark}
            />
            <PropRow
              name="shimmerCount"
              type="number"
              defaultVal="5"
              description="Number of shimmer skeleton items"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="DropdownClasses"
              description="Class names for all internal elements"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="Root class name (merged with classes.root)"
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
              description="Keep portal in DOM when closed"
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
              name="portalContainer"
              type="HTMLElement | null"
              defaultVal="document.body"
              description="Portal target container"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownPosition"
              type='"top" | "bottom"'
              defaultVal='"bottom"'
              description="Preferred popup position (auto-flips)"
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
              description="z-index of the popup"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownGap"
              type="number"
              defaultVal="4"
              description="Gap between trigger and popup (px)"
              isDarkMode={dark}
            />
            <PropRow
              name="typeaheadTimeout"
              type="number"
              defaultVal="500"
              description="Typeahead buffer timeout in ms"
              isDarkMode={dark}
            />
            <PropRow
              name="aria-label"
              type="string"
              description="Listbox aria-label (falls back to label text)"
              isDarkMode={dark}
            />
            <PropRow
              name="onBlur"
              type="() => void"
              description="Called when trigger loses focus"
              isDarkMode={dark}
            />
            <PropRow
              name="onFocus"
              type="() => void"
              description="Called when trigger gains focus"
              isDarkMode={dark}
            />
            <PropRow
              name="onKeyDown"
              type="(event: React.KeyboardEvent) => void"
              description="Custom keydown handler"
              isDarkMode={dark}
            />
            <PropRow
              name="renderTrigger"
              type="(props: DropdownTriggerRenderProps) => ReactNode"
              description="Custom trigger render function"
              isDarkMode={dark}
            />
            <PropRow
              name="ChevronIcon"
              type="ComponentType"
              defaultVal="ChevronDownIcon"
              description="Custom chevron icon component"
              isDarkMode={dark}
            />
            <PropRow
              name="CheckIcon"
              type="ComponentType"
              defaultVal="CheckIcon"
              description="Custom check icon component"
              isDarkMode={dark}
            />
            <PropRow
              name="ClearIcon"
              type="ComponentType"
              defaultVal="ClearIcon"
              description="Custom clear icon component"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── DropdownClasses Slots ───────────────────────────────────────── */}
      <Section title="DropdownClasses Slots" isDarkMode={dark}>
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
              description="Inner wrapper around trigger and portal"
              isDarkMode={dark}
            />
            <PropRow
              name="trigger"
              type="string"
              description="Trigger button (combobox)"
              isDarkMode={dark}
            />
            <PropRow
              name="triggerText"
              type="string"
              description="Text span inside trigger"
              isDarkMode={dark}
            />
            <PropRow
              name="content"
              type="string"
              description="Dropdown popup container (portal)"
              isDarkMode={dark}
            />
            <PropRow
              name="optionList"
              type="string"
              description="Scrollable option list wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="option"
              type="string"
              description="Individual option element"
              isDarkMode={dark}
            />
            <PropRow
              name="optionSelected"
              type="string"
              description="Additional class for selected option"
              isDarkMode={dark}
            />
            <PropRow
              name="optionFocused"
              type="string"
              description="Additional class for keyboard-focused option"
              isDarkMode={dark}
            />
            <PropRow
              name="optionDisabled"
              type="string"
              description="Additional class for disabled option"
              isDarkMode={dark}
            />
            <PropRow
              name="chevron"
              type="string"
              description="Chevron icon element"
              isDarkMode={dark}
            />
            <PropRow
              name="checkIcon"
              type="string"
              description="Check/selected icon element"
              isDarkMode={dark}
            />
            <PropRow
              name="clearIcon"
              type="string"
              description="Clear button element (shown when clearable)"
              isDarkMode={dark}
            />
            <PropRow
              name="noResults"
              type="string"
              description="Empty state container"
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
              description="Error message element"
              isDarkMode={dark}
            />
            <PropRow
              name="shimmer"
              type="string"
              description="Shimmer container"
              isDarkMode={dark}
            />
            <PropRow
              name="shimmerItem"
              type="string"
              description="Individual shimmer skeleton item"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ─────────────────────────────────────────────── */}
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
              description="Present on the selected option"
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

      {/* ─── Accessibility ───────────────────────────────────────────────── */}
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
              'Trigger uses role="combobox" with aria-expanded, aria-haspopup="listbox", and aria-controls',
              "aria-activedescendant tracks the currently focused option for screen readers",
              'Popup uses role="listbox" with role="option" items',
              "Associated label linked via htmlFor and aria-labelledby",
              'Error messages linked via aria-describedby with role="alert"',
              "Full keyboard navigation: ArrowDown, ArrowUp, Home, End, Enter, Space, Escape, Tab",
              "Type-ahead character search for rapid option location",
              "Focus automatically restores to trigger on close via Escape or selection",
              "Focused options automatically scroll into view",
              'aria-live="polite" status region announces loading state and option count',
              'Hidden <input type="hidden"> for native form participation when name is set',
              "Disabled options receive aria-disabled and are skipped during keyboard navigation",
              'All decorative icons have aria-hidden="true" and focusable="false"',
              "Click-outside detection handles both mouse and touch events",
              "Portal rendering prevents overflow clipping while maintaining ARIA relationships",
              "ref is forwarded to the trigger button for programmatic focus management",
              "onBlur and onFocus callbacks for form library integration",
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
              ["Enter / Space", "Open dropdown or select focused option"],
              ["↓", "Open dropdown or move to next option"],
              ["↑", "Open dropdown or move to previous option"],
              ["Home", "Move to first enabled option"],
              ["End", "Move to last enabled option"],
              ["Escape", "Close dropdown, restore focus to trigger"],
              ["Delete / Backspace", "Clear selection (when clearable)"],
              ["A-Z, 0-9", "Type-ahead: jump to matching option"],
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
        summary="Use `value` and `onValueChange` for the selection, and `open` / `onOpenChange` when you control visibility. Async options should update the `options` array from the parent."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Empty or loading option lists need clear UI and SR feedback.",
          "Virtualized or very long lists may need search—use SearchableDropdown when appropriate.",
          "Form submission: ensure `name` and hidden inputs match your backend contract.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `label` or `aria-label` on the trigger.",
          "Return a real `<button>` from `renderTrigger` for accessibility.",
          "Restore focus to the trigger after close.",
        ]}
        donts={[
          "Do not put essential navigation only inside the closed listbox.",
          "Do not block keyboard type-ahead without an alternative.",
          "Do not use duplicate `value` keys in `options`.",
        ]}
      />
    </div>
  );
};

export default DropdownDemo;
