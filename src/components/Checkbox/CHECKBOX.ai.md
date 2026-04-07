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
| `checked` + `onValueChange` | Controlled mode. Must provide both. |
| `defaultChecked` | Uncontrolled mode. Cannot be used with `checked`. |
| `indeterminate` | Overrides checked visual. The underlying input is still checked/unchecked. |
| `onCheckedChange` | Deprecated — use `onValueChange` instead. If both provided, `onValueChange` wins. |
| `size` | Preset string (`"xs"` to `"xl"`) or number (pixel value). |
| `classes.checked` / `classes.unchecked` | REPLACE per slot. Provide full styling — not additive. |

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
- `data-success` on root — when success state

DOM nesting: `root > label > (checkbox-span > hidden-input + icon) + (labelContainer > label-text + description) + error/success`

---

## All Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Text beside the checkbox |
| `description` | `ReactNode` | — | Helper text below the label |
| `checked` | `boolean` | — | Controlled checked state |
| `defaultChecked` | `boolean` | — | Initial state (uncontrolled) |
| `indeterminate` | `boolean` | `false` | Shows minus icon instead of check |
| `onValueChange` | `(checked: boolean) => void` | — | Fires on state change |
| `disabled` | `boolean` | `false` | Disables the checkbox |
| `required` | `boolean` | `false` | Marks as required |
| `error` | `boolean` | `false` | Error state |
| `errorMessage` | `ReactNode` | — | Error text below checkbox |
| `success` | `boolean` | `false` | Success state |
| `successMessage` | `ReactNode` | — | Success text below checkbox |
| `loading` | `boolean` | `false` | Loading state |
| `size` | `CheckboxSize` | `"md"` | xs/sm/md/lg/xl or pixel number |
| `shape` | `CheckboxShape` | `"rounded"` | square/rounded/circle |
| `checkedIcon` | `ReactNode` | Built-in check | Custom icon when checked |
| `uncheckedIcon` | `ReactNode` | — | Custom icon when unchecked |
| `indeterminateIcon` | `ReactNode` | Built-in minus | Custom icon when indeterminate |
| `classes` | `CheckboxClasses` | — | Per-slot class overrides |
| `unstyled` | `boolean` | `false` | Remove all default styles |
| `reduceMotion` | `boolean \| "auto"` | `"auto"` | Motion preference control |
| `name` | `string` | — | Form field name |
| `id` | `string` | auto | Checkbox input ID |
| `aria-label` | `string` | — | Accessible label (when no visible label) |

---

## Styling Guide

### How class merging works

1. **Default** (no classes, no unstyled) — uses `DEFAULT_CHECKBOX_CLASSES` with dark mode
2. **Partial override** (`classes={{ checked: "..." }}`) — REPLACES that slot, others keep defaults
3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything

### Slot → visual mapping

```
root
└── label (implicit, wraps everything)
    ├── checkbox [contains hidden input + icon]
    │   ├── (hidden native input)
    │   └── icon (check / indeterminate / unchecked)
    └── labelContainer
        ├── label (text)
        └── description (text)
error / success (below)
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Box color when checked | `checked` | Background + border + text color |
| Box color when unchecked | `unchecked` | Background + border |
| Box border radius | `checkbox` | Or use `shape` prop |
| Label text style | `label` | Font size, color, weight |
| Error message style | `error` | Color, size |
| Check icon | `icon` | Or use `checkedIcon` prop for custom element |

### Dark mode

Defaults use Tailwind `dark:` prefix. When overriding, provide both variants:

```tsx
classes={{
  checked: "bg-green-600 border-green-600 text-white dark:bg-green-500 dark:border-green-500",
  unchecked: "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600",
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
    checkbox: "w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 inline-flex items-center justify-center transition-colors",
    checked: "bg-emerald-500 border-emerald-500 text-white",
    unchecked: "bg-white dark:bg-gray-900",
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

## Accessibility

- Uses native `<input type="checkbox">` — full browser keyboard/screen reader support
- `<label>` wraps the input (implicit association)
- `aria-invalid` set when `error={true}`
- `aria-required` set when `required={true}`
- `aria-describedby` links error/success messages and description
- Error and success messages use `role="alert"` for live announcements
- `indeterminate` is set programmatically on the DOM input via ref
- Supports `prefers-reduced-motion` via `reduceMotion` prop

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Checkbox doesn't toggle | Using `checked` without `onValueChange` | Add `onValueChange` handler or use `defaultChecked` |
| Indeterminate not showing | `indeterminate` not set | Pass `indeterminate={true}` — it's visual only |
| Custom icon wrong size | Icon doesn't match checkbox size | Use the `icon` class slot or size your icon to match |
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
| Unstyled | `title="Unstyled Mode"` | Full custom styling |
| Classes system | `title="Classes System"` | Per-slot overrides |

Source file index:

| File | Contains |
|------|----------|
| `Checkbox.tsx` | Main component with forwardRef, state management, rendering |
| `utils/types.ts` | CheckboxProps, CheckboxClasses, CheckboxSize, CheckboxShape |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes, SIZE_MAP, SHAPE_CLASS_MAP |
| `utils/icons.tsx` | CheckIcon, IndeterminateIcon SVG components |
| `index.ts` | Public exports |
