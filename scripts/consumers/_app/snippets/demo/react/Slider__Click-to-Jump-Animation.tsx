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
  const [animFast, setAnimFast] = useState(3);
  const [animDefault, setAnimDefault] = useState(3);
  const [animSlow, setAnimSlow] = useState(3);
  const [animOff, setAnimOff] = useState(3);
  return (
    <div className="flex flex-col gap-6 w-full sm:max-w-sm">
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">
          transitionDuration=
          {"{100}"}
          (snappy)
        </span>
        <Slider
          value={animFast}
          onValueChange={(v) => setAnimFast(v as number)}
          animationDuration={100}
          marks={ratingMarks}
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
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">
          transitionDuration=
          {"{200}"}
          (default)
        </span>
        <Slider
          value={animDefault}
          onValueChange={(v) => setAnimDefault(v as number)}
          marks={ratingMarks}
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
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">
          transitionDuration=
          {"{600}"}
          (relaxed)
        </span>
        <Slider
          value={animSlow}
          onValueChange={(v) => setAnimSlow(v as number)}
          animationDuration={600}
          marks={ratingMarks}
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
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">
          transitionDuration=
          {"{0}"}
          (instant)
        </span>
        <Slider
          value={animOff}
          onValueChange={(v) => setAnimOff(v as number)}
          animationDuration={0}
          marks={ratingMarks}
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
        />
      </div>
    </div>
  );
}
