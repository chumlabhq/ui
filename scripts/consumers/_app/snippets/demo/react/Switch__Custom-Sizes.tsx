import { useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [sizeSwitchSmall, setSizeSwitchSmall] = useState(false);
  const [sizeSwitch, setSizeSwitch] = useState(false);
  const [sizeSwitchLarge, setSizeSwitchLarge] = useState(false);
  return (
    <div className="space-y-4">
      <Switch
        label="Small switch"
        checked={sizeSwitchSmall}
        onValueChange={setSizeSwitchSmall}
        classes={
          {
                        ...({
            label: "text-sm font-medium text-cl-text cursor-pointer data-[disabled]:cursor-not-allowed",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }),
                        label: "text-xs font-medium text-cl-text cursor-pointer",
                        control: "relative inline-flex items-center h-4 w-7 rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
                        thumb:
                          "inline-flex items-center justify-center transform h-3 w-3 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
                      }
        }
      />
      <Switch
        label="Default switch"
        checked={sizeSwitch}
        onValueChange={setSizeSwitch}
        classes={
          {
            label: "text-sm font-medium text-cl-text cursor-pointer data-[disabled]:cursor-not-allowed",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }
        }
      />
      <Switch
        label="Large switch"
        checked={sizeSwitchLarge}
        onValueChange={setSizeSwitchLarge}
        classes={
          {
                        ...({
            label: "text-sm font-medium text-cl-text cursor-pointer data-[disabled]:cursor-not-allowed",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }),
                        label: "text-base font-medium text-cl-text cursor-pointer",
                        control: "relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
                        thumb:
                          "inline-flex items-center justify-center transform h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
                      }
        }
      />
    </div>
  );
}
