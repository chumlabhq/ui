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
          root: "h-32 rounded-cl-md border bg-linear-to-r from-cl-accent/10 to-cl-accent/10 border-cl-border-input-focus dark:bg-linear-to-r dark:from-cl-accent/60 dark:to-cl-accent/60 dark:border",
          handle: "rounded-full bg-linear-to-b from-cl-accent/30 to-cl-accent/30 hover:from-cl-accent hover:to-cl-accent dark:bg-linear-to-b dark:from-cl-accent dark:to-cl-accent dark:hover:from-cl-accent/30 dark:hover:to-cl-accent/30 transition-colors"
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
