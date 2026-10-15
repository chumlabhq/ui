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
| `side` | `"left"` (default), `"right"`, `"top"`, `"bottom"` |
| `snapPoints` | Array of percentages (0-1). Requires `swipeable={true}`. |
| `swipeable` | By touch, a `left` or `right` drawer is dragged from anywhere on it. A `top` or `bottom` sheet is dragged from its handle or its `DrawerHeader`, because its content scrolls along the axis it dismisses on. A mouse drags from the handle on every side. |
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
| `side` | `"left"` \| `"right"` \| `"top"` \| `"bottom"` | `"left"` | The edge the drawer slides in from. |
| `size` | string | `"300px"` | CSS size value for the drawer panel (width for left/right, height for top/bottom). |
| `overlayColor` | string | `"black"` | Background color of the overlay. |
| `overlayOpacity` | number | `0.32` | How strongly overlayColor tints the page (0-1), applied as the background's alpha; the overlay element stays opaque so overlayBlur is not diluted. |
| `overlayBlur` | number | `0` | Backdrop blur in pixels for the overlay. |
| `animationDuration` | number | `300` | Open and close animation length, in milliseconds. |
| `lockScroll` | boolean | `true` | Locks body scroll when the drawer is open. |
| `closeOnOverlayClick` | boolean | `true` | Closes the drawer when the overlay is clicked. |
| `closeOnEscape` | boolean | `true` | Enables closing via the Escape key. |
| `classes` | object | — | CSS class overrides for drawer sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `reduceMotion` | boolean \| `"auto"` | `"auto"` | Controls motion preferences. 'auto' respects OS setting. |
| `trapFocus` | boolean | `true` | Traps keyboard focus within the drawer. |
| `restoreFocus` | boolean | `true` | Restores focus to the previously focused element when the drawer closes. |
| `portalContainer` | object | — | HTMLElement \| null — Portal container for the drawer. |
| `initialFocus` | object | — | RefObject<HTMLElement> — Element to receive focus when the drawer opens. |
| `onTransitionEnd` | object | — | (open: boolean) => void — Called when the open/close transition completes. |
| `keepMounted` | boolean | `false` | Keep the drawer DOM mounted when closed. |
| `modal` | boolean | `true` | Whether the drawer behaves as a modal dialog. |
| `swipeable` | boolean | `false` | Enables swipe-to-close gesture. |
| `swipeThreshold` | number | `0.4` | Minimum swipe distance in pixels to trigger close. |
| `snapPoints` | array | — | Array of snap point positions (0-1) for the drawer panel. |
| `snapPointIndex` | number | — | Controlled index into `snapPoints`. Pairs with `defaultSnapPointIndex` and `onSnapPointIndexChange`. |
| `defaultSnapPointIndex` | number | `0` | Initial snap point index for uncontrolled usage. |
| `onSnapPointIndexChange` | object | — | (index: number) => void — Called when the active snap point changes. |

## Keyboard Interactions

| Key | Behaviour |
|-----|-----------|
| `Escape` | Closes the drawer, unless `closeOnEscape={false}`. |
| `Tab` | Cycles focus inside the panel while `trapFocus` is on, and never reaches the page behind it. |

---

## Accessibility

- `role="dialog"` with `aria-modal` when modal
- Default `aria-label="Dialog"` when no label/labelledby provided
- Focus trapped inside drawer when open (configurable)
- Focus restored to trigger on close
- Escape key closes drawer
- Scroll locked when open
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.
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
| `utils/types.ts` | DrawerProps, DrawerClasses, DrawerSide |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes |
