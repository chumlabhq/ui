# Button

> A polymorphic, accessible button that renders as `<button>`, `<a>`, or `<span>`. Provides structural defaults (padding, focus ring, disabled state) — visual theme is applied via `className`. Supports icons with animations, loading states, tooltips, and grouping.

**Category:** Form
**Keywords:** button, action, submit, link, cta, icon, loading, group

---

## Quick Answer

`<Button className="your-styles">Label</Button>` — the component provides structure (padding, rounded corners, focus ring, disabled handling). You pass visual styles (colors, shadows) via `className`. Use `as="a"` for links, `startIcon`/`endIcon` for icons, `loading` for async states. Group buttons with `<ButtonGroup>`.

---

## Import

```tsx
import { Button, ButtonGroup } from "@chumlab/ui/button";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Button } from "@chumlab/ui/button";

export default function Actions() {
  return (
    <div className="flex gap-3">
      <Button
        className="bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 shadow-md"
        onClick={() => console.log("clicked")}
      >
        Save Changes
      </Button>
      <Button
        className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        Cancel
      </Button>
    </div>
  );
}
```

**Why className, not a `variant` prop?** Button is intentionally headless for visual styling. The component owns interaction (focus, disabled, loading, polymorphic rendering) while you own the look. This avoids a closed set of variants and gives full design freedom.

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `as="a"` | Requires `href`. Without it, TypeScript errors. |
| `as="span"` | Needs `aria-label` if no text content — dev warning in console. |
| `asChild` | Mutually exclusive with `as`. Child must be a single valid React element. |
| `loading` | Makes the button disabled automatically. No need to also set `disabled`. |
| `iconAnimation` | Only animates when `as` is not "span" (needs `group` class which is auto-added). |
| `animateOnHover` | `true` = animate on hover only. `false` = continuous animation (always running). |
| `animateIcon` | Controls which icon(s) animate: `"leading"`, `"trailing"`, or `"both"`. |
| `className` vs `classes.root` | Both are applied via `cn()`. `className` comes last (highest CSS priority). `classes.root` replaces the default root. Don't use both for the same concern. |

---

## How `className` merges with defaults

This is the most important thing to understand:

```typescript
// Inside Button.tsx:
const combinedClassName = cn(
  mergedClasses.root,    // DEFAULT_BUTTON_CLASSES.root (structural)
  fullWidth && "w-full",
  animation && "group",
  className,             // YOUR className (visual theme) — applied LAST
);
```

The default `root` provides: `cursor-pointer text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`

Your `className` adds: colors, backgrounds, shadows, borders — the visual theme.

To override structural defaults (e.g., different padding), include the override in your `className`. Tailwind's last-class-wins behavior handles it.

---

## Data Attributes (for CSS selectors and testing)

- `data-loading="true"` — when loading
- `data-disabled="true"` — when disabled or loading
- `data-full-width="true"` — when fullWidth
- `data-size="sm|md|lg"` — size prop value
- `aria-busy="true"` — when loading
- `aria-disabled="true"` — when disabled or loading

**DOM:** `<button>` (or `<a>`/`<span>`) → `<span class="content">` → optional `<span class="startIcon">` + children + optional `<span class="endIcon">`

---

## All Props

### Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `"button" \| "a" \| "span"` | `"button"` | Rendered element type. |
| `asChild` | `boolean` | `false` | Merge props onto child element via Slot. |
| `className` | `string` | — | Visual styling classes (colors, shadows, borders). |
| `size` | `"sm" \| "md" \| "lg"` | — | Emits `data-size` for CSS targeting. No built-in sizing. |
| `disabled` | `boolean` | `false` | Disables interaction. |
| `loading` | `boolean` | `false` | Shows loader, disables button. |
| `loadingText` | `ReactNode` | — | Text shown during loading (replaces children). |
| `loader` | `ReactNode` | — | Custom loader element (default: CircularLoader). |
| `loaderPosition` | `"left" \| "right"` | `"right"` | Loader placement relative to content. |
| `loaderSize` | `number` | `16` | Loader size in px. |
| `fullWidth` | `boolean` | `false` | Stretch to container width. |
| `startIcon` | `ReactNode` | — | Icon before label. |
| `endIcon` | `ReactNode` | — | Icon after label. |
| `iconAnimation` | `IconAnimation` | `"none"` | Animation type for icons. |
| `animateOnHover` | `boolean` | `true` | `true` = hover-only, `false` = continuous. |
| `animateIcon` | `"leading" \| "trailing" \| "both"` | `"trailing"` | Which icon(s) to animate. |
| `reduceMotion` | `boolean \| "auto"` | `"auto"` | Respects OS preference. |
| `tooltip` | `ReactNode` | — | Hover tooltip content. |
| `tooltipProps` | `ButtonTooltipProps` | — | Tooltip config (side, offset, delay, arrow). |
| `classes` | `ButtonClasses` | — | Per-slot overrides: root, content, startIcon, endIcon, loader. |
| `unstyled` | `boolean` | `false` | Strip all default classes. |

**When `as="a"`:** requires `href`, supports `target`, `rel`.
**When `as="span"`:** adds `role="button"`, `tabIndex=0`, Enter/Space keyboard handling.

### ButtonGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction (`aria-orientation`). |
| `className` | `string` | — | Container styling. |
| `children` | `ReactNode` | **required** | Button elements. |

---

## Ref API

Forwards ref to the underlying DOM element (type depends on `as`):

```tsx
const ref = useRef<HTMLElement>(null);
<Button ref={ref}>Click</Button>
// ref.current is HTMLButtonElement, HTMLAnchorElement, or HTMLSpanElement
```

---

## Styling Guide

### Slot → visual mapping

```
┌─ root (button/a/span — structural styles + your className) ─┐
│                                                               │
│  ┌─ content (inline-flex wrapper) ─────────────────────────┐ │
│  │                                                          │ │
│  │  [loader?]  [startIcon]  children  [endIcon]  [loader?] │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

| "I want to change..." | How | Notes |
|------------------------|-----|-------|
| Button colors/background | `className` | Your primary styling mechanism. |
| Padding/border-radius | `className` (overrides default) | Default is `px-4 py-2.5 rounded-xl`. |
| Focus ring color | `className` | Add `focus-visible:ring-indigo-500` etc. |
| Icon spacing | `classes={{ content: "gap-4" }}` | Default gap is `gap-2`. |
| Icon size/color | Style the icon element itself | Icons are your ReactNode — you control them. |
| Loader appearance | `loader` prop or `classes={{ loader: "..." }}` | Custom loader replaces default spinner. |
| Disabled opacity | `className` | Default is `disabled:opacity-50`. Override with `disabled:opacity-30` etc. |

### Dark mode

Button defaults have no color classes — they're structural only. Dark mode is handled entirely in your `className`:

```tsx
<Button className="bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-gray-900">
  Save
</Button>
```

Always include `dark:focus-visible:ring-offset-gray-900` (or your dark bg color) so the focus ring offset doesn't show a white gap.

### Common variant recipes

Copy-paste these as `className` values:

```tsx
// Primary (indigo)
"bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 active:bg-indigo-700 dark:active:bg-indigo-600 shadow-md shadow-indigo-600/25 dark:shadow-indigo-500/20 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-gray-900"

// Secondary (subtle)
"bg-gray-50 dark:bg-white/8 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.14] ring-1 ring-inset ring-gray-200 dark:ring-white/[0.1] shadow-sm dark:shadow-none focus-visible:ring-gray-400 dark:focus-visible:ring-offset-gray-900"

// Outline
"border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/6 focus-visible:ring-gray-400 dark:focus-visible:ring-offset-gray-900"

