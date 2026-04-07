# RadioButton

> A radio button group with labels, descriptions, custom icons, sizes, orientations, and validation states.

**Category:** Form
**Keywords:** radio, radio button, radio group, option select, single select, form, choice

---

## Quick Answer

Use `<RadioGroup name="plan"><RadioButton value="a" label="Option A" />...</RadioGroup>` for a radio group. Uses native `<input type="radio">` — full keyboard support (arrow keys) out-of-the-box.

---

## Import

```tsx
import { RadioGroup, RadioButton } from "@chumlab/ui/radio-button";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { RadioGroup, RadioButton } from "@chumlab/ui/radio-button";

export default function Example() {
  return (
    <RadioGroup name="plan" defaultValue="basic">
      <RadioButton value="basic" label="Basic" />
      <RadioButton value="pro" label="Pro" />
      <RadioButton value="enterprise" label="Enterprise" />
    </RadioGroup>
  );
}
```

---

## Accessibility

- Native `<input type="radio">` — browser handles arrow key navigation
- `<div role="radiogroup">` wrapper with `aria-label`
- Labels associated via `htmlFor` / `id`
- `aria-invalid`, `aria-describedby` for errors
- Focus ring via `focus-visible:ring-2`

---

## Demo Reference

**File:** `src/pages/demo/RadioButtonDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Descriptions | `title="With Labels and Descriptions"` |
| Sizes | `title="Sizes"` |
| Orientations | `title="Orientation"` |
| Custom icons | `title="Custom Icons"` |
| Unstyled | `title="Unstyled Mode"` |

| File | Contains |
|------|----------|
| `RadioButton.tsx` | RadioGroup + RadioButton components |
| `utils/types.ts` | RadioButtonProps, RadioGroupProps, RadioButtonClasses |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes, SIZE_MAP |
