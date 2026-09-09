"use client";

import { useState } from "react";
import { Slider, SliderValue } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [range, setRange] = useState<SliderValue>([25, 75]);
  return (
    <div className="w-full sm:max-w-sm space-y-3">
      <Slider
        value={range}
        onValueChange={setRange}
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
      />
      <div className="text-sm text-cl-text-secondary">
        Range:
        <span
          className="inline-flex px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-cl-bg-hover text-cl-text border border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text-secondary dark:border dark:border-cl-text/10"
        >
          {(range as [number, number])[0]}
        </span>
        –
        <span
          className="inline-flex px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-cl-bg-hover text-cl-text border border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text-secondary dark:border dark:border-cl-text/10"
        >
          {(range as [number, number])[1]}
        </span>
      </div>
    </div>
  );
}
