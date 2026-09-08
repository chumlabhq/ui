"use client";

import { useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [cssVarSwitch, setCssVarSwitch] = useState(false);
  return (
    <div className="space-y-4">
                <div
                  style={{
                    ["--switch-tracker-checked-bg" as string]: "#7c3aed",
                    ["--switch-tracker-unchecked-bg" as string]: "#ddd6fe",
                    ["--switch-focus-ring" as string]: "#7c3aed"
                  }}
                >
                  <Switch
                    label="Purple theme via CSS vars"
                    checked={cssVarSwitch}
                    onValueChange={setCssVarSwitch}
                    classes={{
                      ...({
        label: `text-sm font-medium text-cl-text cursor-pointer`,
        description: `text-xs text-cl-text-secondary`,
        thumb:
          "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
      }),
                      label: `text-sm font-medium text-cl-accent cursor-pointer`
                    }}
                  />
                </div>
                <div
                  style={{
                    ["--switch-tracker-checked-bg" as string]: "#059669",
                    ["--switch-tracker-unchecked-bg" as string]: "#d1fae5",
                    ["--switch-focus-ring" as string]: "#059669"
                  }}
                >
                  <Switch
                    label="Green theme via CSS vars"
                    checked={!cssVarSwitch}
                    onValueChange={(checked) => setCssVarSwitch(!checked)}
                    classes={{
                      ...({
        label: `text-sm font-medium text-cl-text cursor-pointer`,
        description: `text-xs text-cl-text-secondary`,
        thumb:
          "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
      }),
                      label: `text-sm font-medium text-cl-success cursor-pointer`
                    }}
                  />
                </div>
              </div>
  );
}
