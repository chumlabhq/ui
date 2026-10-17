import { ResizablePanel } from "@chumlab/ui/resizable-panel";

export default function ResizablePanelExample() {
  return (
    <ResizablePanel
      defaultValue={260}
      minValue={160}
      maxValue={480}
      classes={{ root: "h-48 rounded-cl-md border border-cl-border bg-cl-bg-elevated" }}
    >
      <div className="h-full overflow-y-auto p-4 text-sm text-cl-text-secondary">
        Release notes for version 4.2: saved filters now sync across devices, exports include hidden columns when you ask for them, and the activity feed groups repeated edits by the same person into a single entry.
      </div>
    </ResizablePanel>
  );
}
