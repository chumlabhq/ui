"use client";

import { useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [renderPropsSwitch, setRenderPropsSwitch] = useState(false);
  return (
    <Switch
      checked={renderPropsSwitch}
      onCheckedChange={setRenderPropsSwitch}
      aria-label="Toggle feature status"
      renderLabel={
        ({ checked }) => (
          <span
            className={`font-bold ${checked ? ("text-cl-success") : "text-cl-error"}`}
          >
            {checked ? "Active" : "Inactive"}
          </span>
        )
      }
      renderDescription={
        ({ checked }) => (
          <span
            className={"text-xs italic text-cl-text-secondary"}
          >
            Status: {checked ? "Feature is enabled" : "Feature is disabled"}
          </span>
        )
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
  );
}
