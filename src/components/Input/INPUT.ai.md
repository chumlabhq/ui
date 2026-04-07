# Input

> A production-grade text input with labels, icons, prefix/suffix, clearable, character count, validation states, and full form integration.

**Category:** Form
**Keywords:** input, text input, text field, form, label, validation, clearable, prefix, suffix, password

---

## Quick Answer

Use `<Input label="Name" placeholder="Enter name..." />` for a labeled input. Built-in styles include dark mode, focus ring, error/success states. Use `onValueChange` for simple string callback or `onChange` for the DOM event.

---

## Import

```tsx
import { Input, InputLabel } from "@chumlab/ui/input";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Input } from "@chumlab/ui/input";

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 380 }}>
      <Input label="Full Name" placeholder="Enter your name..." />
      <Input label="Email" placeholder="you@example.com" description="We'll never share your email" />
      <Input label="Password" type="password" placeholder="Enter password..." required />
    </div>
  );
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `onStartIconClick` | Requires `startIconLabel` for accessibility |
| `onEndIconClick` | Requires `endIconLabel` for accessibility |
| `showCount` | Requires `maxLength` to be set |
| `size` | Does NOT apply built-in styles — emits `data-size` for CSS targeting |
| `prefix` / `suffix` | For static text/elements. Use `startIcon`/`endIcon` for icons |
| `clearable` | Only shows clear button when input has a value |

---

## Data Attributes

- `data-size` on root — "sm", "md", "lg"
- `data-disabled` on root — when disabled
- `data-error` on root — when error state
- `data-success` on root — when success state
- `data-readonly` on root — when readOnly
- `data-slot="input"` on the input element
- `data-slot="count"` on the character count

DOM nesting: `root > label + description + wrapper(prefix + startIcon + input + endIcon + suffix + clear + loader) + error/success + count`

---

## All Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Label above the input |
| `description` | `ReactNode` | — | Helper text below label |
| `placeholder` | `string` | — | Placeholder text |
| `error` | `boolean` | `false` | Error state |
| `errorMessage` | `ReactNode` | — | Error message text |
| `success` | `boolean` | `false` | Success state |
| `successMessage` | `ReactNode` | — | Success message text |
| `size` | `InputSize` | — | Visual size variant (data attribute only) |
| `prefix` | `ReactNode` | — | Static content before input (e.g. "$") |
| `suffix` | `ReactNode` | — | Static content after input (e.g. ".com") |
| `startIcon` | `ReactNode` | — | Icon before input |
| `endIcon` | `ReactNode` | — | Icon after input |
| `onStartIconClick` | `() => void` | — | Makes startIcon a button |
| `onEndIconClick` | `() => void` | — | Makes endIcon a button |
| `startIconLabel` | `string` | — | Aria label for clickable startIcon |
| `endIconLabel` | `string` | — | Aria label for clickable endIcon |
| `onValueChange` | `(value: string) => void` | — | Simple value callback |
| `clearable` | `boolean` | `false` | Show clear button |
| `onClear` | `() => void` | — | Clear button callback |
| `showCount` | `boolean` | `false` | Show character count |
| `loading` | `boolean` | `false` | Loading state |
| `fullWidth` | `boolean` | `false` | Full width container |
| `classes` | `InputClasses` | — | Per-slot class overrides |
| `unstyled` | `boolean` | `false` | Remove all default styles |
| `required` | `boolean` | — | Required field |
| `disabled` | `boolean` | — | Disabled state |
| `readOnly` | `boolean` | — | Read-only state |

---

## Styling Guide

### How class merging works

1. **Default** — uses `DEFAULT_INPUT_CLASSES` with dark mode, focus ring, rounded corners
2. **Partial override** — REPLACES per slot
3. **Unstyled** — all slots empty

### Slot → visual mapping

```
root (flex flex-col)
├── label
├── description
├── wrapper (border, focus ring, flex row)
│   ├── prefix
│   ├── startIcon
│   ├── input
│   ├── endIcon
│   ├── suffix
│   ├── clear button
│   └── loader
├── error / success
└── count
```

| "I want to change..." | Slot | Notes |
|------------------------|------|-------|
| Border/focus ring | `wrapper` | Contains all input chrome |
| Input text | `input` | Font, color, placeholder |
| Label style | `label` | Font weight, size, color |
| Error text | `error` | Color, icon |

### Dark mode

Defaults include `dark:` variants for all slots. When overriding, provide both:

```tsx
classes={{ wrapper: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" }}
```

---

## Patterns

### Password with toggle

```tsx
const [show, setShow] = useState(false);
<Input
  type={show ? "text" : "password"}
  label="Password"
  endIcon={show ? <EyeOff /> : <Eye />}
  onEndIconClick={() => setShow(!show)}
  endIconLabel={show ? "Hide password" : "Show password"}
/>
```

### With validation

```tsx
<Input
  label="Email"
  error={!isValid}
  errorMessage="Please enter a valid email"
  success={isValid}
  successMessage="Looks good!"
/>
```

---

## Accessibility

- Native `<input>` element with proper `type`, `id`, `name`
- Label associated via `htmlFor` / `id` pairing
- `aria-invalid` set on error
- `aria-describedby` links error, success, description, and count
- `aria-required` set when required
- Icon buttons get `aria-label` via `startIconLabel` / `endIconLabel`
- Character count has `role="status"` and `aria-live="polite"`

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| No focus ring | Overrode `wrapper` without focus classes | Include `focus-within:ring-2` in your override |
| Character count not showing | Missing `maxLength` | Set both `showCount` and `maxLength` |
| Icon not clickable | Missing click handler | Pass `onStartIconClick` or `onEndIconClick` |
| Classes don't merge | Expected additive | Classes REPLACE per slot |
| Dark mode wrong | Overrode without dark variants | Add `dark:` classes to your override |

---

## Demo Reference

**File:** `src/pages/demo/InputDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal | `title="Basic Usage"` | Label + placeholder |
| Icons | `title="Icons"` | Start/end icons |
| Prefix/Suffix | `title="Prefix & Suffix"` | Static addons |
| Clearable | `title="Clearable"` | Clear button |
| Validation | `title="Validation States"` | Error + success |
| Password | `title="Password Toggle"` | Show/hide toggle |
| Custom themes | `title="Custom Themes"` | Full class override |

| File | Contains |
|------|----------|
| `Input.tsx` | Main component with forwardRef, InputLabel export |
| `utils/types.ts` | InputProps, InputClasses, InputSize |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes |
| `index.ts` | Public exports |
