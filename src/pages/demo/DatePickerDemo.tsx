import { useState } from "react";
import {
  DatePicker,
  type DateRange,
  type DateMarker,
} from "../../components/DatePicker";
import { useTheme } from "./ThemeContext";
import {
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
    trigger: `flex items-center gap-2 w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all cursor-pointer ${
      dark
        ? "bg-white/4 border-white/10 text-gray-200 hover:border-white/20 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400/50"
        : "bg-white border-gray-200 text-gray-900 shadow-sm shadow-gray-900/[0.04] hover:border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500/15 focus-within:border-indigo-400"
    }`,
    input: "flex-1 text-left truncate",
    calendarIcon: `w-5 h-5 shrink-0 ${dark ? "text-gray-500" : "text-gray-400"}`,
    clearButton: `p-1 rounded-full transition-colors shrink-0 ${dark ? "text-gray-500 hover:text-gray-300 hover:bg-white/10" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`,
    label: `block text-[13px] font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`,
    error: `text-xs mt-1.5 ${dark ? "text-red-400" : "text-red-500"}`,
    calendar: `rounded-xl shadow-xl p-4 ${dark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`,
    header: "flex items-center justify-between mb-4",
    monthNav: "flex items-center gap-1",
    navButton: `p-1.5 rounded-lg transition-colors ${dark ? "text-gray-400 hover:text-gray-200 hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`,
    navButtonDisabled: "opacity-30 cursor-not-allowed hover:bg-transparent",
    monthGrid: "flex gap-8",
    grid: "",
    weekdayHeader: "grid grid-cols-7 mb-2",
    weekday: `text-xs font-semibold text-center py-2 uppercase tracking-wide ${dark ? "text-gray-500" : "text-gray-400"}`,
    day: `relative w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${dark ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-100 text-gray-900"}`,
    daySelected: `${dark ? "bg-indigo-500 text-white hover:bg-indigo-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`,
    dayToday: `ring-2 ring-inset font-semibold ${dark ? "ring-indigo-400" : "ring-indigo-500"}`,
    dayDisabled: `cursor-not-allowed hover:bg-transparent ${dark ? "text-gray-600" : "text-gray-300"}`,
    dayOutside: dark ? "text-gray-600" : "text-gray-300",
    dayRangeStart: `${dark ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white"} rounded-r-none`,
    dayRangeEnd: `${dark ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white"} rounded-l-none`,
    dayRangeMiddle: `${dark ? "bg-indigo-500/20" : "bg-indigo-100"} rounded-none`,
    dayHover: "",
    dayFocused: "ring-2 ring-indigo-400",
    dayMarked: "",
    weekNumber: `text-xs flex items-center justify-center ${dark ? "text-gray-600" : "text-gray-400"}`,
    presets: `flex flex-wrap gap-2 pb-4 mb-4 border-b ${dark ? "border-gray-700" : "border-gray-100"}`,
    presetButton: `px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${dark ? "bg-white/6 text-gray-300 hover:bg-white/[0.12]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
    presetActive: `${dark ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30" : "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300"}`,
    footer: `flex justify-center pt-4 mt-4 border-t ${dark ? "border-gray-700" : "border-gray-100"}`,
    todayButton: `flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${dark ? "text-indigo-400 hover:bg-indigo-500/10" : "text-indigo-600 hover:bg-indigo-50"}`,
    markerIndicator: `w-1 h-1 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2 ${dark ? "bg-indigo-400" : "bg-indigo-500"}`,
    markerTooltip: `absolute z-50 px-3 py-2 text-xs rounded-lg shadow-lg max-w-[200px] ${dark ? "bg-gray-700 text-gray-200" : "bg-gray-900 text-white"}`,
    monthSelect: `flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border-none cursor-pointer rounded-lg transition-colors ${dark ? "text-gray-200 hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`,
    yearSelect: `flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border-none cursor-pointer rounded-lg transition-colors ${dark ? "text-gray-200 hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`,
    monthDropdown: "",
    yearDropdown: "",
    dropdownMenu: `absolute z-[60] mt-1 max-h-60 overflow-auto rounded-lg shadow-lg py-1 min-w-[140px] ${dark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`,
    dropdownItem: `flex items-center justify-between w-full px-3 py-2 text-sm text-left cursor-pointer ${dark ? "text-gray-300 hover:bg-white/6" : "text-gray-700 hover:bg-gray-50"}`,
    dropdownItemSelected: `font-medium ${dark ? "bg-indigo-500/10 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`,
  },
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const DatePickerDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  // Single mode
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  // Range mode
  const [rangeValue, setRangeValue] = useState<DateRange | null>(null);
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
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className={`absolute inset-0 ${dark ? "bg-linear-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50" : "bg-linear-to-br from-indigo-50 via-white to-blue-50/80"}`}
        />
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/40"}`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${dark ? "bg-blue-500/8" : "bg-blue-200/30"}`}
        />
        <div className="relative">
          <h1
            className={`text-3xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}
          >
            Date Picker
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A full-featured date picker supporting single, range, and multiple
            date selection. Includes presets, markers, locale support, keyboard
            navigation, week numbers, and fully customizable styling via the
            classes system.
          </p>
          <div className="mt-5">
            <pre
              className={`p-3.5 rounded-xl text-[13px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all ${dark ? "bg-linear-to-br from-gray-800 to-gray-900 text-gray-300 border border-white/6" : "bg-gray-50 text-gray-700 border border-gray-200"}`}
            >
              <code>{`import { DatePicker } from "@chumlab/ui/date-picker";`}</code>
            </pre>
          </div>
        </div>
      </header>

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
              className={`mt-3 text-xs font-mono ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                  value={rangeValue}
                  onValueChange={(range) => setRangeValue(range)}
                  placeholder="Pick a range..."
                  showClearButton
                  classes={{
                    ...c.datepicker,
                    trigger: `${c.datepicker.trigger} ${dark ? "border-emerald-500/30 focus-within:ring-emerald-500/30 focus-within:border-emerald-400/50" : "border-emerald-300 focus-within:ring-emerald-500/15 focus-within:border-emerald-400"}`,
                    daySelected: `${dark ? "bg-emerald-500 text-white hover:bg-emerald-400" : "bg-emerald-600 text-white hover:bg-emerald-700"}`,
                    dayRangeStart: `${dark ? "bg-emerald-500 text-white" : "bg-emerald-600 text-white"} rounded-r-none`,
                    dayRangeEnd: `${dark ? "bg-emerald-500 text-white" : "bg-emerald-600 text-white"} rounded-l-none`,
                    dayRangeMiddle: `${dark ? "bg-emerald-500/20" : "bg-emerald-100"} rounded-none`,
                    dayToday: `ring-2 ring-inset font-semibold ${dark ? "ring-emerald-400" : "ring-emerald-500"}`,
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
                  value={rangeValue}
                  onValueChange={(range) => setRangeValue(range)}
                  placeholder="Pick a range..."
                  showClearButton
                  classes={{
                    ...c.datepicker,
                    trigger: `${c.datepicker.trigger} ${dark ? "border-amber-500/30 focus-within:ring-amber-500/30 focus-within:border-amber-400/50" : "border-amber-300 focus-within:ring-amber-500/15 focus-within:border-amber-400"}`,
                    daySelected: `${dark ? "bg-amber-500 text-white hover:bg-amber-400" : "bg-amber-500 text-white hover:bg-amber-600"}`,
                    dayRangeStart: `${dark ? "bg-amber-500 text-white" : "bg-amber-500 text-white"} rounded-r-none`,
                    dayRangeEnd: `${dark ? "bg-amber-500 text-white" : "bg-amber-500 text-white"} rounded-l-none`,
                    dayRangeMiddle: `${dark ? "bg-amber-500/15" : "bg-amber-100"} rounded-none`,
                    dayToday: `ring-2 ring-inset font-semibold ${dark ? "ring-amber-400" : "ring-amber-500"}`,
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
                  value={rangeValue}
                  onValueChange={(range) => setRangeValue(range)}
                  placeholder="Pick a range..."
                  showClearButton
                  classes={{
                    ...c.datepicker,
                    trigger: `${c.datepicker.trigger} ${dark ? "border-rose-500/30 focus-within:ring-rose-500/30 focus-within:border-rose-400/50" : "border-rose-300 focus-within:ring-rose-500/15 focus-within:border-rose-400"}`,
                    day: `${c.datepicker.day} font-semibold`,
                    daySelected: `${dark ? "bg-rose-500 text-white hover:bg-rose-400" : "bg-rose-500 text-white hover:bg-rose-600"} font-bold`,
                    dayRangeStart: `${dark ? "bg-rose-500 text-white" : "bg-rose-500 text-white"} rounded-r-none font-bold`,
                    dayRangeEnd: `${dark ? "bg-rose-500 text-white" : "bg-rose-500 text-white"} rounded-l-none font-bold`,
                    dayRangeMiddle: `${dark ? "bg-rose-500/15 text-rose-300" : "bg-rose-50 text-rose-700"} rounded-none font-semibold`,
                    dayToday: `ring-2 ring-inset font-bold ${dark ? "ring-rose-400" : "ring-rose-500"}`,
                    weekday: `text-xs font-bold text-center py-2 uppercase tracking-wider ${dark ? "text-rose-400/60" : "text-rose-400"}`,
                    header: "flex items-center justify-between mb-4",
                    monthSelect: `flex items-center gap-1 px-2 py-1.5 text-sm font-bold bg-transparent border-none cursor-pointer rounded-lg transition-colors ${dark ? "text-rose-300 hover:bg-rose-500/10" : "text-rose-700 hover:bg-rose-50"}`,
                    yearSelect: `flex items-center gap-1 px-2 py-1.5 text-sm font-bold bg-transparent border-none cursor-pointer rounded-lg transition-colors ${dark ? "text-rose-300 hover:bg-rose-500/10" : "text-rose-700 hover:bg-rose-50"}`,
                    navButton: `p-1.5 rounded-lg transition-colors ${dark ? "text-rose-400 hover:bg-rose-500/10" : "text-rose-500 hover:bg-rose-50"}`,
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
                  value={rangeValue}
                  onValueChange={(range) => setRangeValue(range)}
                  placeholder="Pick a range..."
                  showClearButton
                  classes={{
                    ...c.datepicker,
                    daySelected: `${dark ? "bg-violet-500 text-white hover:bg-violet-400" : "bg-violet-600 text-white hover:bg-violet-700"}`,
                    dayRangeStart: `${dark ? "bg-violet-500 text-white" : "bg-violet-600 text-white"} rounded-l-full rounded-r-none`,
                    dayRangeEnd: `${dark ? "bg-violet-500 text-white" : "bg-violet-600 text-white"} rounded-r-full rounded-l-none`,
                    dayRangeMiddle: `${dark ? "bg-violet-500/20" : "bg-violet-100"} rounded-none`,
                    dayToday: `ring-2 ring-inset font-semibold ${dark ? "ring-violet-400" : "ring-violet-500"}`,
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
              className={`mt-3 text-xs font-mono ${dark ? "text-gray-400" : "text-gray-500"}`}
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
          className={`mb-3 p-3 rounded-lg flex items-center gap-3 flex-wrap ${dark ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <span
            className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Value:
          </span>
          <span
            className={`text-sm font-mono ${dark ? "text-gray-300" : "text-gray-600"}`}
          >
            {controlledDate?.toLocaleDateString() ?? "null"}
          </span>
          <button
            className={`ml-auto px-3 py-1 text-xs font-medium rounded-lg ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setControlledDate(null)}
          >
            Clear
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded-lg bg-indigo-500 text-white hover:bg-indigo-600`}
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
              className={`px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 shrink-0`}
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
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
          className={`mb-3 p-3 rounded-lg ${dark ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <p
            className={`text-xs font-medium mb-2 ${dark ? "text-gray-300" : "text-gray-600"}`}
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
                  className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
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
            className={`px-1 py-0.5 rounded text-[11px] font-mono ${dark ? "bg-white/6 text-gray-300" : "bg-gray-100 text-gray-600"}`}
          >
            type
          </code>
          ,{" "}
          <code
            className={`px-1 py-0.5 rounded text-[11px] font-mono ${dark ? "bg-white/6 text-gray-300" : "bg-gray-100 text-gray-600"}`}
          >
            color
          </code>
          ,{" "}
          <code
            className={`px-1 py-0.5 rounded text-[11px] font-mono ${dark ? "bg-white/6 text-gray-300" : "bg-gray-100 text-gray-600"}`}
          >
            label
          </code>
          , and optional{" "}
          <code
            className={`px-1 py-0.5 rounded text-[11px] font-mono ${dark ? "bg-white/6 text-gray-300" : "bg-gray-100 text-gray-600"}`}
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
              className={`mt-3 text-xs font-mono space-y-1 ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                    trigger: `${c.datepicker.trigger} ${dark ? "border-pink-500/30 focus-within:ring-pink-500/30 focus-within:border-pink-400/50" : "border-pink-300 focus-within:ring-pink-500/15 focus-within:border-pink-400"}`,
                    daySelected: `${dark ? "bg-pink-500 text-white hover:bg-pink-400" : "bg-pink-600 text-white hover:bg-pink-700"}`,
                    dayToday: `ring-2 ring-inset font-semibold ${dark ? "ring-pink-400" : "ring-pink-500"}`,
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
                    weekday: `text-sm font-bold text-center py-3 uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`,
                    day: `relative w-12 h-12 flex items-center justify-center text-base font-semibold rounded-full cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${dark ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-100 text-gray-900"}`,
                    daySelected: c.datepicker.daySelected,
                    dayToday: c.datepicker.dayToday,
                    dayDisabled: c.datepicker.dayDisabled,
                    dayOutside: c.datepicker.dayOutside,
                    header: "flex items-center justify-between mb-6",
                    monthSelect: `flex items-center gap-1 px-3 py-2 text-base font-bold bg-transparent border-none cursor-pointer rounded-lg transition-colors ${dark ? "text-gray-200 hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`,
                    yearSelect: `flex items-center gap-1 px-3 py-2 text-base font-bold bg-transparent border-none cursor-pointer rounded-lg transition-colors ${dark ? "text-gray-200 hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`,
                    label: `block text-base font-semibold mb-2 ${dark ? "text-gray-200" : "text-gray-800"}`,
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
                    trigger: `flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${dark ? "bg-white/4 border-white/10 text-gray-200" : "bg-white border-gray-200 text-gray-900 shadow-sm"}`,
                    calendar: `rounded-lg shadow-lg p-2.5 ${dark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`,
                    calendarIcon: `w-3.5 h-3.5 shrink-0 ${dark ? "text-gray-500" : "text-gray-400"}`,
                    header: "flex items-center justify-between mb-2",
                    weekday: `text-[10px] font-semibold text-center py-1 uppercase ${dark ? "text-gray-500" : "text-gray-400"}`,
                    day: `relative w-7 h-7 flex items-center justify-center text-[11px] font-medium rounded-full cursor-pointer transition-all focus:outline-none ${dark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-100 text-gray-700"}`,
                    daySelected: c.datepicker.daySelected,
                    dayToday: c.datepicker.dayToday,
                    dayDisabled: c.datepicker.dayDisabled,
                    dayOutside: c.datepicker.dayOutside,
                    monthSelect: `flex items-center gap-0.5 px-1.5 py-1 text-xs font-semibold bg-transparent border-none cursor-pointer rounded transition-colors ${dark ? "text-gray-200 hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`,
                    yearSelect: `flex items-center gap-0.5 px-1.5 py-1 text-xs font-semibold bg-transparent border-none cursor-pointer rounded transition-colors ${dark ? "text-gray-200 hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`,
                    navButton: `p-1 rounded transition-colors ${dark ? "text-gray-400 hover:text-gray-200 hover:bg-white/10" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`,
                    footer: `flex justify-center pt-2 mt-2 border-t ${dark ? "border-gray-700" : "border-gray-100"}`,
                    todayButton: `flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-all ${dark ? "text-indigo-400 hover:bg-indigo-500/10" : "text-indigo-600 hover:bg-indigo-50"}`,
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
                    trigger: `${c.datepicker.trigger} rounded-2xl ${dark ? "border-emerald-500/30" : "border-emerald-300"}`,
                    navButton: `p-2 rounded-xl transition-colors ${dark ? "text-emerald-400 hover:bg-emerald-500/10" : "text-emerald-600 hover:bg-emerald-50"}`,
                    daySelected: `${dark ? "bg-emerald-500 text-white hover:bg-emerald-400" : "bg-emerald-600 text-white hover:bg-emerald-700"}`,
                    dayToday: `ring-2 ring-inset font-semibold ${dark ? "ring-emerald-400" : "ring-emerald-500"}`,
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
                    presetButton: `px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${dark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"}`,
                    presetActive: `${dark ? "bg-indigo-500/20 text-indigo-300 border-indigo-400/30" : "bg-indigo-50 text-indigo-700 border-indigo-300"}`,
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

      {/* ─── Unstyled ───────────────────────────────────────────────────── */}
      <Section
        title="Unstyled Mode"
        description="Set unstyled=true to strip all default classes. Build from scratch."
        isDarkMode={dark}
      >
        <DemoWrapper
          isDarkMode={dark}
          layout="block"
          className="overflow-visible"
        >
          <div className="w-full sm:max-w-xs">
            {/* Truly unstyled — no classes, bare HTML structure */}
            <DatePicker unstyled placeholder="Unstyled date picker" />
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
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                  className={`mt-0.5 shrink-0 ${dark ? "text-emerald-400" : "text-emerald-600"}`}
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
            className={`text-xs font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
