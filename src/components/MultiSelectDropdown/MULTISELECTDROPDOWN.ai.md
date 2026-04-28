# MultiSelectDropdown

> A multi-select dropdown with chip display, checkbox options, async loading, and full style customization.

**Category:** Form
**Keywords:** multi-select, dropdown, multiselect, checkbox, chips, tags, multiple, select, listbox, combobox, form control

---

## Quick Answer

Use `<MultiSelectDropdown options={[...]} value={selected} onValueChange={setSelected} />` for a multi-select control with chip display. Supports controlled/uncontrolled modes, async option loading, custom rendering, and portal-based positioning. Works out-of-the-box with built-in Tailwind styles.

---

## Import

```tsx
import { MultiSelectDropdown } from "@chumlab/ui/multi-select-dropdown";
import type { MultiSelectOption } from "@chumlab/ui/multi-select-dropdown";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { useState } from "react";
import { MultiSelectDropdown } from "@chumlab/ui/multi-select-dropdown";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

export default function Example() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <MultiSelectDropdown
      options={options}
      value={selected}
      onValueChange={(values) => setSelected(values)}
      placeholder="Select fruits..."
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
| `onLoadOptions` | Requires `loadOnOpen={true}` to trigger. Returns `Promise<MultiSelectOption[]>`. |
| `loadOnOpen` | Only works when `onLoadOptions` is provided. |
| `forceDropdownPosition` | Only meaningful with `dropdownPosition`. Disables auto-flip. |
| `lockScroll` | Prevents body scroll while open. Default: `false`. |
| `showSelectedChips` | Default `true`. Set `false` to show count-only display. |
| `maxDisplayedChips` | Truncates chips with "+N more" badge. |
| `clearable` | Shows clear button when values are selected. |
| `name` | Renders hidden `<input>` elements for native form submission. |
| `renderTrigger` | Replaces the default trigger. Must spread all provided props and attach `ref`. |

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
- `data-placeholder` — when no options are selected

**Dropdown panel:**
- `data-position` — `"top"` or `"bottom"` (actual rendered position)

DOM nesting: `root > label + description + wrapper > trigger(combobox) + content(portal) > optionList(listbox) > options`

---

## All Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `MultiSelectOption[]` | `[]` | Available options |
| `value` | `string[]` | — | Controlled selected values |
| `defaultValue` | `string[]` | — | Initial values (uncontrolled) |
| `onValueChange` | `(values, options) => void` | — | Selection change callback |
| `placeholder` | `ReactNode` | — | Trigger placeholder |
| `label` | `ReactNode` | — | Label (auto-associated via htmlFor) |
| `description` | `ReactNode` | — | Helper text below label |
| `disabled` | `boolean` | `false` | Disable component |
| `required` | `boolean` | `false` | Required field |
| `error` | `boolean` | `false` | Error state |
| `errorMessage` | `ReactNode` | — | Error message |
| `success` | `boolean` | `false` | Success state |
| `successMessage` | `ReactNode` | — | Success message |
| `clearable` | `boolean` | `false` | Show clear button |
| `showChevron` | `boolean` | `true` | Show chevron icon |
| `showSelectedChips` | `boolean` | `true` | Show chips vs count |
| `maxDisplayedChips` | `number` | — | Max visible chips |
| `checkboxIcon` | `ReactNode` | — | Custom checkbox icon |
| `fullWidth` | `boolean` | `false` | Full container width |
| `loading` | `boolean` | `false` | Loading state |
| `onLoadOptions` | `() => Promise<Option[]>` | — | Async options loader |
| `loadOnOpen` | `boolean` | `false` | Load options on open |
| `shimmerCount` | `number` | `5` | Shimmer placeholder count |
| `lockScroll` | `boolean` | `false` | Lock body scroll |
| `dropdownPosition` | `"top" \| "bottom"` | `"bottom"` | Preferred position |
| `forceDropdownPosition` | `boolean` | `false` | Lock position, no auto-flip |
| `dropdownZIndex` | `number` | `50` | Dropdown z-index |
| `dropdownGap` | `number` | `4` | Gap between trigger and dropdown |
| `portalContainer` | `HTMLElement \| null` | `document.body` | Portal target |
| `keepMounted` | `boolean` | `false` | Keep DOM when closed |
| `classes` | `MultiSelectDropdownClasses` | — | Per-slot class overrides |
| `unstyled` | `boolean` | `false` | Strip all defaults |
| `name` | `string` | — | Form field name |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open) => void` | — | Open state callback |
| `renderTrigger` | `(props) => ReactNode` | — | Custom trigger renderer |

---

## Styling Guide

