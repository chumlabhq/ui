import { describe, it, expect } from "vitest";
import {
  generateCalendarMonth,
  toDateString,
  fromDateString,
  toDateValue,
  formatDate,
  formatDateRange,
  formatMultipleDates,
  isDateDisabled,
  findMarker,
  getMonthOptions,
  getYearOptions,
  getPreviousMonth,
  getNextMonth,
  getPreviousYear,
  getNextYear,
  setMonthOfDate,
  setYearOfDate,
  getWeekdayHeaders,
  isRangeEqual,
  sortDates,
  getDefaultPresets,
} from "../utils";
import { startOfDay } from "date-fns";

// ─── generateCalendarMonth – fixedWeeks branch (lines 154-159) ──────────────

describe("generateCalendarMonth – fixedWeeks", () => {
  const baseOptions = {
    weekStartsOn: 0 as const,
    showOutsideDays: true,
    fixedWeeks: true,
    selectedDates: [],
    rangeStart: null,
    rangeEnd: null,
    hoverDate: null,
  };

  it("always returns exactly 6 weeks when fixedWeeks is true", () => {
    // February 2015 starts on Sunday (weekStartsOn=0), so its natural calendar
    // grid fits in exactly 4 weeks — fixedWeeks should pad to 6.
    const feb2015 = new Date(2015, 1, 1);
    const result = generateCalendarMonth(feb2015, baseOptions);
    expect(result.weeks.length).toBe(6);
  });

  it("still returns 6 weeks for a month that already spans 5 natural rows", () => {
    // October 2023 starts on a Sunday with weekStartsOn=0 → 5 natural rows
    const oct2023 = new Date(2023, 9, 1);
    const result = generateCalendarMonth(oct2023, baseOptions);
    expect(result.weeks.length).toBe(6);
  });

  it("does not add extra weeks when month already fills 6 rows", () => {
    // July 2023 starts on Saturday with weekStartsOn=0 → already 6 rows
    const jul2023 = new Date(2023, 6, 1);
    const result = generateCalendarMonth(jul2023, baseOptions);
    expect(result.weeks.length).toBe(6);
  });
});

// ─── generateCalendarMonth – showWeekNumbers (line 205) ──────────────────────

describe("generateCalendarMonth – showWeekNumbers", () => {
  const baseOptions = {
    weekStartsOn: 1 as const, // Monday start
    showOutsideDays: true,
    fixedWeeks: false,
    selectedDates: [],
    rangeStart: null,
    rangeEnd: null,
    hoverDate: null,
    showWeekNumbers: true,
  };

  it("sets weekNumber on the first day of each week", () => {
    const jan2024 = new Date(2024, 0, 1);
    const result = generateCalendarMonth(jan2024, baseOptions);
    for (const week of result.weeks) {
      // First day of each week should have weekNumber defined
      expect(week[0].weekNumber).toBeDefined();
      expect(typeof week[0].weekNumber).toBe("number");
      // Subsequent days within the week should not have weekNumber
      for (let i = 1; i < week.length; i++) {
        expect(week[i].weekNumber).toBeUndefined();
      }
    }
  });

  it("does not set weekNumber when showWeekNumbers is false", () => {
    const jan2024 = new Date(2024, 0, 1);
    const result = generateCalendarMonth(jan2024, {
      ...baseOptions,
      showWeekNumbers: false,
    });
    for (const week of result.weeks) {
      for (const day of week) {
        expect(day.weekNumber).toBeUndefined();
      }
    }
  });
});

// ─── generateCalendarMonth – trailing partial week (line 218) ─────────────────

describe("generateCalendarMonth – trailing partial week handling", () => {
  it("month is correctly split into full 7-day weeks (no leftover days)", () => {
    // The loop pushes weeks only when currentWeek.length===7, then checks
    // currentWeek.length>0 for any remainder. With showOutsideDays=true and
    // fixedWeeks=false, all weeks should be complete.
    const mar2024 = new Date(2024, 2, 1);
    const result = generateCalendarMonth(mar2024, {
      weekStartsOn: 0,
      showOutsideDays: true,
      fixedWeeks: false,
      selectedDates: [],
      rangeStart: null,
      rangeEnd: null,
      hoverDate: null,
    });
    for (const week of result.weeks) {
      expect(week.length).toBe(7);
    }
  });
});

// ─── isDateDisabled – various option paths ───────────────────────────────────

