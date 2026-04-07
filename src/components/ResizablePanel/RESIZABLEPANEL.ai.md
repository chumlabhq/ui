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
| Directions | `title="Resize Direction"` |
| Controlled | `title="Controlled"` |
| Callbacks | `title="Callbacks"` |

| File | Contains |
|------|----------|
| `ResizablePanel.tsx` | Main component with drag/keyboard logic |
| `utils/types.ts` | ResizablePanelProps, ResizablePanelClasses |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes |
