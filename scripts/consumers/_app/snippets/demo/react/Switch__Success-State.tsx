import { useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [successSwitch, setSuccessSwitch] = useState(true);
  return (
    <Switch
      label="Email notifications"
      checked={successSwitch}
      onCheckedChange={setSuccessSwitch}
      success={successSwitch}
      successMessage="Notifications are enabled"
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
