import { useState } from "react";
import { DateMarker, DatePicker } from "@chumlab/ui/date-picker";
import { addDays } from "date-fns";

const today = new Date();

const markers: DateMarker[] = [
    {
      date: addDays(today, 2),
      label: "Team Meeting",
      type: "meeting",
      color: "#6366f1",
    },
    {
      date: addDays(today, 5),
      label: "Deadline",
      description: "Project submission",
      type: "deadline",
      color: "#ef4444",
    },
    {
      date: addDays(today, 10),
      label: "Holiday",
      type: "holiday",
      color: "#22c55e",
    },
  ];

export default function DatePickerExample() {
  const [markersDate, setMarkersDate] = useState<Date | null>(null);
  return (
    <>
      <div className="w-full sm:max-w-xs">
        <DatePicker
          value={markersDate}
          onValueChange={(date) => setMarkersDate(date)}
          label="Calendar with markers"
          placeholder="Pick a date..."
          markers={markers}
          showMarkerIndicator
          showMarkerTooltip
          showTodayIndicator
          classes={
            {
              root: "",
              trigger: "flex items-center gap-2 w-full px-3.5 py-2.5 rounded-cl-lg border text-sm transition-all cursor-pointer bg-cl-bg-input border-cl-text/10 text-cl-text shadow-sm shadow-black/[0.04] hover:border-cl-border-input focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:border dark:hover:border-cl-text/20 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success data-[disabled]:cursor-not-allowed",
              input: "flex-1 text-left truncate",
              label: "block text-[13px] font-medium mb-1.5 text-cl-text-secondary",
              header: "flex items-center justify-between mb-4",
              navButton: "p-1.5 rounded-cl-md transition-colors text-cl-text-chrome-quiet hover:text-cl-text hover:bg-cl-bg-hover",
              weekday: "text-xs font-semibold text-center py-2 uppercase tracking-wide text-cl-text-tertiary",
              weekNumber: "text-xs flex items-center justify-center text-cl-text-tertiary",
              footer: "flex justify-center pt-4 mt-4 border-t border-cl-border",
              markerIndicator: "w-1 h-1 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2 bg-cl-accent dark:bg-cl-accent/90",
              monthSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated",
              yearSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated"
            }
          }
        />
      </div>
      <div className="w-full sm:max-w-xs">
        <DatePicker
          placeholder="Dots only..."
          markers={markers}
          showMarkerIndicator
          showMarkerTooltip={false}
          classes={
            {
              root: "",
              trigger: "flex items-center gap-2 w-full px-3.5 py-2.5 rounded-cl-lg border text-sm transition-all cursor-pointer bg-cl-bg-input border-cl-text/10 text-cl-text shadow-sm shadow-black/[0.04] hover:border-cl-border-input focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:border dark:hover:border-cl-text/20 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success data-[disabled]:cursor-not-allowed",
              input: "flex-1 text-left truncate",
              label: "block text-[13px] font-medium mb-1.5 text-cl-text-secondary",
              header: "flex items-center justify-between mb-4",
              navButton: "p-1.5 rounded-cl-md transition-colors text-cl-text-chrome-quiet hover:text-cl-text hover:bg-cl-bg-hover",
              weekday: "text-xs font-semibold text-center py-2 uppercase tracking-wide text-cl-text-tertiary",
              weekNumber: "text-xs flex items-center justify-center text-cl-text-tertiary",
              footer: "flex justify-center pt-4 mt-4 border-t border-cl-border",
              markerIndicator: "w-1 h-1 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2 bg-cl-accent dark:bg-cl-accent/90",
              monthSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated",
              yearSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated"
            }
          }
        />
      </div>
      <div className="w-full sm:max-w-xs">
        <DatePicker
          placeholder="Colored dots..."
          markers={
            [
              { date: addDays(today, 1), label: "Red", color: "#ef4444" },
              {
                date: addDays(today, 3),
                label: "Green",
                color: "#22c55e"
              },
              {
                date: addDays(today, 5),
                label: "Blue",
                color: "#3b82f6"
              },
              {
                date: addDays(today, 7),
                label: "Amber",
                color: "#f59e0b"
              },
              {
                date: addDays(today, 9),
                label: "Purple",
                color: "#8b5cf6"
              }
            ]
          }
          showMarkerIndicator
          showMarkerTooltip={false}
          classes={
            {
              root: "",
              trigger: "flex items-center gap-2 w-full px-3.5 py-2.5 rounded-cl-lg border text-sm transition-all cursor-pointer bg-cl-bg-input border-cl-text/10 text-cl-text shadow-sm shadow-black/[0.04] hover:border-cl-border-input focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:border dark:hover:border-cl-text/20 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success data-[disabled]:cursor-not-allowed",
              input: "flex-1 text-left truncate",
              label: "block text-[13px] font-medium mb-1.5 text-cl-text-secondary",
              header: "flex items-center justify-between mb-4",
              navButton: "p-1.5 rounded-cl-md transition-colors text-cl-text-chrome-quiet hover:text-cl-text hover:bg-cl-bg-hover",
              weekday: "text-xs font-semibold text-center py-2 uppercase tracking-wide text-cl-text-tertiary",
              weekNumber: "text-xs flex items-center justify-center text-cl-text-tertiary",
              footer: "flex justify-center pt-4 mt-4 border-t border-cl-border",
              markerIndicator: "w-1 h-1 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2 bg-cl-accent dark:bg-cl-accent/90",
              monthSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated",
              yearSelect: "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated"
            }
          }
        />
      </div>
    </>
  );
}
