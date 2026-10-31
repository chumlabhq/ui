"use client";

import { useState } from "react";
import { ResizablePanel } from "@chumlab/ui/resizable-panel";

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
  const [sidebarWidth, setSidebarWidth] = useState(250);
  return (
    <div className="flex flex-col sm:flex-row h-auto sm:h-64 w-full">
      <ResizablePanel
        defaultValue={sidebarWidth}
        minValue={150}
        maxValue={400}
        onValueChange={setSidebarWidth}
        aria-label="Resize sidebar"
        classes={
          {
            root: `h-full ${panelRootClass("purple")}`,
            handle: handleClass("purple")
          }
        }
      >
        <div className="p-4">
          <p className="font-medium text-cl-text">Sidebar</p>
          <p className="text-sm mt-2 text-cl-text-tertiary">
            Width:
            {Math.round(sidebarWidth)}
            px
          </p>
          <ul className="mt-4 space-y-1 text-sm">
            {
              ["Navigation 1", "Navigation 2", "Navigation 3"].map((item) => (
                <li
                  key={item}
                  className="px-2 py-1.5 rounded-cl-md text-cl-text-secondary hover:bg-cl-bg-hover hover:text-cl-text transition-colors cursor-pointer"
                >
                  {item}
                </li>
              ))
            }
          </ul>
        </div>
      </ResizablePanel>
      <div
        className="flex-1 p-4 rounded-b-lg sm:rounded-b-none sm:rounded-e-lg sm:border-s-0 bg-cl-bg-hover border border-cl-border"
      >
        <p className="font-medium text-cl-text">Main Content</p>
        <p className="text-sm mt-2 text-cl-text-secondary">
          This area expands as the sidebar shrinks.
        </p>
      </div>
    </div>
  );
}
