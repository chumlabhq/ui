# TimePicker

> A time input with dropdown list or analog clock variant, smart parsing, 12/24-hour formats, min/max constraints, clearable, keyboard navigation, and full accessibility.

**Category:** form
**Keywords:** time picker, time input, clock, dropdown, 12h, 24h, AM PM, time selection, clock face, time format

---

## Quick Answer

Use `<TimePicker />` for time selection. Supports dropdown (list) and clock (analog) variants, 12h/24h formats, min/max constraints, smart parsing, clearable, and portal-based positioning. Works out-of-the-box with built-in Tailwind styles.

---

## Import

```tsx
import { TimePicker } from "@chumlab/ui/time-picker";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { TimePicker } from "@chumlab/ui/time-picker";
import { useState } from "react";

export default function Example() {
  const [time, setTime] = useState<string | null>(null);
  return <TimePicker value={time} onValueChange={(t) => setTime(t)} />;
}
```

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `mode` | `"dropdown"` (default) shows a list; `"clock"` shows an analog clock face. |
| `format` | `"24h"` (default) or `"12h"`. Affects display, parsing, and option generation. |
| `minuteStep` | Clamped to 1-60. Invalid values (0, NaN, negatives) are auto-corrected. |
| `minTime` / `maxTime` | Format: `"HH:MM"`. Dims/disables out-of-range options in both variants, and a typed time outside them is not committed: the field shows its error state with `aria-invalid`. |
| `keepMounted` | Only affects dropdown variant. Clock always remounts to reset selection mode. |
| `open` + `onOpenChange` | For controlled open state. Don't mix with `defaultOpen`. |
| `value` + `onValueChange` | For controlled mode. Don't mix with `defaultValue`. |
| `forceDropdownSide` | When true, locks to `dropdownSide` without auto-flipping. |
| `lockScroll` | Prevents body scroll when dropdown/clock is open. |
| `fullWidth` | Applies `width: 100%` to root and trigger, overriding class widths. |

---

## Data Attributes (for CSS selectors and testing)

- `data-disabled` — on root and trigger when `disabled`
- `data-error` — on trigger when `message`
- `data-open` — on trigger when dropdown/clock is open
- `data-selected` — on selected option
- `data-highlighted` — on keyboard-focused option
- `data-position` — on dropdown portal (`"top"` or `"bottom"`)
- `data-active` — on active clock display button and period button

DOM nesting: `root > label + description + wrapper(trigger(input + clear + chevron) + portal(dropdown|clock)) + error/success`

---

## All Props

<!-- generated from TimePicker.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string \| null | — | Current time value (e.g. '14:30' or '2:30 PM'). |
| `defaultValue` | string \| null | — | Default time value for uncontrolled usage. |
| `onValueChange` | object | — | (time: string \| null, timeValue: TimeValue \| null) => void — Called when the selected time changes. |
| `onBlur` | object | — | (event: FocusEvent<HTMLInputElement>) => void — Fires once focus has left the whole time picker, with the input's native blur event. |
| `format` | `"12h"` \| `"24h"` | `"24h"` | Time display format. |
| `minuteStep` | number | `15` | Minute interval for dropdown options and clock snapping. Clamped to 1-60. |
| `minTime` | string | — | Minimum selectable time (e.g. '09:00'). A typed time before it is not committed, and the field shows its error state with aria-invalid. |
| `maxTime` | string | — | Maximum selectable time (e.g. '17:00'). A typed time after it is not committed, and the field shows its error state with aria-invalid. |
| `name` | string | — | Name for the hidden input for form submission. |
| `placeholder` | string | — | Placeholder text for the input. |
| `disabled` | boolean | `false` | Disables the component. |
| `error` | boolean | `false` | Marks the component as having an error. |
| `errorMessage` | object | — | React.ReactNode — Error message displayed below the input. |
| `description` | object | — | React.ReactNode — Helper text displayed below the label. |
| `success` | boolean | — | Success state. |
| `successMessage` | object | — | React.ReactNode — Success message text. |
| `loading` | boolean | — | Loading state. |
| `label` | object | — | React.ReactNode — Label displayed above the input. |
| `required` | boolean | `false` | Shows a required indicator on the label. |
| `showEndIcon` | boolean | `true` | Show the chevron/end icon in the trigger. |
| `endIcon` | object | — | React.ReactNode — Custom end icon element replacing the default chevron. |
| `showSelectedIcon` | boolean | `true` | Show a check icon on the selected option. |
| `selectedIcon` | object | — | React.ReactNode — Custom selected icon element. |
| `renderOptionContent` | object | — | (time: string, isSelected: boolean) => ReactNode — Custom renderer for dropdown option content. |
| `fullWidth` | boolean | `false` | Expand the picker to fill its parent container. |
| `mode` | `"dropdown"` \| `"clock"` | `"dropdown"` | How a time is picked: a dropdown list or an analog clock face. |
| `clearable` | boolean | `true` | Show a clear button when a value is selected. |
| `onClear` | object | — | () => void — Called when the clear button is clicked. |
| `open` | boolean | — | Controlled open state. |
| `defaultOpen` | boolean | `false` | Default open state (uncontrolled). |
| `onOpenChange` | object | — | (open: boolean) => void — Called when the open state changes. |
| `lockScroll` | boolean | `false` | Lock body scroll when dropdown is open. |
| `dropdownSide` | `"top"` \| `"bottom"` | `"bottom"` | Position of the dropdown relative to the trigger. |
| `forceDropdownSide` | boolean | `false` | When true, locks the dropdown to the specified position without auto-flipping. |
| `dropdownZIndex` | number | `50` | Z-index for the dropdown. |
| `dropdownOffset` | number | `4` | Gap between trigger and dropdown in pixels. |
| `keepMounted` | boolean | `false` | Keep dropdown DOM mounted when closed (dropdown mode only). |
| `portalContainer` | object | — | HTMLElement \| null — Custom container element for the dropdown portal. |
| `classes` | object | — | CSS class overrides for all sub-elements. |
| `unstyled` | boolean | `false` | Omits built-in layout helpers so layout comes entirely from classes. |
| `reduceMotion` | boolean \| `"auto"` | `false` | Controls motion preferences. 'auto' respects the user's OS prefers-reduced-motion setting. |
| `onCancel` | object | — | () => void — Called when the clock cancel button is pressed. |
| `onConfirm` | object | — | () => void — Called when the clock confirm button is pressed. |
| `cancelText` | string | `"Cancel"` | Text for the clock cancel button. |
| `confirmText` | string | `"OK"` | Text for the clock OK button. |

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