describe("isDateDisabled", () => {
  const today = startOfDay(new Date());

  it("returns false when no options, minDate, or maxDate", () => {
    expect(isDateDisabled(today)).toBe(false);
  });

  it("returns true when date is before minDate", () => {
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 1);
    expect(isDateDisabled(today, undefined, minDate)).toBe(true);
  });

  it("returns true when date is after maxDate", () => {
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() - 1);
    expect(isDateDisabled(today, undefined, undefined, maxDate)).toBe(true);
  });

  it("returns false when options provided but date is not disabled", () => {
    expect(isDateDisabled(today, {})).toBe(false);
  });

  it("returns true for disablePast on a past date", () => {
    const past = new Date(today);
    past.setDate(past.getDate() - 1);
    expect(isDateDisabled(past, { disablePast: true })).toBe(true);
  });

  it("returns true for disableFuture on a future date", () => {
    const future = new Date(today);
    future.setDate(future.getDate() + 1);
    expect(isDateDisabled(future, { disableFuture: true })).toBe(true);
  });

  it("returns true when date matches a disabled date in the dates array", () => {
    expect(isDateDisabled(today, { dates: [today] })).toBe(true);
  });

  it("returns true when day-of-week matches daysOfWeek", () => {
    const dayOfWeek = today.getDay();
    expect(isDateDisabled(today, { daysOfWeek: [dayOfWeek] })).toBe(true);
  });

  it("returns true when custom function returns true", () => {
    expect(isDateDisabled(today, { custom: () => true })).toBe(true);
  });

  it("returns false when custom function returns false", () => {
    expect(isDateDisabled(today, { custom: () => false })).toBe(false);
  });
});

// ─── findMarker ───────────────────────────────────────────────────────────────

describe("findMarker", () => {
  it("returns undefined when markers is undefined", () => {
    expect(findMarker(new Date())).toBeUndefined();
  });

  it("returns undefined when markers array is empty", () => {
    expect(findMarker(new Date(), [])).toBeUndefined();
  });

  it("returns the matching marker", () => {
    const date = new Date(2024, 0, 15);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const marker = { date, color: "red" } as any;
    expect(findMarker(date, [marker])).toBe(marker);
  });
});

// ─── formatDateRange ──────────────────────────────────────────────────────────

describe("formatDateRange", () => {
  it("returns empty string when both start and end are missing", () => {
    expect(formatDateRange({ start: null, end: null })).toBe("");
  });

  it("returns formatted start when only start is present", () => {
    const result = formatDateRange({ start: new Date(2024, 0, 15), end: null });
    expect(result).toContain("Jan");
  });

  it("returns formatted end when only end is present", () => {
    const result = formatDateRange({ start: null, end: new Date(2024, 0, 15) });
    expect(result).toContain("Jan");
  });

  it("returns range string when both are present", () => {
    const result = formatDateRange({
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 31),
    });
    expect(result).toContain(" - ");
  });
});

// ─── formatMultipleDates ──────────────────────────────────────────────────────

describe("formatMultipleDates", () => {
  it("returns empty string for empty array", () => {
    expect(formatMultipleDates([])).toBe("");
  });

  it("returns single formatted date for one-element array", () => {
    const result = formatMultipleDates([new Date(2024, 0, 1)]);
    expect(result).toContain("Jan");
  });

  it("joins dates with comma when count <= maxDisplay", () => {
    const dates = [new Date(2024, 0, 1), new Date(2024, 0, 2)];
    const result = formatMultipleDates(dates);
    expect(result).toContain(",");
  });

  it("appends '+N more' when count exceeds maxDisplay", () => {
    const dates = [
      new Date(2024, 0, 1),
      new Date(2024, 0, 2),
      new Date(2024, 0, 3),
      new Date(2024, 0, 4),
    ];
    const result = formatMultipleDates(dates, "MMM d", undefined, 3);
    expect(result).toContain("+1 more");
  });
});

// ─── getMonthOptions ──────────────────────────────────────────────────────────

describe("getMonthOptions", () => {
  it("returns 12 month options", () => {
    expect(getMonthOptions()).toHaveLength(12);
  });

  it("first month value is 0 (January)", () => {
    expect(getMonthOptions()[0].value).toBe(0);
  });

  it("last month value is 11 (December)", () => {
    expect(getMonthOptions()[11].value).toBe(11);
  });
});

// ─── getYearOptions ───────────────────────────────────────────────────────────

describe("getYearOptions", () => {
  it("returns correct number of years for default range (100)", () => {
    const opts = getYearOptions(2024);
    // startYear = 2024 - 50 = 1974, endYear = 2024 + 50 = 2074 → 101 entries
    expect(opts.length).toBe(101);
  });

  it("includes the currentYear", () => {
    const opts = getYearOptions(2024);
    expect(opts.some((o) => o.value === 2024)).toBe(true);
  });

  it("respects custom yearRange", () => {
    const opts = getYearOptions(2024, 10);
    // startYear = 2024 - 5 = 2019, endYear = 2024 + 5 = 2029 → 11
    expect(opts.length).toBe(11);
  });
});

// ─── isRangeEqual ─────────────────────────────────────────────────────────────

describe("isRangeEqual", () => {
  it("returns true when both ranges are null", () => {
    expect(isRangeEqual(null, null)).toBe(true);
  });

  it("returns false when one range is null", () => {
    expect(isRangeEqual({ start: new Date(), end: null }, null)).toBe(false);
  });

  it("returns true when both ranges have same dates", () => {
    const d = new Date(2024, 0, 1);
    expect(isRangeEqual({ start: d, end: d }, { start: d, end: d })).toBe(true);
  });

  it("returns true when both ranges have null start and end", () => {
    expect(isRangeEqual({ start: null, end: null }, { start: null, end: null })).toBe(true);
  });
});

