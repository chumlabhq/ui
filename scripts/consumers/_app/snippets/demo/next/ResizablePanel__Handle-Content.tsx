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
      purple: `${base} rounded-l-lg`,
      indigo: `${base} rounded-l-lg`,
      teal: `${base} rounded-r-lg`,
      amber: `h-40 ${base} rounded-cl-md`,
    };
    return map[color] ?? map.blue;
  };

export default function ResizablePanelExample() {
  return (
    <ResizablePanel
                defaultValue={300}
                minValue={200}
                maxValue={500}
                classes={{
                  root: panelRootClass("blue"),
                  handle: `${handleClass("blue")} flex items-center justify-center`
                }}
                handleContent={
                  <svg
                    width="4"
                    height="16"
                    viewBox="0 0 4 16"
                    fill="currentColor"
                    className={false ? "text-cl-accent" : "text-cl-accent"}
                    aria-hidden="true"
                  >
                    <circle cx="2" cy="2" r="1.5" />
                    <circle cx="2" cy="8" r="1.5" />
                    <circle cx="2" cy="14" r="1.5" />
                  </svg>
                }
              >
                <div className="p-4">
                  <p
                    className="font-medium text-cl-text"
                  >
                    Panel with Grip Handle
                  </p>
                  <p
                    className="text-sm mt-2 text-cl-text-tertiary"
                  >
                    Three-dot grip icon rendered inside the handle
                  </p>
                </div>
              </ResizablePanel>
  );
}
