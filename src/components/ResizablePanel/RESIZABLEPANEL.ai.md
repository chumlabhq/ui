# ResizablePanel

> A draggable resizable panel with constraints, keyboard resizing, Escape to cancel, and WAI-ARIA separator semantics.

**Category:** Layout
**Keywords:** resizable, panel, resize, drag, split, separator, divider, layout

---

## Quick Answer

Use `<ResizablePanel defaultValue={300} minValue={150} maxValue={500}>content</ResizablePanel>`. Drag the edge to resize. Supports controlled/uncontrolled, all 4 directions, keyboard arrow keys, Escape to cancel.

---

## Import

```tsx
import { ResizablePanel } from "@chumlab/ui/resizable-panel";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { ResizablePanel } from "@chumlab/ui/resizable-panel";

export default function Example() {
  return (
    <ResizablePanel defaultValue={300} minValue={150} maxValue={500}>
      <div style={{ padding: 16 }}>Drag the edge to resize.</div>
    </ResizablePanel>
  );
}
```

---

## Data Attributes (for CSS selectors and testing)

**Root (the panel):**
- `data-resizing` — while a pointer drag is resizing it
- `data-disabled` — when `disabled`
- `data-reduce-motion` — while reduced motion is in force

**Handle (`role="separator"`):**
- `data-resizing` — while a pointer drag is resizing the panel; the handle shows an accent bar for the length of the drag, the only time it paints anything by default
- `data-disabled` — when `disabled`; the handle is hidden and leaves the tab order
- `data-direction="start" | "end" | "top" | "bottom"` — the edge it sits on, from `resizeDirection`

---

## All Props

<!-- generated from ResizablePanel.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | — | Controlled size value of the panel in pixels. |
| `defaultValue` | number | `300` | Default uncontrolled size value of the panel in pixels. |
| `onValueChange` | object | — | (value: number) => void — Callback fired when the panel size changes. |
| `onResizeStart` | object | — | (value: number) => void — Callback fired when a resize drag begins. |
| `onResizeEnd` | object | — | (value: number) => void — Callback fired when a resize drag ends. |
| `minValue` | number | `200` | Minimum allowed size value in pixels. |
| `maxValue` | number | `800` | Maximum allowed size value in pixels. |
| `resizeDirection` | `"start"` \| `"end"` \| `"top"` \| `"bottom"` | `"end"` | The panel edge the resize handle sits on. Not `orientation`. |
| `step` | number | `10` | Step increment for resize value changes. |
| `disabled` | boolean | `false` | Whether the resize handle is disabled. |
| `reduceMotion` | boolean \| `"auto"` | `"auto"` | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `handleContent` | object | — | React.ReactNode — Custom content rendered inside the resize handle. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |

## Keyboard Interactions

The handle is `role="separator"` and focusable, so resizing never requires a drag (SC 2.5.7).

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves focus to the handle. |
| `ArrowLeft`, `ArrowRight` | Resizes in steps. A vertical panel uses `ArrowUp`/`ArrowDown`. |
| `Home`, `End` | Jumps to the minimum or maximum size. |
| `Escape` | Abandons the resize and restores the size it started at. |

---

## Ref API

The ref lands on the handle, the `role="separator"` element a keyboard user tabs to and resizes with the arrow keys, so `ref.current.focus()` focuses it. `className`, `style` and the other HTML attributes still go on the panel itself.

```tsx
const ref = useRef<HTMLDivElement>(null);
<ResizablePanel ref={ref} aria-label="Resize sidebar">…</ResizablePanel>
// ref.current is the separator
```

## Accessibility

- `role="separator"` on the drag handle
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for current size
- `aria-orientation` for resize direction
- Keyboard: Arrow keys to resize in steps, Home/End for min/max, Escape to cancel
- `tabIndex={0}` on handle (removed when disabled)
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.
---

## Demo Reference

**File:** `src/pages/demo/ResizablePanelDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Controlled | `title="Controlled State"` |
| Callbacks | `title="Resize Callbacks"` |

| File | Contains |
|------|----------|
| `ResizablePanel.tsx` | Main component with drag/keyboard logic |
| `utils/types.ts` | ResizablePanelProps, ResizablePanelClasses |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes |
