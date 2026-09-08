"use client";

import { useState } from "react";
import { Slider, SliderValue } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [range, setRange] = useState<SliderValue>([25, 75]);
  return (
    <div className="flex flex-col gap-6 w-full sm:max-w-sm">
                {[
                  { range: "bg-cl-success", border: "border-cl-success", ring: "ring-cl-success", name: "Emerald", val: 65 },
                  { range: "bg-cl-accent", border: "border-cl-border-input-focus", ring: "ring-cl-accent", name: "Rose", val: 45 },
                  { range: "bg-cl-warning", border: "border-cl-warning", ring: "ring-cl-warning", name: "Amber", val: 80 },
                  { range: "bg-cl-accent", border: "border-cl-border-input-focus", ring: "ring-cl-accent", name: "Cyan", val: 30 }
                ].map(({ range: rangeCls, border, ring, name, val }) => (
                  <div key={name} className="space-y-1">
                    <span className={"text-xs font-medium text-cl-text-tertiary"}>{name}</span>
                    <Slider
                      defaultValue={val}
                      classes={{
                        ...({
        root: "flex flex-col gap-2 w-full",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`,
        track: `rounded-full bg-cl-bg-hover dark:bg-cl-text/[0.12]`,
        range: "rounded-full bg-cl-accent",
        thumb: `absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-white dark:focus-visible:ring-offset-cl-bg`
      }),
                        range: `rounded-full ${rangeCls}`,
                        thumb: `absolute rounded-full bg-white ${border} shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:${ring} focus-visible:ring-offset-2 hover:shadow-lg cursor-grab dark:focus-visible:ring-offset-cl-bg`
                      }}
                    />
                  </div>
                ))}
              </div>
  );
}
