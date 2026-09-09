# Checkbox

> A customizable checkbox with label, description, indeterminate state, custom icons, sizes, shapes, and accessible via native `<input>`.

**Category:** Form
**Keywords:** checkbox, toggle, check, tick, indeterminate, form input, boolean, selection

---

## Quick Answer

Use `<Checkbox label="Accept" checked={val} onValueChange={setVal} />` for a basic labeled checkbox. Supports `indeterminate` for tree/list "select all" patterns. Works out-of-the-box with built-in dark mode styles.

---

## Import

```tsx
import { Checkbox } from "@chumlab/ui/checkbox";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Checkbox } from "@chumlab/ui/checkbox";
import { useState } from "react";

export default function Example() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="I agree to the terms"
      checked={checked}
      onValueChange={setChecked}
    />
  );
}
```

This renders correctly with no additional props, classes, or setup.

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `defaultChecked` | Uncontrolled mode. Cannot be used with `checked`. |
| `size` | Preset string (`"xs"` to `"xl"`) or number (pixel value). |
| `classes.control` with `data-[state=checked]:` / `data-[state=unchecked]:` | REPLACE per slot. Provide full styling — not additive. |

---

## Data Attributes (for CSS selectors and testing)

- `data-checked` on root and checkbox span — when checked
- `data-indeterminate` on root and checkbox span — when indeterminate
- `data-disabled` on checkbox span — when disabled
- `data-error` on checkbox span — when `error={true}`
- `data-size` on root — preset size name (not set for numeric sizes)
- `data-shape` on root — "square", "rounded", or "circle"
- `data-reduce-motion` on root — when reduced motion active
- `data-loading` on root — when loading
- `data-valid` on root — when success state

DOM nesting: `root > label > (checkbox-span > hidden-input + icon) + (labelContainer > label-text + description) + error/success`

---

## All Props

<!-- generated from Checkbox.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | object | — | React.ReactNode — Text label rendered beside the checkbox. |
| `description` | object | — | React.ReactNode — Helper text rendered below the label. |
| `checked` | boolean | — | Controlled checked state. |
| `defaultChecked` | boolean | `false` | Initial checked state for uncontrolled usage. |
| `indeterminate` | boolean | `false` | Displays the indeterminate (minus) indicator instead of a checkmark. |
| `onValueChange` | object | — | (checked: boolean) => void — Fires when the checked state changes. |
| `onFocus` | object | — | (event: FocusEvent) => void |
| `onBlur` | object | — | (event: FocusEvent) => void |
| `error` | boolean | `false` | Displays the checkbox in an error state. |
| `errorMessage` | object | — | React.ReactNode — Error message displayed below the checkbox. |
| `success` | boolean | `false` | Displays the checkbox in a success state. |
| `successMessage` | object | — | React.ReactNode — Success message displayed below the checkbox. |
| `loading` | boolean | `false` | Displays the checkbox in a loading state. |
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| number | `"md"` | Size of the checkbox indicator. |
| `shape` | `"square"` \| `"rounded"` \| `"circle"` | `"rounded"` | Shape of the checkbox indicator. |
| `checkedIcon` | object | — | React.ReactNode — Custom icon for the checked state. |
| `uncheckedIcon` | object | — | React.ReactNode — Custom icon for the unchecked state. |
| `indeterminateIcon` | object | — | React.ReactNode — Custom icon for the indeterminate state. |
| `classes` | object | — | CSS class overrides for checkbox sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `reduceMotion` | boolean \| `"auto"` | `"auto"` | Motion override. `"auto"` follows the OS `prefers-reduced-motion` setting; `true` always reduces; `false` always animates, including for a user who asked for less. |
| `disabled` | boolean | `false` | Disables the checkbox. |
| `name` | string | — | Form field name. |
| `value` | string | — | Form field value. |
| `id` | string | — | HTML id attribute. |
| `required` | boolean | `false` | Marks the checkbox as required. |

## Styling Guide

### How class merging works

1. **Default** (no classes, no unstyled) — uses `DEFAULT_CHECKBOX_CLASSES` with dark mode
2. **Partial override** (`classes={{ checked: "..." }}`) — REPLACES that slot, others keep defaults

**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything

```tsx
// `control` carries the base AND 3 state variants. Overriding it
// replaces all of them, so write them together:
<Checkbox
  classes={{
    control:
      "rounded-cl-md px-2 py-1 " +           // base
      "data-[state=checked]:bg-cl-accent " +
      "data-[state=indeterminate]:bg-cl-accent/60 " +
      "data-[state=unchecked]:bg-transparent ",
  }}
/>

// Passing only `control: "data-[state=checked]:…"` drops the base and the other
// 2 states.
```

### Slot → visual mapping

