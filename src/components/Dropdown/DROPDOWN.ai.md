# Dropdown

> A single-select dropdown (combobox) with portal rendering, keyboard navigation, async loading, and full style customization.

**Category:** Form
**Keywords:** dropdown, select, combobox, listbox, picker, option, menu, form control, single select

---

## Quick Answer

Use `<Dropdown options={[...]} />` for a styled select control. Supports controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) modes. Renders the popup via a React Portal so it's never clipped by `overflow: hidden` ancestors. Works out-of-the-box with built-in Tailwind styles.

---

## Import

```tsx
import { Dropdown } from "@chumlab/ui/dropdown";
import type { DropdownOption } from "@chumlab/ui/dropdown";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { useState } from "react";
import { Dropdown } from "@chumlab/ui/dropdown";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

export default function Example() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Dropdown
      options={options}
      value={value}
      onValueChange={(v) => setValue(v)}
      placeholder="Select a fruit..."
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
| `clearable` | Only works when a value is selected. Adds a clear button and allows deselect via click. |
| `onLoadOptions` | Requires `loadOnOpen={true}` to trigger. Returns `Promise<DropdownOption[]>`. |
| `loadOnOpen` | Only works when `onLoadOptions` is provided. |
| `forceDropdownPosition` | Only meaningful with `dropdownPosition`. Disables auto-flip. |
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
- `data-placeholder` — when no option is selected

**Content (portal):**
- `data-state="open|closed"`
- `data-position="top|bottom"` — actual rendered position
- `data-dropdown-id` — unique ID for click-outside detection

**Options:**
- `data-selected`, `data-highlighted`, `data-disabled`, `data-value`

**DOM nesting:** `root > label? + description? + wrapper > trigger + content(portal) > optionList > option*`

---

## All Props

<!-- generated from Dropdown.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | array | `[]` | List of selectable options. |
| `value` | string \| null | — | Controlled selected value. |
| `defaultValue` | string | — | Initial selected value for uncontrolled usage. |
| `onValueChange` | object | — | (value: string \| null, option: DropdownOption \| null) => void - Fires when the selected value changes. |
| `open` | boolean | — | Controlled open state. |
| `defaultOpen` | boolean | — | Whether the dropdown is initially open (uncontrolled). |
| `onOpenChange` | object | — | (open: boolean) => void - Fires when the open state changes. |
| `id` | string | — | HTML id attribute for the trigger element. |
| `name` | string | — | Form field name for the hidden input. |
| `placeholder` | object | `"Select an option"` | React.ReactNode - Content displayed when no option is selected. |
| `disabled` | boolean | `false` | Disables the dropdown. |
| `error` | boolean | `false` | Displays the dropdown in an error state. |
| `errorMessage` | object | — | React.ReactNode - Error message displayed below the dropdown. |
| `label` | object | — | React.ReactNode - Label rendered above the dropdown. |
| `description` | object | — | React.ReactNode - Description text rendered below the label. |
| `success` | boolean | `false` | Displays the dropdown in a success state. |
| `successMessage` | object | — | React.ReactNode - Success message displayed below the dropdown. |
| `required` | boolean | `false` | Marks the field as required. |
| `clearable` | boolean | `false` | Shows a clear button to deselect the current value. |
| `noResultsContent` | object | `"No options available"` | React.ReactNode - Content shown when no options are available. |
| `showChevron` | boolean | `true` | Whether to show the chevron icon in the trigger. |
| `showSelectedIcon` | boolean | `true` | Whether to show a check icon next to the selected option. |
| `selectedIcon` | object | — | React.ReactNode - Custom icon for the selected option indicator. |
| `fullWidth` | boolean | `false` | Makes the dropdown span the full width of its container. |
| `loading` | boolean | — | Shows a loading/shimmer state. |
| `onLoadOptions` | object | — | () => Promise<DropdownOption[]> - Async function to load options. Requires `loadOnOpen`; alone it never fires. |
| `loadOnOpen` | boolean | `false` | When true, calls onLoadOptions each time the dropdown opens. Requires `onLoadOptions`; alone it has nothing to load. |
| `onLoadError` | object | — | (error: unknown) => void - Called when async option loading fails. |
| `shimmerCount` | number | `5` | Number of shimmer placeholder items shown during loading. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `classes` | object | — | CSS class overrides for dropdown sub-elements. |
| `className` | string | — | Additional CSS class for the root element. |
| `style` | object | — | Inline styles for the root element. |
| `keepMounted` | boolean | `false` | Keeps the dropdown DOM mounted when closed. |
| `portalContainer` | object | — | HTMLElement \| null - Portal target for the dropdown popup. |
| `lockScroll` | boolean | `false` | Locks body scroll while the dropdown is open. |
| `dropdownPosition` | `"top"` \| `"bottom"` | `"bottom"` | Vertical placement of the dropdown relative to the trigger. |
| `forceDropdownPosition` | boolean | `false` | Locks the dropdown to the specified position without auto-flipping. |
| `dropdownZIndex` | number | `50` | Z-index of the dropdown popup. |
| `dropdownGap` | number | `4` | Gap in pixels between trigger and dropdown popup. |
| `typeaheadTimeout` | number | `500` | Timeout in milliseconds for keyboard typeahead matching. |
| `aria-label` | string | — | Accessible label for the dropdown. |
| `onBlur` | object | — | () => void - Fires when the dropdown loses focus. |
| `onFocus` | object | — | () => void - Fires when the dropdown receives focus. |
| `onKeyDown` | object | — | (event: React.KeyboardEvent) => void - Fires on keydown events. |
| `renderTrigger` | object | — | (triggerProps: DropdownTriggerRenderProps, state: DropdownTriggerState) => ReactNode - Custom render function for the trigger element. Spread triggerProps onto a <button>; draw from state (isOpen, selectedOption, placeholder). |
| `ChevronIcon` | object | — | React.ComponentType<{ className?: string; style?: CSSProperties }> - Custom chevron icon component. |
| `CheckIcon` | object | — | React.ComponentType<{ className?: string; style?: CSSProperties }> - Custom check icon component. |
| `ClearIcon` | object | — | React.ComponentType<{ className?: string; style?: CSSProperties }> - Custom clear icon component. |
| `loadingText` | object | `"Loading..."` | React.ReactNode - Text shown during async loading. |

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

1. **Default** (no `classes`, no `unstyled`) — uses built-in Tailwind classes with dark mode support
2. **Partial override** (`classes={{ trigger: "..." }}`) — **replaces** that slot entirely, not additive

**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything via `classes`

```tsx
// `item` carries the base AND 3 state variants. Overriding it
// replaces all of them, so write them together:
<Dropdown
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
└── control (relative container)
    ├── trigger (button)
    │   ├── value (selected value or placeholder)
    │   └── icon (icon)
    ├── clearTrigger (button, absolute positioned)
    └── content (portal → fixed position)
        └── list (scrollable)
            └── item (repeated)
                ├── label/content
                └── itemIndicator (when selected)
    empty (when empty)
    loading / loadingItem (when loading)
