# Avatar

> A circular (or shaped) user representation showing an image, initials derived from a name, or custom fallback content. Includes group stacking, status indicators, notification badges, tooltips, and shimmer loading.

**Category:** Display
**Keywords:** avatar, profile, user, photo, initials, group, badge, status, shimmer

---

## Quick Answer

Use `<Avatar name="John Doe" />` for initials or `<Avatar src="url" name="John Doe" />` for an image. It auto-falls back to initials if the image fails. Use `<AvatarGroup>` to stack multiple avatars with overflow counting. Works out-of-the-box with zero configuration.

---

## Import

```tsx
import {
  Avatar,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
  AvatarShimmer,
  AvatarGroupShimmer,
} from "@chumlab/ui/avatar";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { Avatar, AvatarGroup } from "@chumlab/ui/avatar";

export default function UserList() {
  return (
    <div className="flex items-center gap-4">
      {/* Image avatar */}
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
        alt="John Doe"
        name="John Doe"
      />

      {/* Initials avatar (auto-colored) */}
      <Avatar name="Jane Smith" autoColor />

      {/* Grouped avatars with overflow */}
      <AvatarGroup max={3}>
        <Avatar name="Alice" autoColor />
        <Avatar name="Bob" autoColor />
        <Avatar name="Charlie" autoColor />
        <Avatar name="Diana" autoColor />
        <Avatar name="Edward" autoColor />
      </AvatarGroup>
    </div>
  );
}
```

This renders correctly with no additional props, classes, or setup.

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `autoColor` | Requires `name` to generate colors. Without `name`, has no effect. |
| `colors` | Only used when `autoColor={true}`. Ignored otherwise. |
| `bordered={true}` | Uses auto-generated border color if `autoColor` is on, otherwise defaults to white. Pass a CSS string for explicit color. |
| `maxInitials` | Only affects initials display. Ignored when `src` loads successfully. |
| `loading={true}` | Renders shimmer in place of the avatar. Overrides `src`/`name`/`fallback`. |
| `status` | Can be a string shorthand (`"online"`) or a config object (`{ type: "online", position: "bottom-right" }`). |
| AvatarGroup `max` | Hides excess children and shows a surplus count. Set `total` separately if you're rendering a subset from an API. |
| AvatarGroup `ringColor` | The ring between stacked avatars. Match to your background color for clean overlap (e.g., `ringColor="#111827"` on dark bg). |
| AvatarGroup `variant` | `"stack"` overlaps, `"grid"` uses CSS grid, `"inline"` uses inline-flex. Only `"stack"` uses `spacing` and `ringColor`. |

---

## Content Fallback Hierarchy

The avatar resolves its display in this order:

1. **Image** — if `src` is provided and loads successfully
2. **Initials** — derived from `name` (e.g., "John Doe" → "JD"), takes priority over fallback
3. **Fallback** — if `fallback` ReactNode is provided and no `name` is set
4. **Empty** — renders an empty circle

If an image fails to load, it falls back to step 2/3 automatically. Note: when both `name` and `fallback` are provided, initials win.

---

## Data Attributes (for CSS selectors and testing)

- `data-has-image` — on Avatar root when image is loaded (boolean)
- `data-shape="circle|rounded|square"` — on Avatar root

**DOM nesting:** Avatar root `<div>` → inner `<div>` → (`<img>` | initials `<span>` | fallback `<span>`) + optional status `<span>`

---

## All Props

<!-- generated from Avatar.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | — | User's display name, used for initials and accessible labels. |
| `src` | string | — | Image URL for the avatar. Falls back to initials, then fallback content. |
| `alt` | string | — | Alt text for the avatar image. |
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| number | `"md"` | Avatar size as a preset or numeric pixel value. |
| `shape` | `"circle"` \| `"square"` \| `"rounded"` | `"circle"` | Visual shape of the avatar. |
| `maxInitials` | number | `2` | Maximum number of initials to show. |
| `fallback` | object | — | React.ReactNode — Custom fallback content when no image or name is available. |
| `autoColor` | boolean | `false` | Generates a deterministic background color from the name. |
| `colors` | object | — | Custom color palettes for auto-colored mode. |
| `bordered` | boolean \| string | — | Adds a border ring. Pass true for default color or a CSS color string. |
| `status` | `"online"` \| `"offline"` \| `"away"` \| `"busy"` \| object | — | Presence status indicator. Pass a string for defaults or a config object. |
| `tooltip` | object | — | Tooltip shown on hover. Pass a string/ReactNode or a config object. |
| `imageConfig` | object | — | Advanced image loading configuration (srcSet, loading, decoding, CORS). |
| `classes` | object | — | CSS class overrides for avatar sub-elements. |
| `unstyled` | boolean | `false` | Removes all default styling. |
| `textStyle` | object | — | CSSProperties — Inline styles for the initials text. |
| `loading` | boolean | `false` | Shows a loading shimmer placeholder. |
| `reduceMotion` | boolean \| `"auto"` | `"auto"` | Controls motion preferences. 'auto' respects OS setting. |
| `onLoad` | object | — | () => void — Fires when the avatar image finishes loading. |
| `onError` | object | — | () => void — Fires when the avatar image fails to load. |
| `asChild` | boolean | `false` | Merges avatar props onto the child element via Slot. |

