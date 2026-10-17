import { ResizablePanel } from "../../../components/ResizablePanel/index.js";
import type { Previews } from "./types.js";

function Phone() {
  return (
    <ResizablePanel
      defaultValue={200}
      minValue={120}
      maxValue={320}
      classes={{ root: "h-40 rounded-cl-md border border-cl-border bg-cl-bg-elevated" }}
    >
      <div className="h-full p-4 text-sm text-cl-text-secondary">Drag the edge to resize.</div>
    </ResizablePanel>
  );
}

export default { phone: Phone } satisfies Previews;
