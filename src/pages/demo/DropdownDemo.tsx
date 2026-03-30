import { useState, useCallback } from "react";
import { Dropdown } from "../../components/Dropdown";
import type { DropdownOption } from "../../components/Dropdown";
import { useTheme } from "./ThemeContext";
import {
  Section,
  CodeBlock,
  DemoWrapper,
  DemoLabel,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
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
  { value: "us", label: "United States", content: <span>🇺🇸 United States</span> },
  { value: "gb", label: "United Kingdom", content: <span>🇬🇧 United Kingdom</span> },
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

const disabledItemOptions: DropdownOption[] = [
  { value: "option1", label: "Available Option 1" },
  { value: "option2", label: "Disabled Option", disabled: true },
  { value: "option3", label: "Available Option 2" },
  { value: "option4", label: "Disabled Option 2", disabled: true },
  { value: "option5", label: "Available Option 3" },
];

// ─── Icons ──────────────────────────────────────────────────────────────────

const CustomChevronIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} style={style} aria-hidden="true" width={16} height={16}>
    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

// ─── Themed Classes ─────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  dropdown: {
    wrapper: "relative",
    trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors ${
      dark
        ? "border-gray-700 bg-gray-800 text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    }`,
    triggerText: "flex-1 text-left truncate",
    content: `rounded-lg shadow-lg overflow-hidden ${
      dark
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-200"
    }`,
    optionList: "max-h-60 overflow-y-auto",
    option: `flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
      dark
        ? "text-gray-200 hover:bg-gray-700"
        : "text-gray-700 hover:bg-gray-50"
    }`,
    optionSelected: dark ? "bg-blue-900/50 font-medium" : "bg-blue-50 font-medium",
    optionFocused: dark ? "bg-gray-700" : "bg-gray-100",
    optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
    chevron: `w-4 h-4 shrink-0 transition-transform duration-200 ${dark ? "text-gray-400" : "text-gray-500"}`,
    checkIcon: `w-4 h-4 shrink-0 ${dark ? "text-blue-400" : "text-blue-600"}`,
    clearIcon: `absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${dark ? "text-gray-400" : "text-gray-500"}`,
    noResults: `px-3 py-4 text-sm text-center ${dark ? "text-gray-400" : "text-gray-500"}`,
    label: `block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`,
    error: `text-sm mt-1 ${dark ? "text-red-400" : "text-red-500"}`,
    shimmerItem: `mx-2 my-1.5 h-4 rounded ${dark ? "bg-gray-700 animate-pulse" : "bg-gray-200 animate-pulse"}`,
  },
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
});

// ─── Extra theme variants for the theme demos ───────────────────────────────

const darkTheme = {
  wrapper: "relative",
  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500",
  triggerText: "flex-1 truncate",
  content: "rounded-lg shadow-lg overflow-hidden bg-gray-800 border border-gray-700",
  optionList: "max-h-60 overflow-y-auto",
  option: "flex items-center justify-between px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 transition-colors",
  optionSelected: "bg-gray-600",
  optionFocused: "bg-gray-700",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400",
  checkIcon: "w-4 h-4 shrink-0 text-blue-400",
  noResults: "px-3 py-4 text-sm text-gray-400 text-center",
};

const warmTheme = {
  wrapper: "relative",
  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-amber-300 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400",
  triggerText: "flex-1 truncate",
  content: "rounded-lg shadow-lg overflow-hidden bg-amber-50 border border-amber-200",
  optionList: "max-h-60 overflow-y-auto",
  option: "flex items-center justify-between px-3 py-2 cursor-pointer text-amber-900 hover:bg-amber-100 transition-colors",
  optionSelected: "bg-amber-200",
  optionFocused: "bg-amber-100",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-amber-600",
  checkIcon: "w-4 h-4 shrink-0 text-amber-700",
  noResults: "px-3 py-4 text-sm text-amber-600 text-center",
};

const coolTheme = {
  wrapper: "relative",
  trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-cyan-300 rounded-lg bg-cyan-50 text-cyan-900 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400",
  triggerText: "flex-1 truncate",
  content: "rounded-lg shadow-lg overflow-hidden bg-cyan-50 border border-cyan-200",
  optionList: "max-h-60 overflow-y-auto",
  option: "flex items-center justify-between px-3 py-2 cursor-pointer text-cyan-900 hover:bg-cyan-100 transition-colors",
  optionSelected: "bg-cyan-200",
  optionFocused: "bg-cyan-100",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-cyan-600",
  checkIcon: "w-4 h-4 shrink-0 text-cyan-700",
  noResults: "px-3 py-4 text-sm text-cyan-600 text-center",
};

