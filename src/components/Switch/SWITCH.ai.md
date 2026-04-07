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

## Styling Guide

Switch supports CSS custom properties for easy theming:
- `--switch-width`, `--switch-height` — overall dimensions
- `--switch-thumb-size` — thumb diameter
- `--switch-thumb-offset` — thumb inset from track edge
- `--switch-checked-bg`, `--switch-unchecked-bg` — track colors

Or use the `classes` prop with 14 slots for full control.

---

## Demo Reference

**File:** `src/pages/demo/SwitchDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Icons | `title="With Icons"` |
| Custom colors | `title="Custom Colors"` |
| CSS vars | `title="CSS Custom Properties"` |
| Unstyled | `title="Unstyled Mode"` |
| Form | `title="Form Semantics"` |

| File | Contains |
|------|----------|
| `Switch.tsx` | Main component with forwardRef |
| `utils/types.ts` | SwitchProps, SwitchClasses, SwitchRenderProps |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes, CSS_VARS |
