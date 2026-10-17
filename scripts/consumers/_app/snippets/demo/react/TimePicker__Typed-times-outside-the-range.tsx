import { useState } from "react";
import { TimePicker } from "@chumlab/ui/time-picker";

export default function TimePickerExample() {
  const [typedPickup, setTypedPickup] = useState<string | null>("10:00");
  return (
    <div className="w-full sm:max-w-xs space-y-2">
      <TimePicker
        label="Pickup time"
        description="Open 09:00 to 17:00."
        minTime="09:00"
        maxTime="17:00"
        minuteStep={15}
        defaultValue="10:00"
        onValueChange={(time) => setTypedPickup(time)}
      />
      <p className="text-sm text-cl-text-secondary" role="status" data-demo-action>
        Committed:
        {typedPickup ?? "none"}
      </p>
    </div>
  );
}
