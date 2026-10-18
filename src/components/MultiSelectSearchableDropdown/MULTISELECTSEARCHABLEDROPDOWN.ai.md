# MultiSelectSearchableDropdown

> A multi-select dropdown with built-in search, chip display, async search/prefetch, checkbox options, and full style customization.

**Category:** Form
**Keywords:** multi-select, searchable, dropdown, multiselect, search, filter, checkbox, chips, tags, async, combobox, form control

---

## Quick Answer

Use `<MultiSelectSearchableDropdown options={[...]} value={selected} onValueChange={setSelected} />` for a searchable multi-select control with chip display. Supports local filtering, async search via `searchOptions`, initial prefetch via `loadInitialOptions`, and portal-based positioning. Works out-of-the-box with built-in Tailwind styles.

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
| `searchOptions` | Async search function. Replaces local filtering when provided. |
| `loadInitialOptions` | Requires `loadInitialOnOpen={true}` to trigger on open. |
| `searchDebounce` | Only applies to `searchOptions`. Default: `300`. |
| `showSearch` | Default `true`. Set `false` to hide search input. |
| `forceDropdownSide` | Only meaningful with `dropdownSide`. Disables auto-flip. |
| `lockScroll` | Prevents body scroll while open. Default: `false`. |
| `showSelectedChips` | Default `true`. Set `false` for count-only display. |
| `maxVisible` | Truncates chips with "+N more" badge. |
| `name` | Renders hidden inputs for form submission. |
| `renderTrigger` | `renderTrigger(triggerProps, state)` replaces the default `<button>`. Spread `triggerProps` onto a `<button>`: it is exactly what the default trigger renders, ref and `type="button"` included. Draw from `state` (`isOpen`, `selectedOptions`, `placeholder`), which never reaches the DOM. |

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
| `options` | array | `[]` | List of selectable options. Mutually exclusive with `searchOptions`: the async branch never reads it. |
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
| `emptyContent` | object | `"No options found"` | React.ReactNode - Content shown when no options match the search. |
| `loadingContent` | object | `"Loading..."` | React.ReactNode - Text shown during async loading. |
| `shimmerCount` | number | `5` | Number of shimmer placeholder items shown during loading. |
| `clearable` | boolean | `false` | Shows a clear button to deselect all values. |
| `showChevron` | boolean | `true` | Whether to show the chevron icon in the trigger. |
| `fullWidth` | boolean | `false` | Makes the dropdown span the full width of its container. |
| `loading` | boolean | — | Shows a loading state. |
| `searchOptions` | object | — | (query: string) => Promise<MultiSelectOption[]> - Async search callback for server-side filtering. Mutually exclusive with `options`. |
| `searchDebounce` | number | `300` | Debounce delay in milliseconds for the search callback. |
| `initialOptions` | array | `[]` | Options to display before any search is performed. Async branch only (`searchOptions`). |
| `loadInitialOptions` | object | — | () => Promise<MultiSelectOption[]> - Async function to load initial options. Async branch only, and requires `loadInitialOnOpen`. |
| `loadInitialOnOpen` | boolean | `false` | When true, calls loadInitialOptions each time the dropdown opens. Requires `loadInitialOptions`; alone it has nothing to load. |
| `onLoadError` | object | — | (error: unknown) => void - Called when async loading or search fails. |
| `maxVisible` | number | `3` | Maximum number of selected chips displayed before showing a count. The chip strip WRAPS and does not clip: with this cap the strip cannot overflow, so clipping it bought nothing and cost hit area — a 24px remove target inside a 20px clipped row is only 24x20 to a pointer. Decided 2026-09-11; the two components diverged silently before that. |
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
| `dropdownSide` | `"top"` \| `"bottom"` | `"bottom"` | Vertical placement of the dropdown relative to the trigger. |
| `forceDropdownSide` | boolean | `false` | Locks the dropdown to the specified position without auto-flipping. |
| `dropdownZIndex` | number | `50` | Z-index of the dropdown popup. |
| `dropdownOffset` | number | `4` | Gap in pixels between trigger and dropdown popup. |
| `typeaheadTimeout` | number | `500` | Timeout in milliseconds for keyboard typeahead matching. |
| `keepMounted` | boolean | `false` | Keeps the dropdown DOM mounted when closed. |
| `aria-label` | string | — | Accessible label for the dropdown. |
| `onBlur` | object | — | (event: FocusEvent<HTMLElement>) => void - Fires when the trigger loses focus, with the native focus event. |
| `onFocus` | object | — | (event: FocusEvent<HTMLElement>) => void - Fires when the trigger takes focus, with the native focus event. |
| `onKeyDown` | object | — | (event: React.KeyboardEvent) => void - Fires on keydown events. |
| `clearIcon` | object | — | ReactNode — Replaces the clear button's glyph. Rendered as given. |
| `renderTrigger` | object | — | (triggerProps: MultiSelectSearchableDropdownTriggerRenderProps, state: MultiSelectSearchableDropdownTriggerState) => ReactNode - Custom render function for the trigger element. Spread triggerProps onto a <button>; draw from state (isOpen, selectedOptions, placeholder). |
| `searchInputAriaLabel` | string | `"Search options"` | Accessible label for the search input. |

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

1. **Default** — uses `DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES`
2. **Partial override** — your classes compose with that slot's defaults; slots you don't name keep theirs.

**A plain utility of yours wins over every default in its group on that slot, states included.**
`classes={{ control: "bg-green-500" }}` paints green in every state, where a default
`data-[state=checked]:` background would otherwise keep winning. To restyle one state only,
pass that state's own variant (`data-[state=checked]:bg-green-500`). Defaults in other groups stay.

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
<MultiSelectSearchableDropdown
  loadInitialOnOpen
  loadInitialOptions={() => fetch("/api/popular").then(r => r.json())}
  searchOptions={(q) => fetch(`/api/search?q=${q}`).then(r => r.json())}
/>
```

### Force dropdown position

```tsx
<MultiSelectSearchableDropdown
  options={options}
  dropdownSide="top"
  forceDropdownSide
  lockScroll
/>
```

---

## Forms

- **Submitted value.** With `name`, it submits one entry per selected value under that name, in option order (`a`, then `c`), as a native `<select multiple>` does, and nothing when none is selected. Read them with `FormData.getAll(name)`: a value containing a comma comes back whole.
- **Reset.** A form reset — a `type="reset"` button or `form.reset()` — restores an uncontrolled selection to `defaultValue` (or no selection), and the submitted value with it. Like a native input it fires no change callback: `onValueChange` is not called. A controlled MultiSelectSearchableDropdown is left alone: it keeps the `value` you pass and calls nothing, as a controlled React `<input>` does. Reset your own state in the form's `onReset` if you want the field cleared.
- **Required.** A `required` MultiSelectSearchableDropdown needs at least one value: with none, it blocks the form's submit and the browser's validation moves focus to the trigger. The field shows an error state only when you pass `error` and `errorMessage`.
- **Disabled.** A disabled MultiSelectSearchableDropdown submits nothing, as a disabled native control doesn't.

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Enter`, `Space` | Opens the menu, and toggles the focused option without closing it. |
| `ArrowDown`, `ArrowUp` | Moves between the filtered options. `aria-activedescendant` sits on the search input, which holds focus. |
| `Home`, `End` | Jumps to the first or last filtered option. |
| `Escape` | Closes the menu and returns focus to the trigger. Always: there is no prop to turn it off, because the APG combobox pattern requires Escape to close the popup. |
| `Tab` | Closes the menu and moves focus on. |
| Printable characters | Types into the search box and filters the list. |

---

## Ref API

The ref lands on the trigger, the `<button role="combobox">` a keyboard user tabs to, so `ref.current.focus()` focuses the field — which is what a form library calls on the first invalid field. With `renderTrigger`, it is the element your trigger attaches `triggerProps.ref` to.

```tsx
const ref = useRef<HTMLButtonElement>(null);
<MultiSelectSearchableDropdown ref={ref} options={options} />
// ref.current is the trigger <button>
```

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
| Styles wrong after overriding one class | Your class composes with the slot's defaults; only a utility in the same group replaces a default | Pass the utility that conflicts (a plain one overrides every state too), or use `unstyled` to start from nothing |
| Dropdown opens in wrong direction | Auto-flip | Use `forceDropdownSide` |
| Search not working | Using `options` prop with `searchOptions` | `searchOptions` replaces local filtering |
| Async results not appearing | `searchOptions` not returning array | Must return `Promise<MultiSelectOption[]>` |
| Options don't load on open | Missing `loadInitialOnOpen` | Add alongside `loadInitialOptions` |
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

The strip **wraps**; it does not clip. `maxVisible` (default 3) caps how
many chips render and the rest collapse into a count, so the strip cannot
overflow its trigger and there is nothing for a clip to protect against.

This is recorded because it was not decided once. `MultiSelectDropdown` shipped
`overflow: hidden` with `flex-wrap: nowrap` while `MultiSelectSearchableDropdown`
shipped `flex-wrap`, both introduced in the same commit — one titled for
unrelated Accordion work — and nothing in either component, schema or document
said which was intended. The clip also cost hit area: the remove control is 24px
via a negative margin inside a 20px row, so the clip took 4px out of the target a
pointer can reach while `target-size` still read 24x24 from the rect.
