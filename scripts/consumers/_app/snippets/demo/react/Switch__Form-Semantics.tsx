import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [formSwitch, setFormSwitch] = useState(false);
  const [formSubmit, setFormSubmit] = useState("not fired yet");
  return (
    <form
      className="space-y-4"
      onSubmit={
        (e) => {
          e.preventDefault();
          setFormSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
        }
      }
    >
      <Switch
        id="notifications-switch"
        name="notifications"
        label="Enable notifications"
        checked={formSwitch}
        onValueChange={setFormSwitch}
        classes={
          {
            label: "text-sm font-medium text-cl-text cursor-pointer data-[disabled]:cursor-not-allowed",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }
        }
      />
      <Button
        type="submit"
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
      >
        Submit Form
      </Button>
      <div
        className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        onSubmit:
        {formSubmit}
      </div>
    </form>
  );
}
