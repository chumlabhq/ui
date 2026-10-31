import { ResizablePanel } from "@chumlab/ui/resizable-panel";

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
  return (
    <ResizablePanel
      defaultValue={280}
      minValue={150}
      maxValue={450}
      classes={
        {
          root: panelRootClass("blue"),
          handle: handleClass("blue")
        }
      }
    >
      <div className="p-4">
        <p className="font-medium text-cl-text">Uncontrolled Panel</p>
        <p className="text-sm mt-2 text-cl-text-tertiary">
          Started at 280px (no external state)
        </p>
      </div>
    </ResizablePanel>
  );
}
