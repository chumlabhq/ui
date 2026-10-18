# TextArea

> A production-grade multi-line text input with auto-resize, character count, validation states, icons, and full form integration.

**Category:** Form
**Keywords:** textarea, text area, multiline input, form, auto resize, character count, validation

---

## Quick Answer

Use `<TextArea label="Message" placeholder="Write..." />` for a labeled textarea. Supports `autoResize` to grow with content, `showCount` + `maxLength` for character limits, and built-in dark mode.

---

## Import

```tsx
import { TextArea, TextAreaLabel } from "@chumlab/ui/textarea";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { TextArea } from "@chumlab/ui/textarea";

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
      <TextArea label="Message" placeholder="Write your message..." />
      <TextArea
        label="Bio"
        placeholder="Tell us about yourself..."
        description="Max 200 characters"
        maxLength={200}
        showCount
      />
    </div>
  );
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `showCount` | Requires `maxLength` to be set |
| `autoResize` | Overrides manual `resize` CSS. Sets `overflow: hidden` and `resize: none`. |
| `size` | Sets the control's padding and type: 28/40/52px fields, 30/42/54 with the border. Emits `data-size` as well, for CSS that wants it |
| `onStartIconClick` | Requires `startIconAriaLabel` for accessibility |
| `onEndIconClick` | Requires `endIconAriaLabel` for accessibility |

---

## Data Attributes

- `data-size` on root — "sm", "md", "lg"
- `data-disabled` on root — when disabled
- `data-error` on root — when error state
- `data-valid` on root — when success state
- `data-readonly` on root — when readOnly
- `data-loading` on root — when loading: the field dims, takes no input, and shows a spinner
- `data-reduce-motion` on that spinner — while reduced motion is in force
- `data-invalid` on the error message
- `data-slot="textarea"` on the textarea element
- `data-slot="count"` on the character count

DOM nesting: `root > label + description + wrapper(startIcon + textarea + endIcon + clear + loader) + error/success + count`

---

## All Props

<!-- generated from TextArea.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | object | — | React.ReactNode — Label displayed above the textarea. |
| `description` | object | — | React.ReactNode — Description text below the label. |
| `error` | boolean | `false` | Whether the textarea is in an error state. |
| `errorMessage` | object | — | React.ReactNode — Error message displayed below the textarea. |
| `success` | boolean | `false` | Green success state for validated fields. |
| `successMessage` | object | — | React.ReactNode — Success message displayed below the textarea. |
| `size` | `"sm"` \| `"md"` \| `"lg"` | — | Sets the control's padding and type size together: a 28, 40 and 52px field, 30/42/54 with its border. Also emits data-size on the root for CSS to target; the attribute is a hook beside the sizing, not the sizing itself. |
| `startIcon` | object | — | React.ReactNode — Icon rendered before the textarea. |
| `endIcon` | object | — | React.ReactNode — Icon rendered after the textarea. |
| `onStartIconClick` | object | — | (event: MouseEvent<HTMLButtonElement>) => void — Makes startIcon a clickable button, called with the native click event. |
| `onEndIconClick` | object | — | (event: MouseEvent<HTMLButtonElement>) => void — Makes endIcon a clickable button, called with the native click event. |
| `startIconAriaLabel` | string | — | Accessible label for startIcon when clickable. Required with onStartIconClick. |
| `endIconAriaLabel` | string | — | Accessible label for endIcon when clickable. Required with onEndIconClick. |
| `onValueChange` | object | — | (value: string) => void — Fires with the current string value when the value changes. |
| `clearable` | boolean | `false` | Show a built-in clear button when the textarea has a value. |
| `onClear` | object | — | () => void — Callback when the clear button is clicked. |
| `showCount` | boolean | `false` | Show character count (requires maxLength to be set). |
| `autoResize` | boolean | `false` | Automatically resize height to fit content. |
| `loading` | boolean | `false` | Whether the textarea is in a loading state. |
| `loader` | object | — | React.ReactNode — Custom loader element. |
| `loaderSize` | number | `16` | Size of the default CircularLoader in pixels. |
| `fullWidth` | boolean | `false` | Whether the textarea expands to fill its parent container. |
| `className` | string | — | CSS class for the root container element. |
| `classes` | object | — | Slot-based class overrides for internal elements. |
| `unstyled` | boolean | `false` | When true, all default classes are removed; only classes overrides apply. |
| `placeholder` | string | — | Placeholder text for the textarea. |
| `disabled` | boolean | `false` | Whether the textarea is disabled. |
| `required` | boolean | `false` | Whether the field is required. |
| `name` | string | — | Form field name attribute. |
| `id` | string | — | HTML id attribute. |
| `rows` | number | `4` | Number of visible text rows. |
| `maxLength` | number | — | Maximum number of characters allowed. |
| `value` | string | — | Controlled value of the textarea. |
| `defaultValue` | string | — | Default uncontrolled value. |

## Sub-component Props

Generated from the types by `scripts/build-subcomponent-schemas.mjs`.

### TextAreaLabel

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

1. **Default** — uses `DEFAULT_TEXTAREA_CLASSES` with dark mode, focus ring
2. **Partial override** — your classes compose with that slot's defaults; slots you don't name keep theirs.

**A plain utility of yours wins over every default in its group on that slot, states included.**
`classes={{ control: "bg-green-500" }}` paints green in every state, where a default
`data-[state=checked]:` background would otherwise keep winning. To restyle one state only,
pass that state's own variant (`data-[state=checked]:bg-green-500`). Defaults in other groups stay.

3. **Unstyled** — all slots empty

### Slot → visual mapping

```
root (flex flex-col)
├── label
├── description
├── control (border, focus ring)
│   ├── startIcon
│   ├── input
│   ├── endIcon
│   ├── clear button
│   └── loader
├── message / message
└── count
```

| "I want to change..." | Slot | Notes |
|------------------------|------|-------|
| Border/focus ring | `control` | Contains textarea chrome |
| Textarea text | `input` | Font, color, placeholder, resize |
| Label style | `label` | Font weight, size, color |
| Error text | `message` | Color, icon |
| The whole field and its labelling | `root` | The outer wrapper; `fullWidth` adds `w-full` here |
| The character counter | `count` | Shown under the field when `showCount` is set |

### Dark mode

Defaults include `dark:` variants. When overriding, provide both light and dark.

---

## Patterns

### Auto-resize textarea

```tsx
<TextArea autoResize rows={2} label="Notes" placeholder="Start typing..." />
```

### With character count

```tsx
<TextArea label="Bio" showCount maxLength={500} placeholder="Tell us about yourself..." />
```

### With validation

```tsx
<TextArea
  label="Feedback"
  error={!isValid}
  errorMessage="Feedback is required"
  success={isValid}
  successMessage="Thank you!"
  required
