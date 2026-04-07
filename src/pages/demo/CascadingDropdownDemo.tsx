import { useState, useCallback, useEffect } from "react";
import { CascadingDropdown } from "../../components/CascadingDropdown";
import type {
  CascadingOption,
  CascadingValue,
  CascadingDropdownClasses,
} from "../../components/CascadingDropdown";
import { useTheme } from "./ThemeContext";
import {
  Section,
  CodeBlock,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

// ─── Types ──────────────────────────────────────────────────────────────────

interface CountryApiResponse {
  name: { common: string };
  flags: { png: string; svg: string };
  cca2: string;
  capital?: string[];
  region: string;
  subregion?: string;
}

// ─── Static Data ────────────────────────────────────────────────────────────

const regionOptionsMulti: CascadingOption[] = [
  {
    value: "Africa",
    label: "Africa",
    hasChildren: true,
    selectionMode: "multi",
  },
  {
    value: "Americas",
    label: "Americas",
    hasChildren: true,
    selectionMode: "multi",
  },
  { value: "Asia", label: "Asia", hasChildren: true, selectionMode: "multi" },
  {
    value: "Europe",
    label: "Europe",
    hasChildren: true,
    selectionMode: "multi",
  },
  {
    value: "Oceania",
    label: "Oceania",
    hasChildren: true,
    selectionMode: "multi",
  },
];

const regionOptionsSingle: CascadingOption[] = [
  {
    value: "Africa",
    label: "Africa",
    hasChildren: true,
    selectionMode: "single",
  },
  {
    value: "Americas",
    label: "Americas",
    hasChildren: true,
    selectionMode: "single",
  },
  { value: "Asia", label: "Asia", hasChildren: true, selectionMode: "single" },
  {
    value: "Europe",
    label: "Europe",
    hasChildren: true,
    selectionMode: "single",
  },
  {
    value: "Oceania",
    label: "Oceania",
    hasChildren: true,
    selectionMode: "single",
  },
];

const loadCountriesForRegion = async (
  parent: CascadingOption,
): Promise<CascadingOption[]> => {
  const response = await fetch(
    `https://restcountries.com/v3.1/region/${parent.value.toLowerCase()}?fields=name,flags,cca2,capital,subregion`,
  );
  const data: CountryApiResponse[] = await response.json();

  return data
    .sort((a, b) => a.name.common.localeCompare(b.name.common))
    .map((country) => ({
      value: country.cca2,
      label: country.name.common,
      content: (
        <span className="flex items-center gap-2">
          <img
            src={country.flags.png}
            alt={`${country.name.common} flag`}
            className="w-5 h-4 object-cover rounded-sm"
          />
          <span className="truncate">{country.name.common}</span>
        </span>
      ),
    }));
};

const categoryOptions: CascadingOption[] = [
  {
    value: "electronics",
    label: "Electronics",
    selectionMode: "single",
    children: [
      { value: "phones", label: "Phones" },
      { value: "laptops", label: "Laptops" },
      { value: "tablets", label: "Tablets" },
      { value: "accessories", label: "Accessories" },
    ],
  },
  {
    value: "clothing",
    label: "Clothing",
    selectionMode: "single",
    children: [
      { value: "mens", label: "Men's" },
      { value: "womens", label: "Women's" },
      { value: "kids", label: "Kids" },
    ],
  },
  {
    value: "home",
    label: "Home & Garden",
    selectionMode: "single",
    children: [
      { value: "furniture", label: "Furniture" },
      { value: "decor", label: "Decor" },
      { value: "garden", label: "Garden" },
    ],
  },
];

const filterOptions: CascadingOption[] = [
  {
    value: "color",
    label: "Color",
    selectionMode: "multi",
    children: [
      { value: "red", label: "Red" },
      { value: "blue", label: "Blue" },
      { value: "green", label: "Green" },
      { value: "black", label: "Black" },
      { value: "white", label: "White" },
    ],
  },
  {
    value: "size",
    label: "Size",
    selectionMode: "multi",
    children: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
    ],
  },
  {
    value: "brand",
    label: "Brand",
    selectionMode: "multi",
    children: [
      { value: "nike", label: "Nike" },
      { value: "adidas", label: "Adidas" },
      { value: "puma", label: "Puma" },
      { value: "reebok", label: "Reebok" },
    ],
  },
];

const mixedOptions: CascadingOption[] = [
  {
    value: "department",
    label: "Department",
    selectionMode: "single",
    children: [
      { value: "engineering", label: "Engineering" },
      { value: "design", label: "Design" },
      { value: "marketing", label: "Marketing" },
      { value: "sales", label: "Sales" },
    ],
  },
  {
    value: "skills",
    label: "Skills",
    selectionMode: "multi",
    children: [
      { value: "javascript", label: "JavaScript" },
      { value: "python", label: "Python" },
      { value: "react", label: "React" },
      { value: "nodejs", label: "Node.js" },
      { value: "figma", label: "Figma" },
    ],
  },
  {
    value: "experience",
    label: "Experience Level",
    selectionMode: "single",
    children: [
      { value: "junior", label: "Junior (0-2 years)" },
      { value: "mid", label: "Mid (2-5 years)" },
      { value: "senior", label: "Senior (5+ years)" },
    ],
  },
];

const simpleOptions: CascadingOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  {
    value: "nested",
    label: "Nested Options",
    children: [
      { value: "sub1", label: "Sub Option 1" },
      { value: "sub2", label: "Sub Option 2" },
    ],
  },
];

const disabledOptions: CascadingOption[] = [
  {
    value: "available",
    label: "Available Category",
    children: [
      { value: "item1", label: "Item 1" },
      { value: "item2", label: "Item 2", disabled: true },
      { value: "item3", label: "Item 3" },
    ],
  },
  {
    value: "disabled",
    label: "Disabled Category",
    disabled: true,
    children: [
      { value: "d1", label: "Disabled Item 1" },
      { value: "d2", label: "Disabled Item 2" },
    ],
  },
];

