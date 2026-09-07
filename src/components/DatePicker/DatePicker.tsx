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
import { useLayer } from "../../utils/layers.js";
import { cycleTabWithin } from "../../utils/focusUtils.js";
import { comboboxNameProps } from "../../utils/comboboxName.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";
import type {
  DatePickerProps,
  DatePickerClasses,
  CalendarDay,
  DatePreset,
  DateRange,
  DateRangeValue,
  DateValue,
  DateMarker,
  UseDatePickerProps,
} from "./utils/types.js";
import { useDatePicker } from "./useDatePicker.js";
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
} from "./icons.js";
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
} from "./utils.js";
import { cn } from "../../utils/scopedCn.js";
import { useMenuNavigation } from "../../utils/menu/useMenuNavigation.js";
import { useHydrated } from "../../utils/useHydrated.js";
import { useLazyComponent } from "../../utils/useLazyComponent.js";
import type { PresetsPanelProps } from "./PresetsPanel.js";
import type { MarkerTooltipProps } from "./MarkerTooltip.js";
import { isBrowser } from "../../utils/isBrowser.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import { motionSafeClasses } from "../../utils/classLayers.js";
import { createPortal } from "react-dom";
import MenuSurface from "../../utils/menu/MenuSurface.js";
import {
  DEFAULT_DATEPICKER_CLASSES,
  UNSTYLED_DATEPICKER_CLASSES,
} from "./constants.js";

interface DropdownProps {
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
  buttonClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
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
  selectedIcon,
  ariaLabel,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLButtonElement>(null);

  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const selectedOption = options[selectedIndex];

