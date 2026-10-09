import { useState } from "react";
import { Tab, TabPanel } from "@chumlab/ui/tab-panel";

const basicTabs: Tab[] = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export default function TabPanelExample() {
  const [pillTab, setPillTab] = useState("home");
  return (
    <TabPanel
      tabs={basicTabs}
      value={pillTab}
      onValueChange={setPillTab}
      classes={
        {
          root: "w-full",
          // Track uses a subtle wash (instead of bg-cl-bg-elevated) so the
          // active pill — which now uses bg-cl-bg-elevated in the dark theme —
          // has a distinct surface to stand out against.
          list: "inline-flex items-center gap-1 p-1 rounded-cl-md bg-cl-bg-hover",
          item: "px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-none rounded-cl-md outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg data-[state=active]:bg-cl-bg-panel data-[state=active]:text-cl-text data-[state=active]:shadow-sm data-[state=inactive]:text-cl-text-secondary data-[state=inactive]:hover:text-cl-text",
          content: "p-4 mt-2"
        }
      }
    >
      <div className="text-sm leading-relaxed text-cl-text-secondary">
        {
          pillTab === "home" &&
          "Your dashboard overview with key metrics, recent activity, and quick actions."
        }
        {
          pillTab === "profile" &&
          "Edit your display name, avatar, bio, and social links."
        }
        {
          pillTab === "settings" &&
          "Theme preferences, notification channels, and API key management."
        }
      </div>
    </TabPanel>
  );
}