// ─── Themed Classes ─────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  cascading: {
    root: "",
    wrapper: "",
    trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors ${
      dark
        ? "border-gray-700 bg-gray-800 text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    }`,
    menu: `rounded-lg shadow-lg overflow-visible ${
      dark
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-200"
    }`,
    menuItem: `flex items-center justify-between px-3 py-2 cursor-pointer ${
      dark
        ? "text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
        : "hover:bg-gray-50 data-[focused]:bg-gray-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
    }`,
    menuItemSelected: "",
    menuItemFocused: dark ? "bg-gray-700" : "bg-gray-100",
    menuItemDisabled: "opacity-50 cursor-not-allowed",
    submenu: `min-w-[180px] rounded-lg shadow-lg ml-1 ${
      dark
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-200"
    }`,
    submenuContainer: "",
    submenuItem: `flex items-center gap-2 px-3 py-2 cursor-pointer ${
      dark
        ? "text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
        : "hover:bg-gray-50 data-[focused]:bg-gray-100 data-[selected]:bg-blue-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
    }`,
    submenuItemSelected: dark ? "bg-gray-600" : "bg-blue-50",
    submenuItemFocused: dark ? "bg-gray-700" : "bg-gray-100",
    label: `block text-sm font-medium mb-1 ${dark ? "text-gray-300" : "text-gray-700"}`,
    error: `text-sm mt-1 ${dark ? "text-red-400" : "text-red-500"}`,
    chevron: `w-4 h-4 shrink-0 transition-transform duration-200 ${dark ? "text-gray-400" : "text-gray-500"}`,
    submenuChevron: `w-4 h-4 shrink-0 ${dark ? "text-gray-500" : "text-gray-400"}`,
    checkIcon: `w-4 h-4 shrink-0 ${dark ? "text-blue-400" : "text-blue-600"}`,
    checkbox: `w-4 h-4 shrink-0 border rounded flex items-center justify-center ${
      dark ? "border-gray-500" : "border-gray-300"
    }`,
    checkboxChecked: dark
      ? "bg-blue-500 border-blue-500 text-white"
      : "bg-blue-600 border-blue-600 text-white",
    noResults: `px-3 py-4 text-sm text-center ${dark ? "text-gray-400" : "text-gray-500"}`,
    loading: `px-3 py-4 text-sm text-center ${dark ? "text-gray-400" : "text-gray-500"}`,
  } satisfies CascadingDropdownClasses,
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
  valueBox: `mt-3 p-3 rounded-lg w-full ${dark ? "bg-gray-800 border border-gray-700" : "bg-gray-50"}`,
  valueLabel: `text-xs font-medium mb-1 ${dark ? "text-gray-400" : "text-gray-600"}`,
  valuePre: `text-xs overflow-x-auto ${dark ? "text-gray-300" : "text-gray-800"}`,
  statusText: `text-xs ${dark ? "text-gray-400" : "text-gray-500"}`,
  descText: `text-sm mt-2 w-full ${dark ? "text-gray-400" : "text-gray-500"}`,
});

// ─── Purple Theme Variant ───────────────────────────────────────────────────

