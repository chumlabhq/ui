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

## All Props (shared across variants)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `24` (Circular), `4` (Linear height), varies | Size in pixels |
| `speed` | `number` | `1` | Animation speed multiplier |
| `className` | `string` | — | Additional CSS classes |
| `classes` | `*LoaderClasses` | — | Per-slot class overrides |
| `unstyled` | `boolean` | `false` | Remove default styles |

---

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
| Sizes | `title="Sizes"` |
| Colors | `title="Colors"` |
| Speed | `title="Speed"` |

| File | Contains |
|------|----------|
| `CircularLoader.tsx` | Spinning circle SVG |
| `LinearLoader.tsx` | Horizontal progress bar |
| `DotLoader.tsx` | Bouncing dots |
| `PulseLoader.tsx` | Pulsing ring |
| `utils/constants.ts` | Default classes for all 4 |
