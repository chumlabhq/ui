"use client";

import { useState } from "react";
import { ResizablePanel } from "@chumlab/ui/resizable-panel";

const simpleContent = (color: string, label: string, size: number) => {
    const cl = {
      blue: {
        text: "text-cl-accent",
        muted: "text-cl-accent",
      },
      green: {
        text: "text-cl-success",
        muted: "text-cl-success",
      },
      amber: {
        text: "text-cl-warning",
        muted: "text-cl-warning",
      },
      indigo: {
        text: "text-cl-accent",
        muted: "text-cl-accent",
      },
      teal: {
        text: "text-cl-accent",
        muted: "text-cl-accent",
      },
      purple: {
        text: "text-cl-accent",
        muted: "text-cl-accent",
      },
    }[color] ?? {
      text: "text-cl-text-secondary",
      muted: "text-cl-text-tertiary",
    };
    return (
      <div className="h-full p-4 flex flex-col justify-between">
        <div
          className={`text-xs font-semibold uppercase tracking-wider ${cl.text}`}
        >
          {label}
        </div>
        <div className={`text-[10px] font-mono ${cl.muted}`}>
          {Math.round(size)}px
        </div>
      </div>
    );
  };

const handleClass = (_color: string) => {
    void _color;
    return "bg-cl-border hover:bg-cl-text/20 transition-colors motion-reduce:transition-none";
  };

export default function ResizablePanelExample() {
  const [topHeight, setTopHeight] = useState(200);
  return (
    <div className="flex items-end w-full" style={{ minHeight: 420 }}>
      <ResizablePanel
        defaultValue={topHeight}
        minValue={100}
        maxValue={400}
        resizeDirection="top"
        onValueChange={setTopHeight}
        classes={
          {
            root: "w-full bg-cl-bg-elevated rounded-cl-md border border-cl-border",
            handle: handleClass("green")
          }
        }
      >
        {simpleContent("green", "Terminal", topHeight)}
      </ResizablePanel>
    </div>
  );
}
