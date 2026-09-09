"use client";

import { useState } from "react";
import { Slider, SliderValue } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [minDist, setMinDist] = useState<SliderValue>([20, 80]);
  return (
    <div className="w-full sm:max-w-sm space-y-3">
      <Slider
        value={minDist}
        onValueChange={setMinDist}
        minStepsBetweenThumbs={10}
        showTooltip
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
      <div className="text-xs text-cl-text-secondary">
        Min gap: 10 — Values:
        {(minDist as [number, number]).join(" – ")}
      </div>
    </div>
  );
}
