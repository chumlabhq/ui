import type { Locale } from "date-fns";
import type { HTMLAttributes, ReactNode } from "react";

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
  /** Description text below label */
  description?: string;
  /** Success message below trigger */
  success?: string;
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

/**
 * Shared props for all DatePicker modes.
 *
 * @example Single date
 * ```tsx
 * <DatePicker value={date} onValueChange={setDate} />
 * ```
 *
 * @example Range selection
 * ```tsx
 * <DatePicker mode="range" value={range} onValueChange={setRange} />
 * ```
 */
interface BaseDatePickerProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "defaultValue" | "onChange" | "value"
  > {
  /** Fires when the clear button is clicked. */
  onClear?: () => void;
  /** Fires when the displayed month changes via navigation. */
  onMonthChange?: (month: Date) => void;

  // ─── Controlled open state ────────────────────────────────────────
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

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
  /** Error state boolean. Pass message via `errorMessage`. Do not pass a string here. */
  error?: boolean;
  /** Error message displayed below the trigger. */
  errorMessage?: ReactNode;
  /** Label rendered above the trigger. */
  label?: ReactNode;
  /** Helper text rendered below the label. */
  description?: ReactNode;
  success?: boolean;
  successMessage?: ReactNode;
  loading?: boolean;
  clearable?: boolean;
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

  // ─── Portal ─────────────────────────────────────────────────────────
  portalContainer?: HTMLElement | null;

  // ─── Scroll behavior ──────────────────────────────────────────────
  lockScroll?: boolean;

  // ─── Dropdown positioning ────────────────────────────────────────
  /** Z-index of the calendar popup. */
  dropdownZIndex?: number;
  /** Vertical placement of the calendar popup relative to the trigger. */
  dropdownPosition?: "top" | "bottom";
  /** When true, locks the calendar to the specified dropdownPosition without auto-flipping. */
  forceDropdownPosition?: boolean;
  /** Gap in pixels between trigger and calendar popup. */
  dropdownGap?: number;
  /** Keep the calendar DOM mounted when closed. */
  keepMounted?: boolean;

  // ─── Motion ─────────────────────────────────────────────────────────
  reduceMotion?: boolean | "auto";
}

/** Single date selection mode. */
interface SingleDatePickerProps extends BaseDatePickerProps {
  mode?: "single";
  /** Selected date. */
  value?: Date | null;
  /** Fires when the selected date changes. Not `onChange`. */
  onValueChange?: (date: Date | null, dateValue: DateValue | null) => void;
}

/** Date range selection mode. */
interface RangeDatePickerProps extends BaseDatePickerProps {
  mode: "range";
  /** Selected date range. */
  value?: DateRange | null;
  /** Fires when the selected range changes. Not `onChange`. */
  onValueChange?: (range: DateRange | null, rangeValue: DateRangeValue | null) => void;
}

/** Multiple date selection mode. */
interface MultipleDatePickerProps extends BaseDatePickerProps {
  mode: "multiple";
  /** Selected dates. */
  value?: Date[] | null;
  /** Fires when the selected dates change. Not `onChange`. */
  onValueChange?: (dates: Date[] | null, dateValues: DateValue[] | null) => void;
}

/** DatePicker props — discriminated by `mode`. */
export type DatePickerProps =
  | SingleDatePickerProps
  | RangeDatePickerProps
  | MultipleDatePickerProps;

interface BaseUseDatePickerProps {
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
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onMonthChange?: (month: Date) => void;
}

interface SingleUseDatePickerProps extends BaseUseDatePickerProps {
  mode: "single";
  value?: Date | null;
  onValueChange?: (date: Date | null, dateValue: DateValue | null) => void;
}

interface RangeUseDatePickerProps extends BaseUseDatePickerProps {
  mode: "range";
  value?: DateRange | null;
  onValueChange?: (range: DateRange | null, rangeValue: DateRangeValue | null) => void;
}

interface MultipleUseDatePickerProps extends BaseUseDatePickerProps {
  mode: "multiple";
  value?: Date[] | null;
  onValueChange?: (dates: Date[] | null, dateValues: DateValue[] | null) => void;
}

export type UseDatePickerProps =
  | SingleUseDatePickerProps
  | RangeUseDatePickerProps
  | MultipleUseDatePickerProps;

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
