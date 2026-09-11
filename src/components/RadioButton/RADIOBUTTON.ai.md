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

## All Props

<!-- generated from RadioButton.schema.json — edit the schema, not this table -->

### RadioGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | — | Currently selected value. |
| `defaultValue` | string | `""` | Initial selected value for uncontrolled usage. |
| `onValueChange` | object | — | (value: string) => void - Fires when the selected value changes. |
| `onFocus` | object | — | (event: FocusEvent<HTMLInputElement>) => void - Fires when a radio receives focus. |
| `onBlur` | object | — | (event: FocusEvent<HTMLInputElement>) => void - Fires when a radio loses focus. |
| `label` | object | — | React.ReactNode - Text label for the group. |
| `description` | object | — | React.ReactNode - Helper text for the group. |
| `name` | string | — | Field name for form submission. |
| `required` | boolean | `false` | Required field indicator. |
| `disabled` | boolean | `false` | Disables all radio buttons in the group. |
| `error` | boolean | `false` | Displays the group in an error state. |
| `errorMessage` | object | — | React.ReactNode - Error message displayed below the group. |
| `success` | boolean | `false` | Displays the group in a success state. |
| `successMessage` | object | — | React.ReactNode - Success message displayed below the group. |
| `loading` | boolean | `false` | Loading state. |
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| number | `"md"` | Size of all radio indicators. |
| `orientation` | `"horizontal"` \| `"vertical"` | `"vertical"` | Layout orientation. |
| `classes` | object | — | CSS class overrides for group sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `reduceMotion` | `true` \| `false` \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `children` **(required)** | object | — | React.ReactNode - RadioButton children. |
| `className` | string | — | Additional class names applied to the group root. |

### RadioButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` **(required)** | string | — | Unique value for this radio option. |
| `label` | object | — | React.ReactNode - Text label rendered beside the radio. |
| `description` | object | — | React.ReactNode - Helper text rendered below the label. |
| `disabled` | boolean | `false` | Disables this radio option. |
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| number | — | Size of the radio indicator. Inherits the group's size when unset. |
| `checkedIcon` | object | — | React.ReactNode - Custom icon for the checked state. |
| `uncheckedIcon` | object | — | React.ReactNode - Custom icon for the unchecked state. |
| `classes` | object | — | CSS class overrides for radio sub-elements. |
| `className` | string | — | Additional class names applied to the radio root. |

## Class overrides (RadioButton item)

```tsx
// `control` carries the base AND 2 state variants. Overriding it
// replaces all of them, so write them together:
<RadioButton
  classes={{
    control:
      "rounded-full border w-4 h-4 " +      // base
      "data-[state=checked]:bg-cl-accent data-[state=checked]:border-cl-accent " +
      "data-[state=unchecked]:bg-transparent ",
  }}
/>

// Passing only `control: "data-[state=checked]:…"` drops the base and the other 1 states.
```

## Keyboard Interactions

Native `<input type="radio">` elements in a group, so the browser owns the roving focus.

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves into the group, landing on the checked radio — or the first one when none is checked. |
| `ArrowDown`, `ArrowRight` | Moves to the next radio and selects it. `ArrowUp`/`ArrowLeft` move back. |
| `Space` | Selects the focused radio. |

---

## Accessibility

- Native `<input type="radio">` — browser handles arrow key navigation
- `<div role="radiogroup">` wrapper with `aria-label`
- Labels associated via `htmlFor` / `id`
- `aria-invalid`, `aria-describedby` for errors
- Focus ring via `focus-visible:ring-2`
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.
---

## Demo Reference

**File:** `src/pages/demo/RadioButtonDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Descriptions | `title="With Labels and Descriptions"` |
| Sizes | `title="Sizes"` |
| Custom icons | `title="Custom Icons"` |

| File | Contains |
|------|----------|
| `RadioButton.tsx` | RadioGroup + RadioButton components |
| `utils/types.ts` | RadioButtonProps, RadioGroupProps, RadioButtonClasses |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes, SIZE_MAP |
