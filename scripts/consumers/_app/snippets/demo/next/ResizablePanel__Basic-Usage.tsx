import { ResizablePanel } from "@chumlab/ui/resizable-panel";

export default function ResizablePanelExample() {
  return (
    <>
      <ResizablePanel defaultValue={300} minValue={150} maxValue={500}>
        <div className="h-full p-4">
          <div className="text-sm text-cl-text-secondary">Drag the edge to resize.</div>
        </div>
      </ResizablePanel>
    </>
  );
}
