# TabPanel

> Accessible tab panel with icons, badges, tooltips, closable tabs, vertical orientation, lazy loading, and roving tabindex.

**Category:** Navigation
**Keywords:** tabs, tab panel, tabbed interface, navigation tabs, tab list, tab content, closable, vertical tabs, lazy loading

---

## Quick Answer

Use `<TabPanel tabs={[...]} defaultValue="home" renderContent={(tab) => ...} />` for a tabbed interface. Supports controlled/uncontrolled, icons, count badges, closable tabs, vertical orientation, manual activation, tooltips, and responsive horizontal scrolling. Works out-of-the-box with built-in Tailwind styles.

---

## Import

```tsx
import { TabPanel } from "@chumlab/ui/tab-panel";
import type { Tab, TabPanelProps } from "@chumlab/ui/tab-panel";
```

---

## Basic Usage (copy-paste ready)

```tsx
import { TabPanel } from "@chumlab/ui/tab-panel";

const tabs = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export default function Example() {
  return (
    <TabPanel
      tabs={tabs}
      defaultValue="home"
      renderContent={(tab) => <div style={{ padding: 16 }}>{tab.label} content</div>}
    />
  );
}
```

---

## Prop Constraints (critical for correct usage)

| Prop | Constraint |
|------|-----------|
| `tabs` | **Required.** Array of `Tab` objects with unique `id`. |
| `value` + `onValueChange` | Controlled mode — both needed together. |
| `defaultValue` | Uncontrolled mode — do not combine with `value`. |
| `orientation` | `"horizontal"` (default) or `"vertical"`. |
| `activationMode` | `"automatic"` (default) or `"manual"` (Enter/Space to activate). |
| `closable` | When true, tabs show close button. Must handle `onClose`. |
| `renderContent` | Function `(tab) => ReactNode`. Required for content rendering. |
| `renderTab` | Custom tab renderer. Receives `(props, defaultElement)`. |
| `lazyMount` | Only mount panels on first activation. |
| `keepMounted` | Keep panels in DOM after switching away. |
| `forceMount` | Mount all panels regardless of active state. |
| `unstyled` | Strips all defaults. Must provide styling via `classes`. |

---

## Data Attributes (for CSS selectors and testing)

- `data-state="active"` / `data-state="inactive"` — on tab buttons
- `data-disabled` — on disabled tabs
- `data-orientation` — on tablist and root

DOM nesting: `root > tabList(role="tablist") > tab(role="tab") + indicator > panel(role="tabpanel")`

---

## All Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Tab[]` | — | **Required.** Tab definitions |
| `value` | `string` | — | Active tab (controlled) |
| `defaultValue` | `string` | — | Initial tab (uncontrolled) |
| `onValueChange` | `(tabId) => void` | — | Tab change callback |
| `renderContent` | `(tab) => ReactNode` | — | Content renderer |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction |
| `activationMode` | `"automatic" \| "manual"` | `"automatic"` | Keyboard activation mode |
| `closable` | `boolean` | `false` | Show close buttons |
| `onClose` | `(tabId) => void` | — | Close tab callback |
| `showTooltips` | `boolean` | `false` | Enable tooltips |
| `tooltipDefaults` | `TooltipDefaults` | — | Default tooltip config |
| `lazyMount` | `boolean` | `false` | Lazy-mount panels |
| `keepMounted` | `boolean` | `false` | Keep inactive panels |
| `forceMount` | `boolean` | `false` | Mount all panels |
| `loop` | `boolean` | `true` | Loop keyboard navigation |
| `disabled` | `boolean` | `false` | Disable all tabs |
| `renderTab` | `(props, defaultEl) => ReactNode` | — | Custom tab renderer |
| `classes` | `TabPanelClasses` | — | Per-slot class overrides |
| `unstyled` | `boolean` | `false` | Strip all defaults |
| `className` | `string` | — | Root class |
| `aria-label` | `string` | `"Tabs"` | Tablist ARIA label |
| `aria-labelledby` | `string` | — | External labelling element |
| `id` | `string` | — | Root ID |

---

## Styling Guide

### How class merging works

1. **Default** — uses `DEFAULT_TABPANEL_CLASSES`
2. **Partial override** — **replaces** per slot, not additive
3. **Unstyled** — all slots empty, you build from scratch

