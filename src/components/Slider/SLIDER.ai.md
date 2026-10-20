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

## Data Attributes (for CSS selectors and testing)

Each is written or absent, never `"false"`.

**Root:**
- `data-disabled` — when `disabled`
- `data-error` — when `error`; the error itself is drawn by the message below
- `data-valid` — when `success` and not `error`
- `data-loading` — when `loading`
- `data-orientation="horizontal" | "vertical"` — from `orientation`

**Control** (`control`, the box the track sits in):
- `data-orientation`, `data-disabled` — as on the root
- `data-loading` — when `loading`; the control dims and takes no pointer input

**Track and range:** `data-disabled` — both dim

**Thumb** (`role="slider"`):
- `data-dragging` — while a pointer is dragging it; the thumb grows by a quarter and takes a larger shadow, which the focus ring never does
- `data-state="active"` — the same moment, for a selector keyed to `data-state`
- `data-index` — which thumb, from 0, on a range slider
- `data-disabled` — when `disabled`

**Mark dot** (`mark`):
- `data-state="active"` — the mark lies inside the selected range; its ring turns accent
- `data-disabled` — when `disabled`

**Message:** `data-invalid` on the error message, `data-valid` on the success message.

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
| `animationDuration` | number | `200` | Duration in ms of the click-to-jump animation when the user clicks a mark or any point on the track. Set to 0 to disable. The animation is automatically suppressed during an active drag so the thumb tracks the cursor 1:1. |
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
| `aria-describedby` | string | — | Lands on the thumbs, joined with the description and the error message. |
| `aria-valuetext` | string | — | Human-readable text alternative for the current value. |

## Class overrides

**A plain utility of yours wins over every default in its group on that slot, states included.**
`classes={{ control: "bg-green-500" }}` paints green in every state, where a default
`data-[state=checked]:` background would otherwise keep winning. To restyle one state only,
pass that state's own variant (`data-[state=checked]:bg-green-500`). Defaults in other groups stay.

```tsx
// `thumb` carries the base AND 2 state variants. Overriding it
// replaces all of them, so write them together:
<Slider
  classes={{
    thumb:
      "rounded-cl-md px-2 py-1 " +           // base
      "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed " +
      "data-[state=active]:scale-110 ",
  }}
/>

// Passing only `thumb: "data-[disabled]:…"` drops the base and the other 1 states.
```

## Forms

- **Submitted value.** With `name`, it submits one entry with the number, or `{name}[0]` and `{name}[1]` for a range; with no value set it submits `min`.
- **Reset.** A form reset — a `type="reset"` button or `form.reset()` — restores an uncontrolled slider to `defaultValue` (or `min`), and the submitted value with it. Like a native input it fires no change callback: `onValueChange` is not called. A controlled Slider is left alone: it keeps the `value` you pass and calls nothing, as a controlled React `<input>` does. Reset your own state in the form's `onReset` if you want the field cleared.
- **Required.** A Slider always holds a value, so `required` never blocks a submit. When validation stops a form elsewhere, focus goes to the first thumb. The field shows an error state only when you pass `error` and `errorMessage`.
- **Disabled.** A disabled Slider submits nothing, as a disabled native control doesn't. Its thumbs take no focus, by Tab or by click, and neither the pointer nor the keys move them.

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves focus to the thumb. A range slider has one thumb per value. |
| `ArrowRight`, `ArrowUp` | Increases by `step`. `ArrowLeft`/`ArrowDown` decrease. Holding `Shift` uses the larger step. |
| `PageUp`, `PageDown` | Moves by the larger step. |
| `Home`, `End` | Jumps to the minimum or maximum. |

---

## Ref API

The ref lands on the thumb, the `role="slider"` element a keyboard user tabs to and moves with the arrow keys, so `ref.current.focus()` focuses the control. A range slider has two thumbs; the ref is the first one, the thumb for `value[0]`.

```tsx
const ref = useRef<HTMLDivElement>(null);
<Slider ref={ref} defaultValue={[20, 80]} aria-label="Price" />
// ref.current is the thumb for 20
```

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
