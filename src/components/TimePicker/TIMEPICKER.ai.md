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
| `variant` | `"dropdown"` (default) shows a list; `"clock"` shows an analog clock face. |
| `format` | `"24h"` (default) or `"12h"`. Affects display, parsing, and option generation. |
| `minuteStep` | Clamped to 1-60. Invalid values (0, NaN, negatives) are auto-corrected. |
| `minTime` / `maxTime` | Format: `"HH:MM"`. Dims/disables out-of-range options in both variants. |
| `expandable` + `renderExpandedRow` | Both needed for row expansion. |
| `keepMounted` | Only affects dropdown variant. Clock always remounts to reset selection mode. |
| `open` + `onOpenChange` | For controlled open state. Don't mix with `defaultOpen`. |
| `value` + `onValueChange` | For controlled mode. Don't mix with `defaultValue`. |
| `stickyHeader` | Requires `maxHeight` to be meaningful. |
| `forceDropdownPosition` | When true, locks to `dropdownPosition` without auto-flipping. |
| `lockScroll` | Prevents body scroll when dropdown/clock is open. |
| `fullWidth` | Applies `width: 100%` to root and trigger, overriding class widths. |

---

## Data Attributes (for CSS selectors and testing)

- `data-disabled` — on root and trigger when `disabled`
- `data-error` — on trigger when `error`
- `data-open` — on trigger when dropdown/clock is open
- `data-selected` — on selected option
- `data-focused` — on keyboard-focused option
- `data-position` — on dropdown portal (`"top"` or `"bottom"`)
- `data-active` — on active clock display button and period button

DOM nesting: `root > label + description + wrapper(trigger(input + clear + chevron) + portal(dropdown|clock)) + error/success`

---

## Styling Guide

### How class merging works

1. **Default** (no `classes`, no `unstyled`) — uses `DEFAULT_TIMEPICKER_CLASSES`
2. **Partial override** (`classes` without `unstyled`) — **replaces** per slot, not additive
3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything

### Key slots

| "I want to change..." | Slot to use |
|------------------------|-------------|
| Root container | `root` |
| Label text | `label` |
| Trigger button area | `trigger` |
| Text input | `input` |
| Chevron icon | `endIcon` |
| Clear button | `clearIcon` |
| Dropdown panel | `dropdown` |
| Option list container | `optionList` |
| Individual option | `option` |
| Selected option highlight | `optionSelected` |
| Focused option highlight | `optionFocused` |
| Check icon in option | `selectedIcon` |
| Error message | `error` |
| Description text | `description` |
| Clock container | `clockContainer` |
| Clock face circle | `clockFace` |
| Clock numbers | `clockNumber`, `clockNumberSelected` |
| Clock hand | `clockHand`, `clockHandLine`, `clockHandDot` |
| AM/PM buttons | `clockPeriodButton`, `clockPeriodActive` |
| OK/Cancel buttons | `clockOkButton`, `clockCancelButton` |

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
  variant="clock"
  format="12h"
  onConfirm={() => console.log("confirmed")}
  onCancel={() => console.log("cancelled")}
/>
```

### Force dropdown position

```tsx
<TimePicker dropdownPosition="bottom" forceDropdownPosition lockScroll />
```

### Form submission

```tsx
<form onSubmit={handleSubmit}>
  <TimePicker name="meetingTime" label="Meeting Time" required />
  <button type="submit">Submit</button>
</form>
```

---

## Accessibility

- `role="combobox"` with `aria-expanded`, `aria-haspopup`, `aria-controls`
- `aria-activedescendant` tracks focused option in dropdown
- `aria-autocomplete="list"` for dropdown variant
- `aria-required` when `required` is set
- `aria-invalid` when `error` is set
- `aria-describedby` connects description, error, and success messages
- `aria-pressed` on clock AM/PM and hours/minutes toggle buttons
- Clock variant uses `role="dialog"` with `aria-modal="true"`
- Clock face uses `role="slider"` with arrow key navigation
- Keyboard: Tab to focus, Arrow keys to navigate options, Enter to select, Escape to close
- `prefers-reduced-motion` support via `reduceMotion` prop

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Styles wrong after overriding one class | `classes` replaces per slot | Provide full class string for the slot |
| Dropdown opens in wrong direction | Auto-flip based on viewport | Use `forceDropdownPosition` to lock position |
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
| Force position | `title="Dropdown Position"` (forceDropdownPosition demos) |
| Clock 24h | `title="Clock Variant (24h)"` |
| Clock 12h | `title="Clock Variant (12h)"` |
| Clock themes | `title="Clock Color Themes"` |
| Scroll lock | `title="Scroll Behavior"` |
| Custom icons | `title="Custom End Icon & No End Icon"` |
| Theme examples | `title="Dropdown Theme Examples"` |
| Custom rendering | `title="Custom Option Rendering"` |
| Smart parsing | `title="Smart Parsing"` |
| Classes system | `title="Classes System"` |
| Unstyled | `title="Unstyled (Dropdown)"` |
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
