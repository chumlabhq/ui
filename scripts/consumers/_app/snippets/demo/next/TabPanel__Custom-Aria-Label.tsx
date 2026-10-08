import { Tab, TabPanel } from "@chumlab/ui/tab-panel";

const basicTabs: Tab[] = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export default function TabPanelExample() {
  return (
    <TabPanel
      tabs={basicTabs}
      defaultValue="home"
      aria-label="Main navigation tabs"
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
        (tab) => (
          <div className={"text-sm leading-relaxed text-cl-text-secondary"}>
            The tablist has{" "}
            <code
              className={"px-1 rounded text-xs font-mono bg-cl-bg-elevated text-cl-text-secondary"}
            >
              aria-label=&quot;Main navigation tabs&quot;
            </code>{" "}
            &mdash; currently on:{" "}
            <strong className={"font-medium text-cl-text"}>{tab.label}</strong>
          </div>
        )
      }
    </TabPanel>
  );
}
