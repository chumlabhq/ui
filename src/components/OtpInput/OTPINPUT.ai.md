# OtpInput

> A one-time password input with per-character fields, keyboard navigation, paste support, grouping, and validation.

**Category:** Form
**Keywords:** otp, one-time password, verification code, pin input, code input, 2fa, mfa

---

## Quick Answer

Use `<OtpInput value={otp} onValueChange={setOtp} />` for a 6-digit OTP input. Supports `length`, `type` (numeric/alphanumeric), `masked` mode, `groupPattern` for visual grouping, and built-in error/success states.

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
| `type` | `"numeric"` (default) or `"alphanumeric"`. Restricts allowed characters. |
| `groupPattern` | Array like `[3,3]` to visually group inputs with separators. Sum must equal `length`. |
| `validate` | Custom function `(char) => boolean`. Overrides `type` filtering. |
| `masked` | Shows dots instead of characters (like password fields). |

---

## Accessibility

- Each input has proper `aria-label` ("Digit 1 of 6")
- Label associated via `id` / `htmlFor`
- `aria-invalid` set on error state
- `aria-describedby` links error/description
- Full keyboard navigation: Arrow keys, Backspace, Delete, Home, End
- Paste support fills all fields at once

---

## Demo Reference

**File:** `src/pages/demo/OtpInputDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Minimal | `title="Basic Usage"` |
| Label | `title="With Label"` |
| Grouped | `title="Group Pattern"` |
| Masked | `title="Masked"` |
| Error | `title="Error State"` |

| File | Contains |
|------|----------|
| `OtpInput.tsx` | Main component |
| `utils/types.ts` | OtpInputProps, OtpInputClasses |
| `utils/constants.ts` | DEFAULT + PRESET classes |