### Slot → visual mapping

```
root (w-full)
├── tabList (role="tablist", flex overflow-x-auto)
│   └── tab (role="tab", relative shrink-0)
│       ├── icon
│       ├── label
│       ├── count (badge)
│       └── indicator (absolute bottom, animated underline)
└── panel (role="tabpanel", p-4)
```

| "I want to change..." | Slot to use |
|------------------------|-------------|
| Tab list container | `tabList` |
| Tab button | `tab`, `tabActive`, `tabInactive`, `tabDisabled` |
| Tab focus ring | `tabFocus` |
| Tab label text | `label`, `labelActive`, `labelInactive` |
| Tab icon | `icon`, `iconActive`, `iconInactive` |
| Count badge | `count`, `countActive`, `countInactive` |
| Active underline | `indicator` |
| Panel content | `panel` |

### Responsive sizing

Default tab list uses `overflow-x-auto` with `gap-4 sm:gap-6`. Tabs use `shrink-0` + `text-xs sm:text-sm` + `py-2.5 sm:py-3` for compact mobile sizing.

### Dark mode

Defaults use Tailwind `dark:` prefix. When overriding, always provide both variants.

---

## Patterns

### Controlled tabs

```tsx
const [active, setActive] = useState("home");
<TabPanel tabs={tabs} value={active} onValueChange={setActive} renderContent={...} />
```

### With icons and badges

```tsx
const tabs = [
  { id: "home", label: "Home", icon: HomeIcon, count: 3 },
  { id: "messages", label: "Messages", icon: MailIcon, count: 12 },
];
```

### Closable tabs

```tsx
<TabPanel tabs={tabs} closable onClose={(id) => setTabs(tabs.filter(t => t.id !== id))} />
```

### Vertical orientation

```tsx
<TabPanel tabs={tabs} orientation="vertical" />
```

---

## Accessibility

- `role="tablist"` with `aria-label`, `aria-orientation`
- `role="tab"` with `aria-selected`, `aria-controls`, `aria-disabled`
- `role="tabpanel"` with `aria-labelledby`
- Roving tabindex (one tabbable tab at a time)
- Arrow keys navigate tabs, Home/End jump
- Enter/Space activate in manual mode
- `focus-visible:ring-2` for keyboard focus
- Count badge has `aria-label="{count} items"`
- `aria-hidden="true"` on decorative indicator

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Styles wrong after overriding one class | `classes` replaces per slot | Provide full class string |
| Tabs overflow on mobile | Many tabs | Default includes `overflow-x-auto`; reduce tabs or use vertical |
| Panel content not rendering | Missing `renderContent` | Provide render function |
| Close button not showing | `closable` not set | Add `closable` prop |
| Tab not activating on arrow key | `activationMode="manual"` | User must press Enter/Space |
| Lazy panel not mounting | `lazyMount` enabled | Panel mounts on first activation |

---

## Demo Reference

**File:** `src/pages/demo/TabPanelDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Underlined | `title="Underlined Style"` |
| Pill style | `title="Pill Style"` |
| Boxed style | `title="Boxed Style"` |
| Icons left/right | `title="With Icons"` |
| Count badges | `title="With Count Badges"` |
| Tooltips | `title="With Tooltips"` |
| Disabled | `title="Disabled Tab"` |
| Gradient | `title="Gradient Style"` |
| Keyboard | `title="Keyboard Navigation"` |
| Dynamic tabs | `title="Dynamic Tabs"` |
| Vertical | `title="Vertical Orientation"` |
| Manual mode | `title="Manual Activation Mode"` |
| Custom rendering | `title="Custom Tab Rendering"` |
| Force/keep mount | `title="Force Mount"`, `title="Keep Mounted"` |
| Classes | `title="classes Record"` |

### Source file index

| File | Contains |
|------|----------|
| `TabPanel.tsx` | Main component, keyboard nav, tooltip integration |
| `components/TabButton.tsx` | Individual tab button with ARIA |
| `utils/types.ts` | TabPanelProps, TabPanelClasses, Tab, TabRenderProps |
| `utils/constants.ts` | DEFAULT + UNSTYLED class maps |
| `index.ts` | Public exports |