message
message
```

| "I want to change..." | Slot | Notes |
|------------------------|------|-------|
| Trigger button style | `trigger` | Includes border, bg, focus ring |
| Selected text appearance | `value` | Has `truncate` by default |
| Popup container | `content` | Border, shadow, bg |
| Option row | `item` | Hover/cursor styles |
| Selected option highlight |  | Applied on top of `item` |
| Keyboard-focused option |  | Applied on top of `item` |
| Disabled option | `optionDisabled` | Includes `pointer-events-none` |
| Dropdown arrow icon | `icon` | Size, color, transition |
| Check mark on selected | `itemIndicator` | Size, color |
| Clear/X button | `clearTrigger` | Absolutely positioned |
| Empty state | `empty` | Centered text |
| Label text | `label` | Font, color, spacing |
| Error message | `message` | Below dropdown |
| Success message | `message` | Below dropdown |

### Dark mode

Defaults use Tailwind `dark:` variants, activated by `<html class="dark">`. When overriding a slot, always provide both light and dark variants:

```tsx
classes={{ trigger: "bg-white dark:bg-gray-900 text-black dark:text-white ..." }}
```

### Styling via data attributes

```css
/* Tailwind arbitrary variant */
<Dropdown classes={{ trigger: "data-[open]:ring-2 data-[message]:border-red-500" }} />

/* Plain CSS */
[data-state="open"] { ... }
[data-disabled] { opacity: 0.5; }
```

### Complete themed example (Stripe-style)

```tsx
<Dropdown
  unstyled
  options={options}
  value={value}
  onValueChange={setValue}
  classes={{
    trigger: "flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
    value: "flex-1 text-left truncate",
    content: "rounded-md shadow-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700",
    list: "max-h-60 overflow-y-auto py-1",
    item: "flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer data-selected:bg-indigo-50 data-selected:text-indigo-700 dark:data-selected:bg-indigo-900/30 dark:data-selected:text-indigo-300 data-highlighted:bg-gray-100 dark:data-highlighted:bg-gray-700",
    itemIndicator: "w-4 h-4 text-indigo-600 dark:text-indigo-400",
    icon: "w-4 h-4 text-gray-400 transition-transform duration-200",
  }}
/>
```

---

## Patterns

### Controlled state

```tsx
const [value, setValue] = useState<string | null>(null);
<Dropdown options={options} value={value} onValueChange={(v) => setValue(v)} />
```

### Async loading on open

```tsx
<Dropdown
  loadOnOpen
  onLoadOptions={async () => {
    const res = await fetch("/api/options");
    return res.json();
  }}
  onLoadError={(err) => console.message(err)}
  placeholder="Click to load..."
/>
```

### With label, error, and form name

```tsx
<Dropdown
  label="Country"
  required
  name="country"
  error={!value}
  errorMessage="Please select a country"
  options={countries}
  value={value}
  onValueChange={setValue}
