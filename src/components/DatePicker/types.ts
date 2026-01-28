import type { ReactNode } from "react";

export type DatePickerMode = "single" | "range" | "multiple";

export interface DateValue {
  date: Date;
  dateString: string;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangeValue {
  start: DateValue | null;
  end: DateValue | null;
}

export interface DatePreset {
  label: string;
  getValue: () => Date | DateRange | Date[];
}

export interface DateMarker {
  date: Date;
  label: string;
  description?: string;
  type?: string;
  color?: string;
}

export interface DisabledDateOptions {
  before?: Date;
  after?: Date;
  disablePast?: boolean;
  disableFuture?: boolean;
  dates?: Date[];
  daysOfWeek?: number[];
  custom?: (date: Date) => boolean;
}

export interface DatePickerProps {
  mode?: DatePickerMode;
  value?: Date | null;
  rangeValue?: DateRange | null;
  multipleValue?: Date[] | null;
  onChange?: (date: Date | null, dateValue: DateValue | null) => void;
  onRangeChange?: (
    range: DateRange | null,
    rangeValue: DateRangeValue | null,
  ) => void;
  onMultipleChange?: (
    dates: Date[] | null,
    dateValues: DateValue[] | null,
  ) => void;
  onClear?: () => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: DisabledDateOptions;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: Locale;
  numberOfMonths?: number;
  showTodayIndicator?: boolean;
  showTodayButton?: boolean;
  todayAction?: boolean;
  dateFormat?: string;
  showWeekNumbers?: boolean;
  showOutsideDays?: boolean;
  outsideDaysSelectable?: boolean;
  fixedWeeks?: boolean;
  showPresets?: boolean;
  presets?: DatePreset[];
  markers?: DateMarker[];
  showMarkerIndicator?: boolean;
  showMarkerTooltip?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  label?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  showClearButton?: boolean;
  showCalendarIcon?: boolean;
  calendarIcon?: ReactNode;
  clearIcon?: ReactNode;
  prevMonthIcon?: ReactNode;
  nextMonthIcon?: ReactNode;
  prevYearIcon?: ReactNode;
  nextYearIcon?: ReactNode;
  todayIcon?: ReactNode;
  className?: string;
  containerClassName?: string;
  triggerClassName?: string;
  inputClassName?: string;
  calendarClassName?: string;
  headerClassName?: string;
  monthNavClassName?: string;
  navButtonClassName?: string;
  navButtonDisabledClassName?: string;
  weekdayClassName?: string;
  weekdayHeaderClassName?: string;
  dayClassName?: string;
  daySelectedClassName?: string;
  dayTodayClassName?: string;
  dayDisabledClassName?: string;
  dayOutsideClassName?: string;
  dayRangeStartClassName?: string;
  dayRangeEndClassName?: string;
  dayRangeMiddleClassName?: string;
  dayHoverClassName?: string;
  dayFocusedClassName?: string;
  dayMarkedClassName?: string;
  weekNumberClassName?: string;
  gridClassName?: string;
  monthGridClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  calendarIconClassName?: string;
  clearButtonClassName?: string;
  presetsClassName?: string;
  presetButtonClassName?: string;
  presetActiveClassName?: string;
  footerClassName?: string;
  todayButtonClassName?: string;
  markerIndicatorClassName?: string;
  markerTooltipClassName?: string;
  monthSelectClassName?: string;
  yearSelectClassName?: string;
  monthDropdownClassName?: string;
  yearDropdownClassName?: string;
  dropdownMenuClassName?: string;
  dropdownItemClassName?: string;
  dropdownItemSelectedClassName?: string;
  dropdownItemHoverClassName?: string;
  monthDropdownSelectedIcon?: ReactNode;
  yearDropdownSelectedIcon?: ReactNode;
  onMonthChange?: (month: Date) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface UseDatePickerProps {
  mode: DatePickerMode;
  value?: Date | null;
  rangeValue?: DateRange | null;
  multipleValue?: Date[] | null;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: DisabledDateOptions;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  numberOfMonths: number;
  showOutsideDays: boolean;
  outsideDaysSelectable: boolean;
  fixedWeeks: boolean;
  disabled: boolean;
  markers?: DateMarker[];
  onChange?: (date: Date | null, dateValue: DateValue | null) => void;
  onRangeChange?: (
    range: DateRange | null,
    rangeValue: DateRangeValue | null,
  ) => void;
  onMultipleChange?: (
    dates: Date[] | null,
    dateValues: DateValue[] | null,
  ) => void;
  onMonthChange?: (month: Date) => void;
}

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isOutside: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isMarked: boolean;
  marker?: DateMarker;
  weekNumber?: number;
}

export interface CalendarMonth {
  month: Date;
  weeks: CalendarDay[][];
}

import type { Locale } from "date-fns";
export type { Locale };
