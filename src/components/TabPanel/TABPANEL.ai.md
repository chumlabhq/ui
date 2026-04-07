# TabPanel

> Accessible tab panel with icons, badges, tooltips, closable tabs, vertical orientation, lazy loading, and roving tabindex.

**Category:** Navigation
**Keywords:** tabs, tab panel, tabbed interface, navigation tabs, tab list, tab content

---

## Quick Answer

Use `<TabPanel tabs={[{ id: "home", label: "Home" }, ...]} defaultValue="home" />` with a `renderContent` function. Supports controlled/uncontrolled, icons, count badges, closable tabs, vertical orientation, and manual activation.

---

## Import

```tsx
import { TabPanel } from "@chumlab/ui/tab-panel";
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

## Prop Constraints

| Prop | Constraint |
|------|-----------|
| `tabs` | Array of `Tab` objects with `id` (required) and `label`. |
| `value` + `onValueChange` | Controlled mode. |
| `orientation` | `"horizontal"` (default) or `"vertical"`. |
| `activationMode` | `"automatic"` (default) or `"manual"` (requires Enter/Space to activate). |
| `closable` | When true, tabs show close button. Must handle `onClose`. |

---

## Accessibility

- `role="tablist"` on tab container, `role="tab"` on each tab, `role="tabpanel"` on content
- `aria-selected` on active tab
- `aria-controls` links tab to panel, `aria-labelledby` links panel to tab
- Roving tabindex: only active tab is tabbable
- Keyboard: Arrow keys navigate, Home/End, Enter/Space activate (manual mode)
- Focus ring via `focus-visible:ring-2`

---

## Demo Reference

**File:** `src/pages/demo/TabPanelDemo.tsx`

| Feature | Search for |
|---------|-----------|
| Basic | `title="Basic Usage"` |
| Underlined | `title="Underlined Style"` |
| Icons | `title="Icons"` |
| Closable | `title="Closable Tabs"` |
| Vertical | `title="Vertical"` |
| Lazy loading | `title="Lazy Loading"` |

| File | Contains |
|------|----------|
| `TabPanel.tsx` | Main component with keyboard nav, roving tabindex |
| `components/TabButton.tsx` | Individual tab button |
| `utils/types.ts` | TabPanelProps, TabPanelClasses, Tab |
| `utils/constants.ts` | DEFAULT + UNSTYLED classes |
