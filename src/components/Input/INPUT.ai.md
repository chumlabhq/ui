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
| `onStartIconClick` | Requires `startIconAriaLabel` for accessibility |
| `onEndIconClick` | Requires `endIconAriaLabel` for accessibility |
| `showCount` | Requires `maxLength` to be set |
| `size` | Sets the control's padding and type: 28/40/52px fields, 30/42/54 with the border. Emits `data-size` as well, for CSS that wants it |
| `prefix` / `suffix` | For static text/elements. Use `startIcon`/`endIcon` for icons |
| `clearable` | Only shows clear button when input has a value |

---

## Data Attributes

- `data-size` on root — "sm", "md", "lg"
- `data-disabled` on root — when disabled
- `data-error` on root — when error state
- `data-valid` on root — when success state
- `data-readonly` on root — when readOnly
- `data-slot="input"` on the input element
- `data-slot="count"` on the character count

DOM nesting: `root > label + description + wrapper(prefix + startIcon + input + endIcon + suffix + clear + loader) + error/success + count`

---

## All Props

<!-- generated from Input.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | object | — | React.ReactNode - Label rendered above the input. |
| `description` | object | — | React.ReactNode - Helper text rendered below the label. |
| `error` | boolean | `false` | Displays the input in an error state. |
| `errorMessage` | object | — | React.ReactNode - Error message displayed below the input. |
| `success` | boolean | `false` | Green success state for validated fields. |
| `successMessage` | object | — | React.ReactNode - Success message displayed below the input. |
| `size` | `"sm"` \| `"md"` \| `"lg"` | — | Sets the control's padding and type size together: a 28, 40 and 52px field, 30/42/54 with its border. Also emits data-size on the root for CSS to target; the attribute is a hook beside the sizing, not the sizing itself. |
| `prefix` | object | — | React.ReactNode - Inline text or element rendered before the input (e.g. '$', 'https://'). |
| `suffix` | object | — | React.ReactNode - Inline text or element rendered after the input (e.g. 'USD', '.com'). |
| `startIcon` | object | — | React.ReactNode - Icon rendered before the input. Becomes a button when onStartIconClick is provided. |
| `endIcon` | object | — | React.ReactNode - Icon rendered after the input. Becomes a button when onEndIconClick is provided. |
| `onStartIconClick` | object | — | (event: MouseEvent<HTMLButtonElement>) => void - Makes startIcon a clickable button, called with the native click event. Requires startIconAriaLabel for accessibility. |
| `onEndIconClick` | object | — | (event: MouseEvent<HTMLButtonElement>) => void - Makes endIcon a clickable button, called with the native click event. Requires endIconAriaLabel for accessibility. |
| `startIconAriaLabel` | string | — | Accessible label for startIcon when it is clickable. Required with onStartIconClick. |
| `endIconAriaLabel` | string | — | Accessible label for endIcon when it is clickable. Required with onEndIconClick. |
| `onValueChange` | object | — | (value: string) => void - Fires with the current string value when the value changes. |
| `clearable` | boolean | `false` | Show a built-in clear button when the input has a value. |
| `onClear` | object | — | () => void - Callback when the clear button is clicked. |
| `showCount` | boolean | `false` | Show character count (requires maxLength to be set). |
| `loading` | boolean | `false` | Shows a loading spinner inside the input. |
| `loader` | object | — | React.ReactNode - Custom loader element to replace the default spinner. |
| `loaderSize` | number | `16` | Size of the default CircularLoader in pixels. Ignored when a custom loader prop is provided. |
| `fullWidth` | boolean | `false` | Makes the input span the full width of its container. |
| `className` | string | — | CSS class for the root container element. |
| `classes` | object | — | Slot-based class overrides for internal elements. |
| `unstyled` | boolean | `false` | When true, all default classes are removed so you can style from scratch. |

## Sub-component Props

Generated from the types by `scripts/build-subcomponent-schemas.mjs`.

### InputLabel

| Prop | Type | Description |
| --- | --- | --- |
| `label` | `ReactNode` | The label's content. |
| `required` | `boolean \| undefined` | Marks the field required and draws the required indicator. |
| `htmlFor` | `string \| undefined` | The id of the control this labels. Set automatically when the label is rendered by the field. |
| `className` | `string \| undefined` | Additional classes for the root element. |

---

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

A restyle that drops the box, such as an underline, must also replace the focus ring: pass `focus-within:ring-0` and mark focus on the edge you keep, or the default `focus-within:ring-2` survives the merge and the field focuses as a box.

### How class merging works

1. **Default** — uses `DEFAULT_INPUT_CLASSES` with dark mode, focus ring, rounded corners
2. **Partial override** — REPLACES per slot

**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

3. **Unstyled** — all slots empty

### Slot → visual mapping

```
root (flex flex-col)
├── label
├── description
├── control (border, focus ring, flex row)
│   ├── prefix
│   ├── startIcon
│   ├── input
│   ├── endIcon
│   ├── suffix
│   ├── clear button
│   └── loader
├── message / message
└── count
```

| "I want to change..." | Slot | Notes |
|------------------------|------|-------|
| Border/focus ring | `control` | Contains all input chrome |
| Input text | `input` | Font, color, placeholder |
| Label style | `label` | Font weight, size, color |
| Error text | `message` | Color, icon |
| The whole field and its labelling | `root` | The outer wrapper; `fullWidth` adds `w-full` here |
| The character counter | `count` | Shown under the field when `showCount` is set |

### Dark mode

Defaults include `dark:` variants for all slots. When overriding, provide both:

```tsx
classes={{ control: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" }}
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
  endIconAriaLabel={show ? "Hide password" : "Show password"}
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

## Keyboard Interactions

A native `<input>`: the browser owns text entry, selection and the clear affordance.

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves focus to the field. `disabled` removes it from the tab order; `readOnly` does not. |

---

## Accessibility

- Native `<input>` element with proper `type`, `id`, `name`
- Label associated via `htmlFor` / `id` pairing
- `aria-invalid` set on error
- `aria-describedby` links error, success, description, and count
- `aria-required` set when required
- Icon buttons get `aria-label` via `startIconAriaLabel` / `endIconAriaLabel`
- Character count has `role="status"` and `aria-live="polite"`

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| No focus ring | Overrode `control` without focus classes | Include `focus-within:ring-2` in your override |
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
