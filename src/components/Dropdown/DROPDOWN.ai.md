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
| `renderTrigger` | Replaces the default `<button>`. You must spread all provided props and attach the `ref`. |
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

**Content (portal):**
- `data-state="open|closed"`
- `data-position="top|bottom"` — actual rendered position
- `data-dropdown-id` — unique ID for click-outside detection

**Options:**
- `data-selected`, `data-focused`, `data-disabled`, `data-value`

**DOM nesting:** `root > label? + description? + wrapper > trigger + content(portal) > optionList > option*`

---

## All Props

### Dropdown (root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `DropdownOption[]` | `[]` | Array of selectable options. |
| `value` | `string \| null` | — | Controlled selected value. |
| `defaultValue` | `string` | — | Uncontrolled initial value. |
| `onValueChange` | `(value: string \| null, option: DropdownOption \| null) => void` | — | Selection change callback. |
| `open` | `boolean` | — | Controlled open state. |
| `defaultOpen` | `boolean` | — | Uncontrolled initial open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Open state change callback. |
| `placeholder` | `ReactNode` | `"Select an option"` | Trigger text when nothing selected. |
| `disabled` | `boolean` | `false` | Disable the entire dropdown. |
| `error` | `boolean` | `false` | Error state styling. |
| `errorMessage` | `ReactNode` | — | Displayed below the dropdown with `role="alert"`. |
| `label` | `ReactNode` | — | Visible label above the trigger. |
| `description` | `ReactNode` | — | Helper text below the label. |
| `success` | `boolean` | `false` | Success state styling. |
| `successMessage` | `ReactNode` | — | Displayed below the dropdown. |
| `required` | `boolean` | `false` | Adds `*` to label, sets `aria-required`. |
| `clearable` | `boolean` | `false` | Adds clear button, allows deselect. |
| `noResultsContent` | `ReactNode` | `"No options available"` | Shown when options array is empty. |
| `showChevron` | `boolean` | `true` | Show/hide the chevron icon. |
| `showSelectedIcon` | `boolean` | `true` | Show check icon on selected option. |
| `selectedIcon` | `ReactNode` | — | Custom selected indicator. |
| `fullWidth` | `boolean` | `false` | Sets root to `width: 100%`. |
| `loading` | `boolean` | `false` | External loading state (shows shimmer). |
| `onLoadOptions` | `() => Promise<DropdownOption[]>` | — | Async option loader. |
| `loadOnOpen` | `boolean` | `false` | Trigger `onLoadOptions` when opened. |
| `onLoadError` | `(error: unknown) => void` | — | Error callback for async loading. |
| `shimmerCount` | `number` | `5` | Number of shimmer rows when loading. |
| `loadingText` | `ReactNode` | `"Loading..."` | SR announcement during load. |
| `unstyled` | `boolean` | `false` | Remove all default styles. |
| `classes` | `DropdownClasses` | — | Override individual style slots. |
| `className` | `string` | — | Additional class on root element. |
| `style` | `CSSProperties` | — | Inline style on root element. |
| `keepMounted` | `boolean` | `false` | Keep popup in DOM when closed (`display: none`). |
| `portalContainer` | `HTMLElement \| null` | `document.body` | Portal target. |
| `lockScroll` | `boolean` | `false` | Lock body scroll while open. |
| `dropdownPosition` | `"top" \| "bottom"` | `"bottom"` | Preferred popup direction (auto-flips). |
| `forceDropdownPosition` | `boolean` | `false` | Lock to `dropdownPosition`, no auto-flip. |
| `dropdownZIndex` | `number` | `50` | z-index of the portal popup. |
| `dropdownGap` | `number` | `4` | Gap (px) between trigger and popup. |
| `typeaheadTimeout` | `number` | `500` | Typeahead buffer reset delay (ms). |
| `aria-label` | `string` | — | Accessible name when no visible label. |
| `renderTrigger` | `(props: DropdownTriggerRenderProps) => ReactNode` | — | Custom trigger renderer. |
| `ChevronIcon` | `ComponentType` | Built-in | Custom chevron component. |
| `CheckIcon` | `ComponentType` | Built-in | Custom check icon component. |
| `ClearIcon` | `ComponentType` | Built-in | Custom clear icon component. |
| `ref` | `Ref<HTMLDivElement>` | — | Forwarded to root element. |

