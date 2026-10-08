import { useState } from "react";
import { Tab, TabPanel } from "@chumlab/ui/tab-panel";

const basicTabs: Tab[] = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export default function TabPanelExample() {
  const [underlinedTab, setUnderlinedTab] = useState("home");
  return (
    <TabPanel
      tabs={basicTabs}
      value={underlinedTab}
      onValueChange={setUnderlinedTab}
      classes={
        {
          root: "w-full",
          list: "flex items-center gap-6 border-b border-cl-border",
          item: "relative px-1 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg data-[state=active]:text-cl-accent data-[state=inactive]:text-cl-text-secondary data-[state=inactive]:hover:text-cl-text",
          indicator: "absolute bottom-0 left-0 right-0 h-0.5 bg-cl-accent",
          content: "p-4"
        }
      }
    >
      {
        underlinedTab === "home" && (
          <div className="space-y-3">
            <p className="text-base font-semibold mb-1 text-cl-text">Welcome back</p>
            <p className="text-sm leading-relaxed text-cl-text-secondary">
              Here's what's happening with your projects today. You have 3 tasks due and 2 messages waiting.
            </p>
            <div className="flex gap-4 mt-2">
              {
                [
                  ["12", "Active projects"],
                  ["3", "Due today"],
                  ["98%", "Uptime"]
                ].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-bold text-cl-text">
                      {v}
                    </div>
                    <div className="text-xs text-cl-text-secondary">
                      {l}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )
      }
      {
        underlinedTab === "profile" && (
          <div className="space-y-2">
            <p className="text-base font-semibold mb-1 text-cl-text">Profile settings</p>
            <p className="text-sm leading-relaxed text-cl-text-secondary">
              Manage your account details, notification preferences, and connected integrations.
            </p>
          </div>
        )
      }
      {
        underlinedTab === "settings" && (
          <div className="space-y-2">
            <p className="text-base font-semibold mb-1 text-cl-text">General settings</p>
            <p className="text-sm leading-relaxed text-cl-text-secondary">
              Configure language, timezone, theme, and default workspace options.
            </p>
          </div>
        )
      }
    </TabPanel>
  );
}
