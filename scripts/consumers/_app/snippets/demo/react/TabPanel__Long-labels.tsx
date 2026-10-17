import { TabPanel } from "@chumlab/ui/tab-panel";

export default function TabPanelExample() {
  return (
    <div className="w-full max-w-md">
      <TabPanel
        tabs={
          [
            { id: "overview", label: "Overview" },
            { id: "history", label: "Order history and returns" },
            { id: "preferences", label: "Communication preferences" },
            { id: "security", label: "Security and signed-in devices" }
          ]
        }
      >
        {(tab) => <p className="pt-4 text-sm text-cl-text-secondary">{tab.label}</p>}
      </TabPanel>
    </div>
  );
}
