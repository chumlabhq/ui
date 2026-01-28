import {
  useRef,
  useEffect,
  useId,
  forwardRef,
  memo,
  useCallback,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type {
  DatePickerProps,
  CalendarDay,
  DatePreset,
  DateRange,
  DateMarker,
} from "./types";
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const defaultButtonClass =
    "flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:border-2 focus:border-blue-500";
  const defaultMenuClass =
    "absolute z-[60] mt-1 max-h-60 overflow-auto rounded-lg bg-white shadow-lg border border-gray-200 py-1 min-w-[140px]";
  const defaultItemClass =
    "flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50 cursor-pointer";
  const defaultItemSelectedClass = "bg-blue-50 text-blue-600 font-medium";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={buttonClassName || defaultButtonClass}
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
        <div className={menuClassName || defaultMenuClass} role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                ref={isSelected ? selectedOptionRef : undefined}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={[
                  itemClassName || defaultItemClass,
                  isSelected &&
                    (itemSelectedClassName || defaultItemSelectedClass),
                ]
                  .filter(Boolean)
                  .join(" ")}
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

interface MarkerTooltipProps {
  marker: DateMarker;
  className?: string;
  children: React.ReactNode;
  showTooltip?: boolean;
}

const MarkerTooltip = memo(function MarkerTooltip({
  marker,
  className,
  children,
  showTooltip = true,
}: MarkerTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    placement: "top" | "bottom";
  } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const viewportWidth = window.innerWidth;

      const gap = 4;
      const estimatedTooltipHeight = 60;

      let placement: "top" | "bottom" = "bottom";
      let top: number;
      let left = triggerRect.left + scrollX;

      if (
        triggerRect.bottom + estimatedTooltipHeight + gap >
        window.innerHeight
      ) {
        placement = "top";
        top = triggerRect.top + scrollY - estimatedTooltipHeight - gap;
      } else {
        placement = "bottom";
        top = triggerRect.bottom + scrollY + gap;
      }

      if (left < 8) left = 8;
      if (left + 180 > viewportWidth - 8) {
        left = viewportWidth - 180 - 8;
      }

      setPosition({ top, left, placement });
      setIsVisible(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    setPosition(null);
  }, []);

  if (!showTooltip) {
    return <>{children}</>;
  }

  const defaultTooltipClass =
    "z-[9999] px-3 py-2 text-sm bg-white rounded-lg shadow-lg border border-gray-200";

  const tooltip =
    isVisible &&
    position &&
    createPortal(
      <div
        role="tooltip"
        className={className || defaultTooltipClass}
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          maxWidth: 220,
        }}
      >
        <div className="font-medium text-gray-900">{marker.label}</div>
        {marker.description && (
          <div className="text-gray-500 text-xs mt-0.5">
            {marker.description}
          </div>
        )}
        {marker.type && (
          <div className="text-xs text-gray-400 mt-1 capitalize">
            {marker.type}
          </div>
        )}
      </div>,
      document.body,
    );

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {tooltip}
    </div>
  );
});

