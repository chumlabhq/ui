import { useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [labelSwitch, setLabelSwitch] = useState(true);
  return (
    <Switch
                label="Enable notifications"
                checked={labelSwitch}
                onValueChange={setLabelSwitch}
                classes={({
        label: `text-sm font-medium text-cl-text cursor-pointer`,
        description: `text-xs text-cl-text-secondary`,
        thumb:
          "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
      })}
              />
  );
}