1. **Default** (no `classes`, no `unstyled`) — uses `DEFAULT_TIMEPICKER_CLASSES`
2. **Partial override** (`classes` without `unstyled`) — **replaces** per slot, not additive

**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything

```tsx
// `clockNumber` carries the base AND 2 state variants. Overriding it
// replaces all of them, so write them together:
<TimePicker
  classes={{
    clockNumber:
      "rounded-cl-md px-2 py-1 " +           // base
      "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed " +
      "data-[selected]:bg-cl-accent/15 data-[selected]:text-cl-accent ",
  }}
/>

// Passing only `clockNumber: "data-[disabled]:…"` drops the base and the other
// 1 states.
```

### Key slots

| "I want to change..." | Slot to use |
|------------------------|-------------|
| Root container | `root` |
| Label text | `label` |
| Trigger button area | `trigger` |
| Text input | `input` |
| Chevron icon | `icon` |
| Clear button | `clearTrigger` |
| Dropdown panel | `content` |
| Option list container | `list` |
| Individual option | `item` |
| Selected option highlight | `optionSelected` |
| Focused option highlight | `optionFocused` |
| Check icon in option | `itemIndicator` |
| Error message | `message` |
| Description text | `description` |
| Clock container | `clockContent` |
| Clock face circle | `clockFace` |
| Clock numbers | `clockNumber` |
| Clock hand | `clockHand`, `clockHandLine`, `clockHandDot` |
| AM/PM buttons | `periodTrigger` |
| OK/Cancel buttons | `confirmTrigger`, `cancelTrigger` |

### Dark mode

Defaults use Tailwind `dark:` prefix, activated by `<html class="dark">`. When overriding a slot, always provide both light and dark variants.

### Responsive behavior

Default trigger has `w-56` (224px). Use `fullWidth` prop or override `trigger` class with `w-full` for fluid layouts. Clock face is `w-52 h-52` by default.

---

## Patterns

### Controlled state

```tsx
const [time, setTime] = useState<string | null>(null);
<TimePicker value={time} onValueChange={(t) => setTime(t)} />
```

### 12-hour format with constraints

```tsx
<TimePicker format="12h" minTime="09:00" maxTime="17:00" minuteStep={30} />
```

### Clock variant

```tsx
<TimePicker
  mode="clock"
  format="12h"
  onConfirm={() => console.log("confirmed")}
  onCancel={() => console.log("cancelled")}
/>
```

### Force dropdown position

```tsx
<TimePicker dropdownSide="bottom" forceDropdownSide lockScroll />
```

### Form submission

```tsx
<form onSubmit={handleSubmit}>
  <TimePicker name="meetingTime" label="Meeting Time" required />
  <button type="submit">Submit</button>
</form>
```

