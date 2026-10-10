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
| `loadOptions` | Requires `loadOnOpen={true}` to trigger. Returns `Promise<MultiSelectOption[]>`. |
| `loadOnOpen` | Only works when `loadOptions` is provided. |
| `forceDropdownSide` | Only meaningful with `dropdownSide`. Disables auto-flip. |
| `lockScroll` | Prevents body scroll while open. Default: `false`. |
| `showSelectedChips` | Default `true`. Set `false` to show count-only display. |
| `maxVisible` | Truncates chips with "+N more" badge. |
| `clearable` | Shows clear button when values are selected. |
| `name` | Renders hidden `<input>` elements for native form submission. |
| `renderTrigger` | `renderTrigger(triggerProps, state)` replaces the default `<button>`. Spread `triggerProps` onto a `<button>`: it is exactly what the default trigger renders, ref and `type="button"` included. Draw from `state` (`isOpen`, `selectedOptions`, `placeholder`), which never reaches the DOM. |

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
- `data-placeholder` — when no options are selected

**Dropdown panel:**
- `data-position` — `"top"` or `"bottom"` (actual rendered position)

DOM nesting: `root > label + description + wrapper > trigger(combobox) + content(portal) > optionList(listbox) > options`

---

## All Props

<!-- generated from MultiSelectDropdown.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | array | `[]` | List of selectable options. |
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
| `emptyContent` | object | `"No options found"` | React.ReactNode - Content shown when no options are available. |
| `clearable` | boolean | `false` | Shows a clear button to deselect all values. |
| `showChevron` | boolean | `true` | Whether to show the chevron icon in the trigger. |
| `fullWidth` | boolean | `false` | Makes the dropdown span the full width of its container. |
| `loading` | boolean | — | Shows a loading/shimmer state. |
| `loadOptions` | object | — | () => Promise<MultiSelectOption[]> - Async function to load options. Requires `loadOnOpen`; alone it never fires. |
| `loadOnOpen` | boolean | `false` | When true, calls loadOptions each time the dropdown opens. Requires `loadOptions`; alone it has nothing to load. |
| `onLoadError` | object | — | (error: unknown) => void - Called when async option loading fails. |
| `shimmerCount` | number | `5` | Number of shimmer placeholder items shown during loading. |
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
| `keepMounted` | boolean | `false` | Keeps the dropdown DOM mounted when closed. |
| `portalContainer` | object | — | HTMLElement \| null - Portal target for the dropdown popup. |
| `dropdownSide` | `"top"` \| `"bottom"` | `"bottom"` | Vertical placement of the dropdown relative to the trigger. |
| `forceDropdownSide` | boolean | `false` | Locks the dropdown to the specified position without auto-flipping. |
| `dropdownZIndex` | number | `50` | Z-index of the dropdown popup. |
| `dropdownOffset` | number | `4` | Gap in pixels between trigger and dropdown popup. |
| `typeaheadTimeout` | number | `500` | Timeout in milliseconds for keyboard typeahead matching. |
| `aria-label` | string | — | Accessible label for the dropdown. |
| `onBlur` | object | — | (event: FocusEvent<HTMLElement>) => void - Fires when the trigger loses focus, with the native focus event. |
| `onFocus` | object | — | (event: FocusEvent<HTMLElement>) => void - Fires when the trigger takes focus, with the native focus event. |
| `onKeyDown` | object | — | (event: React.KeyboardEvent) => void - Fires on keydown events. |
| `chevronIcon` | object | — | ReactNode — Replaces the trigger's chevron. Rendered inside a box carrying `classes.icon`, which turns it over while the menu is open. |
| `loadingContent` | object | `"Loading..."` | React.ReactNode - Text shown during async loading. |
| `clearIcon` | object | — | ReactNode — Replaces the clear button's glyph. Rendered as given. |
| `renderTrigger` | object | — | (triggerProps: MultiSelectDropdownTriggerRenderProps, state: MultiSelectDropdownTriggerState) => ReactNode - Custom render function for the trigger element. Spread triggerProps onto a <button>; draw from state (isOpen, selectedOptions, placeholder). |

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

1. **Default** (no `classes`, no `unstyled`) — uses `DEFAULT_MULTISELECTDROPDOWN_CLASSES`
2. **Partial override** (`classes` without `unstyled`) — **replaces** per slot, not additive

**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything

```tsx
// `item` carries the base AND 3 state variants. Overriding it
// replaces all of them, so write them together:
<MultiSelectDropdown
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
    │   ├── chips (chip + chipRemove) or value
    │   ├── count (+N more)
    │   ├── clearTrigger
    │   └── icon
    └── content (portal)
        └── list (role="listbox")
            └── item (itemControl + itemIndicator + label)
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Trigger button | `trigger` | Contains chips/text |
| Selected chips | `chip`, `chipRemove` | Individual chip + X button |
| Dropdown panel | `content` | Portal-rendered |
| Option row | `item` | |
| Checkbox | `itemControl`, `itemIndicator` | |
| Chevron icon | `icon` | |
| "+N more" badge | `count` | |

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
  loadOptions={() => fetch("/api/options").then(r => r.json())}
  placeholder="Click to load..."
/>
```

### Force dropdown position

```tsx
<MultiSelectDropdown
  options={options}
  dropdownSide="top"
  forceDropdownSide
  lockScroll
/>
```

---

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Enter`, `Space` | Opens the menu, and toggles the focused option without closing it. |
| `ArrowDown`, `ArrowUp` | Moves between options. `aria-activedescendant` on the trigger follows, so focus itself never leaves it. |
| `Home`, `End` | Jumps to the first or last option. |
| `Escape` | Closes the menu and returns focus to the trigger. Always: there is no prop to turn it off, because the APG combobox pattern requires Escape to close the popup. |
| `Tab` | Closes the menu and moves focus on. |

---

## Accessibility

- `role="combobox"` on trigger with `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`
- `role="listbox"` with `aria-multiselectable="true"` on option list
- `role="option"` with `aria-selected` on each option
- `aria-activedescendant` tracks keyboard focus, on the trigger, which keeps the focus
- Named by `label`, then `aria-label`. With neither, the name falls back to the element
  showing the value or placeholder: `combobox` is not a name-from-content role, so the
  visible text alone gave the trigger no accessible name. A development warning still
  asks for a real label.
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
| Dropdown opens in wrong direction | Auto-flip chose different position | Use `forceDropdownSide` |
| Options don't load on open | Missing `loadOnOpen` prop | Add `loadOnOpen` alongside `loadOptions` |
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
| Force position | `forceDropdownSide` |
| Scroll lock | `title="Scroll Lock"` |
| Form integration | `title="Form Integration (onBlur / onFocus)"` |
| Custom themes | `title="Dark Theme"`, `title="Blue Theme"` |
| Custom checkboxes | `title="Custom Checkbox - Green Rounded"` |
| Combined | `title="Combined: All Features"` |

### Source file index

| File | Contains |
|------|----------|
| `MultiSelectDropdown.tsx` | Main component, content positioning, ref forwarding |
| `utils/types.ts` | Props, classes, trigger render props, hook types |
| `utils/constants.ts` | DEFAULT + UNSTYLED class maps |
| `utils/helpers.ts` | `scrollOptionIntoView` |
| `utils/useMultiSelectDropdown.ts` | Core hook: selection, keyboard, async loading |
| `utils/icons.tsx` | ChevronDown, Check, X icons |
| `components/MultiSelectDropdownOption.tsx` | Option row with checkbox |
| `components/SelectedChip.tsx` | Chip with remove button |
| `components/MultiSelectDropdownShimmer.tsx` | Loading shimmer |
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