## Sub-component Props

Generated from the types by `scripts/build-subcomponent-schemas.mjs`.

### AvatarGroup

| Prop | Type | Description |
| --- | --- | --- |
| `children` | `ReactNode` | Avatar elements to group. |
| `max` | `number \| undefined` | Maximum visible avatars before showing a surplus count. |
| `size` | `AvatarSize \| undefined` | Default size for all avatars in the group. |
| `shape` | `AvatarShape \| undefined` | Default shape for all avatars in the group. |
| `bordered` | `string \| boolean \| undefined` | Adds border rings to all avatars. |
| `spacing` | `number \| undefined` | Overlap spacing in pixels (negative for overlap). |
| `ringColor` | `string \| undefined` | Border ring color for overlapping avatars. |
| `showTooltip` | `boolean \| undefined` | Shows a tooltip with the avatar's name on hover. |
| `total` | `number \| undefined` | Total count for surplus calculation (when not all items are rendered). |
| `variant` | `GroupVariant \| undefined` | Layout variant: stacked overlap, grid, or inline. Default: `"stack"`. |
| `reverseOrder` | `boolean \| undefined` | Reverses the visual stacking order. |
| `renderSurplus` | `((count: number) => ReactNode) \| undefined` | Custom render function for the surplus count indicator. |
| `onAvatarClick` | `((info: { index: number; name?: string \| undefined; }, event: MouseEvent<Element, MouseEvent>) => void) \| undefined` | Click handler for individual avatars within the group. |
| `dir` | `Direction \| undefined` | Text direction. Sets `dir` on the group; the layout itself does not mirror. |
| `classes` | `AvatarGroupClasses \| undefined` | CSS class overrides for group sub-elements. |
| `asChild` | `boolean \| undefined` | Merges group props onto the child element via Slot. |

### AvatarGroupCount

| Prop | Type | Description |
| --- | --- | --- |
| `count` | `number` | Number of additional (hidden) avatars. |
| `size` | `AvatarSize \| undefined` | Size matching the group's avatar size. |
| `shape` | `AvatarShape \| undefined` | Shape matching the group's avatar shape. |
| `max` | `number \| undefined` | Maximum count before showing `max+`. Inside an `AvatarGroup` this defaults to 99 and renders as `+99`, because three digits do not fit an avatar-sized circle; standalone there is no ceiling unless you set one. |
| `showPlus` | `boolean \| undefined` | Whether to show a `+` prefix. Default: `true`. |
| `format` | `((count: number) => string) \| undefined` | Custom format function for the count display. |
| `variant` | `CountVariant \| undefined` | Visual style variant. |
| `tooltip` | `ReactNode \| AvatarTooltipConfig` | Tooltip shown on hover. |
| `bordered` | `string \| boolean \| undefined` | Adds a border ring. |
| `textClassName` | `string \| undefined` | CSS class for the count text. |
| `textStyle` | `CSSProperties \| undefined` | Inline styles for the count text. |
| `aria-live` | `"off" \| "polite" \| "assertive" \| undefined` | ARIA live region behavior for screen readers. |
| `asChild` | `boolean \| undefined` | Merges count props onto the child element via Slot. |
| `children` | `ReactNode` | Custom content replacing the default count display. |

### AvatarBadge

| Prop | Type | Description |
| --- | --- | --- |
| `count` | `number \| undefined` | Notification count displayed in the badge. |
| `max` | `number \| undefined` | Maximum count before showing `max+`. |
| `showZero` | `boolean \| undefined` | Shows the badge even when count is zero. Default: `false`. |
| `dot` | `boolean \| undefined` | Renders a small dot instead of a count. |
| `position` | `CornerPosition \| undefined` | Corner position for the badge. Default: `"top-right"`. |
| `offset` | `BadgeOffset \| undefined` | Pixel offset from the default corner position. |
| `color` | `string \| undefined` | Background color of the badge. |
| `size` | `BadgeSize \| undefined` | Badge size preset. Default: `"sm"`. |
| `variant` | `BadgeVariant \| undefined` | Visual style variant. Default: `"solid"`. |
| `tone` | `BadgeTone \| undefined` | Token family the badge draws from. Default: `"accent"` — a count is a notification, not a fault. Use `"error"` for a badge that reports one. |
| `overlap` | `BadgeOverlap \| undefined` | Shape of the element the badge overlaps. |
| `pulse` | `boolean \| undefined` | Adds a pulsing animation to the badge. |
| `invisible` | `boolean \| undefined` | Hides the badge while preserving its DOM presence. |
| `aria-live` | `"off" \| "polite" \| "assertive" \| undefined` | ARIA live region behavior for screen readers. |
| `asChild` | `boolean \| undefined` | Merges badge props onto the child element via Slot. |

### AvatarShimmer

| Prop | Type | Description |
| --- | --- | --- |
| `classes` | `AvatarShimmerClasses \| undefined` | Class overrides for this component's slots. |
| `unstyled` | `boolean \| undefined` | Drops the decorative default classes and keeps the structural ones, along with focus, keyboard and ARIA wiring. |
| `size` | `AvatarSize \| undefined` | Shimmer size matching the avatar size. |
| `shape` | `AvatarShape \| undefined` | Shimmer shape matching the avatar shape. |
| `animate` | `boolean \| undefined` | Enables the shimmer animation. Default: `true`. |
| `reduceMotion` | `boolean \| "auto" \| undefined` | Controls motion preferences. `"auto"` respects the user's OS setting. |

### AvatarGroupShimmer

| Prop | Type | Description |
| --- | --- | --- |
| `count` | `number \| undefined` | Number of shimmer placeholders to render. Default: `3`. |
| `size` | `AvatarSize \| undefined` | Shimmer size matching the group's avatar size. |
| `shape` | `AvatarShape \| undefined` | Shimmer shape matching the group's avatar shape. |
| `spacing` | `number \| undefined` | Overlap spacing in pixels. |
| `ringColor` | `string \| undefined` | Border ring color. |
| `animate` | `boolean \| undefined` | Enables the shimmer animation. Default: `true`. |
| `showCount` | `boolean \| undefined` | Shows a shimmer placeholder for the surplus count. |
| `reduceMotion` | `boolean \| "auto" \| undefined` | Controls motion preferences. `"auto"` respects the user's OS setting. |
| `asChild` | `boolean \| undefined` | Merges shimmer props onto the child element via Slot. |

---

## Styling Guide

> **A plain utility replaces the library's for that property, in every state.**
> `classes={{ slot: "text-red-500" }}` drops the library's `hover:text-…` and
> `data-[state=…]:text-…` on that slot as well — otherwise they would sit beside
> your class and win in their own state, leaving your override in the DOM and
> inert. Pass your own variant to keep one: `"text-red-500 hover:text-red-400"`.
> A variant YOU pass is never dropped.

### How class merging works

1. **Default** (`unstyled=false`, no `classes`): Uses `DEFAULT_AVATAR_CLASSES` — minimal layout styles.
2. **Partial override** (`unstyled=false`, partial `classes`): Your value **replaces** the default for that slot. Other slots keep defaults.

**A slot that carries states is replaced as a whole.** Several slots absorbed what were
separate per-state keys, so overriding one replaces its base styling *and* every state
variant on it. Write the base and all the states you want in one string — a one-state
override silently drops the rest.

3. **Unstyled** (`unstyled=true`): All slots are empty. You provide everything.

### Slot → visual mapping

```
┌─ root (outer container, sets size/shape) ──────────────┐
│                                                         │
│  ┌─ control (absolute inset, overflow hidden) ─────────┐ │
│  │                                                    │ │
│  │  <img class="image" />                            │ │
│  │  — OR —                                           │ │
│  │  <span class="fallback">JD</span>                │ │
│  │  — OR —                                           │ │
│  │  <span class="fallback">{icon}</span>            │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  <span class="status" /> (positioned absolute)          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| "I want to change..." | Slot / Prop | Notes |
|------------------------|-------------|-------|
| Overall size | `size` prop | Preset or number. Don't use CSS for this. |
| Shape (circle/square) | `shape` prop | Controls border-radius inline. |
| Background color (initials) | `autoColor` + `colors` | Hash-based. Or use `classes.root` with bg class. |
| Initials font style | `textStyle` prop or `classes.initials` | `textStyle` for inline, `classes.initials` for Tailwind. |
| Image fit/filter | `classes.image` or `imageConfig.className` | Add `object-cover`, `grayscale`, etc. |
| Border ring | `bordered` prop | `true`, or CSS string like `"3px solid gold"`. |
| Status dot color | `status` as config: `{ type: "online", color: "#00ff00" }` | Or override `classes.status`. |
| Ring between grouped avatars | AvatarGroup `ringColor` | Match to your page background. |
| Overlap spacing | AvatarGroup `spacing` | Negative = overlap, positive = gap. |

### Dark mode

Avatar relies on inline styles for most visual properties (size, shape, auto-generated colors). The `classes` defaults have minimal color classes. When overriding slots, provide `dark:` variants:

```tsx
<Avatar
  name="Jane"
  classes={{
    root: "ring-2 ring-gray-200 dark:ring-gray-700",
    fallback: "text-gray-700 dark:text-gray-200",
  }}
