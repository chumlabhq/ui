import type { Locale } from "date-fns";
import type { ReactNode } from "react";

export type { Locale };

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

export interface DatePickerClasses {
  /** Root container */
  root?: string;
  /** Trigger button */
  trigger?: string;
  /** Text input inside trigger */
  input?: string;
  /** Calendar icon in trigger */
  calendarIcon?: string;
  /** Clear button in trigger */
  clearButton?: string;
  /** Label above trigger */
  label?: string;
  /** Error message below trigger */
  error?: string;
  /** Calendar popover container */
  calendar?: string;
  /** Calendar header (month/year nav) */
  header?: string;
  /** Month navigation container */
  monthNav?: string;
  /** Navigation button (prev/next month/year) */
  navButton?: string;
  /** Disabled navigation button */
  navButtonDisabled?: string;
  /** Multi-month grid wrapper */
  monthGrid?: string;
  /** Single month grid */
  grid?: string;
  /** Weekday header row */
  weekdayHeader?: string;
  /** Individual weekday label */
  weekday?: string;
  /** Calendar day cell */
  day?: string;
  /** Selected day */
  daySelected?: string;
  /** Today indicator */
  dayToday?: string;
  /** Disabled day */
  dayDisabled?: string;
  /** Outside month day */
  dayOutside?: string;
  /** Range start day */
  dayRangeStart?: string;
  /** Range end day */
  dayRangeEnd?: string;
  /** Days within range */
  dayRangeMiddle?: string;
  /** Hovered day */
  dayHover?: string;
  /** Keyboard focused day */
  dayFocused?: string;
  /** Marked day */
  dayMarked?: string;
  /** Week number column */
  weekNumber?: string;
  /** Preset buttons container */
  presets?: string;
  /** Individual preset button */
  presetButton?: string;
  /** Active preset button */
  presetActive?: string;
  /** Calendar footer */
  footer?: string;
  /** Today button in footer */
  todayButton?: string;
  /** Marker indicator dot */
  markerIndicator?: string;
  /** Marker tooltip */
  markerTooltip?: string;
  /** Month select button */
  monthSelect?: string;
  /** Year select button */
  yearSelect?: string;
  /** Month dropdown menu */
  monthDropdown?: string;
  /** Year dropdown menu */
  yearDropdown?: string;
  /** Generic dropdown menu */
  dropdownMenu?: string;
  /** Dropdown item */
  dropdownItem?: string;
  /** Selected dropdown item */
  dropdownItemSelected?: string;
}

export interface DatePickerProps {
  /** Selection mode */
  mode?: DatePickerMode;

  // ─── Values ─────────────────────────────────────────────────────────
  /** Selected date (single mode) */
  value?: Date | null;
  /** Selected range (range mode) */
  rangeValue?: DateRange | null;
  /** Selected dates (multiple mode) */
  multipleValue?: Date[] | null;

  // ─── Callbacks ──────────────────────────────────────────────────────
  onChange?: (date: Date | null, dateValue: DateValue | null) => void;
  onRangeChange?: (range: DateRange | null, rangeValue: DateRangeValue | null) => void;
  onMultipleChange?: (dates: Date[] | null, dateValues: DateValue[] | null) => void;
  onClear?: () => void;
  onMonthChange?: (month: Date) => void;
  onOpen?: () => void;
  onClose?: () => void;

  // ─── Constraints ────────────────────────────────────────────────────
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: DisabledDateOptions;

  // ─── Display ────────────────────────────────────────────────────────
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: Locale;
  numberOfMonths?: number;
  dateFormat?: string;
  showTodayIndicator?: boolean;
  showTodayButton?: boolean;
  todayAction?: boolean;
  showWeekNumbers?: boolean;
  showOutsideDays?: boolean;
  outsideDaysSelectable?: boolean;
  fixedWeeks?: boolean;

  // ─── Presets ────────────────────────────────────────────────────────
  showPresets?: boolean;
  presets?: DatePreset[];

  // ─── Markers ────────────────────────────────────────────────────────
  markers?: DateMarker[];
  showMarkerIndicator?: boolean;
  showMarkerTooltip?: boolean;

  // ─── Form ───────────────────────────────────────────────────────────
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  label?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;

  // ─── Trigger UI ─────────────────────────────────────────────────────
  showClearButton?: boolean;
  showCalendarIcon?: boolean;

  // ─── Custom icons ───────────────────────────────────────────────────
  calendarIcon?: ReactNode;
  clearIcon?: ReactNode;
  prevMonthIcon?: ReactNode;
  nextMonthIcon?: ReactNode;
  prevYearIcon?: ReactNode;
  nextYearIcon?: ReactNode;
  todayIcon?: ReactNode;
  monthDropdownSelectedIcon?: ReactNode;
  yearDropdownSelectedIcon?: ReactNode;

  // ─── Styling ────────────────────────────────────────────────────────
  classes?: DatePickerClasses;
  unstyled?: boolean;
  className?: string;

  // ─── Portal ─────────────────────────────────────────────────────────
  portalContainer?: HTMLElement | null;

  // ─── Scroll behavior ──────────────────────────────────────────────
  /** When true, locks body scroll while the calendar is open. Default: false (calendar repositions on scroll). */
  lockScroll?: boolean;

  // ─── Motion ─────────────────────────────────────────────────────────
  reduceMotion?: boolean | "auto";
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
  showWeekNumbers: boolean;
  markers?: DateMarker[];
  onChange?: (date: Date | null, dateValue: DateValue | null) => void;
  onRangeChange?: (range: DateRange | null, rangeValue: DateRangeValue | null) => void;
  onMultipleChange?: (dates: Date[] | null, dateValues: DateValue[] | null) => void;
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