```
root
└── label (implicit, wraps everything)
    ├── control [contains hidden input + itemIndicator]
    │   ├── (hidden native input)
    │   └── itemIndicator (check / indeterminate / unchecked)
    └── labelGroup
        ├── label (text)
        └── description (text)
message / message (below)
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Box color when checked | `checked` | Background + border + text color |
| Box color when unchecked | `control` + `data-[state=unchecked]:` | Background + border |
| Box border radius | `control` | Or use `shape` prop |
| Label text style | `label` | Font size, color, weight |
| Error message style | `message` | Color, size |
| Check icon | `itemIndicator` | Or use `checkedIcon` prop for custom element |

### Dark mode

Defaults use Tailwind `dark:` prefix. When overriding, provide both variants:

```tsx
classes={{
  control:
    "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-green-500 dark:data-[state=checked]:border-green-500 data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-300 dark:data-[state=unchecked]:bg-gray-800 dark:data-[state=unchecked]:border-gray-600",
}}
```

### Styling via data attributes

```css
[data-checked] .checkbox-label { font-weight: bold; }
[data-error] { border-color: red; }
[data-indeterminate] { opacity: 0.8; }
```

### Complete themed example

```tsx
<Checkbox
  unstyled
  label="Subscribe to newsletter"
  description="Get weekly updates"
  checked={checked}
  onValueChange={setChecked}
  shape="circle"
  classes={{
    root: "",
    control:
      "w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 inline-flex items-center justify-center transition-colors " +
      "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:text-white " +
      "data-[state=unchecked]:bg-white dark:data-[state=unchecked]:bg-gray-900",
    label: "text-sm font-medium text-gray-800 dark:text-gray-200",
    description: "text-xs text-gray-500 dark:text-gray-400",
  }}
/>
```

---

## Patterns

### Indeterminate "Select All"

```tsx
const [items, setItems] = useState([false, false, false]);
const allChecked = items.every(Boolean);
const someChecked = items.some(Boolean);

<Checkbox
  label="Select All"
  checked={allChecked}
  indeterminate={someChecked && !allChecked}
  onValueChange={(checked) => setItems(items.map(() => checked))}
/>
{items.map((checked, i) => (
  <Checkbox
    key={i}
    label={`Item ${i + 1}`}
    checked={checked}
    onValueChange={(v) => {
      const next = [...items];
      next[i] = v;
      setItems(next);
    }}
  />
))}
```

### Form integration

```tsx
<Checkbox
  name="terms"
  required
  error={!!errors.terms}
  errorMessage={errors.terms}
  label="I accept the Terms of Service"
  checked={accepted}
  onValueChange={setAccepted}
/>
```

### Custom icons

```tsx
<Checkbox
  checkedIcon={<HeartIcon className="w-3 h-3 text-pink-500" />}
  uncheckedIcon={<HeartOutlineIcon className="w-3 h-3 text-gray-400" />}
/>
```

---

## Keyboard Interactions

A native `<input type="checkbox">`, so the browser owns this — `Enter` deliberately does nothing, as it does not on any checkbox.

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves focus to the checkbox. |
| `Space` | Toggles it, including out of the indeterminate state. |

---

## Accessibility

- Uses native `<input type="checkbox">`, so keyboard behaviour and accessibility-tree semantics come from the platform rather than from ARIA
- `<label>` wraps the input (implicit association)
- `aria-invalid` set when `error={true}`
- `aria-required` set when `required={true}`
- `aria-describedby` links error/success messages and description
- Error and success messages use `role="alert"` for live announcements
- Supports `prefers-reduced-motion` via `reduceMotion` prop
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.
---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Checkbox doesn't toggle | Using `checked` without `onValueChange` | Add `onValueChange` handler or use `defaultChecked` |
| Indeterminate not showing | `indeterminate` not set | Pass `indeterminate={true}` — it's visual only |
| Custom icon wrong size | Icon doesn't match checkbox size | Use the `itemIndicator` class slot or size your icon to match |
| Classes don't merge | Expected additive | Classes REPLACE per slot. Provide complete styling. |
| Checkbox invisible in dark mode | Overrode `unchecked` without dark variant | Add `dark:` classes to your override |
| Click doesn't work | Label not wrapping input | Ensure you're not breaking the component structure with `asChild` |
| Error message not announced | Missing aria connection | Built-in — uses `aria-describedby` + `role="alert"` |
| Shape looks wrong | Wrong `shape` prop | Use `"square"`, `"rounded"`, or `"circle"` |

---

## Demo Reference

**File:** `src/pages/demo/CheckboxDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | Simple checkbox with aria-label |
| With label | `title="With Label"` | Label prop usage |
| Indeterminate | `title="Indeterminate State"` | Select-all pattern |
| Sizes | `title="Sizes"` | xs through xl |
| Shapes | `title="Shapes"` | square, rounded, circle |
| Custom icons | `title="Custom Icons"` | checkedIcon + uncheckedIcon |
| Error state | `title="Error State"` | error + errorMessage |
| Classes system | `title="Classes System"` | Per-slot overrides |

Source file index:

| File | Contains |
|------|----------|
| `Checkbox.tsx` | Main component with forwardRef, state management, rendering |
| `utils/types.ts` | CheckboxProps, CheckboxClasses, CheckboxSize, CheckboxShape |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes, SIZE_MAP, SHAPE_CLASS_MAP |
| `utils/icons.tsx` | CheckIcon, IndeterminateIcon SVG components |
| `index.ts` | Public exports |