// Ghost (no background)
"text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8 focus-visible:ring-gray-400 dark:focus-visible:ring-offset-gray-900"

// Danger
"bg-red-500 text-white hover:bg-red-400 active:bg-red-600 shadow-md shadow-red-500/20 focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"

// Success
"bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-600 shadow-md shadow-emerald-500/20 focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-gray-900"
```

### Complete themed example: "Stripe Dashboard" actions

```tsx
<div className="flex gap-2">
  <Button
    className="bg-indigo-600 dark:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-400 shadow-sm focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-gray-900"
    startIcon={<PlusIcon className="w-3.5 h-3.5" />}
  >
    Create payment
  </Button>
  <Button
    className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-gray-400 dark:focus-visible:ring-offset-gray-900"
    endIcon={<FilterIcon className="w-3.5 h-3.5" />}
  >
    Filter
  </Button>
  <Button
    className="text-xs px-3 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400 dark:focus-visible:ring-offset-gray-900"
  >
    Export
  </Button>
</div>
```

---

## Patterns

### Link button

```tsx
<Button as="a" href="/settings" className={primaryClasses}>
  Go to Settings
</Button>
```

### Loading with feedback

```tsx
const [saving, setSaving] = useState(false);

<Button
  className={primaryClasses}
  loading={saving}
  loadingText="Saving..."
  onClick={async () => {
    setSaving(true);
    await saveData();
    setSaving(false);
  }}
>
  Save
</Button>
```

### Icon-only with tooltip

```tsx
<Button
  className={iconOnlyClasses}
  startIcon={<TrashIcon />}
  aria-label="Delete item"
  tooltip="Delete"
  tooltipProps={{ side: "bottom", delayDuration: 300 }}
/>
```

### Button group (segmented control)

```tsx
<ButtonGroup className="inline-flex gap-0">
  <Button className={`${outlineClasses} rounded-r-none border-r-0`}>Left</Button>
  <Button className={`${outlineClasses} rounded-none border-r-0`}>Center</Button>
  <Button className={`${outlineClasses} rounded-l-none`}>Right</Button>
</ButtonGroup>
```

### Icon animation on hover

```tsx
<Button
  className={primaryClasses}
  endIcon={<ArrowRightIcon />}
  iconAnimation="slideRight"
>
  Continue
</Button>
```

---

## Accessibility

- **Keyboard:** Enter/Space triggers click. When `as="span"`, keyboard handling is added automatically.
- **Focus ring:** Default classes include `focus-visible:ring-2`. Always visible on keyboard navigation, hidden on mouse click.
- **Disabled:** Sets `disabled` (button), removes `href` (anchor), sets `tabIndex={-1}` (span). `aria-disabled="true"` on all.
- **Loading:** Sets `aria-busy="true"`. Button becomes non-interactive.
- **Icon-only:** Must have `aria-label`. Dev warning logged if missing when `as="span"`.
- **ButtonGroup:** `role="group"` with `aria-orientation` for screen reader context.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Button has no background/color | No `className` provided | Button defaults are structural only — add visual classes via `className`. |
| Two backgrounds fighting | Both `classes.root` and `className` have bg classes | Use one or the other for colors. `className` takes priority in CSS. |
| Focus ring shows white gap on dark bg | Missing `dark:focus-visible:ring-offset-gray-900` | Add offset color matching your dark background. |
| Link button still looks like button | `as="a"` but no link-specific classes | Use underline/text-color classes instead of bg classes. |
| Icon not animating | `iconAnimation="none"` (default) | Set `iconAnimation="slideRight"` etc. |
| Animation runs continuously | `animateOnHover={false}` | Set `animateOnHover={true}` (default) for hover-only. |
| Loading spinner not visible | Custom `className` hides it | Check `loader` slot classes. Default spinner is 16px white. |
| `as="span"` not keyboard accessible | Missing aria-label | Add `aria-label` — dev warning should appear in console. |

---

## Anti-patterns

```tsx
// ❌ DON'T: Use as="a" without href
<Button as="a" className="...">Link</Button>
// ✅ DO: Always provide href with as="a"
<Button as="a" href="/page" className="...">Link</Button>

