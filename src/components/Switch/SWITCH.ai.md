# Switch

> A toggle switch for binary on/off states with labels, validation, loading, custom icons, and full WAI-ARIA support.

**Category:** Form
**Keywords:** switch, toggle, on off, boolean, form toggle, binary, checkbox alternative

---

## Quick Answer

Use `<Switch label="Feature" checked={val} onValueChange={setVal} />` for a labeled toggle. Uses native `<button role="switch">` with `aria-checked`. Supports error/success states, loading, custom icons on thumb, and CSS custom properties for theming.

---

## Import

```tsx
import { Switch } from "@chumlab/ui/switch";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Switch } from "@chumlab/ui/switch";
import { useState } from "react";

export default function Example() {
  const [enabled, setEnabled] = useState(false);
  return (
    <Switch
      label="Email notifications"
      checked={enabled}
      onValueChange={setEnabled}
    />
  );
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `checked` + `onValueChange` | Controlled mode. |
| `defaultChecked` | Uncontrolled mode. Cannot combine with `checked`. |
| `onCheckedChange` | Deprecated — use `onValueChange`. |
| `checkedIcon` / `uncheckedIcon` | ReactNode rendered inside the thumb. |
| `transitionDuration` | Respects `reduceMotion` — set to 0ms when motion reduced. |

---

## Accessibility

- `<button role="switch" aria-checked>` — native ARIA switch pattern
- Label associated via `htmlFor` / `id` pairing
- `aria-disabled`, `aria-required` set when applicable
- `aria-describedby` links error/success messages and description
- Keyboard: Space/Enter toggles, Tab focuses
- Reduced motion: disables inline transition animations

---

## All Props

<!-- generated from Switch.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | — | CSS class for the root element. |
| `label` | object | — | React.ReactNode — Label displayed alongside the switch. |
| `description` | object | — | React.ReactNode — Description text below the label. |
| `checked` | boolean | — | Controlled checked state. |
| `defaultChecked` | boolean | `false` | Default uncontrolled checked state. |
| `onValueChange` | object | — | (checked: boolean) => void — Fires when the checked state changes. |
| `onCheckedChange` | object | — | (checked: boolean) => void — Deprecated: use onValueChange instead. |
| `name` | string | — | Form field name attribute. |
| `value` | string | `"on"` | Value attribute for the hidden input element. |
| `required` | boolean | `false` | Whether the field is required. |
| `id` | string | — | HTML id attribute. |
| `disabled` | boolean | `false` | Whether the switch is disabled. |
| `error` | boolean | `false` | Whether the switch is in an error state. |
| `errorMessage` | object | — | React.ReactNode — Error message displayed below the switch. |
| `success` | boolean | `false` | Whether the switch is in a success state. |
| `successMessage` | object | — | React.ReactNode — Success message displayed below the switch. |
| `loading` | boolean | `false` | Whether the switch is in a loading state. |
| `loader` | object | — | React.ReactNode — Custom loader element. |
| `loaderSize` | number | `16` | Size of the default loader in pixels. |
| `checkedIcon` | object | — | React.ReactNode — Icon displayed inside the thumb when checked. |
| `uncheckedIcon` | object | — | React.ReactNode — Icon displayed inside the thumb when unchecked. |
| `transitionDuration` | number | — | Duration of the toggle transition in milliseconds. |
| `transitionTimingFunction` | string | — | CSS timing function for the toggle transition. |
| `renderLabel` | object | — | (props: SwitchRenderProps) => ReactNode — Custom label render function. |
| `renderDescription` | object | — | (props: SwitchRenderProps) => ReactNode — Custom description render function. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |
| `style` | object | — | Inline styles applied to the root element. |
| `reduceMotion` | boolean \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |

## Styling Guide

Switch supports CSS custom properties for easy theming:
- `--switch-tracker-width`, `--switch-tracker-height` — track dimensions
- `--switch-thumb-size` — thumb diameter
- `--switch-thumb-bg` — thumb color
- `--switch-tracker-checked-bg`, `--switch-tracker-unchecked-bg` — track colors
- `--switch-focus-ring` — focus ring color

Or use the `classes` prop with 14 slots for full control.

---

## Demo Reference

**File:** `src/pages/demo/SwitchDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Icons | `title="With Icons"` |
| Custom colors | `title="Custom Colors"` |
| CSS vars | `title="CSS Custom Properties (Theming)"` |
| Form | `title="Form Semantics"` |

| File | Contains |
|------|----------|
| `Switch.tsx` | Main component with forwardRef |
| `utils/types.ts` | SwitchProps, SwitchClasses, SwitchRenderProps |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes, CSS_VARS |
