import { useState } from "react";
import { Slider } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [volume, setVolume] = useState(65);
  return (
    <div className="flex flex-col gap-8 w-full sm:max-w-sm">
      <Slider
        label="Volume"
        description="Adjust the playback volume"
        value={volume}
        onValueChange={(v) => setVolume(v as number)}
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
      <Slider
        label="Budget"
        description="This field is required"
        required
        error
        errorMessage="Please select a valid budget range"
        value={30}
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
    </div>
  );
}
