"use client";

import { useState } from "react";
import { Tab, TabPanel } from "@chumlab/ui/tab-panel";

const basicTabs: Tab[] = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export default function TabPanelExample() {
  const [classesTab, setClassNamesTab] = useState("home");
  return (
    <TabPanel
      tabs={basicTabs}
      value={classesTab}
      onValueChange={setClassNamesTab}
      classes={
        {
          root: "w-full",
          list: "flex items-center gap-6 border-b border-cl-border",
          item: "relative px-1 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg data-[state=active]:text-cl-accent data-[state=inactive]:text-cl-text-secondary data-[state=inactive]:hover:text-cl-text",
          indicator: "absolute bottom-0 left-0 right-0 h-0.5 bg-cl-accent dark:bg-cl-accent/90",
          content: "p-4"
        }
      }
    >
      <div className="text-sm leading-relaxed text-cl-text-secondary">
        All styles via
        {" "}
        <strong className="font-medium text-cl-text">classes</strong>
        record for
        {" "}
        <strong className="font-medium text-cl-text">
          {classesTab}
        </strong>
      </div>
    </TabPanel>
  );
}
