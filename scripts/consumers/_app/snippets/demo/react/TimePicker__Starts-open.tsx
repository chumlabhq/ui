import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { TimePicker } from "@chumlab/ui/time-picker";

export default function TimePickerExample() {
  const [meetingMounts, setMeetingMounts] = useState(0);
  return (
    <div className="w-full sm:max-w-xs space-y-3">
      <Button
        className="border border-cl-border bg-cl-bg-elevated text-cl-text"
        onClick={() => setMeetingMounts((n) => n + 1)}
      >
        Show it open
      </Button>
      {
        meetingMounts > 0 && (
          <TimePicker key={meetingMounts} label="Meeting time" defaultOpen />
        )
      }
    </div>
  );
}
