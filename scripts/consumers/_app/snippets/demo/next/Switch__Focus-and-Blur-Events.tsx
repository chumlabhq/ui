"use client";

import { useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [focusBlurSwitch, setFocusBlurSwitch] = useState(false);
  const [focusLog, setFocusLog] = useState<string[]>([]);
  return (
    <div className="space-y-4">
      <Switch
        label="Focus me to see events"
        checked={focusBlurSwitch}
        onCheckedChange={setFocusBlurSwitch}
        onFocus={
          () =>
          setFocusLog((prev) => [
            ...prev.slice(-4),
            `Focus: ${new Date().toLocaleTimeString()}`
          ])
        }
        onBlur={
          () =>
          setFocusLog((prev) => [
            ...prev.slice(-4),
            `Blur: ${new Date().toLocaleTimeString()}`
          ])
        }
        classes={
          {
            label: "text-sm font-medium text-cl-text cursor-pointer data-[disabled]:cursor-not-allowed",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }
        }
      />
      <div
        className="p-3 rounded-cl-md text-sm font-mono bg-cl-bg-recessed text-cl-text-chrome"
      >
        <p className="text-xs mb-2 text-cl-text-secondary">Event Log:</p>
        {
          focusLog.length === 0 ? (
            <span className="text-cl-text-tertiary">
              Focus or blur the switch to see events...
            </span>
          ) : (
            focusLog.map((log, i) => (
              <div key={i}>
                {log}
              </div>
            ))
          )
        }
      </div>
    </div>
  );
}
