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
| `resizeDirection` | `"left"` \| `"right"` \| `"top"` \| `"bottom"` | `"right"` | Direction from which the panel can be resized. |
| `step` | number | `10` | Step increment for resize value changes. |
| `disabled` | boolean | `false` | Whether the resize handle is disabled. |
| `reduceMotion` | boolean \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `handleContent` | object | — | React.ReactNode — Custom content rendered inside the resize handle. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |

## Accessibility

- `role="separator"` on the drag handle
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for current size
- `aria-orientation` for resize direction
- Keyboard: Arrow keys to resize in steps, Home/End for min/max, Escape to cancel
- `tabIndex={0}` on handle (removed when disabled)

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