/>
```

### Custom trigger

```tsx
<Dropdown
  options={options}
  value={value}
  onValueChange={setValue}
  renderTrigger={(triggerProps, { selectedOption, placeholder }) => (
    <button {...triggerProps} className="custom-trigger">
      {selectedOption?.label ?? placeholder}
    </button>
  )}
/>
```

---

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Enter`, `Space` | Opens the menu from the trigger, and selects the focused option. |
| `ArrowDown`, `ArrowUp` | Moves between options, opening the menu first if it is closed. |
| `Home`, `End` | Jumps to the first or last option. |
| `Escape` | Closes the menu and returns focus to the trigger. Always: there is no prop to turn it off, because the APG combobox pattern requires Escape to close the popup. |
| `Tab` | Closes the menu and moves focus on. |
| `Backspace`, `Delete` | Clears the selection when the trigger has focus and `clearable` is set. |
| Printable characters | Type-ahead within `typeaheadTimeout` of the last keystroke. |

---

## Accessibility

- Trigger: `role="combobox"` with `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`
- Popup: `role="listbox"` with `role="option"` children
- `aria-activedescendant` tracks focused option for screen readers
- Named by `label` (via `aria-labelledby`), then `aria-label`. With neither, the name
  falls back to the element showing the value or placeholder — `combobox` is not a
  name-from-content role, so without that the trigger has no accessible name at all.
  A development warning still asks for a real label.
- Error messages linked via `aria-describedby` with `role="alert"`
- `aria-live="polite"` status region announces loading state and option count
- Keyboard: ArrowDown/Up, Home, End, Enter, Space, Escape, Tab, Delete/Backspace (clear)
- Type-ahead: A-Z/0-9 jumps to matching option
- Focus restores to trigger on close
- Disabled options receive `aria-disabled` and are skipped during navigation

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Dropdown clipped by parent overflow | Not using portal | Default behavior uses portal — ensure `portalContainer` is not set to a clipped container |
| Styles look wrong after setting one class | `classes` replaces per slot, not merges | Provide full class string for each slot you override |
| Dropdown opens in wrong direction | Auto-flip chose different position | Use `forceDropdownPosition={true}` to lock direction |
| Options don't load on open | Missing `loadOnOpen` prop | Add `loadOnOpen` alongside `onLoadOptions` |
| Controlled value doesn't update | Missing `onValueChange` | Always pair `value` with `onValueChange` |
| Clear button not visible | `clearable` not set | Add `clearable` prop |
| Form doesn't submit value | Missing `name` prop | Add `name` to render hidden input |
| Typeahead not working | Dropdown not focused | Click or Tab to the trigger first |
| Typed characters not visible | Not a bug — typeahead is navigation, not a search field | Focus jumps to the match; nothing is rendered, as with a native select. Use SearchableDropdown for a visible search input |

---

## Demo Reference

**File:** `src/pages/demo/DropdownDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | Simplest controlled dropdown |
| All states | `title="State Variations"` | Default, selected, disabled, error, loading |
| Uncontrolled | `title="Uncontrolled (defaultValue)"` | defaultValue usage |
| Controlled open | `title="Controlled Open State"` | open + onOpenChange |
| Clearable | `title="Clearable"` | clearable prop demo |
| Custom trigger | `title="Custom Trigger (renderTrigger)"` | renderTrigger usage |
| Rich content | `title="With Custom Content"` | option.content with JSX |
| Async loading | `title="Async Data Fetching with Shimmer"` | loadOnOpen + onLoadOptions |
| Custom themes | `title="Custom Theme Examples"` | Multiple themed styles |
| Force position | `forceDropdownPosition` | Forced top/bottom |
| Lock scroll | `lockScroll` | Scroll lock + force position |
| Form integration | `title="Form Integration (onBlur / onFocus)"` | onBlur, onFocus callbacks |
| All features | `title="Combined: All Features"` | Every prop on one dropdown |
| Props reference | `title="Dropdown Props"` | Full props table |
| Class slots | `title="DropdownClasses Slots"` | Slot descriptions |
| Accessibility | `title="Accessibility"` | Keyboard reference + ARIA list |

### Source file index

| File | Contains |
|------|----------|
| `Dropdown.tsx` | Main component, DropdownContent (portal), DropdownOptionItem |
| `utils/useDropdown.ts` | State machine: selection, open/close, keyboard, typeahead, async loading |
| `utils/types.ts` | DropdownProps, DropdownOption, DropdownClasses, DropdownTriggerRenderProps |
| `utils/helpers.ts` | Position calculation, scroll-into-view, isBrowser |
| `utils/constants.ts` | DEFAULT_DROPDOWN_CLASSES, UNSTYLED_DROPDOWN_CLASSES |
| `utils/icons.tsx` | ChevronDownIcon, CheckIcon, ClearIcon (inline SVGs) |
| `components/DropdownShimmer.tsx` | Loading skeleton component |
| `index.ts` | Barrel exports |
