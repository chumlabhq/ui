import {
  format,
  parse,
  isValid,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addYears,
  subYears,
  isSameDay,
  isSameMonth,
  isToday as isTodayFn,
  isBefore,
  isAfter,
  getWeek,
  setMonth,
  setYear,
  getYear,
  getMonth,
  startOfDay,
  subDays,
  addDays,
} from "date-fns";
import type { Locale } from "date-fns";
import type { CalendarDay, CalendarMonth, DateRange, DateValue, DisabledDateOptions, DateMarker } from "./utils/types";

export function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function fromDateString(dateString: string): Date | null {
  const parsed = parse(dateString, "yyyy-MM-dd", new Date());
  return isValid(parsed) ? parsed : null;
}

export function toDateValue(date: Date): DateValue {
  return {
    date: startOfDay(date),
    dateString: toDateString(date),
  };
}

export function formatDate(
  date: Date,
  formatStr: string = "MMM d, yyyy",
  locale?: Locale
): string {
  return format(date, formatStr, { locale });
}

export function formatDateRange(
  range: DateRange,
  formatStr: string = "MMM d, yyyy",
  locale?: Locale
): string {
  if (!range.start && !range.end) return "";
  if (range.start && !range.end) {
    return formatDate(range.start, formatStr, locale);
  }
  if (!range.start && range.end) {
    return formatDate(range.end, formatStr, locale);
  }
  return `${formatDate(range.start!, formatStr, locale)} - ${formatDate(range.end!, formatStr, locale)}`;
}

export function formatMultipleDates(
  dates: Date[],
  formatStr: string = "MMM d",
  locale?: Locale,
  maxDisplay: number = 3
): string {
  if (dates.length === 0) return "";
  if (dates.length === 1) return formatDate(dates[0], formatStr, locale);
  if (dates.length <= maxDisplay) {
    return dates.map((d) => formatDate(d, formatStr, locale)).join(", ");
  }
  const displayed = dates.slice(0, maxDisplay).map((d) => formatDate(d, formatStr, locale)).join(", ");
  return `${displayed} +${dates.length - maxDisplay} more`;
}

export function isDateDisabled(
  date: Date,
  options?: DisabledDateOptions,
  minDate?: Date,
  maxDate?: Date
): boolean {
  if (!options && !minDate && !maxDate) return false;

  const normalizedDate = startOfDay(date);
  const today = startOfDay(new Date());

  if (minDate && isBefore(normalizedDate, startOfDay(minDate))) return true;
  if (maxDate && isAfter(normalizedDate, startOfDay(maxDate))) return true;

  if (!options) return false;

  if (options.disablePast && isBefore(normalizedDate, today)) return true;
  if (options.disableFuture && isAfter(normalizedDate, today)) return true;
  if (options.before && isBefore(normalizedDate, startOfDay(options.before))) return true;
  if (options.after && isAfter(normalizedDate, startOfDay(options.after))) return true;
  if (options.dates && options.dates.some((d) => isSameDay(normalizedDate, d))) return true;
  if (options.daysOfWeek && options.daysOfWeek.includes(normalizedDate.getDay())) return true;
  if (options.custom && options.custom(normalizedDate)) return true;

  return false;
}

export function findMarker(date: Date, markers?: DateMarker[]): DateMarker | undefined {
  if (!markers || markers.length === 0) return undefined;
  return markers.find((m) => isSameDay(startOfDay(date), startOfDay(m.date)));
}

