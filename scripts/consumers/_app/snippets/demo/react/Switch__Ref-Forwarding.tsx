import { useRef, useState } from "react";
import { Button } from "@chumlab/ui/button";
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
        classes={
          {
            label: "text-sm font-medium text-cl-text cursor-pointer data-[disabled]:cursor-not-allowed",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }
        }
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => switchRef.current?.focus()}
          className="rounded-cl-md bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover"
        >
          Focus Switch
        </Button>
        <Button
          size="sm"
          onClick={() => switchRef.current?.click()}
          className="rounded-cl-md bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover"
        >
          Toggle Switch
        </Button>
      </div>
    </div>
  );
}
