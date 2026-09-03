import { useState, useCallback, useMemo } from "react";
import type {
  UseDatePickerProps,
  CalendarMonth,
  DateRange,
  DateRangeValue,
} from "./utils/types";
import {
  generateCalendarMonth,
  toDateValue,
  isSameDay,
  startOfDay,
  startOfMonth,
  getNextMonth,
  getPreviousMonth,
  setMonthOfDate,
  setYearOfDate,
  isBefore,
  isAfter,
  isDateDisabled,
  sortDates,
  addMonths,
} from "./utils";
import { startOfWeek, endOfWeek } from "date-fns";
import { useControllableState } from "../../utils/useControllableState";

export function useDatePicker(props: UseDatePickerProps) {
  const {
    mode,
    value,
    defaultValue,
    onValueChange,
    minDate,
    maxDate,
    disabledDates,
    weekStartsOn,
    numberOfMonths,
    showOutsideDays,
    outsideDaysSelectable,
    fixedWeeks,
    disabled,
    showWeekNumbers,
    markers,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onMonthChange,
  } = props;

  // Selection is controllable: pass `value` to drive it externally, or omit it
  // and the picker tracks its own selection (seeded by `defaultValue`), the
  // same way `isOpen` works below. onValueChange still fires either way, and
  // is invoked from the handlers so its two-argument shape is preserved.
  const [currentValue, setCurrentValue] = useControllableState<
    Date | DateRange | Date[] | null
  >({
    value,
    defaultValue: defaultValue ?? null,
  });

  // Internal typed accessors for the unified value/onValueChange
  const singleValue = mode === "single" ? (currentValue as Date | null | undefined) : undefined;
  const rangeValue = mode === "range" ? (currentValue as DateRange | null | undefined) : undefined;
  const multipleValue = mode === "multiple" ? (currentValue as Date[] | null | undefined) : undefined;

  const emitSingle = mode === "single"
    ? (onValueChange as ((date: Date | null, dateValue: import("./utils/types").DateValue | null) => void) | undefined)
    : undefined;
  const emitRange = mode === "range"
    ? (onValueChange as ((range: DateRange | null, rangeValue: DateRangeValue | null) => void) | undefined)
    : undefined;
  const emitMultiple = mode === "multiple"
    ? (onValueChange as ((dates: Date[] | null, dateValues: import("./utils/types").DateValue[] | null) => void) | undefined)
    : undefined;

  const getInitialMonth = () => {
    if (mode === "single" && singleValue) return startOfMonth(singleValue);
    if (mode === "range" && rangeValue?.start)
      return startOfMonth(rangeValue.start);
    if (mode === "multiple" && multipleValue?.length)
      return startOfMonth(multipleValue[0]);
    return startOfMonth(new Date());
  };

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [displayMonth, setDisplayMonth] = useState<Date>(getInitialMonth);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [rangeSelectionState, setRangeSelectionState] = useState<
    "start" | "end"
  >("start");

  const selectedDates = useMemo(() => {
    if (mode === "single") {
      return singleValue ? [singleValue] : [];
    }
    if (mode === "range") {
      const dates: Date[] = [];
      if (rangeValue?.start) dates.push(rangeValue.start);
      if (rangeValue?.end) dates.push(rangeValue.end);
      return dates;
    }
    return multipleValue || [];
  }, [mode, singleValue, rangeValue, multipleValue]);

  const rangeStart = mode === "range" ? rangeValue?.start || null : null;
  const rangeEnd = mode === "range" ? rangeValue?.end || null : null;

  const calendarMonths: CalendarMonth[] = useMemo(() => {
    const months: CalendarMonth[] = [];
    for (let i = 0; i < numberOfMonths; i++) {
      const monthDate = addMonths(displayMonth, i);
      months.push(
        generateCalendarMonth(monthDate, {
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
        }),
      );
    }
    return months;
  }, [
    displayMonth,
    numberOfMonths,
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
  ]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setFocusedDate(null);
    if (mode === "single" && singleValue) {
      setDisplayMonth(startOfMonth(singleValue));
    } else if (mode === "range" && rangeValue?.start) {
      setDisplayMonth(startOfMonth(rangeValue.start));
    } else if (mode === "multiple" && multipleValue?.length) {
      setDisplayMonth(startOfMonth(multipleValue[0]));
    }
  }, [disabled, mode, singleValue, rangeValue, multipleValue, setIsOpen]);

  /**
   * The grid's roving tabindex needs a starting cell, and every way the panel
   * can open has to produce one — `handleOpen`, `defaultOpen`, and a controlled
   * `open` flipped by the consumer. Seeding inside `handleOpen` covered only
   * the first, which left the other two with no tabbable day at all.
   *
   * Derived rather than written into state on open: an effect that seeds state
   * costs a second render before the grid has a tabbable cell, and the roving
   * focus effect downstream would run against the render that had none.
   *
   * APG's date picker opens on the selected day, or on today when there is no
   * selection.
   */
  const seededFocusDate = useMemo(() => {
    if (!isOpen) return null;
    return startOfDay(
      (mode === "single" ? singleValue : undefined) ??
        (mode === "range" ? rangeValue?.start : undefined) ??
        (mode === "multiple" ? multipleValue?.[0] : undefined) ??
        new Date(),
    );
  }, [isOpen, mode, singleValue, rangeValue, multipleValue]);

  const effectiveFocusedDate = focusedDate ?? seededFocusDate;

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setHoverDate(null);
    setFocusedDate(null);
    if (mode === "range" && rangeValue?.start && !rangeValue?.end) {
      setRangeSelectionState("start");
    }
  }, [mode, rangeValue, setIsOpen]);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [isOpen, handleOpen, handleClose]);

  const handleDateSelect = useCallback(
    (date: Date, isOutside: boolean) => {
      if (disabled) return;
      if (isOutside && !outsideDaysSelectable) return;

      const normalizedDate = startOfDay(date);

      if (mode === "single") {
        const dateValue = toDateValue(normalizedDate);
        setCurrentValue(normalizedDate);
        emitSingle?.(normalizedDate, dateValue);
        handleClose();
        return;
      }

      if (mode === "range") {
        if (rangeSelectionState === "start") {
          const newRange: DateRange = { start: normalizedDate, end: null };
          const newRangeValue: DateRangeValue = {
            start: toDateValue(normalizedDate),
            end: null,
          };
          setCurrentValue(newRange);
          emitRange?.(newRange, newRangeValue);
          setRangeSelectionState("end");
        } else {
          const start = rangeValue?.start || normalizedDate;
          let rangeStartDate = start;
          let rangeEndDate = normalizedDate;

          if (isBefore(normalizedDate, start)) {
            rangeStartDate = normalizedDate;
            rangeEndDate = start;
          }

          const newRange: DateRange = {
            start: rangeStartDate,
            end: rangeEndDate,
          };
          const newRangeValue: DateRangeValue = {
            start: toDateValue(rangeStartDate),
            end: toDateValue(rangeEndDate),
          };
          setCurrentValue(newRange);
          emitRange?.(newRange, newRangeValue);
          setRangeSelectionState("start");
          handleClose();
        }
        return;
      }

      if (mode === "multiple") {
        const currentDates = multipleValue || [];
        const existingIndex = currentDates.findIndex((d) =>
          isSameDay(d, normalizedDate),
        );

        let newDates: Date[];
        if (existingIndex >= 0) {
          newDates = currentDates.filter((_, i) => i !== existingIndex);
        } else {
          newDates = sortDates([...currentDates, normalizedDate]);
        }

        const dateValues = newDates.map(toDateValue);
        setCurrentValue(newDates.length > 0 ? newDates : null);
        emitMultiple?.(
          newDates.length > 0 ? newDates : null,
          dateValues.length > 0 ? dateValues : null,
        );
      }
    },
    [
      mode,
      disabled,
      outsideDaysSelectable,
      rangeSelectionState,
      rangeValue,
      multipleValue,
      emitSingle,
      emitRange,
      emitMultiple,
      setCurrentValue,
      handleClose,
    ],
  );

  const handleMonthNavigation = useCallback(
    (direction: "prev" | "next") => {
      setDisplayMonth((current) => {
        const newMonth =
          direction === "prev"
            ? getPreviousMonth(current)
            : getNextMonth(current);
        onMonthChange?.(newMonth);
        return newMonth;
      });
    },
    [onMonthChange],
  );

  const handleMonthSelect = useCallback(
    (monthIndex: number) => {
      setDisplayMonth((current) => {
        const newMonth = setMonthOfDate(current, monthIndex);
        onMonthChange?.(newMonth);
        return newMonth;
      });
    },
    [onMonthChange],
  );

  const handleYearSelect = useCallback(
    (year: number) => {
      setDisplayMonth((current) => {
        const newMonth = setYearOfDate(current, year);
        onMonthChange?.(newMonth);
        return newMonth;
      });
    },
    [onMonthChange],
  );

  const handleDateHover = useCallback(
    (date: Date | null) => {
      if (mode === "range" && rangeSelectionState === "end" && date) {
        setHoverDate(date);
      } else {
        setHoverDate(null);
      }
    },
    [mode, rangeSelectionState],
  );

  const handleDateFocus = useCallback((date: Date | null) => {
    setFocusedDate(date);
  }, []);

  const handleClear = useCallback(() => {
    setCurrentValue(null);
    if (mode === "single") {
      emitSingle?.(null, null);
    } else if (mode === "range") {
      emitRange?.(null, null);
      setRangeSelectionState("start");
    } else {
      emitMultiple?.(null, null);
    }
  }, [mode, emitSingle, emitRange, emitMultiple, setCurrentValue]);

  const handleTodayClick = useCallback(() => {
    const today = startOfDay(new Date());
    handleDateSelect(today, false);
  }, [handleDateSelect]);

  const goToToday = useCallback(() => {
    const today = startOfDay(new Date());
    setDisplayMonth(startOfMonth(today));
    onMonthChange?.(startOfMonth(today));
  }, [onMonthChange]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Escape":
          if (isOpen) {
            event.preventDefault();
            handleClose();
          }
          break;
        case "Enter":
        case " ":
          if (!isOpen) {
            event.preventDefault();
            handleOpen();
          } else if (effectiveFocusedDate) {
            event.preventDefault();
            handleDateSelect(effectiveFocusedDate, false);
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            handleOpen();
          }
          break;
        case "Tab":
          if (isOpen && !event.shiftKey) {
            handleClose();
          }
          break;
      }
    },
    [disabled, isOpen, effectiveFocusedDate, handleOpen, handleClose, handleDateSelect],
  );

  const isDisabledDate = useCallback(
    (date: Date) => isDateDisabled(date, disabledDates, minDate, maxDate),
    [disabledDates, minDate, maxDate],
  );

  const addDays = (date: Date, days: number): Date => {
    const next = new Date(date);
    next.setDate(date.getDate() + days);
    return next;
  };

  /**
   * The nearest focusable day at or after `target`, travelling in `direction`.
   *
   * A disabled day renders as a disabled `<button>`, which cannot take focus.
   * Landing the roving tabindex on one would move `tabIndex={0}` to a cell the
   * browser refuses to focus, leaving DOM focus on the previous cell and every
   * subsequent arrow key computing from a stale date — the grid would appear to
   * freeze. Stepping over them keeps state and focus on the same element.
   */
  const nextFocusable = useCallback(
    (target: Date, direction: 1 | -1): Date | null => {
      for (let offset = 0; offset <= 366; offset++) {
        const candidate = addDays(target, direction * offset);
        if (minDate && isBefore(candidate, minDate)) return null;
        if (maxDate && isAfter(candidate, maxDate)) return null;
        if (!isDisabledDate(candidate)) return candidate;
      }
      return null;
    },
    [minDate, maxDate, isDisabledDate],
  );

  const handleCalendarKeyDown = useCallback(
    (event: React.KeyboardEvent, date: Date) => {
      if (disabled) return;

      let target: Date | null = null;
      let direction: 1 | -1 = 1;

      switch (event.key) {
        case "ArrowLeft":
          target = addDays(date, -1);
          direction = -1;
          break;
        case "ArrowRight":
          target = addDays(date, 1);
          break;
        case "ArrowUp":
          target = addDays(date, -7);
          direction = -1;
          break;
        case "ArrowDown":
          target = addDays(date, 7);
          break;
        case "Home":
          // Week bounds, per the WAI-ARIA grid pattern — not month bounds.
          // Same helpers the grid itself is generated with, so a custom
          // `weekStartsOn` moves both together.
          target = startOfDay(startOfWeek(date, { weekStartsOn }));
          direction = 1;
          break;
        case "End":
          target = startOfDay(endOfWeek(date, { weekStartsOn }));
          direction = -1;
          break;
        case "PageUp":
          target = addMonths(date, event.shiftKey ? -12 : -1);
          direction = -1;
          break;
        case "PageDown":
          target = addMonths(date, event.shiftKey ? 12 : 1);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          handleDateSelect(date, false);
          return;
        case "Escape":
          event.preventDefault();
          handleClose();
          return;
        default:
          return;
      }

      event.preventDefault();
      const newDate = nextFocusable(target, direction);
      if (!newDate) return;

      setFocusedDate(newDate);
      if (
        !calendarMonths.some(
          (m) =>
            newDate.getMonth() === m.month.getMonth() &&
            newDate.getFullYear() === m.month.getFullYear(),
        )
      ) {
        setDisplayMonth(startOfMonth(newDate));
      }
    },
    [
      disabled,
      calendarMonths,
      weekStartsOn,
      nextFocusable,
      handleDateSelect,
      handleClose,
    ],
  );

  return {
    isOpen,
    // The resolved selection — the `value` prop when controlled, the internal
    // state otherwise. Consumers must read this rather than the raw prop.
    currentValue,
    // Exposed for selection paths that live outside this hook (presets); a
    // no-op when controlled, since useControllableState defers to the prop.
    setCurrentValue,
    displayMonth,
    calendarMonths,
    selectedDates,
    hoverDate,
    focusedDate: effectiveFocusedDate,
    rangeSelectionState,
    handleOpen,
    handleClose,
    handleToggle,
    handleDateSelect,
    handleMonthNavigation,
    handleMonthSelect,
    handleYearSelect,
    handleDateHover,
    handleDateFocus,
    handleClear,
    handleTodayClick,
    goToToday,
    handleKeyDown,
    handleCalendarKeyDown,
  };
}
