# Tooltip

> Accessible tooltip with configurable positioning, delays, rich content, arrows, shadows, truncation, and full dark mode support.

**Category:** Overlay
**Keywords:** tooltip, popover, hover, hint, help text, info bubble, title

---

## Quick Answer

Use `<Tooltip content="Help text"><button>Hover</button></Tooltip>`. Supports `side` (top/right/bottom/left), `align`, delays, arrows, rich HTML content, controlled open state, and auto-truncation with tooltip on overflow.

---

## Import

```tsx
import { Tooltip } from "@chumlab/ui/tooltip";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Tooltip } from "@chumlab/ui/tooltip";

export default function Example() {
  return (
    <Tooltip content="Save your changes">
      <button>Hover me</button>
    </Tooltip>
  );
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `side` | `"top"` (default), `"right"`, `"bottom"`, `"left"` |
| `align` | `"center"` (default), `"start"`, `"end"` |
| `content` | ReactNode — string or JSX for rich tooltips |
| `truncate` | When true, trigger text truncates and tooltip shows full text on hover |
| `open` + `onOpenChange` | Controlled mode |
| `shadow` | Preset (`"none"` to `"2xl"`) or custom CSS shadow string |
| `asChild` | Merges trigger props onto the child element instead of wrapping |

---

## All Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | — | Tooltip content |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Placement side |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment on side |
| `sideOffset` | `number` | `8` | Distance from trigger |
| `alignOffset` | `number` | `0` | Alignment offset |
| `maxWidth` | `string \| number` | — | Max tooltip width |
| `wordWrap` | `"normal" \| "break-word" \| "nowrap"` | `"normal"` | Text wrapping |
| `delayDuration` | `number` | `200` | Show delay (ms) |
| `hideDelayDuration` | `number` | `0` | Hide delay (ms) |
| `showArrow` | `boolean` | `true` | Show pointing arrow |
| `arrowSize` | `number` | `8` | Arrow size in px |
| `arrowColor` | `string` | — | Arrow fill color |
| `disabled` | `boolean` | `false` | Disable tooltip |
| `truncate` | `boolean` | `false` | Auto-truncate trigger text |
| `shadow` | `TooltipShadow` | `"md"` | Shadow preset or custom |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open) => void` | — | Open state callback |
| `asChild` | `boolean` | `false` | Merge props onto child |
| `portal` | `boolean` | `true` | Render in portal |
| `classes` | `TooltipClasses` | — | Per-slot overrides |
| `unstyled` | `boolean` | `false` | Strip all defaults |
| `zIndex` | `number` | — | Custom z-index |

---

## Styling Guide

### Slots

```
trigger (span wrapper, or merged via asChild)
└── portal
    └── content (role="tooltip", positioned)
        ├── children (tooltip text/JSX)
        └── arrow (CSS triangle)
```

| Slot | What it styles |
|------|---------------|
| `trigger` | Wrapper around the child element |
| `content` | Tooltip popup (bg, border, padding, text) |
| `arrow` | Arrow triangle fill |
| `baseArrow` | Arrow border/outline |

### Dark mode

Defaults include `dark:` variants. Content uses `bg-white dark:bg-gray-800`, `text-gray-900 dark:text-white`, `border-gray-200 dark:border-gray-700`.

---

## Accessibility

- `role="tooltip"` on the content element
- `aria-describedby` links trigger to tooltip via generated ID
- Arrow is `aria-hidden="true"`
- Keyboard: tooltip shows on focus, hides on blur/Escape
- Respects `prefers-reduced-motion`

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Tooltip clipped | Parent has `overflow: hidden` | Set `portal={true}` (default) |
| Tooltip flickers | Delay too short | Increase `delayDuration` |
| Arrow wrong color | Custom bg without arrow match | Set `arrowColor` to match `content` bg |
| Tooltip on non-interactive element | Wraps a `div` | Use `asChild` or ensure child is focusable |

---

## Demo Reference

**File:** `src/pages/demo/TooltipDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Positions | `title="Positions"` |
| Alignment | `title="Alignment"` |
| Arrow | `title="Arrow"` |
| Delays | `title="Delay Duration"` |
| Rich content | `title="Rich HTML Content"` |
| Truncation | `title="Truncation"` |
| Custom styling | `title="Custom Styling"` |
| Shadows | `title="Shadow Presets"` |

| File | Contains |
|------|----------|
| `Tooltip.tsx` | Main component with positioning, portal, animation |
| `utils/types.ts` | TooltipProps, TooltipClasses |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes, shadow presets |
