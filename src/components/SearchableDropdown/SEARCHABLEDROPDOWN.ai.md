# SearchableDropdown

> A single-select dropdown with built-in search input, async search/prefetch, portal rendering, keyboard navigation, and full style customization.

**Category:** Form
**Keywords:** searchable, dropdown, select, combobox, search, filter, autocomplete, typeahead, async, listbox, form control

---

## Quick Answer

Use `<SearchableDropdown options={[...]} />` for a searchable single-select. Supports local filtering by default, async search via `searchOptions`, initial prefetch via `loadInitialOptions`, and portal-based positioning. Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`). Works out-of-the-box with built-in Tailwind styles.

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
| `searchOptions` | Async search function. Replaces local filtering when provided. |
| `loadInitialOptions` | Requires `loadInitialOnOpen={true}` to trigger on open. |
| `searchDebounce` | Only applies to `searchOptions`. Default: `300`. |
| `showSearch` | Default `true`. Set `false` to hide search input. |
| `clearable` | Only works when a value is selected. |
| `forceDropdownSide` | Only meaningful with `dropdownSide`. Disables auto-flip. |
| `lockScroll` | Prevents body scroll while open. Default: `false`. |
| `renderTrigger` | `renderTrigger(triggerProps, state)` replaces the default `<button>`. Spread `triggerProps` onto a `<button>`: it is exactly what the default trigger renders, ref and `type="button"` included. Draw from `state` (`isOpen`, `selectedOption`, `placeholder`), which never reaches the DOM. |
| `name` | Renders a hidden `<input>` for native form submission. |

---

## Data Attributes (for CSS selectors and testing)

**Root element:**
- `data-disabled` — when `disabled={true}`
- `data-error` — when `error={true}`
- `data-open` — when dropdown is open
- `data-full-width` — when `fullWidth={true}`
- `data-valid` — when `success={true}`

**Trigger element:**
- `data-disabled`, `data-error`, `data-open` — mirrors root
- `data-placeholder` — when no option is selected; the placeholder text is tertiary

**Dropdown panel:**
- `data-position` — `"top"` or `"bottom"` (actual rendered position)
- `data-state="open" | "closed"`
- `data-dropdown-id` — unique ID for click-outside detection
- `data-side` — on the surface, the side it was placed on after any flip

**Options:**
- `data-selected` — a selected option; it shows the selected icon
- `data-highlighted` — the keyboard position
- `data-disabled` — a disabled option
- `data-value` — the option's value

**Messages:** `data-invalid` on the error message

DOM nesting: `root > label + description + wrapper > trigger(combobox) + content(portal) > searchInput + optionList(listbox) > options`

---

## All Props

<!-- generated from SearchableDropdown.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | array | `[]` | Array of dropdown options. Mutually exclusive with `searchOptions`: the async branch never reads it. |
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
| `emptyContent` | object | `"No results found"` | React.ReactNode — Content shown when no search results are found. |
| `showChevron` | boolean | `true` | Whether to show the chevron icon on the trigger. |
| `showSelectedIcon` | boolean | `true` | Whether to show a check icon on the selected option. |
| `selectedIcon` | object | — | React.ReactNode — Custom icon for the selected option. |
| `fullWidth` | boolean | `false` | Whether the dropdown expands to fill its parent container. |
| `loading` | boolean | — | Whether the dropdown is in a loading state. |
| `searchOptions` | object | — | (query: string) => Promise<SearchableDropdownOption[]> — Async search callback for server-side filtering. Mutually exclusive with `options`. |
| `searchDebounce` | number | `300` | Debounce delay in milliseconds for the search callback. |
| `initialOptions` | array | `[]` | Initial options to display before any search is performed. Async branch only (`searchOptions`). |
| `loadInitialOptions` | object | — | () => Promise<SearchableDropdownOption[]> — Async callback to load initial options. Async branch only, and requires `loadInitialOnOpen`. |
| `loadInitialOnOpen` | boolean | `false` | Whether to load initial options when the dropdown opens. Requires `loadInitialOptions`; alone it has nothing to load. |
| `onLoadError` | object | — | (error: unknown) => void — Callback when async loading fails. |
| `shimmerCount` | number | `5` | Number of shimmer placeholder items to show while loading. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `className` | string | — | CSS class for the root element. |
| `style` | object | — | Inline styles applied to the root element. |
| `keepMounted` | boolean | `false` | Whether to keep the dropdown DOM mounted when closed. |
| `portalContainer` | object | — | HTMLElement \| null — Custom container element for the dropdown portal. |
| `dropdownSide` | `"top"` \| `"bottom"` | `"bottom"` | Position of the dropdown relative to the trigger. |
| `forceDropdownSide` | boolean | `false` | When true, locks the dropdown to the specified dropdownSide without auto-flipping. |
| `dropdownZIndex` | number | `50` | Z-index for the dropdown. |
| `dropdownOffset` | number | `4` | Gap between trigger and dropdown in pixels. |
| `typeaheadTimeout` | number | `500` | Timeout in milliseconds for typeahead keyboard navigation. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |
| `lockScroll` | boolean | `false` | Whether to lock body scroll when the dropdown is open. |
| `aria-label` | string | — | Accessible label for the dropdown. |
| `aria-labelledby` | string | — | Names the field by another element, and wins over `label` and `aria-label`. Lands on the trigger. |
| `aria-describedby` | string | — | Lands on the trigger, joined with the component's own error message. |
| `onBlur` | object | — | (event: FocusEvent<HTMLElement>) => void — Fires when the trigger loses focus, with the native focus event. |
| `onFocus` | object | — | (event: FocusEvent<HTMLElement>) => void — Fires when the trigger takes focus, with the native focus event. |
| `onKeyDown` | object | — | (event: React.KeyboardEvent) => void — Callback fired on keydown events. |
| `renderTrigger` | object | — | (triggerProps: SearchableDropdownTriggerRenderProps, state: SearchableDropdownTriggerState) => ReactNode - Custom render function for the trigger element. Spread triggerProps onto a <button>; draw from state (isOpen, selectedOption, placeholder). |
| `chevronIcon` | object | — | ReactNode — Replaces the trigger's chevron. Rendered inside a box carrying `classes.icon`, which turns it over while the menu is open. |
| `clearIcon` | object | — | ReactNode — Replaces the clear button's glyph. Rendered as given. |
| `searchIcon` | object | — | ReactNode — Replaces the search field's magnifier. Rendered as given; `classes.searchIcon` styles the default one. |
| `loadingContent` | object | `"Loading..."` | React.ReactNode — Text shown during loading state. |

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

1. **Default** — uses `DEFAULT_SEARCHABLEDROPDOWN_CLASSES`
2. **Partial override** (`classes` without `unstyled`) — your classes compose with that slot's defaults; slots you don't name keep theirs.

**A plain utility of yours wins over every default in its group on that slot, states included.**
`classes={{ control: "bg-green-500" }}` paints green in every state, where a default
`data-[state=checked]:` background would otherwise keep winning. To restyle one state only,
pass that state's own variant (`data-[state=checked]:bg-green-500`). Defaults in other groups stay.

3. **Unstyled** (`unstyled={true}`) — all slots empty, you build from scratch

```tsx
// `item` carries the base AND 3 state variants. Overriding it
// replaces all of them, so write them together:
<SearchableDropdown
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
    │   ├── value
    │   ├── clearTrigger
    │   └── icon
    └── content (portal)
        ├── searchControl > searchIcon + searchInput
        ├── list (role="listbox")
        │   └── item (optionSelected, optionFocused, optionDisabled)
        │       └── itemIndicator
        ├── empty
        └── loading > loadingItem
```

| "I want to change..." | Slot to use |
|------------------------|-------------|
| Search input wrapper | `searchControl` |
| Search text input | `searchInput` |
| Search icon | `searchIcon` |
| Trigger button | `trigger` |
| Selected text | `value` |
| Dropdown panel | `content` |
| Option row | `item` |
| Check icon | `itemIndicator` |
| Clear button | `clearTrigger` |
| No results text | `empty` |
| Loading shimmer | `loading`, `loadingItem` |

### Dark mode

Defaults use Tailwind `dark:` prefix. When overriding, always provide both light and dark variants.

---

## Patterns

### Async search with API

```tsx
<SearchableDropdown
  searchOptions={async (query) => {
    const res = await fetch(`/api/search?q=${query}`);
    return res.json();
  }}
  searchDebounce={300}
  placeholder="Search..."
/>
```

### Prefetch on open + async search

```tsx
<SearchableDropdown
  loadInitialOnOpen
  loadInitialOptions={() => fetch("/api/popular").then(r => r.json())}
  searchOptions={(q) => fetch(`/api/search?q=${q}`).then(r => r.json())}
/>
```

### Force dropdown position

```tsx
<SearchableDropdown
  options={options}
  dropdownSide="top"
  forceDropdownSide
  lockScroll
/>
```

### Custom trigger

```tsx
<SearchableDropdown
  options={options}
  renderTrigger={(triggerProps, { selectedOption, placeholder }) => (
    <button {...triggerProps} className="my-custom-trigger">
      {selectedOption?.label ?? placeholder}
    </button>
  )}
/>
```

---

## Forms

- **Submitted value.** With `name`, it submits one entry, the selected option's `value`, or an empty string when nothing is selected or the value matches no option.
- **Reset.** A form reset — a `type="reset"` button or `form.reset()` — restores an uncontrolled selection to `defaultValue` (or no selection), and the submitted value with it. Like a native input it fires no change callback: `onValueChange` is not called. A controlled SearchableDropdown is left alone: it keeps the `value` you pass and calls nothing, as a controlled React `<input>` does. Reset your own state in the form's `onReset` if you want the field cleared.
- **Required.** An empty `required` SearchableDropdown blocks the form's submit, and the browser's validation moves focus to the trigger. The field shows an error state only when you pass `error` and `errorMessage`.
- **Disabled.** A disabled SearchableDropdown submits nothing, as a disabled native control doesn't.

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Enter`, `Space` | Opens the menu, and selects the focused option. |
| `ArrowDown`, `ArrowUp` | Moves between the filtered options. `aria-activedescendant` sits on the search input, which holds focus. |
| `Home`, `End` | Jumps to the first or last filtered option. |
| `Escape` | Closes the menu and returns focus to the trigger. Always: there is no prop to turn it off, because the APG combobox pattern requires Escape to close the popup. |
| `Tab` | Closes the menu and moves focus on. |
| `Backspace`, `Delete` | Clears the selection when the search box is empty and `clearable` is set. |
| Printable characters | Filters the list. |

---

## Ref API

The ref lands on the trigger, the `<button role="combobox">` a keyboard user tabs to, so `ref.current.focus()` focuses the field — which is what a form library calls on the first invalid field. With `renderTrigger`, it is the element your trigger attaches `triggerProps.ref` to.

```tsx
const ref = useRef<HTMLButtonElement>(null);
<SearchableDropdown ref={ref} options={options} />
// ref.current is the trigger <button>
```

## Accessibility

- `role="combobox"` on trigger with `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`
- `role="listbox"` with `aria-label`, `aria-busy` on option list
- `aria-activedescendant` tracks keyboard focus **on the search input**, which takes the
  focus when the menu opens. It is not on the trigger, which by then has none.
- Named by `label`, then `aria-label`. With neither, the name falls back to the element
  showing the value or placeholder: `combobox` is not a name-from-content role, so the
  visible text alone gave the trigger no accessible name. A development warning still
  asks for a real label.
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
| Styles wrong after overriding one class | Your class composes with the slot's defaults; only a utility in the same group replaces a default | Pass the utility that conflicts (a plain one overrides every state too), or use `unstyled` to start from nothing |
| Dropdown opens in wrong direction | Auto-flip chose different position | Use `forceDropdownSide` |
| Search not working with `searchOptions` | Local filtering overridden | `searchOptions` replaces local filtering entirely |
| Async results not appearing | `searchOptions` not returning array | Must return `Promise<SearchableDropdownOption[]>` |
| Options don't load on open | Missing `loadInitialOnOpen` | Add alongside `loadInitialOptions` |
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
| Force position | `forceDropdownSide` |
| Custom icons | `title="Custom Chevron & No Chevron"`, `title="Custom Check Icon"`, `title="Custom Search Icon"`, `title="Custom Clear Icon"` |
| Combined | `title="Combined: All Features"` |

### Source file index

| File | Contains |
|------|----------|
| `SearchableDropdown.tsx` | Main component, content positioning, search, ref forwarding |
| `utils/types.ts` | Props, classes, trigger render props |
| `utils/constants.ts` | DEFAULT + UNSTYLED class maps |
| `utils/helpers.ts` | `scrollOptionIntoView` |
| `utils/useDropdown.ts` | Core hook: selection, keyboard, async search |
| `utils/icons.tsx` | ChevronDown, Check, Search icons |
| `components/SearchableDropdownOption.tsx` | Option row component |
| `components/SearchableDropdownShimmer.tsx` | Loading shimmer |
| `index.ts` | Public exports |
| `__tests__/` | Unit tests |
