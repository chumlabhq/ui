# Modal

> Accessible dialog overlay with focus trapping, scroll lock, nested modals, animations, and full keyboard navigation.

**Category:** Overlay
**Keywords:** modal, dialog, popup, overlay, lightbox, confirmation, alert dialog, focus trap, scroll lock, nested modal

---

## Quick Answer

Use `<Modal open={open} onOpenChange={setOpen} title="Title">content</Modal>` for a dialog overlay. Built-in overlay with blur, focus trapping, Escape to close, scroll lock, and dark mode. Supports nested modals, custom sizing, fullscreen mode, and the `useModal()` hook for child access. Works out-of-the-box with built-in Tailwind styles.

---

## Import

```tsx
import { Modal, useModal } from "@chumlab/ui/modal";
import type { ModalProps, ModalClasses } from "@chumlab/ui/modal";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { useState } from "react";
import { Modal } from "@chumlab/ui/modal";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal open={open} onOpenChange={setOpen} title="Welcome Back">
        <p>Your session has been restored.</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button onClick={() => setOpen(false)}>Continue</button>
        </div>
      </Modal>
    </>
  );
}
```

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `open` + `onOpenChange` | Controlled mode — both needed together. |
| `defaultOpen` | Uncontrolled mode — do not combine with `open`. |
| `nestingLevel` | For stacked modals. Auto-managed via context; set manually only for external nesting. |
| `maxNestingLevel` | Prevents infinite nesting. Default: `5`. Exceeding logs a warning in dev. |
| `trapFocus` | Default `true`. Set `false` only for non-modal dialogs. |
| `fullScreen` | Overrides maxWidth/maxHeight. Sets `w-full h-full` on content. |
| `preventOutsideClick` + `closeOnEscape={false}` | Combine for mandatory action modals. Must provide explicit close buttons. |
| `showHeader={false}` | Hides title, description, and close button. Must provide your own close mechanism. |
| `keepMounted` | Content stays in DOM when closed. Useful for preserving form state. |
| `initialFocus` | Requires a `RefObject<HTMLElement>`. Focus is set after a 10ms delay. |
| `unstyled` | Strips all default classes. Must provide full styling via `classes`. |

---

## Data Attributes (for CSS selectors and testing)

**Root (`data-modal-root`):**
- `data-open` — `true` when modal is visible
- `data-nesting-level` — current nesting depth (0-based)
- `data-reduce-motion` — `true` when reduced motion is active

**Other elements:**
- `data-modal-overlay` — backdrop element
- `data-modal-container` — scroll/centering wrapper
- `data-modal-content` — the `role="dialog"` panel
- `data-modal-header` — header section
- `data-modal-body` — body content area
- `data-modal-footer` — footer (when using `ModalFooter` sub-component)

DOM nesting: `root > overlay + container > content(role="dialog") > header(icon + title + description + closeButton) + body`

---

## All Props

<!-- generated from Modal.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | — | Whether the modal is visible (controlled). |
| `onOpenChange` | object | — | (open: boolean) => void - Callback when the modal's open state changes. |
| `defaultOpen` | boolean | `false` | Whether the modal is initially open (uncontrolled). |
| `children` **(required)** | object | — | React.ReactNode - Modal body content. Use ModalHeader, ModalBody, ModalFooter for structure. |
| `title` | object | — | React.ReactNode - Title rendered in the modal header. |
| `description` | object | — | React.ReactNode - Description rendered below the title in the header. |
| `icon` | object | — | React.ReactNode - Icon rendered in the modal header. |
| `showIcon` | boolean | `false` | Whether to display the icon in the header. |
| `showCloseButton` | boolean | `true` | Whether to display the close button. |
| `closeIcon` | object | — | React.ReactNode - Custom close button icon. |
| `showHeader` | boolean | `true` | Whether to render the built-in header section. |
| `showOverlay` | boolean | `true` | Whether to render the backdrop overlay. |
| `preventOutsideClick` | boolean | `false` | Prevents closing when clicking outside the modal content. |
| `closeOnEscape` | boolean | `true` | Enables closing via the Escape key. |
| `lockScroll` | boolean | `true` | Locks body scroll when the modal is open. |
| `trapFocus` | boolean | `true` | Traps keyboard focus within the modal. |
| `restoreFocus` | boolean | `true` | Restores focus to the previously focused element on close. |
| `initialFocus` | object | — | RefObject<HTMLElement \| null> - Element to focus when the modal opens. |
| `keepMounted` | boolean | `false` | Keeps the modal DOM mounted when closed. |
| `maxWidth` | string \| number | — | Maximum width of the modal dialog. |
| `maxHeight` | string \| number | — | Maximum height of the modal dialog. |
| `minWidth` | string \| number | — | Minimum width of the modal dialog. |
| `minHeight` | string \| number | — | Minimum height of the modal dialog. |
| `fullScreen` | boolean | `false` | Expands the modal to fill the viewport. |
| `centered` | boolean | `true` | Vertically centers the modal in the viewport. |
| `overlayColor` | string | `"black"` | Custom overlay background color. |
| `overlayOpacity` | number | `0.32` | Overlay background opacity (0-1). |
| `animationDuration` | number | `200` | Open/close animation duration in milliseconds. |
| `disableAnimation` | boolean | `false` | Disables open/close animations entirely. |
| `reduceMotion` | boolean \| string | `"auto"` | Controls motion preferences. 'auto' respects the user's OS setting. |
| `nestingLevel` | number | — | Current nesting depth for stacked modals. Managed automatically. |
| `maxNestingLevel` | number | `5` | Maximum allowed nesting depth for stacked modals. |
| `zIndex` | number | — | CSS z-index for the modal layer. |
| `classes` | object | — | CSS class overrides for modal sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling, rendering a plain dialog. |
| `className` | string | `""` | Additional CSS class for the dialog content panel. |
| `contentStyle` | object | — | Inline styles for the dialog content panel. |
| `aria-label` | string | — | Accessible label for the modal dialog. |
| `aria-labelledby` | string | — | ID of the element that labels the modal dialog. |
| `aria-describedby` | string | — | ID of the element that describes the modal dialog. |

