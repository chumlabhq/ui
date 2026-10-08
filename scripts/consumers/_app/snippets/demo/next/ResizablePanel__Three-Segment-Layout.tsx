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
      purple: `${base} rounded-l-lg`,
      indigo: `${base} rounded-l-lg`,
      teal: `${base} rounded-r-lg`,
      amber: `h-40 ${base} rounded-cl-md`,
    };
    return map[color] ?? map.blue;
  };

export default function ResizablePanelExample() {
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(250);
  return (
    <div className="flex flex-col sm:flex-row h-auto sm:h-80 w-full">
      <ResizablePanel
        defaultValue={leftPanelWidth}
        minValue={150}
        maxValue={350}
        onValueChange={setLeftPanelWidth}
        aria-label="Resize left panel"
        classes={
          {
            root: `h-full ${panelRootClass("indigo")}`,
            handle: handleClass("indigo")
          }
        }
      >
        <div className="p-4 h-full flex flex-col">
          <p className="font-medium text-cl-accent">Left Panel</p>
          <p className="text-sm mt-2 text-cl-text-tertiary">
            Width:
            {Math.round(leftPanelWidth)}
            px
          </p>
          <div className="mt-4 flex-1 space-y-2">
            {
              [
                "Navigation Item 1",
                "Navigation Item 2",
                "Navigation Item 3"
              ].map((item) => (
                <div
                  key={item}
                  className="px-3 py-2 rounded-cl-md text-sm text-cl-text-secondary hover:bg-cl-bg-hover hover:text-cl-text transition-colors cursor-pointer"
                >
                  {item}
                </div>
              ))
            }
          </div>
        </div>
      </ResizablePanel>
      <div
        className="flex-1 p-4 flex flex-col border sm:border-x-0 sm:border-y bg-cl-bg-hover border-cl-border dark:bg-cl-bg-elevated dark:border"
      >
        <p className="font-medium text-cl-text">Center Panel</p>
        <p className="text-sm mt-2 text-cl-text-secondary">
          Flexible width &mdash; expands to fill available space
        </p>
        <div className="mt-4 flex-1 rounded border p-4 bg-cl-bg border-cl-border dark:border">
          <p className="text-sm text-cl-text-tertiary">Main content area</p>
        </div>
      </div>
      <ResizablePanel
        defaultValue={rightPanelWidth}
        minValue={150}
        maxValue={350}
        onValueChange={setRightPanelWidth}
        resizeDirection="left"
        aria-label="Resize right panel"
        classes={
          {
            root: `h-full ${panelRootClass("teal")}`,
            handle: handleClass("teal")
          }
        }
      >
        <div className="p-4 h-full flex flex-col">
          <p className="font-medium text-cl-accent">Right Panel</p>
          <p className="text-sm mt-2 text-cl-accent">
            Width:
            {Math.round(rightPanelWidth)}
            px
          </p>
          <div className="mt-4 flex-1 space-y-2">
            {
              ["Details Section", "Properties", "Actions"].map((item) => (
                <div
                  key={item}
                  className="px-3 py-2 rounded-cl-md text-sm text-cl-text-secondary hover:bg-cl-bg-hover hover:text-cl-text transition-colors cursor-pointer"
                >
                  {item}
                </div>
              ))
            }
          </div>
        </div>
      </ResizablePanel>
    </div>
  );
}
