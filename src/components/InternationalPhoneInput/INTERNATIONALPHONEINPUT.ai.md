# InternationalPhoneInput

> Phone number input with country code selection, automatic formatting, paste detection, copy formats, and full style customization.

**Category:** Form
**Keywords:** phone, telephone, international, country code, dial code, phone input, phone number, country selector, paste detection, copy format, e164, validation, formatting

---

## Quick Answer

Use `<InternationalPhoneInput />` for phone number entry with country selection. Supports controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) modes. Auto-formats numbers by country, validates on blur, detects country from pasted international numbers, and copies in E.164/international/national format. Works out-of-the-box with built-in Tailwind styles.

---

## Import

```tsx
import { InternationalPhoneInput } from "@chumlab/ui/international-phone-input";
import type { PhoneNumberData, CountryOption } from "@chumlab/ui/international-phone-input";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { useState } from "react";
import { InternationalPhoneInput } from "@chumlab/ui/international-phone-input";
import type { PhoneNumberData } from "@chumlab/ui/international-phone-input";

export default function Example() {
  const [phone, setPhone] = useState<PhoneNumberData | undefined>();
  return (
    <InternationalPhoneInput
      label="Phone Number"
      value={phone}
      onValueChange={setPhone}
      placeholder="Enter phone number"
    />
  );
}
```

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `value` + `defaultValue` | Never combine. Use one or the other. |
| `value` requires `onValueChange` | Controlled mode — both needed together. |
| `clearable` | Only shows clear button when phone input has content and not disabled/readOnly. |
| `enablePasteDetection` | Must be `true` for `onPasteDetected` to fire. |
| `copyFormat` | Only affects Ctrl+C behavior. Does not change display format. |
| `validateOnBlur` | When `true` (default), shows validation error on blur. Set `false` to disable. |
| `validationMessage` | Overrides the built-in "Please enter a valid phone number" message. |
| `validate` | Authoritative custom validator. Receives the full `PhoneNumberData` (incl. built-in `isValid` and E.164 `fullNumber`); its verdict overrides the built-in for both the emitted `isValid` and the blur error. Return `boolean` or `{ valid, message }`. Compose via `data.isValid && myCheck(data)`. For real number validation, use the opt-in `createLibphonenumberValidator(opts?)` from `@chumlab/ui/phone-validators` — `opts.mode` (`"isValid"` default \| `"isPossible"`), `opts.mobileOnly` (default `false`; when `true`, rejects CONFIRMED fixed-line numbers like `+91 1234567890` — accepts `MOBILE` and `FIXED_LINE_OR_MOBILE`, so US and other regions that can't disambiguate still pass, which is what SMS/OTP flows want), `opts.message`. Backed by the `/max` metadata. |
| `formatPatterns` | Merged over the built-in patterns: a matching key overrides that pattern, new keys are added. Keyed by pattern name. |
| `lengthRules` | Merged over the built-in rules: a matching country key overrides that country's min/max, new keys are added. Keyed by country code (uppercase). |
| `forceDropdownPosition` | Only meaningful with `dropdownPosition`. Disables auto-flip. |
| `lockScroll` | Prevents body scroll while country dropdown is open. Default: `false`. |
| `renderCountryOption` | Replaces default country option rendering in the dropdown list. |
| `renderSelectedCountry` | Replaces default selected country rendering in the trigger. |
| `name` | Renders two hidden inputs: `{name}` (full number) and `{name}_country` (country code). |

---

## Data Attributes (for CSS selectors and testing)

**Root (`data-slot="root"`):**
- `data-disabled` — when `disabled={true}`
- `data-error` — when `error={true}` or validation fails
- `data-success` — when `success={true}` (without error)
- `data-readonly` — when `readOnly={true}`
- `data-full-width` — when `fullWidth={true}`
- `data-loading` — when `loading={true}`

**Input (`data-slot="input"`):**
- `data-disabled`, `data-error`, `data-success`, `data-readonly` — mirrors root

**Other slots:** `data-slot="label"`, `data-slot="wrapper"`, `data-slot="error"`, `data-slot="success"`

DOM nesting: `root > label + description + wrapper(group) > SearchableDropdown + input + clearButton + hiddenInputs + statusLive + error + success`

---

## All Props

<!-- generated from InternationalPhoneInput.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | object | — | PhoneNumberValue - Controlled phone value with countryCode and phoneNumber fields. |
| `defaultValue` | object | — | PhoneNumberValue - Default phone value for uncontrolled usage. |
| `onValueChange` | object | — | (data: PhoneNumberData) => void - Fires when the phone number changes, providing full validation data. |
| `onCountryChange` | object | — | (country: CountryOption) => void - Fires when the selected country changes. |
| `defaultCountry` | string | — | ISO country code for the default selected country. |
| `countries` | array | — | Custom list of country options to display. |
| `preferredCountries` | array | — | ISO country codes to show at the top of the country list. |
| `id` | string | — | HTML id attribute. |
| `name` | string | — | Form field name. |
| `label` | object | — | React.ReactNode - Label rendered above the input. |
| `description` | object | — | React.ReactNode - Helper text displayed below the label. |
| `loading` | boolean | `false` | When true, the input is in a loading state. |
| `clearable` | boolean | `false` | When true, shows a clear button to reset the phone number. |
| `onClear` | object | — | () => void - Called when the clear button is clicked. |
| `required` | boolean | `false` | Marks the field as required. |
| `disabled` | boolean | `false` | Disables the input. |
| `readOnly` | boolean | `false` | Makes the input read-only. |
| `error` | boolean | `false` | Displays the input in an error state. |
| `errorMessage` | object | — | React.ReactNode - Error message displayed below the input. |
| `success` | boolean | `false` | Displays the input in a success state. |
| `successMessage` | object | — | React.ReactNode - Success message displayed below the input. |
| `placeholder` | string | `"Enter phone number"` | Placeholder text for the phone number input. |
| `fullWidth` | boolean | `false` | Makes the input span the full width of its container. |
| `validateOnBlur` | boolean | `true` | Validates the phone number when the input loses focus. |
| `validationMessage` | object | — | React.ReactNode - Custom validation message shown on blur validation. |
| `validate` | object | — | (data: PhoneNumberData) => boolean \| { valid: boolean; message?: string } - Authoritative custom validator. Overrides the built-in length check for both the emitted isValid and the blur error. For real number validation, use createLibphonenumberValidator() from @chumlab/ui/phone-validators. |
| `autoComplete` | string | — | Native input autocomplete. Defaults to "off" so browser autofill can't corrupt the national-number field; pass e.g. "tel-national" to opt in. |
| `enablePasteDetection` | boolean | `false` | Enables automatic detection and parsing of pasted phone numbers. |
| `copyFormat` | `"e164"` \| `"international"` \| `"national"` | `"e164"` | Format used when copying the phone number. |
| `onPasteDetected` | object | — | (data: PasteDetectedData) => void - Fires when a phone number paste is detected. |
| `countryDropdownPlaceholder` | string | `"Country"` | Placeholder text for the country dropdown. |
| `countrySearchPlaceholder` | string | `"Search countries..."` | Placeholder text for the country search input. |
| `countryDropdownAriaLabel` | string | `"Select country"` | Accessible label for the country dropdown. |
| `selectedIcon` | object | — | React.ReactNode - Custom icon for the selected country indicator. |
| `flagSize` | number | `22` | Pixel width of the flag rendered in the trigger and dropdown options. Height auto-scales at the 22:17 aspect ratio. Defaults to 22. |
| `renderCountryOption` | object | — | (props: CountryOptionRenderProps) => ReactNode - Custom render function for country options. |
| `renderSelectedCountry` | object | — | (country: CountryOption) => ReactNode - Custom render function for the selected country display. |
| `formatPatterns` | object | — | Record<string, PhoneFormatPattern> - Custom phone number formatting patterns by country. |
| `lengthRules` | object | — | Record<string, PhoneLengthRule> - Custom phone number length validation rules by country. |
| `className` | string | — | Additional CSS class for the root element. |
| `style` | object | — | Inline styles for the root element. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `dropdownPosition` | `"top"` \| `"bottom"` | — | Vertical placement of the country dropdown relative to the trigger. |
| `forceDropdownPosition` | boolean | — | Locks the country dropdown to the specified position without auto-flipping. |
| `dropdownZIndex` | number | — | Z-index of the country dropdown popup. |
| `dropdownGap` | number | — | Gap in pixels between trigger and country dropdown popup. |
| `portalContainer` | object | — | HTMLElement \| null - Portal target for the country dropdown. |
| `lockScroll` | boolean | — | Locks body scroll while the country dropdown is open. |

## Ref API

```tsx
import { useRef } from "react";
import { InternationalPhoneInput } from "@chumlab/ui/international-phone-input";

const inputRef = useRef<HTMLInputElement>(null);

// Focus the phone input
inputRef.current?.focus();

// Select all text
inputRef.current?.select();

// Read current value
console.log(inputRef.current?.value);

<InternationalPhoneInput ref={inputRef} label="Phone" />
```

---

## Styling Guide

### How class merging works

1. **Default** (no `classes`, no `unstyled`) — uses `DEFAULT_INTERNATIONAL_PHONE_INPUT_CLASSES`
2. **Partial override** (`classes` without `unstyled`) — **replaces** per slot, not additive
3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything via `classes`

### Slot → visual mapping

```
root
├── label
├── description
└── wrapper (role="group")
    ├── countrySelect (SearchableDropdown root)
    │   ├── countrySelectTrigger
    │   ├── countrySelectDropdown (portal)
    │   │   ├── countrySelectSearchInput
    │   │   │   ├── countrySelectSearchIcon
    │   │   │   └── countrySelectSearchInputElement
    │   │   └── countrySelectOptionList
    │   │       └── countrySelectOption / countrySelectOptionSelected
    │   │           └── countrySelectCheckIcon
    │   └── countrySelectChevron
    │   └── countrySelectNoResults
    ├── input
    └── clearButton (when clearable)
├── error
└── success
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Root container | `root` | Layout wrapper |
| Label styling | `label` | |
| Helper text | `description` | Below label |
| Input + dropdown row | `wrapper` | `flex` container |
| Phone text input | `input` | The `<input type="tel">` |
| Country trigger button | `countrySelectTrigger` | Flag + dial code + chevron |
| Country dropdown panel | `countrySelectDropdown` | Portal-rendered |
| Country option row | `countrySelectOption` | Each country in list |
| Selected country highlight | `countrySelectOptionSelected` | Additional class on selected |
| Check icon | `countrySelectCheckIcon` | Selected indicator |
| Search input | `countrySelectSearchInputElement` | In dropdown |
| Error message | `error` | Below wrapper |
| Success message | `success` | Below wrapper |

### Dark mode

Defaults use Tailwind `dark:` prefix, activated by `<html class="dark">`. When overriding slots, always provide both light and dark variants.

### Styling via data attributes

```css
/* Tailwind arbitrary variant */
[data-error] .my-input { @apply border-red-500; }

/* Plain CSS */
[data-slot="input"][data-disabled] { opacity: 0.5; }
```

### Complete themed example

```tsx
<InternationalPhoneInput
  unstyled
  label="Phone"
  classes={{
    root: "flex flex-col gap-1",
    label: "text-sm font-medium text-gray-700 dark:text-gray-200",
    wrapper: "flex gap-2 items-stretch",
    input: "flex-1 h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500",
    countrySelectTrigger: "flex items-center gap-2 h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 min-w-[120px]",
    countrySelectDropdown: "w-72 border rounded-md shadow-lg bg-white dark:bg-gray-800",
    countrySelectOption: "flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700",
    countrySelectOptionSelected: "bg-indigo-50 dark:bg-indigo-900/20",
    countrySelectOptionList: "max-h-60 overflow-y-auto",
    countrySelectSearchInput: "flex items-center gap-2 px-3 py-2 border-b",
    countrySelectSearchInputElement: "flex-1 bg-transparent outline-none text-sm",
    countrySelectChevron: "w-4 h-4 shrink-0",
    countrySelectCheckIcon: "w-4 h-4 text-indigo-600",
    countrySelectSearchIcon: "w-4 h-4 text-gray-400",
    countrySelectNoResults: "px-3 py-4 text-sm text-center text-gray-500",
    error: "text-xs mt-1 text-red-500",
    success: "text-xs mt-1 text-green-600",
    description: "text-xs mt-1 text-gray-400",
  }}
/>
```

---

## Patterns

### Controlled with validation feedback

```tsx
const [phone, setPhone] = useState<PhoneNumberData>();
<InternationalPhoneInput
  label="Phone"
  value={phone}
  onValueChange={setPhone}
  error={phone ? !phone.isValid : false}
  errorMessage="Invalid phone number"
/>
```

### Paste detection with country auto-switch

```tsx
<InternationalPhoneInput
  enablePasteDetection
  onPasteDetected={(data) => console.log(data.detectedCountry?.name)}
  copyFormat="e164"
/>
```

### Custom country subset

```tsx
const euCountries = [
  { value: "DE", label: "Germany (+49)", flag: "de", dialCode: "+49", name: "Germany" },
  { value: "FR", label: "France (+33)", flag: "fr", dialCode: "+33", name: "France" },
];
<InternationalPhoneInput countries={euCountries} defaultCountry="de" />
```

### Force dropdown position with scroll lock

```tsx
<InternationalPhoneInput
  dropdownPosition="bottom"
  forceDropdownPosition
  lockScroll
/>
```

### Form integration with hidden inputs

```tsx
<form onSubmit={handleSubmit}>
  <InternationalPhoneInput name="phone" label="Phone" required />
  {/* Renders hidden inputs: phone (full number) and phone_country (country code) */}
  <button type="submit">Submit</button>
</form>
```

---

## Accessibility

- Label auto-associated via `htmlFor`; falls back to `aria-label="Phone number input"` when no label
- Required inputs set `aria-required="true"` and show asterisk (hidden from screen readers)
- Error state sets `aria-invalid` on input
- Error/success/description connected via `aria-describedby`
- Error messages use `role="alert"`; success uses `role="status"`
- Country dropdown and input grouped via `role="group"` with `aria-labelledby`
- Country change announced via `aria-live="polite"` region
- Country dropdown has configurable `aria-label` via `countryDropdownAriaLabel`
- Full keyboard navigation in country dropdown (Arrow keys, Enter, Escape, type-ahead search)
- Clear button has `aria-label="Clear phone number"`
- Supports `prefers-reduced-motion` via SearchableDropdown internals

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Styles look wrong after overriding one class | `classes` replaces per slot, not merges | Provide the full class string for each slot you override |
| Validation error shows on every blur | `validateOnBlur` defaults to `true` | Set `validateOnBlur={false}` if you want manual validation only |
| Paste detection doesn't work | `enablePasteDetection` not set | Add `enablePasteDetection` prop |
| Country doesn't auto-detect on paste | Number missing `+` prefix | Paste detection requires international format with dial code |
| Want browser autofill to fill the number | `autoComplete` defaults to `"off"` to protect the split field | Pass `autoComplete="tel-national"` to opt back in |
| Copy gives unexpected format | `copyFormat` defaults to `"e164"` | Set `copyFormat="international"` or `"national"` |
| Controlled value not updating | Missing `onValueChange` | Always pair `value` with `onValueChange` |
| Custom format patterns ignored | Wrong key structure | Use `{ pattern: (digits) => string, countries: ["xx"] }` |
| Country dropdown opens in wrong direction | Auto-flip chose different position | Use `forceDropdownPosition={true}` to lock direction |

---

## Demo Reference

**File:** `src/pages/demo/InternationalPhoneInputDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | Zero-config usage |
| Uncontrolled mode | `title="Uncontrolled Mode"` | defaultValue usage |
| With label | `title="With Label"` | Label + required |
| Error / success | `title="Validation States"` | Error and success styling |
| i18n validation | `title="Validation Message (i18n)"` | Custom messages |
| Paste detection | `title="Copy & Paste Detection"` | enablePasteDetection + callbacks |
| Copy formats | `title="Copy Format Variants"` | E.164, international, national |
| Disabled / read-only | `title="Disabled State"`, `title="Read-Only State"` | State demos |
| Custom countries | `title="Custom Countries List"` | Subset of countries |
| Custom rendering | `title="Custom Country Rendering"` | renderCountryOption + renderSelectedCountry |
| Custom formatting | `title="Custom Format Patterns & Length Rules"` | formatPatterns + lengthRules |
| Color themes | `title="Custom Color Themes"` | Purple, green, orange themes |
| Selected icons | `title="Custom Selected Icon"` | Star, circle, dot icons |
| Form integration | `title="Form Semantics"` | name prop + hidden inputs |
| Ref forwarding | `title="Ref Forwarding"` | Focus, select, getValue |
| Force position | `title="Dropdown Position"` | dropdownPosition + forceDropdownPosition |
| Scroll lock | `title="Scroll Lock"` | lockScroll prop |
| Checkout form | `title="Checkout Form"` | Real-world form example |
| Combined | `title="Combined: All Features"` | Kitchen-sink demo |

### Source file index

| File | Contains |
|------|----------|
| `InternationalPhoneInput.tsx` | Main component, ref forwarding, event handling |
| `utils/types.ts` | All TypeScript interfaces and prop types |
| `constants.ts` | Default countries, formatting patterns, length rules, default classes |
| `utils.ts` | Formatting, validation, parsing, copy, cursor utilities |
| `index.ts` | Public exports |
| `__tests__/InternationalPhoneInput.test.tsx` | Unit tests |
