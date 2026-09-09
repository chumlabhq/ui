"use client";

import { useState } from "react";
import { Slider } from "@chumlab/ui/slider";

export default function SliderExample() {
  const [successVal, setSuccessVal] = useState(75);
  return (
    <Slider
      label="Volume"
      value={successVal}
      onValueChange={(v) => setSuccessVal(v as number)}
      success={successVal >= 50}
      successMessage="Good volume level"
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
  );
}
