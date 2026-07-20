# Loader

> Animated loading indicators. Four variants: CircularLoader, LinearLoader, DotLoader, PulseLoader.

**Category:** Feedback
**Keywords:** loader, spinner, loading, progress, circular, linear, dots, pulse, skeleton

---

## Quick Answer

Use `<CircularLoader />` for a spinning indicator, `<LinearLoader />` for a progress bar, `<DotLoader />` for bouncing dots, `<PulseLoader />` for a pulsing ring. All work out-of-the-box with `role="status"` and `aria-label`.

---

## Import

```tsx
import { CircularLoader, LinearLoader, DotLoader, PulseLoader } from "@chumlab/ui/loader";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { CircularLoader } from "@chumlab/ui/loader";

export default function Example() {
  return <CircularLoader />;
}
```

---

## All Props

<!-- generated from Loader.schema.json — edit the schema, not this table -->

### CircularLoader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | number | `20` | Width and height in pixels. |
| `thickness` | number | `2` | Stroke width of track and arc. |
| `speed` | number | `0.75` | Animation duration in seconds (lower = faster). |
| `trackColor` | string | — | Background track color. Default: currentColor at 20% opacity. |
| `reduceMotion` | `true` \| `false` \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | — | Removes all default styling. |

### LinearLoader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | number | `4` | Height of the bar in pixels. |
| `width` | string \| number | `"100%"` | Width of the bar (CSS value). |
| `speed` | number | `1.5` | Animation duration in seconds. |
| `trackColor` | string | — | Background track color. |
| `borderRadius` | number | `9999` | Border radius in pixels. |
| `reduceMotion` | `true` \| `false` \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | — | Removes all default styling. |

### DotLoader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dotSize` | number | `8` | Diameter of each dot in pixels. |
| `gap` | number | `4` | Gap between dots in pixels. |
| `count` | number | `3` | Number of dots. |
| `speed` | number | `1.4` | Full animation cycle duration in seconds. |
| `reduceMotion` | `true` \| `false` \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | — | Removes all default styling. |

### PulseLoader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | number | `40` | Diameter of the circle in pixels. |
| `speed` | number | `1.5` | Animation duration in seconds. |
| `rings` | number | `2` | Number of ripple rings. |
| `reduceMotion` | `true` \| `false` \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | — | Removes all default styling. |

## Styling Guide

Each variant has its own class slots. Circular: `root`, `svg`, `track`, `indicator`. Linear: `root`, `bar`. Dot: `root`, `dot`. Pulse: `root`, `ring`.

---

## Accessibility

- All variants use `role="status"` + `aria-live="polite"` + `aria-label="Loading"`
- Screen readers announce the loading state
- Animations respect `prefers-reduced-motion`

---

## Demo Reference

**File:** `src/pages/demo/LoaderDemo.tsx`

| Feature | Search for |
|---------|-----------|
| All variants | `title="Basic Usage"` |
| Sizes | `title="Circular — Sizes"` |
| Colors | `title="Circular — Colors"` |
| Speed | `title="Circular — Speed"` |

| File | Contains |
|------|----------|
| `CircularLoader.tsx` | Spinning circle SVG |
| `LinearLoader.tsx` | Horizontal progress bar |
| `DotLoader.tsx` | Bouncing dots |
| `PulseLoader.tsx` | Pulsing ring |
| `utils/constants.ts` | Default classes for all 4 |
