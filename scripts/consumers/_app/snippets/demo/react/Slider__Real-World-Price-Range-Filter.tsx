import { useState } from "react";
import { Slider, SliderValue } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [price2, setPrice2] = useState<SliderValue>([200, 800]);
  const [price, setPrice] = useState<SliderValue>([200, 800]);
  return (
    <div className="w-full sm:max-w-md space-y-4">
      <Slider
        label="Price Range"
        value={price2}
        onValueChange={setPrice2}
        min={0}
        max={1000}
        step={10}
        showTooltip
        tooltipAlways
        formatTooltip={(v) => `$${v}`}
        marks={
          [
            { value: 0, label: "$0" },
            { value: 250, label: "$250" },
            { value: 500, label: "$500" },
            { value: 750, label: "$750" },
            { value: 1000, label: "$1k" }
          ]
        }
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
      <div className="flex justify-between text-sm text-cl-text-secondary">
        <span>
          Min:
          <span
            className="inline-flex px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-cl-bg-hover text-cl-text border border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text-secondary dark:border dark:border-cl-text/10"
          >
            $
            {(price as [number, number])[0]}
          </span>
        </span>
        <span>
          Max:
          <span
            className="inline-flex px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-cl-bg-hover text-cl-text border border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text-secondary dark:border dark:border-cl-text/10"
          >
            $
            {(price as [number, number])[1]}
          </span>
        </span>
      </div>
    </div>
  );
}