const getMinimalTheme = (dark: boolean) => ({
  wrapper: "relative",
  trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border-b bg-transparent focus:outline-none ${
    dark
      ? "border-gray-600 text-white hover:border-gray-400 focus:border-white"
      : "border-gray-300 text-gray-800 hover:border-gray-500 focus:border-gray-800"
  }`,
  triggerText: "flex-1 truncate",
  content: `rounded shadow-sm overflow-hidden border ${
    dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
  }`,
  optionList: "max-h-60 overflow-y-auto",
  option: `flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
    dark ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
  }`,
  optionSelected: "font-medium",
  optionFocused: dark ? "bg-gray-700" : "bg-gray-50",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  chevron: `w-4 h-4 shrink-0 transition-transform duration-200 ${dark ? "text-gray-400" : "text-gray-400"}`,
  checkIcon: `w-4 h-4 shrink-0 ${dark ? "text-gray-300" : "text-gray-600"}`,
  noResults: `px-3 py-4 text-sm text-center ${dark ? "text-gray-400" : "text-gray-400"}`,
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
  const [renderTriggerValue, setRenderTriggerValue] = useState<string | null>(null);
  // Custom content
  const [countryValue, setCountryValue] = useState<string | null>(null);
  // Async
  const [asyncCountryValue, setAsyncCountryValue] = useState<string | null>(null);
  // Status
  const [statusValue, setStatusValue] = useState<string | null>(null);
  // Custom selected & icons
  const [customSelectedValue, setCustomSelectedValue] = useState<string | null>(null);
  const [customIconValue, setCustomIconValue] = useState<string | null>(null);
  const [noIconValue, setNoIconValue] = useState<string | null>(null);
  // Focus styling
  const [purpleFocusValue, setPurpleFocusValue] = useState<string | null>(null);
  const [greenFocusValue, setGreenFocusValue] = useState<string | null>(null);
  // Theme demos
  const [darkThemeValue, setDarkThemeValue] = useState<string | null>(null);
  const [warmThemeValue, setWarmThemeValue] = useState<string | null>(null);
  const [coolThemeValue, setCoolThemeValue] = useState<string | null>(null);
  const [minimalThemeValue, setMinimalThemeValue] = useState<string | null>(null);
  // Disabled items
  const [disabledItemValue, setDisabledItemValue] = useState<string | null>(null);
  // Label & required
  const [labeledValue, setLabeledValue] = useState<string | null>(null);
  const [requiredValue, setRequiredValue] = useState<string | null>(null);
  // Disabled state
  const [disabledValue] = useState<string | null>("apple");
  // Error
  const [errorValue, setErrorValue] = useState<string | null>(null);

  const [successValue, setSuccessValue] = useState<string | null>(null);
  // Chevron
  const [customChevronValue, setCustomChevronValue] = useState<string | null>(null);
  const [noChevronValue, setNoChevronValue] = useState<string | null>(null);
  // Full width
  const [fullWidthValue, setFullWidthValue] = useState<string | null>(null);
  // Position
  const [posTopValue, setPosTopValue] = useState<string | null>(null);
  const [posBotValue, setPosBotValue] = useState<string | null>(null);
  // Keep mounted
  const [keepMountedValue, setKeepMountedValue] = useState<string | null>(null);
  // Gap
  const [customGapValue, setCustomGapValue] = useState<string | null>(null);
  // Typeahead timeout
  const [customTimeoutValue, setCustomTimeoutValue] = useState<string | null>(null);
  // Z-index
  const [zIndexValue, setZIndexValue] = useState<string | null>(null);
  // Custom clear icon
  const [customClearIconValue, setCustomClearIconValue] = useState<string | null>("apple");
  // Custom check icon
  const [customCheckIconValue, setCustomCheckIconValue] = useState<string | null>(null);
  // Form integration
  const [formIntegrationValue, setFormIntegrationValue] = useState<string | null>(null);
  const [focusMessage, setFocusMessage] = useState<string>("");
  // Custom key down
  const [customKeyDownValue, setCustomKeyDownValue] = useState<string | null>(null);
  const [keyDownMessage, setKeyDownMessage] = useState<string>("");
  // className / style
  const [classNameStyleValue, setClassNameStyleValue] = useState<string | null>(null);

  const mapCountryToOption = useCallback(
    (country: RestCountryResponse): DropdownOption => ({
      value: country.cca2,
      label: country.name.common,
      content: (
        <span className="flex items-center gap-2">
          <img src={country.flags.png} alt={`${country.name.common} flag`} className="w-5 h-4 object-cover rounded-sm" />
          <span className="flex flex-col">
            <span className="text-sm">{country.name.common}</span>
            <span className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{country.capital?.[0] || country.region}</span>
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
    [dark],
  );

  const handleLoadCountries = useCallback(async (): Promise<DropdownOption[]> => {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,cca2,capital,region",
    );
    if (!response.ok) throw new Error("Failed to fetch countries");
    const data: RestCountryResponse[] = await response.json();
    const codes = ["US", "GB", "DE", "FR", "JP", "CA", "AU", "IN", "BR", "IT"];
    return codes
      .map((code) => data.find((ct) => ct.cca2 === code))
      .filter((ct): ct is RestCountryResponse => ct !== undefined)
      .map(mapCountryToOption);
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
            Dropdown
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A fully accessible select dropdown component for choosing from a list
            of options. Supports controlled and uncontrolled modes, portal
            rendering, keyboard navigation with type-ahead search, async option
            loading, clearable selection, custom trigger rendering, and complete
            style customization via a classes object.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import { Dropdown } from "@kern-ui/dropdown";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic Usage ─────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Standard dropdown with string options."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-64">
            <Dropdown
              options={fruitOptions}
              value={basicValue}
              onValueChange={(v) => setBasicValue(v)}
              placeholder="Select a fruit..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        {basicValue && (
          <p className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}>
            Selected: {basicValue}
          </p>
        )}
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
                  trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors ${
                    dark
                      ? "border-red-500 bg-gray-800 text-white hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      : "border-red-500 bg-white text-gray-900 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  }`,
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
          <div className="w-64">
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
          <div className="flex items-end gap-4">
            <div className="w-64">
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
        description="When clearable is true, a clear button appears after selection. Clicking the already-selected option also deselects it."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-64">
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
          <p className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}>
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
          <div className="w-72">
            <Dropdown
              options={fruitOptions}
              value={renderTriggerValue}
              onValueChange={(v) => setRenderTriggerValue(v)}
              placeholder="Pick a fruit..."
              classes={c.dropdown}
              renderTrigger={({ ref, isOpen, selectedOption, placeholder: ph, ...rest }) => (
                <button
                  ref={ref as React.RefCallback<HTMLButtonElement>}
                  {...rest}
                  type="button"
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl border-2 transition-all ${
                    isOpen
                      ? dark
                        ? "border-blue-500 bg-gray-800 text-white shadow-lg shadow-blue-500/20"
                        : "border-blue-500 bg-white text-gray-900 shadow-lg shadow-blue-500/20"
                      : dark
                        ? "border-gray-700 bg-gray-800 text-white hover:border-gray-500"
                        : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                  }`}
                >
                  <span className={`text-xl ${selectedOption ? "" : "opacity-50"}`}>
                    {selectedOption ? "🍎" : "🔍"}
                  </span>
                  <span className="flex-1 truncate font-medium">
                    {selectedOption?.label ?? ph}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isOpen
                      ? dark ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"
                      : dark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
                  }`}>
                    {isOpen ? "Open" : "Closed"}
                  </span>
                </button>
              )}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          <p className="font-semibold mb-1">Important: renderTrigger must return a {'<button>'} element</p>
          <p>
            For proper accessibility, the custom trigger MUST be a native button element with type=&quot;button&quot;.
            Using div or span elements will break keyboard navigation and screen reader support.
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
          <div className="w-64">
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
          <div className="w-80">
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
        <p className={`text-sm mt-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>
          Options are fetched from the REST Countries API when the dropdown opens.
        </p>
      </Section>

      {/* ─── With Status Indicators ──────────────────────────────────────── */}
      <Section
        title="With Status Indicators"
        description="Use content and selectedContent for rich option rendering."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-64">
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
            <DemoLabel isDarkMode={dark}>Green accent + left border on selected</DemoLabel>
            <div className="w-64">
              <Dropdown
                options={fruitOptions}
                value={customSelectedValue}
                onValueChange={(v) => setCustomSelectedValue(v)}
                placeholder="Select a fruit..."
                classes={{
                  ...c.dropdown,
                  optionSelected: dark
                    ? "bg-emerald-900/40 border-l-[3px] border-emerald-400 pl-3"
                    : "bg-emerald-50 border-l-[3px] border-emerald-500 pl-3",
                  checkIcon: dark ? "text-emerald-400" : "text-emerald-600",
                }}
              />
            </div>
          </div>
          <div>
            <DemoLabel isDarkMode={dark}>Star icon instead of checkmark</DemoLabel>
            <div className="w-64">
              <Dropdown
                options={fruitOptions}
                value={customIconValue}
                onValueChange={(v) => setCustomIconValue(v)}
                placeholder="Select a fruit..."
                selectedIcon={
                  <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 shrink-0 ${dark ? "text-yellow-400" : "text-amber-500"}`} aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                }
                classes={c.dropdown}
              />
            </div>
          </div>
          <div>
            <DemoLabel isDarkMode={dark}>Circle dot icon</DemoLabel>
            <div className="w-64">
              <Dropdown
                options={fruitOptions}
                placeholder="Select a fruit..."
                selectedIcon={
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dark ? "bg-indigo-400" : "bg-indigo-600"}`} />
                }
                classes={c.dropdown}
              />
            </div>
          </div>
          <div>
            <DemoLabel isDarkMode={dark}>No icon (showSelectedIcon=false)</DemoLabel>
            <div className="w-64">
              <Dropdown
                options={fruitOptions}
                value={noIconValue}
                onValueChange={(v) => setNoIconValue(v)}
                placeholder="Select a fruit..."
                showSelectedIcon={false}
                classes={{
                  ...c.dropdown,
                  optionSelected: dark
                    ? "bg-indigo-900/40 font-semibold text-indigo-300"
                    : "bg-indigo-50 font-semibold text-indigo-700",
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
          <div className="flex flex-wrap gap-8">
            <div className="w-64">
              <DemoLabel isDarkMode={dark}>Purple focus</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={purpleFocusValue}
                onValueChange={(v) => setPurpleFocusValue(v)}
                placeholder="Select a fruit..."
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors ${
                    dark
                      ? "border-gray-700 bg-gray-800 text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  }`,
                  optionFocused: dark ? "bg-purple-900/50" : "bg-purple-100",
                  optionSelected: dark ? "bg-purple-900/40" : "bg-purple-50",
                  checkIcon: `w-4 h-4 shrink-0 ${dark ? "text-purple-400" : "text-purple-600"}`,
                }}
              />
            </div>
            <div className="w-64">
              <DemoLabel isDarkMode={dark}>Green focus</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={greenFocusValue}
                onValueChange={(v) => setGreenFocusValue(v)}
                placeholder="Select a fruit..."
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors ${
                    dark
                      ? "border-gray-700 bg-gray-800 text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  }`,
                  optionFocused: dark ? "bg-green-900/50" : "bg-green-100",
                  optionSelected: dark ? "bg-green-900/40" : "bg-green-50",
                  checkIcon: `w-4 h-4 shrink-0 ${dark ? "text-green-400" : "text-green-600"}`,
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
          <div className="flex flex-wrap gap-8">
            <div className="w-64">
              <DemoLabel isDarkMode={dark}>Dark Theme</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={darkThemeValue}
                onValueChange={(v) => setDarkThemeValue(v)}
                placeholder="Select a fruit..."
                classes={darkTheme}
              />
            </div>
            <div className="w-64">
              <DemoLabel isDarkMode={dark}>Warm Theme</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={warmThemeValue}
                onValueChange={(v) => setWarmThemeValue(v)}
                placeholder="Select a fruit..."
                classes={warmTheme}
              />
            </div>
            <div className="w-64">
              <DemoLabel isDarkMode={dark}>Cool Theme</DemoLabel>
              <Dropdown
                options={fruitOptions}
                value={coolThemeValue}
                onValueChange={(v) => setCoolThemeValue(v)}
                placeholder="Select a fruit..."
                classes={coolTheme}
              />
            </div>
            <div className="w-64">
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
          <div className="w-64">
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
          <div className="flex flex-wrap gap-8">
            <div className="w-64">
              <Dropdown
                label="Favorite Fruit"
                options={fruitOptions}
                value={labeledValue}
                onValueChange={(v) => setLabeledValue(v)}
                placeholder="Select a fruit..."
                classes={c.dropdown}
              />
            </div>
            <div className="w-64">
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
            className="flex items-end gap-4"
          >
            <div className="w-64">
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
          <div className="w-64">
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
          <div className="w-64">
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
                trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors ${
                  dark
                    ? "border-red-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    : "border-red-500 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                }`,
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
          <Dropdown
            label="Country"
            description="Select your country of residence"
            options={fruitOptions}
            placeholder="Choose a country"
            classes={c.dropdown}
          />
        </DemoWrapper>
        <CodeBlock isDarkMode={dark} code={`<Dropdown
  label="Country"
  description="Select your country of residence"
  options={options}
  placeholder="Choose a country"
/>`} />
      </Section>

      {/* ─── Success State ────────────────────────────────────────────────── */}
      <Section
        title="Success State"
        description="Display a success message when a valid selection is made."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-64">
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
        <CodeBlock isDarkMode={dark} code={`<Dropdown
  label="Plan"
  options={options}
  value={val}
  onValueChange={(v) => setVal(v)}
  success={!!val}
  successMessage="Great choice!"
/>`} />
      </Section>

      {/* ─── Custom Chevron & No Chevron ─────────────────────────────────── */}
      <Section
        title="Custom Chevron & No Chevron"
        description="Replace the chevron icon or hide it entirely."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-wrap gap-8">
            <div className="w-64">
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
            <div className="w-64">
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
          <div className="w-full max-w-md">
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
          <Dropdown
            options={fruitOptions}
            placeholder="Default (scrollable)"
            classes={c.dropdown}
          />
          <Dropdown
            options={fruitOptions}
            placeholder="lockScroll enabled"
            lockScroll
            classes={c.dropdown}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Style Variants ────────────────────────────────────────────── */}
      <Section
        title="Style Variants"
        description="Different visual treatments using the classes prop — borderless, bottom-border-only, ghost, and pill styles."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div>
            <p className={`mb-2 ${c.label}`}>Default (bordered)</p>
            <Dropdown options={fruitOptions} placeholder="Select..." classes={c.dropdown} />
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Borderless</p>
            <Dropdown
              options={fruitOptions}
              placeholder="Select..."
              classes={{
                ...c.dropdown,
                trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                  dark
                    ? "bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`,
                triggerText: "flex-1 text-left truncate",
              }}
            />
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Bottom border only</p>
            <Dropdown
              options={fruitOptions}
              placeholder="Select..."
              classes={{
                ...c.dropdown,
                trigger: `flex items-center gap-2 w-full px-1 py-2 text-sm border-b-2 rounded-none transition-colors cursor-pointer ${
                  dark
                    ? "border-gray-600 text-gray-200 hover:border-indigo-400 focus-within:border-indigo-400"
                    : "border-gray-200 text-gray-700 hover:border-indigo-500 focus-within:border-indigo-500"
                }`,
                triggerText: "flex-1 text-left truncate",
              }}
            />
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Ghost</p>
            <Dropdown
              options={fruitOptions}
              placeholder="Select..."
              classes={{
                ...c.dropdown,
                trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                  dark
                    ? "text-gray-300 hover:bg-white/[0.06]"
                    : "text-gray-600 hover:bg-gray-50"
                }`,
                triggerText: "flex-1 text-left truncate",
              }}
            />
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Pill</p>
            <Dropdown
              options={fruitOptions}
              placeholder="Select..."
              classes={{
                ...c.dropdown,
                trigger: `flex items-center gap-2 px-4 py-2 text-sm rounded-full border transition-colors cursor-pointer ${
                  dark
                    ? "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 shadow-sm"
                }`,
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
              <DemoLabel isDarkMode={dark}>dropdownPosition=&quot;bottom&quot; (default)</DemoLabel>
              <div className="w-64">
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
              <DemoLabel isDarkMode={dark}>dropdownPosition=&quot;top&quot;</DemoLabel>
              <div className="w-64">
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
          The dropdown renders via a React Portal into document.body (or a custom
          container via portalContainer), so it is never clipped by overflow: hidden
          ancestors. Position updates react to window resize, scroll, container
          resize (via ResizeObserver), and iOS Safari virtual keyboard changes (via
          visualViewport).
        </div>
      </Section>

      {/* ─── Custom Portal Container ─────────────────────────────────────── */}
      <Section
        title="Custom Portal Container"
        description="Use portalContainer to render the dropdown into a specific DOM element instead of document.body."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-64">
            <Dropdown
              options={fruitOptions}
              placeholder="Renders to document.body..."
              portalContainer={null}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Pass a specific HTMLElement to portalContainer or null for document.body
          (default). This is useful when working with modals, iframes, or when you
          need precise control over the portal mount point.
        </div>
      </Section>

      {/* ─── Type-ahead Search ───────────────────────────────────────────── */}
      <Section
        title="Type-ahead Search"
        description="Type a character while the dropdown is open (or closed) to jump to the first matching option. Supports multi-character buffering within 500ms."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-64">
            <Dropdown
              options={fruitOptions}
              placeholder="Type 'g' to jump to Grape..."
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Focus the trigger and start typing. Printable characters trigger
          type-ahead navigation through options matching the typed string.
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
              <div className="w-64 mt-2">
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
              <div className="w-64 mt-2">
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
          <div className="w-64">
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
              <div className="w-64 mt-2">
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
              <div className="w-64 mt-2">
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
          <div className="w-64">
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
          <div className="w-64">
            <Dropdown
              options={fruitOptions}
              value={customClearIconValue}
              onValueChange={(v) => setCustomClearIconValue(v)}
              clearable
              placeholder="Select a fruit..."
              ClearIcon={() => (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
          <div className="w-64">
            <Dropdown
              options={fruitOptions}
              value={customCheckIconValue}
              onValueChange={(v) => setCustomCheckIconValue(v)}
              placeholder="Select a fruit..."
              CheckIcon={({ className }) => (
                <svg viewBox="0 0 20 20" fill="currentColor" className={className || `w-4 h-4 shrink-0 ${dark ? "text-yellow-400" : "text-amber-500"}`} aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              classes={{
                ...c.dropdown,
                checkIcon: `w-4 h-4 shrink-0 ${dark ? "text-yellow-400" : "text-amber-500"}`,
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
          <div className="w-64">
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
          <p className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}>
            {focusMessage}
          </p>
        )}
        <div className={c.note}>
          These callbacks fire on the trigger button's focus/blur events. Perfect
          for form validation libraries that track field touch state.
        </div>
      </Section>

      {/* ─── Custom KeyDown Handler ──────────────────────────────────────── */}
      <Section
        title="Custom KeyDown Handler"
        description="Provide a custom onKeyDown handler to intercept or extend keyboard behavior."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-64">
            <Dropdown
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
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        {keyDownMessage && (
          <p className={`text-sm mt-2 ${dark ? "text-green-400" : "text-green-600"}`}>
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
              <p className={c.label}>className (fallback for classes.root)</p>
              <div className="w-64 mt-2">
                <Dropdown
                  options={fruitOptions}
                  placeholder="Select a fruit..."
                  className={`${dark ? "opacity-90" : "opacity-95"}`}
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <p className={c.label}>style (inline styles on root)</p>
              <div className="w-64 mt-2">
                <Dropdown
                  options={fruitOptions}
                  value={classNameStyleValue}
                  onValueChange={(v) => setClassNameStyleValue(v)}
                  placeholder="Select a fruit..."
                  style={{ maxWidth: "300px", margin: "0 auto" }}
                  classes={c.dropdown}
                />
              </div>
            </div>
            <div>
              <p className={c.label}>aria-label="Fruit selection"</p>
              <div className="w-64 mt-2">
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
          <div className="flex flex-wrap gap-8">
            <div className="w-64">
              <DemoLabel isDarkMode={dark}>3 shimmer items</DemoLabel>
              <Dropdown
                options={[]}
                placeholder="Loading..."
                loading={true}
                shimmerCount={3}
                classes={c.dropdown}
              />
            </div>
            <div className="w-64">
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
          <div className="flex flex-wrap gap-8">
            <div className="w-64">
              <DemoLabel isDarkMode={dark}>Default text</DemoLabel>
              <Dropdown
                options={[]}
                placeholder="No options..."
                classes={c.dropdown}
              />
            </div>
            <div className="w-64">
              <DemoLabel isDarkMode={dark}>Custom ReactNode</DemoLabel>
              <Dropdown
                options={[]}
                placeholder="Custom empty..."
                noResultsContent={
                  <span className="flex flex-col items-center gap-1 py-2">
                    <span className={`text-lg ${dark ? "text-gray-500" : "text-gray-400"}`}>🔍</span>
                    <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>Nothing here yet</span>
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
          <div className="w-80">
            <Dropdown
              label="Favorite Fruit"
              required
              options={fruitOptions}
              defaultValue="apple"
              clearable
              placeholder="Select a fruit..."
              ChevronIcon={CustomChevronIcon}
              CheckIcon={({ className }) => (
                <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
            <PropRow name="options" type="DropdownOption[]" defaultVal="[]" description="Array of selectable options" isDarkMode={dark} />
            <PropRow name="value" type="string | null" description="Controlled selected value" isDarkMode={dark} />
            <PropRow name="defaultValue" type="string" description="Initial value in uncontrolled mode" isDarkMode={dark} />
            <PropRow name="onValueChange" type="(value: string | null, option: DropdownOption | null) => void" description="Callback when selection changes (null when cleared)" isDarkMode={dark} />
            <PropRow name="open" type="boolean" description="Controlled open state" isDarkMode={dark} />
            <PropRow name="defaultOpen" type="boolean" defaultVal="false" description="Initial open state in uncontrolled mode" isDarkMode={dark} />
            <PropRow name="onOpenChange" type="(open: boolean) => void" description="Callback when open state changes" isDarkMode={dark} />
            <PropRow name="id" type="string" defaultVal="auto-generated" description="ID for ARIA attribute generation" isDarkMode={dark} />
            <PropRow name="name" type="string" description="Form field name -- renders a hidden input for native form submission" isDarkMode={dark} />
            <PropRow name="placeholder" type="ReactNode" defaultVal='"Select an option"' description="Placeholder content when no selection" isDarkMode={dark} />
            <PropRow name="disabled" type="boolean" defaultVal="false" description="Disable the entire dropdown" isDarkMode={dark} />
            <PropRow name="error" type="boolean" defaultVal="false" description="Show error state" isDarkMode={dark} />
            <PropRow name="errorMessage" type="ReactNode" description="Error message displayed below trigger" isDarkMode={dark} />
            <PropRow name="label" type="ReactNode" description="Accessible label element" isDarkMode={dark} />
            <PropRow name="required" type="boolean" defaultVal="false" description="Whether the field is required" isDarkMode={dark} />
            <PropRow name="clearable" type="boolean" defaultVal="false" description="Show clear button and allow deselection" isDarkMode={dark} />
            <PropRow name="noResultsContent" type="ReactNode" defaultVal='"No options available"' description="Content shown when options is empty" isDarkMode={dark} />
            <PropRow name="showChevron" type="boolean" defaultVal="true" description="Show the dropdown chevron icon" isDarkMode={dark} />
            <PropRow name="showSelectedIcon" type="boolean" defaultVal="true" description="Show check icon on selected option" isDarkMode={dark} />
            <PropRow name="selectedIcon" type="ReactNode" description="Custom icon for selected option" isDarkMode={dark} />
            <PropRow name="fullWidth" type="boolean" defaultVal="false" description="Stretch to fill container width" isDarkMode={dark} />
            <PropRow name="loading" type="boolean" defaultVal="false" description="External loading state" isDarkMode={dark} />
            <PropRow name="onLoadOptions" type="() => Promise<DropdownOption[]>" description="Async function to load options" isDarkMode={dark} />
            <PropRow name="loadOnOpen" type="boolean" defaultVal="false" description="Trigger onLoadOptions when dropdown opens" isDarkMode={dark} />
            <PropRow name="onLoadError" type="(error: unknown) => void" description="Callback when async loading fails" isDarkMode={dark} />
            <PropRow name="shimmerCount" type="number" defaultVal="5" description="Number of shimmer skeleton items" isDarkMode={dark} />
            <PropRow name="classes" type="DropdownClasses" description="Class names for all internal elements" isDarkMode={dark} />
            <PropRow name="className" type="string" description="Root class name (merged with classes.root)" isDarkMode={dark} />
            <PropRow name="style" type="CSSProperties" description="Root inline styles" isDarkMode={dark} />
            <PropRow name="keepMounted" type="boolean" defaultVal="false" description="Keep portal in DOM when closed" isDarkMode={dark} />
            <PropRow name="lockScroll" type="boolean" defaultVal="false" description="Lock body scroll while dropdown is open" isDarkMode={dark} />
            <PropRow name="portalContainer" type="HTMLElement | null" defaultVal="document.body" description="Portal target container" isDarkMode={dark} />
            <PropRow name="dropdownPosition" type='"top" | "bottom"' defaultVal='"bottom"' description="Preferred popup position (auto-flips)" isDarkMode={dark} />
            <PropRow name="dropdownZIndex" type="number" defaultVal="50" description="z-index of the popup" isDarkMode={dark} />
            <PropRow name="dropdownGap" type="number" defaultVal="4" description="Gap between trigger and popup (px)" isDarkMode={dark} />
            <PropRow name="typeaheadTimeout" type="number" defaultVal="500" description="Typeahead buffer timeout in ms" isDarkMode={dark} />
            <PropRow name="aria-label" type="string" description="Listbox aria-label (falls back to label text)" isDarkMode={dark} />
            <PropRow name="onBlur" type="() => void" description="Called when trigger loses focus" isDarkMode={dark} />
            <PropRow name="onFocus" type="() => void" description="Called when trigger gains focus" isDarkMode={dark} />
            <PropRow name="onKeyDown" type="(event: React.KeyboardEvent) => void" description="Custom keydown handler" isDarkMode={dark} />
            <PropRow name="renderTrigger" type="(props: DropdownTriggerRenderProps) => ReactNode" description="Custom trigger render function" isDarkMode={dark} />
            <PropRow name="ChevronIcon" type="ComponentType" defaultVal="ChevronDownIcon" description="Custom chevron icon component" isDarkMode={dark} />
            <PropRow name="CheckIcon" type="ComponentType" defaultVal="CheckIcon" description="Custom check icon component" isDarkMode={dark} />
            <PropRow name="ClearIcon" type="ComponentType" defaultVal="ClearIcon" description="Custom clear icon component" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── DropdownClasses Slots ───────────────────────────────────────── */}
      <Section title="DropdownClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="root" type="string" description="Root container element" isDarkMode={dark} />
            <PropRow name="wrapper" type="string" description="Inner wrapper around trigger and portal" isDarkMode={dark} />
            <PropRow name="trigger" type="string" description="Trigger button (combobox)" isDarkMode={dark} />
            <PropRow name="triggerText" type="string" description="Text span inside trigger" isDarkMode={dark} />
            <PropRow name="content" type="string" description="Dropdown popup container (portal)" isDarkMode={dark} />
            <PropRow name="optionList" type="string" description="Scrollable option list wrapper" isDarkMode={dark} />
            <PropRow name="option" type="string" description="Individual option element" isDarkMode={dark} />
            <PropRow name="optionSelected" type="string" description="Additional class for selected option" isDarkMode={dark} />
            <PropRow name="optionFocused" type="string" description="Additional class for keyboard-focused option" isDarkMode={dark} />
            <PropRow name="optionDisabled" type="string" description="Additional class for disabled option" isDarkMode={dark} />
            <PropRow name="chevron" type="string" description="Chevron icon element" isDarkMode={dark} />
            <PropRow name="checkIcon" type="string" description="Check/selected icon element" isDarkMode={dark} />
            <PropRow name="clearIcon" type="string" description="Clear button element (shown when clearable)" isDarkMode={dark} />
            <PropRow name="noResults" type="string" description="Empty state container" isDarkMode={dark} />
            <PropRow name="label" type="string" description="Label element" isDarkMode={dark} />
            <PropRow name="error" type="string" description="Error message element" isDarkMode={dark} />
            <PropRow name="shimmer" type="string" description="Shimmer container" isDarkMode={dark} />
            <PropRow name="shimmerItem" type="string" description="Individual shimmer skeleton item" isDarkMode={dark} />
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
            <PropRow name="data-open" type="root, trigger" description="Present when the dropdown is open" isDarkMode={dark} />
            <PropRow name="data-disabled" type="root, trigger, option" description="Present when disabled" isDarkMode={dark} />
            <PropRow name="data-error" type="root, trigger" description="Present when in error state" isDarkMode={dark} />
            <PropRow name="data-success" type="root, trigger" description="Present when in success state" isDarkMode={dark} />
            <PropRow name="data-full-width" type="root" description="Present when fullWidth is true" isDarkMode={dark} />
            <PropRow name="data-placeholder" type="trigger" description="Present when no option is selected" isDarkMode={dark} />
            <PropRow name="data-selected" type="option" description="Present on the selected option" isDarkMode={dark} />
            <PropRow name="data-focused" type="option" description="Present on the keyboard-focused option" isDarkMode={dark} />
            <PropRow name="data-value" type="option" description="The option's value string" isDarkMode={dark} />
            <PropRow name="data-state" type='content (portal)' description='"open" or "closed"' isDarkMode={dark} />
            <PropRow name="data-position" type='content (portal)' description='"top" or "bottom" (actual position)' isDarkMode={dark} />
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
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
