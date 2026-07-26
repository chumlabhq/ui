import { useState, useCallback, useEffect } from "react";
import { CascadingDropdown } from "../../components/CascadingDropdown";
import type {
  CascadingOption,
  CascadingValue,
  CascadingDropdownClasses,
} from "../../components/CascadingDropdown";
import { useTheme } from "./ThemeContext";
import {
  DocsHero,
  Section,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";
import {
  fetchCountries,
  fetchCountriesByRegion,
  searchCountries,
} from "./lib/countries";

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
  const data = await fetchCountriesByRegion(parent.value);

  return data
    .map((country) => ({
      value: country.code,
      label: country.name,
      content: (
        <span className="flex items-center gap-2">
          {/* Build the flag URL from our own S3 bucket using the ISO
              alpha-2 code. The REST Countries API's `flags.png` URL
              points at Wikimedia, which serves the post-2021 Taliban
              flag for Afghanistan and various other reskinned flags
              for other politically-contested codes — using our bucket
              keeps the flag set consistent with the rest of the UI. */}
          <img
            src={`https://chumflagscdn.s3.ap-south-1.amazonaws.com/flags/${country.code.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="w-5 h-4 object-cover rounded-cl-sm border border-cl-border"
          />
          <span className="truncate">{country.name}</span>
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

// ─── Searchable options (large list for search demos) ────────────────────────

const searchableCategoryOptions: CascadingOption[] = [
  {
    value: "electronics",
    label: "Electronics",
    selectionMode: "single" as const,
    children: [
      { value: "smartphones", label: "Smartphones" },
      { value: "laptops", label: "Laptops" },
      { value: "tablets", label: "Tablets" },
      { value: "headphones", label: "Headphones" },
      { value: "cameras", label: "Cameras" },
      { value: "speakers", label: "Speakers" },
      { value: "monitors", label: "Monitors" },
      { value: "keyboards", label: "Keyboards" },
      { value: "mice", label: "Mice" },
      { value: "printers", label: "Printers" },
    ],
  },
  {
    value: "clothing",
    label: "Clothing",
    selectionMode: "multi" as const,
    children: [
      { value: "shirts", label: "Shirts" },
      { value: "pants", label: "Pants" },
      { value: "dresses", label: "Dresses" },
      { value: "jackets", label: "Jackets" },
      { value: "shoes", label: "Shoes" },
      { value: "hats", label: "Hats" },
      { value: "socks", label: "Socks" },
      { value: "scarves", label: "Scarves" },
      { value: "belts", label: "Belts" },
      { value: "gloves", label: "Gloves" },
    ],
  },
  {
    value: "home",
    label: "Home & Garden",
    selectionMode: "single" as const,
    children: [
      { value: "furniture", label: "Furniture" },
      { value: "lighting", label: "Lighting" },
      { value: "rugs", label: "Rugs" },
      { value: "curtains", label: "Curtains" },
      { value: "bedding", label: "Bedding" },
      { value: "kitchenware", label: "Kitchenware" },
      { value: "gardening", label: "Gardening Tools" },
      { value: "plants", label: "Plants" },
    ],
  },
  {
    value: "sports",
    label: "Sports & Outdoors",
    selectionMode: "multi" as const,
    children: [
      { value: "running", label: "Running" },
      { value: "cycling", label: "Cycling" },
      { value: "swimming", label: "Swimming" },
      { value: "yoga", label: "Yoga" },
      { value: "camping", label: "Camping" },
      { value: "hiking", label: "Hiking" },
      { value: "fishing", label: "Fishing" },
      { value: "basketball", label: "Basketball" },
    ],
  },
  {
    value: "books",
    label: "Books",
    selectionMode: "single" as const,
    children: [
      { value: "fiction", label: "Fiction" },
      { value: "non-fiction", label: "Non-Fiction" },
      { value: "science", label: "Science" },
      { value: "history", label: "History" },
      { value: "biography", label: "Biography" },
      { value: "poetry", label: "Poetry" },
      { value: "comics", label: "Comics & Manga" },
    ],
  },
];

/** Async search: fetches regions from REST Countries API matching the query */
/** Async search: fetches all countries matching the query, groups by region */
const asyncSearchRegions = async (
  query: string,
): Promise<CascadingOption[]> => {
  const data = await searchCountries(query);
  // Return unique regions that have matching countries
  const regionSet = new Set(data.map((c) => c.region).filter(Boolean));
  return Array.from(regionSet)
    .sort()
    .map((r) => ({
      value: r,
      label: `${r} (${data.filter((c) => c.region === r).length} matches)`,
      hasChildren: true,
      selectionMode: "multi" as const,
    }));
};

/** Async search: fetches countries in a region matching the query from REST Countries API */
const asyncSearchCountries = async (
  query: string,
  parent: CascadingOption,
): Promise<CascadingOption[]> => {
  const data = await fetchCountriesByRegion(parent.value);
  const q = query.toLowerCase();
  return data
    .filter((c) => c.name.toLowerCase().includes(q))
    .map((country) => ({
      value: country.code,
      label: country.name,
      content: (
        <span className="flex items-center gap-2">
          {/* Build the flag URL from our own S3 bucket using the ISO
              alpha-2 code. The REST Countries API's `flags.png` URL
              points at Wikimedia, which serves the post-2021 Taliban
              flag for Afghanistan and various other reskinned flags
              for other politically-contested codes — using our bucket
              keeps the flag set consistent with the rest of the UI. */}
          <img
            src={`https://chumflagscdn.s3.ap-south-1.amazonaws.com/flags/${country.code.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="w-5 h-4 object-cover rounded-cl-sm border border-cl-border"
          />
          <span className="truncate">{country.name}</span>
        </span>
      ),
    }));
};

// ─── Themed Classes ─────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  cascading: {
    root: "",
    wrapper: "",
 trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
 menu: `rounded-cl-md shadow-lg overflow-visible bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
    menuItem: `flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-black/5 data-[focused]:bg-black/5 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed dark:text-cl-text dark:hover:bg-white/10 dark:data-[focused]:bg-white/10 dark:data-[disabled]:opacity-50 dark:data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md`,
    menuItemSelected: "",
    menuItemFocused: dark ? "bg-white/10" : "bg-black/5",
    menuItemDisabled: "opacity-50 cursor-not-allowed",
 submenu: `min-w-[180px] rounded-cl-md shadow-lg ml-1 bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
    submenuContainer: "",
    submenuItem: `flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-black/5 data-[focused]:bg-black/5 data-[selected]:bg-cl-accent/10 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed dark:text-cl-text dark:hover:bg-white/10 dark:data-[focused]:bg-white/10 dark:data-[selected]:bg-cl-accent/50 dark:data-[disabled]:opacity-50 dark:data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md`,
    submenuItemSelected: dark ? "bg-cl-accent/50 font-medium" : "bg-cl-accent/10 font-medium",
    submenuItemFocused: dark ? "bg-white/10" : "bg-black/5",
    label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
    error: `text-sm mt-1 text-cl-error`,
    chevron: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-secondary`,
    submenuChevron: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
    checkIcon: `w-4 h-4 shrink-0 text-cl-accent`,
    checkbox: `w-4 h-4 shrink-0 border rounded flex items-center justify-center border-cl-border-input dark:border dark:border-cl-border`,
    checkboxChecked: dark
      ? "bg-cl-accent border-cl-border-input-focus text-white"
      : "bg-cl-accent border-cl-border-input-focus text-white",
    noResults: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
    loading: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
  } satisfies CascadingDropdownClasses,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
  valueBox: `mt-3 p-3 rounded-cl-md w-full bg-cl-bg-hover dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
  valueLabel: `text-xs font-medium mb-1 text-cl-text-secondary`,
  valuePre: `text-xs overflow-x-auto text-cl-text dark:text-cl-text-secondary`,
  statusText: `text-xs text-cl-text-secondary`,
  descText: `text-sm mt-2 w-full text-cl-text-secondary`,
});

