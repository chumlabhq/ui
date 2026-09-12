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
import { CountryFlag, CountryFlagGroup } from "@chumlab/ui/country-flag";

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <CountryFlag code="us" size="lg" />
      <CountryFlagGroup max={3} size="lg">
        <CountryFlag code="gb" />
        <CountryFlag code="jp" />
        <CountryFlag code="de" />
        <CountryFlag code="fr" />
      </CountryFlagGroup>
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
| `aspectRatio` | number | `0.75` | Aspect ratio for the flag image. |
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

## Sub-component Props

Generated from the types by `scripts/build-subcomponent-schemas.mjs`.

### CountryFlagGroup

| Prop | Type | Description |
| --- | --- | --- |
| `children` | `ReactNode` | Content rendered inside this element. |
| `max` | `number \| undefined` | How many flags to show before the rest are collapsed into a surplus count. |
| `size` | `number \| CountryFlagSize \| undefined` | Flag size for every member of the group. |
| `showCountTooltip` | `boolean \| undefined` | Shows a tooltip on the surplus count listing the hidden countries. |
| `countTooltip` | `Omit<CountryFlagTooltipConfig, "content"> \| undefined` | Tooltip settings for the surplus count. Its content comes from `surplusTooltipContent`. |
| `surplusTooltipContent` | `ReactNode` | Content for the surplus count's tooltip, replacing the generated country list. |
| `renderSurplus` | `((count: number) => ReactNode) \| undefined` | Renders the surplus indicator yourself, given the number of hidden flags. |
| `classes` | `CountryFlagGroupClasses \| undefined` | Class overrides for this component's slots. |

### CountryFlagShimmer

| Prop | Type | Description |
| --- | --- | --- |
| `classes` | `CountryFlagShimmerClasses \| undefined` | Class overrides for this component's slots. |
| `unstyled` | `boolean \| undefined` | Drops the decorative default classes and keeps the structural ones, along with focus, keyboard and ARIA wiring. |
| `size` | `number \| CountryFlagSize \| undefined` | Matches the flag size the placeholder stands in for. |
| `aspectRatio` | `number \| undefined` | Width-to-height ratio of the placeholder, matching the flag it stands in for. |
| `animate` | `boolean \| undefined` | Whether the placeholder pulses. Set false for a still skeleton. |
| `reduceMotion` | `boolean \| "auto" \| undefined` | Whether to stop the shimmer animation. `"auto"` follows the OS reduced-motion setting. |

### CountryFlagGroupShimmer

| Prop | Type | Description |
| --- | --- | --- |
| `count` | `number \| undefined` | How many placeholder flags to draw. |
| `size` | `number \| CountryFlagSize \| undefined` | Matches the flag size the placeholder stands in for. |
| `aspectRatio` | `number \| undefined` | Width-to-height ratio of each placeholder. |
| `animate` | `boolean \| undefined` | Whether the placeholders pulse. Set false for a still skeleton. |
| `reduceMotion` | `boolean \| "auto" \| undefined` | Whether to stop the shimmer animation. `"auto"` follows the OS reduced-motion setting. |
| `showCount` | `boolean \| undefined` | Also draws a placeholder for the surplus count. |

---

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

1. **Default** — uses `DEFAULT_COUNTRYFLAG_CLASSES` (layout + overflow)
2. **Partial override** — REPLACES per slot

**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

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

## Keyboard Interactions

Presentational: it renders an image and takes no keyboard input.

---

## Accessibility

- `role="img"` with `aria-label` on root span
- Alt text defaults to country code, customizable via `alt` prop
- Fallback shown on error with same accessible name
- Supports `prefers-reduced-motion` via `reduceMotion` prop
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.
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