const DayCell = memo(function DayCell({
  day,
  datePickerId,
  dayClassName,
  daySelectedClassName,
  dayTodayClassName,
  dayDisabledClassName,
  dayOutsideClassName,
  dayRangeStartClassName,
  dayRangeEndClassName,
  dayRangeMiddleClassName,
  dayFocusedClassName,
  dayMarkedClassName,
  markerIndicatorClassName,
  markerTooltipClassName,
  isFocused,
  showOutsideDays,
  showMarkerIndicator,
  showMarkerTooltip,
  onSelect,
  onHover,
  onFocus,
  onKeyDown,
}: {
  day: CalendarDay;
  datePickerId: string;
  dayClassName: string;
  daySelectedClassName: string;
  dayTodayClassName: string;
  dayDisabledClassName: string;
  dayOutsideClassName: string;
  dayRangeStartClassName: string;
  dayRangeEndClassName: string;
  dayRangeMiddleClassName: string;
  dayFocusedClassName: string;
  dayMarkedClassName: string;
  markerIndicatorClassName: string;
  markerTooltipClassName: string;
  isFocused: boolean;
  showOutsideDays: boolean;
  showMarkerIndicator: boolean;
  showMarkerTooltip: boolean;
  onSelect: (date: Date, isOutside: boolean) => void;
  onHover: (date: Date | null) => void;
  onFocus: (date: Date | null) => void;
  onKeyDown: (event: React.KeyboardEvent, date: Date) => void;
}) {
  if (day.dayOfMonth === 0 || (day.isOutside && !showOutsideDays)) {
    return <div className={dayClassName} aria-hidden="true" />;
  }

  const classNames = [
    dayClassName,
    day.isSelected && daySelectedClassName,
    day.isToday && dayTodayClassName,
    day.isDisabled && dayDisabledClassName,
    day.isOutside && dayOutsideClassName,
    day.isRangeStart && dayRangeStartClassName,
    day.isRangeEnd && dayRangeEndClassName,
    day.isInRange && dayRangeMiddleClassName,
    isFocused && dayFocusedClassName,
    day.isMarked && dayMarkedClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const defaultMarkerIndicatorClass =
    "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500";
  const markerColor = day.marker?.color;

  const dayContent = (
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
      onMouseEnter={() => onHover(day.date)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onFocus(day.date)}
      onKeyDown={(e) => onKeyDown(e, day.date)}
    >
      {day.dayOfMonth}
      {day.isMarked && showMarkerIndicator && (
        <span
          className={
            markerColor ||
            markerIndicatorClassName ||
            defaultMarkerIndicatorClass
          }
          style={
            markerColor?.startsWith("#")
              ? { backgroundColor: markerColor }
              : undefined
          }
          aria-hidden="true"
        />
      )}
    </button>
  );

  if (day.isMarked && day.marker && showMarkerTooltip) {
    return (
      <MarkerTooltip
        marker={day.marker}
        className={markerTooltipClassName}
        showTooltip={showMarkerTooltip}
      >
        {dayContent}
      </MarkerTooltip>
    );
  }

  return dayContent;
});

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
}: {
  presets: DatePreset[];
  mode: "single" | "range" | "multiple";
  value?: Date | null;
  rangeValue?: DateRange | null;
  multipleValue?: Date[] | null;
  presetsClassName: string;
  presetButtonClassName: string;
  presetActiveClassName: string;
  onPresetClick: (preset: DatePreset) => void;
}) {
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
    <div className={presetsClassName} role="group" aria-label="Date presets">
      {presets.map((preset) => {
        const isActive = isPresetActive(preset);
        return (
          <button
            key={preset.label}
            type="button"
            className={[
              presetButtonClassName,
              isActive && presetActiveClassName,
            ]
              .filter(Boolean)
              .join(" ")}
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

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      mode = "single",
      value,
      rangeValue,
      multipleValue,
      onChange,
      onRangeChange,
      onMultipleChange,
      onClear,
      minDate,
      maxDate,
      disabledDates,
      weekStartsOn = 0,
      locale,
      numberOfMonths = 1,
      showTodayIndicator = true,
      showTodayButton = true,
      todayAction = true,
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
      className = "",
      containerClassName = "",
      triggerClassName = "",
      inputClassName = "",
      calendarClassName = "",
      headerClassName = "",
      monthNavClassName = "",
      monthSelectClassName = "",
      yearSelectClassName = "",
      navButtonClassName = "",
      weekdayClassName = "",
      weekdayHeaderClassName = "",
      dayClassName = "",
      daySelectedClassName = "",
      dayTodayClassName = "",
      dayDisabledClassName = "",
      dayOutsideClassName = "",
      dayRangeStartClassName = "",
      dayRangeEndClassName = "",
      dayRangeMiddleClassName = "",
      dayFocusedClassName = "",
      dayMarkedClassName = "",
      weekNumberClassName = "",
      gridClassName = "",
      monthGridClassName = "",
      labelClassName = "",
      errorClassName = "",
      calendarIconClassName = "",
      clearButtonClassName = "",
      presetsClassName = "",
      presetButtonClassName = "",
      presetActiveClassName = "",
      footerClassName = "",
      todayButtonClassName = "",
      markerIndicatorClassName = "",
      markerTooltipClassName = "",
      monthDropdownClassName = "",
      yearDropdownClassName = "",
      dropdownMenuClassName = "",
      dropdownItemClassName = "",
      dropdownItemSelectedClassName = "",
      monthDropdownSelectedIcon,
      yearDropdownSelectedIcon,
      onMonthChange,
      onOpen,
      onClose,
    },
    ref,
  ) => {
    const generatedId = useId();
    const datePickerId = id || name || generatedId;
    const triggerId = `${datePickerId}-trigger`;
    const calendarId = `${datePickerId}-calendar`;
    const errorId = `${datePickerId}-error`;

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

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
      markers,
      onChange,
      onRangeChange,
      onMultipleChange,
      onMonthChange,
    });

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

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          handleClose();
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, handleClose]);

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
          onChange?.(presetValue, dateValue);
          handleClose();
        } else if (
          mode === "range" &&
          typeof presetValue === "object" &&
          "start" in presetValue
        ) {
          const range = presetValue as DateRange;
          onRangeChange?.(range, {
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
          onMultipleChange?.(dates, dateValues);
        }
      },
      [mode, onChange, onRangeChange, onMultipleChange, handleClose],
    );

    const weekdays = getWeekdayHeaders(weekStartsOn, "EEE", locale);
    const effectivePresets = presets || getDefaultPresets(mode);
    const fullWidthClass = fullWidth ? "w-full" : "";

    const showFooter = showTodayIndicator && (showTodayButton || todayAction);

    return (
      <div
        ref={ref}
        className={[containerClassName, fullWidthClass]
          .filter(Boolean)
          .join(" ")}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-open={isOpen || undefined}
      >
        {label && (
          <label htmlFor={triggerId} className={labelClassName}>
            {label}
            {required && <span aria-hidden="true">*</span>}
          </label>
        )}

        <div
          ref={containerRef}
          className={["relative", className].filter(Boolean).join(" ")}
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
            className={triggerClassName}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-open={isOpen || undefined}
          >
            <span className={inputClassName || "flex-1 truncate text-left"}>
              {hasValue ? displayValue : placeholder || defaultPlaceholder}
            </span>
            <div className="flex items-center gap-1">
              {showClearButton && hasValue && !disabled && (
                <span
                  role="button"
                  aria-label="Clear selection"
                  className={clearButtonClassName}
                  onClick={handleClearClick}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClearClick(e as unknown as React.MouseEvent);
                    }
                  }}
                  tabIndex={0}
                >
                  {clearIcon || <XIcon className="w-4 h-4" />}
                </span>
              )}
              {showCalendarIcon &&
                (calendarIcon || (
                  <CalendarIcon
                    className={calendarIconClassName || "w-5 h-5"}
                  />
                ))}
            </div>
          </button>

          {isOpen && (
            <div
              id={calendarId}
              role="dialog"
              aria-modal="true"
              aria-label={`${mode === "single" ? "Date" : mode === "range" ? "Date range" : "Multiple dates"} picker`}
              className={calendarClassName}
            >
              {showPresets && (
                <PresetsPanel
                  presets={effectivePresets}
                  mode={mode}
                  value={value}
                  rangeValue={rangeValue}
                  multipleValue={multipleValue}
                  presetsClassName={presetsClassName}
                  presetButtonClassName={presetButtonClassName}
                  presetActiveClassName={presetActiveClassName}
                  onPresetClick={handlePresetClick}
                />
              )}

              <div className={monthGridClassName}>
                {calendarMonths.map((calendarMonth, monthIndex) => {
                  const monthYear = getYear(calendarMonth.month);
                  const monthIdx = getMonth(calendarMonth.month);

                  return (
                    <div
                      key={calendarMonth.month.toISOString()}
                      className={gridClassName}
                    >
                      <div className={headerClassName}>
                        {monthIndex === 0 && (
                          <>
                            <button
                              type="button"
                              aria-label="Previous year"
                              onClick={() => handleYearSelect(monthYear - 1)}
                              className={navButtonClassName}
                            >
                              {prevYearIcon || (
                                <DoubleChevronLeftIcon className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              aria-label="Previous month"
                              onClick={() => handleMonthNavigation("prev")}
                              className={navButtonClassName}
                            >
                              {prevMonthIcon || (
                                <ChevronLeftIcon className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}

                        <div className={monthNavClassName}>
                          <CustomDropdown
                            value={monthIdx}
                            options={getMonthOptions(locale)}
                            onChange={(m) => handleMonthSelect(m - monthIndex)}
                            buttonClassName={
                              monthSelectClassName || monthDropdownClassName
                            }
                            menuClassName={dropdownMenuClassName}
                            itemClassName={dropdownItemClassName}
                            itemSelectedClassName={
                              dropdownItemSelectedClassName
                            }
                            selectedIcon={monthDropdownSelectedIcon}
                            ariaLabel="Select month"
                          />
                          <CustomDropdown
                            value={monthYear}
                            options={getYearOptions(monthYear)}
                            onChange={handleYearSelect}
                            buttonClassName={
                              yearSelectClassName || yearDropdownClassName
                            }
                            menuClassName={dropdownMenuClassName}
                            itemClassName={dropdownItemClassName}
                            itemSelectedClassName={
                              dropdownItemSelectedClassName
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
                              className={navButtonClassName}
                            >
                              {nextMonthIcon || (
                                <ChevronRightIcon className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              aria-label="Next year"
                              onClick={() => handleYearSelect(monthYear + 1)}
                              className={navButtonClassName}
                            >
                              {nextYearIcon || (
                                <DoubleChevronRightIcon className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>

                      <div
                        className={weekdayHeaderClassName}
                        role="row"
                        aria-label="Days of the week"
                      >
                        {showWeekNumbers && (
                          <div
                            className={weekNumberClassName}
                            aria-hidden="true"
                          >
                            #
                          </div>
                        )}
                        {weekdays.map((day) => (
                          <div
                            key={day}
                            className={weekdayClassName}
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
                            className={
                              showWeekNumbers
                                ? "grid grid-cols-8"
                                : "grid grid-cols-7"
                            }
                          >
                            {showWeekNumbers && week[0]?.weekNumber && (
                              <div
                                className={weekNumberClassName}
                                aria-hidden="true"
                              >
                                {week[0].weekNumber}
                              </div>
                            )}
                            {week.map((day) => (
                              <DayCell
                                key={day.date.toISOString()}
                                day={day}
                                datePickerId={datePickerId}
                                dayClassName={dayClassName}
                                daySelectedClassName={daySelectedClassName}
                                dayTodayClassName={dayTodayClassName}
                                dayDisabledClassName={dayDisabledClassName}
                                dayOutsideClassName={dayOutsideClassName}
                                dayRangeStartClassName={dayRangeStartClassName}
                                dayRangeEndClassName={dayRangeEndClassName}
                                dayRangeMiddleClassName={
                                  dayRangeMiddleClassName
                                }
                                dayFocusedClassName={dayFocusedClassName}
                                dayMarkedClassName={dayMarkedClassName}
                                markerIndicatorClassName={
                                  markerIndicatorClassName
                                }
                                markerTooltipClassName={markerTooltipClassName}
                                isFocused={
                                  focusedDate
                                    ? isSameDay(day.date, focusedDate)
                                    : false
                                }
                                showOutsideDays={showOutsideDays}
                                showMarkerIndicator={showMarkerIndicator}
                                showMarkerTooltip={showMarkerTooltip}
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
                <div className={footerClassName}>
                  {showTodayButton && todayAction && (
                    <button
                      type="button"
                      className={todayButtonClassName}
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
                      className={todayButtonClassName}
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
            </div>
          )}
        </div>

        {error && errorMessage && (
          <div id={errorId} role="alert" className={errorClassName}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
