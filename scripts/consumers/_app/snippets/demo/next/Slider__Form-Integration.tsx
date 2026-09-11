"use client";

import { useState } from "react";
import { Slider } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [opacity2, setOpacity2] = useState(80);
  const [opacity, setOpacity] = useState(80);
  return (
    <div className="w-full sm:max-w-sm space-y-3">
      <Slider
        name="brightness"
        label="Brightness"
        value={opacity2}
        onValueChange={(v) => setOpacity2(v as number)}
        required
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
        formatTooltip={(v) => `${v}%`}
      />
      <div
        className="mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent"
      >
        Hidden input:
        <code>
          name="brightness" value="
          {opacity}
          "
        </code>
      </div>
    </div>
  );
}
