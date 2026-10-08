import { useState } from "react";
import { Switch } from "@chumlab/ui/switch";

export default function SwitchExample() {
  const [termsSwitch, setTermsSwitch] = useState(false);
  const [notifySwitch, setNotifySwitch] = useState(true);
  return (
    <div className="space-y-4">
      <Switch
        label="Accept terms of service"
        checked={termsSwitch}
        onValueChange={setTermsSwitch}
        error
        errorMessage="You must accept the terms to continue"
        classes={
          {
                        ...({
            label: "text-sm font-medium text-cl-text cursor-pointer data-[disabled]:cursor-not-allowed",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }),
                        label: "text-sm font-medium text-cl-error cursor-pointer"
                      }
        }
      />
      <Switch
        label="Enable notifications"
        checked={notifySwitch}
        onValueChange={setNotifySwitch}
        error
        errorMessage="Notification service is currently unavailable"
        classes={
          {
            label: "text-sm font-medium text-cl-text cursor-pointer data-[disabled]:cursor-not-allowed",
            description: "text-xs text-cl-text-secondary",
            thumb:
              "inline-flex items-center justify-center transform h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none"
          }
        }
      />
    </div>
  );
}
