# TabPanel

> Accessible tab panel with icons, badges, tooltips, vertical orientation, keep-mounted panels, and roving tabindex.

**Category:** Navigation
**Keywords:** tabs, tab panel, tabbed interface, navigation tabs, tab list, tab content, vertical tabs, keep mounted

---

## Quick Answer

Use `<TabPanel tabs={[...]} defaultValue="home">{(tab) => ...}</TabPanel>` for a tabbed interface — panel content is a children render function. Supports controlled/uncontrolled, icons, count badges, vertical orientation, manual activation, tooltips, and responsive horizontal scrolling. Works out-of-the-box with built-in Tailwind styles.

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
    <TabPanel tabs={tabs} defaultValue="home">
      {(tab) => <div style={{ padding: 16 }}>{tab.label} content</div>}
    </TabPanel>
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
| `children` | Render function `(tab) => ReactNode`. This is how panel content is rendered — not a `renderContent` prop or `content` on tab objects. |
| `renderTab` | Custom tab renderer. Receives `(props, defaultElement)`. |
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

<!-- generated from TabPanel.schema.json — edit the schema, not this table -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` **(required)** | array | — | Array of tab definitions. |
| `id` | string | — | HTML id attribute. |
| `value` | string | — | Controlled active tab ID. |
| `defaultValue` | string | — | Default uncontrolled active tab ID. |
| `onValueChange` | object | — | (tabId: string) => void — Callback fired when the active tab changes. |
| `children` | object | — | React.ReactNode \| ((tab: Tab) => ReactNode) — Tab panel content, either static or a render function. |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Layout orientation of the tab list. |
| `activationMode` | `"automatic"` \| `"manual"` | `"automatic"` | Whether tabs activate automatically on focus or require manual activation. |
| `loop` | boolean | `true` | Whether keyboard navigation loops from last tab to first. |
| `iconPosition` | `"left"` \| `"right"` | `"left"` | Position of tab icons relative to the label. |
| `showZeroCount` | boolean | `false` | Whether to show a count badge when the count is zero. |
| `alwaysShowLabels` | boolean | `true` | Whether to always show tab labels (even when icons are present). |
| `showTooltips` | boolean | `true` | Whether to show tooltips on tabs. |
| `tooltipPosition` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | `"bottom"` | Position of tab tooltips. |
| `tooltipOffset` | number | `4` | Offset distance for tab tooltips in pixels. |
| `disabled` | boolean | `false` | Whether the entire tab panel is disabled. |
| `reduceMotion` | boolean \| `"auto"` | — | Controls motion preferences. 'auto' respects the user's OS setting. |
| `unstyled` | boolean | `false` | When true, removes all default styling. |
| `renderTab` | object | — | (props: TabRenderProps, defaultElement: React.ReactElement) => ReactNode — Custom tab render function. |
| `aria-label` | string | — | Accessible label for the tab list. |
| `aria-labelledby` | string | — | ID of the element that labels the tab list. |
| `classes` | object | — | CSS class overrides for sub-elements. |
| `className` | string | — | CSS class for the root element. |
| `style` | object | — | Inline styles applied to the root element. |
| `forceMount` | boolean | `false` | Force mount all tab panels regardless of active state. |
| `keepMounted` | boolean | `false` | Keep previously mounted tab panels in the DOM. |

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
<TabPanel tabs={tabs} value={active} onValueChange={setActive}>{(tab) => ...}</TabPanel>
```

### With icons and badges

```tsx
const tabs = [
  { id: "home", label: "Home", icon: HomeIcon, count: 3 },
  { id: "messages", label: "Messages", icon: MailIcon, count: 12 },
];
```

### Keep panels mounted

```tsx
<TabPanel tabs={tabs} keepMounted>{(tab) => <Panel id={tab.id} />}</TabPanel>
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
| Panel content not rendering | Missing children render function | Pass `{(tab) => ...}` as children |
| Tab not activating on arrow key | `activationMode="manual"` | User must press Enter/Space |

---

## Demo Reference

**File:** `src/pages/demo/TabPanelDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Underlined | `title="Underlined Style"` |
| Pill style | `title="Pill Style"` |
| Boxed style | `title="Boxed Style"` |
| Icons left/right | `title="With Icons (Left)"` |
| Count badges | `title="With Count Badges (Hide Zero)"` |
| Tooltips | `title="With Tooltips (Bottom)"` |
| Disabled | `title="Disabled Tab"` |
| Gradient | `title="Gradient Style"` |
| Keyboard | `title="Keyboard Navigation"` |
| Dynamic tabs | `title="Dynamic Tabs (Add / Remove)"` |
| Vertical | `title="Vertical Orientation"` |
| Manual mode | `title="Manual Activation Mode"` |
| Custom rendering | `title="Custom Tab Rendering (renderTab)"` |
| Force/keep mount | `title="Force Mount (All Panels)"`, `title="Keep Mounted (Lazy Persist)"` |
| Classes | `title="classes Record"` |

### Source file index

| File | Contains |
|------|----------|
| `TabPanel.tsx` | Main component, keyboard nav, tooltip integration |
| `components/TabButton.tsx` | Individual tab button with ARIA |
| `utils/types.ts` | TabPanelProps, TabPanelClasses, Tab, TabRenderProps |
| `utils/constants.ts` | DEFAULT + UNSTYLED class maps |
| `index.ts` | Public exports |
