import { useState } from "react";
import {
  DatePicker,
  type DateValue,
  type DateRange,
  type DateRangeValue,
  type DateMarker,
} from "../../components/DatePicker";
import { Section, ComponentHeader } from "./components";
import {
  subDays,
  addDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import { fr, de, ja } from "date-fns/locale";

const triggerStyle =
  "flex items-center gap-2 w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all";
const calendarStyle =
  "absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-4 min-w-[300px]";
const headerStyle = "flex items-center justify-between mb-4";
const monthNavStyle = "flex items-center gap-1";
const selectStyle =
  "flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded-lg transition-colors";
const navButtonStyle =
  "p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900";
const weekdayHeaderStyle = "grid grid-cols-7 gap-1 mb-2";
const weekdayStyle =
  "text-xs font-semibold text-gray-500 text-center py-2 uppercase tracking-wide";
const dayStyle =
  "relative w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full cursor-pointer transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1";
const daySelectedStyle = "!bg-blue-600 !text-white hover:!bg-blue-700";
const dayTodayStyle = "border-2 border-blue-500 font-semibold";
const dayDisabledStyle =
  "text-gray-300 cursor-not-allowed hover:bg-transparent";
const dayOutsideStyle = "text-gray-300";
const dayRangeStartStyle = "!bg-blue-600 !text-white rounded-r-none";
const dayRangeEndStyle = "!bg-blue-600 !text-white rounded-l-none";
const dayRangeMiddleStyle = "!bg-blue-100 rounded-none";
const dayFocusedStyle = "ring-2 ring-blue-400";
const dayHolidayStyle = "text-red-600 font-semibold";
const labelStyle = "block text-sm font-medium text-gray-700 mb-1.5";
const errorStyle = "text-sm text-red-500 mt-1.5";
const calendarIconStyle = "w-5 h-5 text-gray-400";
const clearButtonStyle =
  "p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors";
const presetsStyle = "flex flex-wrap gap-2 pb-4 mb-4 border-b border-gray-100";
const presetButtonStyle =
  "px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all";
const presetActiveStyle = "!bg-blue-100 !text-blue-700 ring-1 ring-blue-300";
const footerStyle = "flex justify-center pt-4 mt-4 border-t border-gray-100";
const todayButtonStyle =
  "flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-all";
const monthGridStyle = "flex gap-8";
const dropdownMenuStyle =
  "absolute z-[60] mt-1 max-h-60 overflow-auto rounded-xl bg-white shadow-lg ring-1 ring-black/5 py-1 min-w-[150px]";
const dropdownItemStyle =
  "flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50 cursor-pointer transition-colors";
const dropdownItemSelectedStyle = "bg-blue-50 text-blue-600 font-semibold";
const holidayTooltipStyle =
  "z-[9999] px-3 py-2 text-sm bg-white rounded-xl shadow-xl border border-gray-200";

const holidayMarkers: DateMarker[] = [
  {
    date: new Date(2026, 0, 1),
    label: "New Year's Day",
    description: "First day of the year",
    type: "holiday",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500",
  },
  {
    date: new Date(2026, 0, 20),
    label: "Martin Luther King Jr. Day",
    type: "holiday",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500",
  },
  {
    date: new Date(2026, 1, 14),
    label: "Valentine's Day",
    description: "Day of love",
    type: "observance",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pink-500",
  },
  {
    date: new Date(2026, 1, 16),
    label: "Presidents' Day",
    type: "holiday",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500",
  },
  {
    date: new Date(2026, 6, 4),
    label: "Independence Day",
    description: "USA Independence Day",
    type: "holiday",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500",
  },
  {
    date: new Date(2026, 11, 25),
    label: "Christmas Day",
    description: "Celebration of Christmas",
    type: "holiday",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500",
  },
];

const leaveMarkers: DateMarker[] = [
  {
    date: new Date(2026, 0, 15),
    label: "Annual Leave",
    description: "John Doe - Vacation",
    type: "leave",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500",
  },
  {
    date: new Date(2026, 0, 16),
    label: "Annual Leave",
    description: "John Doe - Vacation",
    type: "leave",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500",
  },
  {
    date: new Date(2026, 0, 22),
    label: "Sick Leave",
    description: "Jane Smith - Medical",
    type: "leave",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-500",
  },
];

const eventMarkers: DateMarker[] = [
  {
    date: new Date(2026, 0, 10),
    label: "Team Meeting",
    description: "Quarterly review",
    type: "event",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500",
  },
  {
    date: new Date(2026, 0, 25),
    label: "Product Launch",
    description: "New feature release",
    type: "event",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-500",
  },
  {
    date: new Date(2026, 1, 5),
    label: "Training Session",
    description: "New employee onboarding",
    type: "event",
    color: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500",
  },
];

const currentYearHolidays: DateMarker[] = holidayMarkers.map((h) => ({
  ...h,
  date: new Date(new Date().getFullYear(), h.date.getMonth(), h.date.getDate()),
}));

const currentYearLeaves: DateMarker[] = leaveMarkers.map((l) => ({
  ...l,
  date: new Date(new Date().getFullYear(), l.date.getMonth(), l.date.getDate()),
}));

const currentYearEvents: DateMarker[] = eventMarkers.map((e) => ({
  ...e,
  date: new Date(new Date().getFullYear(), e.date.getMonth(), e.date.getDate()),
}));

const allMarkers: DateMarker[] = [
  ...currentYearHolidays,
  ...currentYearLeaves,
  ...currentYearEvents,
];

const DatePickerDemo = () => {
  const [singleValue, setSingleValue] = useState<Date | null>(null);
  const [lastSingleValue, setLastSingleValue] = useState<DateValue | null>(
    null,
  );
  const [rangeValue, setRangeValue] = useState<DateRange | null>(null);
  const [lastRangeValue, setLastRangeValue] = useState<DateRangeValue | null>(
    null,
  );
  const [multipleValue, setMultipleValue] = useState<Date[] | null>(null);
  const [lastMultipleValue, setLastMultipleValue] = useState<
    DateValue[] | null
  >(null);
  const [withLabelValue, setWithLabelValue] = useState<Date | null>(new Date());
  const [disabledPastValue, setDisabledPastValue] = useState<Date | null>(null);
  const [disabledFutureValue, setDisabledFutureValue] = useState<Date | null>(
    null,
  );
  const [minMaxValue, setMinMaxValue] = useState<Date | null>(null);
  const [weekendsDisabledValue, setWeekendsDisabledValue] =
    useState<Date | null>(null);
  const [mondayStartValue, setMondayStartValue] = useState<Date | null>(null);
  const [presetsValue, setPresetsValue] = useState<Date | null>(null);
  const [rangePresetsValue, setRangePresetsValue] = useState<DateRange | null>(
    null,
  );
  const [fixedWeeksValue, setFixedWeeksValue] = useState<Date | null>(null);
  const [outsideDaysValue, setOutsideDaysValue] = useState<Date | null>(null);
  const [errorValue, setErrorValue] = useState<Date | null>(null);
  const [customIconValue, setCustomIconValue] = useState<Date | null>(null);
  const [darkThemeValue, setDarkThemeValue] = useState<Date | null>(null);
  const [purpleThemeValue, setPurpleThemeValue] = useState<Date | null>(null);
  const [greenThemeValue, setGreenThemeValue] = useState<Date | null>(null);
  const [minimalThemeValue, setMinimalThemeValue] = useState<Date | null>(null);
  const [fullWidthValue, setFullWidthValue] = useState<Date | null>(null);
  const [customDisabledValue, setCustomDisabledValue] = useState<Date | null>(
    null,
  );
  const [holidayValue, setHolidayValue] = useState<Date | null>(null);
  const [holidayNoTooltipValue, setHolidayNoTooltipValue] =
    useState<Date | null>(null);
  const [leavesValue, setLeavesValue] = useState<Date | null>(null);
  const [eventsValue, setEventsValue] = useState<Date | null>(null);
  const [mixedMarkersValue, setMixedMarkersValue] = useState<Date | null>(null);
  const [noTodayButtonValue, setNoTodayButtonValue] = useState<Date | null>(
    null,
  );
  const [customDropdownValue, setCustomDropdownValue] = useState<Date | null>(
    null,
  );
  const [customDropdownIconsValue, setCustomDropdownIconsValue] =
    useState<Date | null>(null);
  const [customIconsNavValue, setCustomIconsNavValue] = useState<Date | null>(
    null,
  );
  const [weekNumbersValue, setWeekNumbersValue] = useState<Date | null>(null);
  const [localeFrValue, setLocaleFrValue] = useState<Date | null>(null);
  const [localeDeValue, setLocaleDeValue] = useState<Date | null>(null);
  const [localeJaValue, setLocaleJaValue] = useState<Date | null>(null);
  const [dateFormatValue, setDateFormatValue] = useState<Date | null>(
    new Date(),
  );
  const [outsideSelectableValue, setOutsideSelectableValue] =
    useState<Date | null>(null);
  const [todayNavigateOnlyValue, setTodayNavigateOnlyValue] =
    useState<Date | null>(null);
  const [callbacksValue, setCallbacksValue] = useState<Date | null>(null);
  const [callbackLogs, setCallbackLogs] = useState<string[]>([]);
  const [noClearButtonValue, setNoClearButtonValue] = useState<Date | null>(
    new Date(),
  );
  const [noCalendarIconValue, setNoCalendarIconValue] = useState<Date | null>(
    null,
  );
  const [hideFooterValue, setHideFooterValue] = useState<Date | null>(null);

  const today = new Date();

  return (
    <>
      <ComponentHeader
        title="DatePicker"
        description="A flexible date picker component with single, range, and multiple date selection modes. Features custom dropdowns, holiday support, and extensive styling options."
      />

      <Section title="Single Date Selection">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={singleValue}
            onChange={(date, dateValue) => {
              setSingleValue(date);
              setLastSingleValue(dateValue);
            }}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
          {lastSingleValue && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
              <p className="font-medium text-gray-700">DateValue:</p>
              <p>
                <span className="text-gray-500">dateString:</span>{" "}
                <code className="bg-gray-100 px-1 rounded">
                  {lastSingleValue.dateString}
                </code>
              </p>
            </div>
          )}
        </div>
      </Section>

      <Section title="Date Range Selection">
        <div className="w-80">
          <DatePicker
            mode="range"
            rangeValue={rangeValue}
            onRangeChange={(range, rangeVal) => {
              setRangeValue(range);
              setLastRangeValue(rangeVal);
            }}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayRangeStartClassName={dayRangeStartStyle}
            dayRangeEndClassName={dayRangeEndStyle}
            dayRangeMiddleClassName={dayRangeMiddleStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
          {lastRangeValue && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
              <p className="font-medium text-gray-700">DateRangeValue:</p>
              {lastRangeValue.start && (
                <p>
                  <span className="text-gray-500">start:</span>{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    {lastRangeValue.start.dateString}
                  </code>
                </p>
              )}
              {lastRangeValue.end && (
                <p>
                  <span className="text-gray-500">end:</span>{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    {lastRangeValue.end.dateString}
                  </code>
                </p>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Click to select start date, then click again to select end date.
        </p>
      </Section>

      <Section title="Multiple Date Selection">
        <div className="w-80">
          <DatePicker
            mode="multiple"
            multipleValue={multipleValue}
            onMultipleChange={(dates, dateValues) => {
              setMultipleValue(dates);
              setLastMultipleValue(dateValues);
            }}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
          {lastMultipleValue && lastMultipleValue.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
              <p className="font-medium text-gray-700">
                Selected ({lastMultipleValue.length}):
              </p>
              <div className="flex flex-wrap gap-1">
                {lastMultipleValue.map((dv) => (
                  <code
                    key={dv.dateString}
                    className="bg-gray-100 px-1 rounded text-xs"
                  >
                    {dv.dateString}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2 w-full">
          Click dates to toggle selection.
        </p>
      </Section>

      <Section title="Holidays (Red Indicators)">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={holidayValue}
            onChange={(date) => setHolidayValue(date)}
            markers={currentYearHolidays}
            showMarkerIndicator={true}
            showMarkerTooltip={true}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            dayMarkedClassName={dayHolidayStyle}
            markerTooltipClassName={holidayTooltipStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Holidays marked with red indicators. Hover to see details.
        </p>
      </Section>

      <Section title="Leaves (Orange/Yellow Indicators)">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={leavesValue}
            onChange={(date) => setLeavesValue(date)}
            markers={currentYearLeaves}
            showMarkerIndicator={true}
            showMarkerTooltip={true}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            dayMarkedClassName="text-orange-600 font-semibold"
            markerTooltipClassName={holidayTooltipStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Team leaves with orange/yellow indicators based on leave type.
        </p>
      </Section>

      <Section title="Events (Blue/Purple/Green Indicators)">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={eventsValue}
            onChange={(date) => setEventsValue(date)}
            markers={currentYearEvents}
            showMarkerIndicator={true}
            showMarkerTooltip={true}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            dayMarkedClassName="text-blue-600 font-semibold"
            markerTooltipClassName={holidayTooltipStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Events with different colored indicators per event type.
        </p>
      </Section>

      <Section title="Mixed Markers (All Types)">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={mixedMarkersValue}
            onChange={(date) => setMixedMarkersValue(date)}
            markers={allMarkers}
            showMarkerIndicator={true}
            showMarkerTooltip={true}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            markerTooltipClassName={holidayTooltipStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Combined view with holidays (red), leaves (orange/yellow), and events
          (blue/purple/green).
        </p>
      </Section>

      <Section title="Markers without Tooltips">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={holidayNoTooltipValue}
            onChange={(date) => setHolidayNoTooltipValue(date)}
            markers={currentYearHolidays}
            showMarkerIndicator={true}
            showMarkerTooltip={false}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            dayMarkedClassName={dayHolidayStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use{" "}
          <code className="bg-gray-100 px-1 rounded">
            showMarkerTooltip=false
          </code>{" "}
          to disable tooltips.
        </p>
      </Section>

      <Section title="Hide Today Button">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={noTodayButtonValue}
            onChange={(date) => setNoTodayButtonValue(date)}
            showTodayButton={false}
            todayAction={false}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use{" "}
          <code className="bg-gray-100 px-1 rounded">
            showTodayButton=false
          </code>{" "}
          with{" "}
          <code className="bg-gray-100 px-1 rounded">todayAction=false</code> to
          hide the footer entirely.
        </p>
      </Section>

      <Section title="Hide Footer (showTodayIndicator)">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={hideFooterValue}
            onChange={(date) => setHideFooterValue(date)}
            showTodayIndicator={false}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use{" "}
          <code className="bg-gray-100 px-1 rounded">
            showTodayIndicator=false
          </code>{" "}
          to hide the footer section completely.
        </p>
      </Section>

      <Section title="Custom Navigation Icons">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={customIconsNavValue}
            onChange={(date) => setCustomIconsNavValue(date)}
            prevMonthIcon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            nextMonthIcon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638l-4.158-3.96a.75.75 0 0 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            prevYearIcon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M18 10a.75.75 0 0 0-.75-.75H4.66l2.1-1.95a.75.75 0 1 0-1.02-1.1l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 0 0 1.02-1.1l-2.1-1.95h12.59A.75.75 0 0 0 18 10Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            nextYearIcon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            todayIcon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Pass custom icons via{" "}
          <code className="bg-gray-100 px-1 rounded">prevMonthIcon</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">nextMonthIcon</code>, etc.
        </p>
      </Section>

      <Section title="Week Numbers">
        <div className="w-80">
          <DatePicker
            mode="single"
            value={weekNumbersValue}
            onChange={(date) => setWeekNumbersValue(date)}
            showWeekNumbers
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName="grid grid-cols-8 gap-1 mb-2"
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            weekNumberClassName="text-xs font-medium text-gray-400 text-center py-2 w-8"
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use{" "}
          <code className="bg-gray-100 px-1 rounded">showWeekNumbers=true</code>{" "}
          to display ISO week numbers.
        </p>
      </Section>

      <Section title="Locale (Internationalization)">
        <div className="flex flex-wrap gap-6">
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">French:</p>
            <DatePicker
              mode="single"
              value={localeFrValue}
              onChange={(date) => setLocaleFrValue(date)}
              locale={fr}
              dateFormat="d MMMM yyyy"
              triggerClassName={triggerStyle}
              calendarClassName={calendarStyle}
              headerClassName={headerStyle}
              monthNavClassName={monthNavStyle}
              monthSelectClassName={selectStyle}
              yearSelectClassName={selectStyle}
              navButtonClassName={navButtonStyle}
              weekdayHeaderClassName={weekdayHeaderStyle}
              weekdayClassName={weekdayStyle}
              dayClassName={dayStyle}
              daySelectedClassName={daySelectedStyle}
              dayTodayClassName={dayTodayStyle}
              dayDisabledClassName={dayDisabledStyle}
              dayOutsideClassName={dayOutsideStyle}
              dayFocusedClassName={dayFocusedStyle}
              calendarIconClassName={calendarIconStyle}
              clearButtonClassName={clearButtonStyle}
              footerClassName={footerStyle}
              todayButtonClassName={todayButtonStyle}
              dropdownMenuClassName={dropdownMenuStyle}
              dropdownItemClassName={dropdownItemStyle}
              dropdownItemSelectedClassName={dropdownItemSelectedStyle}
            />
          </div>
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">German:</p>
            <DatePicker
              mode="single"
              value={localeDeValue}
              onChange={(date) => setLocaleDeValue(date)}
              locale={de}
              dateFormat="d. MMMM yyyy"
              triggerClassName={triggerStyle}
              calendarClassName={calendarStyle}
              headerClassName={headerStyle}
              monthNavClassName={monthNavStyle}
              monthSelectClassName={selectStyle}
              yearSelectClassName={selectStyle}
              navButtonClassName={navButtonStyle}
              weekdayHeaderClassName={weekdayHeaderStyle}
              weekdayClassName={weekdayStyle}
              dayClassName={dayStyle}
              daySelectedClassName={daySelectedStyle}
              dayTodayClassName={dayTodayStyle}
              dayDisabledClassName={dayDisabledStyle}
              dayOutsideClassName={dayOutsideStyle}
              dayFocusedClassName={dayFocusedStyle}
              calendarIconClassName={calendarIconStyle}
              clearButtonClassName={clearButtonStyle}
              footerClassName={footerStyle}
              todayButtonClassName={todayButtonStyle}
              dropdownMenuClassName={dropdownMenuStyle}
              dropdownItemClassName={dropdownItemStyle}
              dropdownItemSelectedClassName={dropdownItemSelectedStyle}
            />
          </div>
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">Japanese:</p>
            <DatePicker
              mode="single"
              value={localeJaValue}
              onChange={(date) => setLocaleJaValue(date)}
              locale={ja}
              dateFormat="yyyy年M月d日"
              triggerClassName={triggerStyle}
              calendarClassName={calendarStyle}
              headerClassName={headerStyle}
              monthNavClassName={monthNavStyle}
              monthSelectClassName={selectStyle}
              yearSelectClassName={selectStyle}
              navButtonClassName={navButtonStyle}
              weekdayHeaderClassName={weekdayHeaderStyle}
              weekdayClassName={weekdayStyle}
              dayClassName={dayStyle}
              daySelectedClassName={daySelectedStyle}
              dayTodayClassName={dayTodayStyle}
              dayDisabledClassName={dayDisabledStyle}
              dayOutsideClassName={dayOutsideStyle}
              dayFocusedClassName={dayFocusedStyle}
              calendarIconClassName={calendarIconStyle}
              clearButtonClassName={clearButtonStyle}
              footerClassName={footerStyle}
              todayButtonClassName={todayButtonStyle}
              dropdownMenuClassName={dropdownMenuStyle}
              dropdownItemClassName={dropdownItemStyle}
              dropdownItemSelectedClassName={dropdownItemSelectedStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Pass a date-fns locale to{" "}
          <code className="bg-gray-100 px-1 rounded">locale</code> prop for
          localized month/day names.
        </p>
      </Section>

      <Section title="Custom Date Format">
        <div className="flex flex-wrap gap-6">
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Default (MMM d, yyyy):
            </p>
            <DatePicker
              mode="single"
              value={dateFormatValue}
              onChange={(date) => setDateFormatValue(date)}
              triggerClassName={triggerStyle}
              calendarClassName={calendarStyle}
              headerClassName={headerStyle}
              monthNavClassName={monthNavStyle}
              monthSelectClassName={selectStyle}
              yearSelectClassName={selectStyle}
              navButtonClassName={navButtonStyle}
              weekdayHeaderClassName={weekdayHeaderStyle}
              weekdayClassName={weekdayStyle}
              dayClassName={dayStyle}
              daySelectedClassName={daySelectedStyle}
              dayTodayClassName={dayTodayStyle}
              dayDisabledClassName={dayDisabledStyle}
              dayOutsideClassName={dayOutsideStyle}
              dayFocusedClassName={dayFocusedStyle}
              calendarIconClassName={calendarIconStyle}
              clearButtonClassName={clearButtonStyle}
              footerClassName={footerStyle}
              todayButtonClassName={todayButtonStyle}
              dropdownMenuClassName={dropdownMenuStyle}
              dropdownItemClassName={dropdownItemStyle}
              dropdownItemSelectedClassName={dropdownItemSelectedStyle}
            />
          </div>
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              ISO Format (yyyy-MM-dd):
            </p>
            <DatePicker
              mode="single"
              value={dateFormatValue}
              onChange={(date) => setDateFormatValue(date)}
              dateFormat="yyyy-MM-dd"
              triggerClassName={triggerStyle}
              calendarClassName={calendarStyle}
              headerClassName={headerStyle}
              monthNavClassName={monthNavStyle}
              monthSelectClassName={selectStyle}
              yearSelectClassName={selectStyle}
              navButtonClassName={navButtonStyle}
              weekdayHeaderClassName={weekdayHeaderStyle}
              weekdayClassName={weekdayStyle}
              dayClassName={dayStyle}
              daySelectedClassName={daySelectedStyle}
              dayTodayClassName={dayTodayStyle}
              dayDisabledClassName={dayDisabledStyle}
              dayOutsideClassName={dayOutsideStyle}
              dayFocusedClassName={dayFocusedStyle}
              calendarIconClassName={calendarIconStyle}
              clearButtonClassName={clearButtonStyle}
              footerClassName={footerStyle}
              todayButtonClassName={todayButtonStyle}
              dropdownMenuClassName={dropdownMenuStyle}
              dropdownItemClassName={dropdownItemStyle}
              dropdownItemSelectedClassName={dropdownItemSelectedStyle}
            />
          </div>
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              US Format (MM/dd/yyyy):
            </p>
            <DatePicker
              mode="single"
              value={dateFormatValue}
              onChange={(date) => setDateFormatValue(date)}
              dateFormat="MM/dd/yyyy"
              triggerClassName={triggerStyle}
              calendarClassName={calendarStyle}
              headerClassName={headerStyle}
              monthNavClassName={monthNavStyle}
              monthSelectClassName={selectStyle}
              yearSelectClassName={selectStyle}
              navButtonClassName={navButtonStyle}
              weekdayHeaderClassName={weekdayHeaderStyle}
              weekdayClassName={weekdayStyle}
              dayClassName={dayStyle}
              daySelectedClassName={daySelectedStyle}
              dayTodayClassName={dayTodayStyle}
              dayDisabledClassName={dayDisabledStyle}
              dayOutsideClassName={dayOutsideStyle}
              dayFocusedClassName={dayFocusedStyle}
              calendarIconClassName={calendarIconStyle}
              clearButtonClassName={clearButtonStyle}
              footerClassName={footerStyle}
              todayButtonClassName={todayButtonStyle}
              dropdownMenuClassName={dropdownMenuStyle}
              dropdownItemClassName={dropdownItemStyle}
              dropdownItemSelectedClassName={dropdownItemSelectedStyle}
            />
          </div>
          <div className="w-80">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Full Format (EEEE, MMMM do, yyyy):
            </p>
            <DatePicker
              mode="single"
              value={dateFormatValue}
              onChange={(date) => setDateFormatValue(date)}
              dateFormat="EEEE, MMMM do, yyyy"
              triggerClassName={triggerStyle}
              calendarClassName={calendarStyle}
              headerClassName={headerStyle}
              monthNavClassName={monthNavStyle}
              monthSelectClassName={selectStyle}
              yearSelectClassName={selectStyle}
              navButtonClassName={navButtonStyle}
              weekdayHeaderClassName={weekdayHeaderStyle}
              weekdayClassName={weekdayStyle}
              dayClassName={dayStyle}
              daySelectedClassName={daySelectedStyle}
              dayTodayClassName={dayTodayStyle}
              dayDisabledClassName={dayDisabledStyle}
              dayOutsideClassName={dayOutsideStyle}
              dayFocusedClassName={dayFocusedStyle}
              calendarIconClassName={calendarIconStyle}
              clearButtonClassName={clearButtonStyle}
              footerClassName={footerStyle}
              todayButtonClassName={todayButtonStyle}
              dropdownMenuClassName={dropdownMenuStyle}
              dropdownItemClassName={dropdownItemStyle}
              dropdownItemSelectedClassName={dropdownItemSelectedStyle}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use{" "}
          <code className="bg-gray-100 px-1 rounded">dateFormat</code> prop with
          date-fns format strings.
        </p>
      </Section>

      <Section title="Outside Days Not Selectable">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={outsideSelectableValue}
            onChange={(date) => setOutsideSelectableValue(date)}
            showOutsideDays={true}
            outsideDaysSelectable={false}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Outside days are visible but not selectable when{" "}
          <code className="bg-gray-100 px-1 rounded">
            outsideDaysSelectable=false
          </code>
          .
        </p>
      </Section>

      <Section title="Today Button - Navigate Only">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={todayNavigateOnlyValue}
            onChange={(date) => setTodayNavigateOnlyValue(date)}
            todayAction={false}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          With{" "}
          <code className="bg-gray-100 px-1 rounded">todayAction=false</code>,
          the "Today" button only navigates to today's month without selecting
          it.
        </p>
      </Section>

      <Section title="Callback Events">
        <div className="flex gap-6">
          <div className="w-72">
            <DatePicker
              mode="single"
              value={callbacksValue}
              onChange={(date) => {
                setCallbacksValue(date);
                setCallbackLogs((prev) => [
                  ...prev.slice(-4),
                  `onChange: ${date?.toDateString() || "null"}`,
                ]);
              }}
              onClear={() => {
                setCallbackLogs((prev) => [...prev.slice(-4), "onClear called"]);
              }}
              onOpen={() => {
                setCallbackLogs((prev) => [...prev.slice(-4), "onOpen called"]);
              }}
              onClose={() => {
                setCallbackLogs((prev) => [...prev.slice(-4), "onClose called"]);
              }}
              onMonthChange={(month) => {
                setCallbackLogs((prev) => [
                  ...prev.slice(-4),
                  `onMonthChange: ${month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
                ]);
              }}
              triggerClassName={triggerStyle}
              calendarClassName={calendarStyle}
              headerClassName={headerStyle}
              monthNavClassName={monthNavStyle}
              monthSelectClassName={selectStyle}
              yearSelectClassName={selectStyle}
              navButtonClassName={navButtonStyle}
              weekdayHeaderClassName={weekdayHeaderStyle}
              weekdayClassName={weekdayStyle}
              dayClassName={dayStyle}
              daySelectedClassName={daySelectedStyle}
              dayTodayClassName={dayTodayStyle}
              dayDisabledClassName={dayDisabledStyle}
              dayOutsideClassName={dayOutsideStyle}
              dayFocusedClassName={dayFocusedStyle}
              calendarIconClassName={calendarIconStyle}
              clearButtonClassName={clearButtonStyle}
              footerClassName={footerStyle}
              todayButtonClassName={todayButtonStyle}
              dropdownMenuClassName={dropdownMenuStyle}
              dropdownItemClassName={dropdownItemStyle}
              dropdownItemSelectedClassName={dropdownItemSelectedStyle}
            />
          </div>
          <div className="flex-1 max-w-xs">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Event Log:
            </p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm font-mono text-gray-600 min-h-[120px]">
              {callbackLogs.length === 0 ? (
                <span className="text-gray-400">
                  Interact with the picker...
                </span>
              ) : (
                callbackLogs.map((log, i) => (
                  <div key={i} className="py-0.5">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Available callbacks:{" "}
          <code className="bg-gray-100 px-1 rounded">onOpen</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">onClose</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">onMonthChange</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">onClear</code>.
        </p>
      </Section>

      <Section title="Hide Clear Button">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={noClearButtonValue}
            onChange={(date) => setNoClearButtonValue(date)}
            showClearButton={false}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use{" "}
          <code className="bg-gray-100 px-1 rounded">showClearButton=false</code>{" "}
          to hide the clear button.
        </p>
      </Section>

      <Section title="Hide Calendar Icon">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={noCalendarIconValue}
            onChange={(date) => setNoCalendarIconValue(date)}
            showCalendarIcon={false}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use{" "}
          <code className="bg-gray-100 px-1 rounded">
            showCalendarIcon=false
          </code>{" "}
          to hide the calendar icon.
        </p>
      </Section>

      <Section title="Custom Styled Dropdowns">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={customDropdownValue}
            onChange={(date) => setCustomDropdownValue(date)}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName="flex items-center gap-1 px-3 py-1.5 text-sm font-bold bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
            yearSelectClassName="flex items-center gap-1 px-3 py-1.5 text-sm font-bold bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName="absolute z-[60] mt-1 max-h-60 overflow-auto rounded-xl bg-gradient-to-b from-blue-50 to-white shadow-lg ring-1 ring-blue-200 py-1 min-w-[160px]"
            dropdownItemClassName="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer transition-colors"
            dropdownItemSelectedClassName="bg-blue-100 text-blue-700 font-bold"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Style the month/year dropdowns using{" "}
          <code className="bg-gray-100 px-1 rounded">
            dropdownMenuClassName
          </code>{" "}
          and related props.
        </p>
      </Section>

      <Section title="Custom Dropdown Selected Icons">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={customDropdownIconsValue}
            onChange={(date) => setCustomDropdownIconsValue(date)}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
            monthDropdownSelectedIcon={
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-green-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            yearDropdownSelectedIcon={
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-purple-500"
              >
                <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" />
              </svg>
            }
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Use{" "}
          <code className="bg-gray-100 px-1 rounded">
            monthDropdownSelectedIcon
          </code>{" "}
          and{" "}
          <code className="bg-gray-100 px-1 rounded">
            yearDropdownSelectedIcon
          </code>{" "}
          for custom selected state icons.
        </p>
      </Section>

      <Section title="With Label and Required">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={withLabelValue}
            onChange={(date) => setWithLabelValue(date)}
            label="Birth Date"
            required
            labelClassName={labelStyle}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="Disable Past Dates">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={disabledPastValue}
            onChange={(date) => setDisabledPastValue(date)}
            disabledDates={{ disablePast: true }}
            placeholder="Future dates only"
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="Disable Future Dates">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={disabledFutureValue}
            onChange={(date) => setDisabledFutureValue(date)}
            disabledDates={{ disableFuture: true }}
            placeholder="Past dates only"
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="Min/Max Date Range">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={minMaxValue}
            onChange={(date) => setMinMaxValue(date)}
            minDate={subDays(today, 7)}
            maxDate={addDays(today, 7)}
            placeholder="Within +/- 7 days"
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="Disable Weekends">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={weekendsDisabledValue}
            onChange={(date) => setWeekendsDisabledValue(date)}
            disabledDates={{ daysOfWeek: [0, 6] }}
            placeholder="Weekdays only"
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="Custom Disabled Logic">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={customDisabledValue}
            onChange={(date) => setCustomDisabledValue(date)}
            disabledDates={{
              custom: (date) => date.getDate() % 5 === 0,
            }}
            placeholder="Custom disabled"
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Every 5th day of the month is disabled.
        </p>
      </Section>

      <Section title="Week Starts on Monday">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={mondayStartValue}
            onChange={(date) => setMondayStartValue(date)}
            weekStartsOn={1}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="Two Month View">
        <div className="w-fit">
          <DatePicker
            mode="range"
            rangeValue={null}
            onRangeChange={() => {}}
            numberOfMonths={2}
            triggerClassName={`${triggerStyle} w-80`}
            calendarClassName="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-4"
            monthGridClassName={monthGridStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayRangeStartClassName={dayRangeStartStyle}
            dayRangeEndClassName={dayRangeEndStyle}
            dayRangeMiddleClassName={dayRangeMiddleStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="With Presets (Single)">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={presetsValue}
            onChange={(date) => setPresetsValue(date)}
            showPresets
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            presetsClassName={presetsStyle}
            presetButtonClassName={presetButtonStyle}
            presetActiveClassName={presetActiveStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="With Presets (Range)">
        <div className="w-80">
          <DatePicker
            mode="range"
            rangeValue={rangePresetsValue}
            onRangeChange={(range) => setRangePresetsValue(range)}
            showPresets
            presets={[
              {
                label: "Today",
                getValue: () => ({ start: new Date(), end: new Date() }),
              },
              {
                label: "Last 7 Days",
                getValue: () => ({
                  start: subDays(new Date(), 6),
                  end: new Date(),
                }),
              },
              {
                label: "Last 30 Days",
                getValue: () => ({
                  start: subDays(new Date(), 29),
                  end: new Date(),
                }),
              },
              {
                label: "This Month",
                getValue: () => ({
                  start: startOfMonth(new Date()),
                  end: endOfMonth(new Date()),
                }),
              },
              {
                label: "Last Month",
                getValue: () => ({
                  start: startOfMonth(subMonths(new Date(), 1)),
                  end: endOfMonth(subMonths(new Date(), 1)),
                }),
              },
            ]}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayRangeStartClassName={dayRangeStartStyle}
            dayRangeEndClassName={dayRangeEndStyle}
            dayRangeMiddleClassName={dayRangeMiddleStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            presetsClassName={presetsStyle}
            presetButtonClassName={presetButtonStyle}
            presetActiveClassName={presetActiveStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="Fixed Weeks">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={fixedWeeksValue}
            onChange={(date) => setFixedWeeksValue(date)}
            fixedWeeks
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Always shows 6 weeks for consistent height.
        </p>
      </Section>

      <Section title="Hide Outside Days">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={outsideDaysValue}
            onChange={(date) => setOutsideDaysValue(date)}
            showOutsideDays={false}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="Error State">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={errorValue}
            onChange={(date) => setErrorValue(date)}
            label="Event Date"
            required
            error
            errorMessage="Please select a valid date"
            labelClassName={labelStyle}
            triggerClassName={`${triggerStyle} !border-red-500 focus:!ring-red-500`}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            errorClassName={errorStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="Disabled State">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={new Date()}
            onChange={() => {}}
            disabled
            triggerClassName={`${triggerStyle} opacity-50 cursor-not-allowed`}
            calendarIconClassName={calendarIconStyle}
          />
        </div>
      </Section>

      <Section title="Custom Calendar Icon">
        <div className="w-72">
          <DatePicker
            mode="single"
            value={customIconValue}
            onChange={(date) => setCustomIconValue(date)}
            calendarIcon={
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-blue-500"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            }
            clearIcon={
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-red-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="Full Width">
        <div className="max-w-md w-full">
          <DatePicker
            mode="single"
            value={fullWidthValue}
            onChange={(date) => setFullWidthValue(date)}
            fullWidth
            label="Full Width DatePicker"
            labelClassName={labelStyle}
            triggerClassName={triggerStyle}
            calendarClassName={calendarStyle}
            headerClassName={headerStyle}
            monthNavClassName={monthNavStyle}
            monthSelectClassName={selectStyle}
            yearSelectClassName={selectStyle}
            navButtonClassName={navButtonStyle}
            weekdayHeaderClassName={weekdayHeaderStyle}
            weekdayClassName={weekdayStyle}
            dayClassName={dayStyle}
            daySelectedClassName={daySelectedStyle}
            dayTodayClassName={dayTodayStyle}
            dayDisabledClassName={dayDisabledStyle}
            dayOutsideClassName={dayOutsideStyle}
            dayFocusedClassName={dayFocusedStyle}
            calendarIconClassName={calendarIconStyle}
            clearButtonClassName={clearButtonStyle}
            footerClassName={footerStyle}
            todayButtonClassName={todayButtonStyle}
            dropdownMenuClassName={dropdownMenuStyle}
            dropdownItemClassName={dropdownItemStyle}
            dropdownItemSelectedClassName={dropdownItemSelectedStyle}
          />
        </div>
      </Section>

      <Section title="Custom Themes">
        <p className="text-sm text-gray-600 mb-4 w-full">
          The DatePicker is fully customizable via className props.
        </p>
        <div className="flex flex-wrap gap-8">
          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Dark Theme:
            </p>
            <DatePicker
              mode="single"
              value={darkThemeValue}
              onChange={(date) => setDarkThemeValue(date)}
              triggerClassName="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 cursor-pointer border border-gray-700"
              calendarClassName="absolute z-50 top-full left-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-4 min-w-[300px]"
              headerClassName="flex items-center justify-between mb-4"
              monthNavClassName="flex items-center gap-1"
              monthSelectClassName="flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent text-white rounded-lg cursor-pointer hover:bg-gray-800"
              yearSelectClassName="flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent text-white rounded-lg cursor-pointer hover:bg-gray-800"
              navButtonClassName="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
              weekdayHeaderClassName="grid grid-cols-7 gap-1 mb-2"
              weekdayClassName="text-xs font-semibold text-gray-500 text-center py-2 uppercase"
              dayClassName="relative aspect-square flex items-center justify-center text-sm font-medium text-gray-300 rounded-full cursor-pointer hover:bg-gray-800"
              daySelectedClassName="!bg-blue-600 !text-white"
              dayTodayClassName="border-2 border-blue-500"
              dayDisabledClassName="text-gray-700 cursor-not-allowed hover:bg-transparent"
              dayOutsideClassName="text-gray-700"
              calendarIconClassName="w-5 h-5 text-gray-400"
              clearButtonClassName="p-1 rounded-full hover:bg-gray-800 text-gray-400"
              footerClassName="flex justify-center pt-4 mt-4 border-t border-gray-700"
              todayButtonClassName="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-400 hover:bg-gray-800 rounded-lg"
              dropdownMenuClassName="absolute z-[60] mt-1 max-h-60 overflow-auto rounded-xl bg-gray-800 shadow-lg ring-1 ring-gray-600 py-1 min-w-[150px]"
              dropdownItemClassName="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
              dropdownItemSelectedClassName="bg-gray-700 text-blue-400 font-semibold"
            />
          </div>

          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Purple Theme:
            </p>
            <DatePicker
              mode="single"
              value={purpleThemeValue}
              onChange={(date) => setPurpleThemeValue(date)}
              triggerClassName="flex items-center gap-2 w-full px-3 py-2.5 border border-purple-300 rounded-lg bg-purple-50 hover:border-purple-400 cursor-pointer"
              calendarClassName="absolute z-50 top-full left-0 mt-1 bg-purple-50 border border-purple-200 rounded-xl shadow-xl p-4 min-w-[300px]"
              headerClassName="flex items-center justify-between mb-4"
              monthNavClassName="flex items-center gap-1"
              monthSelectClassName="flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent text-purple-900 rounded-lg cursor-pointer hover:bg-purple-100"
              yearSelectClassName="flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent text-purple-900 rounded-lg cursor-pointer hover:bg-purple-100"
              navButtonClassName="p-1.5 rounded-lg hover:bg-purple-100 text-purple-600"
              weekdayHeaderClassName="grid grid-cols-7 gap-1 mb-2"
              weekdayClassName="text-xs font-semibold text-purple-500 text-center py-2 uppercase"
              dayClassName="relative aspect-square flex items-center justify-center text-sm font-medium text-purple-800 rounded-full cursor-pointer hover:bg-purple-100"
              daySelectedClassName="!bg-purple-600 !text-white"
              dayTodayClassName="border-2 border-purple-500"
              dayDisabledClassName="text-purple-300 cursor-not-allowed hover:bg-transparent"
              dayOutsideClassName="text-purple-300"
              calendarIconClassName="w-5 h-5 text-purple-500"
              clearButtonClassName="p-1 rounded-full hover:bg-purple-100 text-purple-500"
              footerClassName="flex justify-center pt-4 mt-4 border-t border-purple-200"
              todayButtonClassName="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded-lg"
              dropdownMenuClassName="absolute z-[60] mt-1 max-h-60 overflow-auto rounded-xl bg-white shadow-lg ring-1 ring-purple-200 py-1 min-w-[150px]"
              dropdownItemClassName="flex items-center justify-between w-full px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 cursor-pointer"
              dropdownItemSelectedClassName="bg-purple-100 text-purple-700 font-semibold"
            />
          </div>

          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Green Theme:
            </p>
            <DatePicker
              mode="single"
              value={greenThemeValue}
              onChange={(date) => setGreenThemeValue(date)}
              triggerClassName="flex items-center gap-2 w-full px-3 py-2.5 border border-green-300 rounded-lg bg-green-50 hover:border-green-400 cursor-pointer"
              calendarClassName="absolute z-50 top-full left-0 mt-1 bg-green-50 border border-green-200 rounded-xl shadow-xl p-4 min-w-[300px]"
              headerClassName="flex items-center justify-between mb-4"
              monthNavClassName="flex items-center gap-1"
              monthSelectClassName="flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent text-green-900 rounded-lg cursor-pointer hover:bg-green-100"
              yearSelectClassName="flex items-center gap-1 px-2 py-1.5 text-sm font-semibold bg-transparent text-green-900 rounded-lg cursor-pointer hover:bg-green-100"
              navButtonClassName="p-1.5 rounded-lg hover:bg-green-100 text-green-600"
              weekdayHeaderClassName="grid grid-cols-7 gap-1 mb-2"
              weekdayClassName="text-xs font-semibold text-green-500 text-center py-2 uppercase"
              dayClassName="relative aspect-square flex items-center justify-center text-sm font-medium text-green-800 rounded-full cursor-pointer hover:bg-green-100"
              daySelectedClassName="!bg-green-600 !text-white"
              dayTodayClassName="border-2 border-green-500"
              dayDisabledClassName="text-green-300 cursor-not-allowed hover:bg-transparent"
              dayOutsideClassName="text-green-300"
              calendarIconClassName="w-5 h-5 text-green-500"
              clearButtonClassName="p-1 rounded-full hover:bg-green-100 text-green-500"
              footerClassName="flex justify-center pt-4 mt-4 border-t border-green-200"
              todayButtonClassName="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-100 rounded-lg"
              dropdownMenuClassName="absolute z-[60] mt-1 max-h-60 overflow-auto rounded-xl bg-white shadow-lg ring-1 ring-green-200 py-1 min-w-[150px]"
              dropdownItemClassName="flex items-center justify-between w-full px-3 py-2 text-sm text-green-700 hover:bg-green-50 cursor-pointer"
              dropdownItemSelectedClassName="bg-green-100 text-green-700 font-semibold"
            />
          </div>

          <div className="w-72">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Minimal Theme:
            </p>
            <DatePicker
              mode="single"
              value={minimalThemeValue}
              onChange={(date) => setMinimalThemeValue(date)}
              showCalendarIcon={false}
              triggerClassName="flex items-center gap-2 w-full px-3 py-2.5 border-b-2 border-gray-300 hover:border-gray-500 cursor-pointer bg-transparent"
              calendarClassName="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-sm p-4 min-w-[300px]"
              headerClassName="flex items-center justify-between mb-4"
              monthNavClassName="flex items-center gap-1"
              monthSelectClassName="flex items-center gap-1 px-2 py-1.5 text-sm font-medium bg-transparent text-gray-700 rounded cursor-pointer hover:bg-gray-50"
              yearSelectClassName="flex items-center gap-1 px-2 py-1.5 text-sm font-medium bg-transparent text-gray-700 rounded cursor-pointer hover:bg-gray-50"
              navButtonClassName="p-1.5 rounded hover:bg-gray-50 text-gray-400"
              weekdayHeaderClassName="grid grid-cols-7 gap-1 mb-2"
              weekdayClassName="text-xs font-medium text-gray-400 text-center py-2"
              dayClassName="relative aspect-square flex items-center justify-center text-sm text-gray-700 rounded cursor-pointer hover:bg-gray-50"
              daySelectedClassName="!bg-gray-900 !text-white"
              dayTodayClassName="font-bold underline underline-offset-4"
              dayDisabledClassName="text-gray-300 cursor-not-allowed hover:bg-transparent"
              dayOutsideClassName="text-gray-300"
              clearButtonClassName="p-1 rounded hover:bg-gray-100 text-gray-400"
              footerClassName="flex justify-center pt-4 mt-4 border-t border-gray-100"
              todayButtonClassName="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded"
              dropdownMenuClassName="absolute z-[60] mt-1 max-h-60 overflow-auto rounded-lg bg-white shadow-sm ring-1 ring-gray-100 py-1 min-w-[150px]"
              dropdownItemClassName="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              dropdownItemSelectedClassName="bg-gray-100 font-medium"
            />
          </div>
        </div>
      </Section>

      <Section title="Props Reference">
        <div className="overflow-x-auto w-full">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Core Props
          </p>
          <table className="min-w-full text-sm mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">mode</td>
                <td className="py-2 pr-4 text-gray-600">
                  "single" | "range" | "multiple"
                </td>
                <td className="py-2 pr-4 text-gray-500">"single"</td>
                <td className="py-2 text-gray-600">Selection mode</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">value</td>
                <td className="py-2 pr-4 text-gray-600">Date | null</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Selected date (single mode)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">rangeValue</td>
                <td className="py-2 pr-4 text-gray-600">DateRange | null</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Selected range (range mode)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  multipleValue
                </td>
                <td className="py-2 pr-4 text-gray-600">Date[] | null</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Selected dates (multiple mode)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onChange</td>
                <td className="py-2 pr-4 text-gray-600">
                  (date, dateValue) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when date changes (single mode)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  onRangeChange
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (range, rangeValue) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when range changes (range mode)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  onMultipleChange
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (dates, dateValues) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when dates change (multiple mode)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onClear</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when selection is cleared
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  onMonthChange
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (month: Date) =&gt; void
                </td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when displayed month changes
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onOpen</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when calendar opens
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onClose</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when calendar closes
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Date Constraints
          </p>
          <table className="min-w-full text-sm mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">minDate</td>
                <td className="py-2 pr-4 text-gray-600">Date</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Minimum selectable date
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">maxDate</td>
                <td className="py-2 pr-4 text-gray-600">Date</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Maximum selectable date
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  disabledDates
                </td>
                <td className="py-2 pr-4 text-gray-600">DisabledDateOptions</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Object with disablePast, disableFuture, daysOfWeek, dates,
                  custom
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Calendar Behavior
          </p>
          <table className="min-w-full text-sm mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  weekStartsOn
                </td>
                <td className="py-2 pr-4 text-gray-600">0-6</td>
                <td className="py-2 pr-4 text-gray-500">0</td>
                <td className="py-2 text-gray-600">
                  Day of week to start (0=Sun, 1=Mon, etc.)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">locale</td>
                <td className="py-2 pr-4 text-gray-600">Locale</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  date-fns locale for internationalization
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  numberOfMonths
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">1</td>
                <td className="py-2 text-gray-600">
                  Number of months to display
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dateFormat
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"MMM d, yyyy"</td>
                <td className="py-2 text-gray-600">
                  date-fns format string for display
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showWeekNumbers
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Show ISO week numbers
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showOutsideDays
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Show days from adjacent months
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  outsideDaysSelectable
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Allow selecting outside days
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fixedWeeks</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Always show 6 weeks for consistent height
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showTodayIndicator
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Show footer with today button
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showTodayButton
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Show/hide the today button in footer
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">todayAction</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  When true, Today button selects today; when false, only
                  navigates
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showPresets</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Show preset shortcuts</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">presets</td>
                <td className="py-2 pr-4 text-gray-600">DatePreset[]</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom presets array
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Markers
          </p>
          <table className="min-w-full text-sm mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">markers</td>
                <td className="py-2 pr-4 text-gray-600">DateMarker[]</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Array of date markers (holidays, leaves, events, etc.)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showMarkerIndicator
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Show dot indicator on marked dates
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showMarkerTooltip
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Show tooltip on marker hover
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Form Props
          </p>
          <table className="min-w-full text-sm mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">auto-generated</td>
                <td className="py-2 text-gray-600">
                  HTML id attribute
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">name</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Form field name
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">placeholder</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"Select a date"</td>
                <td className="py-2 text-gray-600">
                  Placeholder text when no date selected
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Label content
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">required</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Show required indicator
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Disable the picker
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">error</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Show error state
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  errorMessage
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Error message to display
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fullWidth</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Take full width of container
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            UI Visibility
          </p>
          <table className="min-w-full text-sm mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showClearButton
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Show clear button when value is set
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showCalendarIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Show calendar icon in trigger
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Custom Icons
          </p>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  calendarIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom calendar icon
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">clearIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Custom clear button icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  prevMonthIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom previous month icon
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  nextMonthIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Custom next month icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  prevYearIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom previous year icon
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  nextYearIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Custom next year icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">todayIcon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Custom today button icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  monthDropdownSelectedIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom icon for selected month option
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  yearDropdownSelectedIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom icon for selected year option
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="DateMarker Type">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Property
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Required
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">date</td>
                <td className="py-2 pr-4 text-gray-600">Date</td>
                <td className="py-2 pr-4 text-gray-500">Yes</td>
                <td className="py-2 text-gray-600">The date to mark</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">Yes</td>
                <td className="py-2 text-gray-600">
                  Main label shown in tooltip
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  description
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Additional description</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">type</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Category (e.g., "holiday", "leave", "event")
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">color</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Tailwind classes or hex color for the indicator
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Styling Props (className)">
        <div className="overflow-x-auto w-full">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Container & Trigger
          </p>
          <table className="min-w-full text-sm mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 text-gray-600">
                  Base className for the component wrapper
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  containerClassName
                </td>
                <td className="py-2 text-gray-600">Outer container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  triggerClassName
                </td>
                <td className="py-2 text-gray-600">
                  Trigger button that opens the calendar
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  inputClassName
                </td>
                <td className="py-2 text-gray-600">
                  Text display inside trigger
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  labelClassName
                </td>
                <td className="py-2 text-gray-600">Label element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  errorClassName
                </td>
                <td className="py-2 text-gray-600">Error message element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  calendarIconClassName
                </td>
                <td className="py-2 text-gray-600">Calendar icon in trigger</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  clearButtonClassName
                </td>
                <td className="py-2 text-gray-600">Clear button in trigger</td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Calendar Layout
          </p>
          <table className="min-w-full text-sm mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  calendarClassName
                </td>
                <td className="py-2 text-gray-600">
                  Calendar popup container
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  headerClassName
                </td>
                <td className="py-2 text-gray-600">
                  Calendar header with nav and selects
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  monthNavClassName
                </td>
                <td className="py-2 text-gray-600">Month/year selector group</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  navButtonClassName
                </td>
                <td className="py-2 text-gray-600">
                  Navigation buttons (prev/next month/year)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  gridClassName
                </td>
                <td className="py-2 text-gray-600">
                  Single month grid container
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  monthGridClassName
                </td>
                <td className="py-2 text-gray-600">
                  Multi-month grid wrapper
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  weekdayHeaderClassName
                </td>
                <td className="py-2 text-gray-600">
                  Weekday header row container
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  weekdayClassName
                </td>
                <td className="py-2 text-gray-600">
                  Individual weekday labels
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  weekNumberClassName
                </td>
                <td className="py-2 text-gray-600">Week number cells</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  footerClassName
                </td>
                <td className="py-2 text-gray-600">Calendar footer</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  todayButtonClassName
                </td>
                <td className="py-2 text-gray-600">Today button in footer</td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Day Cells
          </p>
          <table className="min-w-full text-sm mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dayClassName
                </td>
                <td className="py-2 text-gray-600">Base day cell styling</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  daySelectedClassName
                </td>
                <td className="py-2 text-gray-600">Selected day</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dayTodayClassName
                </td>
                <td className="py-2 text-gray-600">Today's date</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dayDisabledClassName
                </td>
                <td className="py-2 text-gray-600">Disabled days</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dayOutsideClassName
                </td>
                <td className="py-2 text-gray-600">Days from adjacent months</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dayRangeStartClassName
                </td>
                <td className="py-2 text-gray-600">Range start date</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dayRangeEndClassName
                </td>
                <td className="py-2 text-gray-600">Range end date</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dayRangeMiddleClassName
                </td>
                <td className="py-2 text-gray-600">Days between range start and end</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dayFocusedClassName
                </td>
                <td className="py-2 text-gray-600">Keyboard focused day</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dayMarkedClassName
                </td>
                <td className="py-2 text-gray-600">
                  Marked day cell styling (holidays, events, etc.)
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Dropdowns
          </p>
          <table className="min-w-full text-sm mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  monthSelectClassName
                </td>
                <td className="py-2 text-gray-600">Month dropdown button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  yearSelectClassName
                </td>
                <td className="py-2 text-gray-600">Year dropdown button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  monthDropdownClassName
                </td>
                <td className="py-2 text-gray-600">
                  Month dropdown button (alias)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  yearDropdownClassName
                </td>
                <td className="py-2 text-gray-600">
                  Year dropdown button (alias)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dropdownMenuClassName
                </td>
                <td className="py-2 text-gray-600">Dropdown menu container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dropdownItemClassName
                </td>
                <td className="py-2 text-gray-600">Individual dropdown items</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  dropdownItemSelectedClassName
                </td>
                <td className="py-2 text-gray-600">Selected dropdown item</td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Presets
          </p>
          <table className="min-w-full text-sm mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  presetsClassName
                </td>
                <td className="py-2 text-gray-600">Presets container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  presetButtonClassName
                </td>
                <td className="py-2 text-gray-600">Individual preset buttons</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  presetActiveClassName
                </td>
                <td className="py-2 text-gray-600">Active/selected preset</td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            Markers
          </p>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  markerIndicatorClassName
                </td>
                <td className="py-2 text-gray-600">
                  Default marker indicator dot (overridden by marker.color)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  markerTooltipClassName
                </td>
                <td className="py-2 text-gray-600">Marker tooltip container</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default DatePickerDemo;
