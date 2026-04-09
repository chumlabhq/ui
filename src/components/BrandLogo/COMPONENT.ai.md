# BrandLogo

> Chumlab brand identity components — logo mark (image), wordmark (styled text), and full logo (mark + wordmark combined).

**Category:** Branding / Presentational
**Keywords:** logo, brand, chumlab, logomark, wordmark, identity, branding

---

## Quick Answer

Use `<LogoMark />` for the icon only, `<LogoWordmark />` for the text only, or `<LogoFull />` for both together. All render inline and need no configuration.

---

## Import

```tsx
import { LogoMark, LogoWordmark, LogoFull } from "@chumlab/ui/brand-logo";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { LogoMark, LogoWordmark, LogoFull } from "@chumlab/ui/brand-logo";

export default function Header() {
  return (
    <header className="flex items-center gap-4">
      {/* Icon only */}
      <LogoMark />

      {/* Text only */}
      <LogoWordmark />

      {/* Icon + text combined */}
      <LogoFull />
    </header>
  );
}
```

This renders correctly with no additional props, classes, or setup.

---

## All Props

### LogoMark

Renders the Chumlab logo image (`logo-light.png`) as an `<img>` element.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `32` | Width and height in pixels. |
| `className` | `string` | `""` | Additional CSS classes on the `<img>` element. |

### LogoWordmark

Renders the brand name as styled text using Space Grotesk font. "chum" is bold; "lab" is normal weight at 50% opacity.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes on the outer `<span>`. |

### LogoFull

Combines `LogoMark` and `LogoWordmark` in a horizontal inline-flex layout.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `28` | Size passed to the inner `LogoMark`. |
| `className` | `string` | `""` | Additional CSS classes on the outer `<span>` wrapper. |
| `textClassName` | `string` | `""` | Additional CSS classes passed to the inner `LogoWordmark`. |

---

## Styling Guide

### DOM structure

```
LogoMark:     <img>
LogoWordmark: <span> → <span>chum</span> <span>lab</span>
LogoFull:     <span> → <LogoMark /> <LogoWordmark />
```

### Customization

All components accept `className` for adding Tailwind or custom classes. Classes are appended (not replaced) to the built-in classes.

```tsx
{/* Larger mark with rounded corners */}
<LogoMark size={48} className="rounded-lg" />

{/* Wordmark with custom text color */}
<LogoWordmark className="text-white text-2xl" />

{/* Full logo with custom gap and text styling */}
<LogoFull size={36} className="gap-4" textClassName="text-xl text-gray-800" />
```

### Font dependency

`LogoWordmark` (and by extension `LogoFull`) requires the **Space Grotesk** font family. Ensure it is loaded in your application, or the browser will fall back to `sans-serif`.

### Image asset

`LogoMark` imports `logo-light.png` from `src/assets/images/`. The image renders with `object-fit: contain` as an inline style.

---

## Accessibility

- `LogoMark` renders an `<img>` with `alt="Chumlab"` for screen readers.
- `LogoWordmark` renders visible text, so it is naturally accessible.
- These are presentational components. If used as a link, wrap them in an `<a>` or router `<Link>` with appropriate labeling.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Wordmark text looks wrong | Space Grotesk font not loaded | Add the font to your app's stylesheet or `<head>` |
| Logo image not displaying | Asset import path broken | Verify `src/assets/images/logo-light.png` exists |
| Logo too large/small | Default `size` not suitable | Pass a custom `size` prop to `LogoMark` or `LogoFull` |

---

## Source Files

| File | Contains |
|------|----------|
| `Logo.tsx` | All three components: `LogoMark`, `LogoWordmark`, `LogoFull` |
| `index.ts` | Public exports |
