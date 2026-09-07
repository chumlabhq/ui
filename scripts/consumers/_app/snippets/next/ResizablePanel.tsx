import { ResizablePanel } from "@chumlab/ui/resizable-panel";

export default function Example() {
  return (
    <ResizablePanel defaultValue={300} minValue={150} maxValue={500}>
      <div style={{ padding: 16 }}>Drag the edge to resize.</div>
    </ResizablePanel>
  );
}
