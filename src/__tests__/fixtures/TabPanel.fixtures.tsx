import type { Fixtures } from "./types";
import { TABS } from "./_data";

const fixtures: Fixtures = [
  { name: "default", props: { tabs: TABS } },
  { name: "vertical", props: { tabs: TABS, orientation: "vertical" } },
  { name: "second-active", props: { tabs: TABS, defaultValue: "two" } },
  { name: "with-tooltips", props: { tabs: TABS.map((t) => ({ ...t, tooltip: "Tip" })), showTooltips: true } },
  { name: "kept-mounted", props: { tabs: TABS, keepMounted: true } },
];
export default fixtures;
