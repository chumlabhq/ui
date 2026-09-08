import { useState } from "react";
import { Tab, TabPanel } from "@chumlab/ui/tab-panel";

const basicTabs: Tab[] = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export default function TabPanelExample() {
  const [boxedTab, setBoxedTab] = useState("home");
  return (
    <TabPanel
                tabs={basicTabs}
                value={boxedTab}
                onValueChange={setBoxedTab}
                classes={{
                  root: "w-full",
                  list: `flex items-center border-b border-cl-border`,
                  item: "relative px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border border-transparent border-b-0 -mb-px",
     content: `p-4 border-t-0 rounded-b-lg border border-cl-border bg-white dark:border dark:border-cl-border dark:bg-cl-bg-elevated`
                }}
              >
                <div className={"text-sm leading-relaxed text-cl-text-secondary"}>
                  {boxedTab === "home" &&
                    "Boxed tabs work well for document-style interfaces where the active panel needs a clear visual boundary."}
                  {boxedTab === "profile" &&
                    "User profile information, team membership, and activity history."}
                  {boxedTab === "settings" &&
                    "Workspace configuration, billing, and access control settings."}
                </div>
              </TabPanel>
  );
}
