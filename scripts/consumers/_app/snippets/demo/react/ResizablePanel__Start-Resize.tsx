import { useState } from "react";
import { ResizablePanel } from "@chumlab/ui/resizable-panel";

const previewContent = (width: number) => (
    <div className="h-full p-4 flex flex-col gap-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary">
        Preview
      </div>
      <div className="flex-1 rounded-cl-md flex items-center justify-center bg-cl-bg border border-cl-border">
        <div className="text-center">
          <div className="text-sm font-medium text-cl-text">Preview</div>
          <div className="text-[11px] mt-1 text-cl-text-tertiary">Live output here</div>
        </div>
      </div>
      <div className="text-[10px] font-mono text-cl-text-tertiary tabular-nums">
        {Math.round(width)}px
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
  const [leftWidth, setLeftWidth] = useState(350);
  return (
    <div className="flex justify-end w-full">
      <ResizablePanel
        defaultValue={leftWidth}
        minValue={200}
        maxValue={600}
        onValueChange={setLeftWidth}
        resizeDirection="start"
        classes={
          {
            root: panelRootClass("green"),
            handle: handleClass("green")
          }
        }
      >
        {previewContent(leftWidth)}
      </ResizablePanel>
    </div>
  );
}
