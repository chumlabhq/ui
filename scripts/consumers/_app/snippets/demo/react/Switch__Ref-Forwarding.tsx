import { useRef, useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const switchRef = useRef<HTMLButtonElement>(null);
  const [refSwitch, setRefSwitch] = useState(false);
  return (
    <div className="space-y-4">
                <Switch
                  ref={switchRef}
                  label="Click the buttons below to control me"
                  checked={refSwitch}
                  onValueChange={setRefSwitch}
                  classes={({
        label: `text-sm font-medium text-cl-text cursor-pointer`,
        description: `text-xs text-cl-text-secondary`,
        thumb:
          "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
      })}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => switchRef.current?.focus()}
                    className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  >
                    Focus Switch
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRef.current?.click()}
                    className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  >
                    Toggle Switch
                  </button>
                </div>
              </div>
  );
}
