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
  sortDates,
  addMonths,
} from "./utils";
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
          } else if (focusedDate) {
            event.preventDefault();
            handleDateSelect(focusedDate, false);
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
    [disabled, isOpen, focusedDate, handleOpen, handleClose, handleDateSelect],
  );

  const handleCalendarKeyDown = useCallback(
    (event: React.KeyboardEvent, date: Date) => {
      if (disabled) return;

      let newDate: Date | null = null;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          newDate = new Date(date);
          newDate.setDate(date.getDate() - 1);
          break;
        case "ArrowRight":
          event.preventDefault();
          newDate = new Date(date);
          newDate.setDate(date.getDate() + 1);
          break;
        case "ArrowUp":
          event.preventDefault();
          newDate = new Date(date);
          newDate.setDate(date.getDate() - 7);
          break;
        case "ArrowDown":
          event.preventDefault();
          newDate = new Date(date);
          newDate.setDate(date.getDate() + 7);
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
      }

      if (newDate) {
        if (minDate && isBefore(newDate, minDate)) return;
        if (maxDate && isAfter(newDate, maxDate)) return;

        setFocusedDate(newDate);
        if (
          !calendarMonths.some(
            (m) =>
              newDate!.getMonth() === m.month.getMonth() &&
              newDate!.getFullYear() === m.month.getFullYear(),
          )
        ) {
          setDisplayMonth(startOfMonth(newDate));
        }
      }
    },
    [disabled, calendarMonths, minDate, maxDate, handleDateSelect, handleClose],
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
    focusedDate,
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
