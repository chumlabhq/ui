# Drawer

> A sliding panel overlay with focus trapping, scroll lock, swipe-to-close, snap points, stacked drawer support, and keyboard navigation.

**Category:** Overlay
**Keywords:** drawer, sidebar, panel, slide-out, sheet, bottom sheet, overlay, modal panel

---

## Quick Answer

Use `<Drawer open={open} onOpenChange={setOpen}>` with `DrawerHeader`, `DrawerBody`, `DrawerFooter`, `DrawerCloseButton` as children. Supports all 4 directions, focus trapping, scroll lock, swipe-to-close, and snap points.

---

## Import

```tsx
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerCloseButton } from "@chumlab/ui/drawer";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerCloseButton } from "@chumlab/ui/drawer";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerHeader>
          <h2>Settings</h2>
          <DrawerCloseButton />
        </DrawerHeader>
        <DrawerBody>
          <p>Drawer content goes here.</p>
        </DrawerBody>
        <DrawerFooter>
          <button onClick={() => setOpen(false)}>Close</button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `direction` | `"left"`, `"right"` (default), `"top"`, `"bottom"` |
| `snapPoints` | Array of percentages (0-1). Requires `swipeable={true}`. |
| `trapFocus` | Defaults `true` when `modal={true}`. |
| `keepMounted` | Keeps DOM alive when closed. Uses `inert` to hide. |

---

## Accessibility

- `role="dialog"` with `aria-modal` when modal
- Default `aria-label="Dialog"` when no label/labelledby provided
- Focus trapped inside drawer when open (configurable)
- Focus restored to trigger on close
- Escape key closes drawer
- Scroll locked when open

---

## Demo Reference

**File:** `src/pages/demo/DrawerDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Directions | `title="Directions"` |
| Swipeable | `title="Swipeable Drawer"` |
| Snap points | `title="Snap Points"` |
| Stacked | `title="Stacked Drawers"` |
| Form | `title="Form Drawer"` |

| File | Contains |
|------|----------|
| `Drawer.tsx` | Main component with portal, focus trap, swipe |
| `components/` | DrawerHeader, DrawerBody, DrawerFooter, DrawerCloseButton |
| `utils/types.ts` | DrawerProps, DrawerClasses, DrawerDirection |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes |
