import { useState, useCallback } from "react";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown";
import type { MultiSelectOption } from "../../components/MultiSelectDropdown";
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
  {
    value: "active",
    label: "Active",
    content: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span>Active</span>
      </div>
    ),
    selectedContent: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span>Active</span>
      </div>
    ),
  },
  {
    value: "pending",
    label: "Pending",
    content: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-500" />
        <span>Pending</span>
      </div>
    ),
    selectedContent: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-500" />
        <span>Pending</span>
      </div>
    ),
  },
  {
    value: "inactive",
    label: "Inactive",
    content: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gray-400" />
        <span>Inactive</span>
      </div>
    ),
    selectedContent: (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gray-400" />
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
    trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors min-h-[42px] ${
      dark
        ? "border-gray-700 bg-gray-800 text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    }`,
    triggerText: "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
    content: `rounded-lg shadow-lg overflow-hidden ${
      dark
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-200"
    }`,
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
    label: `block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`,
    error: `text-sm mt-1 ${dark ? "text-red-400" : "text-red-500"}`,
    description: `text-xs mb-1 ${dark ? "text-gray-400" : "text-gray-500"}`,
    success: `text-sm mt-1 ${dark ? "text-green-400" : "text-green-600"}`,
    chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md shrink-0 max-w-[100px] ${dark ? "bg-gray-600 text-gray-200" : "bg-blue-100 text-blue-800"}`,
    chipRemove: `w-3 h-3 shrink-0 cursor-pointer ${dark ? "hover:text-gray-300" : "hover:text-blue-600"}`,
    moreCount: `inline-flex items-center px-2 py-0.5 text-xs rounded-md shrink-0 ${dark ? "bg-gray-600 text-gray-300" : "bg-gray-100 text-gray-600"}`,
    shimmerItem: `px-3 py-2 ${dark ? "bg-gray-700 animate-pulse" : "bg-gray-200 animate-pulse"}`,
  },
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
});

// ─── Demo ───────────────────────────────────────────────────────────────────

const MultiSelectDropdownDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  // Basic
  const [basicValue, setBasicValue] = useState<string[]>([]);
  // Custom content
  const [countryValue, setCountryValue] = useState<string[]>([]);
  // Status indicators
  const [statusValue, setStatusValue] = useState<string[]>([]);
  // Disabled items
  const [disabledItemValue, setDisabledItemValue] = useState<string[]>([]);
  // Async
  const [asyncValue, setAsyncValue] = useState<string[]>([]);
  // Label
  const [labelValue, setLabelValue] = useState<string[]>([]);
  // Controlled open
  const [controlledOpen, setControlledOpen] = useState(false);
  const [controlledValue, setControlledValue] = useState<string[]>([]);
  // No chips
  const [noChipsValue, setNoChipsValue] = useState<string[]>([]);
  // Disabled state
  const [disabledValue, setDisabledValue] = useState<string[]>(["apple", "banana"]);
  // Error
  const [errorValue, setErrorValue] = useState<string[]>([]);
  // Description
  const [descriptionValue, setDescriptionValue] = useState<string[]>([]);
  // Success
  const [successValue, setSuccessValue] = useState<string[]>([]);
  // Form integration
  const [formIntegrationValue, setFormIntegrationValue] = useState<string[]>([]);
  // Chevron
  const [noChevronValue, setNoChevronValue] = useState<string[]>([]);
  // Full width
  const [fullWidthValue, setFullWidthValue] = useState<string[]>([]);
  // Position
  const [posTopValue, setPosTopValue] = useState<string[]>([]);
  const [posBotValue, setPosBotValue] = useState<string[]>([]);
  // Keep mounted
  const [keepMountedValue, setKeepMountedValue] = useState<string[]>([]);
  // Custom gap
  const [customGapValue, setCustomGapValue] = useState<string[]>([]);
  // Z-index
  const [zIndexValue, setZIndexValue] = useState<string[]>([]);
  // Focus / blur
  const [focusMessage, setFocusMessage] = useState("");
  // Custom keydown
  const [customKeyDownValue, setCustomKeyDownValue] = useState<string[]>([]);
  const [keyDownMessage, setKeyDownMessage] = useState("");
  // className, style, aria-label
  const [classNameDemoValue, setClassNameDemoValue] = useState<string[]>([]);
  const [classNameStyleValue, setClassNameStyleValue] = useState<string[]>([]);
  const [ariaLabelDemoValue, setAriaLabelDemoValue] = useState<string[]>([]);
  // Themes
  const [darkThemeValue, setDarkThemeValue] = useState<string[]>([]);
  const [purpleThemeValue, setPurpleThemeValue] = useState<string[]>([]);
  // Custom checkboxes
  const [greenCheckboxValue, setGreenCheckboxValue] = useState<string[]>([]);
  const [orangeCheckboxValue, setOrangeCheckboxValue] = useState<string[]>([]);
  const [customIconValue, setCustomIconValue] = useState<string[]>([]);
  // Keyboard demo
  const [keyboardDemoValue, setKeyboardDemoValue] = useState<string[]>([]);
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
        <img src={country.flags.png} alt="" className="w-5 h-4 object-cover rounded-sm" />
        <div className="flex flex-col">
          <span className="text-sm">{country.name.common}</span>
          <span className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{country.capital?.[0] || country.region}</span>
        </div>
      </div>
    ),
    selectedContent: <span className="truncate">{country.name.common}</span>,
  }), [dark]);

  const handleLoadOptions = useCallback(async (): Promise<MultiSelectOption[]> => {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2,capital,region");
    if (!response.ok) throw new Error("Failed to fetch countries");
    const data: RestCountryResponse[] = await response.json();
    const codes = ["US", "GB", "DE", "FR", "JP", "CA", "AU", "IN", "BR", "IT"];
    return codes
      .map((code) => data.find((r) => r.cca2 === code))
      .filter((r): r is RestCountryResponse => r !== undefined)
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
            MultiSelectDropdown
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A multi-select dropdown component without search. Supports keyboard navigation,
            async option loading, chips or count display, and full customization via the classes prop.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import { MultiSelectDropdown } from "@kern-ui/multi-select-dropdown";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic Usage ─────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Standard multi-select with chips."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={basicValue}
              onValueChange={(values) => setBasicValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
        </DemoWrapper>
        {basicValue.length > 0 && (
          <p className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}>
            Selected: {basicValue.join(", ")}
          </p>
        )}
      </Section>

      {/* ─── State Variations ────────────────────────────────────────────── */}
      <Section
        title="State Variations"
        description="Overview of different states: default, selected, disabled, error, and loading."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <DemoLabel isDarkMode={dark}>Default (empty)</DemoLabel>
              <MultiSelectDropdown
                options={staticOptions}
                value={[]}
                onValueChange={() => {}}
                placeholder="Select fruits..."
                maxDisplayedChips={2}
                classes={c.dropdown}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Selected (with chips)</DemoLabel>
              <MultiSelectDropdown
                options={staticOptions}
                value={["apple", "banana"]}
                onValueChange={() => {}}
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
                classes={{ ...c.dropdown, trigger: `${c.dropdown.trigger} opacity-50 cursor-not-allowed` }}
              />
            </div>
            <div>
              <DemoLabel isDarkMode={dark}>Error state</DemoLabel>
              <MultiSelectDropdown
                options={staticOptions}
                value={[]}
                onValueChange={() => {}}
                error
                errorMessage="Please select at least one"
                placeholder="Select fruits..."
                classes={{ ...c.dropdown, trigger: `${c.dropdown.trigger} border-red-500 focus:ring-red-500` }}
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
                value={["apple", "banana", "cherry"]}
                onValueChange={() => {}}
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
          <div className="w-72">
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
          <div className="w-72">
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
          <div className="w-80">
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
          Options are fetched from the REST Countries API when the dropdown opens.
        </div>
      </Section>

      {/* ─── With Disabled Options ───────────────────────────────────────── */}
      <Section
        title="With Disabled Options"
        description="Individual options can be disabled."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
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
          <div className="w-72">
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
            <div className="w-72">
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
          <div className="w-72">
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
          <div className="w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={disabledValue}
              onValueChange={(values) => setDisabledValue(values)}
              disabled
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{ ...c.dropdown, trigger: `${c.dropdown.trigger} opacity-50 cursor-not-allowed` }}
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
          <div className="w-72">
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
              classes={{ ...c.dropdown, trigger: `${c.dropdown.trigger} border-red-500 focus:ring-red-500` }}
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
          <div className="w-72">
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
          <div className="w-72">
            <MultiSelectDropdown
              label="Favorite Fruits"
              options={staticOptions}
              value={successValue}
              onValueChange={(values) => setSuccessValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              success={successValue.length > 0}
              successMessage={`${successValue.length} fruit${successValue.length === 1 ? "" : "s"} selected`}
              classes={{ ...c.dropdown, trigger: successValue.length > 0 ? `${c.dropdown.trigger} border-green-500 focus:ring-green-500` : c.dropdown.trigger }}
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
            <div className="w-72">
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
            <button
              type="submit"
              className={c.btn}
            >
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
          <div className="w-72">
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
          <div className="w-full max-w-md">
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
          <div className="w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={scrollUnlockedValue}
              onValueChange={setScrollUnlockedValue}
              placeholder="Default (scrollable)"
              maxDisplayedChips={2}
              classes={c.dropdown}
            />
          </div>
          <div className="w-72">
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
            <div className="w-72">
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
            <div className="w-72">
              <MultiSelectDropdown
                options={staticOptions}
                value={variantBorderlessValue}
                onValueChange={setVariantBorderlessValue}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer min-h-[42px] ${
                    dark
                      ? "bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`,
                  triggerText: "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
                }}
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Bottom border only</p>
            <div className="w-72">
              <MultiSelectDropdown
                options={staticOptions}
                value={variantBottomValue}
                onValueChange={setVariantBottomValue}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-1 py-2 text-sm border-b-2 rounded-none transition-colors cursor-pointer min-h-[42px] ${
                    dark
                      ? "border-gray-600 text-gray-200 hover:border-indigo-400 focus-within:border-indigo-400"
                      : "border-gray-200 text-gray-700 hover:border-indigo-500 focus-within:border-indigo-500"
                  }`,
                  triggerText: "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
                }}
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Ghost</p>
            <div className="w-72">
              <MultiSelectDropdown
                options={staticOptions}
                value={variantGhostValue}
                onValueChange={setVariantGhostValue}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer min-h-[42px] ${
                    dark
                      ? "text-gray-300 hover:bg-white/[0.06]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`,
                  triggerText: "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
                }}
              />
            </div>
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Pill</p>
            <div className="w-72">
              <MultiSelectDropdown
                options={staticOptions}
                value={variantPillValue}
                onValueChange={setVariantPillValue}
                placeholder="Select..."
                maxDisplayedChips={2}
                classes={{
                  ...c.dropdown,
                  trigger: `flex items-center gap-2 px-4 py-2 text-sm rounded-full border transition-colors cursor-pointer min-h-[42px] ${
                    dark
                      ? "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 shadow-sm"
                  }`,
                  triggerText: "flex-1 flex items-center gap-1 min-w-0 overflow-hidden",
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
              <DemoLabel isDarkMode={dark}>dropdownPosition=&quot;bottom&quot; (default)</DemoLabel>
              <div className="w-72">
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
              <DemoLabel isDarkMode={dark}>dropdownPosition=&quot;top&quot;</DemoLabel>
              <div className="w-72">
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
          The dropdown renders via a React Portal into document.body (or a custom container via portalContainer).
        </div>
      </Section>

      {/* ─── Custom Portal Container ─────────────────────────────────────── */}
      <Section
        title="Custom Portal Container"
        description="Use portalContainer to render the dropdown into a specific DOM element instead of document.body."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
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
          <div className="w-72">
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
              <div className="w-72">
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
              <div className="w-72">
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
          <div className="w-72">
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
          <div className="w-72">
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
          <p className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}>{focusMessage}</p>
        )}
      </Section>

      {/* ─── Custom KeyDown Handler ──────────────────────────────────────── */}
      <Section
        title="Custom KeyDown Handler"
        description="Provide onKeyDown to intercept or extend keyboard behavior. Call preventDefault() to override internal behavior."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
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
          <p className={`text-sm mt-2 ${dark ? "text-green-400" : "text-green-600"}`}>{keyDownMessage}</p>
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
              <div className="w-72">
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
              <div className="w-72">
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
              <DemoLabel isDarkMode={dark}>aria-label=&quot;Fruit options&quot;</DemoLabel>
              <div className="w-72">
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
          <div className="w-72">
            <MultiSelectDropdown
              options={staticOptions}
              value={darkThemeValue}
              onValueChange={(values) => setDarkThemeValue(values)}
              placeholder="Select fruits..."
              maxDisplayedChips={2}
              classes={{
                ...c.dropdown,
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[42px]",
                content: "rounded-lg shadow-lg overflow-hidden bg-gray-800 border border-gray-700",
                option: "flex items-center gap-2 px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
                optionSelected: "bg-gray-700",
                optionFocused: "bg-gray-600",
                chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400",
                checkbox: "w-4 h-4 shrink-0 border border-gray-500 rounded flex items-center justify-center",
                checkboxChecked: "bg-blue-500 border-blue-500 text-white",
                chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-600 text-gray-200 rounded-md shrink-0 max-w-[100px]",
                chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-gray-300",
                moreCount: "inline-flex items-center px-2 py-0.5 text-xs bg-gray-600 text-gray-300 rounded-md shrink-0",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Purple Theme ────────────────────────────────────────────────── */}
      <Section
        title="Purple Theme"
        description="Custom color scheme example."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <MultiSelectDropdown
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
                option: `flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed ${
                  dark ? "text-purple-200 hover:bg-purple-900/60" : "text-purple-900 hover:bg-purple-100"
                }`,
                optionSelected: dark ? "bg-purple-900/80" : "bg-purple-200",
                optionFocused: dark ? "bg-purple-900/60" : "bg-purple-100",
                chevron: `w-4 h-4 shrink-0 transition-transform duration-200 ${dark ? "text-purple-400" : "text-purple-600"}`,
                checkbox: `w-4 h-4 shrink-0 border rounded flex items-center justify-center ${dark ? "border-purple-500" : "border-purple-400"}`,
                checkboxChecked: dark ? "bg-purple-500 border-purple-500 text-white" : "bg-purple-600 border-purple-600 text-white",
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
          <div className="w-72">
            <MultiSelectDropdown
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
          <div className="w-72">
            <MultiSelectDropdown
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
              classes={{
                ...c.dropdown,
                checkbox: "w-4 h-4 shrink-0 border border-amber-400 rounded flex items-center justify-center",
                checkboxChecked: "bg-amber-500 border-amber-500 text-white",
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
            <div className="w-72">
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
            <div className="w-72">
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
            <div className="w-72">
              <DemoLabel isDarkMode={dark}>Default noResultsContent</DemoLabel>
              <MultiSelectDropdown
                options={[]}
                value={[]}
                onValueChange={() => {}}
                placeholder="No options..."
                classes={c.dropdown}
              />
            </div>
            <div className="w-72">
              <DemoLabel isDarkMode={dark}>Custom noResultsContent</DemoLabel>
              <MultiSelectDropdown
                options={[]}
                value={[]}
                onValueChange={() => {}}
                placeholder="Custom empty..."
                noResultsContent={
                  <span className="flex flex-col items-center gap-1 py-2">
                    <span className={`text-lg ${dark ? "text-gray-500" : "text-gray-400"}`}>📭</span>
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
        description="Label, required, custom chevron, chips, and classes together."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-80">
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
        title="Keyboard Navigation"
        description="Full keyboard support for accessible interaction."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-64">
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

      {/* ─── Props ───────────────────────────────────────────────────────── */}
      <Section title="MultiSelectDropdown Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="options" type="MultiSelectOption[]" defaultVal="[]" description="Array of options to display" isDarkMode={dark} />
            <PropRow name="value" type="string[]" description="Selected values (required)" isDarkMode={dark} />
            <PropRow name="onValueChange" type="(values, options) => void" description="Change handler (required)" isDarkMode={dark} />
            <PropRow name="id" type="string" defaultVal="auto-generated" description="ID for ARIA and form association" isDarkMode={dark} />
            <PropRow name="name" type="string" description="Form field name -- hidden input with comma-separated values" isDarkMode={dark} />
            <PropRow name="placeholder" type="ReactNode" defaultVal='"Select options..."' description="Placeholder when nothing selected" isDarkMode={dark} />
            <PropRow name="disabled" type="boolean" defaultVal="false" description="Disable the dropdown" isDarkMode={dark} />
            <PropRow name="error" type="boolean" defaultVal="false" description="Show error state" isDarkMode={dark} />
            <PropRow name="errorMessage" type="ReactNode" description="Error message to display" isDarkMode={dark} />
            <PropRow name="description" type="ReactNode" description="Helper text displayed below the label" isDarkMode={dark} />
            <PropRow name="success" type="boolean" defaultVal="false" description="Show success state" isDarkMode={dark} />
            <PropRow name="successMessage" type="ReactNode" description="Success message to display" isDarkMode={dark} />
            <PropRow name="label" type="ReactNode" description="Label for the dropdown" isDarkMode={dark} />
            <PropRow name="required" type="boolean" defaultVal="false" description="Whether field is required" isDarkMode={dark} />
            <PropRow name="showChevron" type="boolean" defaultVal="true" description="Show dropdown chevron" isDarkMode={dark} />
            <PropRow name="fullWidth" type="boolean" defaultVal="false" description="Take full container width" isDarkMode={dark} />
            <PropRow name="loading" type="boolean" defaultVal="false" description="External loading state" isDarkMode={dark} />
            <PropRow name="onLoadOptions" type="() => Promise<Option[]>" description="Async function to load options" isDarkMode={dark} />
            <PropRow name="loadOnOpen" type="boolean" defaultVal="false" description="Load options when dropdown opens" isDarkMode={dark} />
            <PropRow name="onLoadError" type="(error: unknown) => void" description="Callback when async loading fails" isDarkMode={dark} />
            <PropRow name="shimmerCount" type="number" defaultVal="5" description="Number of shimmer items" isDarkMode={dark} />
            <PropRow name="maxDisplayedChips" type="number" defaultVal="3" description="Max chips before showing +N" isDarkMode={dark} />
            <PropRow name="showSelectedChips" type="boolean" defaultVal="true" description="Show chips or count only" isDarkMode={dark} />
            <PropRow name="clearable" type="boolean" defaultVal="false" description="Show a clear button to deselect all values" isDarkMode={dark} />
            <PropRow name="checkboxIcon" type="ReactNode" defaultVal="CheckIcon" description="Custom checkbox icon" isDarkMode={dark} />
            <PropRow name="unstyled" type="boolean" defaultVal="false" description="Strip all default classes" isDarkMode={dark} />
            <PropRow name="lockScroll" type="boolean" defaultVal="false" description="Lock body scroll while dropdown is open" isDarkMode={dark} />
            <PropRow name="open" type="boolean" description="Controlled open state" isDarkMode={dark} />
            <PropRow name="defaultOpen" type="boolean" defaultVal="false" description="Initial open state (uncontrolled)" isDarkMode={dark} />
            <PropRow name="onOpenChange" type="(open: boolean) => void" description="Called when open state changes" isDarkMode={dark} />
            <PropRow name="classes" type="MultiSelectDropdownClasses" description="Class names for internal elements" isDarkMode={dark} />
            <PropRow name="className" type="string" description="Root class name" isDarkMode={dark} />
            <PropRow name="style" type="CSSProperties" description="Root inline styles" isDarkMode={dark} />
            <PropRow name="keepMounted" type="boolean" defaultVal="false" description="Keep listbox in DOM when closed" isDarkMode={dark} />
            <PropRow name="portalContainer" type="HTMLElement | null" defaultVal="document.body" description="Portal target" isDarkMode={dark} />
            <PropRow name="dropdownPosition" type='"top" | "bottom"' defaultVal='"bottom"' description="Preferred list position" isDarkMode={dark} />
            <PropRow name="dropdownZIndex" type="number" defaultVal="50" description="Listbox z-index" isDarkMode={dark} />
            <PropRow name="dropdownGap" type="number" defaultVal="4" description="Gap between trigger and list (px)" isDarkMode={dark} />
            <PropRow name="noResultsContent" type="ReactNode" defaultVal='"No options available"' description="Custom empty state content" isDarkMode={dark} />
            <PropRow name="aria-label" type="string" description="Listbox aria-label override" isDarkMode={dark} />
            <PropRow name="onBlur" type="() => void" description="Trigger blur callback" isDarkMode={dark} />
            <PropRow name="onFocus" type="() => void" description="Trigger focus callback" isDarkMode={dark} />
            <PropRow name="onKeyDown" type="(e: KeyboardEvent) => void" description="Custom keydown (preventDefault to override)" isDarkMode={dark} />
            <PropRow name="ChevronIcon" type="ComponentType" defaultVal="ChevronDownIcon" description="Custom chevron icon component" isDarkMode={dark} />
            <PropRow name="ClearIcon" type="ComponentType" description="Custom clear icon component" isDarkMode={dark} />
            <PropRow name="renderTrigger" type="(props) => ReactNode" description="Custom trigger renderer — receives ARIA props, isOpen, selectedOptions, and placeholder" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── MultiSelectDropdownClasses Slots ────────────────────────────── */}
      <Section title="MultiSelectDropdownClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="root" type="string" description="Root container element" isDarkMode={dark} />
            <PropRow name="wrapper" type="string" description="Inner wrapper (relative positioned)" isDarkMode={dark} />
            <PropRow name="trigger" type="string" description="Trigger button" isDarkMode={dark} />
            <PropRow name="triggerText" type="string" description="Text span inside trigger" isDarkMode={dark} />
            <PropRow name="content" type="string" description="Dropdown menu container" isDarkMode={dark} />
            <PropRow name="optionList" type="string" description="Options list wrapper" isDarkMode={dark} />
            <PropRow name="option" type="string" description="Base option styling" isDarkMode={dark} />
            <PropRow name="optionSelected" type="string" description="Additional class for selected options" isDarkMode={dark} />
            <PropRow name="optionFocused" type="string" description="Additional class for keyboard-focused options" isDarkMode={dark} />
            <PropRow name="optionDisabled" type="string" description="Additional class for disabled options" isDarkMode={dark} />
            <PropRow name="chevron" type="string" description="Chevron icon" isDarkMode={dark} />
            <PropRow name="checkbox" type="string" description="Base checkbox styling" isDarkMode={dark} />
            <PropRow name="checkboxChecked" type="string" description="Additional class for checked checkbox" isDarkMode={dark} />
            <PropRow name="checkboxIcon" type="string" description="Checkbox icon styling" isDarkMode={dark} />
            <PropRow name="chip" type="string" description="Selected chip styling" isDarkMode={dark} />
            <PropRow name="chipRemove" type="string" description="Chip remove button" isDarkMode={dark} />
            <PropRow name="moreCount" type="string" description='"+N more" badge' isDarkMode={dark} />
            <PropRow name="noResults" type="string" description="No results message" isDarkMode={dark} />
            <PropRow name="label" type="string" description="Label element" isDarkMode={dark} />
            <PropRow name="error" type="string" description="Error message" isDarkMode={dark} />
            <PropRow name="description" type="string" description="Description/helper text" isDarkMode={dark} />
            <PropRow name="success" type="string" description="Success message" isDarkMode={dark} />
            <PropRow name="shimmer" type="string" description="Shimmer container" isDarkMode={dark} />
            <PropRow name="shimmerItem" type="string" description="Individual shimmer item" isDarkMode={dark} />
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
            <PropRow name="data-selected" type="option" description="Present on selected options" isDarkMode={dark} />
            <PropRow name="data-focused" type="option" description="Present on the keyboard-focused option" isDarkMode={dark} />
            <PropRow name="data-value" type="option" description="The option's value string" isDarkMode={dark} />
            <PropRow name="data-state" type="content (portal)" description='"open" or "closed"' isDarkMode={dark} />
            <PropRow name="data-position" type="content (portal)" description='"top" or "bottom" (actual position)' isDarkMode={dark} />
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
              'Trigger uses role="combobox" with aria-expanded, aria-haspopup="listbox", aria-controls, and aria-activedescendant',
              'Listbox uses role="listbox" with aria-multiselectable="true" and role="option" items',
              "Full keyboard navigation: Enter/Space (toggle option), ArrowDown/Up, Home, End, Escape, Tab",
              "Focus automatically restores to trigger on close via Escape or Tab",
              'aria-live="polite" status region announces loading and selection count',
              "Disabled options have aria-disabled and are skipped by keyboard navigation",
              'Error messages use role="alert" linked via aria-describedby',
              "Associated label linked via htmlFor and aria-labelledby",
              'Hidden <input type="hidden"> for native form participation when name is set',
              'All decorative icons have aria-hidden="true"',
              "Click-outside detection handles both mouse and touch events",
              "Portal rendering prevents overflow clipping while maintaining ARIA relationships",
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
              ["Enter / Space", "Open dropdown or toggle focused option"],
              ["↓", "Open dropdown or move to next option"],
              ["↑", "Move to previous option"],
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
