# Modal

> Accessible dialog overlay with focus trapping, scroll lock, nested modals, animations, and full keyboard navigation.

**Category:** Overlay
**Keywords:** modal, dialog, popup, overlay, lightbox, confirmation, alert dialog

---

## Quick Answer

Use `<Modal open={open} onOpenChange={setOpen} title="Title">content</Modal>`. Built-in overlay with blur, focus trapping, Escape to close, scroll lock, and dark mode. Use `useModal()` hook for convenient open/close state management.

---

## Import

```tsx
import { Modal, useModal } from "@chumlab/ui/modal";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Modal, useModal } from "@chumlab/ui/modal";

export default function Example() {
  const { open, onOpen, onClose, onOpenChange } = useModal();
  return (
    <>
      <button onClick={onOpen}>Open Modal</button>
      <Modal open={open} onOpenChange={onOpenChange} title="Welcome">
        <p>Modal content goes here.</p>
        <button onClick={onClose}>Close</button>
      </Modal>
    </>
  );
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `open` + `onOpenChange` | Controlled mode. Must provide both. |
| `nestingLevel` | For stacked modals. Each nested modal needs incrementing level. |
| `maxNestingLevel` | Prevents infinite nesting. Default 3. |
| `trapFocus` | Default `true`. Set `false` only for non-modal dialogs. |
| `fullScreen` | Overrides maxWidth/maxHeight. |

---

## Data Attributes

- `data-state="open"` / `data-state="closed"` on root
- `data-animating` during open/close animation
- `data-nesting-level` on root

DOM: `root > overlay + container > content(role="dialog") > header(title + description + closeButton) + body`

---

## All Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open) => void` | — | State change callback |
| `title` | `ReactNode` | — | Modal title in header |
| `description` | `ReactNode` | — | Subtitle below title |
| `icon` | `ReactNode` | — | Icon in header |
| `showCloseButton` | `boolean` | `true` | Show X close button |
| `showHeader` | `boolean` | `true` | Show header section |
| `showOverlay` | `boolean` | `true` | Show backdrop overlay |
| `preventOutsideClick` | `boolean` | `false` | Prevent closing on overlay click |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `lockScroll` | `boolean` | `true` | Lock body scroll when open |
| `trapFocus` | `boolean` | `true` | Trap focus inside modal |
| `restoreFocus` | `boolean` | `true` | Restore focus on close |
| `maxWidth` | `string` | — | CSS max-width for content |
| `fullScreen` | `boolean` | `false` | Fill viewport |
| `centered` | `boolean` | `true` | Center vertically |
| `animationDuration` | `number` | `200` | Animation ms |
| `disableAnimation` | `boolean` | `false` | Skip animation |
| `reduceMotion` | `boolean \| "auto"` | `"auto"` | Motion preference |
| `classes` | `ModalClasses` | — | Per-slot class overrides |
| `unstyled` | `boolean` | `false` | Strip all defaults |
| `keepMounted` | `boolean` | `false` | Keep in DOM when closed |
| `nestingLevel` | `number` | `0` | For stacked modals |

---

## Styling Guide

### Slot → visual mapping

```
root (fixed inset-0, flex center)
├── overlay (fixed inset-0, bg-black/60, backdrop-blur)
└── container (relative z-10, flex center, p-4)
    └── content (role="dialog", max-w-lg, rounded-xl, shadow, bg-white/dark)
        ├── header (flex, p-6)
        │   ├── icon
        │   ├── title + description
        │   └── closeButton > closeIcon
        └── body (px-6 pb-6)
```

### Dark mode

Defaults include `dark:` variants. Content uses `bg-white dark:bg-gray-800`, title uses `text-gray-900 dark:text-white`.

---

## Accessibility

- `role="dialog"` with `aria-modal="true"`
- `aria-labelledby` auto-linked to title
- Focus trapped inside modal when open
- Focus restored to trigger on close
- Escape key closes modal
- Body scroll locked when open
- Supports `prefers-reduced-motion`

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Focus escapes modal | `trapFocus={false}` | Set `trapFocus={true}` (default) |
| Can't close on outside click | `preventOutsideClick={true}` | Set to `false` |
| Nested modal behind parent | Missing `nestingLevel` | Increment `nestingLevel` for each nested modal |
| No animation | `disableAnimation={true}` | Set to `false` or use `reduceMotion="auto"` |

---

## Demo Reference

**File:** `src/pages/demo/ModalDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Use cases | `title="Use Cases"` |
| Sizes | `title="Size & Position"` |
| Nested | `title="Nested Modals"` |
| Unstyled | `title="Unstyled Mode"` |
| Focus | `title="Focus Trap"` |
| useModal hook | `title="useModal Hook"` |

| File | Contains |
|------|----------|
| `Modal.tsx` | Main component + ModalHeader/Body/Footer exports |
| `useModal.ts` | Convenience hook for open/close state |
| `utils/types.ts` | ModalProps, ModalClasses |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes |
