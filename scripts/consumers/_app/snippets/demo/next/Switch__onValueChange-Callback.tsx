"use client";

import { useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [callbackSwitch, setCallbackSwitch] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Switch
        label="Using onValueChange"
        onValueChange={setCallbackSwitch}
        checked={callbackSwitch}
        classes={
          {
            label: "text-sm font-medium text-cl-text cursor-pointer data-[disabled]:cursor-not-allowed",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }
        }
      />
      <p className="text-sm text-cl-text-chrome-quiet" data-demo-action>
        Value:
        {String(callbackSwitch)}
      </p>
    </div>
  );
}
