# MultiSelectSearchableDropdown

> A multi-select dropdown with built-in search, chip display, async search/prefetch, checkbox options, and full style customization.

**Category:** Form
**Keywords:** multi-select, searchable, dropdown, multiselect, search, filter, checkbox, chips, tags, async, combobox, form control

---

## Quick Answer

Use `<MultiSelectSearchableDropdown options={[...]} value={selected} onValueChange={setSelected} />` for a searchable multi-select control with chip display. Supports local filtering, async search via `onSearch`, initial prefetch via `onLoadInitialOptions`, and portal-based positioning. Works out-of-the-box with built-in Tailwind styles.

---

## Import

```tsx
import { MultiSelectSearchableDropdown } from "@chumlab/ui/multi-select-searchable-dropdown";
import type { MultiSelectOption } from "@chumlab/ui/multi-select-searchable-dropdown";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { useState } from "react";
import { MultiSelectSearchableDropdown } from "@chumlab/ui/multi-select-searchable-dropdown";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

export default function Example() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <MultiSelectSearchableDropdown
      options={options}
      value={selected}
      onValueChange={(values) => setSelected(values)}
      placeholder="Search and select..."
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
| `forceDropdownPosition` | Only meaningful with `dropdownPosition`. Disables auto-flip. |
| `lockScroll` | Prevents body scroll while open. Default: `false`. |
| `showSelectedChips` | Default `true`. Set `false` for count-only display. |
| `maxDisplayedChips` | Truncates chips with "+N more" badge. |
| `name` | Renders hidden inputs for form submission. |
| `renderTrigger` | Replaces default trigger. Must spread all props and attach `ref`. |

---

## Data Attributes (for CSS selectors and testing)

**Root element:**
- `data-disabled`, `data-error`, `data-open`, `data-full-width`, `data-success`

**Trigger element:**
- `data-disabled`, `data-error`, `data-open`, `data-placeholder`

**Dropdown panel:**
- `data-position` — `"top"` or `"bottom"`

DOM nesting: `root > label + description + wrapper > trigger(combobox) + content(portal) > searchInput + optionList(listbox) > options`

---

## All Props

<!-- generated from MultiSelectSearchableDropdown.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | array | — | List of selectable options. |
| `value` | array | — | Controlled selected values. |
| `defaultValue` | array | — | Initial selected values for uncontrolled usage. |
| `onValueChange` | object | — | (values: string[], options: MultiSelectOption[]) => void - Fires when the selected values change. |
| `id` | string | — | HTML id attribute for the trigger element. |
| `name` | string | — | Form field name. |
| `placeholder` | object | `"Select options..."` | React.ReactNode - Placeholder when nothing is selected. |
| `disabled` | boolean | `false` | Disables the dropdown. |
| `error` | boolean | `false` | Displays the dropdown in an error state. |
| `errorMessage` | object | — | React.ReactNode - Error message displayed below the dropdown. |
| `label` | object | — | React.ReactNode - Label rendered above the dropdown. |
| `description` | object | — | React.ReactNode - Description text rendered below the label. |
| `success` | boolean | `false` | Displays the dropdown in a success state. |
| `successMessage` | object | — | React.ReactNode - Success message displayed below the dropdown. |
| `required` | boolean | `false` | Marks the field as required. |
| `showSearch` | boolean | `true` | Whether to show the search input in the dropdown. |
| `searchPlaceholder` | string | `"Search..."` | Placeholder text for the search input. |
| `noResultsContent` | object | `"No options found"` | React.ReactNode - Content shown when no options match the search. |
| `loadingText` | object | `"Loading..."` | React.ReactNode - Text shown during async loading. |
| `shimmerCount` | number | `5` | Number of shimmer placeholder items shown during loading. |
| `clearable` | boolean | `false` | Shows a clear button to deselect all values. |
| `showChevron` | boolean | `true` | Whether to show the chevron icon in the trigger. |
| `fullWidth` | boolean | `false` | Makes the dropdown span the full width of its container. |
| `loading` | boolean | — | Shows a loading state. |
| `onSearch` | object | — | (query: string) => Promise<MultiSelectOption[]> - Async search callback for server-side filtering. |
| `searchDebounceMs` | number | `300` | Debounce delay in milliseconds for the search callback. |
| `initialOptions` | array | — | Options to display before any search is performed. |
| `onLoadInitialOptions` | object | — | () => Promise<MultiSelectOption[]> - Async function to load initial options. |
| `loadInitialOnOpen` | boolean | `false` | When true, calls onLoadInitialOptions each time the dropdown opens. |
| `onLoadError` | object | — | (error: unknown) => void - Called when async loading or search fails. |
| `maxDisplayedChips` | number | `3` | Maximum number of selected chips displayed before showing a count. |
| `showSelectedChips` | boolean | `true` | Whether to show selected values as chips in the trigger. |
| `checkboxIcon` | object | — | React.ReactNode - Custom checkbox icon for options. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `lockScroll` | boolean | `false` | Locks body scroll while the dropdown is open. |
| `classes` | object | — | CSS class overrides for dropdown sub-elements. |
| `className` | string | — | Additional CSS class for the root element. |
| `style` | object | — | Inline styles for the root element. |
| `open` | boolean | — | Controlled open state. |
| `defaultOpen` | boolean | `false` | Whether the dropdown is initially open (uncontrolled). |
| `onOpenChange` | object | — | (open: boolean) => void - Fires when the open state changes. |
| `portalContainer` | object | — | HTMLElement \| null - Portal target for the dropdown popup. |
| `dropdownPosition` | `"top"` \| `"bottom"` | `"bottom"` | Vertical placement of the dropdown relative to the trigger. |
| `forceDropdownPosition` | boolean | `false` | Locks the dropdown to the specified position without auto-flipping. |
| `dropdownZIndex` | number | `50` | Z-index of the dropdown popup. |
| `dropdownGap` | number | `4` | Gap in pixels between trigger and dropdown popup. |
| `keepMounted` | boolean | `false` | Keeps the dropdown DOM mounted when closed. |
| `aria-label` | string | — | Accessible label for the dropdown. |
| `onBlur` | object | — | () => void - Fires when the dropdown loses focus. |
| `onFocus` | object | — | () => void - Fires when the dropdown receives focus. |
| `onKeyDown` | object | — | (event: React.KeyboardEvent) => void - Fires on keydown events. |
| `ClearIcon` | object | — | React.ComponentType<{ className?: string }> - Custom clear icon component. |
| `renderTrigger` | object | — | (props: MultiSelectSearchableDropdownTriggerRenderProps) => ReactNode - Custom render function for the trigger. |
| `searchInputAriaLabel` | string | `"Search options"` | Accessible label for the search input. |

## Styling Guide

### How class merging works

1. **Default** — uses `DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES`
2. **Partial override** — **replaces** per slot, not additive
3. **Unstyled** — all slots empty, you build from scratch

### Slot → visual mapping

```
root
├── label
├── description
└── wrapper
    └── trigger (role="combobox")
    │   ├── chips / triggerText / moreCount
    │   ├── clearIcon
    │   └── chevron
    └── content (portal)
        ├── searchInput > searchIcon + searchInputElement
        └── optionList (role="listbox")
            └── option (checkbox + checkboxIcon + label)