## Ref API

```tsx
import { useRef } from "react";
import { Modal } from "@chumlab/ui/modal";

const modalRef = useRef<HTMLDivElement>(null);

// Focus the modal content programmatically
modalRef.current?.focus();

<Modal ref={modalRef} open={open} onOpenChange={setOpen} title="Title">
  ...
</Modal>
```

---

## Styling Guide

### How class merging works

1. **Default** (no `classes`, no `unstyled`) — uses `DEFAULT_MODAL_CLASSES`
2. **Partial override** (`classes` without `unstyled`) — **replaces** per slot, not additive
3. **Unstyled** (`unstyled={true}`) — all slots empty, you provide everything via `classes`

### Slot → visual mapping

```
root (fixed inset-0, z-50, flex center)
├── overlay (fixed inset-0, bg-black/60, backdrop-blur)
└── container (fixed inset-0, overflow-y-auto, flex center, p-4)
    └── content (role="dialog", w-full max-w-lg, rounded-xl, shadow, bg-white dark:bg-gray-800)
        ├── header (flex items-start gap-3, p-6 pb-4)
        │   ├── icon (shrink-0)
        │   ├── div (flex-1)
        │   │   ├── title (font-semibold text-lg)
        │   │   └── description (text-sm text-gray-600)
        │   └── closeButton (shrink-0, aria-label="Close modal")
        │       └── closeIcon (w-5 h-5)
        └── body (px-6 pb-6)
```

| "I want to change..." | Slot to use | Notes |
|------------------------|-------------|-------|
| Root fixed wrapper | `root` | Positioning layer |
| Backdrop color/blur | `overlay` | Also see `overlayColor`/`overlayOpacity` props |
| Scroll/centering wrapper | `container` | Controls modal placement |
| Dialog panel | `content` | The visible card |
| Header layout | `header` | Contains icon, title, close button |
| Title text | `title` | |
| Subtitle text | `description` | |
| Header icon | `icon` | Requires `showIcon` |
| Close button | `closeButton` | |
| Close icon SVG | `closeIcon` | Or use `closeIcon` prop for custom element |
| Body area | `body` | Where `children` render |

### Dark mode

Defaults use Tailwind `dark:` prefix, activated by `<html class="dark">`. Content: `bg-white dark:bg-gray-800`. Title: `text-gray-900 dark:text-white`. When overriding slots, always provide both variants.

### Styling via data attributes

```css
/* Target open state */
[data-modal-root][data-open] { /* ... */ }

/* Target nesting level */
[data-nesting-level="1"] [data-modal-content] { transform: scale(0.95); }
```

### Complete themed example

```tsx
<Modal
  unstyled
  open={open}
  onOpenChange={setOpen}
  title="Custom Modal"
  classes={{
    root: "fixed inset-0 z-50 flex items-center justify-center",
    overlay: "fixed inset-0 bg-black/40 backdrop-blur-sm",
    container: "relative z-10 flex items-center justify-center p-4",
    content: "w-full max-w-md rounded-2xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
    header: "flex items-start gap-3 p-5 pb-3",
    title: "font-bold text-lg text-gray-900 dark:text-white",
    description: "mt-1 text-sm text-gray-500 dark:text-gray-400",
    closeButton: "shrink-0 p-1.5 rounded-lg ml-auto hover:bg-gray-100 dark:hover:bg-gray-800",
    closeIcon: "w-5 h-5 text-gray-500 dark:text-gray-400",
    body: "px-5 pb-5",
  }}
>
  <p>Fully custom styled modal.</p>
</Modal>
```

