import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { TimePicker } from "@chumlab/ui/time-picker";

export default function TimePickerExample() {
  const [formTime, setFormTime] = useState<string | null>("14:30");
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [eventsTime, setEventsTime] = useState<string | null>(null);
  const log = (msg: string) => setEventLog((prev) => [msg, ...prev.slice(0, 4)]);
  return (
    <>
      <form
        className="flex flex-col sm:flex-row sm:items-end gap-3"
        onSubmit={
          (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            log(`submit: meetingTime=${String(fd.get("meetingTime") ?? "")}`);
          }
        }
      >
        <TimePicker
          name="meetingTime"
          id="demo-meeting-time"
          label="Meeting time"
          value={formTime}
          onValueChange={(v) => setFormTime(v)}
          classes={
            {
               root: "inline-flex flex-col gap-1 text-cl-text",
               label: "block text-sm font-medium mb-1 text-cl-text-secondary",
               control: "relative",
            trigger: "flex items-center gap-2 w-full sm:w-56 px-3 py-2 rounded-cl-md transition-colors cursor-text border border-cl-border-input bg-cl-bg-panel hover:border-cl-border-input-hover focus-within:ring-2 focus-within:ring-cl-accent focus-within:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success data-[disabled]:cursor-not-allowed",
               input: "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text",
               icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
               clearTrigger: "shrink-0 w-4 h-4 cursor-pointer text-cl-text-tertiary hover:text-cl-text-secondary",
               content: "border rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border-cl-border",
               list: "max-h-60 overflow-y-auto",
               item: "flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-cl-text hover:bg-cl-bg-hover",
               itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
               empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary",
               message: "text-sm mt-1 text-cl-error data-[valid]:text-cl-success",
            clockContent: "p-4 rounded-cl-lg shadow-lg bg-cl-bg-panel border border-cl-border",
               clockDisplay: "flex items-center justify-center gap-1 mb-4",
               clockHours: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-hover",
               clockMinutes: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-hover",
               clockSeparator: "text-2xl font-semibold text-cl-text-tertiary",
               clockFace: "relative w-52 h-52 mx-auto rounded-full bg-cl-bg-hover",
               clockHand: "absolute inset-0",
               clockHandLine: "stroke-cl-accent",
               clockHandDot: "w-3 h-3 rounded-full bg-cl-accent",
               clockNumber: "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary hover:text-cl-text text-xs text-cl-text-tertiary data-[disabled]:cursor-not-allowed",
               clockCenter: "fill-cl-accent",
               footer: "flex items-center justify-end gap-2 mt-4",
               cancelButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary hover:bg-cl-bg-hover",
               confirmButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90",
               row: "flex flex-col gap-1 ml-3",
               periodButton: "px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary hover:bg-cl-bg-hover"
             }
          }
        />
        <Button
          type="submit"
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 cursor-pointer"
        >
          Log to event list
        </Button>
      </form>
      <div className="flex flex-wrap items-center gap-4">
        <TimePicker
          value={eventsTime}
          onValueChange={(v) => setEventsTime(v)}
          mode="clock"
          onOpenChange={(open) => log(`onOpenChange: ${open}`)}
          onConfirm={() => log("onConfirm")}
          onCancel={() => log("onCancel")}
          classes={
            {
               root: "inline-flex flex-col gap-1 text-cl-text",
               label: "block text-sm font-medium mb-1 text-cl-text-secondary",
               control: "relative",
            trigger: "flex items-center gap-2 w-full sm:w-56 px-3 py-2 rounded-cl-md transition-colors cursor-text border border-cl-border-input bg-cl-bg-panel hover:border-cl-border-input-hover focus-within:ring-2 focus-within:ring-cl-accent focus-within:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success data-[disabled]:cursor-not-allowed",
               input: "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text",
               icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
               clearTrigger: "shrink-0 w-4 h-4 cursor-pointer text-cl-text-tertiary hover:text-cl-text-secondary",
               content: "border rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border-cl-border",
               list: "max-h-60 overflow-y-auto",
               item: "flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-cl-text hover:bg-cl-bg-hover",
               itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
               empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary",
               message: "text-sm mt-1 text-cl-error data-[valid]:text-cl-success",
            clockContent: "p-4 rounded-cl-lg shadow-lg bg-cl-bg-panel border border-cl-border",
               clockDisplay: "flex items-center justify-center gap-1 mb-4",
               clockHours: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-hover",
               clockMinutes: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-hover",
               clockSeparator: "text-2xl font-semibold text-cl-text-tertiary",
               clockFace: "relative w-52 h-52 mx-auto rounded-full bg-cl-bg-hover",
               clockHand: "absolute inset-0",
               clockHandLine: "stroke-cl-accent",
               clockHandDot: "w-3 h-3 rounded-full bg-cl-accent",
               clockNumber: "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary hover:text-cl-text text-xs text-cl-text-tertiary data-[disabled]:cursor-not-allowed",
               clockCenter: "fill-cl-accent",
               footer: "flex items-center justify-end gap-2 mt-4",
               cancelButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary hover:bg-cl-bg-hover",
               confirmButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90",
               row: "flex flex-col gap-1 ml-3",
               periodButton: "px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary hover:bg-cl-bg-hover"
             }
          }
        />
        <div className="min-w-48 text-xs font-mono space-y-1 text-cl-text-secondary">
          {
            eventLog.length === 0 ? (
              <span className="opacity-70">Open the clock and use OK / Cancel.</span>
            ) : (
              eventLog.map((line, i) => (
                <div key={`${i}-${line}`}>
                  {line}
                </div>
              ))
            )
          }
        </div>
      </div>
    </>
  );
}
