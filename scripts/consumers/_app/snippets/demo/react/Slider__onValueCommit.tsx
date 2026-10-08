import { useState } from "react";
import { Slider } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [commitVal, setCommitVal] = useState(50);
  const [lastCommit, setLastCommit] = useState(50);
  return (
    <div className="w-full sm:max-w-sm space-y-3">
      <Slider
        value={commitVal}
        onValueChange={(v) => setCommitVal(v as number)}
        onValueCommit={(v) => setLastCommit(v as number)}
        classes={
          {
            root: "flex flex-col gap-2 w-full",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary",
            track: "rounded-full bg-cl-bg-hover dark:bg-cl-text/[0.12]",
            range: "rounded-full bg-cl-accent",
            thumb: "absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-white dark:focus-visible:ring-offset-cl-bg"
          }
        }
        showTooltip
      />
      <div className="text-sm text-cl-text-secondary">
        Live:
        <span
          className="inline-flex px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-cl-bg-hover text-cl-text-chrome border border-cl-text/10 dark:bg-cl-bg-elevated dark:border"
        >
          {commitVal}
        </span>
        {" "}
        Committed:
        <span
          className="inline-flex px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-cl-bg-hover text-cl-text-chrome border border-cl-text/10 dark:bg-cl-bg-elevated dark:border"
          data-demo-action
        >
          {lastCommit}
        </span>
      </div>
    </div>
  );
}
