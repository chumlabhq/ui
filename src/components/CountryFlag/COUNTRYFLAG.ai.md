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
| `basePath` | Omit to use the flags packaged with the library (no network request). Set it to load `{basePath}/{code}.svg` from a CDN or self-hosted directory instead. |
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

## Flag assets

The SVGs ship inside the package. By default a `CountryFlag` makes **no network
request** — the flag for a given code is lazily imported as its own chunk, so a
bundle only carries the flags it actually renders, and the component works
offline and in air-gapped installs. Nothing needs to be copied into `public/`.

To serve flags yourself instead — a CDN, or a directory you control — pass
`basePath`, which restores URL-based loading of `{basePath}/{code}.svg`:

```tsx
import { CountryFlag, CHUMLAB_FLAG_CDN } from "@chumlab/ui/country-flag";

<CountryFlag code="in" />                        {/* packaged, no network */}
<CountryFlag code="in" basePath="/flags" />      {/* your own directory */}
<CountryFlag code="in" basePath={CHUMLAB_FLAG_CDN} /> {/* Chumlab's CDN */}
```

The flag renders as an `<img>` in every mode, so `classes.image`, `onLoad`,
`onError` and sizing behave identically whichever you pick.

---

## All Props

<!-- generated from CountryFlag.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` **(required)** | string | — | ISO 3166-1 alpha-2 country code (e.g. 'US', 'GB'). |
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"2xl"` \| number | — | Flag size as a preset or numeric pixel value. |
| `aspectRatio` | number | — | Aspect ratio for the flag image. |
| `alt` | string | — | Alt text for the flag image. |
| `fallback` | object | — | React.ReactNode — Custom fallback content when the flag image fails to load. |
| `loading` | boolean | `false` | Shows a loading shimmer placeholder. |
| `tooltip` | object | — | Tooltip shown on hover. Pass a ReactNode or a config object. |
| `basePath` | string | — | Where to load the flag SVG from. Omit to use the flags packaged with the library (no network request). Set it to fetch `${basePath}/${code}.svg` from a CDN or self-hosted directory instead. |
| `classes` | object | — | CSS class overrides for flag sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `reduceMotion` | boolean \| `"auto"` | `"auto"` | Controls motion preferences. 'auto' respects OS setting. |
| `onLoad` | object | — | (event: SyntheticEvent<HTMLImageElement>) => void — Fires when the flag image loads. |
| `onError` | object | — | (event: SyntheticEvent<HTMLImageElement>) => void — Fires when the flag image fails to load. |

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
| Flag not showing | Unrecognised code | Verify code is a lowercase 2-letter ISO 3166-1 alpha-2 code |
| Fallback always shows | `basePath` set but the file is missing | Ensure `{basePath}/{code}.svg` exists, or drop `basePath` to use the packaged flags |
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
