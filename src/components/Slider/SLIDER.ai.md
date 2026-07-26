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
| `showTooltip` | `boolean`. Shows the value above the thumb on hover/drag. Use `tooltipAlways` to keep it visible. |
| `orientation` | `"horizontal"` (default) or `"vertical"`. |

---

## All Props

<!-- generated from Slider.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number \| array | — | Current value (number for single thumb, [number, number] for range). |
| `defaultValue` | number \| array | — | Default uncontrolled value. |
| `onValueChange` | object | — | (value: SliderValue) => void — Fires when the value changes. |
| `onValueCommit` | object | — | (value: SliderValue) => void — Fires when a drag interaction ends (commit). |
| `min` | number | `0` | Minimum value. |
| `max` | number | `100` | Maximum value. |
| `step` | number | `1` | Step increment. |
| `minStepsBetweenThumbs` | number | `0` | Minimum distance between range thumbs. |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Orientation of the slider. |
| `inverted` | boolean | `false` | Reverse the slider direction. |
| `showTooltip` | boolean | `false` | Show value tooltip on hover/drag. |
| `tooltipAlways` | boolean | `false` | Always show tooltip, not just on hover/drag. |
| `formatTooltip` | object | — | (value: number) => string — Format the tooltip display value. |
| `marks` | array | — | Marks/ticks on the track. |
| `showMarkLabels` | boolean | `true` | Show mark labels. Defaults to true when marks are provided. |
| `renderThumb` | object | — | (props: SliderThumbRenderProps) => ReactNode — Custom thumb content renderer. |
| `renderMark` | object | — | (props: SliderMarkRenderProps) => ReactNode — Custom mark dot renderer. |
| `markDotSize` | number | `6` | Size of mark dots in pixels. |
| `transitionDuration` | number | `200` | Duration in ms of the click-to-jump animation when the user clicks a mark or any point on the track. Set to 0 to disable. The animation is automatically suppressed during an active drag so the thumb tracks the cursor 1:1. |
| `id` | string | — | HTML id attribute. |
| `name` | string | — | Form field name attribute. |
| `label` | object | — | React.ReactNode — Label displayed above the slider. |
| `description` | object | — | React.ReactNode — Description text. |
| `disabled` | boolean | `false` | Whether the slider is disabled. |
| `required` | boolean | `false` | Whether the field is required. |
| `error` | boolean | `false` | Whether the slider is in an error state. |
| `errorMessage` | object | — | React.ReactNode — Error message displayed below the slider. |
| `success` | boolean | — | Whether the slider is in a success state. |
| `successMessage` | object | — | React.ReactNode — Success message displayed below the slider. |
| `loading` | boolean | — | Whether the slider is in a loading state. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |
| `aria-label` | string | — | Accessible label for the slider. |
| `aria-labelledby` | string | — | ID of the element that labels the slider. |
| `aria-valuetext` | string | — | Human-readable text alternative for the current value. |

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
