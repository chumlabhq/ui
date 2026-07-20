# SearchableDropdown

> A single-select dropdown with built-in search input, async search/prefetch, portal rendering, keyboard navigation, and full style customization.

**Category:** Form
**Keywords:** searchable, dropdown, select, combobox, search, filter, autocomplete, typeahead, async, listbox, form control

---

## Quick Answer

Use `<SearchableDropdown options={[...]} />` for a searchable single-select. Supports local filtering by default, async search via `onSearch`, initial prefetch via `onLoadInitialOptions`, and portal-based positioning. Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`). Works out-of-the-box with built-in Tailwind styles.

---

## Import

```tsx
import { SearchableDropdown } from "@chumlab/ui/searchable-dropdown";
import type { SearchableDropdownOption } from "@chumlab/ui/searchable-dropdown";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { useState } from "react";
import { SearchableDropdown } from "@chumlab/ui/searchable-dropdown";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

export default function Example() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <SearchableDropdown
      options={options}
      value={value}
      onValueChange={(v) => setValue(v)}
      placeholder="Search fruits..."
    />
  );
}
```

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `value` + `defaultValue` | Never combine. Use one or the other. |
| `value` requires `onValueChange` | Controlled mode — both needed together. |
| `open` requires `onOpenChange` | Controlled open state — both needed together. |
| `onSearch` | Async search function. Replaces local filtering when provided. |
| `onLoadInitialOptions` | Requires `loadInitialOnOpen={true}` to trigger on open. |
| `searchDebounceMs` | Only applies to `onSearch`. Default: `300`. |
| `showSearch` | Default `true`. Set `false` to hide search input. |
| `clearable` | Only works when a value is selected. |
| `forceDropdownPosition` | Only meaningful with `dropdownPosition`. Disables auto-flip. |
| `lockScroll` | Prevents body scroll while open. Default: `false`. |
| `renderTrigger` | Replaces the default trigger. Must spread all provided props and attach `ref`. |
| `name` | Renders a hidden `<input>` for native form submission. |

---

## Data Attributes (for CSS selectors and testing)

**Root element:**
- `data-disabled` — when `disabled={true}`
- `data-error` — when `error={true}`
- `data-open` — when dropdown is open
- `data-full-width` — when `fullWidth={true}`
- `data-success` — when `success={true}`

**Trigger element:**
- `data-disabled`, `data-error`, `data-open` — mirrors root
- `data-placeholder` — when no option is selected

**Dropdown panel:**
- `data-position` — `"top"` or `"bottom"` (actual rendered position)

DOM nesting: `root > label + description + wrapper > trigger(combobox) + content(portal) > searchInput + optionList(listbox) > options`

---

## All Props

<!-- generated from SearchableDropdown.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | array | — | Array of dropdown options. |
| `value` | string \| null | — | Controlled selected value. |
| `defaultValue` | string | — | Default uncontrolled selected value. |
| `onValueChange` | object | — | (value: string \| null, option: SearchableDropdownOption \| null) => void — Callback fired when the selected value changes. |
| `open` | boolean | — | Controlled open state of the dropdown. |
| `defaultOpen` | boolean | `false` | Default uncontrolled open state. |
| `onOpenChange` | object | — | (open: boolean) => void — Callback fired when the open state changes. |
| `id` | string | — | HTML id attribute for the component. |
| `name` | string | — | Form field name attribute. |
| `placeholder` | object | `"Select an option"` | React.ReactNode — Placeholder content shown when no value is selected. |
| `disabled` | boolean | `false` | Whether the dropdown is disabled. |
| `error` | boolean | `false` | Whether the dropdown is in an error state. |
| `errorMessage` | object | — | React.ReactNode — Error message displayed below the dropdown. |
| `label` | object | — | React.ReactNode — Label displayed above the dropdown. |
| `description` | object | — | React.ReactNode — Description text displayed below the label. |
| `success` | boolean | `false` | Whether the dropdown is in a success state. |
| `successMessage` | object | — | React.ReactNode — Success message displayed below the dropdown. |
| `required` | boolean | `false` | Whether the field is required. |
| `clearable` | boolean | `false` | Whether the selected value can be cleared. |
| `showSearch` | boolean | `true` | Whether to show the search input in the dropdown. |
| `searchPlaceholder` | string | `"Search..."` | Placeholder text for the search input. |
| `searchInputAriaLabel` | string | `"Search options"` | Custom aria-label for the search input. Defaults to 'Search options'. |
| `noResultsContent` | object | `"No results found"` | React.ReactNode — Content shown when no search results are found. |
| `showChevron` | boolean | `true` | Whether to show the chevron icon on the trigger. |
| `showSelectedIcon` | boolean | `true` | Whether to show a check icon on the selected option. |
| `selectedIcon` | object | — | React.ReactNode — Custom icon for the selected option. |
| `fullWidth` | boolean | `false` | Whether the dropdown expands to fill its parent container. |
| `loading` | boolean | — | Whether the dropdown is in a loading state. |
| `onSearch` | object | — | (query: string) => Promise<SearchableDropdownOption[]> — Async search callback for server-side filtering. |
| `searchDebounceMs` | number | `300` | Debounce delay in milliseconds for the search callback. |
| `initialOptions` | array | — | Initial options to display before any search is performed. |
| `onLoadInitialOptions` | object | — | () => Promise<SearchableDropdownOption[]> — Async callback to load initial options. |
| `loadInitialOnOpen` | boolean | `false` | Whether to load initial options when the dropdown opens. |
| `onLoadError` | object | — | (error: unknown) => void — Callback when async loading fails. |
| `shimmerCount` | number | `5` | Number of shimmer placeholder items to show while loading. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `className` | string | — | CSS class for the root element. |
| `style` | object | — | Inline styles applied to the root element. |
| `keepMounted` | boolean | `false` | Whether to keep the dropdown DOM mounted when closed. |
| `portalContainer` | object | — | HTMLElement \| null — Custom container element for the dropdown portal. |
| `dropdownPosition` | `"top"` \| `"bottom"` | `"bottom"` | Position of the dropdown relative to the trigger. |
| `forceDropdownPosition` | boolean | `false` | When true, locks the dropdown to the specified dropdownPosition without auto-flipping. |
| `dropdownZIndex` | number | `50` | Z-index for the dropdown. |
| `dropdownGap` | number | `4` | Gap between trigger and dropdown in pixels. |
| `typeaheadTimeout` | number | `500` | Timeout in milliseconds for typeahead keyboard navigation. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |
| `lockScroll` | boolean | `false` | Whether to lock body scroll when the dropdown is open. |
| `aria-label` | string | — | Accessible label for the dropdown. |
| `onBlur` | object | — | () => void — Callback fired when the dropdown loses focus. |
| `onFocus` | object | — | () => void — Callback fired when the dropdown gains focus. |
| `onKeyDown` | object | — | (event: React.KeyboardEvent) => void — Callback fired on keydown events. |
| `renderTrigger` | object | — | (props: SearchableDropdownTriggerRenderProps) => ReactNode — Custom trigger render function. |
| `ChevronIcon` | object | — | React.ComponentType — Custom chevron icon component. |
| `CheckIcon` | object | — | React.ComponentType — Custom check icon component. |
| `ClearIcon` | object | — | React.ComponentType — Custom clear icon component. |
| `SearchIcon` | object | — | React.ComponentType — Custom search icon component. |
| `loadingText` | object | `"Loading..."` | React.ReactNode — Text shown during loading state. |

## Styling Guide

### How class merging works

1. **Default** — uses `DEFAULT_SEARCHABLEDROPDOWN_CLASSES`
2. **Partial override** (`classes` without `unstyled`) — **replaces** per slot, not additive
3. **Unstyled** (`unstyled={true}`) — all slots empty, you build from scratch

### Slot → visual mapping

```
root
├── label
├── description
└── wrapper
    └── trigger (role="combobox")
    │   ├── triggerText
    │   ├── clearIcon
    │   └── chevron
    └── content (portal)
        ├── searchInput > searchIcon + searchInputElement
        ├── optionList (role="listbox")
        │   └── option (optionSelected, optionFocused, optionDisabled)
        │       └── checkIcon
        ├── noResults
        └── shimmer > shimmerItem
