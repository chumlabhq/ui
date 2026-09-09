"use client";

import { useState } from "react";
import { Slider } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [controlled, setControlled] = useState(30);
  return (
    <div className="w-full sm:max-w-sm space-y-4">
      <Slider
        value={controlled}
        onValueChange={(v) => setControlled(v as number)}
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
      <div className="flex gap-2 flex-wrap">
        {
          [0, 25, 50, 75, 100].map((v) => (
            <button
              key={v}
              type="button"
              className={controlled === v ? "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90" : "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
              onClick={() => setControlled(v)}
            >
              {v}
            </button>
          ))
        }
      </div>
      <div className="text-sm text-cl-text-secondary">
        Value:
        <span
          className="inline-flex px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-cl-bg-hover text-cl-text border border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text-secondary dark:border dark:border-cl-text/10"
        >
          {controlled}
        </span>
      </div>
    </div>
  );
}