export function generateCalendarMonth(
  month: Date,
  options: {
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    showOutsideDays: boolean;
    fixedWeeks: boolean;
    selectedDates: Date[];
    rangeStart: Date | null;
    rangeEnd: Date | null;
    hoverDate: Date | null;
    disabledDates?: DisabledDateOptions;
    minDate?: Date;
    maxDate?: Date;
    showWeekNumbers?: boolean;
    markers?: DateMarker[];
  }
): CalendarMonth {
  const {
    weekStartsOn,
    showOutsideDays,
    fixedWeeks,
    selectedDates,
    rangeStart,
    rangeEnd,
    hoverDate,
    disabledDates,
    minDate,
    maxDate,
    showWeekNumbers,
    markers,
  } = options;

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn });
  let calendarEnd = endOfWeek(monthEnd, { weekStartsOn });

  if (fixedWeeks) {
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weeksCount = Math.ceil(days.length / 7);
    if (weeksCount < 6) {
      calendarEnd = addDays(calendarEnd, (6 - weeksCount) * 7);
    }
  }

  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  const effectiveRangeEnd = rangeEnd || (rangeStart && hoverDate ? hoverDate : null);

  for (const day of allDays) {
    const isOutside = !isSameMonth(day, month);
    const isSelected = selectedDates.some((d) => isSameDay(day, d));
    const isDisabled = isDateDisabled(day, disabledDates, minDate, maxDate);
    const isRangeStart = rangeStart ? isSameDay(day, rangeStart) : false;
    const isRangeEnd = effectiveRangeEnd ? isSameDay(day, effectiveRangeEnd) : false;
    
    let isInRange = false;
    if (rangeStart && effectiveRangeEnd) {
      const start = isBefore(rangeStart, effectiveRangeEnd) ? rangeStart : effectiveRangeEnd;
      const end = isBefore(rangeStart, effectiveRangeEnd) ? effectiveRangeEnd : rangeStart;
      isInRange = isAfter(day, start) && isBefore(day, end);
    }

    const marker = findMarker(day, markers);

    const calendarDay: CalendarDay = {
      date: day,
      dayOfMonth: day.getDate(),
      isToday: isTodayFn(day),
      isSelected,
      isDisabled,
      isOutside,
      isRangeStart,
      isRangeEnd,
      isInRange,
      isMarked: !!marker,
      marker,
    };

    if (showWeekNumbers && currentWeek.length === 0) {
      calendarDay.weekNumber = getWeek(day, { weekStartsOn });
    }

    if (!isOutside || showOutsideDays) {
      currentWeek.push(calendarDay);
    } else {
      currentWeek.push({
        ...calendarDay,
        dayOfMonth: 0,
      });
    }

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return { month, weeks };
}

export function getMonthOptions(locale?: Locale): { value: number; label: string }[] {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = setMonth(new Date(), i);
    months.push({
      value: i,
      label: format(date, "MMMM", { locale }),
    });
  }
  return months;
}

export function getYearOptions(
  currentYear: number,
  yearRange: number = 100
): { value: number; label: string }[] {
  const years = [];
  const startYear = currentYear - Math.floor(yearRange / 2);
  const endYear = currentYear + Math.ceil(yearRange / 2);
  
  for (let year = startYear; year <= endYear; year++) {
    years.push({
      value: year,
      label: String(year),
    });
  }
  return years;
}

export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

export function getPreviousYear(date: Date): Date {
  return subYears(date, 1);
}

export function getNextYear(date: Date): Date {
  return addYears(date, 1);
}

export function setMonthOfDate(date: Date, monthIndex: number): Date {
  return setMonth(date, monthIndex);
}

export function setYearOfDate(date: Date, year: number): Date {
  return setYear(date, year);
}

export function getWeekdayHeaders(
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  formatStr: string = "EEE",
  locale?: Locale
): string[] {
  const days = [];
  const baseDate = startOfWeek(new Date(), { weekStartsOn });
  
  for (let i = 0; i < 7; i++) {
    const day = addDays(baseDate, i);
    days.push(format(day, formatStr, { locale }));
  }
  
  return days;
}

export function isRangeEqual(a: DateRange | null, b: DateRange | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  
  const startEqual = (!a.start && !b.start) || (a.start !== null && b.start !== null && isSameDay(a.start, b.start));
  const endEqual = (!a.end && !b.end) || (a.end !== null && b.end !== null && isSameDay(a.end, b.end));
  
  return !!(startEqual && endEqual);
}

export function sortDates(dates: Date[]): Date[] {
  return [...dates].sort((a, b) => a.getTime() - b.getTime());
}

export function getDefaultPresets(mode: "single" | "range" | "multiple") {
  const today = startOfDay(new Date());
  
  if (mode === "single") {
    return [
      { label: "Today", getValue: () => today },
      { label: "Yesterday", getValue: () => subDays(today, 1) },
      { label: "Tomorrow", getValue: () => addDays(today, 1) },
    ];
  }
  
  if (mode === "range") {
    return [
      { label: "Today", getValue: () => ({ start: today, end: today }) },
      { label: "Yesterday", getValue: () => ({ start: subDays(today, 1), end: subDays(today, 1) }) },
      { label: "Last 7 Days", getValue: () => ({ start: subDays(today, 6), end: today }) },
      { label: "Last 30 Days", getValue: () => ({ start: subDays(today, 29), end: today }) },
      { label: "This Month", getValue: () => ({ start: startOfMonth(today), end: endOfMonth(today) }) },
      { label: "Last Month", getValue: () => ({ start: startOfMonth(subMonths(today, 1)), end: endOfMonth(subMonths(today, 1)) }) },
    ];
  }
  
  return [
    { label: "Today", getValue: () => [today] },
    { label: "Weekdays This Week", getValue: () => {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 4) });
    }},
  ];
}

export {
  format,
  parse,
  isValid,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addYears,
  subYears,
  isSameDay,
  isSameMonth,
  isTodayFn as isToday,
  isBefore,
  isAfter,
  getWeek,
  setMonth,
  setYear,
  getYear,
  getMonth,
  startOfDay,
  subDays,
  addDays,
};
