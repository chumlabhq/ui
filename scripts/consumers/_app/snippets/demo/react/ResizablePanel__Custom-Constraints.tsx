import { useState } from "react";
import { ResizablePanel } from "@chumlab/ui/resizable-panel";

const simpleContent = (color: string, label: string, size: number) => {
    const cl = {
      blue: {
        text: false ? "text-cl-accent" : "text-cl-accent",
        muted: false ? "text-cl-accent/60" : "text-cl-accent/60",
      },
      green: {
        text: false ? "text-cl-success" : "text-cl-success",
        muted: false ? "text-cl-success/60" : "text-cl-success/60",
      },
      amber: {
        text: false ? "text-cl-warning" : "text-cl-warning",
        muted: false ? "text-cl-warning/60" : "text-cl-warning/60",
      },
      indigo: {
        text: false ? "text-cl-accent" : "text-cl-accent",
        muted: false ? "text-cl-accent/60" : "text-cl-accent/60",
      },
      teal: {
        text: false ? "text-cl-accent" : "text-cl-accent",
        muted: false ? "text-cl-accent/60" : "text-cl-accent/60",
      },
      purple: {
        text: false ? "text-cl-accent" : "text-cl-accent",
        muted: false ? "text-cl-accent/60" : "text-cl-accent/60",
      },
    }[color] ?? {
      text: false ? "text-cl-text-tertiary" : "text-cl-text-secondary",
      muted: false ? "text-cl-text-tertiary" : "text-cl-text-tertiary",
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
  const [constrainedWidth, setConstrainedWidth] = useState(250);
  return (
    <ResizablePanel
                defaultValue={constrainedWidth}
                minValue={180}
                maxValue={400}
                onValueChange={setConstrainedWidth}
                classes={{
                  root: panelRootClass("amber"),
                  handle: handleClass("amber")
                }}
              >
                {simpleContent("amber", "Constrained", constrainedWidth)}
              </ResizablePanel>
  );
}
