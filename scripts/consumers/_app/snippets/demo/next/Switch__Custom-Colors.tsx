"use client";

import { useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [colorSwitch, setColorSwitch] = useState(false);
  return (
    <div className="space-y-4">
      <Switch
        label="Purple theme"
        checked={colorSwitch}
        onValueChange={setColorSwitch}
        classes={
          {
                        ...({
            label: "text-sm font-medium text-cl-text cursor-pointer",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }),
                        label: "text-sm font-medium text-cl-accent cursor-pointer"
                      }
        }
      />
      <Switch
        label="Green theme"
        checked={!colorSwitch}
        onValueChange={(checked) => setColorSwitch(!checked)}
        classes={
          {
                        ...({
            label: "text-sm font-medium text-cl-text cursor-pointer",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }),
                        label: "text-sm font-medium text-cl-success cursor-pointer"
                      }
        }
      />
    </div>
  );
}
