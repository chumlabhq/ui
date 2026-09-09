import { ResizablePanel } from "@chumlab/ui/resizable-panel";

const handleClass = (_color: string) => {
    void _color;
    return "bg-cl-border hover:bg-cl-text/20 transition-colors motion-reduce:transition-none";
  };

export default function ResizablePanelExample() {
  return (
    <ResizablePanel
      defaultValue={280}
      minValue={150}
      maxValue={450}
      className="h-32 rounded-cl-md"
      classes={
        {
          root: "bg-cl-bg-elevated border border-cl-border",
          handle: handleClass("blue")
        }
      }
    >
      <div className="p-4">
        <p className="font-medium text-cl-text">Both className and classes.root</p>
        <p className="text-sm mt-2 text-cl-text-tertiary">
          className=&quot;h-32 rounded-cl-md&quot; + classes.root=&quot;bg-cl-bg-elevated ...&quot;
        </p>
      </div>
    </ResizablePanel>
  );
}
