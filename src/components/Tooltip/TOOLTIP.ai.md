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

<!-- generated from Tooltip.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` **(required)** | object | — | React.ReactNode — The trigger element that the tooltip is attached to. |
| `content` | object | — | React.ReactNode — Content displayed inside the tooltip. |
| `side` | `"top"` \| `"right"` \| `"bottom"` \| `"left"` | `"top"` | Preferred side of the trigger to display the tooltip. |
| `align` | `"start"` \| `"center"` \| `"end"` | `"center"` | Alignment of the tooltip along the side. |
| `sideOffset` | number | `6` | Distance in pixels from the trigger along the side axis. |
| `alignOffset` | number | `0` | Offset in pixels along the alignment axis. |
| `maxWidth` | string \| number | `300` | Maximum width of the tooltip content. |
| `wordWrap` | `"normal"` \| `"break-word"` \| `"nowrap"` | `"break-word"` | Word wrap behavior for tooltip content. |
| `delayDuration` | number | `200` | Delay in milliseconds before showing the tooltip. |
| `hideDelayDuration` | number | `100` | Delay in milliseconds before hiding the tooltip. |
| `disableHoverableContent` | boolean | `false` | When true, the tooltip content is not hoverable (closes on mouse leave of trigger). |
| `open` | boolean | — | Controlled open state. |
| `defaultOpen` | boolean | `false` | Default uncontrolled open state. |
| `onOpenChange` | object | — | (open: boolean) => void — Callback when the open state changes. |
| `showArrow` | boolean | `true` | Whether to show the tooltip arrow. |
| `arrowSize` | number | — | Size of the tooltip arrow in pixels. |
| `arrowColor` | string | — | Color of the tooltip arrow. |
| `disabled` | boolean | `false` | Whether the tooltip is disabled. |
| `truncate` | boolean | `false` | Whether to truncate the trigger content with ellipsis. |
| `truncateWidth` | number \| string | — | Width at which to truncate the trigger content. |
| `shadow` | string | `"lg"` | Shadow preset or custom CSS shadow value. Presets: 'none', 'sm', 'md', 'lg', 'xl', '2xl'. |
| `zIndex` | number | `9999` | Z-index for the tooltip. |
| `portal` | boolean | `true` | Whether to render the tooltip in a portal. |
| `portalContainer` | object | — | HTMLElement \| null — Custom container element for the tooltip portal. |
| `asChild` | boolean | `false` | When true, the trigger renders as the child element instead of wrapping it. |
| `triggerDisplay` | string | `"inline-flex"` | CSS display property for the trigger wrapper. |
| `className` | string | — | CSS class for the trigger wrapper element. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |
| `contentStyle` | object | — | Inline styles applied to the tooltip content element. |
| `arrowStyle` | object | — | Inline styles applied to the tooltip arrow element. |
| `baseArrowStyle` | object | — | Inline styles applied to the base arrow element. |

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
| Custom styling | `title="Custom Styling"` |
| Shadows | `title="Shadow Presets"` |

| File | Contains |
|------|----------|
| `Tooltip.tsx` | Main component with positioning, portal, animation |
| `utils/types.ts` | TooltipProps, TooltipClasses |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes, shadow presets |
