import {
  useRef,
  useEffect,
  useId,
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type {
  DatePickerProps,
  DatePickerClasses,
  CalendarDay,
  DatePreset,
  DateRange,
  DateMarker,
} from "./utils/types";
import { useDatePicker } from "./useDatePicker";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  TodayIcon,
  CheckIcon,
} from "./icons";
import {
  formatDate,
  formatDateRange,
  formatMultipleDates,
  getWeekdayHeaders,
  getMonthOptions,
  getYearOptions,
  getYear,
  getMonth,
  isSameDay,
  getDefaultPresets,
} from "./utils";
import { cn } from "../../utils/cn";
import { useStablePositionAfterOpen } from "../../utils/useStablePositionAfterOpen";
import { useReducedMotion } from "../../utils/useReducedMotion";
import {
  DEFAULT_DATEPICKER_CLASSES,
  UNSTYLED_DATEPICKER_CLASSES,
} from "./constants";

// ─── Sub-component interfaces ────────────────────────────────────────────────

interface DropdownProps {
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
  buttonClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  itemSelectedClassName?: string;
  selectedIcon?: React.ReactNode;
  ariaLabel: string;
}

const CustomDropdown = memo(function CustomDropdown({
  value,
  options,
  onChange,
  buttonClassName,
  menuClassName,
  itemClassName,
  itemSelectedClassName,
  selectedIcon,
  ariaLabel,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedOptionRef.current) {
      selectedOptionRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedOption?.label}</span>
        {isOpen ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )}
      </button>
      {isOpen && (
        <div className={menuClassName} role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                ref={isSelected ? selectedOptionRef : undefined}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={cn(
                  itemClassName,
                  isSelected && itemSelectedClassName,
                )}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span>{option.label}</span>
                {isSelected &&
                  (selectedIcon || <CheckIcon className="w-4 h-4" />)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

CustomDropdown.displayName = "CustomDropdown";

// ─── Marker Tooltip Hook ─────────────────────────────────────────────────────

function useMarkerTooltip(
  marker: DateMarker | undefined,
  showTooltip: boolean,
  portalContainer?: HTMLElement | null,
) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!marker || !showTooltip) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const gap = 6;
    let top = rect.bottom + gap;
    let left = rect.left + rect.width / 2;
    if (top + 80 > window.innerHeight) top = rect.top - 80 - gap;
    if (left + 100 > window.innerWidth) left = window.innerWidth - 110;
    if (left < 10) left = 10;
    setPosition({ top, left });
    setIsVisible(true);
  }, [marker, showTooltip]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    setPosition(null);
  }, []);

  const tooltipPortal =
    isVisible && position && marker
      ? createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              zIndex: 100,
              top: position.top,
              left: position.left,
              transform: "translateX(-50%)",
              maxWidth: 240,
              padding: "8px 12px",
              borderRadius: 8,
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              color: "#f1f5f9",
              fontSize: 12,
              lineHeight: 1.5,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              pointerEvents: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {marker.color && (
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: marker.color, flexShrink: 0 }} />
              )}
              <span style={{ fontWeight: 600 }}>{marker.label}</span>
            </div>
            {marker.description && (
              <div style={{ color: "#94a3b8", marginTop: 2 }}>{marker.description}</div>
            )}
            {marker.type && (
              <div style={{ color: "#64748b", marginTop: 4, textTransform: "capitalize", fontSize: 11 }}>{marker.type}</div>
            )}
          </div>,
          portalContainer ?? document.body,
        )
      : null;

  return { tooltipPortal, handleMouseEnter, handleMouseLeave };
}

// ─── DayCell ─────────────────────────────────────────────────────────────────

interface DayCellProps {
  day: CalendarDay;
  datePickerId: string;
  classes: {
    day: string;
    daySelected: string;
    dayToday: string;
    dayDisabled: string;
    dayOutside: string;
    dayRangeStart: string;
    dayRangeEnd: string;
    dayRangeMiddle: string;
    dayFocused: string;
    dayMarked: string;
    markerIndicator: string;
    markerTooltip: string;
  };
  isFocused: boolean;
  showOutsideDays: boolean;
  showMarkerIndicator: boolean;
  showMarkerTooltip: boolean;
  portalContainer?: HTMLElement | null;
  onSelect: (date: Date, isOutside: boolean) => void;
  onHover: (date: Date | null) => void;
  onFocus: (date: Date | null) => void;
  onKeyDown: (event: React.KeyboardEvent, date: Date) => void;
}

