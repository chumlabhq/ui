"use client";

import { useState } from "react";
import { Slider, SliderValue } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [basic, setBasic] = useState(50);
  const [opacity, setOpacity] = useState(80);
  const [price, setPrice] = useState<SliderValue>([200, 800]);
  return (
    <div className="flex flex-col gap-10 w-full sm:max-w-sm">
                <div className="space-y-1">
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>On hover/drag</span>
                  <Slider value={basic} onValueChange={(v) => setBasic(v as number)} showTooltip classes={({
        root: "flex flex-col gap-2 w-full",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`,
        track: `rounded-full bg-cl-bg-hover dark:bg-cl-text/[0.12]`,
        range: "rounded-full bg-cl-accent",
        thumb: `absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-white dark:focus-visible:ring-offset-cl-bg`
      })} />
                </div>
                <div className="space-y-1">
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>Always visible</span>
                  <Slider value={opacity} onValueChange={(v) => setOpacity(v as number)} showTooltip tooltipAlways formatTooltip={(v) => `${v}%`} classes={({
        root: "flex flex-col gap-2 w-full",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`,
        track: `rounded-full bg-cl-bg-hover dark:bg-cl-text/[0.12]`,
        range: "rounded-full bg-cl-accent",
        thumb: `absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-white dark:focus-visible:ring-offset-cl-bg`
      })} />
                </div>
                <div className="space-y-1">
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>Custom format (range)</span>
                  <Slider
                    value={price}
                    onValueChange={setPrice}
                    min={0}
                    max={1000}
                    step={10}
                    showTooltip
                    formatTooltip={(v) => `$${v}`}
                    classes={({
        root: "flex flex-col gap-2 w-full",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`,
        track: `rounded-full bg-cl-bg-hover dark:bg-cl-text/[0.12]`,
        range: "rounded-full bg-cl-accent",
        thumb: `absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-white dark:focus-visible:ring-offset-cl-bg`
      })}
                  />
                </div>
              </div>
  );
}
