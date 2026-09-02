import { TabPanel } from "../../components/TabPanel";
import type { Fixtures } from "./types";
import { TABS } from "./_data";

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
];
export default fixtures;
