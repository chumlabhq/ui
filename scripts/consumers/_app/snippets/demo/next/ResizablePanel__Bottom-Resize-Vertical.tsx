"use client";

import { useState } from "react";
import { ResizablePanel } from "@chumlab/ui/resizable-panel";

const editorContent = (height: number) => (
    <div className="h-full p-4 flex flex-col gap-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary">
        Editor
      </div>
      <div className="flex-1 rounded-cl-md p-3 font-mono text-xs leading-relaxed bg-cl-bg border border-cl-border text-cl-text-secondary">
        <div><span className="text-cl-text-tertiary">const</span> app = <span className="text-cl-text-tertiary">express</span>();</div>
        <div>app.<span className="text-cl-text-tertiary">get</span>(<span className="text-cl-accent">'/'</span>, handler);</div>
        <div>app.<span className="text-cl-text-tertiary">listen</span>(<span className="text-cl-accent">3000</span>);</div>
      </div>
      <div className="text-[10px] font-mono text-cl-text-tertiary tabular-nums">
        {Math.round(height)}px
      </div>
    </div>
  );

const handleClass = (_color: string) => {
    void _color;
    return "bg-cl-border hover:bg-cl-text/20 transition-colors motion-reduce:transition-none";
  };

export default function ResizablePanelExample() {
  const [bottomHeight, setBottomHeight] = useState(200);
  return (
    <ResizablePanel
      defaultValue={bottomHeight}
      minValue={100}
      maxValue={400}
      resizeDirection="bottom"
      onValueChange={setBottomHeight}
      classes={
        {
          root: "w-full bg-cl-bg-elevated rounded-cl-md border border-cl-border",
          handle: handleClass("blue")
        }
      }
    >
      {editorContent(bottomHeight)}
    </ResizablePanel>
  );
}
