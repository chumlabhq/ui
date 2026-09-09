"use client";

import { useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [animationSwitch, setAnimationSwitch] = useState(false);
  const [animationSwitchBouncy, setAnimationSwitchBouncy] = useState(false);
  return (
    <div className="space-y-4">
      <Switch
        label="Slow transition (500ms)"
        checked={animationSwitch}
        onValueChange={setAnimationSwitch}
        transitionDuration={500}
        transitionTimingFunction="ease-in-out"
        classes={
          {
            label: "text-sm font-medium text-cl-text cursor-pointer",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }
        }
      />
      <Switch
        label="Bouncy transition"
        checked={animationSwitchBouncy}
        onValueChange={setAnimationSwitchBouncy}
        transitionDuration={300}
        transitionTimingFunction="cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        classes={
          {
            label: "text-sm font-medium text-cl-text cursor-pointer",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }
        }
      />
    </div>
  );
}
