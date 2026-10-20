"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { DatePicker } from "@chumlab/ui/date-picker";

export default function DatePickerExample() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [openControlDate, setOpenControlDate] = useState<Date | null>(null);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <Button
        size="sm"
        className="shrink-0 rounded-cl-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setCalendarOpen((o) => !o)}
      >
        {calendarOpen ? "Close" : "Open"}
        Calendar
      </Button>
      <div className="w-full sm:max-w-xs">
        <DatePicker
          label="Date"
          value={openControlDate}
          onValueChange={(date) => setOpenControlDate(date)}
          open={calendarOpen}
          onOpenChange={setCalendarOpen}
          placeholder="Controlled open..."
          classes={
            {
              root: "",
              trigger: "flex items-center gap-2 w-full px-3.5 py-2.5 rounded-cl-lg border text-sm transition-all cursor-pointer bg-cl-bg-input border-cl-text/10 text-cl-text shadow-sm shadow-black/[0.04] hover:border-cl-border-input-hover focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success data-[disabled]:cursor-not-allowed",
              input: "flex-1 text-left truncate",
              label: "block text-[13px] font-medium mb-1.5 text-cl-text-secondary",
              header: "flex items-center justify-between mb-4",
              navTrigger: "p-1.5 rounded-cl-md transition-colors text-cl-text-chrome-quiet hover:text-cl-text hover:bg-cl-bg-hover",
              weekday: "text-xs font-semibold text-center py-2 uppercase tracking-wide text-cl-text-tertiary",
              weekNumber: "text-xs flex items-center justify-center text-cl-text-tertiary",
              footer: "flex justify-center pt-4 mt-4 border-t border-cl-border",
              markerIndicator: "w-1 h-1 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2 bg-cl-accent",
              monthSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated",
              yearSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated"
            }
          }
        />
      </div>
      <span className="text-sm text-cl-text-secondary">
        Open:
        {String(calendarOpen)}
        | Selected:
        {" "}
        {openControlDate?.toLocaleDateString() ?? "none"}
      </span>
    </div>
  );
}