  // `role="listbox"` is right for a month/year picker, so the behaviour it
  // promises is implemented here rather than the role dropped: with 12 months
  // and a long year list, tabbing through every option is not a substitute for
  // arrow keys and a roving tabindex.
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const toggleMenu = () => {
    if (!isOpen) setActiveIndex(selectedIndex < 0 ? 0 : selectedIndex);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;
    const list = listRef.current;
    const option = list?.querySelector<HTMLElement>('[role="option"][tabindex="0"]');
    option?.focus();
  }, [isOpen, activeIndex]);

  /**
   * The shared keyboard model, on the only DatePicker surface it fits.
   *
   * A plain vertical list: wrap at the ends, Home and End, Enter and Space to
   * commit, Escape to dismiss. The calendar grid beside it is not this shape and
   * is deliberately left alone — see the note above `handleCalendarKeyDown`.
   *
   * The index stays local state because opening seeds it from the current
   * value, and the surface is not unmounted between opens.
   */
  const { onKeyDown: handleListKeyDown } = useMenuNavigation<(typeof options)[number]>({
    items: options,
    isOpen,
    activeIndex,
    onActiveIndexChange: setActiveIndex,
    onSelect: (option) => {
      onChange(option.value);
      setIsOpen(false);
    },
    onClose: () => {
      // Tab as well as Escape: this listbox lives inside the picker's focus
      // trap, and closing on Tab keeps the trap cycling over the panel rather
      // than over the menu.
      setIsOpen(false);
    },
  });

  useEffect(() => {
    if (!isBrowser) return;
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
      toggleMenu();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={buttonClassName}
        onClick={toggleMenu}
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
        <div
          ref={listRef}
          className={menuClassName}
          role="listbox"
          aria-label={ariaLabel}
          onKeyDown={handleListKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                ref={isSelected ? selectedOptionRef : undefined}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={index === activeIndex ? 0 : -1}
                data-selected={isSelected || undefined}
                className={itemClassName}
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

/**
 * The marker tooltip is the other surface that estimates rather than measures,
 * and it had the mirror of Table's problem. It carries `role="tooltip"`, which
 * looks correct and does nothing on its own: a tooltip is announced only when
 * something references it, and no cell did. It was also hover-only, so its
 * content — the marker's label, description and type — reached a pointer user
 * and nobody else.
 *
 * `describedBy` wires it to the cell that owns it, and the cell shows it on
 * focus as well as hover, which is what makes it reachable at all.
 */
function useMarkerTooltip(
  marker: DateMarker | undefined,
  showTooltip: boolean,
  portalContainer?: HTMLElement | null,
  tooltipId?: string,
) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

  const handleMouseEnter = useCallback((e: { currentTarget: EventTarget & HTMLElement }) => {
    if (!marker || !showTooltip) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const gap = 6;
    // Below the cell by default. If that overflows the viewport bottom, anchor
    // to the cell's TOP and let translateY(-100%) pull the tooltip up by its
    // rendered height, which a fixed estimate cannot do for a short tooltip.
    let top: number;
    let nextPlacement: "top" | "bottom" = "bottom";
    if (rect.bottom + gap + 100 > window.innerHeight) {
      top = rect.top - gap;
      nextPlacement = "top";
    } else {
      top = rect.bottom + gap;
    }
    let left = rect.left + rect.width / 2;
    if (left + 100 > window.innerWidth) left = window.innerWidth - 110;
    if (left < 10) left = 10;
    setPosition({ top, left });
    setPlacement(nextPlacement);
    setIsVisible(true);
  }, [marker, showTooltip]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    setPosition(null);
  }, []);

  // Same guard as the calendar portal. Reachable only from a pointer event
  // today, so it never fired on a server — but the state that gates it is one
  // refactor away from being an initial value, which is exactly how Modal and
  // Drawer got here.
  const tooltipTarget = useHydrated() ? (portalContainer ?? document.body) : null;

  const Tooltip = useLazyComponent<MarkerTooltipProps>(showTooltip, loadMarkerTooltip);

  const tooltipPortal =
    isVisible && position && marker && tooltipTarget && Tooltip
      ? createPortal(
          // Module-cached identity — see `useLazyComponent`.
          // eslint-disable-next-line react-hooks/static-components
          <Tooltip
            marker={marker}
            tooltipId={tooltipId}
            position={position}
            placement={placement}
          />,
          tooltipTarget,
        )
      : null;

  return {
    tooltipPortal,
    handleMouseEnter,
    handleMouseLeave,
    // Gated on the tooltip existing, not merely on it being wanted: the
    // subtree is in a chunk now, and a reference to an element that has not
    // arrived is a dangling `aria-describedby`.
    describedBy: isVisible && Tooltip ? tooltipId : undefined,
  };
}

interface DayCellProps {
  day: CalendarDay;
  datePickerId: string;
  classes: {
    day: string;
    markerIndicator: string;
  };
  isFocused: boolean;
  showOutsideDays: boolean;
  showMarkerIndicator: boolean;
  showMarkerTooltip: boolean;
  showTodayIndicator: boolean;
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
  showTodayIndicator,
  showMarkerIndicator,
  showMarkerTooltip,
  portalContainer,
  onSelect,
  onHover,
  onFocus,
  onKeyDown,
}: DayCellProps) {
  const markerColor = day.marker?.color;
  const dayId = `${datePickerId}-day-${day.date.toISOString()}`;
  const {
    tooltipPortal,
    handleMouseEnter: tooltipEnter,
    handleMouseLeave: tooltipLeave,
    describedBy,
  } = useMarkerTooltip(
    day.isMarked ? day.marker : undefined,
    showMarkerTooltip,
    portalContainer,
    `${dayId}-marker`,
  );

  if (day.dayOfMonth === 0 || (day.isOutside && !showOutsideDays)) {
    return <div className={cls.day} aria-hidden="true" />;
  }

  const classNames = cn(cls.day);

  return (
    <>
      <button
        type="button"
        id={dayId}
        role="gridcell"
        aria-describedby={describedBy}
        aria-selected={day.isSelected || undefined}
        aria-disabled={day.isDisabled || undefined}
        aria-current={day.isToday ? "date" : undefined}
        tabIndex={isFocused ? 0 : -1}
        disabled={day.isDisabled}
        className={classNames}
        data-selected={day.isSelected || undefined}
        data-today={(day.isToday && showTodayIndicator) || undefined}
        data-disabled={day.isDisabled || undefined}
        data-outside={day.isOutside || undefined}
        data-range-start={day.isRangeStart || undefined}
        data-range-end={day.isRangeEnd || undefined}
        data-in-range={day.isInRange || undefined}
        // ADR 002 R4 / Amendment D: one attribute with a value, so a consumer
        // writes data-[range=middle] rather than three booleans. The booleans
        // stay until Task 3 retires them with the keys they mirror.
        data-range={
          day.isRangeStart
            ? "start"
            : day.isRangeEnd
              ? "end"
              : day.isInRange
                ? "middle"
                : undefined
        }
        data-highlighted={isFocused || undefined}
        data-marked={day.isMarked || undefined}
        data-marker-type={day.marker?.type || undefined}
        onClick={() => !day.isDisabled && onSelect(day.date, day.isOutside)}
        onMouseEnter={(e) => { onHover(day.date); tooltipEnter(e); }}
        onMouseLeave={() => { onHover(null); tooltipLeave(); }}
        // SC 1.4.13: a pointer-only tooltip tells a keyboard user nothing when
        // the arrow keys land on a marked day.
        onFocus={(e) => { onFocus(day.date); tooltipEnter(e); }}
        onBlur={tooltipLeave}
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

/** See `useLazyComponent`: the loader has to be a module-scope constant. */
const loadPresets = () =>
  import("./PresetsPanel.js").then((module) => module.PresetsPanel);

const loadMarkerTooltip = () =>
  import("./MarkerTooltip.js").then((module) => module.MarkerTooltip);

/**
 * DatePicker -- a full-featured date picker supporting single, range, and multiple
 * date selection with calendar popover, presets, markers, locale support, keyboard
 * navigation, week numbers, and fully customizable styling via the classes system.
 *
 * @see DATEPICKER.ai.md for full usage guide, props, styling, and patterns.
 */
const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      mode = "single",
      value,
      defaultValue,
      onValueChange,
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
      description,
      success = false,
      successMessage,
      loading = false,
      clearable,
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
      dropdownZIndex: dropdownZIndexProp,
      dropdownPosition = "bottom",
      forceDropdownPosition = false,
      dropdownGap = 4,
      keepMounted = false,
      reduceMotion = "auto",
      onMonthChange,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      ...rest
    },
    ref,
  ) => {
    const dropdownZIndex = useLayer(dropdownZIndexProp);

    const resolvedShowClearButton = showClearButton ?? clearable ?? true;

    const prefersReducedMotionForClasses = useReducedMotion(reduceMotion);

    const baseClassesRaw = unstyled
      ? UNSTYLED_DATEPICKER_CLASSES
      : DEFAULT_DATEPICKER_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotionForClasses);

    const mergedClasses = useMemo<Required<DatePickerClasses>>(() => ({
      root: classesProp?.root ?? baseClasses.root,
      trigger: classesProp?.trigger ?? baseClasses.trigger,
      input: classesProp?.input ?? baseClasses.input,
      triggerActions: classesProp?.triggerActions ?? baseClasses.triggerActions,
      icon: classesProp?.icon ?? baseClasses.icon,
      clearTrigger: classesProp?.clearTrigger ?? baseClasses.clearTrigger,
      label: classesProp?.label ?? baseClasses.label,
      message: classesProp?.message ?? baseClasses.message,
      description: classesProp?.description ?? baseClasses.description,
      content: classesProp?.content ?? baseClasses.content,
      header: classesProp?.header ?? baseClasses.header,
      row: classesProp?.row ?? baseClasses.row,
      navButton: classesProp?.navButton ?? baseClasses.navButton,
      listRow: classesProp?.listRow ?? baseClasses.listRow,
      list: classesProp?.list ?? baseClasses.list,
      listHeader: classesProp?.listHeader ?? baseClasses.listHeader,
      weekday: classesProp?.weekday ?? baseClasses.weekday,
      item: classesProp?.item ?? baseClasses.item,
      weekNumber: classesProp?.weekNumber ?? baseClasses.weekNumber,
      presetGroup: classesProp?.presetGroup ?? baseClasses.presetGroup,
      presetTrigger: classesProp?.presetTrigger ?? baseClasses.presetTrigger,
      footer: classesProp?.footer ?? baseClasses.footer,
      todayTrigger: classesProp?.todayTrigger ?? baseClasses.todayTrigger,
      markerIndicator: classesProp?.markerIndicator ?? baseClasses.markerIndicator,
      monthSelect: classesProp?.monthSelect ?? baseClasses.monthSelect,
      yearSelect: classesProp?.yearSelect ?? baseClasses.yearSelect,
      subContent: classesProp?.subContent ?? baseClasses.subContent,
      subItem: classesProp?.subItem ?? baseClasses.subItem,
    }), [classesProp, baseClasses]);

    useReducedMotion(reduceMotion);

    const generatedId = useId();
    const datePickerId = id || name || generatedId;
    const triggerId = `${datePickerId}-trigger`;
    const labelId = `${datePickerId}-label`;
    const valueId = `${datePickerId}-value`;

  useAccessibleNameWarning("DatePicker", { label });
    const calendarId = `${datePickerId}-calendar`;
    const errorId = `${datePickerId}-error`;

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    const {
      isOpen,
      currentValue,
      setCurrentValue,
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
      defaultOpen,
      onOpenChange,
      onMonthChange,
    } as UseDatePickerProps);

    const singleValue = mode === "single" ? (currentValue as Date | null | undefined) : undefined;
    const rangeValue = mode === "range" ? (currentValue as DateRange | null | undefined) : undefined;
    const multipleValue = mode === "multiple" ? (currentValue as Date[] | null | undefined) : undefined;

    const emitSingle = mode === "single"
      ? (onValueChange as ((date: Date | null, dateValue: DateValue | null) => void) | undefined)
      : undefined;
    const emitRange = mode === "range"
      ? (onValueChange as ((range: DateRange | null, rangeValue: DateRangeValue | null) => void) | undefined)
      : undefined;
    const emitMultiple = mode === "multiple"
      ? (onValueChange as ((dates: Date[] | null, dateValues: DateValue[] | null) => void) | undefined)
      : undefined;

    useEffect(() => {
      if (!isOpen || !lockScroll) return;

      const preventScroll = (e: Event) => {
        if (calendarRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
      };

      window.addEventListener("wheel", preventScroll, { capture: true, passive: false });
      window.addEventListener("touchmove", preventScroll, { capture: true, passive: false });

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

    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (!isOpen) return;

      const active = document.activeElement;
      previousActiveElement.current = active instanceof HTMLElement ? active : null;
      // Captured now rather than read in the cleanup: the ref may point at a
      // different node by then, and this is the trigger that was open.
      const trigger = triggerRef.current;

      // The grid is positioned before it is visible, so focus waits for the
      // same frame the panel becomes measurable in.
      const timer = setTimeout(() => {
        const panel = calendarRef.current;
        if (!panel) return;
        const rovingCell = panel.querySelector<HTMLElement>(
          '[role="gridcell"][tabindex="0"]:not([disabled])',
        );
        (rovingCell ?? panel).focus();
      }, 10);

      return () => {
        clearTimeout(timer);
        // Returning focus is what makes Escape and outside-click recoverable
        // for a keyboard user; without it focus falls back to <body>.
        //
        // The trigger, not `previousActiveElement`, is the destination: this is
        // a popup owned by a trigger, and a pointer user can open it without
        // ever focusing anything, in which case the recorded element is <body>.
        (trigger ?? previousActiveElement.current)?.focus?.();
      };
    }, [isOpen]);

    // Roving tabindex moves the attribute; this moves the actual focus with it.
    // Without it every arrow key recomputed from the one cell that still had
    // DOM focus, so navigation advanced exactly one day and then stopped.
    useEffect(() => {
      if (!isOpen || !focusedDate) return;
      const panel = calendarRef.current;
      if (!panel) return;
      const cell = panel.querySelector<HTMLElement>(
        '[role="gridcell"][tabindex="0"]:not([disabled])',
      );
      if (!cell || cell === document.activeElement) return;
      // Paging by month unmounts the cell that had focus, which drops the
      // browser back to <body>; that is our own re-render, not the user
      // leaving, so the roving cell reclaims it. Any other element outside the
      // panel means focus genuinely left, and is left alone.
      const active = document.activeElement;
      if (panel.contains(active) || active === null || active === document.body) {
        cell.focus();
      }
    }, [isOpen, focusedDate]);

    const handlePanelKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
          event.preventDefault();
          handleClose();
          return;
        }
        if (event.key === "Tab" && calendarRef.current) {
          cycleTabWithin(calendarRef.current, event);
        }
      },
      [handleClose],
    );

    const displayValue = (() => {
      if (mode === "single" && singleValue) {
        return formatDate(singleValue, dateFormat, locale);
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

    const handleClearClick = useCallback(
      (e: React.SyntheticEvent) => {
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
          setCurrentValue(presetValue);
          emitSingle?.(presetValue, dateValue);
          handleClose();
        } else if (
          mode === "range" &&
          typeof presetValue === "object" &&
          "start" in presetValue
        ) {
          const range = presetValue as DateRange;
          setCurrentValue(range);
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
          setCurrentValue(dates);
          emitMultiple?.(dates, dateValues);
        }
      },
      [mode, emitSingle, emitRange, emitMultiple, setCurrentValue, handleClose],
    );

    const weekdays = getWeekdayHeaders(weekStartsOn, "EEE", locale);
    const fullWidthClass = fullWidth ? "w-full" : "";
    const showFooter = showTodayButton;

    // Fetched at mount when `showPresets` is set, null until it resolves. The
    // panel is inside a portal that only opens on interaction, so the chunk is
    // always there before anyone can see the space it fills.
    const PresetsPanel = useLazyComponent<PresetsPanelProps>(showPresets, loadPresets);

    const dayCellClasses = useMemo(
      () => ({
        day: mergedClasses.item,
        markerIndicator: mergedClasses.markerIndicator,
      }),
      [mergedClasses],
    );

    return (
      <div
        ref={ref}
        {...rest}
        className={cn(mergedClasses.root, fullWidthClass, className)}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-open={isOpen || undefined}
        data-loading={loading || undefined}
        data-valid={(!error && success) || undefined}
      >
        {label && (
          <label id={labelId} htmlFor={triggerId} className={mergedClasses.label}>
            {label}
            {required && <span aria-hidden="true">*</span>}
          </label>
        )}

        {description && (
          <div className={mergedClasses.description || undefined}>{description}</div>
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
            {...comboboxNameProps({ valueId, labelId, hasLabel: !!label })}
            aria-invalid={error || undefined}
            aria-describedby={error && errorMessage ? errorId : undefined}
            aria-required={required || undefined}
            disabled={disabled}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className={cn(mergedClasses.trigger)}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-open={isOpen || undefined}
          >
            <span id={valueId} className={mergedClasses.input}>
              {hasValue ? displayValue : placeholder || defaultPlaceholder}
            </span>
            <div className={mergedClasses.triggerActions || undefined}>
              {showCalendarIcon &&
                (calendarIcon || (
                  <CalendarIcon className={mergedClasses.icon} />
                ))}
            </div>
          </button>

          {/* A sibling of the trigger, not a child of it. This was a
              `<span role="button" tabIndex={0}>` inside the trigger `<button>`:
              interactive content nested in a button is invalid, the inner
              control never took focus, and its `aria-label` was folded into the
              trigger's own name. A real button here is reachable by Tab and
              announces itself. */}
          {resolvedShowClearButton && hasValue && !disabled && (
            <button
              type="button"
              aria-label="Clear selection"
              className={mergedClasses.clearTrigger}
              onClick={handleClearClick}
            >
              {clearIcon || <XIcon className="w-4 h-4" />}
            </button>
          )}

          {(isOpen || keepMounted) && (
            <MenuSurface
              ref={calendarRef}
              trigger={triggerRef}
              isOpen={isOpen}
              side={dropdownPosition}
              forceSide={forceDropdownPosition}
              gap={dropdownGap}
              zIndex={dropdownZIndex}
              portalContainer={portalContainer}
              keepMounted={keepMounted}
              matchTriggerWidth={false}
              // The calendar sizes to its content, not to the field that opens
              // it, which is why it has always set an explicit width.
              style={{ width: "max-content" }}
              id={calendarId}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              onKeyDown={handlePanelKeyDown}
              aria-label={`${mode === "single" ? "Date" : mode === "range" ? "Date range" : "Multiple dates"} picker`}
              className={mergedClasses.content}
            >
              {showPresets && PresetsPanel && (
                // eslint-disable-next-line react-hooks/static-components
                <PresetsPanel
                  presets={presets}
                  mode={mode}
                  value={singleValue}
                  rangeValue={rangeValue}
                  multipleValue={multipleValue}
                  presetsClassName={mergedClasses.presetGroup}
                  presetButtonClassName={mergedClasses.presetTrigger}
                  onPresetClick={handlePresetClick}
                />
              )}

              <div className={mergedClasses.listRow}>
                {calendarMonths.map((calendarMonth, monthIndex) => {
                  const monthYear = getYear(calendarMonth.month);
                  const monthIdx = getMonth(calendarMonth.month);

                  return (
                    <div
                      key={calendarMonth.month.toISOString()}
                      className={mergedClasses.list}
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

                        <div className={mergedClasses.row}>
                          <CustomDropdown
                            value={monthIdx}
                            options={getMonthOptions(locale)}
                            onChange={(m) => handleMonthSelect(m - monthIndex)}
                            buttonClassName={mergedClasses.monthSelect}
                            menuClassName={mergedClasses.subContent}
                            itemClassName={mergedClasses.subItem}
                            selectedIcon={monthDropdownSelectedIcon}
                            ariaLabel="Select month"
                          />
                          <CustomDropdown
                            value={monthYear}
                            options={getYearOptions(monthYear)}
                            onChange={handleYearSelect}
                            buttonClassName={mergedClasses.yearSelect}
                            menuClassName={mergedClasses.subContent}
                            itemClassName={mergedClasses.subItem}
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
                        role="grid"
                        aria-label={formatDate(
                          calendarMonth.month,
                          "MMMM yyyy",
                          locale,
                        )}
                      >
                        {/* Inside the grid, not above it. A `row` whose parent
                            is not a grid, table or rowgroup belongs to no table
                            structure, and this one sat outside while the six
                            date rows sat inside — reported on every fixture
                            that renders the calendar. */}
                        <div
                          className={mergedClasses.listHeader}
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
                                showTodayIndicator={showTodayIndicator}
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
                      className={mergedClasses.todayTrigger}
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
                      className={mergedClasses.todayTrigger}
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
            </MenuSurface>
          )}
        </div>

        {error && errorMessage && (
          <div id={errorId} role="alert" data-invalid className={mergedClasses.message}>
            {errorMessage}
          </div>
        )}

        {success && successMessage && !error && (
          <div role="status" data-valid className={mergedClasses.message || undefined}>{successMessage}</div>
        )}
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
