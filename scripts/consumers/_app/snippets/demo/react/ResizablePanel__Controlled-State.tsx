import { useState } from "react";
import { ResizablePanel } from "@chumlab/ui/resizable-panel";

const simpleContent = (color: string, label: string, size: number) => {
    const cl = {
      blue: {
        text: "text-cl-accent",
        muted: "text-cl-accent/60",
      },
      green: {
        text: "text-cl-success",
        muted: "text-cl-success/60",
      },
      amber: {
        text: "text-cl-warning",
        muted: "text-cl-warning/60",
      },
      indigo: {
        text: "text-cl-accent",
        muted: "text-cl-accent/60",
      },
      teal: {
        text: "text-cl-accent",
        muted: "text-cl-accent/60",
      },
      purple: {
        text: "text-cl-accent",
        muted: "text-cl-accent/60",
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
  const [controlledWidth, setControlledWidth] = useState(320);
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium whitespace-nowrap text-cl-text-secondary">
          Width:
          {controlledWidth}
          px
        </label>
        <input
          type="range"
          min={150}
          max={500}
          value={controlledWidth}
          onChange={(e) => setControlledWidth(Number(e.target.value))}
          className="flex-1"
          aria-label="Panel width"
        />
        <button
          type="button"
          onClick={() => setControlledWidth(320)}
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90"
        >
          Reset
        </button>
      </div>
      <ResizablePanel
        value={controlledWidth}
        onValueChange={setControlledWidth}
        minValue={150}
        maxValue={500}
        classes={
          {
            root: panelRootClass("blue"),
            handle: handleClass("blue")
          }
        }
      >
        {simpleContent("blue", "Controlled", controlledWidth)}
      </ResizablePanel>
    </div>
  );
}
