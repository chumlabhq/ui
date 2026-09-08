import { useState } from "react";
import { Slider } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [vertical, setVertical] = useState(40);
  return (
    <div className="flex flex-wrap items-end gap-10 h-52">
                <div className="flex flex-col items-center gap-2">
                  <Slider
                    value={vertical}
                    onValueChange={(v) => setVertical(v as number)}
                    orientation="vertical"
                    classes={({
        root: "flex flex-col gap-2 w-full",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`,
        track: `rounded-full bg-cl-bg-hover dark:bg-cl-text/[0.12]`,
        range: "rounded-full bg-cl-accent",
        thumb: `absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-white dark:focus-visible:ring-offset-cl-bg`
      })}
                    showTooltip
                    style={{ height: "180px" }}
                  />
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>{vertical}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Slider
                    value={[20, 70]}
                    orientation="vertical"
                    classes={({
        root: "flex flex-col gap-2 w-full",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`,
        track: `rounded-full bg-cl-bg-hover dark:bg-cl-text/[0.12]`,
        range: "rounded-full bg-cl-accent",
        thumb: `absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-white dark:focus-visible:ring-offset-cl-bg`
      })}
                    showTooltip
                    style={{ height: "180px" }}
                  />
                  <span className={"text-xs font-medium text-cl-text-tertiary"}>Range</span>
                </div>
              </div>
  );
}
