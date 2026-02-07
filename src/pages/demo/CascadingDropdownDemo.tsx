import { useState, useCallback, useEffect } from "react";
import { CascadingDropdown } from "../../components/CascadingDropdown";
import type {
  CascadingOption,
  CascadingValue,
} from "../../components/CascadingDropdown";
import { Section, ComponentHeader } from "./components";

interface CountryApiResponse {
  name: { common: string };
  flags: { png: string; svg: string };
  cca2: string;
  capital?: string[];
  region: string;
  subregion?: string;
}

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

const triggerStyle =
  "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const menuStyle =
  "absolute z-50 top-full left-0 mt-1 w-full min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg overflow-visible";
const menuItemStyle =
  "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 data-[focused]:bg-gray-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const menuItemFocusedStyle = "bg-gray-100";
const submenuStyle =
  "min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg ml-1";
const submenuItemStyle =
  "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 data-[focused]:bg-gray-100 data-[selected]:bg-blue-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const submenuItemSelectedStyle = "bg-blue-50";
const submenuItemFocusedStyle = "bg-gray-100";
const chevronStyle = "w-4 h-4 shrink-0 transition-transform duration-200";
const submenuChevronStyle = "w-4 h-4 shrink-0 text-gray-400";
const checkIconStyle = "w-4 h-4 shrink-0 text-blue-600";
const checkboxStyle =
  "w-4 h-4 shrink-0 border border-gray-300 rounded flex items-center justify-center";
const checkboxCheckedStyle = "bg-blue-600 border-blue-600 text-white";
const noResultsStyle = "px-3 py-4 text-sm text-gray-500 text-center";
const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
const errorStyle = "text-sm text-red-500 mt-1";

// Dark theme styles
const darkTriggerStyle =
  "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500";
const darkMenuStyle =
  "absolute z-50 top-full left-0 mt-1 w-full min-w-[200px] bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-visible";
const darkMenuItemStyle =
  "flex items-center justify-between px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const darkMenuItemFocusedStyle = "bg-gray-700";
const darkSubmenuStyle =
  "min-w-[180px] bg-gray-800 border border-gray-700 rounded-lg shadow-lg ml-1";
const darkSubmenuItemStyle =
  "flex items-center gap-2 px-3 py-2 cursor-pointer text-gray-200 hover:bg-gray-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const darkSubmenuItemSelectedStyle = "bg-gray-600";
const darkSubmenuItemFocusedStyle = "bg-gray-700";
const darkChevronStyle =
  "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400";
const darkSubmenuChevronStyle = "w-4 h-4 shrink-0 text-gray-500";
const darkCheckIconStyle = "w-4 h-4 shrink-0 text-blue-400";
const darkCheckboxStyle =
  "w-4 h-4 shrink-0 border border-gray-500 rounded flex items-center justify-center";
const darkCheckboxCheckedStyle = "bg-blue-500 border-blue-500 text-white";
const darkNoResultsStyle = "px-3 py-4 text-sm text-gray-400 text-center";

// Purple theme styles
const purpleTriggerStyle =
  "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-purple-300 rounded-lg bg-white hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";
const purpleMenuStyle =
  "absolute z-50 top-full left-0 mt-1 w-full min-w-[200px] bg-purple-50 border border-purple-200 rounded-lg shadow-lg overflow-visible";
const purpleMenuItemStyle =
  "flex items-center justify-between px-3 py-2 cursor-pointer text-purple-900 hover:bg-purple-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const purpleMenuItemFocusedStyle = "bg-purple-100";
const purpleSubmenuStyle =
  "min-w-[180px] bg-purple-50 border border-purple-200 rounded-lg shadow-lg ml-1";
const purpleSubmenuItemStyle =
  "flex items-center gap-2 px-3 py-2 cursor-pointer text-purple-900 hover:bg-purple-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const purpleSubmenuItemSelectedStyle = "bg-purple-200";
const purpleSubmenuItemFocusedStyle = "bg-purple-100";
const purpleChevronStyle =
  "w-4 h-4 shrink-0 transition-transform duration-200 text-purple-400";
