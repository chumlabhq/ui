"use client";

import { useState } from "react";
import { DatePicker } from "@chumlab/ui/date-picker";

const fmt = "MMM d, yyyy";

export default function DatePickerExample() {
  const [formatDate, setFormatDate] = useState<Date | null>(new Date());
  return (
    <div className="w-full sm:max-w-xs">
      <DatePicker
        value={formatDate}
        onValueChange={setFormatDate}
        dateFormat={fmt}
        clearable
        classes={
          {
            root: "",
            trigger: "flex items-center gap-2 w-full px-3.5 py-2.5 rounded-cl-lg border text-sm transition-all cursor-pointer bg-white border-cl-border text-cl-text shadow-sm shadow-black/[0.04] hover:border-cl-border-input focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:bg-cl-text/4 dark:border dark:border-cl-text/10 dark:text-cl-text dark:hover:border-cl-text/20 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success data-[disabled]:cursor-not-allowed",
            input: "flex-1 text-left truncate",
            label: "block text-[13px] font-medium mb-1.5 text-cl-text-secondary",
            header: "flex items-center justify-between mb-4",
            navButton: "p-1.5 rounded-cl-md transition-colors text-cl-text-secondary hover:text-cl-text hover:bg-cl-bg-hover dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-text/10",
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
  );
}