---

## Patterns

### Confirmation dialog

```tsx
<Modal
  open={open}
  onOpenChange={setOpen}
  title="Delete project?"
  preventOutsideClick
  closeOnEscape={false}
  showCloseButton={false}
>
  <p>This action cannot be undone.</p>
  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
    <button onClick={() => setOpen(false)}>Cancel</button>
    <button onClick={handleDelete}>Delete</button>
  </div>
</Modal>
```

### Nested modals

```tsx
<Modal open={level1Open} onOpenChange={setLevel1Open} title="Settings">
  <button onClick={() => setLevel2Open(true)}>Manage Team</button>
  <Modal open={level2Open} onOpenChange={setLevel2Open} title="Team" nestingLevel={1}>
    <p>Nested modal content</p>
  </Modal>
</Modal>
```

### useModal hook in child components

```tsx
function ModalChild() {
  const { close, nestingLevel } = useModal();
  return <button onClick={close}>Close from child</button>;
}
```

### Full-screen document viewer

```tsx
<Modal open={open} onOpenChange={setOpen} showHeader={false} fullScreen centered={false}>
  <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <header>Document title</header>
    <main style={{ flex: 1, overflow: "auto" }}>Content</main>
  </div>
</Modal>
```

### Form modal with initial focus

```tsx
const emailRef = useRef<HTMLInputElement>(null);
<Modal open={open} onOpenChange={setOpen} title="Sign Up" initialFocus={emailRef}>
  <input ref={emailRef} type="email" placeholder="Email" />
</Modal>
```

---

## Accessibility

- `role="dialog"` with `aria-modal="true"` on content
- `aria-labelledby` auto-linked to title when present
- `aria-describedby` auto-linked to description when present
- Supports custom `aria-label`, `aria-labelledby`, `aria-describedby`
- Focus trapped inside modal (Tab/Shift+Tab cycle)
- Focus restored to trigger element on close
- `initialFocus` prop to direct focus to specific element
- Escape key closes modal (configurable via `closeOnEscape`)
- Body scroll locked when open
- Close button has `aria-label="Close modal"`
- Nested modals: Escape only closes the topmost (event.stopPropagation)
- Supports `prefers-reduced-motion` via `reduceMotion="auto"`

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Focus escapes modal | `trapFocus={false}` | Set `trapFocus={true}` (default) |
| Can't close on outside click | `preventOutsideClick={true}` | Set to `false` or add explicit close buttons |
| Nested modal renders behind parent | Missing `nestingLevel` | Increment `nestingLevel` for each nested modal |
| No animation | `disableAnimation={true}` or `reduceMotion={true}` | Set to `false` or use `reduceMotion="auto"` |
| Styles look wrong after overriding one class | `classes` replaces per slot, not merges | Provide full class string for each slot you override |
| Modal content overflows viewport | `minWidth` too large for mobile | Avoid fixed `minWidth` or use responsive values |
| Body still scrolls when open | `lockScroll={false}` | Set `lockScroll={true}` (default) |
| Focus doesn't go to expected element | `initialFocus` ref not attached | Ensure ref is attached to a focusable element in the modal |

---

## Demo Reference

**File:** `src/pages/demo/ModalDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | Default-styled modal |
| Use cases | `title="Use Cases"` | Confirm, success, form, upgrade, image |
| Size & position | `title="Size & Position"` | Custom size, full screen |
| Overlay & behavior | `title="Overlay & Behavior"` | Custom overlay, prevent close |
| Nested modals | `title="Nested Modals"` | Two-level nesting |
| Classes system | `title="Classes System"` | Per-slot class overrides |
| Reduce motion | `title="Reduce Motion"` | true vs "auto" |
| Focus trap | `title="Focus Trap"` | Enabled vs disabled |
| Initial focus | `title="Initial Focus"` | Focus specific input |
| Keep mounted | `title="Keep Mounted"` | DOM persistence |
| Custom close icon | `title="Custom Close Icon"` | Custom SVG |
| Disable animation | `title="Disable Animation"` | Instant show/hide |
| Custom z-index | `title="Custom Z-Index"` | z-index override |
| useModal hook | `title="useModal Hook"` | Hook in child component |
| Ref forwarding | `title="Ref Forwarding"` | Imperative ref access |

### Source file index

| File | Contains |
|------|----------|
| `Modal.tsx` | Main component, ModalHeader, ModalBody, ModalFooter |
| `useModal.ts` | Convenience hook for open/close state + context access |
| `ModalContext.ts` | React context for nested modal communication |
| `icons.tsx` | Default CloseIcon SVG |
| `utils/types.ts` | ModalProps, ModalClasses, sub-component props, context type |
| `utils/constants.ts` | DEFAULT_MODAL_CLASSES, UNSTYLED_MODAL_CLASSES |
| `index.ts` | Public exports |
| `__tests__/` | Unit tests |
