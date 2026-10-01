# OtpInput

> A one-time password input with per-character fields, keyboard navigation, paste support, grouping, and validation.

**Category:** Form
**Keywords:** otp, one-time password, verification code, pin input, code input, 2fa, mfa

---

## Quick Answer

Use `<OtpInput value={otp} onValueChange={setOtp} />` for a 6-digit OTP input. Supports `length`, `inputPattern` (e.g. `"\\d*"` to restrict to digits), `inputType="password"` for masking, `groups` for visual grouping, and built-in error/success states.

---

## Import

```tsx
import { OtpInput } from "@chumlab/ui/otp-input";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { OtpInput } from "@chumlab/ui/otp-input";
import { useState } from "react";

export default function Example() {
  const [otp, setOtp] = useState("");
  return (
    <OtpInput
      label="Verification Code"
      description="Enter the 6-digit code sent to your phone"
      value={otp}
      onValueChange={setOtp}
    />
  );
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `length` | Defaults to 6. Controls number of input fields. |
| `inputPattern` | Regex string restricting allowed characters, e.g. `"\\d*"` for digits only. The single source for what a slot accepts: it sets the `pattern` attribute, drives `inputMode`, names the slots "Digit" or "Character", **and filters typed and pasted characters**. |
| `inputType` | `"text"` (default), `"tel"`, or `"password"`. Use `"password"` to mask characters. |
| `groups` | Array like `[3, 3]` to visually group inputs with separators. Sum must equal `length`. |
| `validate` | Custom function `(char) => boolean`. Overrides `inputPattern` filtering. |

---

## Data Attributes (for CSS selectors and testing)

Every one of these is written or absent, never `"false"`, so the bare attribute
selector is the one to use: `[data-error]`, not `[data-error="true"]`.

- `data-error="true"` on the root and on each input — when `error={true}`
- `data-disabled="true"` on the root and on each input — when disabled
- `data-loading="true"` on the root — when `loading={true}`
- `data-valid="true"` on the root in the success state, and on the success message
- `data-invalid="true"` on the error message
- `data-index` on each input — its zero-based position, always present
- `data-filled="true"` on an input holding a character
- `data-group` on each group wrapper — the group's zero-based index, only when
  `groups` is set

DOM nesting: `root > label + description + control > (group > input…) + separator + message`

---

## All Props

<!-- generated from OtpInput.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `length` | number | `6` | Number of OTP input fields. |
| `value` | string | — | Controlled OTP value. |
| `defaultValue` | string | — | Initial OTP value for uncontrolled usage. |
| `onValueChange` | object | — | (value: string) => void - Fires when the OTP value changes. |
| `onComplete` | object | — | (value: string) => void - Fires when all fields are filled. |
| `label` | object | — | React.ReactNode - Label rendered above the input. |
| `id` | string | — | HTML id attribute. |
| `name` | string | — | Form field name. |
| `required` | boolean | `false` | Marks the field as required. |
| `description` | object | — | React.ReactNode - Helper text rendered below the label. |
| `error` | boolean | `false` | Displays the input in an error state. |
| `errorMessage` | object | — | React.ReactNode - Error message displayed below the input. |
| `success` | boolean | `false` | Displays the input in a success state. |
| `successMessage` | object | — | React.ReactNode - Success message displayed below the input. |
| `loading` | boolean | `false` | Shows a loading state. |
| `disabled` | boolean | `false` | Disables all input fields. |
| `groups` | array | — | Defines grouping of input fields (e.g. [3, 3] for two groups of 3). |
| `separator` | object | — | React.ReactNode - Content rendered between groups. |
| `allowPaste` | boolean | `true` | Enables pasting OTP values. |
| `autoFocusFirst` | boolean | `false` | Automatically focuses the first input on mount. |
| `inputType` | `"text"` \| `"password"` \| `"tel"` | `"text"` | HTML input type for each field. |
| `inputPattern` | string | `"\\d*"` | HTML pattern attribute for input validation. |
| `inputClassNames` | array | — | Per-input CSS class overrides. |
| `fullWidth` | boolean | `false` | Makes the input span the full width of its container. |
| `renderInput` | object | — | (props: OtpInputRenderProps) => ReactNode - Custom render function for individual input fields. |
| `validate` | object | — | (char: string) => boolean - Custom validation function for each character. |
| `inputAriaLabel` | object | — | (index: number, length: number) => string - Function to generate aria-label for each input. |
| `groupAriaLabel` | string | `"One-time password input"` | Accessible label for the input group. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

A restyle that drops the box, such as an underline, must also replace the focus ring: pass `focus-visible:ring-0` and mark focus on the edge you keep, or the default `focus-visible:ring-2` survives the merge and each cell focuses as a box.

### Slot → visual mapping

| Slot | Element |
|------|---------|
| `root` | The field and everything labelling it. |
| `label` | The label above the row. |
| `description` | The helper line under the label. |
| `control` | The row of boxes. |
| `group` | One run of boxes when `groups` splits the code up. |
| `input` | A single character box. |
| `separator` | What is drawn between two groups. |
| `message` | The error or hint line under the row. |

### The `input` slot carries the error and focus states

The box is painted by one class string holding four variants:
`data-[error]:border-cl-error` for the error state,
`focus-visible:border-cl-border-input-focus` for focus, and
`data-[error]:focus-visible:border-cl-border-input-focus` for **both at once**.
That third one is not redundant. Without it, a focused box in an error state
kept the error border and the focus ring landed on it at **1.30:1** — measured,
and below the 3:1 a focus indicator has to clear.

A plain utility of the same property drops all three, so
`classes={{ input: "border-gray-300" }}` leaves a field with no error border and
no focus indicator. Pass the states you want to keep:

```tsx
<OtpInput
  error
  classes={{
    input:
      "border-gray-300 data-[error]:border-red-600 focus-visible:border-blue-600 data-[error]:focus-visible:border-blue-600",
  }}
/>
```

---

## Changed behaviour

**A default `<OtpInput />` now rejects non-digits.**

`inputPattern` defaults to `"\\d*"` and has always set the `pattern` attribute,
`inputMode="numeric"` and the "Digit N of M" slot labels. It did not filter,
because `pattern` is form-validation metadata that browsers do not apply to
typing — so the component told the browser, the soft keyboard and the screen
reader that it wanted digits, and then accepted letters (E2E-TRIAGE.md). The
filter is now derived from the same pattern, so all four agree.

- **Digits-only consumers:** no change; this is what the labels already claimed.
- **Consumers relying on the permissive default** must now say so, with
  `inputPattern="[\\s\\S]"` or an explicit `validate`.
- **Alphanumeric codes:** `inputPattern="[A-Za-z0-9]"`, which also widens
  `inputMode` to `"text"` and relabels the slots "Character N of M".
- An explicit `validate` still wins outright.
- A pattern that will not compile falls back to accepting everything, matching
  what the browser does with the attribute.

---

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves to the next box. Every box is in the tab order — there is no roving tabindex, so tabbing out of the field takes as many presses as it has boxes. |
| `ArrowLeft`, `ArrowRight` | Moves between boxes. |
| `Home`, `End` | Jumps to the first or last box. |
| `Backspace` | Clears the current box and steps back. On a box that is already empty it steps back and clears that one instead. |
| `Delete` | Clears the current box without moving. |
| Printable characters | Fills the box and advances. A paste of the full code fills every box at once. |

---

## Accessibility

- Each input has an `aria-label`: "Digit N of M" when `inputPattern` accepts
  only digits, "Character N of M" otherwise. `inputAriaLabel` replaces it.
- Label associated via `id` / `htmlFor`
- `aria-invalid` set on error state
- `aria-describedby` links error/description
- Full keyboard navigation: Arrow keys, Backspace, Delete, Home, End. Tab also
  steps box to box — every box is focusable, not just the first.
- Paste support fills all fields at once

---

## Demo Reference

**File:** `src/pages/demo/OtpInputDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Minimal | `title="Basic Usage"` |
| Label | `title="With Label"` |
| Error | `title="Error State"` |

| File | Contains |
|------|----------|
| `OtpInput.tsx` | Main component |
| `utils/types.ts` | OtpInputProps, OtpInputClasses |
| `utils/constants.ts` | DEFAULT + PRESET classes |