```

| "I want to change..." | Slot to use |
|------------------------|-------------|
| Search input wrapper | `searchInput` |
| Search text input | `searchInputElement` |
| Search icon | `searchIcon` |
| Trigger button | `trigger` |
| Selected text | `triggerText` |
| Dropdown panel | `content` |
| Option row | `option`, `optionSelected`, `optionFocused` |
| Check icon | `checkIcon` |
| Clear button | `clearIcon` |
| No results text | `noResults` |
| Loading shimmer | `shimmer`, `shimmerItem` |

### Dark mode

Defaults use Tailwind `dark:` prefix. When overriding, always provide both light and dark variants.

---

## Patterns

### Async search with API

```tsx
<SearchableDropdown
  onSearch={async (query) => {
    const res = await fetch(`/api/search?q=${query}`);
    return res.json();
  }}
  searchDebounceMs={300}
  placeholder="Search..."
/>
```

### Prefetch on open + async search

```tsx
<SearchableDropdown
  loadInitialOnOpen
  onLoadInitialOptions={() => fetch("/api/popular").then(r => r.json())}
  onSearch={(q) => fetch(`/api/search?q=${q}`).then(r => r.json())}
/>
```

### Force dropdown position

```tsx
<SearchableDropdown
  options={options}
  dropdownPosition="top"
  forceDropdownPosition
  lockScroll