### DropdownOption

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | **Required.** Unique identifier. |
| `label` | `string` | **Required.** Display text (used for typeahead). |
| `content` | `ReactNode` | Custom render in option list. Falls back to `label`. |
| `selectedContent` | `ReactNode` | Custom render in trigger when selected. |
| `disabled` | `boolean` | Disable this option. |

---

## Styling Guide

### How class merging works

1. **Default** (no `classes`, no `unstyled`) — uses built-in Tailwind classes with dark mode support
2. **Partial override** (`classes={{ trigger: "..." }}`) — **replaces** that slot entirely, not additive
3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything via `classes`

### Slot → visual mapping

```
root
├── label
├── description
└── wrapper (relative container)
    ├── trigger (button)
    │   ├── triggerText (selected value or placeholder)
    │   └── chevron (icon)
    ├── clearIcon (button, absolute positioned)
    └── content (portal → fixed position)
        └── optionList (scrollable)
            └── option (repeated)
                ├── label/content
                └── checkIcon (when selected)
    noResults (when empty)
    shimmer / shimmerItem (when loading)
error
success
```

| "I want to change..." | Slot | Notes |
|------------------------|------|-------|
| Trigger button style | `trigger` | Includes border, bg, focus ring |
| Selected text appearance | `triggerText` | Has `truncate` by default |
| Popup container | `content` | Border, shadow, bg |
| Option row | `option` | Hover/cursor styles |
| Selected option highlight | `optionSelected` | Applied on top of `option` |
| Keyboard-focused option | `optionFocused` | Applied on top of `option` |
| Disabled option | `optionDisabled` | Includes `pointer-events-none` |
| Dropdown arrow icon | `chevron` | Size, color, transition |
| Check mark on selected | `checkIcon` | Size, color |
| Clear/X button | `clearIcon` | Absolutely positioned |
| Empty state | `noResults` | Centered text |
| Label text | `label` | Font, color, spacing |
| Error message | `error` | Below dropdown |
| Success message | `success` | Below dropdown |

### Dark mode

Defaults use Tailwind `dark:` variants, activated by `<html class="dark">`. When overriding a slot, always provide both light and dark variants:

```tsx
classes={{ trigger: "bg-white dark:bg-gray-900 text-black dark:text-white ..." }}
```

### Styling via data attributes

```css
/* Tailwind arbitrary variant */
<Dropdown classes={{ trigger: "data-[open]:ring-2 data-[error]:border-red-500" }} />

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
    triggerText: "flex-1 text-left truncate",
    content: "rounded-md shadow-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700",
    optionList: "max-h-60 overflow-y-auto py-1",
    option: "flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer",
    optionSelected: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    optionFocused: "bg-gray-100 dark:bg-gray-700",
    checkIcon: "w-4 h-4 text-indigo-600 dark:text-indigo-400",
    chevron: "w-4 h-4 text-gray-400 transition-transform duration-200",
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
  onLoadError={(err) => console.error(err)}
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
  renderTrigger={(props) => (
    <div ref={props.ref} {...props} className="custom-trigger">
      {props.selectedOption?.label || props.placeholder}
    </div>
  )}
/>
```

---

## Accessibility

- Trigger: `role="combobox"` with `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`
- Popup: `role="listbox"` with `role="option"` children
- `aria-activedescendant` tracks focused option for screen readers
- Label linked via `htmlFor` + `aria-labelledby`; falls back to `aria-label`
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