/>
```

---

## Forms

- **Submitted value.** With `name`, it submits the text, from the native textarea.
- **Reset.** A form reset — a `type="reset"` button or `form.reset()` — restores an uncontrolled textarea to `defaultValue` (or empty), and the submitted value with it. Like a native input it fires no change callback: `onValueChange` is not called. A controlled TextArea is left alone: it keeps the `value` you pass and calls nothing, as a controlled React `<input>` does. Reset your own state in the form's `onReset` if you want the field cleared.
- **Required.** An empty `required` TextArea blocks the form's submit and the browser focuses it. The field shows an error state only when you pass `error` and `errorMessage`.

## Keyboard Interactions

A native `<textarea>`: the browser owns text entry and selection.

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves focus to the field, and out of it — it does not insert a tab character. |

---

## Accessibility

- Native `<textarea>` element
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
| Auto-resize not working | `autoResize` not set | Pass `autoResize` prop |
| Count not showing | Missing `maxLength` | Set both `showCount` and `maxLength` |
| Resize handle visible with autoResize | Expected behavior when autoResize is false | `autoResize` disables manual resize |
| Classes don't merge | Your class composes with the slot's defaults; only a utility in the same group replaces a default | Pass the utility that conflicts (a plain one overrides every state too), or use `unstyled` to start from nothing |
| Dark mode wrong | Overrode without dark variants | Add `dark:` classes |

---

## Demo Reference

**File:** `src/pages/demo/TextAreaDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal | `title="Basic Usage"` | Label + placeholder + count |
| Auto resize | `title="Auto Resize"` | Grows with content |
| Rows | `title="Row Sizes"` | Different initial heights |
| Validation | `title="Validation States"` | Error + success |
| Icons | `title="Icons"` | Start/end icons |
| Custom themes | `title="Custom Themes"` | Full class override |

| File | Contains |
|------|----------|
| `TextArea.tsx` | Main component with forwardRef, TextAreaLabel export |
| `utils/types.ts` | TextAreaProps, TextAreaClasses, TextAreaSize |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes |
| `index.ts` | Public exports |
