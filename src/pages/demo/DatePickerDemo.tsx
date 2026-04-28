import { useState } from "react";
import {
  DatePicker,
  type DateRange,
  type DateMarker,
} from "../../components/DatePicker";
import { useTheme } from "./ThemeContext";
import {
  DocsHero,
  Section,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";
import {
  subDays,
  addDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
} from "date-fns";
import { fr, de } from "date-fns/locale";

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  datepicker: {
    root: "",
    trigger: `flex items-center gap-2 w-full px-3.5 py-2.5 rounded-cl-lg border text-sm transition-all cursor-pointer bg-white border-cl-border text-cl-text shadow-sm shadow-black/[0.04] hover:border-cl-border-input focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:bg-cl-text/4 dark:border dark:border-cl-text/10 dark:text-cl-text dark:hover:border-cl-text/20 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
    input: "flex-1 text-left truncate",
    calendarIcon: `w-5 h-5 shrink-0 text-cl-text-tertiary`,
    clearButton: `p-1 rounded-full transition-colors shrink-0 text-cl-text-tertiary hover:text-cl-text-secondary hover:bg-cl-bg-hover dark:text-cl-text-tertiary dark:hover:text-cl-text-secondary dark:hover:bg-cl-text/10`,
    label: `block text-[13px] font-medium mb-1.5 text-cl-text-secondary`,
    error: `text-xs mt-1.5 text-cl-error`,
 calendar: `rounded-cl-lg shadow-xl p-4 bg-cl-bg-elevated border border-cl-border`,
    header: "flex items-center justify-between mb-4",
    monthNav: "flex items-center gap-1",
    navButton: `p-1.5 rounded-cl-md transition-colors text-cl-text-secondary hover:text-cl-text hover:bg-cl-bg-hover dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-text/10`,
    navButtonDisabled: "opacity-30 cursor-not-allowed hover:bg-transparent",
    monthGrid: "flex gap-8",
    grid: "",
    weekdayHeader: "grid grid-cols-7 mb-2",
    weekday: `text-xs font-semibold text-center py-2 uppercase tracking-wide text-cl-text-tertiary`,
    day: `relative w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-cl-accent focus:ring-offset-1 hover:bg-cl-bg-hover text-cl-text dark:hover:bg-cl-text/10 dark:text-cl-text`,
    // Selected day uses the brand accent so it reads in both modes —
    // bg-cl-text would be off-white in dark mode (the giant-white-circle
    // bug) and turning to literal `bg-cl-text` flips the day's foreground
    // to the surface tone, making the day number invisible inside the
    // selected pill.
    daySelected: `bg-cl-accent text-white hover:bg-cl-accent dark:bg-cl-accent dark:text-white dark:hover:bg-cl-accent`,
    dayToday: `ring-2 ring-inset font-semibold ring-cl-accent dark:ring-cl-accent`,
    // Disabled days: 40 % opacity is enough to read as "not allowed"
    // without dropping into illegibility. The `!` important overrides
    // the base `text-cl-text` that would otherwise win source-order
    // cascade and keep disabled days looking the same colour as enabled.
    dayDisabled: `cursor-not-allowed hover:bg-transparent !text-cl-text-disabled opacity-40`,
    dayOutside: dark ? "text-cl-text-secondary" : "text-cl-text-secondary",
    // Range start/end: solid accent pill, but DON'T strip the half-radius
    // the base day class provides. The base is `rounded-full` (40 px); start
    // keeps its left corners full, square right; end keeps its right corners
    // full, square left. `hover:bg-cl-accent` (no opacity change) keeps the
    // hover state from washing the selected pill out into the lighter
    // hover overlay.
    dayRangeStart: `bg-cl-accent text-white hover:bg-cl-accent dark:bg-cl-accent dark:text-white dark:hover:bg-cl-accent rounded-r-none`,
    dayRangeEnd: `bg-cl-accent text-white hover:bg-cl-accent dark:bg-cl-accent dark:text-white dark:hover:bg-cl-accent rounded-l-none`,
    // Middle range tint: 18 % in light mode (was 10 % — invisible against
    // cream paper), 22 % in dark mode. Hover deepens to 25/30 % so middle
    // days have an interactive feedback in the range strip.
    dayRangeMiddle: `bg-cl-accent/[0.18] hover:bg-cl-accent/25 dark:bg-cl-accent/25 dark:hover:bg-cl-accent/30 text-cl-text rounded-none`,
    dayHover: "",
    dayFocused: "ring-2 ring-cl-accent",
    dayMarked: "",
    weekNumber: `text-xs flex items-center justify-center text-cl-text-disabled`,
    presets: `flex flex-wrap gap-2 pb-4 mb-4 border-b border-cl-border`,
    presetButton: `px-3 py-1.5 text-xs font-semibold rounded-full transition-all bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover dark:bg-cl-text/6 dark:text-cl-text-secondary dark:hover:bg-cl-text/[0.12]`,
    presetActive: `bg-cl-accent/10 text-cl-accent ring-1 ring-cl-accent dark:bg-cl-accent/20 dark:text-cl-accent dark:ring-1 dark:ring-cl-accent/30`,
    footer: `flex justify-center pt-4 mt-4 border-t border-cl-border`,
    todayButton: `flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-cl-md transition-all text-cl-accent hover:bg-cl-bg-elevated`,
    markerIndicator: `w-1 h-1 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2 bg-cl-accent dark:bg-cl-accent/90`,
    markerTooltip: `absolute z-50 px-3 py-2 text-xs rounded-cl-md shadow-lg max-w-[200px] bg-cl-bg text-white dark:bg-cl-bg-elevated dark:text-cl-text`,
    monthSelect: `flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated`,
    yearSelect: `flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated`,
    monthDropdown: "",
    yearDropdown: "",
 dropdownMenu: `absolute z-[60] mt-1 max-h-60 overflow-auto rounded-cl-md shadow-lg py-1 min-w-[140px] bg-cl-bg-elevated border border-cl-border`,
    dropdownItem: `flex items-center justify-between w-full px-3 py-2 text-sm text-left cursor-pointer text-cl-text hover:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-text/6`,
    dropdownItemSelected: `font-medium bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/10 dark:text-cl-accent`,
  },
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const DatePickerDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  // Single mode
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  // Range mode
  const [rangeValue, setRangeValue] = useState<DateRange | null>(null);
  // Independent state for each "Range Selection — Custom Colors" example
  // so picking dates in one variant doesn't propagate into the others.
  const [rangeEmerald, setRangeEmerald] = useState<DateRange | null>(null);
  const [rangeAmber, setRangeAmber] = useState<DateRange | null>(null);
  const [rangeRose, setRangeRose] = useState<DateRange | null>(null);
  const [rangeGradient, setRangeGradient] = useState<DateRange | null>(null);
  // Multiple mode
  const [multipleDates, setMultipleDates] = useState<Date[] | null>(null);
  // Controlled
  const [controlledDate, setControlledDate] = useState<Date | null>(new Date());
  // Controlled open
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [openControlDate, setOpenControlDate] = useState<Date | null>(null);
  // Event log
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [successDate, setSuccessDate] = useState<Date | null>(new Date());
  const [clearableDate, setClearableDate] = useState<Date | null>(new Date());
  const [forceBotDate, setForceBotDate] = useState<Date | null>(null);
  const [forceTopDate, setForceTopDate] = useState<Date | null>(null);
  const log = (msg: string) =>
    setEventLog((prev) => [msg, ...prev.slice(0, 4)]);

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

  // Rich event markers (holidays, absences, events)
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

  // Custom presets
  const customPresets = [
    { label: "Today", getValue: () => today },
    { label: "Yesterday", getValue: () => subDays(today, 1) },
    { label: "Start of Month", getValue: () => startOfMonth(today) },
    { label: "End of Month", getValue: () => endOfMonth(today) },
  ];

  const rangePresets = [
    {
      label: "This Week",
      getValue: () => {
        const start = startOfWeek(today, { weekStartsOn: 1 });
        return { start, end: addDays(start, 4) };
      },
    },
    {
      label: "Last 7 Days",
      getValue: () => ({ start: subDays(today, 6), end: today }),
    },
    {
      label: "Last 30 Days",
      getValue: () => ({ start: subDays(today, 29), end: today }),
    },
    {
      label: "This Month",
      getValue: () => ({ start: startOfMonth(today), end: endOfMonth(today) }),
    },
    {
      label: "Last Month",
      getValue: () => ({
        start: startOfMonth(subMonths(today, 1)),
        end: endOfMonth(subMonths(today, 1)),
      }),
    },
  ];

  return (
    <div className="space-y-10">
      <DocsHero
        title="Date Picker"
        description="A full-featured date picker supporting single, range, and multiple date selection. Includes presets, markers, locale support, keyboard navigation, week numbers, and fully customizable styling via the classes system. Requires date-fns as a peer dependency — install it alongside @chumlab/ui."
        code={`npm install @chumlab/ui date-fns

import { DatePicker } from "@chumlab/ui/date-picker";`}
      />

      {/* ─── Single Date ────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Default single-date mode. Click a day to select it."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            {/* Basic usage — works out-of-the-box with built-in styles */}
            <DatePicker
              value={singleDate}
              onValueChange={(date) => setSingleDate(date)}
              label="Select a date"
              placeholder="Pick a date..."
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Range Selection ────────────────────────────────────────────── */}
      <Section
        title="Date Range Selection"
        description='Use mode="range" to select a start and end date.'
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              mode="range"
              value={rangeValue}
              onValueChange={(range) => setRangeValue(range)}
              label="Select a range"
              placeholder="Start date – End date"
              showClearButton
              classes={c.datepicker}
            />
          </div>
          {rangeValue?.start && rangeValue?.end && (
            <p
              className={`mt-3 text-xs font-mono text-cl-text-secondary`}
            >
              Range: {rangeValue.start.toLocaleDateString()} –{" "}
              {rangeValue.end.toLocaleDateString()}
            </p>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Range Customization ──────────────────────────────────────── */}
      <Section
        title="Range Selection — Custom Colors"
        description="Customize the range start, end, and middle day colors, plus the trigger and calendar accent."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Emerald / teal range
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  mode="range"
                  value={rangeEmerald}
                  onValueChange={(range) => setRangeEmerald(range)}
                  placeholder="Pick a range..."
                  showClearButton
                  classes={{
                    ...c.datepicker,
                    trigger: `${c.datepicker.trigger} border border-cl-success focus-within:ring-cl-success/15 focus-within:border-cl-success dark:border dark:border-cl-success/30 dark:focus-within:ring-cl-success/30 dark:focus-within:border-cl-success/50`,
                    daySelected: `bg-cl-success text-cl-bg hover:bg-cl-success dark:bg-cl-success dark:text-cl-bg dark:hover:bg-cl-success/30`,
                    dayRangeStart: `bg-cl-success text-cl-bg dark:bg-cl-success dark:text-cl-bg rounded-r-none`,
                    dayRangeEnd: `bg-cl-success text-cl-bg dark:bg-cl-success dark:text-cl-bg rounded-l-none`,
                    dayRangeMiddle: `bg-cl-success/15 dark:bg-cl-success/20 rounded-none`,
                    dayToday: `ring-2 ring-inset font-semibold ring-cl-success dark:ring-cl-success`,
                  }}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Amber / warm range
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  mode="range"
                  value={rangeAmber}
                  onValueChange={(range) => setRangeAmber(range)}
                  placeholder="Pick a range..."
                  showClearButton
                  classes={{
                    ...c.datepicker,
                    trigger: `${c.datepicker.trigger} border border-cl-warning focus-within:ring-cl-warning/15 focus-within:border-cl-warning dark:border dark:border-cl-warning/30 dark:focus-within:ring-cl-warning/30 dark:focus-within:border-cl-warning/50`,
                    daySelected: `bg-cl-warning text-cl-bg hover:bg-cl-warning dark:bg-cl-warning dark:text-cl-bg dark:hover:bg-cl-warning/30`,
                    dayRangeStart: `bg-cl-warning text-cl-bg dark:bg-cl-warning dark:text-cl-bg rounded-r-none`,
                    dayRangeEnd: `bg-cl-warning text-cl-bg dark:bg-cl-warning dark:text-cl-bg rounded-l-none`,
                    dayRangeMiddle: `bg-cl-warning/15 dark:bg-cl-warning/15 rounded-none`,
                    dayToday: `ring-2 ring-inset font-semibold ring-cl-warning dark:ring-cl-warning`,
                  }}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Rose / pink with bold text
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  mode="range"
                  value={rangeRose}
                  onValueChange={(range) => setRangeRose(range)}
                  placeholder="Pick a range..."
                  showClearButton
                  classes={{
                    ...c.datepicker,
                    trigger: `${c.datepicker.trigger} border border-cl-border-input-focus focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:border dark:border-cl-border-input-focus/30 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
                    day: `${c.datepicker.day} font-semibold`,
                    daySelected: `bg-cl-accent text-white hover:bg-cl-accent dark:bg-cl-accent dark:text-white dark:hover:bg-cl-accent/90 font-bold`,
                    dayRangeStart: `bg-cl-accent text-white dark:bg-cl-accent dark:text-white rounded-r-none font-bold`,
                    dayRangeEnd: `bg-cl-accent text-white dark:bg-cl-accent dark:text-white rounded-l-none font-bold`,
                    dayRangeMiddle: `bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/15 dark:text-cl-accent rounded-none font-semibold`,
                    dayToday: `ring-2 ring-inset font-bold ring-cl-accent dark:ring-cl-accent`,
                    weekday: `text-xs font-bold text-center py-2 uppercase tracking-wider text-cl-accent dark:text-cl-accent/60`,
                    header: "flex items-center justify-between mb-4",
                    monthSelect: `flex items-center gap-1 px-2 py-1.5 text-sm font-bold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-accent hover:bg-cl-bg-elevated`,
                    yearSelect: `flex items-center gap-1 px-2 py-1.5 text-sm font-bold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-accent hover:bg-cl-bg-elevated`,
                    navButton: `p-1.5 rounded-cl-md transition-colors text-cl-accent hover:bg-cl-accent/10 dark:text-cl-accent dark:hover:bg-cl-accent/10`,
                  }}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Gradient-style range with rounded ends
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  mode="range"
                  value={rangeGradient}
                  onValueChange={(range) => setRangeGradient(range)}
                  placeholder="Pick a range..."
                  showClearButton
                  classes={{
                    ...c.datepicker,
                    daySelected: `bg-cl-accent text-white hover:bg-cl-accent dark:bg-cl-accent dark:text-white dark:hover:bg-cl-accent/90`,
                    dayRangeStart: `bg-cl-accent text-white dark:bg-cl-accent dark:text-white rounded-l-full rounded-r-none`,
                    dayRangeEnd: `bg-cl-accent text-white dark:bg-cl-accent dark:text-white rounded-r-full rounded-l-none`,
                    dayRangeMiddle: `bg-cl-accent/10 dark:bg-cl-accent/20 rounded-none`,
                    dayToday: `ring-2 ring-inset font-semibold ring-cl-accent dark:ring-cl-accent`,
                  }}
                />
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Multiple Selection ─────────────────────────────────────────── */}
      <Section
        title="Multiple Date Selection"
        description='Use mode="multiple" to select multiple individual dates.'
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              mode="multiple"
              value={multipleDates}
              onValueChange={(dates) => setMultipleDates(dates)}
              label="Select dates"
              placeholder="Pick multiple dates..."
              showClearButton
              classes={c.datepicker}
            />
          </div>
          {multipleDates && multipleDates.length > 0 && (
            <p
              className={`mt-3 text-xs font-mono text-cl-text-secondary`}
            >
              Selected: {multipleDates.length} date
              {multipleDates.length !== 1 ? "s" : ""}
            </p>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── With Presets ───────────────────────────────────────────────── */}
      <Section
        title="Date Presets"
        description="Quick-select common dates with showPresets."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              mode="range"
              value={rangeValue}
              onValueChange={(range) => setRangeValue(range)}
              label="Date range with presets"
              placeholder="Select range..."
              showPresets
              showClearButton
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Markers ────────────────────────────────────────────────────── */}
      <Section
        title="Date Markers"
        description="Highlight specific dates with colored indicator dots and hover tooltips showing event details."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Indicator dots + tooltips (hover to see details)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  value={singleDate}
                  onValueChange={(date) => setSingleDate(date)}
                  label="Calendar with markers"
                  placeholder="Pick a date..."
                  markers={markers}
                  showMarkerIndicator
                  showMarkerTooltip
                  showTodayIndicator
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Indicator dots only (no tooltip)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Dots only..."
                  markers={markers}
                  showMarkerIndicator
                  showMarkerTooltip={false}
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Dots with custom colors (no tooltips)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Colored dots..."
                  markers={[
                    { date: addDays(today, 1), label: "Red", color: "#ef4444" },
                    {
                      date: addDays(today, 3),
                      label: "Green",
                      color: "#22c55e",
                    },
                    {
                      date: addDays(today, 5),
                      label: "Blue",
                      color: "#3b82f6",
                    },
                    {
                      date: addDays(today, 7),
                      label: "Amber",
                      color: "#f59e0b",
                    },
                    {
                      date: addDays(today, 9),
                      label: "Purple",
                      color: "#8b5cf6",
                    },
                  ]}
                  showMarkerIndicator
                  showMarkerTooltip={false}
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Disabled Dates ─────────────────────────────────────────────── */}
      <Section
        title="Disabled Dates"
        description="Disable specific dates, date ranges, days of week, or custom logic."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Disable past dates
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="No past dates"
                  disabledDates={{ disablePast: true }}
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Disable weekends
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="No weekends"
                  disabledDates={{ daysOfWeek: [0, 6] }}
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Min/max date range
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Limited range"
                  minDate={subDays(today, 7)}
                  maxDate={addDays(today, 30)}
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Two Months ─────────────────────────────────────────────────── */}
      <Section
        title="Multiple Months"
        description="Display two months side by side with numberOfMonths={2}."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-md">
            <DatePicker
              mode="range"
              value={rangeValue}
              onValueChange={(range) => setRangeValue(range)}
              label="Two-month range picker"
              placeholder="Select range..."
              numberOfMonths={2}
              showClearButton
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Week Numbers ───────────────────────────────────────────────── */}
      <Section
        title="Week Numbers"
        description="Show ISO week numbers with showWeekNumbers."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              placeholder="With week numbers"
              showWeekNumbers
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Today Button & Indicator ─────────────────────────────────── */}
      <Section
        title="Today Button & Indicator"
        description="showTodayIndicator adds a ring on today's date. showTodayButton adds a footer button. Both are independent and off by default."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Default — no indicator, no footer
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Clean calendar"
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Today indicator only (ring on today, no footer)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Indicator only"
                  showTodayIndicator
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Today button only (footer, no ring)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Button only"
                  showTodayButton
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Both — indicator ring + footer button
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Both enabled"
                  showTodayIndicator
                  showTodayButton
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Monday Start ───────────────────────────────────────────────── */}
      <Section
        title="Week Starts On Monday"
        description="Set weekStartsOn={1} for Monday-first calendars."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              placeholder="Monday start"
              weekStartsOn={1}
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Error State ────────────────────────────────────────────────── */}
      <Section
        title="Error State"
        description="Show validation errors with error and errorMessage."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              label="Required date"
              placeholder="Pick a date..."
              required
              error
              errorMessage="Please select a date"
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Description ──────────────────────────────────────────── */}
      <Section
        title="With Description"
        description="Add helper text below the label."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-xs">
            <DatePicker
              label="Start Date"
              description="Select the project start date"
              placeholder="Pick a date"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Success State ────────────────────────────────────────────────── */}
      <Section
        title="Success State"
        description="Display a success message when a valid date is selected."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-xs">
            <DatePicker
              label="Event Date"
              value={successDate}
              onValueChange={(d) => setSuccessDate(d)}
              success={!!successDate}
              successMessage="Date is available"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Loading State ────────────────────────────────────────────────── */}
      <Section
        title="Loading State"
        description="Show a loading state while checking date availability."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-xs">
            <DatePicker
              label="Checking availability..."
              loading
              placeholder="Pick a date"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Clearable ────────────────────────────────────────────────────── */}
      <Section
        title="Clearable (Unified API)"
        description="Use the clearable prop as a unified alternative to showClearButton."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full sm:max-w-xs">
            <DatePicker
              label="Clearable Date"
              value={clearableDate}
              onValueChange={(d) => setClearableDate(d)}
              clearable
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Disabled ───────────────────────────────────────────────────── */}
      <Section
        title="Disabled"
        description="Disable the entire date picker."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              label="Disabled picker"
              placeholder="Cannot select"
              disabled
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Controlled ─────────────────────────────────────────────────── */}
      <Section
        title="Controlled Mode"
        description="External state control via value + onChange."
        isDarkMode={dark}
      >
        <div
          className={`mb-3 p-3 rounded-cl-md flex items-center gap-3 flex-wrap bg-cl-bg-elevated`}
        >
          <span
            className={`text-xs font-medium text-cl-text-secondary`}
          >
            Value:
          </span>
          <span
            className={`text-sm font-mono text-cl-text-secondary`}
          >
            {controlledDate?.toLocaleDateString() ?? "null"}
          </span>
          <button
            className={`ml-auto px-3 py-1 text-xs font-medium rounded-cl-md bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated`}
            onClick={() => setControlledDate(null)}
          >
            Clear
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded-cl-md bg-cl-accent text-white hover:bg-cl-accent/90`}
            onClick={() => setControlledDate(new Date())}
          >
            Set Today
          </button>
        </div>
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              value={controlledDate}
              onValueChange={(date) => setControlledDate(date)}
              label="Controlled"
              placeholder="Pick a date..."
              showClearButton
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Controlled Open State ──────────────────────────────────────── */}
      <Section
        title="Controlled Open"
        description="Externally control the calendar open state with open + onOpenChange."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-cl-md bg-cl-accent text-white hover:bg-cl-accent/90 shrink-0`}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setCalendarOpen((o) => !o)}
            >
              {calendarOpen ? "Close" : "Open"} Calendar
            </button>
            <div className="w-full sm:max-w-xs">
              <DatePicker
                value={openControlDate}
                onValueChange={(date) => setOpenControlDate(date)}
                open={calendarOpen}
                onOpenChange={setCalendarOpen}
                placeholder="Controlled open..."
                classes={c.datepicker}
              />
            </div>
            <span
              className={`text-sm text-cl-text-secondary`}
            >
              Open: {String(calendarOpen)} | Selected:{" "}
              {openControlDate?.toLocaleDateString() ?? "none"}
            </span>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Default Open ─────────────────────────────────────────────────── */}
      <Section
        title="Default Open"
        description="Start with the calendar open using defaultOpen."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              defaultOpen
              placeholder="Starts open..."
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Full Width ─────────────────────────────────────────────────── */}
      <Section
        title="Full Width"
        description="Use fullWidth to span the trigger across the container."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <DatePicker
            placeholder="Full width date picker"
            fullWidth
            classes={c.datepicker}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Events Calendar (Holidays, Absences, Deadlines) ────────────── */}
      <Section
        title="Events Calendar (Holidays, Absences, Deadlines)"
        description="Real-world SaaS use case: team calendar with different event types. Each marker type has a unique color. Hover marked dates to see tooltip with event details."
        isDarkMode={dark}
      >
        <div
          className={`mb-3 p-3 rounded-cl-md bg-cl-bg-elevated`}
        >
          <p
            className={`text-xs font-medium mb-2 text-cl-text-secondary`}
          >
            Legend
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { color: "#6366f1", label: "Event" },
              { color: "#22c55e", label: "Holiday" },
              { color: "#f59e0b", label: "Absence / PTO" },
              { color: "#ef4444", label: "Deadline" },
            ].map(({ color, label: lbl }) => (
              <div key={lbl} className="flex items-center gap-2">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                />
                <span
                  className={`text-xs text-cl-text-secondary`}
                >
                  {lbl}
                </span>
              </div>
            ))}
          </div>
        </div>
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
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
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
        <div className={c.note}>
          Each marker has{" "}
          <code
            className={`px-1 py-0.5 rounded text-[11px] font-mono bg-cl-bg-elevated text-cl-text-secondary`}
          >
            type
          </code>
          ,{" "}
          <code
            className={`px-1 py-0.5 rounded text-[11px] font-mono bg-cl-bg-elevated text-cl-text-secondary`}
          >
            color
          </code>
          ,{" "}
          <code
            className={`px-1 py-0.5 rounded text-[11px] font-mono bg-cl-bg-elevated text-cl-text-secondary`}
          >
            label
          </code>
          , and optional{" "}
          <code
            className={`px-1 py-0.5 rounded text-[11px] font-mono bg-cl-bg-elevated text-cl-text-secondary`}
          >
            description
          </code>
          . Colored dots appear on marked dates. Hover to see the tooltip with
          event name, description, and type.
        </div>
      </Section>

      {/* ─── Custom Presets ──────────────────────────────────────────────── */}
      <Section
        title="Custom Presets (Single)"
        description="Provide your own preset options with the presets prop."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              value={singleDate}
              onValueChange={(date) => setSingleDate(date)}
              label="Custom presets"
              placeholder="Pick a date..."
              showPresets
              presets={customPresets}
              showClearButton
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Range Presets ───────────────────────────────────────────────── */}
      <Section
        title="Custom Range Presets"
        description="Common range presets for analytics dashboards."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              mode="range"
              value={rangeValue}
              onValueChange={(range) => setRangeValue(range)}
              label="Analytics period"
              placeholder="Select range..."
              showPresets
              presets={rangePresets}
              showClearButton
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Locale ─────────────────────────────────────────────────────── */}
      <Section
        title="Locale Support"
        description="Pass a date-fns locale for localized month names, weekdays, and formatting."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>French</p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Choisir une date..."
                  locale={fr}
                  weekStartsOn={1}
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>German</p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Datum auswählen..."
                  locale={de}
                  weekStartsOn={1}
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Date Format ────────────────────────────────────────────────── */}
      <Section
        title="Custom Date Format"
        description="Control how the selected date is displayed in the trigger."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          {[
            { label: 'Default: "MMM d, yyyy"', format: "MMM d, yyyy" },
            { label: '"dd/MM/yyyy"', format: "dd/MM/yyyy" },
            { label: '"yyyy-MM-dd" (ISO)', format: "yyyy-MM-dd" },
            { label: '"EEEE, MMMM d" (full day)', format: "EEEE, MMMM d" },
          ].map(({ label: lbl, format: fmt }) => (
            <div key={fmt}>
              <p className={`text-xs font-medium mb-2 ${c.label}`}>{lbl}</p>
              <DemoWrapper
                isDarkMode={dark}
                layout="block"
                className="overflow-visible"
              >
                <div className="w-full sm:max-w-xs">
                  <DatePicker
                    value={controlledDate}
                    onValueChange={setControlledDate}
                    dateFormat={fmt}
                    showClearButton
                    classes={c.datepicker}
                  />
                </div>
              </DemoWrapper>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Outside Days ───────────────────────────────────────────────── */}
      <Section
        title="Outside Days"
        description="Toggle visibility and selectability of days from adjacent months."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              showOutsideDays=true (default) + selectable
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Outside days visible & selectable"
                  showOutsideDays
                  outsideDaysSelectable
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              showOutsideDays=false
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Outside days hidden"
                  showOutsideDays={false}
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Fixed Weeks ────────────────────────────────────────────────── */}
      <Section
        title="Fixed Weeks"
        description="Always render 6 rows so the calendar height never changes between months."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              placeholder="Fixed 6 weeks"
              fixedWeeks
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Specific Disabled Dates ────────────────────────────────────── */}
      <Section
        title="Disable Specific Dates"
        description="Blacklist individual dates or use a custom function."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Specific dates disabled
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Some dates blocked"
                  disabledDates={{
                    dates: [
                      addDays(today, 1),
                      addDays(today, 3),
                      addDays(today, 7),
                    ],
                  }}
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Custom function (only allow Tuesdays and Thursdays)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Tue & Thu only"
                  disabledDates={{
                    custom: (date) =>
                      date.getDay() !== 2 && date.getDay() !== 4,
                  }}
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Callbacks ──────────────────────────────────────────────────── */}
      <Section
        title="Event Callbacks"
        description="onOpenChange, onMonthChange, and onClear callbacks."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              label="Watch the log below"
              placeholder="Interact with me..."
              showClearButton
              onOpenChange={(isOpen) =>
                log(`onOpenChange: ${isOpen ? "opened" : "closed"}`)
              }
              onMonthChange={(month) =>
                log(`onMonthChange: ${month.toLocaleDateString()}`)
              }
              onClear={() => log("onClear fired")}
              onValueChange={(date) => {
                setSingleDate(date);
                if (date) log(`onValueChange: ${date.toLocaleDateString()}`);
              }}
              value={singleDate}
              classes={c.datepicker}
            />
          </div>
          {eventLog.length > 0 && (
            <div
              className={`mt-3 text-xs font-mono space-y-1 text-cl-text-secondary`}
            >
              {eventLog.map((entry, i) => (
                <div key={i}>{entry}</div>
              ))}
            </div>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Classes System ─────────────────────────────────────────────── */}
      <Section
        title="Classes System"
        description="Override any internal element via the classes prop — 40+ slots for trigger, calendar, days, header, weekdays, presets, footer, dropdowns, and more."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Custom accent color (pink)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Pink theme"
                  classes={{
                    ...c.datepicker,
                    trigger: `${c.datepicker.trigger} border border-cl-border-input-focus focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:border dark:border-cl-border-input-focus/30 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
                    daySelected: `bg-cl-accent text-white hover:bg-cl-accent dark:bg-cl-accent dark:text-white dark:hover:bg-cl-accent/90`,
                    dayToday: `ring-2 ring-inset font-semibold ring-cl-accent dark:ring-cl-accent`,
                  }}
                  showTodayIndicator
                  showClearButton
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Large fonts — bigger weekdays, day numbers, header
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="max-w-sm">
                <DatePicker
                  placeholder="Large calendar"
                  classes={{
                    ...c.datepicker,
                    calendar: `${c.datepicker.calendar} p-6`,
                    weekday: `text-sm font-bold text-center py-3 uppercase tracking-wider text-cl-text-secondary`,
                    day: `relative w-12 h-12 flex items-center justify-center text-base font-semibold rounded-full cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-cl-accent focus:ring-offset-1 hover:bg-cl-bg-hover text-cl-text dark:hover:bg-cl-text/10 dark:text-cl-text`,
                    daySelected: c.datepicker.daySelected,
                    dayToday: c.datepicker.dayToday,
                    dayDisabled: c.datepicker.dayDisabled,
                    dayOutside: c.datepicker.dayOutside,
                    header: "flex items-center justify-between mb-6",
                    monthSelect: `flex items-center gap-1 px-3 py-2 text-base font-bold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated`,
                    yearSelect: `flex items-center gap-1 px-3 py-2 text-base font-bold bg-transparent border border-none cursor-pointer rounded-cl-md transition-colors text-cl-text hover:bg-cl-bg-elevated`,
                    label: `block text-base font-semibold mb-2 text-cl-text`,
                  }}
                  label="Large Calendar"
                  showTodayIndicator
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Compact — smaller everything
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="max-w-[220px]">
                <DatePicker
                  placeholder="Compact"
                  classes={{
                    ...c.datepicker,
                    trigger: `flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-cl-md border text-xs transition-all cursor-pointer bg-white border-cl-border text-cl-text shadow-sm dark:bg-cl-text/4 dark:border dark:border-cl-text/10 dark:text-cl-text`,
 calendar: `rounded-cl-md shadow-lg p-2.5 bg-cl-bg-elevated border border-cl-border`,
                    calendarIcon: `w-3.5 h-3.5 shrink-0 text-cl-text-tertiary`,
                    header: "flex items-center justify-between mb-2",
                    weekday: `text-[10px] font-semibold text-center py-1 uppercase text-cl-text-tertiary`,
                    day: `relative w-7 h-7 flex items-center justify-center text-[11px] font-medium rounded-full cursor-pointer transition-all focus:outline-none hover:bg-cl-bg-hover text-cl-text dark:hover:bg-cl-text/10 dark:text-cl-text-secondary`,
                    daySelected: c.datepicker.daySelected,
                    dayToday: c.datepicker.dayToday,
                    dayDisabled: c.datepicker.dayDisabled,
                    dayOutside: c.datepicker.dayOutside,
                    monthSelect: `flex items-center gap-0.5 px-1.5 py-1 text-xs font-semibold bg-transparent border border-none cursor-pointer rounded transition-colors text-cl-text hover:bg-cl-bg-elevated`,
                    yearSelect: `flex items-center gap-0.5 px-1.5 py-1 text-xs font-semibold bg-transparent border border-none cursor-pointer rounded transition-colors text-cl-text hover:bg-cl-bg-elevated`,
                    navButton: `p-1 rounded transition-colors text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-elevated`,
                    footer: `flex justify-center pt-2 mt-2 border-t border-cl-border`,
                    todayButton: `flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-all text-cl-accent hover:bg-cl-bg-elevated`,
                  }}
                  showTodayIndicator
                  showTodayButton
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Custom nav buttons and trigger border
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Custom nav"
                  classes={{
                    ...c.datepicker,
                    trigger: `${c.datepicker.trigger} rounded-cl-lg border border-cl-success dark:border dark:border-cl-success/30`,
                    navButton: `p-2 rounded-cl-lg transition-colors text-cl-success hover:bg-cl-success/15 dark:text-cl-success dark:hover:bg-cl-success/10`,
                    daySelected: `bg-cl-success text-cl-bg hover:bg-cl-success dark:bg-cl-success dark:text-cl-bg dark:hover:bg-cl-success/30`,
                    dayToday: `ring-2 ring-inset font-semibold ring-cl-success dark:ring-cl-success`,
                  }}
                  showTodayIndicator
                  showClearButton
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Custom presets styling
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  mode="range"
                  value={rangeValue}
                  onValueChange={(range) => setRangeValue(range)}
                  placeholder="Styled presets"
                  showPresets
                  showClearButton
                  classes={{
                    ...c.datepicker,
 presetButton: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-all bg-cl-bg-hover text-cl-text-secondary hover:bg-cl-bg-hover border border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text-secondary dark:hover:bg-cl-text/10`,
                    presetActive: `bg-cl-accent/10 text-cl-accent border border-cl-border-input-focus dark:bg-cl-accent/20 dark:text-cl-accent dark:border dark:border-cl-border-input-focus/30`,
                  }}
                />
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Scroll Behavior ───────────────────────────────────────────── */}
      <Section
        title="Scroll Behavior"
        description="By default the calendar follows the trigger on scroll. Set lockScroll to lock body scroll while the calendar is open."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Default — calendar repositions on scroll
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Scroll the page..."
                  showClearButton
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              lockScroll=true — body scroll disabled while open
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  placeholder="Open me, then try scrolling..."
                  lockScroll
                  showClearButton
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Dropdown Position ───────────────────────────────────────────── */}
      <Section
        title="Dropdown Position"
        description="Control whether the calendar opens above or below the trigger. Auto-flips when there isn't enough space."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              dropdownPosition=&quot;bottom&quot; (default, auto-flips)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  value={forceBotDate}
                  onValueChange={(d) => setForceBotDate(d)}
                  dropdownPosition="bottom"
                  placeholder="Opens below..."
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              forceDropdownPosition (forced bottom, no auto-flip)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  value={forceTopDate}
                  onValueChange={(d) => setForceTopDate(d)}
                  dropdownPosition="bottom"
                  forceDropdownPosition
                  placeholder="Always opens below..."
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              forceDropdownPosition (forced top, no auto-flip)
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  dropdownPosition="top"
                  forceDropdownPosition
                  placeholder="Always opens above..."
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              forceDropdownPosition + lockScroll
            </p>
            <DemoWrapper
              isDarkMode={dark}
              layout="block"
              className="overflow-visible"
            >
              <div className="w-full sm:max-w-xs">
                <DatePicker
                  dropdownPosition="bottom"
                  forceDropdownPosition
                  lockScroll
                  placeholder="Forced bottom + scroll locked"
                  classes={c.datepicker}
                />
              </div>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Custom Icons ───────────────────────────────────────────────── */}
      <Section
        title="Custom Icons"
        description="Replace any icon — calendar, clear, nav arrows, today button."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              placeholder="Custom icons"
              calendarIcon={<span className="text-lg">📅</span>}
              clearIcon={<span className="text-sm">✕</span>}
              prevMonthIcon={<span className="text-sm">◀</span>}
              nextMonthIcon={<span className="text-sm">▶</span>}
              prevYearIcon={<span className="text-sm">⏪</span>}
              nextYearIcon={<span className="text-sm">⏩</span>}
              todayIcon={<span className="text-sm">⏱</span>}
              showTodayButton
              showTodayIndicator
              showClearButton
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Reduce Motion ──────────────────────────────────────────────── */}
      <Section
        title="Reduce Motion"
        description="Set reduceMotion={true} to disable all transitions."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            <DatePicker
              placeholder="No transitions"
              reduceMotion={true}
              classes={c.datepicker}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Props Tables ───────────────────────────────────────────────── */}
      <Section title="DatePicker Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="mode"
              type='"single"|"range"|"multiple"'
              defaultVal='"single"'
              description="Date selection mode"
              isDarkMode={dark}
            />
            <PropRow
              name="value"
              type="Date | null (single) · DateRange | null (range) · Date[] | null (multiple)"
              description="Selected value — type depends on mode"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(value, richValue) => void"
              description="Fires when selection changes — callback signature depends on mode"
              isDarkMode={dark}
            />
            <PropRow
              name="onClear"
              type="() => void"
              description="Clear callback"
              isDarkMode={dark}
            />
            <PropRow
              name="minDate"
              type="Date"
              description="Minimum selectable date"
              isDarkMode={dark}
            />
            <PropRow
              name="maxDate"
              type="Date"
              description="Maximum selectable date"
              isDarkMode={dark}
            />
            <PropRow
              name="disabledDates"
              type="DisabledDateOptions"
              description="Disabled dates configuration"
              isDarkMode={dark}
            />
            <PropRow
              name="weekStartsOn"
              type="0-6"
              defaultVal="0"
              description="First day of week (0=Sunday)"
              isDarkMode={dark}
            />
            <PropRow
              name="locale"
              type="Locale"
              description="date-fns locale object"
              isDarkMode={dark}
            />
            <PropRow
              name="numberOfMonths"
              type="number"
              defaultVal="1"
              description="Months to display side by side"
              isDarkMode={dark}
            />
            <PropRow
              name="dateFormat"
              type="string"
              defaultVal='"MMM d, yyyy"'
              description="Display format string"
              isDarkMode={dark}
            />
            <PropRow
              name="showTodayIndicator"
              type="boolean"
              defaultVal="false"
              description="Highlight today with a ring"
              isDarkMode={dark}
            />
            <PropRow
              name="showTodayButton"
              type="boolean"
              defaultVal="false"
              description="Show jump-to-today footer button"
              isDarkMode={dark}
            />
            <PropRow
              name="showWeekNumbers"
              type="boolean"
              defaultVal="false"
              description="Show ISO week numbers"
              isDarkMode={dark}
            />
            <PropRow
              name="showOutsideDays"
              type="boolean"
              defaultVal="true"
              description="Show days from adjacent months"
              isDarkMode={dark}
            />
            <PropRow
              name="fixedWeeks"
              type="boolean"
              defaultVal="false"
              description="Always show 6 weeks"
              isDarkMode={dark}
            />
            <PropRow
              name="showPresets"
              type="boolean"
              defaultVal="false"
              description="Show preset quick-select buttons"
              isDarkMode={dark}
            />
            <PropRow
              name="presets"
              type="DatePreset[]"
              description="Custom presets (auto-generated if omitted)"
              isDarkMode={dark}
            />
            <PropRow
              name="markers"
              type="DateMarker[]"
              description="Dates to highlight with indicators"
              isDarkMode={dark}
            />
            <PropRow
              name="showMarkerIndicator"
              type="boolean"
              defaultVal="false"
              description="Show colored dots on marked dates"
              isDarkMode={dark}
            />
            <PropRow
              name="showMarkerTooltip"
              type="boolean"
              defaultVal="false"
              description="Show tooltip on hover for marked dates"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="ReactNode"
              description="Label above trigger"
              isDarkMode={dark}
            />
            <PropRow
              name="placeholder"
              type="string"
              description="Trigger placeholder text"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disable the picker"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="boolean"
              defaultVal="false"
              description="Error state"
              isDarkMode={dark}
            />
            <PropRow
              name="errorMessage"
              type="ReactNode"
              description="Error text below trigger"
              isDarkMode={dark}
            />
            <PropRow
              name="required"
              type="boolean"
              defaultVal="false"
              description="Required field"
              isDarkMode={dark}
            />
            <PropRow
              name="fullWidth"
              type="boolean"
              defaultVal="false"
              description="Full width trigger"
              isDarkMode={dark}
            />
            <PropRow
              name="showClearButton"
              type="boolean"
              defaultVal="false"
              description="Show clear button in trigger"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="DatePickerClasses"
              description="Slot class overrides (40+ slots)"
              isDarkMode={dark}
            />
            <PropRow
              name="unstyled"
              type="boolean"
              defaultVal="false"
              description="Strip all default classes"
              isDarkMode={dark}
            />
            <PropRow
              name="reduceMotion"
              type='boolean|"auto"'
              defaultVal='"auto"'
              description="Disable transitions"
              isDarkMode={dark}
            />
            <PropRow
              name="portalContainer"
              type="HTMLElement | null"
              defaultVal="document.body"
              description="Calendar portal target"
              isDarkMode={dark}
            />
            <PropRow
              name="lockScroll"
              type="boolean"
              defaultVal="false"
              description="Lock body scroll while calendar is open"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownPosition"
              type='"top" | "bottom"'
              defaultVal='"bottom"'
              description="Preferred calendar position (auto-flips when insufficient space)"
              isDarkMode={dark}
            />
            <PropRow
              name="forceDropdownPosition"
              type="boolean"
              defaultVal="false"
              description="When true, locks the calendar to the specified dropdownPosition without auto-flipping"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownZIndex"
              type="number"
              defaultVal="50"
              description="z-index of the calendar popup"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownGap"
              type="number"
              defaultVal="4"
              description="Gap in pixels between trigger and calendar popup"
              isDarkMode={dark}
            />
            <PropRow
              name="open"
              type="boolean"
              description="Controlled open state of the calendar"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultOpen"
              type="boolean"
              defaultVal="false"
              description="Default open state (uncontrolled)"
              isDarkMode={dark}
            />
            <PropRow
              name="onOpenChange"
              type="(open: boolean) => void"
              description="Called when the open state changes"
              isDarkMode={dark}
            />
            <PropRow
              name="onMonthChange"
              type="(month) => void"
              description="Month navigation callback"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-disabled"
              type="root, trigger"
              description="Present when disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-error"
              type="root"
              description="Present when error=true"
              isDarkMode={dark}
            />
            <PropRow
              name="data-open"
              type="root"
              description="Present when calendar is open"
              isDarkMode={dark}
            />
            <PropRow
              name="data-success"
              type="root"
              description="Present when success=true (without error)"
              isDarkMode={dark}
            />
            <PropRow
              name="data-loading"
              type="root"
              description="Present when loading=true"
              isDarkMode={dark}
            />
            <PropRow
              name="data-mode"
              type="root"
              description='"single" | "range" | "multiple"'
              isDarkMode={dark}
            />
            <PropRow
              name="data-today"
              type="day cell"
              description="Present on today's date"
              isDarkMode={dark}
            />
            <PropRow
              name="data-selected"
              type="day cell"
              description="Present on selected dates"
              isDarkMode={dark}
            />
            <PropRow
              name="data-outside"
              type="day cell"
              description="Present on outside-month days"
              isDarkMode={dark}
            />
            <PropRow
              name="data-range-start"
              type="day cell"
              description="Present on range start"
              isDarkMode={dark}
            />
            <PropRow
              name="data-range-end"
              type="day cell"
              description="Present on range end"
              isDarkMode={dark}
            />
            <PropRow
              name="data-in-range"
              type="day cell"
              description="Present on days within range"
              isDarkMode={dark}
            />
            <PropRow
              name="data-marked"
              type="day cell"
              description="Present on marked dates"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section
        title="Accessibility"
        description="Built-in accessibility features."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              'Calendar grid uses role="grid" with accessible row and cell structure',
              "aria-label on each day cell announces the full date for screen readers",
              "Month and year navigation buttons are labeled for assistive technology",
              "Date range selection is announced with start and end dates",
              "Disabled dates are marked with aria-disabled and excluded from tab order",
              "Full keyboard navigation within the calendar grid",
              "aria-invalid set on the trigger when error=true",
              "aria-describedby links error and success messages to the trigger",
              "label prop auto-associated with trigger via htmlFor",
              "aria-expanded on trigger reflects calendar open state",
              "Day cells announce selected, today, and disabled states",
              "Markers accessible via tooltip on hover/focus",
              "prefers-reduced-motion respected via reduceMotion prop",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 text-cl-success`}
                >
                  &#10003;
                </span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className={`${c.card} mt-3`}>
          <p
            className={`text-xs font-semibold mb-3 text-cl-text-secondary`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              ["Tab", "Move focus to/from the trigger"],
              ["Arrow Left / Right", "Move to previous/next day"],
              ["Arrow Up / Down", "Move to previous/next week"],
              ["Enter / Space", "Open calendar / select focused date"],
              ["Escape", "Close calendar, restore focus to trigger"],
              ["Page Up", "Go to previous month"],
              ["Page Down", "Go to next month"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `value` with `onValueChange` for controlled usage — the value type depends on `mode` (Date for single, DateRange for range, Date[] for multiple). For calendar visibility, omit `open` to let the component manage it, or pass `open` + `onOpenChange` for external control. Use `defaultOpen` to start with the calendar open."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Time zones: store UTC in backend and format in UI when locale matters.",
          "Disabled and blackout dates must stay in sync with server rules.",
          "Mobile viewports: verify popover position and scroll lock with your layout shell.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide a visible label or `aria-label` / `aria-labelledby` on the trigger.",
          "Use `minDate` / `maxDate` to match business constraints.",
          "Announce errors with `errorMessage` and `error` for assistive tech.",
        ]}
        donts={[
          "Do not switch modes (single/range/multiple) after mount without resetting state.",
          "Do not block keyboard navigation inside the calendar for custom skins.",
          "Do not rely on placeholder alone for the accessible name.",
        ]}
      />
    </div>
  );
};

export default DatePickerDemo;
