# Switch

> A toggle switch for binary on/off states with labels, validation, loading, custom icons, and WAI-ARIA switch semantics.

**Category:** Form
**Keywords:** switch, toggle, on off, boolean, form toggle, binary, checkbox alternative

---

## Quick Answer

Use `<Switch label="Feature" checked={val} onCheckedChange={setVal} />` for a labeled toggle. Uses native `<button role="switch">` with `aria-checked`. Supports error/success states, loading, custom icons on thumb, and CSS custom properties for theming.

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
      onCheckedChange={setEnabled}
    />
  );
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `checked` + `onCheckedChange` | Controlled mode. |
| `defaultChecked` | Uncontrolled mode. Cannot combine with `checked`. |
| `checkedIcon` / `uncheckedIcon` | ReactNode rendered inside the thumb. |
| `animationDuration` | Respects `reduceMotion` — set to 0ms when motion reduced. |

---

## Data Attributes (for CSS selectors and testing)

Each is written or absent, never `"false"`, so the bare attribute selector is
the one to use: `[data-error]`, not `[data-error="true"]`. All of them sit on
the root.

- `data-state="checked" | "unchecked"` — always present
- `data-checked="true"` — only while checked, for a selector that wants presence
- `data-disabled="true"` — when disabled
- `data-loading="true"` — while a change is in flight
- `data-error="true"` — when `error`
- `data-valid="true"` — when `success` and not `error`
- `data-reduce-motion="true"` — while reduced motion is in force
- `data-invalid="true"` — on the message element, when it is the error message

### The error state has no control paint

Every other field in the library colours a border in its error state. A switch
has no border to colour, so `error` does three things and none of them touch
the track: it sets `data-error` on the root, links `errorMessage` through
`aria-describedby`, sets `aria-invalid` on the control, and paints the message
`text-cl-error`.

If you want the track itself to react, the attribute is the hook:

```tsx
<Switch
  error
  errorMessage="You must accept the terms"
  classes={{ control: "bg-cl-bg-hover data-[state=checked]:bg-cl-accent" }}
  className="data-[error]:ring-2 data-[error]:ring-cl-error/40"
/>
```

---

## Class overrides

### Slot → element

| Slot | Element |
|------|---------|
| `root` | Outer container. Carries every data attribute above. |
| `row` | The line holding the label group and the track, which is what `labelPosition` reorders. |
| `group` | The label and description stacked together, so they move as one. |
| `label` | The label element. |
| `description` | The description under the label. |
| `control` | The track the thumb slides along. |
| `thumb` | The handle that slides. |
| `message` | The error or hint line under the row. |
| `loading` | The spinner shown on the thumb while a change is in flight. |


**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

```tsx
// `control` carries the base AND 3 state variants. Overriding it
// replaces all of them, so write them together:
<Switch
  classes={{
    control:
      "rounded-cl-md px-2 py-1 " +           // base
      "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed " +
      "data-[state=checked]:bg-cl-accent " +
      "data-[state=unchecked]:bg-transparent ",
  }}
/>

// Passing only `control: "data-[disabled]:…"` drops the base and the other 2 states.
```

## Forms

- **Submitted value.** With `name`, it submits like a native checkbox: one entry, `value` (default `"on"`), when on, and no entry when off.
- **Reset.** A form reset — a `type="reset"` button or `form.reset()` — restores an uncontrolled switch to `defaultChecked`, and the submitted value with it. Like a native input it fires no change callback: `onCheckedChange` is not called. A controlled Switch is left alone: it keeps the `checked` you pass and calls nothing, as a controlled React `<input>` does. Reset your own state in the form's `onReset` if you want the field cleared.
- **Required.** A `required` Switch must be on, like a required checkbox: off, it blocks the form's submit and the browser's validation moves focus to the switch. The field shows an error state only when you pass `error` and `errorMessage`.
- **Disabled and `form`.** A disabled Switch submits nothing. `form` reaches the submitted value as well as the button.

## Keyboard Interactions

A `<button role="switch">`, not a checkbox — which is why `Enter` activates it as well as `Space`.

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves focus to the switch. |
| `Enter`, `Space` | Toggles it. |

---

## Accessibility

- `<button role="switch" aria-checked>` — native ARIA switch pattern
- Label associated via `htmlFor` / `id` pairing
- `aria-disabled`, `aria-required` set when applicable
- `aria-describedby` links error/success messages and description
- Keyboard: Space/Enter toggles, Tab focuses
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.
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
| `onCheckedChange` | object | — | (checked: boolean) => void — Fires with the new `checked` state. The `value` prop is form data and is never reported here. |
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
| `animationDuration` | number | — | Duration of the toggle transition in milliseconds. |
| `transitionTimingFunction` | string | — | CSS timing function for the toggle transition. |
| `renderLabel` | object | — | (props: SwitchRenderProps) => ReactNode — Custom label render function. |
| `renderDescription` | object | — | (props: SwitchRenderProps) => ReactNode — Custom description render function. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |
| `style` | object | — | Inline styles applied to the root element. |
| `reduceMotion` | boolean \| `"auto"` | `"auto"` | Controls motion preferences. 'auto' respects the user's OS setting. |

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

Switch supports CSS custom properties for easy theming:
- `--switch-tracker-width`, `--switch-tracker-height` — track dimensions
- `--switch-thumb-size` — thumb diameter
- `--switch-thumb-bg` — thumb color
- `--switch-tracker-checked-bg`, `--switch-tracker-unchecked-bg` — track colors
- `--switch-focus-ring` — focus ring color
- `--cl-accent` — read, not set: the theme token the default checked track and
  focus ring fall back to when the variables above are unset

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
