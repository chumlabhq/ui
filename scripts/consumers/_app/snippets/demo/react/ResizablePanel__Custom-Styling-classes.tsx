import { useState } from "react";
import { ResizablePanel } from "@chumlab/ui/resizable-panel";

export default function ResizablePanelExample() {
  const [styledWidth, setStyledWidth] = useState(300);
  return (
    <ResizablePanel
      defaultValue={styledWidth}
      minValue={200}
      maxValue={500}
      onValueChange={setStyledWidth}
      classes={
        {
          root: "h-32 rounded-cl-md border bg-linear-to-r from-cl-accent-surface to-cl-accent-surface border-cl-border-input-focus",
          handle: "rounded-full bg-linear-to-b from-cl-accent to-cl-accent hover:from-cl-accent-hover hover:to-cl-accent-hover transition-colors"
        }
      }
    >
      <div className="p-4">
        <p className="font-medium text-cl-text">Gradient Styling</p>
        <p className="text-sm mt-2 text-cl-text-tertiary">
          Custom handle and root styles via classes
        </p>
      </div>
    </ResizablePanel>
  );
}
