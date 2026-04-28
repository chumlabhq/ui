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

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SearchableDropdownOption[]` | `[]` | Available options |
| `value` | `string \| null` | — | Controlled selected value |
| `defaultValue` | `string` | — | Initial value (uncontrolled) |
| `onValueChange` | `(value, option) => void` | — | Selection change callback |
| `placeholder` | `ReactNode` | — | Trigger placeholder |
| `label` | `ReactNode` | — | Label (auto-associated via htmlFor) |
| `description` | `ReactNode` | — | Helper text below label |
| `showSearch` | `boolean` | `true` | Show search input |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `searchInputAriaLabel` | `string` | `"Search options"` | Search input aria-label |
| `onSearch` | `(query) => Promise<Option[]>` | — | Async search function |
| `searchDebounceMs` | `number` | `300` | Search debounce delay |
| `initialOptions` | `Option[]` | `[]` | Pre-loaded options for async |
| `onLoadInitialOptions` | `() => Promise<Option[]>` | — | Async initial load on open |
| `loadInitialOnOpen` | `boolean` | `false` | Trigger initial load on open |
| `disabled` | `boolean` | `false` | Disable component |
| `required` | `boolean` | `false` | Required field |
| `error` / `errorMessage` | `boolean` / `ReactNode` | — | Error state |
| `success` / `successMessage` | `boolean` / `ReactNode` | — | Success state |
| `clearable` | `boolean` | `false` | Show clear button |
| `showChevron` | `boolean` | `true` | Show chevron icon |
| `showSelectedIcon` | `boolean` | `true` | Show check icon on selected |
| `selectedIcon` | `ReactNode` | — | Custom selected icon |
| `fullWidth` | `boolean` | `false` | Full container width |
| `loading` | `boolean` | `false` | Loading state |
| `shimmerCount` | `number` | `5` | Shimmer placeholder count |
| `lockScroll` | `boolean` | `false` | Lock body scroll |
| `dropdownPosition` | `"top" \| "bottom"` | `"bottom"` | Preferred position |
| `forceDropdownPosition` | `boolean` | `false` | Lock position, no auto-flip |
| `dropdownZIndex` | `number` | `50` | Dropdown z-index |
| `dropdownGap` | `number` | `4` | Gap (px) |
| `portalContainer` | `HTMLElement \| null` | `document.body` | Portal target |
| `keepMounted` | `boolean` | `false` | Keep DOM when closed |
| `typeaheadTimeout` | `number` | `500` | Type-ahead buffer reset (ms) |
| `classes` | `SearchableDropdownClasses` | — | Per-slot class overrides |
| `unstyled` | `boolean` | `false` | Strip all defaults |
| `name` | `string` | — | Form field name |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open) => void` | — | Open state callback |
| `renderTrigger` | `(props) => ReactNode` | — | Custom trigger renderer |
| `ChevronIcon` / `CheckIcon` / `ClearIcon` / `SearchIcon` | `ComponentType` | — | Custom icon components |
| `loadingText` | `ReactNode` | — | Custom loading indicator |

---

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
| Custom icons | `title="Custom Chevron"`, `title="Custom Check Icon"`, `title="Custom Search Icon"`, `title="Custom Clear Icon"` |
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
