"use client";

import { useState } from "react";
import { ResizablePanel } from "@chumlab/ui/resizable-panel";

const sidebarContent = () => (
    <div className="h-full p-4 flex flex-col gap-3">
      <div
        className={"text-xs font-semibold uppercase tracking-wider text-cl-accent"}
      >
        Sidebar
      </div>
      <div className="space-y-2">
        {["Dashboard", "Projects", "Team", "Settings"].map((item) => (
          <div
            key={item}
            className={"px-3 py-1.5 rounded-cl-md text-sm text-cl-text-secondary hover:bg-cl-text/4 cursor-pointer transition-colors"}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );

const handleClass = (_color: string) => {
    void _color;
    return "bg-cl-border hover:bg-cl-text/20 transition-colors motion-reduce:transition-none";
  };

const panelRootClass = (color: string) => {
    const base = "bg-cl-bg-elevated border border-cl-border";
    const map: Record<string, string> = {
      blue: `h-40 ${base} rounded-cl-md`,
      green: `h-40 ${base} rounded-cl-md`,
      purple: `${base} rounded-s-lg`,
      indigo: `${base} rounded-s-lg`,
      teal: `${base} rounded-e-lg`,
      amber: `h-40 ${base} rounded-cl-md`,
    };
    return map[color] ?? map.blue;
  };

export default function ResizablePanelExample() {
  const [rightWidth, setRightWidth] = useState(300);
  return (
    <ResizablePanel
      defaultValue={rightWidth}
      minValue={200}
      maxValue={500}
      onValueChange={setRightWidth}
      classes={
        {
          // Override h-40 from panelRootClass — the sidebar content
          // (eyebrow + 4 nav items + width footer) needs ~240px.
          root: `${panelRootClass("blue").replace("h-40", "h-60")}`,
          handle: handleClass("blue")
        }
      }
    >
      {sidebarContent()}
    </ResizablePanel>
  );
}