const DayCell = memo(function DayCell({
  day,
  datePickerId,
  classes: cls,
  isFocused,
  showOutsideDays,
  showMarkerIndicator,
  showMarkerTooltip,
  portalContainer,
  onSelect,
  onHover,
  onFocus,
  onKeyDown,
}: DayCellProps) {
  // Hooks must be called unconditionally — before any early return
  const markerColor = day.marker?.color;
  const { tooltipPortal, handleMouseEnter: tooltipEnter, handleMouseLeave: tooltipLeave } = useMarkerTooltip(
    day.isMarked ? day.marker : undefined,
    showMarkerTooltip,
    portalContainer,
  );

  if (day.dayOfMonth === 0 || (day.isOutside && !showOutsideDays)) {
    return <div className={cls.day} aria-hidden="true" />;
  }

  const classNames = cn(
    cls.day,
    day.isSelected && cls.daySelected,
    day.isToday && cls.dayToday,
    day.isDisabled && cls.dayDisabled,
    day.isOutside && cls.dayOutside,
    day.isRangeStart && cls.dayRangeStart,
    day.isRangeEnd && cls.dayRangeEnd,
    day.isInRange && cls.dayRangeMiddle,
    isFocused && cls.dayFocused,
    day.isMarked && cls.dayMarked,
  );

  return (
    <>
      <button
        type="button"
        id={`${datePickerId}-day-${day.date.toISOString()}`}
        role="gridcell"
        aria-selected={day.isSelected || undefined}
        aria-disabled={day.isDisabled || undefined}
        aria-current={day.isToday ? "date" : undefined}
        tabIndex={isFocused ? 0 : -1}
        disabled={day.isDisabled}
        className={classNames}
        data-selected={day.isSelected || undefined}
        data-today={day.isToday || undefined}
        data-disabled={day.isDisabled || undefined}
        data-outside={day.isOutside || undefined}
        data-range-start={day.isRangeStart || undefined}
        data-range-end={day.isRangeEnd || undefined}
        data-in-range={day.isInRange || undefined}
        data-focused={isFocused || undefined}
        data-marked={day.isMarked || undefined}
        data-marker-type={day.marker?.type || undefined}
        onClick={() => !day.isDisabled && onSelect(day.date, day.isOutside)}
        onMouseEnter={(e) => { onHover(day.date); tooltipEnter(e); }}
        onMouseLeave={() => { onHover(null); tooltipLeave(); }}
        onFocus={() => onFocus(day.date)}
        onKeyDown={(e) => onKeyDown(e, day.date)}
      >
        {day.dayOfMonth}
        {day.isMarked && showMarkerIndicator && (
          <span
            className={cls.markerIndicator}
            style={markerColor ? { backgroundColor: markerColor } : undefined}
            aria-hidden="true"
          />
        )}
      </button>
      {tooltipPortal}
    </>
  );
});

DayCell.displayName = "DayCell";

// ─── PresetsPanel ────────────────────────────────────────────────────────────

interface PresetsPanelProps {
  presets: DatePreset[];
  mode: "single" | "range" | "multiple";
  value?: Date | null;
  rangeValue?: DateRange | null;
  multipleValue?: Date[] | null;
  presetsClassName: string;
  presetButtonClassName: string;
  presetActiveClassName: string;
  onPresetClick: (preset: DatePreset) => void;
}

