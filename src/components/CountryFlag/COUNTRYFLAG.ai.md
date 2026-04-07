# CountryFlag

> Renders a country flag image from a two-letter ISO country code. Supports sizes, tooltips, grouping, shimmer loading, and error fallback.

**Category:** Display
**Keywords:** country flag, flag icon, iso code, country, flag image, flag group, locale

---

## Quick Answer

Use `<CountryFlag code="us" />` to render a flag. Pass `size` for preset or pixel size. Use `<CountryFlagGroup max={5}>` to show a row of flags with overflow count. Flags load from `/flags/{code}.svg` by default.

---

## Import

```tsx
import { CountryFlag, CountryFlagGroup, CountryFlagShimmer } from "@chumlab/ui/country-flag";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { CountryFlag } from "@chumlab/ui/country-flag";

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <CountryFlag code="us" size="lg" />
      <CountryFlag code="gb" size="lg" />
      <CountryFlag code="jp" size="lg" />
      <CountryFlag code="de" size="lg" />
    </div>
  );
}
```

---

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `code` | Must be a valid two-letter ISO 3166-1 alpha-2 code (lowercase). Invalid codes show fallback. |
| `size` | Preset string (`"xs"` to `"2xl"`) or pixel number. |
| `basePath` | Directory containing `{code}.svg` files. Defaults to `/flags`. |
| `tooltip` | Pass `ReactNode` for simple tooltip, or `CountryFlagTooltipConfig` object for full control. |

---

## Data Attributes

- `data-country` on root — the ISO country code
- `data-size` on root — preset size name (not set for numeric)
- `data-loaded` on root — when image has loaded
- `data-error` on root — when image failed to load
- `role="img"` on root — with `aria-label` set to alt or code

DOM nesting: `root(span) > img + fallback`

---

## All Props

### CountryFlagProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | **required** | Two-letter ISO country code |
| `size` | `CountryFlagSize \| number` | `"md"` | Flag size |
| `aspectRatio` | `number` | `0.75` | Height/width ratio |
| `alt` | `string` | code | Accessible alt text |
| `fallback` | `ReactNode` | — | Shown on image error |
| `loading` | `boolean` | `false` | Show shimmer instead of flag |
| `tooltip` | `ReactNode \| CountryFlagTooltipConfig` | — | Tooltip on hover |
| `basePath` | `string` | `"/flags"` | Directory for SVG files |
| `classes` | `CountryFlagClasses` | — | Per-slot class overrides |
| `unstyled` | `boolean` | `false` | Remove all default styles |
| `reduceMotion` | `boolean \| "auto"` | `"auto"` | Motion preference |

### CountryFlagGroupProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `max` | `number` | — | Max visible flags before "+N" count |
| `size` | `CountryFlagSize \| number` | — | Size for all children |
| `showCountTooltip` | `boolean` | — | Tooltip on surplus count |
| `renderSurplus` | `(count) => ReactNode` | — | Custom surplus renderer |
| `classes` | `CountryFlagGroupClasses` | — | Per-slot class overrides |

---

## Styling Guide

### How class merging works

1. **Default** — uses `DEFAULT_COUNTRYFLAG_CLASSES` (layout + overflow)
2. **Partial override** — REPLACES per slot
3. **Unstyled** — all slots empty

### Slot → visual mapping

```
root (span, role="img")
├── image (img)
└── fallback (when error)
```

| "I want to change..." | Slot | Notes |
|------------------------|------|-------|
| Flag border/rounding | `root` | Add `rounded-sm border` |
| Image fit | `image` | Default `object-cover` |
| Error fallback | `fallback` | Render custom element via prop |

### Dark mode

CountryFlag is image-based — no dark mode classes needed. Group count uses `bg-gray-100 text-gray-500` which may need dark variants if overriding.

---

## Patterns

### Flag group with overflow

```tsx
<CountryFlagGroup max={3} size="md">
  <CountryFlag code="us" />
  <CountryFlag code="gb" />
  <CountryFlag code="de" />
  <CountryFlag code="fr" />
  <CountryFlag code="jp" />
</CountryFlagGroup>
```

### With tooltip

```tsx
<CountryFlag code="us" tooltip="United States" size="lg" />
```

---

## Accessibility

- `role="img"` with `aria-label` on root span
- Alt text defaults to country code, customizable via `alt` prop
- Fallback shown on error with same accessible name
- Supports `prefers-reduced-motion` via `reduceMotion` prop

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Flag not showing | Wrong code or missing SVG | Verify code is lowercase 2-letter ISO. Check `basePath` points to SVG directory |
| Fallback always shows | Image 404 | Ensure `/flags/{code}.svg` exists |
| Group count wrong | `max` not set | Pass `max` prop to CountryFlagGroup |
| Tooltip not showing | Missing tooltip prop | Pass `tooltip="Country Name"` |
| Classes don't merge | Expected additive | Classes REPLACE per slot |

---

## Demo Reference

**File:** `src/pages/demo/CountryFlagDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal | `title="Basic Usage"` | Multiple flags by code |
| Sizes | `title="Sizes"` | xs through 2xl presets |
| Tooltip | `title="Tooltip"` | Hover tooltip |
| Error | `title="Error Fallback"` | Custom fallback on error |
| Group | `title="Flag Group"` | CountryFlagGroup with max |
| Shimmer | `title="Loading & Shimmer"` | Loading state |

| File | Contains |
|------|----------|
| `CountryFlag.tsx` | Main component with forwardRef |
| `components/CountryFlagGroup.tsx` | Group + GroupCount components |
| `utils/types.ts` | All TypeScript interfaces |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes, SIZE_MAP |
| `index.ts` | Public exports |
