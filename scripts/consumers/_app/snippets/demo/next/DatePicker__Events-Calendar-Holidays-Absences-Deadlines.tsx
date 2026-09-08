"use client";

import { useState } from "react";
import { DateMarker, DatePicker } from "@chumlab/ui/date-picker";
import { addDays } from "date-fns";

const today = new Date();

const eventMarkers: DateMarker[] = [
    {
      date: addDays(today, 1),
      label: "Sprint Review",
      description: "End of sprint demo",
      type: "event",
      color: "#6366f1",
    },
    {
      date: addDays(today, 3),
      label: "Public Holiday",
      description: "National holiday — office closed",
      type: "holiday",
      color: "#22c55e",
    },
    {
      date: addDays(today, 4),
      label: "Alice — PTO",
      description: "Approved leave",
      type: "absence",
      color: "#f59e0b",
    },
    {
      date: addDays(today, 6),
      label: "Bob — Sick Leave",
      type: "absence",
      color: "#f59e0b",
    },
    {
      date: addDays(today, 7),
      label: "Team Offsite",
      description: "Annual team building",
      type: "event",
      color: "#6366f1",
    },
    {
      date: addDays(today, 8),
      label: "Release Day",
      description: "v2.0 launch",
      type: "deadline",
      color: "#ef4444",
    },
    {
      date: addDays(today, 12),
      label: "Holiday — Christmas",
      type: "holiday",
      color: "#22c55e",
    },
    {
      date: addDays(today, 15),
      label: "Charlie — Vacation",
      description: "Dec 15-22",
      type: "absence",
      color: "#f59e0b",
    },
  ];

export default function DatePickerExample() {
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  return (
    <div className="w-full sm:max-w-xs">
                <DatePicker
                  value={singleDate}
                  onValueChange={(date) => setSingleDate(date)}
                  label="Team Calendar"
                  placeholder="Pick a date..."
                  markers={eventMarkers}
                  showMarkerIndicator
                  showMarkerTooltip
                  showTodayIndicator
                  showClearButton
                  classes={({
        root: "",
        trigger: `flex items-center gap-2 w-full px-3.5 py-2.5 rounded-cl-lg border text-sm transition-all cursor-pointer bg-white border-cl-border text-cl-text shadow-sm shadow-black/[0.04] hover:border-cl-border-input focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:bg-cl-text/4 dark:border dark:border-cl-text/10 dark:text-cl-text dark:hover:border-cl-text/20 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
        input: "flex-1 text-left truncate",
        label: `block text-[13px] font-medium mb-1.5 text-cl-text-secondary`,
        header: "flex items-center justify-between mb-4",
        navButton: `p-1.5 rounded-cl-md transition-colors text-cl-text-secondary hover:text-cl-text hover:bg-cl-bg-hover dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-text/10`,
        weekday: `text-xs font-semibold text-center py-2 uppercase tracking-wide text-cl-text-tertiary`,
        weekNumber: `text-xs flex items-center justify-center text-cl-text-disabled`,
        footer: `flex justify-center pt-4 mt-4 border-t border-cl-border`,
        markerIndicator: `w-1 h-1 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2 bg-cl-accent dark:bg-cl-accent/90`,
        monthSelect: `flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated`,
        yearSelect: `flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated`
      })}
                />
              </div>
  );
}
