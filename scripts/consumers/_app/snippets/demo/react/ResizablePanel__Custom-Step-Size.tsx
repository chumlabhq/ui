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
  const [customStepWidth, setCustomStepWidth] = useState(300);
  return (
    <div className="w-full space-y-4">
      <div
        className="mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent"
      >
        Tab to the handle, then use arrow keys. Each press moves
        {" "}
        <strong>25px</strong>
        (Shift+Arrow: 125px).
      </div>
      <ResizablePanel
        defaultValue={customStepWidth}
        minValue={100}
        maxValue={500}
        step={25}
        onValueChange={setCustomStepWidth}
        classes={
          {
            root: panelRootClass("amber"),
            handle: handleClass("amber")
          }
        }
      >
        {simpleContent("amber", "Step: 25px", customStepWidth)}
      </ResizablePanel>
    </div>
  );
}
