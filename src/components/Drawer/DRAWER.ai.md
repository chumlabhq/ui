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

## All Props

<!-- generated from Drawer.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | — | Controlled open state. |
| `defaultOpen` | boolean | `false` | Initial open state for uncontrolled usage. |
| `onOpenChange` | object | — | (open: boolean) => void — Callback when the drawer's open state changes. |
| `zIndex` | number | `9999` | Z-index of the drawer overlay and panel. |
| `children` | object | — | React.ReactNode — Drawer content (DrawerHeader, DrawerBody, DrawerFooter). |
| `direction` | `"left"` \| `"right"` \| `"top"` \| `"bottom"` | — | Direction from which the drawer slides in. |
| `size` | string | — | CSS size value for the drawer panel (width for left/right, height for top/bottom). |
| `overlayColor` | string | — | Background color of the overlay. |
| `overlayOpacity` | number | — | Opacity of the overlay (0-1). |
| `overlayBlur` | number | — | Backdrop blur in pixels for the overlay. |
| `duration` | number | — | Animation duration in milliseconds. |
| `lockScroll` | boolean | `true` | Locks body scroll when the drawer is open. |
| `closeOnOverlayClick` | boolean | `true` | Closes the drawer when the overlay is clicked. |
| `closeOnEscape` | boolean | `true` | Closes the drawer when the Escape key is pressed. |
| `classes` | object | — | CSS class overrides for drawer sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `reduceMotion` | boolean \| `"auto"` | — | Controls motion preferences. 'auto' respects OS setting. |
| `trapFocus` | boolean | `true` | Traps keyboard focus within the drawer. |
| `restoreFocus` | boolean | `true` | Restores focus to the previously focused element when the drawer closes. |
| `portalContainer` | object | — | HTMLElement \| null — Portal container for the drawer. |
| `initialFocus` | object | — | RefObject<HTMLElement> — Element to receive focus when the drawer opens. |
| `onTransitionEnd` | object | — | (open: boolean) => void — Called when the open/close transition completes. |
| `keepMounted` | boolean | `false` | Keep the drawer DOM mounted when closed. |
| `modal` | boolean | `true` | Whether the drawer behaves as a modal dialog. |
| `swipeable` | boolean | `false` | Enables swipe-to-close gesture. |
| `swipeThreshold` | number | — | Minimum swipe distance in pixels to trigger close. |
| `snapPoints` | array | — | Array of snap point positions (0-1) for the drawer panel. |
| `activeSnapPointIndex` | number | — | Controlled active snap point index. |
| `defaultSnapPointIndex` | number | — | Initial snap point index for uncontrolled usage. |
| `onSnapPointIndexChange` | object | — | (index: number) => void — Called when the active snap point changes. |

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
| Form | `title="Form Drawer (Real-World)"` |

| File | Contains |
|------|----------|
| `Drawer.tsx` | Main component with portal, focus trap, swipe |
| `components/` | DrawerHeader, DrawerBody, DrawerFooter, DrawerCloseButton |
| `utils/types.ts` | DrawerProps, DrawerClasses, DrawerDirection |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes |
