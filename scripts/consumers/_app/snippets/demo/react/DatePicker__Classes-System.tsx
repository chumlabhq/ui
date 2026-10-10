import { useState } from "react";
import { DatePicker, DateRange } from "@chumlab/ui/date-picker";

export default function DatePickerExample() {
  const [classesRange, setClassesRange] = useState<DateRange | null>(null);
  return (
    <>
      <div className="w-full sm:max-w-xs">
        <DatePicker
          placeholder="Pink theme"
          classes={
            {
                              ...({
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
            }),
                              trigger: `${"flex items-center gap-2 w-full px-3.5 py-2.5 rounded-cl-lg border text-sm transition-all cursor-pointer bg-cl-bg-input border-cl-text/10 text-cl-text shadow-sm shadow-black/[0.04] hover:border-cl-border-input-hover focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success data-[disabled]:cursor-not-allowed"} border border-cl-border-input-focus focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus`
                            }
          }
          showTodayIndicator
          clearable
        />
      </div>
      <div className="max-w-sm">
        <DatePicker
          placeholder="Large calendar"
          classes={
            {
                              ...({
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
            }),
                              content: `${"rounded-cl-lg shadow-xl p-4 bg-cl-bg-elevated border border-cl-border"} p-6`,
                              weekday: "text-sm font-bold text-center py-3 uppercase tracking-wider text-cl-text-secondary",
                              item: "relative w-12 h-12 flex items-center justify-center text-base font-semibold rounded-full cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-cl-accent focus:ring-offset-1 hover:bg-cl-bg-hover text-cl-text",
                              header: "flex items-center justify-between mb-6",
                              monthSelect: "flex items-center gap-1 px-3 py-2 text-base font-bold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated",
                              yearSelect: "flex items-center gap-1 px-3 py-2 text-base font-bold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated",
                              label: "block text-base font-semibold mb-2 text-cl-text"
                            }
          }
          label="Large Calendar"
          showTodayIndicator
        />
      </div>
      <div className="max-w-[220px]">
        <DatePicker
          placeholder="Compact"
          classes={
            {
                               ...({
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
             }),
                               trigger: "flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-cl-md border text-xs transition-all cursor-pointer bg-cl-bg-input border-cl-text/10 text-cl-text shadow-sm",
            content: "rounded-cl-md shadow-lg p-2.5 bg-cl-bg-elevated border border-cl-border",
                               icon: "w-3.5 h-3.5 shrink-0 text-cl-text-tertiary",
                               header: "flex items-center justify-between mb-2",
                               weekday: "text-[10px] font-semibold text-center py-1 uppercase text-cl-text-tertiary",
                               item: "relative w-7 h-7 flex items-center justify-center text-[11px] font-medium rounded-full cursor-pointer transition-all focus:outline-none hover:bg-cl-bg-hover text-cl-text-chrome",
                               monthSelect: "flex items-center gap-0.5 px-1.5 py-1 text-xs font-semibold bg-transparent border border-none cursor-pointer rounded transition-colors text-cl-text hover:bg-cl-bg-elevated",
                               yearSelect: "flex items-center gap-0.5 px-1.5 py-1 text-xs font-semibold bg-transparent border border-none cursor-pointer rounded transition-colors text-cl-text hover:bg-cl-bg-elevated",
                               navTrigger: "p-1 rounded transition-colors text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-elevated",
                               footer: "flex justify-center pt-2 mt-2 border-t border-cl-border",
                               todayTrigger: "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-all text-cl-accent hover:bg-cl-bg-elevated"
                             }
          }
          showTodayIndicator
          showTodayButton
        />
      </div>
      <div className="w-full sm:max-w-xs">
        <DatePicker
          placeholder="Custom nav"
          classes={
            {
                              ...({
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
            }),
                              trigger: `${"flex items-center gap-2 w-full px-3.5 py-2.5 rounded-cl-lg border text-sm transition-all cursor-pointer bg-cl-bg-input border-cl-text/10 text-cl-text shadow-sm shadow-black/[0.04] hover:border-cl-border-input-hover focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success data-[disabled]:cursor-not-allowed"} rounded-cl-lg border border-cl-success`,
                              navTrigger: "p-2 rounded-cl-lg transition-colors text-cl-success hover:bg-cl-success-bg"
                            }
          }
          showTodayIndicator
          clearable
        />
      </div>
      <div className="w-full sm:max-w-xs">
        <DatePicker
          selectionMode="range"
          value={classesRange}
          onValueChange={(range) => setClassesRange(range)}
          placeholder="Styled presets"
          showPresets
          clearable
          classes={
            {
                               ...({
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
             }),
            presetTrigger: "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-all bg-cl-bg-hover text-cl-text-secondary hover:bg-cl-text/[0.14] border border-cl-border"
                             }
          }
        />
      </div>
    </>
  );
}
