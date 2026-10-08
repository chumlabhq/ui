import { useState } from "react";
import { Slider, SliderMark } from "@chumlab/ui/slider";

const ratingMarks: SliderMark[] = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

export default function SliderExample() {
  const [stepped, setStepped] = useState(50);
  const [custom2, setCustom2] = useState(3);
  return (
    <div className="flex flex-col gap-8 w-full sm:max-w-sm">
      <div className="space-y-2">
        <Slider
          value={stepped}
          onValueChange={(v) => setStepped(v as number)}
          step={10}
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
        <div className="text-xs text-cl-text-secondary">
          Step: 10 — Value:
          {stepped}
        </div>
      </div>
      <div className="space-y-2">
        <Slider
          value={custom2}
          onValueChange={(v) => setCustom2(v as number)}
          min={1}
          max={5}
          step={1}
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
          marks={ratingMarks}
        />
        <div className="text-xs text-cl-text-secondary">
          Rating:
          {custom2}
          / 5
        </div>
      </div>
    </div>
  );
}
