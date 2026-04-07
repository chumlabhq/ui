# Slider

> A range slider with single and dual-thumb modes, marks, tooltips, vertical orientation, and full keyboard navigation.

**Category:** Form
**Keywords:** slider, range slider, input range, volume control, progress, thumb, track, marks

---

## Quick Answer

Use `<Slider value={val} onValueChange={setVal} />` for a single slider (0-100). Pass `value={[20, 80]}` for a range slider. Supports `marks`, `showTooltip`, `orientation="vertical"`, and `step`.

---

## Import

```tsx
import { Slider } from "@chumlab/ui/slider";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Slider } from "@chumlab/ui/slider";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState(50);
  return (
    <Slider
      label="Volume"
      value={value}
      onValueChange={(v) => setValue(v as number)}
    />
  );
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `value` | `number` for single, `[number, number]` for range. |
| `min` / `max` | Defaults 0/100. `min` must be less than `max`. |
| `step` | Defaults 1. Value snaps to nearest step. |
| `marks` | Array of `{ value, label? }`. Rendered as dots on track. |
| `showTooltip` | `"always"`, `"hover"`, or `false`. Shows value above thumb. |
| `orientation` | `"horizontal"` (default) or `"vertical"`. |

---

## Accessibility

- `role="slider"` on each thumb with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `aria-valuetext` for screen reader value announcement
- `aria-orientation` for horizontal/vertical
- `aria-label` on thumbs
- Full keyboard: Arrow keys (small step), Shift+Arrow (large step), Home/End, PageUp/PageDown
- Focus ring on thumbs via `focus-visible:ring-2`
- Disabled state removes from tab order

---

## Demo Reference

**File:** `src/pages/demo/SliderDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Single value | `title="Basic Usage"` |
| Range | `title="Range Slider"` |
| Marks | `title="Marks"` |
| Tooltip | `title="Tooltip"` |
| Vertical | `title="Vertical"` |
| Validation | `title="Success State"` |

| File | Contains |
|------|----------|
| `Slider.tsx` | Main component with Thumb sub-component |
| `utils/types.ts` | SliderProps, SliderClasses |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes |
