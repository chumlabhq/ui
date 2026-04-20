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

### Avatar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Display name, used for initials and autoColor hash. |
| `src` | `string` | — | Image URL. Falls back to initials on error. |
| `alt` | `string` | — | Image alt text. |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| number` | `"md"` | Preset or custom pixel size. |
| `shape` | `"circle" \| "square" \| "rounded"` | `"circle"` | Visual shape. |
| `maxInitials` | `number` | `2` | Max initials to display. |
| `fallback` | `ReactNode` | — | Custom fallback content (icon, emoji, etc.). |
| `autoColor` | `boolean` | `false` | Deterministic bg/text color from name hash. |
| `colors` | `AvatarColors` | — | Custom color palettes for autoColor. |
| `bordered` | `boolean \| string` | — | Border ring. `true` = auto color, string = CSS value. |
| `status` | `AvatarStatus \| AvatarStatusConfig` | — | Presence indicator (online/offline/away/busy). |
| `tooltip` | `ReactNode \| AvatarTooltipConfig` | — | Hover tooltip. |
| `imageConfig` | `AvatarImageConfig` | — | Advanced img attrs (srcSet, loading, crossOrigin, etc.). |
| `classes` | `AvatarClasses` | — | Per-slot class overrides. |
| `unstyled` | `boolean` | `false` | Strip all default classes. |
| `textStyle` | `CSSProperties` | — | Inline styles for initials text. |
| `loading` | `boolean` | `false` | Show shimmer placeholder instead of content. |
| `reduceMotion` | `boolean \| "auto"` | `"auto"` | Disable image fade-in animation. |
| `onLoad` | `() => void` | — | Image load success callback. |
| `onError` | `() => void` | — | Image load error callback. |

### AvatarGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `max` | `number` | — | Max visible avatars before surplus count. |
| `size` | `AvatarSize` | `"md"` | Inherited by all children via context. |
| `shape` | `AvatarShape` | `"circle"` | Inherited by all children. |
| `bordered` | `boolean \| string` | — | Inherited by all children. |
| `spacing` | `number` | `-8` | Overlap in px (negative = overlap). |
| `ringColor` | `string` | `"white"` | Ring color between stacked avatars. |
| `showTooltip` | `boolean` | `false` | Show hidden names as tooltip on surplus. |
| `total` | `number` | — | Override total count for surplus calculation. |
| `variant` | `"stack" \| "grid" \| "inline"` | `"stack"` | Layout mode. |
| `reverseOrder` | `boolean` | `false` | Reverse stacking z-order. |
| `renderSurplus` | `(count: number) => ReactNode` | — | Custom surplus renderer. |
| `onAvatarClick` | `(info, event) => void` | — | Click handler with `{ index, name }`. |
| `dir` | `"ltr" \| "rtl"` | `"ltr"` | Text direction. |
| `classes` | `AvatarGroupClasses` | — | Per-slot: `root`, `item`. |

### AvatarBadge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | — | Notification count. |
| `max` | `number` | `99` | Shows `99+` when exceeded. |
| `showZero` | `boolean` | `false` | Show badge when count is 0. |
| `dot` | `boolean` | `false` | Small dot instead of count. |
| `position` | `CornerPosition` | `"top-right"` | Corner placement. |
| `offset` | `BadgeOffset` | — | Pixel offset `{ x, y }`. |
| `color` | `string` | — | Background color override. |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | Size preset. |
| `variant` | `"solid" \| "outline" \| "soft"` | `"solid"` | Visual style. |
| `pulse` | `boolean` | `false` | Pulsing animation. |
| `invisible` | `boolean` | `false` | Hide without unmounting. |

### AvatarGroupCount (standalone)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | **required** | Number to display. |
| `showPlus` | `boolean` | `true` | Show `+` prefix. |
| `format` | `(count: number) => string` | — | Custom formatter. |
| `variant` | `"solid" \| "outline" \| "ghost"` | `"solid"` | Visual style. |

### AvatarShimmer / AvatarGroupShimmer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `3` | (Group only) Number of placeholders. |
| `size` | `AvatarSize` | `"md"` | Placeholder size. |
| `shape` | `AvatarShape` | `"circle"` | Placeholder shape. |
| `animate` | `boolean` | `true` | Pulse animation. |
| `showCount` | `boolean` | `false` | (Group only) Show surplus count placeholder. |
| `ringColor` | `string` | `"white"` | (Group only) Ring color for overlap. |
| `spacing` | `number` | `-8` | (Group only) Overlap spacing. |

---

## Styling Guide

### How class merging works

1. **Default** (`unstyled=false`, no `classes`): Uses `DEFAULT_AVATAR_CLASSES` — minimal layout styles.
2. **Partial override** (`unstyled=false`, partial `classes`): Your value **replaces** the default for that slot. Other slots keep defaults.
3. **Unstyled** (`unstyled=true`): All slots are empty. You provide everything.

### Slot → visual mapping

```
┌─ root (outer container, sets size/shape) ──────────────┐
│                                                         │
│  ┌─ inner (absolute inset, overflow hidden) ─────────┐ │
│  │                                                    │ │
│  │  <img class="image" />                            │ │
│  │  — OR —                                           │ │
│  │  <span class="initials">JD</span>                │ │
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
    initials: "text-gray-700 dark:text-gray-200",
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
  onError={() => console.log("Image failed, showing initials")}
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

## Accessibility

- **`role="img"`** with `aria-label` set to `name` or `alt` on the root element
- **Image alt text:** Falls through to `alt` prop, or `name` if `alt` not provided
- **Status indicator:** Has `aria-label` describing the status (e.g., "Status: online")
- **AvatarBadge:** Supports `aria-live` for screen reader announcements when count changes
- **AvatarGroupCount:** Supports `aria-live` for dynamic surplus count updates
- **Reduced motion:** `reduceMotion="auto"` respects OS `prefers-reduced-motion`, disables image fade-in and shimmer pulse

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
| Status positioning | `title="Status Position"` | Corner positions + custom color |
| Tooltip | `title="Tooltip"` | String and config object |
| Badge notifications | `title="Avatar Badge"` | count, dot, variants, pulse |
| Group stacking | `title="Avatar Group"` | max, spacing, ringColor, surplus |
| Group layouts | `title="Group Layout Variants"` | stack, grid, inline |
| Click handling | `title="Group Click Handler"` | onAvatarClick callback |
| Standalone count | `title="AvatarGroupCount"` | variants, format, click |
| Loading shimmer | `title="Loading & Shimmer"` | Toggle shimmer/content |
| Image config | `title="Image Configuration"` | lazy, srcSet, crossOrigin |
| Error handling | `title="Image Error Handling"` | Fallback to initials |
| Classes system | `title="Classes System"` | Per-slot overrides |
| Group shimmer | `title="Group Shimmer Options"` | count, shape, spacing, animate |
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