const getPurpleClasses = (dark: boolean): CascadingDropdownClasses => ({
  trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 ${
    dark
      ? "border-purple-700 bg-purple-950/60 text-purple-200 hover:border-purple-500"
      : "border-purple-300 bg-purple-50 text-purple-900 hover:border-purple-400"
  }`,
  menu: `rounded-lg shadow-lg overflow-visible ${
    dark
      ? "bg-purple-950 border border-purple-800"
      : "bg-purple-50 border border-purple-200"
  }`,
  menuItem: `flex items-center justify-between px-3 py-2 cursor-pointer ${
    dark
      ? "text-purple-200 hover:bg-purple-900/60 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
      : "text-purple-900 hover:bg-purple-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
  }`,
  menuItemFocused: dark ? "bg-purple-900/60" : "bg-purple-100",
  submenu: `min-w-[180px] rounded-lg shadow-lg ml-1 ${
    dark
      ? "bg-purple-950 border border-purple-800"
      : "bg-purple-50 border border-purple-200"
  }`,
  submenuItem: `flex items-center gap-2 px-3 py-2 cursor-pointer ${
    dark
      ? "text-purple-200 hover:bg-purple-900/60 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
      : "text-purple-900 hover:bg-purple-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
  }`,
  submenuItemSelected: dark ? "bg-purple-900/80" : "bg-purple-200",
  submenuItemFocused: dark ? "bg-purple-900/60" : "bg-purple-100",
  chevron: `w-4 h-4 shrink-0 transition-transform duration-200 ${dark ? "text-purple-400" : "text-purple-500"}`,
  submenuChevron: `w-4 h-4 shrink-0 ${dark ? "text-purple-400" : "text-purple-500"}`,
  checkIcon: `w-4 h-4 shrink-0 ${dark ? "text-purple-300" : "text-purple-600"}`,
  checkbox: `w-4 h-4 shrink-0 border rounded flex items-center justify-center ${
    dark ? "border-purple-500" : "border-purple-400"
  }`,
  checkboxChecked: dark
    ? "bg-purple-500 border-purple-500 text-white"
    : "bg-purple-600 border-purple-600 text-white",
  noResults: `px-3 py-4 text-sm text-center ${dark ? "text-purple-400" : "text-purple-500"}`,
});

// ─── Demo ───────────────────────────────────────────────────────────────────

const CascadingDropdownDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  // ─── State ──────────────────────────────────────────────────────────────
  const [basicValue, setBasicValue] = useState<CascadingValue>({});
  const [multiValue, setMultiValue] = useState<CascadingValue>({});
  const [mixedValue, setMixedValue] = useState<CascadingValue>({});
  const [simpleValue, setSimpleValue] = useState<CascadingValue>({});
  const [disabledValue, setDisabledValue] = useState<CascadingValue>({});
  const [labeledValue, setLabeledValue] = useState<CascadingValue>({});
  const [descriptionValue, setDescriptionValue] = useState<CascadingValue>({});
  const [successValue, setSuccessValue] = useState<CascadingValue>({});
  const [errorValue, setErrorValue] = useState<CascadingValue>({});
  const [leftPositionValue, setLeftPositionValue] = useState<CascadingValue>(
    {},
  );
  const [noCloseValue, setNoCloseValue] = useState<CascadingValue>({});
  const [asyncMultiValue, setAsyncMultiValue] = useState<CascadingValue>({});
  const [asyncSingleValue, setAsyncSingleValue] = useState<CascadingValue>({});
  const [disabledDropdownValue] = useState<CascadingValue>({
    electronics: "phones",
  });
  const [darkThemeValue, setDarkThemeValue] = useState<CascadingValue>({});
  const [darkThemeMultiValue, setDarkThemeMultiValue] =
    useState<CascadingValue>({});
  const [purpleThemeValue, setPurpleThemeValue] = useState<CascadingValue>({});
  const [purpleThemeMultiValue, setPurpleThemeMultiValue] =
    useState<CascadingValue>({});
  const [greenCheckboxValue, setGreenCheckboxValue] = useState<CascadingValue>(
    {},
  );
  const [orangeCheckboxValue, setOrangeCheckboxValue] =
    useState<CascadingValue>({});
  const [customCheckboxIconValue, setCustomCheckboxIconValue] =
    useState<CascadingValue>({});
  const [customSelectedIconValue, setCustomSelectedIconValue] =
    useState<CascadingValue>({});
  const [uncontrolledDefaultValue] = useState<CascadingValue>({
    electronics: "laptops",
  });

  // ─── Prefetch on Mount ──────────────────────────────────────────────────
  const [prefetchValue, setPrefetchValue] = useState<CascadingValue>({});
  const [prefetchOptions, setPrefetchOptions] = useState<CascadingOption[]>([]);
  const [isPrefetchLoading, setIsPrefetchLoading] = useState(true);
  const [hasPrefetchLoaded, setHasPrefetchLoaded] = useState(false);

  // ─── Load on Open ──────────────────────────────────────────────────────
  const [loadOnOpenValue, setLoadOnOpenValue] = useState<CascadingValue>({});
  const [loadOnOpenOptions, setLoadOnOpenOptions] = useState<CascadingOption[]>(
    [],
  );
  const [isLoadOnOpenLoading, setIsLoadOnOpenLoading] = useState(false);
  const [hasLoadOnOpenLoaded, setHasLoadOnOpenLoaded] = useState(false);
  const [loadOnOpenDropdownClicked, setLoadOnOpenDropdownClicked] =
    useState(false);

  const handleLoadChildren = useCallback(async (parent: CascadingOption) => {
    return loadCountriesForRegion(parent);
  }, []);

  const fetchRegions = useCallback(async (): Promise<CascadingOption[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=region",
    );
    const data: { region: string }[] = await response.json();
    const uniqueRegions = [
      ...new Set(data.map((r) => r.region).filter(Boolean)),
    ].sort();
    return uniqueRegions.map((region) => ({
      value: region,
      label: region,
      hasChildren: true,
      selectionMode: "single" as const,
    }));
  }, []);

  useEffect(() => {
    const loadPrefetch = async () => {
      try {
        const options = await fetchRegions();
        setPrefetchOptions(options);
        setHasPrefetchLoaded(true);
      } catch (error) {
        console.error("Failed to prefetch regions:", error);
      } finally {
        setIsPrefetchLoading(false);
      }
    };
    loadPrefetch();
  }, [fetchRegions]);

  useEffect(() => {
    if (
      loadOnOpenDropdownClicked &&
      !hasLoadOnOpenLoaded &&
      !isLoadOnOpenLoading
    ) {
      const loadOnOpen = async () => {
        setIsLoadOnOpenLoading(true);
        try {
          const options = await fetchRegions();
          setLoadOnOpenOptions(options);
          setHasLoadOnOpenLoaded(true);
        } catch (error) {
          console.error("Failed to load regions:", error);
        } finally {
          setIsLoadOnOpenLoading(false);
        }
      };
      loadOnOpen();
    }
  }, [
    loadOnOpenDropdownClicked,
    hasLoadOnOpenLoaded,
    isLoadOnOpenLoading,
    fetchRegions,
  ]);

  const resetLoadOnOpenDemo = useCallback(() => {
    setHasLoadOnOpenLoaded(false);
    setLoadOnOpenOptions([]);
    setLoadOnOpenValue({});
    setLoadOnOpenDropdownClicked(false);
  }, []);

  const handleLoadChildrenAsync = useCallback(
    async (parent: CascadingOption) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return loadCountriesForRegion(parent);
    },
    [],
  );

  // ─── Dark-only theme variant for explicit dark demos ────────────────────
  const darkOnlyClasses: CascadingDropdownClasses = {
    trigger:
      "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500",
    menu: "bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-visible",
    menuItem:
      "flex items-center justify-between px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
    menuItemFocused: "bg-gray-700",
    submenu:
      "min-w-[180px] bg-gray-800 border border-gray-700 rounded-lg shadow-lg ml-1",
    submenuItem:
      "flex items-center gap-2 px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
    submenuItemSelected: "bg-gray-600",
    submenuItemFocused: "bg-gray-700",
    chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400",
    submenuChevron: "w-4 h-4 shrink-0 text-gray-500",
    checkIcon: "w-4 h-4 shrink-0 text-blue-400",
    checkbox:
      "w-4 h-4 shrink-0 border border-gray-500 rounded flex items-center justify-center",
    checkboxChecked: "bg-blue-500 border-blue-500 text-white",
    noResults: "px-3 py-4 text-sm text-gray-400 text-center",
  };

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
            Cascading Dropdown
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A nested dropdown component with support for submenus,
            single/multi-select modes, async loading of children, custom icons,
            and full keyboard navigation.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import { CascadingDropdown } from "@chumlab/ui/cascading-dropdown";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic Usage ─────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="A simple cascading dropdown with static nested options."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-96">
            {/* Basic usage — works out-of-the-box with built-in styles */}
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              placeholder="Select a category..."
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Async Single-Select (Countries API) ────────────────────────── */}
      <Section
        title="Async Single-Select (Countries API)"
        description="Countries are loaded dynamically when hovering over a region. Single-select mode closes the menu after selection."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-96">
            <CascadingDropdown
              options={regionOptionsSingle}
              value={asyncSingleValue}
              onValueChange={(val) => setAsyncSingleValue(val)}
              onLoadChildren={handleLoadChildren}
              placeholder="Select region and country..."
              loadingText="Loading countries..."
              classes={{
                ...c.cascading,
                submenu: `${c.cascading.submenu} max-h-64 overflow-y-auto`,
              }}
            />
          </div>
          {Object.keys(asyncSingleValue).length > 0 && (
            <div className={c.valueBox}>
              <p className={c.valueLabel}>Selected Value:</p>
              <pre className={c.valuePre}>
                {JSON.stringify(asyncSingleValue, null, 2)}
              </pre>
            </div>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Async Multi-Select (Countries API) ─────────────────────────── */}
      <Section
        title="Async Multi-Select (Countries API)"
        description="Countries are loaded dynamically from the REST Countries API when you hover over a region. Multi-select mode allows selecting multiple countries per region."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-96">
            <CascadingDropdown
              options={regionOptionsMulti}
              value={asyncMultiValue}
              onValueChange={(val) => setAsyncMultiValue(val)}
              onLoadChildren={handleLoadChildren}
              placeholder="Select region and countries..."
              closeOnSelect={false}
              loadingText="Loading countries..."
              classes={{
                ...c.cascading,
                submenu: `${c.cascading.submenu} max-h-64 overflow-y-auto`,
              }}
            />
          </div>
          {Object.keys(asyncMultiValue).length > 0 && (
            <div className={c.valueBox}>
              <p className={c.valueLabel}>Selected Value:</p>
              <pre className={c.valuePre}>
                {JSON.stringify(asyncMultiValue, null, 2)}
              </pre>
            </div>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Fully Async - Prefetch on Mount ────────────────────────────── */}
      <Section
        title="Fully Async - Prefetch on Mount"
        description="Main menu options (regions) are fetched immediately when the page loads. Countries are loaded when hovering over a region."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-96">
            <CascadingDropdown
              options={prefetchOptions}
              value={prefetchValue}
              onValueChange={(val) => setPrefetchValue(val)}
              onLoadChildren={handleLoadChildrenAsync}
              placeholder="Select region and country..."
              loading={isPrefetchLoading}
              loadingText="Loading regions..."
              classes={{
                ...c.cascading,
                submenu: `${c.cascading.submenu} max-h-64 overflow-y-auto`,
              }}
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={c.statusText}>
              Main menu:{" "}
              {isPrefetchLoading
                ? "Loading..."
                : hasPrefetchLoaded
                  ? `${prefetchOptions.length} regions loaded`
                  : "Failed to load"}
            </span>
          </div>
          {Object.keys(prefetchValue).length > 0 && (
            <div className={c.valueBox}>
              <p className={c.valueLabel}>Selected Value:</p>
              <pre className={c.valuePre}>
                {JSON.stringify(prefetchValue, null, 2)}
              </pre>
            </div>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Fully Async - Load on Open ─────────────────────────────────── */}
      <Section
        title="Fully Async - Load on Open"
        description="Main menu options are fetched only when you click the dropdown. Open the Network tab before clicking to observe the API call."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div
            className="w-96"
            onClick={() => setLoadOnOpenDropdownClicked(true)}
          >
            <CascadingDropdown
              options={loadOnOpenOptions}
              value={loadOnOpenValue}
              onValueChange={(val) => setLoadOnOpenValue(val)}
              onLoadChildren={handleLoadChildrenAsync}
              placeholder="Click to load regions..."
              loading={isLoadOnOpenLoading}
              loadingText="Loading regions..."
              noResultsContent={
                hasLoadOnOpenLoaded
                  ? "No regions found"
                  : "Click to load regions"
              }
              classes={{
                ...c.cascading,
                submenu: `${c.cascading.submenu} max-h-64 overflow-y-auto`,
              }}
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={c.statusText}>
              Main menu:{" "}
              {isLoadOnOpenLoading
                ? "Loading..."
                : hasLoadOnOpenLoaded
                  ? `${loadOnOpenOptions.length} regions loaded`
                  : "Not loaded yet - click dropdown"}
            </span>
            {hasLoadOnOpenLoaded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetLoadOnOpenDemo();
                }}
                className={`text-xs underline ${dark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
              >
                Reset
              </button>
            )}
          </div>
          {Object.keys(loadOnOpenValue).length > 0 && (
            <div className={c.valueBox}>
              <p className={c.valueLabel}>Selected Value:</p>
              <pre className={c.valuePre}>
                {JSON.stringify(loadOnOpenValue, null, 2)}
              </pre>
            </div>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Single Select Submenus ─────────────────────────────────────── */}
      <Section
        title="Single Select Submenus"
        description="Hover over a category to reveal subcategories. Single-select mode closes after selection."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={categoryOptions}
              value={basicValue}
              onValueChange={(val) => setBasicValue(val)}
              placeholder="Select category..."
              classes={c.cascading}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Multi Select Submenus ──────────────────────────────────────── */}
      <Section
        title="Multi Select Submenus"
        description="Multi-select mode with checkboxes. Dropdown stays open for multiple selections."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={filterOptions}
              value={multiValue}
              onValueChange={(val) => setMultiValue(val)}
              placeholder="Select filters..."
              closeOnSelect={false}
              classes={c.cascading}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Mixed Selection Modes ──────────────────────────────────────── */}
      <Section
        title="Mixed Selection Modes"
        description="Different categories can have different selection modes (single vs multi)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-80">
            <CascadingDropdown
              options={mixedOptions}
              value={mixedValue}
              onValueChange={(val) => setMixedValue(val)}
              placeholder="Filter candidates..."
              closeOnSelect={false}
              classes={c.cascading}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Simple Options with Nested ─────────────────────────────────── */}
      <Section
        title="Simple Options with Nested"
        description="Mix of flat options and nested submenus."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full max-w-64">
            <CascadingDropdown
              options={simpleOptions}
              value={simpleValue}
              onValueChange={(val) => setSimpleValue(val)}
              placeholder="Select option..."
              classes={c.cascading}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Label ─────────────────────────────────────────────────── */}
      <Section
        title="With Label"
        description="Add a label to the dropdown."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              label="Product Category"
              options={categoryOptions}
              value={labeledValue}
              onValueChange={(val) => setLabeledValue(val)}
              placeholder="Select category..."
              classes={c.cascading}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Description ──────────────────────────────────────────── */}
      <Section
        title="With Description"
        description="Add helper text below the label using the description prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              label="Product Category"
              description="Choose the category that best fits your product."
              options={categoryOptions}
              value={descriptionValue}
              onValueChange={(val) => setDescriptionValue(val)}
              placeholder="Select category..."
              classes={c.cascading}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Success State ───────────────────────────────────────────────── */}
      <Section
        title="Success State"
        description="Show a success message after a valid selection."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              label="Product Category"
              options={categoryOptions}
              value={successValue}
              onValueChange={(val) => setSuccessValue(val)}
              placeholder="Select category..."
              success={Object.keys(successValue).length > 0}
              successMessage={
                Object.keys(successValue).length > 0
                  ? "Category selected successfully"
                  : undefined
              }
              classes={{
                ...c.cascading,
                trigger: `${c.cascading.trigger} ${
                  Object.keys(successValue).length > 0
                    ? "border-green-500 focus:ring-green-500"
                    : ""
                }`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Required Field ─────────────────────────────────────────────── */}
      <Section
        title="Required Field"
        description="Required validation with error state."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              label="Required Category"
              required
              options={categoryOptions}
              value={errorValue}
              onValueChange={(val) => setErrorValue(val)}
              placeholder="Select category..."
              error={Object.keys(errorValue).length === 0}
              errorMessage={
                Object.keys(errorValue).length === 0
                  ? "Please select a category"
                  : undefined
              }
              classes={{
                ...c.cascading,
                trigger: `${c.cascading.trigger} ${
                  Object.keys(errorValue).length === 0
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Disabled State ─────────────────────────────────────────────── */}
      <Section
        title="Disabled State"
        description="The entire dropdown is disabled."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={categoryOptions}
              value={disabledDropdownValue}
              disabled
              placeholder="Select category..."
              classes={{
                ...c.cascading,
                trigger: `${c.cascading.trigger} opacity-50 cursor-not-allowed`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Disabled Options ───────────────────────────────────────────── */}
      <Section
        title="Disabled Options"
        description="Some categories and items are disabled."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={disabledOptions}
              value={disabledValue}
              onValueChange={(val) => setDisabledValue(val)}
              placeholder="Select option..."
              classes={c.cascading}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Submenu Position: Left ─────────────────────────────────────── */}
      <Section
        title="Submenu Position: Left"
        description="Submenu opens to the left of the parent menu."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={categoryOptions}
              value={leftPositionValue}
              onValueChange={(val) => setLeftPositionValue(val)}
              placeholder="Select category..."
              submenuPosition="left"
              classes={{
                ...c.cascading,
                submenu: `${c.cascading.submenu} mr-1 ml-0`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Keep Open on Select ────────────────────────────────────────── */}
      <Section
        title="Keep Open on Select"
        description="Dropdown stays open after selection for continuous browsing."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={categoryOptions}
              value={noCloseValue}
              onValueChange={(val) => setNoCloseValue(val)}
              placeholder="Select categories..."
              closeOnSelect={false}
              classes={c.cascading}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Uncontrolled with Default Value ────────────────────────────── */}
      <Section
        title="Uncontrolled with Default Value"
        description="Uncontrolled mode with default value pre-selected."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={categoryOptions}
              defaultValue={uncontrolledDefaultValue}
              placeholder="Select category..."
              classes={c.cascading}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Dark Theme (Single Select) ─────────────────────────────────── */}
      <Section
        title="Dark Theme (Single Select)"
        description="Dark themed dropdown with custom background colors."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={categoryOptions}
              value={darkThemeValue}
              onValueChange={(val) => setDarkThemeValue(val)}
              placeholder="Select category..."
              classes={darkOnlyClasses}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Dark Theme (Multi Select) ──────────────────────────────────── */}
      <Section
        title="Dark Theme (Multi Select)"
        description="Dark themed multi-select with custom checkbox colors."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={filterOptions}
              value={darkThemeMultiValue}
              onValueChange={(val) => setDarkThemeMultiValue(val)}
              placeholder="Select filters..."
              closeOnSelect={false}
              classes={darkOnlyClasses}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Purple Theme (Single Select) ───────────────────────────────── */}
      <Section
        title="Purple Theme (Single Select)"
        description="Purple themed dropdown with matching colors."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={categoryOptions}
              value={purpleThemeValue}
              onValueChange={(val) => setPurpleThemeValue(val)}
              placeholder="Select category..."
              classes={getPurpleClasses(dark)}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Purple Theme (Multi Select) ────────────────────────────────── */}
      <Section
        title="Purple Theme (Multi Select)"
        description="Purple themed multi-select with matching checkbox."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={filterOptions}
              value={purpleThemeMultiValue}
              onValueChange={(val) => setPurpleThemeMultiValue(val)}
              placeholder="Select filters..."
              closeOnSelect={false}
              classes={getPurpleClasses(dark)}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Checkbox - Green Rounded ─────────────────────────────── */}
      <Section
        title="Custom Checkbox - Green Rounded"
        description="Round checkbox with green checked state."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={filterOptions}
              value={greenCheckboxValue}
              onValueChange={(val) => setGreenCheckboxValue(val)}
              placeholder="Select filters..."
              closeOnSelect={false}
              classes={{
                ...c.cascading,
                submenuItemSelected: "bg-emerald-50",
                checkIcon: "w-4 h-4 shrink-0 text-emerald-600",
                checkbox:
                  "w-4 h-4 shrink-0 border border-gray-300 rounded-full flex items-center justify-center",
                checkboxChecked: "bg-emerald-500 border-emerald-500 text-white",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Checkbox - Orange Square ──────────────────────────────── */}
      <Section
        title="Custom Checkbox - Orange Square"
        description="Larger square checkbox with orange checked state and thicker border."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={filterOptions}
              value={orangeCheckboxValue}
              onValueChange={(val) => setOrangeCheckboxValue(val)}
              placeholder="Select filters..."
              closeOnSelect={false}
              classes={{
                ...c.cascading,
                submenuItemSelected: "bg-orange-50",
                checkIcon: "w-4 h-4 shrink-0 text-orange-600",
                checkbox:
                  "w-5 h-5 shrink-0 border-2 border-orange-300 rounded-sm flex items-center justify-center",
                checkboxChecked: "bg-orange-500 border-orange-500 text-white",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Checkbox Icon ─────────────────────────────────────────── */}
      <Section
        title="Custom Checkbox Icon"
        description="Custom star icon instead of default checkmark for multi-select."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={filterOptions}
              value={customCheckboxIconValue}
              onValueChange={(val) => setCustomCheckboxIconValue(val)}
              placeholder="Select filters..."
              closeOnSelect={false}
              checkboxIcon={
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              }
              classes={{
                ...c.cascading,
                submenuItemSelected: "bg-amber-50",
                checkbox:
                  "w-4 h-4 shrink-0 border border-amber-400 rounded flex items-center justify-center",
                checkboxChecked: "bg-amber-500 border-amber-500 text-white",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Selected Icon (Single Select) ─────────────────────────── */}
      <Section
        title="Custom Selected Icon (Single Select)"
        description="Custom heart icon instead of default checkmark for single-select."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-72">
            <CascadingDropdown
              options={categoryOptions}
              value={customSelectedIconValue}
              onValueChange={(val) => setCustomSelectedIconValue(val)}
              placeholder="Select category..."
              selectedIcon={
                <svg
                  className="w-4 h-4 text-rose-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              classes={{
                ...c.cascading,
                submenuItemSelected: "bg-rose-50",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Full Width ─────────────────────────────────────────────────── */}
      <Section
        title="Full Width"
        description="Dropdown takes full width of its container."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-full max-w-md">
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              fullWidth
              placeholder="Select category..."
              classes={c.cascading}
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
          <CascadingDropdown
            options={categoryOptions}
            value={{}}
            onValueChange={() => {}}
            placeholder="Default (scrollable)"
            classes={c.cascading}
          />
          <CascadingDropdown
            options={categoryOptions}
            value={{}}
            onValueChange={() => {}}
            placeholder="lockScroll enabled"
            lockScroll
            classes={c.cascading}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Loading State (Parent) ─────────────────────────────────────── */}
      <Section
        title="Loading State (Parent)"
        description="Show a loading indicator in the main menu while options are fetched. Uses the loading prop and custom loadingText."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CascadingDropdown
            options={[]}
            value={{}}
            onValueChange={() => {}}
            loading
            loadingText="Fetching categories..."
            placeholder="Loading example..."
            classes={{
              ...c.cascading,
              loading: `px-4 py-8 text-center text-sm animate-pulse ${dark ? "text-gray-400" : "text-gray-500"}`,
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Shimmer Loading ──────────────────────────────────────────────── */}
      <Section
        title="Shimmer Loading (Custom Content)"
        description="Use loadingText with ReactNode to render a shimmer skeleton inside the menu."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CascadingDropdown
            options={[]}
            value={{}}
            onValueChange={() => {}}
            loading
            loadingText={
              <div className="space-y-2 p-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`h-4 rounded animate-pulse ${dark ? "bg-gray-700" : "bg-gray-200"}`}
                      style={{ width: `${50 + i * 12}%` }}
                    />
                    <div
                      className={`h-3 w-3 rounded-sm animate-pulse ${dark ? "bg-gray-700" : "bg-gray-200"}`}
                    />
                  </div>
                ))}
              </div>
            }
            placeholder="Shimmer loading..."
            classes={c.cascading}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Style Variants ────────────────────────────────────────────── */}
      <Section
        title="Style Variants"
        description="Different visual treatments for the trigger — borderless, bottom-border-only, ghost, and pill."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div>
            <p className={`mb-2 ${c.label}`}>Default (bordered)</p>
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              placeholder="Select..."
              classes={c.cascading}
            />
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Borderless</p>
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              placeholder="Select..."
              classes={{
                ...c.cascading,
                trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                  dark
                    ? "bg-white/[0.04] text-gray-200 hover:bg-white/[0.08]"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`,
              }}
            />
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Bottom border only</p>
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              placeholder="Select..."
              classes={{
                ...c.cascading,
                trigger: `flex items-center justify-between gap-2 w-full px-1 py-2 text-sm border-b-2 rounded-none transition-colors cursor-pointer ${
                  dark
                    ? "border-gray-600 text-gray-200 hover:border-indigo-400"
                    : "border-gray-200 text-gray-700 hover:border-indigo-500"
                }`,
              }}
            />
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Ghost</p>
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              placeholder="Select..."
              classes={{
                ...c.cascading,
                trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                  dark
                    ? "text-gray-300 hover:bg-white/60"
                    : "text-gray-600 hover:bg-gray-50"
                }`,
              }}
            />
          </div>
          <div>
            <p className={`mb-2 ${c.label}`}>Pill</p>
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              placeholder="Select..."
              classes={{
                ...c.cascading,
                trigger: `flex items-center justify-between gap-2 px-4 py-2 text-sm rounded-full border transition-colors cursor-pointer ${
                  dark
                    ? "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 shadow-sm"
                }`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Menu & Submenu Styling ────────────────────────────── */}
      <Section
        title="Custom Menu & Submenu Styling"
        description="Apply different visual styles to the main menu and submenus independently using class slots."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CascadingDropdown
            options={categoryOptions}
            value={{}}
            onValueChange={() => {}}
            placeholder="Styled menus..."
            classes={{
              ...c.cascading,
              menu: `rounded-xl shadow-2xl overflow-visible ${dark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-100 shadow-gray-200/60"}`,
              menuItem: `flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm ${dark ? "text-gray-200 hover:bg-indigo-900/30" : "hover:bg-indigo-50"}`,
              menuItemFocused: dark ? "bg-indigo-900/30" : "bg-indigo-50",
              submenu: `rounded-xl shadow-2xl ml-1 ${dark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-100 shadow-gray-200/60"}`,
              submenuItem: `flex items-center gap-2 px-4 py-2 cursor-pointer text-sm ${dark ? "text-gray-300 hover:bg-indigo-900/20" : "hover:bg-indigo-50"}`,
              submenuItemFocused: dark ? "bg-indigo-900/20" : "bg-indigo-50",
              checkbox: `w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${dark ? "border-indigo-500" : "border-indigo-400"}`,
              checkboxChecked: dark
                ? "bg-indigo-500 border-indigo-500"
                : "bg-indigo-600 border-indigo-600",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Compact Style ─────────────────────────────────────────────── */}
      <Section
        title="Compact Style"
        description="Smaller trigger and menu items for tight spaces like card footers or sidebars."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CascadingDropdown
            options={categoryOptions}
            value={{}}
            onValueChange={() => {}}
            placeholder="Compact..."
            classes={{
              ...c.cascading,
              trigger: `flex items-center justify-between gap-1.5 w-full px-2.5 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                dark
                  ? "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`,
              menu: `rounded-md shadow-lg overflow-visible ${dark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`,
              menuItem: `flex items-center justify-between px-2.5 py-1.5 cursor-pointer text-xs ${dark ? "text-gray-300 hover:bg-gray-700" : "hover:bg-gray-50"}`,
              menuItemFocused: dark ? "bg-gray-700" : "bg-gray-100",
              submenu: `rounded-md shadow-lg ml-0.5 ${dark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`,
              submenuItem: `flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer text-xs ${dark ? "text-gray-300 hover:bg-gray-700" : "hover:bg-gray-50"}`,
              submenuItemFocused: dark ? "bg-gray-700" : "bg-gray-100",
              chevron: "w-3 h-3",
              submenuChevron: "w-3 h-3",
              checkbox: `w-3.5 h-3.5 rounded border flex items-center justify-center ${dark ? "border-gray-500" : "border-gray-300"}`,
              checkboxChecked: dark
                ? "bg-blue-500 border-blue-500"
                : "bg-blue-600 border-blue-600",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── No Chevron & No Selected Icon ─────────────────────────────── */}
      <Section
        title="No Chevron & No Selected Icon"
        description="Hide the chevron indicator and selected check icon for a minimal look."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CascadingDropdown
            options={categoryOptions}
            value={{}}
            onValueChange={() => {}}
            placeholder="Minimal..."
            showChevron={false}
            showSelectedIcon={false}
            classes={c.cascading}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Custom Option Content ─────────────────────────────────────── */}
      <Section
        title="Custom Option Content"
        description="Use the content field on CascadingOption to render rich content in menu items — icons, badges, descriptions."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CascadingDropdown
            options={[
              {
                value: "design",
                label: "Design",
                content: (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Design</span>
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${dark ? "bg-purple-900/40 text-purple-300" : "bg-purple-100 text-purple-700"}`}
                    >
                      3 items
                    </span>
                  </div>
                ),
                selectionMode: "single",
                children: [
                  { value: "figma", label: "Figma" },
                  { value: "sketch", label: "Sketch" },
                  { value: "xd", label: "Adobe XD" },
                ],
              },
              {
                value: "engineering",
                label: "Engineering",
                content: (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Engineering</span>
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${dark ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                    >
                      4 items
                    </span>
                  </div>
                ),
                selectionMode: "multi",
                children: [
                  { value: "react", label: "React" },
                  { value: "vue", label: "Vue" },
                  { value: "angular", label: "Angular" },
                  { value: "svelte", label: "Svelte" },
                ],
              },
              {
                value: "marketing",
                label: "Marketing",
                content: (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Marketing</span>
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${dark ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      2 items
                    </span>
                  </div>
                ),
                selectionMode: "single",
                children: [
                  { value: "seo", label: "SEO" },
                  { value: "social", label: "Social Media" },
                ],
              },
            ]}
            value={{}}
            onValueChange={() => {}}
            placeholder="Select department..."
            classes={{
              ...c.cascading,
              menuItem: `flex items-center justify-between px-3 py-2.5 cursor-pointer text-sm ${dark ? "text-gray-200 hover:bg-gray-700" : "hover:bg-gray-50"}`,
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Fixed Size with Text Wrap ─────────────────────────────────── */}
      <Section
        title="Fixed Size with Text Wrap"
        description="Fixed-width parent menu and submenu with text wrapping. Long labels wrap instead of overflowing or truncating."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CascadingDropdown
            options={[
              {
                value: "frontend",
                label: "Frontend Development Frameworks & Libraries",
                selectionMode: "multi",
                children: [
                  {
                    value: "react",
                    label:
                      "React — A JavaScript library for building user interfaces",
                  },
                  {
                    value: "vue",
                    label: "Vue.js — The progressive JavaScript framework",
                  },
                  {
                    value: "angular",
                    label:
                      "Angular — Platform for building mobile and desktop web apps",
                  },
                  {
                    value: "svelte",
                    label:
                      "Svelte — Cybernetically enhanced web apps with zero runtime",
                  },
                ],
              },
              {
                value: "backend",
                label: "Backend & Server-Side Technologies",
                selectionMode: "multi",
                children: [
                  {
                    value: "node",
                    label:
                      "Node.js — JavaScript runtime built on Chrome's V8 engine",
                  },
                  {
                    value: "django",
                    label:
                      "Django — The web framework for perfectionists with deadlines",
                  },
                  {
                    value: "rails",
                    label:
                      "Ruby on Rails — Convention over configuration web framework",
                  },
                  {
                    value: "go",
                    label:
                      "Go (Golang) — Efficient, reliable, and fast compiled language by Google",
                  },
                ],
              },
              {
                value: "devops",
                label: "DevOps, CI/CD & Cloud Infrastructure",
                selectionMode: "single",
                children: [
                  {
                    value: "docker",
                    label:
                      "Docker — Build, ship, and run distributed applications",
                  },
                  {
                    value: "k8s",
                    label:
                      "Kubernetes — Production-grade container orchestration at scale",
                  },
                  {
                    value: "terraform",
                    label:
                      "Terraform — Infrastructure as code for multi-cloud provisioning",
                  },
                ],
              },
            ]}
            value={{}}
            onValueChange={() => {}}
            placeholder="Select technologies..."
            classes={{
              ...c.cascading,
              menu: `rounded-lg shadow-lg overflow-visible w-full max-w-[260px] ${
                dark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`,
              menuItem: `flex items-center justify-between px-3 py-2.5 cursor-pointer text-sm leading-snug ${
                dark ? "text-gray-200 hover:bg-gray-700" : "hover:bg-gray-50"
              }`,
              menuItemFocused: dark ? "bg-gray-700" : "bg-gray-100",
              submenu: `rounded-lg shadow-lg ml-1 w-full max-w-[280px] max-h-[260px] overflow-y-auto ${
                dark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`,
              submenuItem: `flex items-center gap-2 px-3 py-2.5 cursor-pointer text-sm leading-snug ${
                dark ? "text-gray-300 hover:bg-gray-700" : "hover:bg-gray-50"
              }`,
              submenuItemFocused: dark ? "bg-gray-700" : "bg-gray-100",
            }}
          />
        </DemoWrapper>
        <div className={c.note}>
          The parent menu is fixed at 260px and the submenu at 280px. The parent
          uses overflow-visible so submenus aren't clipped. The submenu has
          max-height with overflow-y-auto for scrolling long lists. Long labels
          wrap naturally using leading-snug.
        </div>
      </Section>

      {/* ─── Props ──────────────────────────────────────────────────────── */}
      <Section title="Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="options"
              type="CascadingOption[]"
              defaultVal="[]"
              description="Array of options with optional children"
              isDarkMode={dark}
            />
            <PropRow
              name="value"
              type="CascadingValue"
              description="Controlled value (object mapping parent to selected children)"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultValue"
              type="CascadingValue"
              defaultVal="{}"
              description="Initial value for uncontrolled mode"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(value, path) => void"
              description="Called when selection changes"
              isDarkMode={dark}
            />
            <PropRow
              name="onLoadChildren"
              type="(parent) => Promise<CascadingOption[]>"
              description="Async function to load children for a parent option"
              isDarkMode={dark}
            />
            <PropRow
              name="id"
              type="string"
              defaultVal="auto-generated"
              description="Unique identifier for the dropdown"
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
              defaultVal='"Select an option"'
              description="Placeholder text when no selection"
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
              description="Mark as required field (adds asterisk to label)"
              isDarkMode={dark}
            />
            <PropRow
              name="noResultsContent"
              type="ReactNode"
              defaultVal='"No options available"'
              description="Content shown when no options available"
              isDarkMode={dark}
            />
            <PropRow
              name="loadingText"
              type="string"
              defaultVal='"Loading..."'
              description="Text shown while loading options"
              isDarkMode={dark}
            />
            <PropRow
              name="loading"
              type="boolean"
              defaultVal="false"
              description="Show loading state for main menu"
              isDarkMode={dark}
            />
            <PropRow
              name="showChevron"
              type="boolean"
              defaultVal="true"
              description="Show/hide chevron in trigger button"
              isDarkMode={dark}
            />
            <PropRow
              name="showSelectedIcon"
              type="boolean"
              defaultVal="true"
              description="Show/hide selected icon in single-select mode"
              isDarkMode={dark}
            />
            <PropRow
              name="selectedIcon"
              type="ReactNode"
              description="Custom icon for selected items in single-select mode"
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
              description="Custom icon inside checkbox for multi-select mode"
              isDarkMode={dark}
            />
            <PropRow
              name="ClearIcon"
              type="ComponentType"
              description="Custom clear icon component"
              isDarkMode={dark}
            />
            <PropRow
              name="fullWidth"
              type="boolean"
              defaultVal="false"
              description="Make dropdown take full width of container"
              isDarkMode={dark}
            />
            <PropRow
              name="submenuPosition"
              type='"right" | "left"'
              defaultVal='"right"'
              description="Position of submenus relative to parent"
              isDarkMode={dark}
            />
            <PropRow
              name="closeOnSelect"
              type="boolean"
              defaultVal="true"
              description="Close dropdown after selection"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="CascadingDropdownClasses"
              description="Slot class overrides (22 slots)"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="Additional CSS class for the root element"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles for the root element"
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
              description="Lock body scroll when dropdown is open"
              isDarkMode={dark}
            />
            <PropRow
              name="portalContainer"
              type="HTMLElement | null"
              defaultVal="document.body"
              description="Portal target container for the dropdown menu"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownZIndex"
              type="number"
              defaultVal="50"
              description="z-index of the portal dropdown menu"
              isDarkMode={dark}
            />
            <PropRow
              name="aria-label"
              type="string"
              description="Accessible label for the dropdown"
              isDarkMode={dark}
            />
            <PropRow
              name="renderTrigger"
              type="(props) => ReactNode"
              description="Custom trigger renderer — receives ARIA props, isOpen, displayValue, and placeholder"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── CascadingOption Interface ──────────────────────────────────── */}
      <Section title="CascadingOption Interface" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="value"
              type="string"
              description="Unique identifier"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="string"
              description="Display text"
              isDarkMode={dark}
            />
            <PropRow
              name="content"
              type="ReactNode"
              description="Custom display content in menu"
              isDarkMode={dark}
            />
            <PropRow
              name="selectedContent"
              type="ReactNode"
              description="Custom content shown in trigger when selected"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              description="Disable this option"
              isDarkMode={dark}
            />
            <PropRow
              name="children"
              type="CascadingOption[]"
              description="Nested submenu options"
              isDarkMode={dark}
            />
            <PropRow
              name="selectionMode"
              type='"single" | "multi"'
              description="Selection mode for this submenu"
              isDarkMode={dark}
            />
            <PropRow
              name="hasChildren"
              type="boolean"
              description="Indicates this option has async children (use with onLoadChildren)"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── CascadingDropdownClasses Slots ─────────────────────────────── */}
      <Section title="CascadingDropdownClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Root container div"
              isDarkMode={dark}
            />
            <PropRow
              name="wrapper"
              type="string"
              description="Dropdown wrapper (relative positioned)"
              isDarkMode={dark}
            />
            <PropRow
              name="trigger"
              type="string"
              description="Trigger button"
              isDarkMode={dark}
            />
            <PropRow
              name="menu"
              type="string"
              description="Main dropdown menu container"
              isDarkMode={dark}
            />
            <PropRow
              name="menuItem"
              type="string"
              description="Main menu item styling"
              isDarkMode={dark}
            />
            <PropRow
              name="menuItemSelected"
              type="string"
              description="Additional class for selected main menu items"
              isDarkMode={dark}
            />
            <PropRow
              name="menuItemFocused"
              type="string"
              description="Additional class for focused main menu items"
              isDarkMode={dark}
            />
            <PropRow
              name="menuItemDisabled"
              type="string"
              description="Additional class for disabled main menu items"
              isDarkMode={dark}
            />
            <PropRow
              name="submenu"
              type="string"
              description="Submenu container (background, border, shadow)"
              isDarkMode={dark}
            />
            <PropRow
              name="submenuContainer"
              type="string"
              description="Submenu position wrapper (z-index, positioning)"
              isDarkMode={dark}
            />
            <PropRow
              name="submenuItem"
              type="string"
              description="Submenu item styling"
              isDarkMode={dark}
            />
            <PropRow
              name="submenuItemSelected"
              type="string"
              description="Additional class for selected submenu items"
              isDarkMode={dark}
            />
            <PropRow
              name="submenuItemFocused"
              type="string"
              description="Additional class for focused submenu items"
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
              description="Error message container"
              isDarkMode={dark}
            />
            <PropRow
              name="chevron"
              type="string"
              description="Main trigger chevron icon"
              isDarkMode={dark}
            />
            <PropRow
              name="submenuChevron"
              type="string"
              description="Submenu chevron icon on menu items"
              isDarkMode={dark}
            />
            <PropRow
              name="checkIcon"
              type="string"
              description="Check icon for single-select mode"
              isDarkMode={dark}
            />
            <PropRow
              name="checkbox"
              type="string"
              description="Checkbox container for multi-select (size, border, shape)"
              isDarkMode={dark}
            />
            <PropRow
              name="checkboxChecked"
              type="string"
              description="Additional class for checked checkbox (background, color)"
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
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
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
              name="data-has-submenu"
              type="option"
              description="Present on options that have child submenus"
              isDarkMode={dark}
            />
            <PropRow
              name="data-value"
              type="option"
              description="The option's value string"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ──────────────────────────────────────────────── */}
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
              "Uses combobox / listbox ARIA pattern with proper roles",
              'Menu items have role="option" with aria-selected state',
              "Submenus announced via aria-haspopup and aria-expanded",
              "Disabled items marked with aria-disabled",
              "Label auto-associated via id linking",
              "Error messages connected via aria-describedby",
              "Required state sets aria-required on the trigger",
              "Focus management follows WAI-ARIA combobox best practices",
              "Supports all standard keyboard navigation patterns",
              'Hidden <input type="hidden"> for native form participation when name is set',
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
              ["\u2191 / \u2193", "Navigate options"],
              ["\u2192", "Open submenu"],
              ["\u2190", "Close submenu"],
              ["Enter / Space", "Select option"],
              ["Escape", "Close dropdown / submenu"],
              ["Home / End", "Jump to first / last option"],
              ["Tab", "Close and move focus"],
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
        summary="Control `value` and `onValueChange` for the full path; load child options asynchronously and update the `options` tree from the parent. Keep `open` controlled when coordinating with other UI."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Failed child loads should surface errors without trapping focus in submenus.",
          "Deep trees need clear breadcrumbs or back affordances on small screens.",
          "RTL layouts must mirror submenu placement.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `label` or `aria-label` for the root trigger.",
          "Close submenus on Escape and restore sensible focus.",
          "Cache loaded branches to avoid redundant network calls.",
        ]}
        donts={[
          "Do not load unbounded children synchronously on main thread.",
          "Do not hide keyboard paths to leaf selections.",
          "Do not use duplicate values across sibling options.",
        ]}
      />
    </div>
  );
};

export default CascadingDropdownDemo;