const purpleSubmenuChevronStyle = "w-4 h-4 shrink-0 text-purple-400";
const purpleCheckIconStyle = "w-4 h-4 shrink-0 text-purple-600";
const purpleCheckboxStyle =
  "w-4 h-4 shrink-0 border border-purple-400 rounded flex items-center justify-center";
const purpleCheckboxCheckedStyle = "bg-purple-600 border-purple-600 text-white";
const purpleNoResultsStyle = "px-3 py-4 text-sm text-purple-500 text-center";

// Green rounded checkbox styles
const greenCheckboxStyle =
  "w-4 h-4 shrink-0 border border-gray-300 rounded-full flex items-center justify-center";
const greenCheckboxCheckedStyle =
  "bg-emerald-500 border-emerald-500 text-white";
const greenCheckIconStyle = "w-4 h-4 shrink-0 text-emerald-600";

// Orange square checkbox styles
const orangeCheckboxStyle =
  "w-5 h-5 shrink-0 border-2 border-orange-300 rounded-sm flex items-center justify-center";
const orangeCheckboxCheckedStyle = "bg-orange-500 border-orange-500 text-white";
const orangeCheckIconStyle = "w-4 h-4 shrink-0 text-orange-600";

// Amber star checkbox styles
const amberCheckboxStyle =
  "w-4 h-4 shrink-0 border border-amber-400 rounded flex items-center justify-center";
const amberCheckboxCheckedStyle = "bg-amber-500 border-amber-500 text-white";

