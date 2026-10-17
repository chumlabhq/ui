import { TabPanel } from "../../../components/TabPanel/index.js";
import type { Previews } from "./types.js";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "members", label: "Members" },
  { id: "settings", label: "Settings" },
  { id: "billing", label: "Billing" },
];

function Phone() {
  return <TabPanel tabs={TABS}>{(tab) => <p className="pt-4 text-sm text-cl-text-secondary">{tab.label} panel</p>}</TabPanel>;
}

export default { phone: Phone } satisfies Previews;