/>
```

For grouped avatars, match `ringColor` to your background:

```tsx
<AvatarGroup ringColor={isDarkMode ? "#111827" : "white"}>
  ...
</AvatarGroup>
```

### Styling via autoColor

`autoColor` generates deterministic colors from the `name` hash. Override the palette with `colors`:

```tsx
<Avatar
  name="Alice"
  autoColor
  colors={{
    backgrounds: ["#ede9fe", "#dbeafe", "#d1fae5", "#fef9c3"],
    text: ["#7c3aed", "#2563eb", "#059669", "#ca8a04"],
  }}
/>
```

### Complete themed example: "Slack-style" user list

```tsx
<AvatarGroup
  max={4}
  spacing={-6}
  ringColor="#1a1d21"
  showTooltip
  variant="stack"
>
  <Avatar
    src="/avatars/alice.jpg"
    name="Alice Chen"
    size="sm"
    shape="rounded"
    status="online"
  />
  <Avatar name="Bob Park" size="sm" shape="rounded" autoColor status="away" />
  <Avatar name="Charlie Kim" size="sm" shape="rounded" autoColor status="offline" />
  <Avatar name="Diana Lee" size="sm" shape="rounded" autoColor status="busy" />
  <Avatar name="Edward Wu" size="sm" shape="rounded" autoColor />
  <Avatar name="Fiona Xu" size="sm" shape="rounded" autoColor />
</AvatarGroup>
```

---

## Patterns

### Image with fallback to initials

```tsx
<Avatar
  src={user.avatarUrl}
  name={user.displayName}
  onError={() => console.log("Image failed, showing fallback")}
/>
```

### Badge notification on avatar

```tsx
<div className="relative inline-block">
  <Avatar name="John" src="/john.jpg" />
  <AvatarBadge count={5} position="top-right" variant="solid" pulse />
</div>
```

### Loading → loaded transition

```tsx
{isLoading ? (
  <AvatarGroupShimmer count={4} showCount />
) : (
  <AvatarGroup max={4}>
    {users.map(u => (
      <Avatar key={u.id} name={u.name} src={u.avatar} autoColor />
    ))}
  </AvatarGroup>
)}
```

### Standalone surplus count

```tsx
<div className="flex items-center gap-2">
  <AvatarGroup max={3}>
    {users.slice(0, 3).map(u => <Avatar key={u.id} name={u.name} autoColor />)}
  </AvatarGroup>
  <AvatarGroupCount count={users.length - 3} variant="ghost" />
</div>
```

### Clickable avatars in group

```tsx
<AvatarGroup
  max={5}
  onAvatarClick={(info, event) => {
    console.log(`Clicked ${info.name} at index ${info.index}`);
    navigate(`/users/${info.name}`);
  }}
>
  {users.map(u => <Avatar key={u.id} name={u.name} autoColor />)}