// ─── sortDates ────────────────────────────────────────────────────────────────

describe("sortDates", () => {
  it("sorts dates in ascending order", () => {
    const dates = [new Date(2024, 2, 1), new Date(2024, 0, 1), new Date(2024, 1, 1)];
    const sorted = sortDates(dates);
    expect(sorted[0].getMonth()).toBe(0);
    expect(sorted[1].getMonth()).toBe(1);
    expect(sorted[2].getMonth()).toBe(2);
  });

  it("does not mutate the original array", () => {
    const dates = [new Date(2024, 2, 1), new Date(2024, 0, 1)];
    const original = [...dates];
    sortDates(dates);
    expect(dates[0]).toEqual(original[0]);
  });
});

// ─── getDefaultPresets ────────────────────────────────────────────────────────

describe("getDefaultPresets", () => {
  it("returns 3 presets for single mode", () => {
    expect(getDefaultPresets("single")).toHaveLength(3);
  });

  it("returns 6 presets for range mode", () => {
    expect(getDefaultPresets("range")).toHaveLength(6);
  });

  it("returns 2 presets for multiple mode", () => {
    expect(getDefaultPresets("multiple")).toHaveLength(2);
  });

  it("single mode Today preset returns today's date", () => {
    const presets = getDefaultPresets("single");
    const today = startOfDay(new Date());
    const todayPreset = presets.find((p) => p.label === "Today");
    expect(todayPreset).toBeDefined();
    expect((todayPreset!.getValue() as Date).getTime()).toBe(today.getTime());
  });

  it("range mode Last 7 Days preset returns a range", () => {
    const presets = getDefaultPresets("range");
    const last7 = presets.find((p) => p.label === "Last 7 Days");
    expect(last7).toBeDefined();
    const value = last7!.getValue() as { start: Date; end: Date };
    expect(value).toHaveProperty("start");
    expect(value).toHaveProperty("end");
  });

  it("multiple mode Weekdays This Week preset returns array of dates", () => {
    const presets = getDefaultPresets("multiple");
    const weekdays = presets.find((p) => p.label === "Weekdays This Week");
    expect(weekdays).toBeDefined();
    const value = weekdays!.getValue() as Date[];
    expect(Array.isArray(value)).toBe(true);
    expect(value.length).toBe(5);
  });
});

// ─── getWeekdayHeaders ────────────────────────────────────────────────────────

describe("getWeekdayHeaders", () => {
  it("returns 7 weekday headers", () => {
    expect(getWeekdayHeaders(0)).toHaveLength(7);
  });

  it("starts with Sunday when weekStartsOn=0", () => {
    const headers = getWeekdayHeaders(0);
    expect(headers[0]).toBe("Sun");
  });

  it("starts with Monday when weekStartsOn=1", () => {
    const headers = getWeekdayHeaders(1);
    expect(headers[0]).toBe("Mon");
  });
});

// ─── navigation helpers ───────────────────────────────────────────────────────

describe("date navigation helpers", () => {
  const base = new Date(2024, 5, 15); // June 15, 2024

  it("getPreviousMonth returns one month earlier", () => {
    expect(getPreviousMonth(base).getMonth()).toBe(4); // May
  });

  it("getNextMonth returns one month later", () => {
    expect(getNextMonth(base).getMonth()).toBe(6); // July
  });

  it("getPreviousYear returns one year earlier", () => {
    expect(getPreviousYear(base).getFullYear()).toBe(2023);
  });

  it("getNextYear returns one year later", () => {
    expect(getNextYear(base).getFullYear()).toBe(2025);
  });

  it("setMonthOfDate sets the month correctly", () => {
    expect(setMonthOfDate(base, 0).getMonth()).toBe(0); // January
  });

  it("setYearOfDate sets the year correctly", () => {
    expect(setYearOfDate(base, 2030).getFullYear()).toBe(2030);
  });
});

// ─── toDateString / fromDateString / toDateValue / formatDate ─────────────────

describe("basic date utils", () => {
  it("toDateString formats correctly", () => {
    expect(toDateString(new Date(2024, 0, 15))).toBe("2024-01-15");
  });

  it("fromDateString parses valid string", () => {
    const d = fromDateString("2024-01-15");
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2024);
  });

  it("fromDateString returns null for invalid string", () => {
    expect(fromDateString("not-a-date")).toBeNull();
  });

  it("toDateValue returns correct dateString", () => {
    const dv = toDateValue(new Date(2024, 0, 15));
    expect(dv.dateString).toBe("2024-01-15");
  });

  it("formatDate uses custom format string", () => {
    const result = formatDate(new Date(2024, 0, 15), "yyyy/MM/dd");
    expect(result).toBe("2024/01/15");
  });
});
