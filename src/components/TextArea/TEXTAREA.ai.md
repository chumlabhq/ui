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
| `size` | Does NOT apply built-in styles — emits `data-size` for CSS targeting |
| `onStartIconClick` | Requires `startIconLabel` for accessibility |
| `onEndIconClick` | Requires `endIconLabel` for accessibility |

---

## Data Attributes

- `data-size` on root — "sm", "md", "lg"
- `data-disabled` on root — when disabled
- `data-error` on root — when error state
- `data-success` on root — when success state
- `data-readonly` on root — when readOnly
- `data-slot="textarea"` on the textarea element
- `data-slot="count"` on the character count

DOM nesting: `root > label + description + wrapper(startIcon + textarea + endIcon + clear + loader) + error/success + count`

---

## All Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Label above the textarea |
| `description` | `ReactNode` | — | Helper text below label |
| `placeholder` | `string` | — | Placeholder text |
| `rows` | `number` | — | Initial visible rows |
| `error` | `boolean` | `false` | Error state |
| `errorMessage` | `ReactNode` | — | Error message text |
| `success` | `boolean` | `false` | Success state |
| `successMessage` | `ReactNode` | — | Success message text |
| `size` | `TextAreaSize` | — | Visual size variant (data attribute only) |
| `startIcon` | `ReactNode` | — | Icon before textarea |
| `endIcon` | `ReactNode` | — | Icon after textarea |
| `onStartIconClick` | `() => void` | — | Makes startIcon a button |
| `onEndIconClick` | `() => void` | — | Makes endIcon a button |
| `startIconLabel` | `string` | — | Aria label for clickable startIcon |
| `endIconLabel` | `string` | — | Aria label for clickable endIcon |
| `onValueChange` | `(value: string) => void` | — | Simple value callback |
| `clearable` | `boolean` | `false` | Show clear button |
| `showCount` | `boolean` | `false` | Show character count |
| `autoResize` | `boolean` | `false` | Auto-grow with content |
| `loading` | `boolean` | `false` | Loading state |
| `fullWidth` | `boolean` | `false` | Full width container |
| `classes` | `TextAreaClasses` | — | Per-slot class overrides |
| `unstyled` | `boolean` | `false` | Remove all default styles |
| `maxLength` | `number` | — | Max characters |
| `required` | `boolean` | — | Required field |
| `disabled` | `boolean` | — | Disabled state |
| `readOnly` | `boolean` | — | Read-only state |

---

## Styling Guide

### How class merging works

1. **Default** — uses `DEFAULT_TEXTAREA_CLASSES` with dark mode, focus ring
2. **Partial override** — REPLACES per slot
3. **Unstyled** — all slots empty

### Slot → visual mapping

```
root (flex flex-col)
├── label
├── description
├── wrapper (border, focus ring)
│   ├── startIcon
│   ├── textarea
│   ├── endIcon
│   ├── clear button
│   └── loader
├── error / success
└── count
```

| "I want to change..." | Slot | Notes |
|------------------------|------|-------|
| Border/focus ring | `wrapper` | Contains textarea chrome |
| Textarea text | `textarea` | Font, color, placeholder, resize |
| Label style | `label` | Font weight, size, color |
| Error text | `error` | Color, icon |

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

## Accessibility

- Native `<textarea>` element
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
| Auto-resize not working | `autoResize` not set | Pass `autoResize` prop |
| Count not showing | Missing `maxLength` | Set both `showCount` and `maxLength` |
| Resize handle visible with autoResize | Expected behavior when autoResize is false | `autoResize` disables manual resize |
| Classes don't merge | Expected additive | Classes REPLACE per slot |
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