</AvatarGroup>
```

---

## Keyboard Interactions

Only an avatar with `onClick` is focusable; a plain one is an image and takes no keyboard input.

| Key | Behaviour |
|-----|-----------|
| `Tab` | Moves focus to a clickable avatar, and to the overflow count in an `AvatarGroup`. |
| `Enter`, `Space` | Activates it, firing the same `onClick` a pointer would. |

---

## Accessibility

- **`role="img"`** with `aria-label` set to `name` or `alt` on the root element
- **Image alt text:** Falls through to `alt` prop, or `name` if `alt` not provided
- **Status indicator:** Has `aria-label` describing the status (e.g., "Status: online")
- **AvatarBadge:** Supports `aria-live` for screen reader announcements when count changes
- **AvatarGroupCount:** Supports `aria-live` for dynamic surplus count updates
- **Reduced motion:** `reduceMotion` defaults to `"auto"`, which follows the OS
  `prefers-reduced-motion` setting. `true` always reduces motion. `false` always
  animates — **including for a user who has asked their OS for less motion**, so
  pass it only when you know more than the OS setting does. The value governs the
  decorative classes as well as the animation timings.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Initials not showing | No `name` prop | Provide `name` — initials are derived from it |
| autoColor not working | Missing `name` | `autoColor` hashes the `name` string. No name = no color. |
| White ring visible between grouped avatars on dark bg | Default `ringColor="white"` | Set `ringColor` to match your background (e.g., `"#111827"`) |
| Surplus count wrong | `total` not set when paginating | Set `total={serverTotal}` on AvatarGroup if only rendering a subset |
| Image flickers on re-render | `src` prop changing identity | Memoize the URL or use a stable string |
| Badge hidden but space taken | `invisible={true}` preserves layout | Use conditional rendering (`{show && <AvatarBadge />}`) to fully remove |
| Custom classes not applying | Passed `classes.root` but avatar still looks default | `classes` replaces per-slot, not additive. Include all needed classes. |
| Group children not inheriting size | Children override group context | Remove explicit `size` from child Avatars to inherit from group |

---

## Anti-patterns

```tsx
// ❌ DON'T: Use autoColor without name — it needs name to hash
<Avatar autoColor />
// ✅ DO: Provide name for autoColor
<Avatar name="John" autoColor />

// ❌ DON'T: Expect fallback to show when name is also provided
// Initials from name take priority over fallback
<Avatar name="John" fallback={<UserIcon />} />
// ✅ DO: Use fallback only when no name is available
<Avatar fallback={<UserIcon />} />

// ❌ DON'T: Set explicit size on children when group provides it
<AvatarGroup size="lg">
  <Avatar name="A" size="sm" /> {/* overrides group context */}
</AvatarGroup>
// ✅ DO: Let children inherit from group
<AvatarGroup size="lg">
  <Avatar name="A" />
</AvatarGroup>

// ❌ DON'T: Use white ringColor on dark backgrounds
<div className="bg-gray-900">
  <AvatarGroup>{/* white rings visible */}</AvatarGroup>
</div>
// ✅ DO: Match ringColor to background
<AvatarGroup ringColor="#111827">{/* clean overlap */}</AvatarGroup>
```

---

## Demo Reference

**File:** `src/pages/demo/AvatarDemo.tsx`

| Feature | Search for | What you'll find |
|---------|-----------|------------------|
| Minimal example | `title="Basic Usage"` | Image + initials avatars |
| Size presets | `title="Sizes"` | xs through xl + custom number |
| Shape variants | `title="Shapes"` | circle, rounded, square |
| Auto-generated colors | `title="Auto-Generated Colors"` | autoColor with name hash |
| Custom palettes | `title="Custom Color Palettes"` | colors prop with custom arrays |
| Border ring | `title="Bordered Avatars"` | bordered={true} and CSS strings |
| Status indicator | `title="Status Indicator"` | online/offline/away/busy |
| Status positioning | `title="Status Position & Custom Color"` | Corner positions + custom color |
| Tooltip | `title="Tooltip"` | String and config object |
| Badge notifications | `title="Avatar Badge"` | count, dot, variants, pulse |
| Group stacking | `title="Avatar Group"` | max, spacing, ringColor, surplus |
| Group layouts | `title="Group Layout Variants"` | stack, grid, inline |
| Click handling | `title="Group Click Handler"` | onAvatarClick callback |
| Standalone count | `title="Avatar"` | variants, format, click |
| Loading shimmer | `title="Loading & Shimmer"` | Toggle shimmer/content |
| Image config | `title="Image Configuration"` | lazy, srcSet, crossOrigin |
| Error handling | `title="Image Error Handling"` | Fallback to initials |
| Classes system | `title="Classes System"` | Per-slot overrides |
| Reduced motion | `title="Reduce Motion"` | reduceMotion prop |

**Source files:**

| File | Contains |
|------|----------|
| `Avatar.tsx` | Main component — image loading, initials, fallback, status, tooltip |
| `components/AvatarGroup.tsx` | Group container, context provider, surplus logic |
| `components/AvatarGroupCount.tsx` | Standalone surplus count display |
| `components/AvatarBadge.tsx` | Notification badge overlay |
| `components/AvatarShimmer.tsx` | Single + group shimmer loading placeholders |
| `utils/types.ts` | All TypeScript interfaces |
| `utils/constants.ts` | Default classes, size/font/status maps, color palettes |
| `utils/context.ts` | AvatarGroupContext (size, shape, bordered, ringColor) |
| `utils/helpers.ts` | autoColor hash, initials generation, border parsing |
