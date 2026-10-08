import { useState } from "react";
import { TimePicker } from "@chumlab/ui/time-picker";

export default function TimePickerExample() {
  const [clockUnstyled, setClockUnstyled] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-4">
      <TimePicker
        value={clockUnstyled}
        onValueChange={(v) => setClockUnstyled(v)}
        variant="clock"
        unstyled
        classes={
          {
            root: "inline-flex flex-col gap-1",
            trigger: "flex items-center gap-2 px-3 py-2 border-2 border-dashed rounded-cl-lg border-cl-border-input-focus bg-cl-accent-surface text-cl-text",
            input: "bg-transparent outline-none text-sm flex-1 placeholder:text-cl-text-tertiary",
            icon: "w-4 h-4 text-cl-accent",
            clockContent: "p-4 border-2 border-dashed rounded-cl-lg border-cl-border-input-focus bg-cl-accent-surface",
            clockDisplay: "flex items-center justify-center gap-1 mb-4",
            clockHours: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer text-cl-text-secondary",
            clockMinutes: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer text-cl-text-secondary",
            clockSeparator: "text-2xl font-semibold text-cl-text-tertiary",
            clockFace: "relative w-52 h-52 mx-auto rounded-full bg-cl-bg-hover",
            clockHand: "absolute inset-0",
            clockHandLine: "stroke-cl-accent",
            clockHandDot: "w-3 h-3 rounded-full bg-cl-accent",
            clockNumber: "absolute text-sm font-medium cursor-pointer select-none text-cl-text-secondary text-xs text-cl-text-tertiary",
            clockCenter: "fill-cl-accent",
            footer: "flex items-center justify-end gap-2 mt-4",
            cancelButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md text-cl-text-secondary",
            confirmButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md bg-cl-accent text-cl-on-accent",
            row: "flex flex-col gap-1 ml-3",
            periodButton: "px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer text-cl-text-secondary"
          }
        }
      />
      <span className="text-sm text-cl-text-secondary">
        Selected:
        {clockUnstyled ?? "none"}
      </span>
    </div>
  );
}
