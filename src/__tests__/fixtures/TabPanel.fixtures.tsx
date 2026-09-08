import { TabPanel } from "../../components/TabPanel/index.js";
import type { Fixtures } from "./types.js";
import { motionOverrides } from "./_motion.js";
import { TABS } from "./_data.js";

/** A shape rather than a glyph: the fixture is about placement, not iconography. */
const CircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <circle cx="8" cy="8" r="6" />
  </svg>
);

const fixtures: Fixtures<typeof TabPanel> = [
  { name: "default", props: { tabs: TABS }, children: (tab) => `${tab.label} panel` },
  { name: "vertical", props: { tabs: TABS, orientation: "vertical" } },
  { name: "second-active", props: { tabs: TABS, defaultValue: "two" } },
  { name: "with-tooltips", props: { tabs: TABS.map((t) => ({ ...t, tooltip: "Tip" })), showTooltips: true } },
  { name: "kept-mounted", props: { tabs: TABS, keepMounted: true } },
  {
    name: "inactive-count",
    props: {
      tabs: [
        { id: "one", label: "First", count: 3 },
        { id: "two", label: "Second", count: 12 },
      ],
      defaultValue: "two",
    },
    note: "The only fixture that renders `countInactive`. TABS gives its count to the tab that is active by default, so the inactive badge never appeared — which is how its contrast went unaudited.",
  },
  {
    name: "icon-left",
    props: {
      tabs: TABS.map((t) => ({ ...t, icon: <CircleIcon /> })),
      iconPosition: "left" as const,
    },
    note: "The first fixture to give a tab an icon. `iconPosition` had never been rendered by any fixture, so it was in the 151 props whose markup no gate had seen — and it had never worked: the tab button had no flex layout, so the icon sat above the label in both positions rather than beside it.",
  },
  {
    name: "icon-right",
    props: {
      tabs: TABS.map((t) => ({ ...t, icon: <CircleIcon /> })),
      iconPosition: "right" as const,
    },
  },
];
export default [...fixtures, ...motionOverrides(fixtures[0])];
