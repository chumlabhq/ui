"use client";

import { useState } from "react";
import { TimePicker, TimePickerClasses } from "@chumlab/ui/time-picker";

const getVioletClockTheme = (): TimePickerClasses => ({
  root: "inline-flex flex-col gap-1 text-cl-text",
  control: "relative",
 trigger: "flex items-center gap-2 w-full sm:w-56 px-3 py-2 rounded-cl-md transition-colors cursor-text border border-cl-border-input-focus bg-cl-bg-panel hover:border-cl-border-input-focus focus-within:ring-2 focus-within:ring-cl-accent",
  input: "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text",
  icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent",
 clockContent: "p-4 rounded-cl-lg shadow-lg bg-cl-bg-panel border border-cl-border-input-focus",
  clockDisplay: "flex items-center justify-center gap-1 mb-4",
  clockHours: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated",
  clockMinutes: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated",
  clockSeparator: "text-2xl font-semibold text-cl-text-tertiary",
  clockFace: "relative w-52 h-52 mx-auto rounded-full bg-cl-accent-surface",
  clockHand: "absolute inset-0",
  clockHandLine: "stroke-cl-accent",
  clockHandDot: "w-3 h-3 rounded-full bg-cl-accent",
  clockNumber: "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary hover:text-cl-text text-xs text-cl-text-tertiary",
  clockCenter: "fill-cl-accent",
  footer: "flex items-center justify-end gap-2 mt-4",
  cancelTrigger: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated",
  confirmTrigger: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent",
  row: "flex flex-col gap-1 ml-3",
  periodTrigger: "px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary hover:bg-cl-bg-elevated",
});

const getRoseClockTheme = (): TimePickerClasses => ({
  root: "inline-flex flex-col gap-1 text-cl-text",
  control: "relative",
 trigger: "flex items-center gap-2 w-full sm:w-56 px-3 py-2 rounded-cl-md transition-colors cursor-text border border-cl-border-input-focus bg-cl-bg-panel hover:border-cl-border-input-focus focus-within:ring-2 focus-within:ring-cl-accent",
  input: "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text",
  icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-accent",
 clockContent: "p-4 rounded-cl-lg shadow-lg bg-cl-bg-panel border border-cl-border-input-focus",
  clockDisplay: "flex items-center justify-center gap-1 mb-4",
  clockHours: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated",
  clockMinutes: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated",
  clockSeparator: "text-2xl font-semibold text-cl-text-tertiary",
  clockFace: "relative w-52 h-52 mx-auto rounded-full bg-cl-accent-surface",
  clockHand: "absolute inset-0",
  clockHandLine: "stroke-cl-accent",
  clockHandDot: "w-3 h-3 rounded-full bg-cl-accent",
  clockNumber: "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary hover:text-cl-text text-xs text-cl-text-tertiary",
  clockCenter: "fill-cl-accent",
  footer: "flex items-center justify-end gap-2 mt-4",
  cancelTrigger: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated",
  confirmTrigger: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent",
  row: "flex flex-col gap-1 ml-3",
  periodTrigger: "px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary hover:bg-cl-bg-elevated",
});

const getEmeraldClockTheme = (): TimePickerClasses => ({
  root: "inline-flex flex-col gap-1 text-cl-text",
  control: "relative",
 trigger: "flex items-center gap-2 w-full sm:w-56 px-3 py-2 rounded-cl-md transition-colors cursor-text border border-cl-success bg-cl-bg-panel hover:border-cl-success focus-within:ring-2 focus-within:ring-cl-success",
  input: "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-cl-text-tertiary text-cl-text",
  icon: "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-success",
 clockContent: "p-4 rounded-cl-lg shadow-lg bg-cl-bg-panel border border-cl-success",
  clockDisplay: "flex items-center justify-center gap-1 mb-4",
  clockHours: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated",
  clockMinutes: "px-3 py-2 text-2xl font-semibold rounded-cl-md cursor-pointer transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated",
  clockSeparator: "text-2xl font-semibold text-cl-text-tertiary",
  clockFace: "relative w-52 h-52 mx-auto rounded-full bg-cl-success-bg",
  clockHand: "absolute inset-0",
  clockHandLine: "stroke-cl-success",
  clockHandDot: "w-3 h-3 rounded-full bg-cl-success/30",
  clockNumber: "absolute text-sm font-medium cursor-pointer select-none transition-colors text-cl-text-secondary hover:text-cl-text text-xs text-cl-text-tertiary",
  clockCenter: "fill-cl-success",
  footer: "flex items-center justify-end gap-2 mt-4",
  cancelTrigger: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors text-cl-text-secondary hover:bg-cl-bg-elevated",
  confirmTrigger: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-success text-white hover:bg-cl-success",
  row: "flex flex-col gap-1 ml-3",
  periodTrigger: "px-2 py-1 text-xs font-medium rounded-cl-md cursor-pointer transition-colors text-cl-text-tertiary hover:bg-cl-bg-elevated",
});

export default function TimePickerExample() {
  const [clockEmerald, setClockEmerald] = useState<string | null>(null);
  const [clockRose, setClockRose] = useState<string | null>(null);
  const [clockViolet, setClockViolet] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap gap-6">
      <div>
        <TimePicker
          aria-label="Time, emerald clock theme"
          value={clockEmerald}
          onValueChange={(v) => setClockEmerald(v)}
          mode="clock"
          format="12h"
          classes={getEmeraldClockTheme()}
        />
        <span className="text-xs mt-1 block text-cl-text-secondary">
          Selected:
          {clockEmerald ?? "none"}
        </span>
      </div>
      <div>
        <TimePicker
          aria-label="Time, rose clock theme"
          value={clockRose}
          onValueChange={(v) => setClockRose(v)}
          mode="clock"
          format="12h"
          classes={getRoseClockTheme()}
        />
        <span className="text-xs mt-1 block text-cl-text-secondary">
          Selected:
          {clockRose ?? "none"}
        </span>
      </div>
      <div>
        <TimePicker
          aria-label="Time, violet clock theme"
          value={clockViolet}
          onValueChange={(v) => setClockViolet(v)}
          mode="clock"
          format="12h"
          classes={getVioletClockTheme()}
        />
        <span className="text-xs mt-1 block text-cl-text-secondary">
          Selected:
          {clockViolet ?? "none"}
        </span>
      </div>
    </div>
  );
}