/>
```

### Custom trigger

```tsx
<SearchableDropdown
  options={options}
  renderTrigger={(props) => (
    <button {...props} className="my-custom-trigger">
      {props.selectedOption?.label || props.placeholder}
    </button>
  )}
/>
```

---

## Accessibility

- `role="combobox"` on trigger with `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`
- `role="listbox"` with `aria-label`, `aria-busy` on option list
- `aria-activedescendant` tracks keyboard focus
- Search input with `aria-label` and `aria-autocomplete="list"`
- `aria-invalid`, `aria-required`, `aria-describedby` for form states
- Clear button has `aria-label="Clear selection"`
- `role="alert"` on error messages
- `role="status"` with `aria-live="polite"` for announcements
- Arrow keys navigate options, Enter selects, Escape closes
- Tab moves focus out, type-ahead search supported

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Styles wrong after overriding one class | `classes` replaces per slot | Provide full class string |
| Dropdown opens in wrong direction | Auto-flip chose different position | Use `forceDropdownPosition` |
| Search not working with `onSearch` | Local filtering overridden | `onSearch` replaces local filtering entirely |
| Async results not appearing | `onSearch` not returning array | Must return `Promise<SearchableDropdownOption[]>` |
| Options don't load on open | Missing `loadInitialOnOpen` | Add alongside `onLoadInitialOptions` |
| Controlled value not updating | Missing `onValueChange` | Pair `value` with `onValueChange` |
| Clear button not visible | `clearable` not set | Add `clearable` prop |
| Dropdown clipped by parent | Not using portal | Default uses portal; check `portalContainer` |

---

## Demo Reference

**File:** `src/pages/demo/SearchableDropdownDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Minimal example | `title="Basic Usage"` |
| State variations | `title="State Variations"` |
| Uncontrolled | `title="Uncontrolled (defaultValue)"` |
| Controlled open | `title="Controlled Open State"` |
| Clearable | `title="Clearable"` |
| Custom trigger | `title="Custom Trigger (renderTrigger)"` |
| Custom content | `title="With Custom Content"` |
| Async search | `title="Async Search (Real API)"` |
| Async prefetch | `title="Async with Dynamic Prefetch"` |
| Status indicators | `title="With Status Indicators"` |
| Without search | `title="Without Search Input"` |
| Custom themes | `title="Custom Theme Examples"` |
| Disabled options | `title="With Disabled Options"` |
| Form integration | `title="Native Form Participation"` |
| Scroll lock | `title="Scroll Lock"` |
| Position control | `title="Dropdown Position"` |
| Force position | `forceDropdownPosition` |
| Custom icons | `title="Custom Chevron & No Chevron"`, `title="Custom Check Icon"`, `title="Custom Search Icon"`, `title="Custom Clear Icon"` |
| Combined | `title="Combined: All Features"` |

### Source file index

| File | Contains |
|------|----------|
| `SearchableDropdown.tsx` | Main component, content positioning, search, ref forwarding |
| `utils/types.ts` | Props, classes, trigger render props |
| `utils/constants.ts` | DEFAULT + UNSTYLED class maps |
| `utils/helpers.ts` | `computeDropdownCoords`, `scrollOptionIntoView` |
| `utils/useDropdown.ts` | Core hook: selection, keyboard, async search |
| `utils/icons.tsx` | ChevronDown, Check, Search icons |
| `components/SearchableDropdownOption.tsx` | Option row component |
| `components/SearchableDropdownShimmer.tsx` | Loading shimmer |
| `index.ts` | Public exports |
| `__tests__/` | Unit tests |