```

| "I want to change..." | Slot to use |
|------------------------|-------------|
| Search input wrapper | `searchInput` |
| Search text input | `searchInputElement` |
| Search icon | `searchIcon` |
| Loading indicator | `loading` |
| Everything else | Same as MultiSelectDropdown |

### Dark mode

Defaults use Tailwind `dark:` prefix. When overriding, provide both light and dark variants.

---

## Patterns

### Async search with API

```tsx
<MultiSelectSearchableDropdown
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
<MultiSelectSearchableDropdown
  loadInitialOnOpen
  onLoadInitialOptions={() => fetch("/api/popular").then(r => r.json())}
  onSearch={(q) => fetch(`/api/search?q=${q}`).then(r => r.json())}
/>
```

### Force dropdown position

```tsx
<MultiSelectSearchableDropdown
  options={options}
  dropdownPosition="top"
  forceDropdownPosition
  lockScroll
/>
```

---

## Accessibility

- `role="combobox"` with full ARIA attributes on trigger
- `role="listbox"` with `aria-multiselectable="true"` on option list
- `role="option"` with `aria-selected`, `aria-disabled` on each option
- `aria-activedescendant` tracks keyboard focus
- Search input accessible with configurable `searchInputAriaLabel`
- Arrow keys navigate, Enter/Space toggle, Escape closes
- Chip remove buttons have `aria-label="Remove {label}"`
- SR-only live region for selection announcements

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Styles wrong after overriding one class | `classes` replaces per slot | Provide full class string |
| Dropdown opens in wrong direction | Auto-flip | Use `forceDropdownPosition` |
| Search not working | Using `options` prop with `onSearch` | `onSearch` replaces local filtering |
| Async results not appearing | `onSearch` not returning array | Must return `Promise<MultiSelectOption[]>` |
| Options don't load on open | Missing `loadInitialOnOpen` | Add alongside `onLoadInitialOptions` |
| Controlled value not updating | Missing `onValueChange` | Pair `value` with `onValueChange` |
| Search input not visible | `showSearch={false}` | Set to `true` (default) |

---

## Demo Reference

**File:** `src/pages/demo/MultiSelectSearchableDropdownDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Minimal example | `title="Basic Usage"` |
| Custom content | `title="With Custom Content"` |
| Async search | `title="Async Search (Real API)"` |
| Prefetch | `title="Async with Dynamic Prefetch"` |
| Count-only | `title="Without Chips (Count Only)"` |
| Style variants | `title="Style Variants"` |
| Position control | `title="Dropdown Position"` |
| Scroll lock | `title="Scroll Lock"` |
| Custom themes | `title="Dark Theme"`, `title="Blue Theme"` |
| Custom checkboxes | `title="Custom Checkbox - Green Rounded"` |
| Uncontrolled | `title="Uncontrolled"` |
| Combined | `title="Combined Features"` |

### Source file index

| File | Contains |
|------|----------|
| `MultiSelectSearchableDropdown.tsx` | Main component, inline positioning, search, ref forwarding |
| `utils/types.ts` | Props, classes, trigger render props, hook types |
| `utils/constants.ts` | DEFAULT + UNSTYLED class maps |
| `utils/useMultiSelectDropdown.ts` | Core hook: selection, search, keyboard, async |
| `utils/icons.tsx` | ChevronDown, Check, Search, X icons |
| `index.ts` | Public exports |
