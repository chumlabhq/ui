import { useState } from "react";
import { Button } from "@chumlab/ui/button";
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
            track: "rounded-full bg-cl-bg-track",
            range: "rounded-full bg-cl-accent",
            thumb: "absolute rounded-full bg-white shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg"
          }
        }
        showTooltip
      />
      <div className="flex gap-2 flex-wrap">
        {
          [0, 25, 50, 75, 100].map((v) => (
            <Button
              key={v}
              size="sm"
              className={
                controlled === v
                ? "rounded-cl-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90"
                : "rounded-cl-md bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover"
              }
              onClick={() => setControlled(v)}
            >
              {v}
            </Button>
          ))
        }
      </div>
      <div className="text-sm text-cl-text-secondary">
        Value:
        <span
          className="inline-flex px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-cl-bg-hover text-cl-text-chrome border border-cl-text/10"
        >
          {controlled}
        </span>
      </div>
    </div>
  );
}
