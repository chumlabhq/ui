import { useRef, useState } from "react";
import { ResizablePanel } from "@chumlab/ui/resizable-panel";

const simpleContent = (color: string, label: string, size: number) => {
    const cl = {
      blue: {
        text: "text-cl-accent",
        muted: "text-cl-accent",
      },
      green: {
        text: "text-cl-success",
        muted: "text-cl-success",
      },
      amber: {
        text: "text-cl-warning",
        muted: "text-cl-warning",
      },
      indigo: {
        text: "text-cl-accent",
        muted: "text-cl-accent",
      },
      teal: {
        text: "text-cl-accent",
        muted: "text-cl-accent",
      },
      purple: {
        text: "text-cl-accent",
        muted: "text-cl-accent",
      },
    }[color] ?? {
      text: "text-cl-text-secondary",
      muted: "text-cl-text-tertiary",
    };
    return (
      <div className="h-full p-4 flex flex-col justify-between">
        <div
          className={`text-xs font-semibold uppercase tracking-wider ${cl.text}`}
        >
          {label}
        </div>
        <div className={`text-[10px] font-mono ${cl.muted}`}>
          {Math.round(size)}px
        </div>
      </div>
    );
  };

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
  const [callbackWidth, setCallbackWidth] = useState(300);
  const [callbackLog, setCallbackLog] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const addLog = (msg: string) => {
    setCallbackLog((prev) => [...prev.slice(-4), msg]);
    requestAnimationFrame(() => {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    });
  };
  return (
    <div className="w-full space-y-4">
      <ResizablePanel
        defaultValue={callbackWidth}
        minValue={200}
        maxValue={500}
        onValueChange={setCallbackWidth}
        onResizeStart={
          (w) =>
          addLog(
            `[${new Date().toLocaleTimeString()}] onResizeStart \u2192 ${Math.round(w)}px`,
          )
        }
        onResizeEnd={
          (w) =>
          addLog(
            `[${new Date().toLocaleTimeString()}] onResizeEnd \u2192 ${Math.round(w)}px`,
          )
        }
        classes={
          {
            root: panelRootClass("blue"),
            handle: handleClass("blue")
          }
        }
      >
        {simpleContent("blue", "Resize me", callbackWidth)}
      </ResizablePanel>
      <div
        ref={logRef}
        className="h-28 overflow-y-auto rounded-cl-md border p-3 font-mono text-xs bg-cl-bg-recessed border-cl-border text-cl-text-secondary"
      >
        {
          callbackLog.length === 0 ? (
            <span className="text-cl-text-tertiary">
              Drag the handle to see resize events...
            </span>
          ) : (
            callbackLog.map((msg, i) => (
              <div key={i}>
                {msg}
              </div>
            ))
          )
        }
      </div>
    </div>
  );
}