---

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| Typing | Sets the time: `hh:mm` on a 24-hour picker, `hh:mm am` or `hh:mm pm` on a 12-hour one, committed on `Enter`, `Tab` or leaving the field. Any minute can be typed, not only the `minuteStep` ones the list and the clock offer: the step is the increment offered, not a constraint. A time outside `minTime` and `maxTime` is not committed: the field keeps the text, shows its error state with `aria-invalid`, and `onValueChange` is not called. Typing opens the panel; `Space` is a character, the one between the time and AM/PM. |
| `Backspace` | Deleting the whole value and committing it clears the time. So does the clear button, which `Tab` reaches. |
| `Enter` | In the dropdown list, picks the highlighted time. Otherwise commits what was typed and closes the panel. |
| `Tab` | Commits what was typed, closes the panel and moves to the next control. |
| `Escape` | Closes the panel; focus stays in the input, which is where it was. Always: there is no prop to turn it off, because the APG combobox pattern requires Escape to close the popup. |
| `ArrowDown`, `ArrowUp` | Opens the dropdown list and moves through its times. On the clock variant, `ArrowDown` opens the clock and neither key does anything else: there is no list to move through, so nothing is highlighted and `Enter` commits what was typed. |
| `Home`, `End` | Jumps to the first or last time in the dropdown list. On the clock variant they move the caret. |
| `ArrowLeft`, `ArrowRight`, `PageUp`, `PageDown` | Move the caret in the input. The clock is a pointer affordance: focus stays in the input while it is open, its face takes no keyboard focus, and its own handling of the arrow keys, `PageUp`, `PageDown`, `Home` and `End` is not reachable from the keyboard. Every time the clock can set can be typed. |

---

## Ref API

The ref lands on the trigger, which for TimePicker is the typed text `<input role="combobox">` a keyboard user tabs to, so `ref.current.focus()` focuses the field — which is what a form library calls on the first invalid field.

```tsx
const ref = useRef<HTMLInputElement>(null);
<TimePicker ref={ref} label="Time" />
// ref.current is the trigger <input>
```

## Accessibility

- `role="combobox"` with `aria-expanded`, `aria-haspopup`, `aria-controls`
- `aria-activedescendant` tracks focused option in dropdown
- `aria-autocomplete="list"` for dropdown variant
- `aria-required` when `required` is set
- `aria-invalid` when `message` is set
- `aria-describedby` connects description, error, and success messages
- `aria-pressed` on clock AM/PM and hours/minutes toggle buttons
- Clock variant is a non-modal `role="dialog"`: focus stays in the input, which points at it with `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`
- Clock face uses `role="slider"`; it is a pointer surface that takes no keyboard focus, and the input is the keyboard path to every time it can set
- Keyboard: type the time into the input; in the dropdown list, arrow keys move through the times and Enter picks one; Escape closes the panel
- `prefers-reduced-motion` support via `reduceMotion` prop
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.
---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Styles wrong after overriding one class | `classes` replaces per slot | Provide full class string for the slot |
| Dropdown opens in wrong direction | Auto-flip based on viewport | Use `forceDropdownSide` to lock position |
| minuteStep ignored | Value out of 1-60 range | Clamped automatically; use valid integer |
| Clock OK disabled | Time outside min/max range | Adjust selection or widen range |
| Value not updating | Using controlled mode without `onValueChange` | Always pair `value` with `onValueChange` |
| Input accepts invalid text | Smart parser tries to match | Validate on form submit; parser handles common formats |
| Dropdown behind other elements | z-index too low | Increase `dropdownZIndex` |
| Clock variant doesn't keep state | Clock remounts on close | Expected behavior; use `onConfirm` to capture value |

---

## Demo Reference

**File:** `src/pages/demo/TimePickerDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic 24h | `title="Basic Usage"` |
| 12-hour format | `title="12-Hour Format"` |
| Minute steps | `title="Minute Steps"` |
| Min/max constraints | `title="Min / Max Time"` |
| Clearable | `title="Clearable"` |
| Labels & errors | `title="Label, Required & Error States"` |
| Description | `title="With Description"` |
| Success state | `title="Success State"` |
| Loading | `title="Loading State"` |
| Disabled | `title="Disabled"` |
| Full width | `title="Full Width"` |
| Controlled open | `title="Controlled Open"` |
| Dropdown position | `title="Dropdown Position"` |
| Force position | `title="Dropdown Position"` (forceDropdownSide demos) |
| Clock 24h | `title="Clock Variant (24h)"` |
| Clock 12h | `title="Clock Variant (12h)"` |
| Clock themes | `title="Clock Color Themes"` |
| Scroll lock | `title="Scroll Behavior"` |
| Custom icons | `title="Custom End Icon & No End Icon"` |
| Theme examples | `title="Dropdown Theme Examples"` |
| Custom rendering | `title="Custom Option Rendering"` |
| Smart parsing | `title="Smart Parsing"` |
| Classes system | `title="Classes System"` |
| Reduce motion | `title="Reduce Motion"` |

### Source file index

| File | Contains |
|------|----------|
| `TimePicker.tsx` | Main component, portal positioning, dropdown + clock rendering |
| `ClockFace.tsx` | Analog clock variant with pointer/keyboard interaction |
| `useTimePicker.ts` | Hook for dropdown state, filtering, keyboard navigation |
| `utils.ts` | Time parsing, formatting, option generation utilities |
| `utils/types.ts` | TimePickerProps, TimePickerClasses, TimeValue, ClockFaceProps |
| `utils/constants.ts` | DEFAULT + UNSTYLED class maps |
| `icons.tsx` | ChevronDown, Clock, Check, Clear icons |
| `index.ts` | Public exports |
| `__tests__/` | Unit tests |