### How class merging works

1. **Default** (no `classes`, no `unstyled`) — uses `DEFAULT_MULTISELECTDROPDOWN_CLASSES`
2. **Partial override** (`classes` without `unstyled`) — **replaces** per slot, not additive
3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything

### Slot → visual mapping

```
root
├── label
├── description
└── wrapper
    └── trigger (role="combobox")
    │   ├── chips (chip + chipRemove) or triggerText
    │   ├── moreCount (+N more)
    │   ├── clearIcon
    │   └── chevron
    └── content (portal)
        └── optionList (role="listbox")
            └── option (checkbox + checkboxIcon + label)
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Trigger button | `trigger` | Contains chips/text |
| Selected chips | `chip`, `chipRemove` | Individual chip + X button |
| Dropdown panel | `content` | Portal-rendered |
| Option row | `option`, `optionSelected`, `optionFocused` | |
| Checkbox | `checkbox`, `checkboxChecked`, `checkboxIcon` | |
| Chevron icon | `chevron` | |
| "+N more" badge | `moreCount` | |

### Dark mode

Defaults use Tailwind `dark:` prefix. When overriding, always provide both light and dark variants.

---

## Patterns

### Controlled multi-select

```tsx
const [values, setValues] = useState<string[]>([]);
<MultiSelectDropdown
  options={options}
  value={values}
  onValueChange={(v) => setValues(v)}
  placeholder="Select..."
/>
```

### Async loading on open

```tsx
<MultiSelectDropdown
  loadOnOpen
  onLoadOptions={() => fetch("/api/options").then(r => r.json())}
  placeholder="Click to load..."
/>
```

### Force dropdown position

```tsx
<MultiSelectDropdown
  options={options}
  dropdownPosition="top"
  forceDropdownPosition
  lockScroll
/>
```

---

## Accessibility

- `role="combobox"` on trigger with `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`
- `role="listbox"` with `aria-multiselectable="true"` on option list
- `role="option"` with `aria-selected` on each option
- `aria-activedescendant` tracks keyboard focus
- Arrow keys navigate options, Enter/Space toggle selection
- Escape closes dropdown, Tab moves focus out
- Chip remove buttons have `aria-label="Remove {label}"`
- SR-only live region announces selection changes
- Supports `aria-label`, `aria-labelledby`, `aria-describedby`

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Styles wrong after overriding one class | `classes` replaces per slot | Provide full class string for each slot |
| Dropdown opens in wrong direction | Auto-flip chose different position | Use `forceDropdownPosition` |
| Options don't load on open | Missing `loadOnOpen` prop | Add `loadOnOpen` alongside `onLoadOptions` |
| Controlled value not updating | Missing `onValueChange` | Pair `value` with `onValueChange` |
| Chips not showing | `showSelectedChips={false}` | Set to `true` (default) |
| Clear button not visible | `clearable` not set | Add `clearable` prop |
| Dropdown clipped by parent | Not using portal | Default uses portal; check `portalContainer` |

---

## Demo Reference

**File:** `src/pages/demo/MultiSelectDropdownDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Minimal example | `title="Basic Usage"` |
| State variations | `title="State Variations"` |
| Custom content | `title="With Custom Content"` |
| Async loading | `title="Async Data Fetching with Shimmer"` |
| Disabled options | `title="With Disabled Options"` |
| Count-only | `title="Without Chips (Count Only)"` |
| Style variants | `title="Style Variants"` |
| Position control | `title="Dropdown Position"` |
| Force position | `forceDropdownPosition` |
| Scroll lock | `title="Scroll Lock"` |
| Form integration | `title="Form Integration"` |
| Custom themes | `title="Dark Theme"`, `title="Purple Theme"` |
| Custom checkboxes | `title="Custom Checkbox"` |
| Combined | `title="Combined: All Features"` |

### Source file index

| File | Contains |
|------|----------|
| `MultiSelectDropdown.tsx` | Main component, content positioning, ref forwarding |
| `utils/types.ts` | Props, classes, trigger render props, hook types |
| `utils/constants.ts` | DEFAULT + UNSTYLED class maps |
| `utils/helpers.ts` | `computeDropdownCoords`, `scrollOptionIntoView` |
| `utils/useMultiSelectDropdown.ts` | Core hook: selection, keyboard, async loading |
| `utils/icons.tsx` | ChevronDown, Check, X icons |
| `components/MultiSelectDropdownOption.tsx` | Option row with checkbox |
| `components/SelectedChip.tsx` | Chip with remove button |
| `components/MultiSelectDropdownShimmer.tsx` | Loading shimmer |
| `index.ts` | Public exports |