// ─── Blue Theme Variant ─────────────────────────────────────────────────────
//
// Brand-blue cascade. Menu/submenu surfaces sit on bg-cl-bg-elevated so
// they're fully opaque (the previous bg-cl-accent/10 was so transparent
// the page underneath bled through). The accent shows up only on the
// trigger pill, the focus ring, the chevrons, and the selected highlight.

const getBlueClasses = (_dark: boolean): CascadingDropdownClasses => ({
  trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-cl-accent border-cl-accent bg-cl-accent/10 text-cl-accent hover:bg-cl-accent/15`,
  menu: `rounded-cl-md shadow-cl-md bg-cl-bg-elevated border border-cl-accent`,
  menuItem: `flex items-center justify-between px-3 py-2 cursor-pointer text-cl-text hover:bg-cl-accent/10 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md`,
  menuItemSelected: `bg-cl-accent/15 text-cl-accent font-medium`,
  menuItemFocused: `bg-cl-accent/10`,
  submenu: `min-w-[180px] rounded-cl-md shadow-cl-md ml-1 max-h-[320px] overflow-y-auto bg-cl-bg-elevated border border-cl-accent`,
  submenuItem: `flex items-center gap-2 px-3 py-2 cursor-pointer text-cl-text hover:bg-cl-accent/10 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md`,
  submenuItemSelected: `bg-cl-accent/15 text-cl-accent font-medium`,
  submenuItemFocused: `bg-cl-accent/10`,
  chevron: `w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent`,
  submenuChevron: `w-4 h-4 shrink-0 text-cl-accent`,
  checkIcon: `w-4 h-4 shrink-0 text-cl-on-accent`,
  checkbox: `w-4 h-4 shrink-0 border rounded-cl-sm flex items-center justify-center border-cl-accent`,
  checkboxChecked: `bg-cl-accent border-cl-accent text-cl-on-accent`,
  noResults: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
});

// Backwards-compat alias — the demo still references getPurpleClasses by name
// in a few spots. Re-export under both names so we don't have to rewrite
// every call site.
const getPurpleClasses = getBlueClasses;

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

  // Search demos
  const [syncSearchValue, setSyncSearchValue] = useState<CascadingValue>({});
  const [asyncSearchValue, setAsyncSearchValue] = useState<CascadingValue>({});
  const [styledSearchValue1, setStyledSearchValue1] = useState<CascadingValue>({});
  const [styledSearchValue2, setStyledSearchValue2] = useState<CascadingValue>({});

  const handleLoadChildren = useCallback(async (parent: CascadingOption) => {
    return loadCountriesForRegion(parent);
  }, []);

  const fetchRegions = useCallback(async (): Promise<CascadingOption[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = await fetchCountries();
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
  // Renamed from "darkOnly" — the demo originally hard-coded text-white
  // and dropped the bare `border` width keyword, which broke it in light
  // mode (white text on cream paper, no visible card border). Switched
  // to brand tokens so the override theme-tracks correctly. Surfaces use
  // bg-cl-bg-elevated (off-white in light, near-black in dark) and the
  // bordered container reads in both modes.
  const themedSurfaceClasses: CascadingDropdownClasses = {
    trigger:
      "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border border-cl-border rounded-cl-md bg-cl-bg-elevated text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent",
    menu: "bg-cl-bg-elevated border border-cl-border rounded-cl-md shadow-cl-md overflow-visible",
    menuItem:
      "flex items-center justify-between px-3 py-2 cursor-pointer text-cl-text hover:bg-cl-bg-hover data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
    menuItemFocused: "bg-cl-bg-hover",
    submenu:
      "min-w-[180px] bg-cl-bg-elevated border border-cl-border rounded-cl-md shadow-cl-md ml-1",
    submenuItem:
      "flex items-center gap-2 px-3 py-2 cursor-pointer text-cl-text hover:bg-cl-bg-hover data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed first:rounded-t-cl-md last:rounded-b-cl-md",
    submenuItemSelected: "bg-cl-accent/15 text-cl-accent font-medium",
    submenuItemFocused: "bg-cl-bg-hover",
    chevron: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
    submenuChevron: "w-4 h-4 shrink-0 text-cl-text-tertiary",
    checkIcon: "w-4 h-4 shrink-0 text-cl-on-accent",
    checkbox:
      "w-4 h-4 shrink-0 border border-cl-border-input rounded-cl-sm flex items-center justify-center",
    checkboxChecked: "bg-cl-accent border-cl-accent text-cl-on-accent",
    noResults: "px-3 py-4 text-sm text-cl-text-tertiary text-center",
  };
  // Back-compat: existing call sites use `darkOnlyClasses`.
  const darkOnlyClasses = themedSurfaceClasses;

  return (
    <div className="space-y-10">
      <DocsHero
        title="Cascading Dropdown"
        description="A nested dropdown component with support for submenus, single/multi-select modes, async loading of children, custom icons, and full keyboard navigation."
        code={`import { CascadingDropdown } from "@chumlab/ui/cascading-dropdown";`}
      />

      {/* ─── Basic Usage ─────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="A simple cascading dropdown with static nested options."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-full sm:max-w-96">
            {/* Basic usage — works out-of-the-box with built-in styles */}
            <CascadingDropdown
              options={categoryOptions}
              value={basicValue}
              onValueChange={(val) => setBasicValue(val)}
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
          <div className="w-full sm:max-w-96">
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
          <div className="w-full sm:max-w-96">
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
          <div className="w-full sm:max-w-96">
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
            className="w-full sm:max-w-96"
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
                className={`text-xs underline text-cl-accent hover:text-cl-text`}
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
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-80">
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
          <div className="w-full sm:max-w-64">
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
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-72">
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
                    ? "border border-cl-success focus:ring-cl-success"
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
          <div className="w-full sm:max-w-72">
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
                    ? "border border-cl-error focus:ring-cl-error"
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
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-72">
            <CascadingDropdown
              options={categoryOptions}
              defaultValue={uncontrolledDefaultValue}
              placeholder="Select category..."
              classes={c.cascading}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Client-Side Search ─────────────────────────────────────────── */}
      <Section
        title="Client-Side Search"
        description="Instant filtering in both menu and submenu. No server call — options are filtered by label match."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-full sm:max-w-96">
            <CascadingDropdown
              options={searchableCategoryOptions}
              value={syncSearchValue}
              onValueChange={(val) => setSyncSearchValue(val)}
              placeholder="Search categories & items..."
              showMenuSearch
              showSubmenuSearch
              menuSearchPlaceholder="Filter categories..."
              submenuSearchPlaceholder="Filter items..."
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Async Server-Side Search ─────────────────────────────────────── */}
      <Section
        title="Async Server-Side Search (Debounced)"
        description="Both menu and submenu call the REST Countries API with 300ms debounce. Menu searches countries by name and groups matching regions. Submenu fetches and filters countries within a region. Static initial options are shown before the user types."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-full sm:max-w-96">
            <CascadingDropdown
              options={regionOptionsMulti}
              value={asyncSearchValue}
              onValueChange={(val) => setAsyncSearchValue(val)}
              onLoadChildren={loadCountriesForRegion}
              placeholder="Search regions & countries..."
              showMenuSearch
              showSubmenuSearch
              menuSearchPlaceholder="Search regions..."
              submenuSearchPlaceholder="Search countries..."
              onMenuSearch={asyncSearchRegions}
              onSubmenuSearch={asyncSearchCountries}
              searchDebounceMs={300}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Search Styling: Teal (Different Menu vs Submenu) ──────── */}
      <Section
        title="Custom Search Styling: Teal"
        description="Menu uses a teal border-bottom search bar with large icon. Submenu uses a compact teal pill-style input — demonstrating independent styling via submenuSearchInput/submenuSearchInputElement/submenuSearchIcon slots."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-full sm:max-w-96">
            <CascadingDropdown
              options={searchableCategoryOptions}
              value={styledSearchValue1}
              onValueChange={(val) => setStyledSearchValue1(val)}
              placeholder="Teal search theme..."
              showMenuSearch
              showSubmenuSearch
              menuSearchPlaceholder="Search categories..."
              submenuSearchPlaceholder="Filter items..."
              SearchIcon={({ className }) => (
                <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              classes={{
                // Menu search: full-width border-bottom style
                searchInput: `flex items-center gap-2 px-3 py-2.5 border-b-2 border border-cl-border-input-focus bg-cl-accent/30 dark:border dark:border-cl-border-input-focus dark:bg-cl-bg-elevated/50`,
                searchInputElement: `flex-1 bg-transparent text-sm focus:outline-none text-cl-text placeholder-teal-500/50 dark:text-white dark:placeholder-teal-400/60`,
                searchIcon: `w-5 h-5 shrink-0 text-cl-accent dark:text-cl-accent`,
                // Submenu search: compact pill style
                submenuSearchInput: `flex items-center gap-1.5 mx-2 my-1.5 px-2.5 py-1 rounded-full bg-cl-accent/10 ring-1 ring-cl-accent dark:bg-cl-accent/30 dark:ring-1 dark:ring-cl-accent/20`,
                submenuSearchInputElement: `flex-1 bg-transparent text-xs focus:outline-none text-cl-accent placeholder-teal-500/60 dark:text-cl-accent dark:placeholder-teal-400/50`,
                submenuSearchIcon: `w-3 h-3 shrink-0 text-cl-accent dark:text-cl-accent/70`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Search Styling: Purple with Filter Icon ───────────────── */}
      <Section
        title="Custom Search Styling: Purple with Filter Icon"
        description="Menu uses a wide purple search bar. Submenu uses a different icon (filter) and a compact underline style — each panel is fully independent."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-full sm:max-w-96">
            <CascadingDropdown
              options={searchableCategoryOptions}
              value={styledSearchValue2}
              onValueChange={(val) => setStyledSearchValue2(val)}
              placeholder="Purple search theme..."
              showMenuSearch
              showSubmenuSearch
              menuSearchPlaceholder="Search categories..."
              submenuSearchPlaceholder="Filter items..."
              SearchIcon={({ className }) => (
                <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              classes={{
                // Menu search: full-width purple background
                searchInput: `flex items-center gap-2 px-3 py-2.5 bg-cl-accent/10 border-b border-cl-border-input-focus dark:bg-cl-accent/30 dark:border-b dark:border dark:border-cl-border-input-focus/30`,
                searchInputElement: `flex-1 bg-transparent text-sm focus:outline-none text-cl-accent placeholder-purple-400 dark:text-cl-accent dark:placeholder-purple-400/60`,
                searchIcon: `w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent`,
                // Submenu search: compact underline style with filter icon
                submenuSearchInput: `flex items-center gap-1.5 mx-2 mt-1.5 mb-1 px-1 py-1 border-b border-cl-border-input-focus dark:border dark:border-cl-border-input-focus/30`,
                submenuSearchInputElement: `flex-1 bg-transparent text-xs focus:outline-none text-cl-accent placeholder-purple-400/70 dark:text-cl-accent dark:placeholder-purple-400/50`,
                submenuSearchIcon: `w-3 h-3 shrink-0 text-cl-accent dark:text-cl-accent/60`,
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Elevated Surface (Single Select) ───────────────────────────── */}
      <Section
        title="Elevated Surface (Single Select)"
        description="Custom-styled dropdown sitting on the elevated surface token — adapts to both light and dark modes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
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

      {/* ─── Elevated Surface (Multi Select) ────────────────────────────── */}
      <Section
        title="Elevated Surface (Multi Select)"
        description="Custom-styled multi-select with brand-coloured checkboxes — adapts to both light and dark modes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
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

      {/* ─── Blue Theme (Single Select) ───────────────────────────────── */}
      <Section
        title="Blue Theme (Single Select)"
        description="Blue-accent themed dropdown with matching colors."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
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

      {/* ─── Blue Theme (Multi Select) ────────────────────────────────── */}
      <Section
        title="Blue Theme (Multi Select)"
        description="Blue-accent themed multi-select with matching checkbox."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-72">
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
          <div className="w-full sm:max-w-72">
            <CascadingDropdown
              options={filterOptions}
              value={greenCheckboxValue}
              onValueChange={(val) => setGreenCheckboxValue(val)}
              placeholder="Select filters..."
              closeOnSelect={false}
              classes={{
                ...c.cascading,
                submenuItemSelected: "bg-cl-success/15",
                checkIcon: "w-4 h-4 shrink-0 text-cl-success",
                checkbox:
                  "w-4 h-4 shrink-0 border border-cl-border-input rounded-full flex items-center justify-center",
                checkboxChecked: "bg-cl-success border-cl-success text-white",
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
          <div className="w-full sm:max-w-72">
            <CascadingDropdown
              options={filterOptions}
              value={orangeCheckboxValue}
              onValueChange={(val) => setOrangeCheckboxValue(val)}
              placeholder="Select filters..."
              closeOnSelect={false}
              classes={{
                ...c.cascading,
                submenuItemSelected: "bg-cl-warning/15",
                checkIcon: "w-4 h-4 shrink-0 text-cl-warning",
                checkbox:
                  "w-5 h-5 shrink-0 border-2 border-cl-warning rounded-cl-sm flex items-center justify-center",
                checkboxChecked: "bg-cl-warning border-cl-warning text-white",
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
          <div className="w-full sm:max-w-72">
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
                submenuItemSelected: "bg-cl-warning/15",
                checkbox:
                  "w-4 h-4 shrink-0 border border-cl-warning rounded flex items-center justify-center",
                checkboxChecked: "bg-cl-warning border-cl-warning text-white",
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
          <div className="w-full sm:max-w-72">
            <CascadingDropdown
              options={categoryOptions}
              value={customSelectedIconValue}
              onValueChange={(val) => setCustomSelectedIconValue(val)}
              placeholder="Select category..."
              selectedIcon={
                <svg
                  className="w-4 h-4 text-cl-accent"
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
                submenuItemSelected: "bg-cl-accent/10",
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
          {/* No max-width cap on the wrapper — the dropdown spans the full
              width of the demo card. */}
          <div className="w-full">
            <CascadingDropdown
              options={categoryOptions}
              value={basicValue}
              onValueChange={(val) => setBasicValue(val)}
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
              loading: `px-4 py-8 text-center text-sm animate-pulse text-cl-text-secondary`,
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
              <div className="space-y-3 p-3">
                {/* Skeleton bars sit on top of the menu surface, so they need
                    a contrasting tint — bg-cl-bg-elevated would be invisible
                    against the menu's own bg-cl-bg-elevated background. */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="h-4 rounded-cl-sm animate-pulse bg-cl-text/10"
                      style={{ width: `${50 + i * 12}%` }}
                    />
                    <div className="h-3 w-3 rounded-cl-sm animate-pulse bg-cl-text/10 shrink-0" />
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
          <div className="w-full sm:max-w-64">
            <p className={`mb-2 ${c.label}`}>Default (bordered)</p>
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              placeholder="Select..."
              classes={c.cascading}
            />
          </div>
          <div className="w-full sm:max-w-64">
            <p className={`mb-2 ${c.label}`}>Borderless</p>
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              placeholder="Select..."
              classes={{
                ...c.cascading,
                trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover dark:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-bg-hover`,
              }}
            />
          </div>
          <div className="w-full sm:max-w-64">
            <p className={`mb-2 ${c.label}`}>Bottom border only</p>
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              placeholder="Select..."
              classes={{
                ...c.cascading,
                trigger: `flex items-center justify-between gap-2 w-full px-1 py-2 text-sm border-b-2 rounded-none transition-colors cursor-pointer border border-cl-border text-cl-text hover:border-cl-border-input-focus dark:border dark:border-cl-border dark:text-cl-text dark:hover:border-cl-border-input-focus`,
              }}
            />
          </div>
          <div className="w-full sm:max-w-64">
            <p className={`mb-2 ${c.label}`}>Ghost</p>
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              placeholder="Select..."
              classes={{
                ...c.cascading,
                trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer text-cl-text-secondary hover:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-text/60`,
              }}
            />
          </div>
          <div className="w-full sm:max-w-64">
            <p className={`mb-2 ${c.label}`}>Pill</p>
            <CascadingDropdown
              options={categoryOptions}
              value={{}}
              onValueChange={() => {}}
              placeholder="Select..."
              classes={{
                ...c.cascading,
 trigger: `flex items-center justify-between gap-2 w-full px-4 py-2 text-sm rounded-full transition-colors cursor-pointer border border-cl-border bg-white text-cl-text hover:border-cl-border-input shadow-sm dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:border-cl-border`,
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
              menu: `rounded-cl-lg shadow-2xl overflow-visible bg-white border border-cl-border shadow-black/60 dark:bg-cl-bg dark:border dark:border-cl-border`,
              menuItem: `flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm hover:bg-cl-accent/10 dark:text-cl-text dark:hover:bg-cl-accent/30 first:rounded-t-cl-lg last:rounded-b-cl-lg`,
              menuItemFocused: dark ? "bg-cl-accent/30" : "bg-cl-accent/10",
              submenu: `rounded-cl-lg shadow-2xl ml-1 bg-white border border-cl-border shadow-black/60 dark:bg-cl-bg dark:border dark:border-cl-border`,
              submenuItem: `flex items-center gap-2 px-4 py-2 cursor-pointer text-sm hover:bg-cl-accent/10 dark:text-cl-text-secondary dark:hover:bg-cl-accent/20 first:rounded-t-cl-lg last:rounded-b-cl-lg`,
              submenuItemFocused: dark ? "bg-cl-accent/20" : "bg-cl-accent/10",
              checkbox: `w-4 h-4 rounded-cl-md border-2 flex items-center justify-center transition-colors border-cl-border-input-focus dark:border dark:border-cl-border-input-focus`,
              checkboxChecked: dark
                ? "bg-cl-accent border-cl-border-input-focus"
                : "bg-cl-accent border-cl-border-input-focus",
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
 trigger: `flex items-center justify-between gap-1.5 w-full px-2.5 py-1.5 text-xs rounded-cl-md transition-colors cursor-pointer border border-cl-border bg-white text-cl-text hover:border-cl-border-input dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text-secondary dark:hover:border-cl-border`,
 menu: `rounded-cl-md shadow-lg overflow-visible bg-cl-bg-elevated border border-cl-border`,
              menuItem: `flex items-center justify-between px-2.5 py-1.5 cursor-pointer text-xs hover:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-bg-elevated first:rounded-t-cl-md last:rounded-b-cl-md`,
              menuItemFocused: dark ? "bg-cl-bg-elevated" : "bg-cl-bg-hover",
 submenu: `rounded-cl-md shadow-lg ml-0.5 bg-cl-bg-elevated border border-cl-border`,
              submenuItem: `flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer text-xs hover:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-bg-elevated first:rounded-t-cl-md last:rounded-b-cl-md`,
              submenuItemFocused: dark ? "bg-cl-bg-elevated" : "bg-cl-bg-hover",
              chevron: "w-3 h-3",
              submenuChevron: "w-3 h-3",
              checkbox: `w-3.5 h-3.5 rounded border flex items-center justify-center border-cl-border-input`,
              checkboxChecked: dark
                ? "bg-cl-accent border-cl-border-input-focus"
                : "bg-cl-accent border-cl-border-input-focus",
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
                    <span className="w-2 h-2 rounded-full bg-cl-accent" />
                    <span>Design</span>
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/40 dark:text-cl-accent`}
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
                    <span className="w-2 h-2 rounded-full bg-cl-accent" />
                    <span>Engineering</span>
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/40 dark:text-cl-accent`}
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
                    <span className="w-2 h-2 rounded-full bg-cl-success" />
                    <span>Marketing</span>
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-cl-success/15 text-cl-success dark:bg-cl-success/40 dark:text-cl-success`}
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
              menuItem: `flex items-center justify-between px-3 py-2.5 cursor-pointer text-sm hover:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-bg-elevated first:rounded-t-cl-md last:rounded-b-cl-md`,
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
 menu: `rounded-cl-md shadow-lg overflow-visible w-full max-w-[260px] bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
              menuItem: `flex items-center justify-between px-3 py-2.5 cursor-pointer text-sm leading-snug hover:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-bg-elevated first:rounded-t-cl-md last:rounded-b-cl-md`,
              menuItemFocused: dark ? "bg-cl-bg-elevated" : "bg-cl-bg-hover",
 submenu: `rounded-cl-md shadow-lg ml-1 w-full max-w-[280px] max-h-[260px] overflow-y-auto bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
              submenuItem: `flex items-center gap-2 px-3 py-2.5 cursor-pointer text-sm leading-snug hover:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-bg-elevated first:rounded-t-cl-md last:rounded-b-cl-md`,
              submenuItemFocused: dark ? "bg-cl-bg-elevated" : "bg-cl-bg-hover",
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
              name="showMenuSearch"
              type="boolean"
              defaultVal="false"
              description="Show search input in the main menu"
              isDarkMode={dark}
            />
            <PropRow
              name="showSubmenuSearch"
              type="boolean"
              defaultVal="false"
              description="Show search input in submenus"
              isDarkMode={dark}
            />
            <PropRow
              name="menuSearchPlaceholder"
              type="string"
              defaultVal='"Search..."'
              description="Placeholder for the menu search input"
              isDarkMode={dark}
            />
            <PropRow
              name="submenuSearchPlaceholder"
              type="string"
              defaultVal='"Search..."'
              description="Placeholder for the submenu search input"
              isDarkMode={dark}
            />
            <PropRow
              name="onMenuSearch"
              type="(query) => Promise<CascadingOption[]>"
              description="Async search for main menu. Disables client-side filtering when provided."
              isDarkMode={dark}
            />
            <PropRow
              name="onSubmenuSearch"
              type="(query, parent) => Promise<CascadingOption[]>"
              description="Async search for submenus. Receives parent option and query string."
              isDarkMode={dark}
            />
            <PropRow
              name="searchDebounceMs"
              type="number"
              defaultVal="300"
              description="Debounce delay (ms) for async search callbacks"
              isDarkMode={dark}
            />
            <PropRow
              name="SearchIcon"
              type="ComponentType<{ className?: string }>"
              description="Custom search icon component"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="CascadingDropdownClasses"
              description="Slot class overrides (25 slots including searchInput, searchInputElement, searchIcon)"
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
            <PropRow
              name="searchInput"
              type="string"
              description="Search input wrapper (contains icon + input element)"
              isDarkMode={dark}
            />
            <PropRow
              name="searchInputElement"
              type="string"
              description="The search <input> element itself"
              isDarkMode={dark}
            />
            <PropRow
              name="searchIcon"
              type="string"
              description="Search icon inside the menu search input"
              isDarkMode={dark}
            />
            <PropRow
              name="submenuSearchInput"
              type="string"
              description="Search input wrapper in submenus (falls back to searchInput if not set)"
              isDarkMode={dark}
            />
            <PropRow
              name="submenuSearchInputElement"
              type="string"
              description="Search <input> element in submenus (falls back to searchInputElement)"
              isDarkMode={dark}
            />
            <PropRow
              name="submenuSearchIcon"
              type="string"
              description="Search icon in submenus (falls back to searchIcon)"
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
            className={`space-y-2 text-sm text-cl-text-secondary`}
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
