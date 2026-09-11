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
| `unstyled` | boolean | `false` | Removes all default styling. |

### LinearLoader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | number | `4` | Height of the bar in pixels. |
| `width` | string \| number | `"100%"` | Width of the bar (CSS value). |
| `speed` | number | `1.5` | Animation duration in seconds. |
| `trackColor` | string | `"currentColor"` | Background track color. |
| `borderRadius` | number | `9999` | Border radius in pixels. |
| `reduceMotion` | `true` \| `false` \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |

### DotLoader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dotSize` | number | `8` | Diameter of each dot in pixels. |
| `gap` | number | `4` | Gap between dots in pixels. |
| `count` | number | `3` | Number of dots. |
| `speed` | number | `1.4` | Full animation cycle duration in seconds. |
| `reduceMotion` | `true` \| `false` \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |

### PulseLoader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | number | `40` | Diameter of the circle in pixels. |
| `speed` | number | `1.5` | Animation duration in seconds. |
| `rings` | number | `2` | Number of ripple rings. |
| `reduceMotion` | `true` \| `false` \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |

## Sub-component Props

Generated from the types by `scripts/build-subcomponent-schemas.mjs`.

### CircularLoader

| Prop | Type | Description |
| --- | --- | --- |
| `size` | `number \| undefined` | Width and height in pixels. Default: 20 |
| `thickness` | `number \| undefined` | Stroke width of track and arc. Default: 2 |
| `speed` | `number \| undefined` | Animation duration in seconds (lower = faster). Default: 0.75 |
| `trackColor` | `string \| undefined` | Background track color. Default: currentColor at 20% opacity |
| `reduceMotion` | `boolean \| "auto" \| undefined` | Controls motion preferences. `"auto"` respects the user's OS setting. |
| `classes` | `CircularLoaderClasses \| undefined` | CSS class overrides for sub-elements. |
| `unstyled` | `boolean \| undefined` | Removes all default styling. |

### LinearLoader

| Prop | Type | Description |
| --- | --- | --- |
| `height` | `number \| undefined` | Height of the bar in pixels. Default: 4 |
| `width` | `string \| number \| undefined` | Width of the bar (CSS value). Default: "100%" |
| `speed` | `number \| undefined` | Animation duration in seconds. Default: 1.5 |
| `trackColor` | `string \| undefined` | Background track color |
| `borderRadius` | `number \| undefined` | Border radius in pixels. Default: 9999 (pill) |
| `reduceMotion` | `boolean \| "auto" \| undefined` | Controls motion preferences. `"auto"` respects the user's OS setting. |
| `classes` | `LinearLoaderClasses \| undefined` | CSS class overrides for sub-elements. |
| `unstyled` | `boolean \| undefined` | Removes all default styling. |

### DotLoader

| Prop | Type | Description |
| --- | --- | --- |
| `dotSize` | `number \| undefined` | Diameter of each dot in pixels. Default: 8 |
| `gap` | `number \| undefined` | Gap between dots in pixels. Default: 4 |
| `count` | `number \| undefined` | Number of dots. Default: 3 |
| `speed` | `number \| undefined` | Full animation cycle duration in seconds. Default: 1.4 |
| `reduceMotion` | `boolean \| "auto" \| undefined` | Controls motion preferences. `"auto"` respects the user's OS setting. |
| `classes` | `DotLoaderClasses \| undefined` | CSS class overrides for sub-elements. |
| `unstyled` | `boolean \| undefined` | Removes all default styling. |

### PulseLoader

| Prop | Type | Description |
| --- | --- | --- |
| `size` | `number \| undefined` | Diameter of the circle in pixels. Default: 40 |
| `speed` | `number \| undefined` | Animation duration in seconds. Default: 1.5 |
| `rings` | `number \| undefined` | Number of ripple rings. Default: 2 |
| `reduceMotion` | `boolean \| "auto" \| undefined` | Controls motion preferences. `"auto"` respects the user's OS setting. |
| `classes` | `PulseLoaderClasses \| undefined` | CSS class overrides for sub-elements. |
| `unstyled` | `boolean \| undefined` | Removes all default styling. |

---

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

Each variant has its own class slots. Circular: `root`, `control`, `track`, `range`. Linear: `root`, `range`. Dot: `root`, `range`. Pulse: `root`, `range`.

---

## Keyboard Interactions

Presentational: a loader is `role="status"` and takes no keyboard input.

---

## Accessibility

- All variants use `role="status"` + `aria-live="polite"` + `aria-label="Loading"`
- Screen readers announce the loading state
- Animations respect `prefers-reduced-motion`
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.
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