const CascadingDropdownDemo = () => {
  const [basicValue, setBasicValue] = useState<CascadingValue>({});
  const [multiValue, setMultiValue] = useState<CascadingValue>({});
  const [mixedValue, setMixedValue] = useState<CascadingValue>({});
  const [simpleValue, setSimpleValue] = useState<CascadingValue>({});
  const [disabledValue, setDisabledValue] = useState<CascadingValue>({});
  const [labeledValue, setLabeledValue] = useState<CascadingValue>({});
  const [errorValue, setErrorValue] = useState<CascadingValue>({});
  const [leftPositionValue, setLeftPositionValue] = useState<CascadingValue>(
    {},
  );
  const [noCloseValue, setNoCloseValue] = useState<CascadingValue>({});
  const [asyncMultiValue, setAsyncMultiValue] = useState<CascadingValue>({});
  const [asyncSingleValue, setAsyncSingleValue] = useState<CascadingValue>({});

  const handleLoadChildren = useCallback(async (parent: CascadingOption) => {
    return loadCountriesForRegion(parent);
  }, []);
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

  // ========== Prefetch on Mount Demo State ==========
  const [prefetchValue, setPrefetchValue] = useState<CascadingValue>({});
  const [prefetchOptions, setPrefetchOptions] = useState<CascadingOption[]>([]);
  const [isPrefetchLoading, setIsPrefetchLoading] = useState(true);
  const [hasPrefetchLoaded, setHasPrefetchLoaded] = useState(false);

  // ========== Load on Open Demo State ==========
  const [loadOnOpenValue, setLoadOnOpenValue] = useState<CascadingValue>({});
  const [loadOnOpenOptions, setLoadOnOpenOptions] = useState<CascadingOption[]>([]);
  const [isLoadOnOpenLoading, setIsLoadOnOpenLoading] = useState(false);
  const [hasLoadOnOpenLoaded, setHasLoadOnOpenLoaded] = useState(false);
  const [loadOnOpenDropdownClicked, setLoadOnOpenDropdownClicked] = useState(false);

  // Helper function to fetch regions from API
  const fetchRegions = useCallback(async (): Promise<CascadingOption[]> => {
    // Simulate network delay for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=region",
    );
    const data: { region: string }[] = await response.json();

    // Get unique regions
    const uniqueRegions = [
      ...new Set(data.map((c) => c.region).filter(Boolean)),
    ].sort();

    return uniqueRegions.map((region) => ({
      value: region,
      label: region,
      hasChildren: true,
      selectionMode: "single" as const,
    }));
  }, []);

  // Prefetch on mount - loads immediately when component mounts
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

  // Load on open - triggered only when dropdown is clicked
  useEffect(() => {
    if (loadOnOpenDropdownClicked && !hasLoadOnOpenLoaded && !isLoadOnOpenLoading) {
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
  }, [loadOnOpenDropdownClicked, hasLoadOnOpenLoaded, isLoadOnOpenLoading, fetchRegions]);

  // Reset load on open demo
  const resetLoadOnOpenDemo = useCallback(() => {
    setHasLoadOnOpenLoaded(false);
    setLoadOnOpenOptions([]);
    setLoadOnOpenValue({});
    setLoadOnOpenDropdownClicked(false);
  }, []);

  // Load children (countries) for a region - shared by both demos
  const handleLoadChildrenAsync = useCallback(
    async (parent: CascadingOption) => {
      // Simulate network delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 500));
      return loadCountriesForRegion(parent);
    },
    [],
  );

  return (
    <>
      <ComponentHeader
        title="Cascading Dropdown"
        description="A nested dropdown component with support for submenus, single/multi-select modes, and keyboard navigation."
      />

      <Section title="Async Single-Select (Countries API)">
        <div className="w-96">
          <CascadingDropdown
            options={regionOptionsSingle}
            value={asyncSingleValue}
            onChange={(val) => setAsyncSingleValue(val)}
            onLoadChildren={handleLoadChildren}
            placeholder="Select region and country..."
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={`${submenuStyle} max-h-64 overflow-y-auto`}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
            loadingClassName="px-3 py-4 text-sm text-gray-500 text-center"
            loadingText="Loading countries..."
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Countries are loaded dynamically when hovering over a region.
          Single-select mode closes the menu after selection.
        </p>
        {Object.keys(asyncSingleValue).length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg w-full">
            <p className="text-xs font-medium text-gray-600 mb-1">
              Selected Value:
            </p>
            <pre className="text-xs text-gray-800 overflow-x-auto">
              {JSON.stringify(asyncSingleValue, null, 2)}
            </pre>
          </div>
        )}
      </Section>

      <Section title="Async Multi-Select (Countries API)">
        <div className="w-96">
          <CascadingDropdown
            options={regionOptionsMulti}
            value={asyncMultiValue}
            onChange={(val) => setAsyncMultiValue(val)}
            onLoadChildren={handleLoadChildren}
            placeholder="Select region and countries..."
            closeOnSelect={false}
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={`${submenuStyle} max-h-64 overflow-y-auto`}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            noResultsClassName={noResultsStyle}
            loadingClassName="px-3 py-4 text-sm text-gray-500 text-center"
            loadingText="Loading countries..."
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Countries are loaded dynamically from the REST Countries API when you
          hover over a region. Multi-select mode allows selecting multiple
          countries per region. Data is cached after first load.
        </p>
        {Object.keys(asyncMultiValue).length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg w-full">
            <p className="text-xs font-medium text-gray-600 mb-1">
              Selected Value:
            </p>
            <pre className="text-xs text-gray-800 overflow-x-auto">
              {JSON.stringify(asyncMultiValue, null, 2)}
            </pre>
          </div>
        )}
      </Section>

      <Section title="Fully Async - Prefetch on Mount">
        <div className="w-96">
          <CascadingDropdown
            options={prefetchOptions}
            value={prefetchValue}
            onChange={(val) => setPrefetchValue(val)}
            onLoadChildren={handleLoadChildrenAsync}
            placeholder="Select region and country..."
            loading={isPrefetchLoading}
            loadingText="Loading regions..."
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={`${submenuStyle} max-h-64 overflow-y-auto`}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
            loadingClassName="px-3 py-4 text-sm text-gray-500 text-center"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          <strong>Prefetch on mount:</strong> Main menu options (regions) are fetched
          immediately when the page loads. Countries are loaded when hovering over a region.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Main menu:{" "}
            {isPrefetchLoading
              ? "Loading..."
              : hasPrefetchLoaded
                ? `${prefetchOptions.length} regions loaded`
                : "Failed to load"}
          </span>
        </div>
        {Object.keys(prefetchValue).length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg w-full">
            <p className="text-xs font-medium text-gray-600 mb-1">
              Selected Value:
            </p>
            <pre className="text-xs text-gray-800 overflow-x-auto">
              {JSON.stringify(prefetchValue, null, 2)}
            </pre>
          </div>
        )}
      </Section>

      <Section title="Fully Async - Load on Open">
        <div className="w-96" onClick={() => setLoadOnOpenDropdownClicked(true)}>
          <CascadingDropdown
            options={loadOnOpenOptions}
            value={loadOnOpenValue}
            onChange={(val) => setLoadOnOpenValue(val)}
            onLoadChildren={handleLoadChildrenAsync}
            placeholder="Click to load regions..."
            loading={isLoadOnOpenLoading}
            loadingText="Loading regions..."
            noResultsText={hasLoadOnOpenLoaded ? "No regions found" : "Click to load regions"}
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={`${submenuStyle} max-h-64 overflow-y-auto`}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
            loadingClassName="px-3 py-4 text-sm text-gray-500 text-center"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          <strong>Load on open:</strong> Main menu options are fetched only when you click
          the dropdown. Open the Network tab before clicking to observe the API call.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-500">
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
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Reset
            </button>
          )}
        </div>
        {Object.keys(loadOnOpenValue).length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg w-full">
            <p className="text-xs font-medium text-gray-600 mb-1">
              Selected Value:
            </p>
            <pre className="text-xs text-gray-800 overflow-x-auto">
              {JSON.stringify(loadOnOpenValue, null, 2)}
            </pre>
          </div>
        )}
      </Section>

      <Section title="Single Select Submenus">
        <div className="w-72">
          <CascadingDropdown
            options={categoryOptions}
            value={basicValue}
            onChange={(val) => setBasicValue(val)}
            placeholder="Select category..."
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Hover over a category to reveal subcategories. Single-select mode
          closes after selection.
        </p>
      </Section>

      <Section title="Multi Select Submenus">
        <div className="w-72">
          <CascadingDropdown
            options={filterOptions}
            value={multiValue}
            onChange={(val) => setMultiValue(val)}
            placeholder="Select filters..."
            closeOnSelect={false}
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Multi-select mode with checkboxes. Dropdown stays open for multiple
          selections.
        </p>
      </Section>

      <Section title="Mixed Selection Modes">
        <div className="w-80">
          <CascadingDropdown
            options={mixedOptions}
            value={mixedValue}
            onChange={(val) => setMixedValue(val)}
            placeholder="Filter candidates..."
            closeOnSelect={false}
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            checkboxClassName={checkboxStyle}
            checkboxCheckedClassName={checkboxCheckedStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Different categories can have different selection modes (single vs
          multi).
        </p>
      </Section>

      <Section title="Simple Options with Nested">
        <div className="w-64">
          <CascadingDropdown
            options={simpleOptions}
            value={simpleValue}
            onChange={(val) => setSimpleValue(val)}
            placeholder="Select option..."
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Mix of flat options and nested submenus.
        </p>
      </Section>

      <Section title="With Label">
        <div className="w-72">
          <CascadingDropdown
            label="Product Category"
            options={categoryOptions}
            value={labeledValue}
            onChange={(val) => setLabeledValue(val)}
            placeholder="Select category..."
            labelClassName={labelStyle}
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Required Field">
        <div className="w-72">
          <CascadingDropdown
            label="Required Category"
            required
            options={categoryOptions}
            value={errorValue}
            onChange={(val) => setErrorValue(val)}
            placeholder="Select category..."
            error={Object.keys(errorValue).length === 0}
            errorMessage={
              Object.keys(errorValue).length === 0
                ? "Please select a category"
                : undefined
            }
            labelClassName={labelStyle}
            triggerClassName={`${triggerStyle} ${
              Object.keys(errorValue).length === 0
                ? "border-red-500 focus:ring-red-500"
                : ""
            }`}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
            errorClassName={errorStyle}
          />
        </div>
      </Section>

      <Section title="Disabled State">
        <div className="w-72">
          <CascadingDropdown
            options={categoryOptions}
            value={disabledDropdownValue}
            disabled
            placeholder="Select category..."
            triggerClassName={`${triggerStyle} opacity-50 cursor-not-allowed`}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            chevronClassName={chevronStyle}
          />
        </div>
      </Section>

      <Section title="Disabled Options">
        <div className="w-72">
          <CascadingDropdown
            options={disabledOptions}
            value={disabledValue}
            onChange={(val) => setDisabledValue(val)}
            placeholder="Select option..."
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Some categories and items are disabled.
        </p>
      </Section>

      <Section title="Submenu Position: Left">
        <div className="w-72">
          <CascadingDropdown
            options={categoryOptions}
            value={leftPositionValue}
            onChange={(val) => setLeftPositionValue(val)}
            placeholder="Select category..."
            submenuPosition="left"
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={`${submenuStyle} mr-1 ml-0`}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Submenu opens to the left of the parent menu, overlaying content with
          z-index.
        </p>
      </Section>

      <Section title="Keep Open on Select">
        <div className="w-72">
          <CascadingDropdown
            options={categoryOptions}
            value={noCloseValue}
            onChange={(val) => setNoCloseValue(val)}
            placeholder="Select categories..."
            closeOnSelect={false}
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Dropdown stays open after selection for continuous browsing.
        </p>
      </Section>

      <Section title="Uncontrolled with Default Value">
        <div className="w-72">
          <CascadingDropdown
            options={categoryOptions}
            defaultValue={uncontrolledDefaultValue}
            placeholder="Select category..."
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Uncontrolled mode with default value pre-selected.
        </p>
      </Section>

      <Section title="Dark Theme (Single Select)">
        <div className="w-72">
          <CascadingDropdown
            options={categoryOptions}
            value={darkThemeValue}
            onChange={(val) => setDarkThemeValue(val)}
            placeholder="Select category..."
            triggerClassName={darkTriggerStyle}
            menuClassName={darkMenuStyle}
            menuItemClassName={darkMenuItemStyle}
            menuItemFocusedClassName={darkMenuItemFocusedStyle}
            submenuClassName={darkSubmenuStyle}
            submenuItemClassName={darkSubmenuItemStyle}
            submenuItemSelectedClassName={darkSubmenuItemSelectedStyle}
            submenuItemFocusedClassName={darkSubmenuItemFocusedStyle}
            chevronClassName={darkChevronStyle}
            submenuChevronClassName={darkSubmenuChevronStyle}
            checkIconClassName={darkCheckIconStyle}
            noResultsClassName={darkNoResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Dark themed dropdown with custom background colors.
        </p>
      </Section>

      <Section title="Dark Theme (Multi Select)">
        <div className="w-72">
          <CascadingDropdown
            options={filterOptions}
            value={darkThemeMultiValue}
            onChange={(val) => setDarkThemeMultiValue(val)}
            placeholder="Select filters..."
            closeOnSelect={false}
            triggerClassName={darkTriggerStyle}
            menuClassName={darkMenuStyle}
            menuItemClassName={darkMenuItemStyle}
            menuItemFocusedClassName={darkMenuItemFocusedStyle}
            submenuClassName={darkSubmenuStyle}
            submenuItemClassName={darkSubmenuItemStyle}
            submenuItemSelectedClassName={darkSubmenuItemSelectedStyle}
            submenuItemFocusedClassName={darkSubmenuItemFocusedStyle}
            chevronClassName={darkChevronStyle}
            submenuChevronClassName={darkSubmenuChevronStyle}
            checkIconClassName={darkCheckIconStyle}
            checkboxClassName={darkCheckboxStyle}
            checkboxCheckedClassName={darkCheckboxCheckedStyle}
            noResultsClassName={darkNoResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Dark themed multi-select with custom checkbox colors.
        </p>
      </Section>

      <Section title="Purple Theme (Single Select)">
        <div className="w-72">
          <CascadingDropdown
            options={categoryOptions}
            value={purpleThemeValue}
            onChange={(val) => setPurpleThemeValue(val)}
            placeholder="Select category..."
            triggerClassName={purpleTriggerStyle}
            menuClassName={purpleMenuStyle}
            menuItemClassName={purpleMenuItemStyle}
            menuItemFocusedClassName={purpleMenuItemFocusedStyle}
            submenuClassName={purpleSubmenuStyle}
            submenuItemClassName={purpleSubmenuItemStyle}
            submenuItemSelectedClassName={purpleSubmenuItemSelectedStyle}
            submenuItemFocusedClassName={purpleSubmenuItemFocusedStyle}
            chevronClassName={purpleChevronStyle}
            submenuChevronClassName={purpleSubmenuChevronStyle}
            checkIconClassName={purpleCheckIconStyle}
            noResultsClassName={purpleNoResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Purple themed dropdown with matching colors.
        </p>
      </Section>

      <Section title="Purple Theme (Multi Select)">
        <div className="w-72">
          <CascadingDropdown
            options={filterOptions}
            value={purpleThemeMultiValue}
            onChange={(val) => setPurpleThemeMultiValue(val)}
            placeholder="Select filters..."
            closeOnSelect={false}
            triggerClassName={purpleTriggerStyle}
            menuClassName={purpleMenuStyle}
            menuItemClassName={purpleMenuItemStyle}
            menuItemFocusedClassName={purpleMenuItemFocusedStyle}
            submenuClassName={purpleSubmenuStyle}
            submenuItemClassName={purpleSubmenuItemStyle}
            submenuItemSelectedClassName={purpleSubmenuItemSelectedStyle}
            submenuItemFocusedClassName={purpleSubmenuItemFocusedStyle}
            chevronClassName={purpleChevronStyle}
            submenuChevronClassName={purpleSubmenuChevronStyle}
            checkIconClassName={purpleCheckIconStyle}
            checkboxClassName={purpleCheckboxStyle}
            checkboxCheckedClassName={purpleCheckboxCheckedStyle}
            noResultsClassName={purpleNoResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Purple themed multi-select with matching checkbox.
        </p>
      </Section>

      <Section title="Custom Checkbox - Green Rounded">
        <div className="w-72">
          <CascadingDropdown
            options={filterOptions}
            value={greenCheckboxValue}
            onChange={(val) => setGreenCheckboxValue(val)}
            placeholder="Select filters..."
            closeOnSelect={false}
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName="bg-emerald-50"
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={greenCheckIconStyle}
            checkboxClassName={greenCheckboxStyle}
            checkboxCheckedClassName={greenCheckboxCheckedStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Round checkbox with green checked state.
        </p>
      </Section>

      <Section title="Custom Checkbox - Orange Square">
        <div className="w-72">
          <CascadingDropdown
            options={filterOptions}
            value={orangeCheckboxValue}
            onChange={(val) => setOrangeCheckboxValue(val)}
            placeholder="Select filters..."
            closeOnSelect={false}
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName="bg-orange-50"
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={orangeCheckIconStyle}
            checkboxClassName={orangeCheckboxStyle}
            checkboxCheckedClassName={orangeCheckboxCheckedStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Larger square checkbox with orange checked state and thicker border.
        </p>
      </Section>

      <Section title="Custom Checkbox Icon">
        <div className="w-72">
          <CascadingDropdown
            options={filterOptions}
            value={customCheckboxIconValue}
            onChange={(val) => setCustomCheckboxIconValue(val)}
            placeholder="Select filters..."
            closeOnSelect={false}
            checkboxIcon={
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName="bg-amber-50"
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkboxClassName={amberCheckboxStyle}
            checkboxCheckedClassName={amberCheckboxCheckedStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Custom star icon instead of default checkmark for multi-select.
        </p>
      </Section>

      <Section title="Custom Selected Icon (Single Select)">
        <div className="w-72">
          <CascadingDropdown
            options={categoryOptions}
            value={customSelectedIconValue}
            onChange={(val) => setCustomSelectedIconValue(val)}
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
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName="bg-rose-50"
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Custom heart icon instead of default checkmark for single-select.
        </p>
      </Section>

      <Section title="Full Width">
        <div className="w-full max-w-md">
          <CascadingDropdown
            options={categoryOptions}
            value={{}}
            onChange={() => {}}
            fullWidth
            placeholder="Select category..."
            triggerClassName={triggerStyle}
            menuClassName={menuStyle}
            menuItemClassName={menuItemStyle}
            menuItemFocusedClassName={menuItemFocusedStyle}
            submenuClassName={submenuStyle}
            submenuItemClassName={submenuItemStyle}
            submenuItemSelectedClassName={submenuItemSelectedStyle}
            submenuItemFocusedClassName={submenuItemFocusedStyle}
            chevronClassName={chevronStyle}
            submenuChevronClassName={submenuChevronStyle}
            checkIconClassName={checkIconStyle}
            noResultsClassName={noResultsStyle}
          />
        </div>
      </Section>

      <Section title="Keyboard Navigation">
        <div className="p-4 bg-gray-50 rounded-lg w-full">
          <h3 className="font-medium text-gray-900 mb-2">Keyboard Shortcuts</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              <kbd className="px-1 bg-gray-200 rounded">↑</kbd> /{" "}
              <kbd className="px-1 bg-gray-200 rounded">↓</kbd> - Navigate
              options
            </li>
            <li>
              <kbd className="px-1 bg-gray-200 rounded">→</kbd> - Open submenu
            </li>
            <li>
              <kbd className="px-1 bg-gray-200 rounded">←</kbd> - Close submenu
            </li>
            <li>
              <kbd className="px-1 bg-gray-200 rounded">Enter</kbd> /{" "}
              <kbd className="px-1 bg-gray-200 rounded">Space</kbd> - Select
              option
            </li>
            <li>
              <kbd className="px-1 bg-gray-200 rounded">Escape</kbd> - Close
              dropdown/submenu
            </li>
            <li>
              <kbd className="px-1 bg-gray-200 rounded">Home</kbd> /{" "}
              <kbd className="px-1 bg-gray-200 rounded">End</kbd> - Jump to
              first/last option
            </li>
            <li>
              <kbd className="px-1 bg-gray-200 rounded">Tab</kbd> - Close and
              move focus
            </li>
          </ul>
        </div>
      </Section>

      <Section title="Props Reference">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">options</td>
                <td className="py-2 pr-4 text-gray-600">CascadingOption[]</td>
                <td className="py-2 pr-4 text-gray-500">[]</td>
                <td className="py-2 text-gray-600">
                  Array of options with optional children
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">value</td>
                <td className="py-2 pr-4 text-gray-600">CascadingValue</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Controlled value (object mapping parent to selected children)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  defaultValue
                </td>
                <td className="py-2 pr-4 text-gray-600">CascadingValue</td>
                <td className="py-2 pr-4 text-gray-500">{"{}"}</td>
                <td className="py-2 text-gray-600">
                  Initial value for uncontrolled mode
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onChange</td>
                <td className="py-2 pr-4 text-gray-600">
                  (value, path) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Called when selection changes
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  onLoadChildren
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (parent) =&gt; Promise&lt;CascadingOption[]&gt;
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Async function to load children for a parent option
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">auto-generated</td>
                <td className="py-2 text-gray-600">
                  Unique identifier for the dropdown
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">name</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Form field name</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  placeholder
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"Select an option"</td>
                <td className="py-2 text-gray-600">
                  Placeholder text when no selection
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Disable the dropdown</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">error</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Show error state</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  errorMessage
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Error message to display</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Label for the dropdown</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">required</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Mark as required field (adds asterisk to label)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  noResultsText
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">
                  "No options available"
                </td>
                <td className="py-2 text-gray-600">
                  Text shown when no options available
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  loadingText
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"Loading..."</td>
                <td className="py-2 text-gray-600">
                  Text shown while loading options
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">loading</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Show loading state for main menu
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fullWidth</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Make dropdown take full width of container
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  closeOnSelect
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Close dropdown after selection
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  submenuPosition
                </td>
                <td className="py-2 pr-4 text-gray-600">"right" | "left"</td>
                <td className="py-2 pr-4 text-gray-500">"right"</td>
                <td className="py-2 text-gray-600">
                  Position of submenus relative to parent
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="CascadingOption Interface">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Property
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">value</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Unique identifier</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Display text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">children</td>
                <td className="py-2 pr-4 text-gray-600">CascadingOption[]</td>
                <td className="py-2 text-gray-600">Nested submenu options</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  hasChildren
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 text-gray-600">
                  Indicates this option has async children (use with
                  onLoadChildren)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  selectionMode
                </td>
                <td className="py-2 pr-4 text-gray-600">"single" | "multi"</td>
                <td className="py-2 text-gray-600">
                  Selection mode for this submenu
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 text-gray-600">Disable this option</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">content</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 text-gray-600">
                  Custom display content in menu
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  selectedContent
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 text-gray-600">
                  Custom content shown in trigger when selected
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Styling Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 text-gray-600">
                  Dropdown wrapper (relative positioned)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  containerClassName
                </td>
                <td className="py-2 text-gray-600">Root container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  triggerClassName
                </td>
                <td className="py-2 text-gray-600">Trigger button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  menuClassName
                </td>
                <td className="py-2 text-gray-600">
                  Main dropdown menu container
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  menuItemClassName
                </td>
                <td className="py-2 text-gray-600">Main menu item styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  menuItemSelectedClassName
                </td>
                <td className="py-2 text-gray-600">
                  Additional class for selected main menu items
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  menuItemFocusedClassName
                </td>
                <td className="py-2 text-gray-600">
                  Additional class for focused main menu items
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  menuItemDisabledClassName
                </td>
                <td className="py-2 text-gray-600">
                  Additional class for disabled main menu items
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  submenuClassName
                </td>
                <td className="py-2 text-gray-600">
                  Submenu container (background, border, shadow)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  submenuContainerClassName
                </td>
                <td className="py-2 text-gray-600">
                  Submenu position wrapper (z-index, positioning)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  submenuItemClassName
                </td>
                <td className="py-2 text-gray-600">Submenu item styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  submenuItemSelectedClassName
                </td>
                <td className="py-2 text-gray-600">
                  Additional class for selected submenu items
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  submenuItemFocusedClassName
                </td>
                <td className="py-2 text-gray-600">
                  Additional class for focused submenu items
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  labelClassName
                </td>
                <td className="py-2 text-gray-600">Label element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  errorClassName
                </td>
                <td className="py-2 text-gray-600">Error message</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  chevronClassName
                </td>
                <td className="py-2 text-gray-600">
                  Main trigger chevron icon
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  submenuChevronClassName
                </td>
                <td className="py-2 text-gray-600">
                  Submenu chevron icon on menu items
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  checkIconClassName
                </td>
                <td className="py-2 text-gray-600">
                  Check icon for single-select mode
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  checkboxClassName
                </td>
                <td className="py-2 text-gray-600">
                  Checkbox container for multi-select (size, border, shape)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  checkboxCheckedClassName
                </td>
                <td className="py-2 text-gray-600">
                  Additional class for checked checkbox (background, color)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  noResultsClassName
                </td>
                <td className="py-2 text-gray-600">No results message</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  loadingClassName
                </td>
                <td className="py-2 text-gray-600">Loading message</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Custom Icon Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  selectedIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 text-gray-600">
                  Custom icon for selected items in single-select mode (replaces
                  default checkmark)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  checkboxIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 text-gray-600">
                  Custom icon inside checkbox for multi-select mode (replaces
                  default checkmark)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showSelectedIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 text-gray-600">
                  Show/hide selected icon in single-select mode (default: true)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showChevron
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 text-gray-600">
                  Show/hide chevron in trigger button (default: true)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default CascadingDropdownDemo;
