"use client";

import { useState } from "react";
import { TimePicker } from "@chumlab/ui/time-picker";

const StarCheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true" width={16} height={16}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function TimePickerExample() {
  const [customCheckVal, setCustomCheckVal] = useState<string | null>(null);
  const [noCheckVal, setNoCheckVal] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap gap-8">
      <div>
        <TimePicker
          value={customCheckVal}
          onValueChange={(v) => setCustomCheckVal(v)}
          selectedIcon={<StarCheckIcon className="w-4 h-4 shrink-0 text-cl-warning" />}
          classes={
            {
                             ...({
               root: "inline-flex flex-col gap-1 text-cl-text",
               label: "block text-sm font-medium mb-1 text-cl-text-secondary",
               control: "relative",
            trigger: "flex items-center gap-2 w-full sm:w-56 px-3 py-2 rounded-cl-md transition-colors cursor-text border border-cl-border-input bg-white hover:border-cl-border-input focus-within:ring-2 focus-within:ring-cl-accent focus-within:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:hover:border-cl-border dark:focus-within:ring-2 dark:focus-within:ring-cl-accent dark:focus-within:border-transparent",
               input: "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text",
               icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
               clearTrigger: "shrink-0 w-4 h-4 cursor-pointer text-cl-text-tertiary hover:text-cl-text-secondary dark:text-cl-text-tertiary dark:hover:text-cl-text",
               content: "border rounded-cl-md shadow-lg overflow-hidden bg-white border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
               list: "max-h-60 overflow-y-auto",
               item: "flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-cl-text hover:bg-black/5 dark:text-cl-text dark:hover:bg-white/10",
               itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
               empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary",
               message: "text-sm mt-1 text-cl-error",
            clockContent: "p-4 rounded-cl-lg shadow-lg bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
               clockDisplay: "flex items-center justify-center gap-1 mb-4",
               clockHours: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-black/5 dark:text-cl-text-secondary dark:hover:bg-white/10",
               clockMinutes: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-black/5 dark:text-cl-text-secondary dark:hover:bg-white/10",
               clockSeparator: "text-2xl font-semibold text-cl-text-tertiary",
               clockFace: "relative w-52 h-52 mx-auto rounded-full bg-cl-bg-hover dark:bg-cl-bg-elevated",
               clockHand: "absolute inset-0",
               clockHandLine: "stroke-cl-accent",
               clockHandDot: "w-3 h-3 rounded-full bg-cl-accent dark:bg-cl-accent/90",
               clockNumber: "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary hover:text-cl-text dark:text-cl-text-secondary dark:hover:text-white text-xs text-cl-text-tertiary",
               clockCenter: "fill-cl-accent",
               footer: "flex items-center justify-end gap-2 mt-4",
               cancelButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary hover:bg-black/5 dark:text-cl-text-secondary dark:hover:bg-white/10",
               confirmButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90",
               row: "flex flex-col gap-1 ml-3",
               periodButton: "px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary hover:bg-black/5 dark:text-cl-text-tertiary dark:hover:bg-white/10"
             }),
                             itemIndicator: "w-4 h-4 shrink-0 text-cl-warning"
                           }
          }
        />
        <span className="text-xs mt-1 block text-cl-text-secondary">
          Selected:
          {customCheckVal ?? "none"}
        </span>
      </div>
      <div>
        <TimePicker
          value={noCheckVal}
          onValueChange={(v) => setNoCheckVal(v)}
          showSelectedIcon={false}
          classes={
            {
               root: "inline-flex flex-col gap-1 text-cl-text",
               label: "block text-sm font-medium mb-1 text-cl-text-secondary",
               control: "relative",
            trigger: "flex items-center gap-2 w-full sm:w-56 px-3 py-2 rounded-cl-md transition-colors cursor-text border border-cl-border-input bg-white hover:border-cl-border-input focus-within:ring-2 focus-within:ring-cl-accent focus-within:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:hover:border-cl-border dark:focus-within:ring-2 dark:focus-within:ring-cl-accent dark:focus-within:border-transparent",
               input: "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text",
               icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary",
               clearTrigger: "shrink-0 w-4 h-4 cursor-pointer text-cl-text-tertiary hover:text-cl-text-secondary dark:text-cl-text-tertiary dark:hover:text-cl-text",
               content: "border rounded-cl-md shadow-lg overflow-hidden bg-white border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
               list: "max-h-60 overflow-y-auto",
               item: "flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-cl-text hover:bg-black/5 dark:text-cl-text dark:hover:bg-white/10",
               itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
               empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary",
               message: "text-sm mt-1 text-cl-error",
            clockContent: "p-4 rounded-cl-lg shadow-lg bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
               clockDisplay: "flex items-center justify-center gap-1 mb-4",
               clockHours: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-black/5 dark:text-cl-text-secondary dark:hover:bg-white/10",
               clockMinutes: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-black/5 dark:text-cl-text-secondary dark:hover:bg-white/10",
               clockSeparator: "text-2xl font-semibold text-cl-text-tertiary",
               clockFace: "relative w-52 h-52 mx-auto rounded-full bg-cl-bg-hover dark:bg-cl-bg-elevated",
               clockHand: "absolute inset-0",
               clockHandLine: "stroke-cl-accent",
               clockHandDot: "w-3 h-3 rounded-full bg-cl-accent dark:bg-cl-accent/90",
               clockNumber: "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary hover:text-cl-text dark:text-cl-text-secondary dark:hover:text-white text-xs text-cl-text-tertiary",
               clockCenter: "fill-cl-accent",
               footer: "flex items-center justify-end gap-2 mt-4",
               cancelButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary hover:bg-black/5 dark:text-cl-text-secondary dark:hover:bg-white/10",
               confirmButton: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90",
               row: "flex flex-col gap-1 ml-3",
               periodButton: "px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary hover:bg-black/5 dark:text-cl-text-tertiary dark:hover:bg-white/10"
             }
          }
        />
        <span className="text-xs mt-1 block text-cl-text-secondary">
          Selected:
          {noCheckVal ?? "none"}
        </span>
      </div>
    </div>
  );
}