// ❌ DON'T: Nest interactive elements inside Button
<Button><a href="/page">Link inside button</a></Button>
// ✅ DO: Use as="a" for link-style buttons
<Button as="a" href="/page">Link</Button>

// ❌ DON'T: Use color alone for destructive actions
<Button className="bg-red-500 text-white">Delete</Button>
// ✅ DO: Include a warning icon or confirmation
<Button className="bg-red-500 text-white" startIcon={<TrashIcon />}>Delete</Button>

// ❌ DON'T: Use icon-only span button without aria-label
<Button as="span" startIcon={<CloseIcon />} />
// ✅ DO: Always provide aria-label for icon-only buttons
<Button as="span" startIcon={<CloseIcon />} aria-label="Close" />
```

---

## AI Instructions

- **Always provide `className`** — Button has no built-in colors. Without it, you get a transparent, unstyled button.
- **Use `as="a"` for navigation**, `as="button"` for actions. Never use `as="span"` unless the element must be non-focusable-by-default.
- **Always add `aria-label`** to icon-only buttons.
- **`size` doesn't change dimensions** — it only emits `data-size`. Use `className` for sizing or target `[data-size="sm"]` in CSS.
- **Safe defaults:** `<Button className="bg-blue-600 text-white hover:bg-blue-700 ...">Label</Button>`.
- **Use `loading` + `loadingText`** for async actions. The button auto-disables during loading.
- **`disabled` vs `loading`:** both disable interaction, but `loading` shows a spinner and sets `aria-busy`.

---

## Demo Reference

**File:** `src/pages/demo/ButtonDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Core variants | `title="Basic Usage"` | Primary, secondary, outline, ghost |
| All 6 variants | `title="Basic Variants"` | + danger, success |
| Icon placement | `title="With Icons"` | startIcon, endIcon combinations |
| Icon-only | `title="Icon Only"` | aria-label requirement |
| Polymorphic | `title="Polymorphic"` | as="button", as="a", as="span" |
| Hover animations | `title="Icon Animations"` | slideRight/Left/Up/Down |
| Bounce/pulse/spin | `title="More Animation"` | animateIcon="leading" |
| Both icons animated | `title="Animate Both"` | animateIcon="both" |
| Always-on animation | `title="Continuous"` | animateOnHover={false} |
| Motion reduction | `title="Reduce Motion"` | reduceMotion prop |
| Loading states | `title="Loading States"` | loaderPosition, loadingText |
| Custom loader | `title="Custom Loader"` | Custom loader elements |
| Click-to-load | `title="Interactive Loading"` | useState + async pattern |
| Size presets | `title="Sizes"` | sm, md, lg |
| Disabled | `title="Disabled"` | Disabled across variants |
| Full width | `title="Full Width"` | fullWidth prop |
| Class slots | `title="Classes System"` | root, content, startIcon, endIcon |
| Unstyled | `title="Unstyled Mode"` | unstyled=true |
| Slot composition | `title="asChild"` | asChild with child element |
| Tooltip | `title="Tooltip"` | tooltip + tooltipProps |
| Tooltip sides | `title="Tooltip Positions"` | top, right, bottom, left |
| Grouped buttons | `title="Button Group"` | Segmented, action pairs, vertical |
| Form submit/reset | `title="Form Integration"` | type="submit", type="reset" |

**Source files:**

| File | Contains |
|------|----------|
| `Button.tsx` | Main component — polymorphic rendering, loading, animation, tooltip |
| `components/ButtonGroup.tsx` | Group container with role="group" |
| `utils/types.ts` | All TypeScript interfaces (ButtonProps union, ButtonClasses, etc.) |
| `utils/constants.ts` | Default classes, icon animation maps |
