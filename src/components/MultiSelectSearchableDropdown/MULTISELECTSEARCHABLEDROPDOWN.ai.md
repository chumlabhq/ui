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
- `data-disabled`, `data-error`, `data-open`, `data-full-width`, `data-valid`

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
| `options` | array | — | List of selectable options. Mutually exclusive with `onSearch`: the async branch never reads it. |
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
| `onSearch` | object | — | (query: string) => Promise<MultiSelectOption[]> - Async search callback for server-side filtering. Mutually exclusive with `options`. |
| `searchDebounceMs` | number | `300` | Debounce delay in milliseconds for the search callback. |
| `initialOptions` | array | — | Options to display before any search is performed. Async branch only (`onSearch`). |
| `onLoadInitialOptions` | object | — | () => Promise<MultiSelectOption[]> - Async function to load initial options. Async branch only, and requires `loadInitialOnOpen`. |
| `loadInitialOnOpen` | boolean | `false` | When true, calls onLoadInitialOptions each time the dropdown opens. Requires `onLoadInitialOptions`; alone it has nothing to load. |
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
| `typeaheadTimeout` | number | `500` | Timeout in milliseconds for keyboard typeahead matching. |
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

**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

3. **Unstyled** — all slots empty, you build from scratch

```tsx
// `item` carries the base AND 3 state variants. Overriding it
// replaces all of them, so write them together:
<MultiSelectSearchableDropdown
  classes={{
    item:
      "rounded-cl-md px-2 py-1 " +           // base
      "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed " +
      "data-[highlighted]:bg-cl-bg-hover " +
      "data-[selected]:bg-cl-accent/15 data-[selected]:text-cl-accent ",
  }}
/>

// Passing only `item: "data-[disabled]:…"` drops the base and the other
// 2 states.
```

### Slot → visual mapping

```
root
├── label
├── description
└── control
    └── trigger (role="combobox")
    │   ├── chips / value / count
    │   ├── clearTrigger
    │   └── icon
    └── content (portal)
        ├── searchControl > searchIcon + searchInput
        └── list (role="listbox")
            └── item (itemControl + itemIndicator + label)
```

| "I want to change..." | Slot to use |
|------------------------|-------------|
| Search input wrapper | `searchControl` |
| Search text input | `searchInput` |
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

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Enter`, `Space` | Opens the menu, and toggles the focused option without closing it. |
| `ArrowDown`, `ArrowUp` | Moves between the filtered options. `aria-activedescendant` sits on the search input, which holds focus. |
| `Home`, `End` | Jumps to the first or last filtered option. |
| `Escape` | Closes the menu and returns focus to the trigger. |
| `Tab` | Closes the menu and moves focus on. |
| Printable characters | Types into the search box and filters the list. |

---

## Accessibility

- `role="combobox"` with full ARIA attributes on trigger
- `role="listbox"` with `aria-multiselectable="true"` on option list
- `role="option"` with `aria-selected`, `aria-disabled` on each option
- `aria-activedescendant` tracks keyboard focus **on the search input**, which takes the
  focus when the menu opens. It is not on the trigger, which by then has none.
- Named by `label`, then `aria-label`. With neither, the name falls back to the element
  showing the value or placeholder: `combobox` is not a name-from-content role, so the
  visible text alone gave the trigger no accessible name. A development warning still
  asks for a real label.
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

## Selected-chip strip

The strip **wraps**; it does not clip. `maxDisplayedChips` (default 3) caps how
many chips render and the rest collapse into a count, so the strip cannot
overflow its trigger and there is nothing for a clip to protect against.

This is recorded because it was not decided once. `MultiSelectDropdown` shipped
`overflow: hidden` with `flex-wrap: nowrap` while `MultiSelectSearchableDropdown`
shipped `flex-wrap`, both introduced in the same commit — one titled for
unrelated Accordion work — and nothing in either component, schema or document
said which was intended. The clip also cost hit area: the remove control is 24px
via a negative margin inside a 20px row, so the clip took 4px out of the target a
pointer can reach while `target-size` still read 24x24 from the rect.