const PresetsPanel = memo(function PresetsPanel({
  presets,
  mode,
  value,
  rangeValue,
  multipleValue,
  presetsClassName,
  presetButtonClassName,
  presetActiveClassName,
  onPresetClick,
}: PresetsPanelProps) {
  const isPresetActive = useCallback(
    (preset: DatePreset) => {
      const presetValue = preset.getValue();

      if (mode === "single" && value) {
        return presetValue instanceof Date && isSameDay(presetValue, value);
      }

      if (mode === "range" && rangeValue?.start && rangeValue?.end) {
        if (
          presetValue &&
          typeof presetValue === "object" &&
          "start" in presetValue
        ) {
          return (
            presetValue.start &&
            presetValue.end &&
            isSameDay(presetValue.start, rangeValue.start) &&
            isSameDay(presetValue.end, rangeValue.end)
          );
        }
      }

      if (mode === "multiple" && multipleValue?.length) {
        if (Array.isArray(presetValue)) {
          if (presetValue.length !== multipleValue.length) return false;
          return presetValue.every((d) =>
            multipleValue.some((v) => isSameDay(d, v)),
          );
        }
      }

      return false;
    },
    [mode, value, rangeValue, multipleValue],
  );

  return (
    <div className={presetsClassName} role="group" aria-label="Date presets" style={{ width: 0, minWidth: "100%" }}>
      {presets.map((preset) => {
        const isActive = isPresetActive(preset);
        return (
          <button
            key={preset.label}
            type="button"
            className={cn(
              presetButtonClassName,
              isActive && presetActiveClassName,
            )}
            data-active={isActive || undefined}
            onClick={() => onPresetClick(preset)}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
});

PresetsPanel.displayName = "PresetsPanel";

// ─── DatePicker ──────────────────────────────────────────────────────────────

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      mode = "single",
      value,
      rangeValue,
      multipleValue,
      onValueChange,
      onRangeValueChange,
      onMultipleValueChange,
      onClear,
      minDate,
      maxDate,
      disabledDates,
      weekStartsOn = 0,
      locale,
      numberOfMonths = 1,
      showTodayIndicator = true,
      showTodayButton = false,
      todayAction = false,
      dateFormat = "MMM d, yyyy",
      showWeekNumbers = false,
      showOutsideDays = true,
      outsideDaysSelectable = true,
      fixedWeeks = false,
      showPresets = false,
      presets,
      markers,
      showMarkerIndicator = true,
      showMarkerTooltip = true,
      id,
      name,
      placeholder,
      disabled = false,
      error = false,
      errorMessage,
      label,
      required = false,
      fullWidth = false,
      showClearButton = true,
      showCalendarIcon = true,
      calendarIcon,
      clearIcon,
      prevMonthIcon,
      nextMonthIcon,
      prevYearIcon,
      nextYearIcon,
      todayIcon,
      monthDropdownSelectedIcon,
      yearDropdownSelectedIcon,
      classes: classesProp,
      unstyled = false,
      className = "",
      portalContainer,
      lockScroll = false,
      reduceMotion = "auto",
      onMonthChange,
      onOpen,
      onClose,
      ...rest
    },
    ref,
  ) => {
    // ─── Merged classes ────────────────────────────────────────────────
    const baseClasses = unstyled
      ? UNSTYLED_DATEPICKER_CLASSES
      : DEFAULT_DATEPICKER_CLASSES;

    const mergedClasses = useMemo<Required<DatePickerClasses>>(() => ({
      root: classesProp?.root ?? baseClasses.root,
      trigger: classesProp?.trigger ?? baseClasses.trigger,
      input: classesProp?.input ?? baseClasses.input,
      calendarIcon: classesProp?.calendarIcon ?? baseClasses.calendarIcon,
      clearButton: classesProp?.clearButton ?? baseClasses.clearButton,
      label: classesProp?.label ?? baseClasses.label,
      error: classesProp?.error ?? baseClasses.error,
      calendar: classesProp?.calendar ?? baseClasses.calendar,
      header: classesProp?.header ?? baseClasses.header,
      monthNav: classesProp?.monthNav ?? baseClasses.monthNav,
      navButton: classesProp?.navButton ?? baseClasses.navButton,
      navButtonDisabled: classesProp?.navButtonDisabled ?? baseClasses.navButtonDisabled,
      monthGrid: classesProp?.monthGrid ?? baseClasses.monthGrid,
      grid: classesProp?.grid ?? baseClasses.grid,
      weekdayHeader: classesProp?.weekdayHeader ?? baseClasses.weekdayHeader,
      weekday: classesProp?.weekday ?? baseClasses.weekday,
      day: classesProp?.day ?? baseClasses.day,
      daySelected: classesProp?.daySelected ?? baseClasses.daySelected,
      dayToday: classesProp?.dayToday ?? baseClasses.dayToday,
      dayDisabled: classesProp?.dayDisabled ?? baseClasses.dayDisabled,
      dayOutside: classesProp?.dayOutside ?? baseClasses.dayOutside,
      dayRangeStart: classesProp?.dayRangeStart ?? baseClasses.dayRangeStart,
      dayRangeEnd: classesProp?.dayRangeEnd ?? baseClasses.dayRangeEnd,
      dayRangeMiddle: classesProp?.dayRangeMiddle ?? baseClasses.dayRangeMiddle,
      dayHover: classesProp?.dayHover ?? baseClasses.dayHover,
      dayFocused: classesProp?.dayFocused ?? baseClasses.dayFocused,
      dayMarked: classesProp?.dayMarked ?? baseClasses.dayMarked,
      weekNumber: classesProp?.weekNumber ?? baseClasses.weekNumber,
      presets: classesProp?.presets ?? baseClasses.presets,
      presetButton: classesProp?.presetButton ?? baseClasses.presetButton,
      presetActive: classesProp?.presetActive ?? baseClasses.presetActive,
      footer: classesProp?.footer ?? baseClasses.footer,
      todayButton: classesProp?.todayButton ?? baseClasses.todayButton,
      markerIndicator: classesProp?.markerIndicator ?? baseClasses.markerIndicator,
      markerTooltip: classesProp?.markerTooltip ?? baseClasses.markerTooltip,
      monthSelect: classesProp?.monthSelect ?? baseClasses.monthSelect,
      yearSelect: classesProp?.yearSelect ?? baseClasses.yearSelect,
      monthDropdown: classesProp?.monthDropdown ?? baseClasses.monthDropdown,
      yearDropdown: classesProp?.yearDropdown ?? baseClasses.yearDropdown,
      dropdownMenu: classesProp?.dropdownMenu ?? baseClasses.dropdownMenu,
      dropdownItem: classesProp?.dropdownItem ?? baseClasses.dropdownItem,
      dropdownItemSelected: classesProp?.dropdownItemSelected ?? baseClasses.dropdownItemSelected,
    }), [classesProp, baseClasses]);

    // ─── Reduced motion ────────────────────────────────────────────────
    useReducedMotion(reduceMotion);

    // ─── Dev warning ───────────────────────────────────────────────────
    const warnedRef = useRef(false);
    useEffect(() => {
      if (process.env.NODE_ENV !== "production") {
        if (
          !label &&
          !(rest as Record<string, unknown>)["aria-label"] &&
          !(rest as Record<string, unknown>)["aria-labelledby"] &&
          !warnedRef.current
        ) {
          warnedRef.current = true;
          console.warn(
            "DatePicker: A date picker without a label requires an `aria-label` or `aria-labelledby` for accessibility.",
          );
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [label]);

    // ─── IDs ───────────────────────────────────────────────────────────
    const generatedId = useId();
    const datePickerId = id || name || generatedId;
    const triggerId = `${datePickerId}-trigger`;
    const calendarId = `${datePickerId}-calendar`;
    const errorId = `${datePickerId}-error`;

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const [calendarPos, setCalendarPos] = useState<{ top: number; left: number } | null>(null);

    // ─── Hook ──────────────────────────────────────────────────────────
    const {
      isOpen,
      calendarMonths,
      focusedDate,
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
    } = useDatePicker({
      mode,
      value,
      rangeValue,
      multipleValue,
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
      onValueChange,
      onRangeValueChange,
      onMultipleValueChange,
      onMonthChange,
    });

    const isCalendarPositionStable = useStablePositionAfterOpen(isOpen);

    const emitSingle = onValueChange;
    const emitRange = onRangeValueChange;
    const emitMultiple = onMultipleValueChange;

    // ─── Open/close callbacks ──────────────────────────────────────────
    const prevIsOpenRef = useRef<boolean | null>(null);

    useEffect(() => {
      if (prevIsOpenRef.current !== null && prevIsOpenRef.current !== isOpen) {
        if (isOpen) {
          onOpen?.();
        } else {
          onClose?.();
        }
      }
      prevIsOpenRef.current = isOpen;
    }, [isOpen, onOpen, onClose]);

    // ─── Calendar positioning ───────────────────────────────────────────
    useEffect(() => {
      if (!isOpen || !triggerRef.current) return;

      const updatePos = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setCalendarPos({
          top: rect.bottom + 4,
          left: rect.left,
        });
      };

      updatePos();

      if (!lockScroll) {
        window.addEventListener("scroll", updatePos, true);
      }
      window.addEventListener("resize", updatePos);

      return () => {
        if (!lockScroll) {
          window.removeEventListener("scroll", updatePos, true);
        }
        window.removeEventListener("resize", updatePos);
      };
    }, [isOpen, lockScroll]);

    // ─── Scroll lock ─────────────────────────────────────────────────────
    useEffect(() => {
      if (!isOpen || !lockScroll) return;

      // Block wheel and touch scroll globally — works regardless of which element scrolls
      const preventScroll = (e: Event) => {
        // Allow scroll inside the calendar itself
        if (calendarRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
      };

      window.addEventListener("wheel", preventScroll, { capture: true, passive: false });
      window.addEventListener("touchmove", preventScroll, { capture: true, passive: false });

      // Also block keyboard scroll (arrow keys, page up/down, space on body)
      const preventKeyScroll = (e: KeyboardEvent) => {
        if (calendarRef.current?.contains(e.target as Node)) return;
        const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
        if (scrollKeys.includes(e.key) && (e.target === document.body || e.target === document.documentElement)) {
          e.preventDefault();
        }
      };
      window.addEventListener("keydown", preventKeyScroll, { capture: true });

      return () => {
        window.removeEventListener("wheel", preventScroll, { capture: true } as EventListenerOptions);
        window.removeEventListener("touchmove", preventScroll, { capture: true } as EventListenerOptions);
        window.removeEventListener("keydown", preventKeyScroll, { capture: true } as EventListenerOptions);
      };
    }, [isOpen, lockScroll]);

    // ─── Click outside ─────────────────────────────────────────────────
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (containerRef.current?.contains(target)) return;
        if (calendarRef.current?.contains(target)) return;
        handleClose();
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [isOpen, handleClose]);

    // ─── Display value ─────────────────────────────────────────────────
    const displayValue = (() => {
      if (mode === "single" && value) {
        return formatDate(value, dateFormat, locale);
      }
      if (mode === "range" && (rangeValue?.start || rangeValue?.end)) {
        return formatDateRange(rangeValue, dateFormat, locale);
      }
      if (mode === "multiple" && multipleValue?.length) {
        return formatMultipleDates(multipleValue, dateFormat, locale);
      }
      return "";
    })();

    const defaultPlaceholder = (() => {
      if (mode === "single") return "Select a date";
      if (mode === "range") return "Select date range";
      return "Select dates";
    })();

    const hasValue = displayValue !== "";

    // ─── Callbacks ─────────────────────────────────────────────────────
    const handleClearClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        handleClear();
        onClear?.();
      },
      [handleClear, onClear],
    );

    const handlePresetClick = useCallback(
      (preset: DatePreset) => {
        const presetValue = preset.getValue();

        if (mode === "single" && presetValue instanceof Date) {
          const dateValue = {
            date: presetValue,
            dateString: presetValue.toISOString().split("T")[0],
          };
          emitSingle?.(presetValue, dateValue);
          handleClose();
        } else if (
          mode === "range" &&
          typeof presetValue === "object" &&
          "start" in presetValue
        ) {
          const range = presetValue as DateRange;
          emitRange?.(range, {
            start: range.start
              ? {
                  date: range.start,
                  dateString: range.start.toISOString().split("T")[0],
                }
              : null,
            end: range.end
              ? {
                  date: range.end,
                  dateString: range.end.toISOString().split("T")[0],
                }
              : null,
          });
          handleClose();
        } else if (mode === "multiple" && Array.isArray(presetValue)) {
          const dates = presetValue;
          const dateValues = dates.map((d) => ({
            date: d,
            dateString: d.toISOString().split("T")[0],
          }));
          emitMultiple?.(dates, dateValues);
        }
      },
      [mode, emitSingle, emitRange, emitMultiple, handleClose],
    );

    // ─── Derived ───────────────────────────────────────────────────────
    const weekdays = getWeekdayHeaders(weekStartsOn, "EEE", locale);
    const effectivePresets = presets || getDefaultPresets(mode);
    const fullWidthClass = fullWidth ? "w-full" : "";
    const showFooter = showTodayButton;

    // No hardcoded width — calendar auto-sizes to its grid content

    // ─── Classes for DayCell sub-component ─────────────────────────────
    const dayCellClasses = useMemo(
      () => ({
        day: mergedClasses.day,
        daySelected: mergedClasses.daySelected,
        dayToday: mergedClasses.dayToday,
        dayDisabled: mergedClasses.dayDisabled,
        dayOutside: mergedClasses.dayOutside,
        dayRangeStart: mergedClasses.dayRangeStart,
        dayRangeEnd: mergedClasses.dayRangeEnd,
        dayRangeMiddle: mergedClasses.dayRangeMiddle,
        dayFocused: mergedClasses.dayFocused,
        dayMarked: mergedClasses.dayMarked,
        markerIndicator: mergedClasses.markerIndicator,
        markerTooltip: mergedClasses.markerTooltip,
      }),
      [mergedClasses],
    );

    // ─── Render ────────────────────────────────────────────────────────
    return (
      <div
        ref={ref}
        {...rest}
        className={cn(mergedClasses.root, fullWidthClass, className)}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-open={isOpen || undefined}
      >
        {label && (
          <label htmlFor={triggerId} className={mergedClasses.label}>
            {label}
            {required && <span aria-hidden="true">*</span>}
          </label>
        )}

        <div
          ref={containerRef}
          className="relative"
        >
          <button
            ref={triggerRef}
            type="button"
            id={triggerId}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-controls={calendarId}
            aria-invalid={error || undefined}
            aria-describedby={error && errorMessage ? errorId : undefined}
            aria-required={required || undefined}
            disabled={disabled}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className={mergedClasses.trigger}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-open={isOpen || undefined}
          >
            <span className={mergedClasses.input}>
              {hasValue ? displayValue : placeholder || defaultPlaceholder}
            </span>
            <div className="flex items-center gap-1">
              {showClearButton && hasValue && !disabled && (
                <button
                  type="button"
                  aria-label="Clear selection"
                  className={mergedClasses.clearButton}
                  onClick={handleClearClick}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClearClick(e as unknown as React.MouseEvent);
                    }
                  }}
                >
                  {clearIcon || <XIcon className="w-4 h-4" />}
                </button>
              )}
              {showCalendarIcon &&
                (calendarIcon || (
                  <CalendarIcon className={mergedClasses.calendarIcon} />
                ))}
            </div>
          </button>

          {isOpen && createPortal(
            <div
              ref={calendarRef}
              id={calendarId}
              role="dialog"
              aria-modal="true"
              aria-label={`${mode === "single" ? "Date" : mode === "range" ? "Date range" : "Multiple dates"} picker`}
              className={mergedClasses.calendar}
              style={{
                position: "fixed",
                zIndex: 50,
                width: "max-content",
                margin: 0,
                ...(calendarPos && isCalendarPositionStable ? { top: calendarPos.top, left: calendarPos.left } : { visibility: "hidden" as const, top: 0, left: 0 }),
              }}
            >
              {showPresets && (
                <PresetsPanel
                  presets={effectivePresets}
                  mode={mode}
                  value={value}
                  rangeValue={rangeValue}
                  multipleValue={multipleValue}
                  presetsClassName={mergedClasses.presets}
                  presetButtonClassName={mergedClasses.presetButton}
                  presetActiveClassName={mergedClasses.presetActive}
                  onPresetClick={handlePresetClick}
                />
              )}

              <div className={mergedClasses.monthGrid}>
                {calendarMonths.map((calendarMonth, monthIndex) => {
                  const monthYear = getYear(calendarMonth.month);
                  const monthIdx = getMonth(calendarMonth.month);

                  return (
                    <div
                      key={calendarMonth.month.toISOString()}
                      className={mergedClasses.grid}
                    >
                      <div className={mergedClasses.header}>
                        {monthIndex === 0 && (
                          <>
                            <button
                              type="button"
                              aria-label="Previous year"
                              onClick={() => handleYearSelect(monthYear - 1)}
                              className={mergedClasses.navButton}
                            >
                              {prevYearIcon || (
                                <DoubleChevronLeftIcon className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              aria-label="Previous month"
                              onClick={() => handleMonthNavigation("prev")}
                              className={mergedClasses.navButton}
                            >
                              {prevMonthIcon || (
                                <ChevronLeftIcon className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}

                        <div className={mergedClasses.monthNav}>
                          <CustomDropdown
                            value={monthIdx}
                            options={getMonthOptions(locale)}
                            onChange={(m) => handleMonthSelect(m - monthIndex)}
                            buttonClassName={mergedClasses.monthSelect}
                            menuClassName={mergedClasses.dropdownMenu}
                            itemClassName={mergedClasses.dropdownItem}
                            itemSelectedClassName={
                              mergedClasses.dropdownItemSelected
                            }
                            selectedIcon={monthDropdownSelectedIcon}
                            ariaLabel="Select month"
                          />
                          <CustomDropdown
                            value={monthYear}
                            options={getYearOptions(monthYear)}
                            onChange={handleYearSelect}
                            buttonClassName={mergedClasses.yearSelect}
                            menuClassName={mergedClasses.dropdownMenu}
                            itemClassName={mergedClasses.dropdownItem}
                            itemSelectedClassName={
                              mergedClasses.dropdownItemSelected
                            }
                            selectedIcon={yearDropdownSelectedIcon}
                            ariaLabel="Select year"
                          />
                        </div>

                        {monthIndex === calendarMonths.length - 1 && (
                          <>
                            <button
                              type="button"
                              aria-label="Next month"
                              onClick={() => handleMonthNavigation("next")}
                              className={mergedClasses.navButton}
                            >
                              {nextMonthIcon || (
                                <ChevronRightIcon className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              aria-label="Next year"
                              onClick={() => handleYearSelect(monthYear + 1)}
                              className={mergedClasses.navButton}
                            >
                              {nextYearIcon || (
                                <DoubleChevronRightIcon className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>

                      <div
                        className={mergedClasses.weekdayHeader}
                        style={showWeekNumbers ? { gridTemplateColumns: "2rem repeat(7, 1fr)" } : undefined}
                        role="row"
                        aria-label="Days of the week"
                      >
                        {showWeekNumbers && (
                          <div
                            className={mergedClasses.weekNumber}
                            aria-hidden="true"
                          >
                            #
                          </div>
                        )}
                        {weekdays.map((day) => (
                          <div
                            key={day}
                            className={mergedClasses.weekday}
                            role="columnheader"
                            aria-label={day}
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      <div
                        role="grid"
                        aria-label={formatDate(
                          calendarMonth.month,
                          "MMMM yyyy",
                          locale,
                        )}
                      >
                        {calendarMonth.weeks.map((week, weekIndex) => (
                          <div
                            key={weekIndex}
                            role="row"
                            className="grid grid-cols-7"
                            style={showWeekNumbers ? { gridTemplateColumns: "2rem repeat(7, 1fr)" } : undefined}
                          >
                            {showWeekNumbers && (
                              <div
                                className={mergedClasses.weekNumber}
                                aria-hidden="true"
                              >
                                {week[0]?.weekNumber ?? ""}
                              </div>
                            )}
                            {week.map((day) => (
                              <DayCell
                                key={day.date.toISOString()}
                                day={day}
                                datePickerId={datePickerId}
                                classes={dayCellClasses}
                                isFocused={
                                  focusedDate
                                    ? isSameDay(day.date, focusedDate)
                                    : false
                                }
                                showOutsideDays={showOutsideDays}
                                showMarkerIndicator={showMarkerIndicator}
                                showMarkerTooltip={showMarkerTooltip}
                                portalContainer={portalContainer}
                                onSelect={handleDateSelect}
                                onHover={handleDateHover}
                                onFocus={handleDateFocus}
                                onKeyDown={handleCalendarKeyDown}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {showFooter && (
                <div className={mergedClasses.footer}>
                  {showTodayButton && todayAction && (
                    <button
                      type="button"
                      className={mergedClasses.todayButton}
                      onClick={handleTodayClick}
                    >
                      <span className="flex items-center gap-2">
                        {todayIcon || <TodayIcon className="w-4 h-4" />}
                        <span>Today</span>
                      </span>
                    </button>
                  )}
                  {!todayAction && showTodayButton && (
                    <button
                      type="button"
                      className={mergedClasses.todayButton}
                      onClick={goToToday}
                    >
                      <span className="flex items-center gap-2">
                        {todayIcon || <TodayIcon className="w-4 h-4" />}
                        <span>Go to today</span>
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>,
            portalContainer ?? document.body,
          )}
        </div>

        {error && errorMessage && (
          <div id={errorId} role="alert" className={mergedClasses.error}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
