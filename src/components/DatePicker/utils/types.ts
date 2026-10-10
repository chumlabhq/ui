import type { Locale } from "date-fns";
import type { HTMLAttributes, ReactNode } from "react";

export type { Locale };

export type DatePickerSelectionMode = "single" | "range" | "multiple";

/**
 * A selected day together with the string the trigger shows for it.
 */
export interface DateValue {
  /** The selected day as a Date. */
  date: Date;
  /** The same day already formatted by `dateFormat`, so a consumer does not reimplement the format to display it. */
  dateString: string;
}

/**
 * A start and end day. `end` is null between the two clicks of a range selection.
 */
export interface DateRange {
  /** The earlier endpoint, or null while a range is half-picked. */
  start: Date | null;
  /** The later endpoint, null until the second click. */
  end: Date | null;
}

/**
 * A range in the richer form `onValueChange` reports, each endpoint carrying its formatted string.
 */
export interface DateRangeValue {
  /** The earlier endpoint, as both a Date and its formatted string. */
  start: DateValue | null;
  /** The later endpoint, in the same pair. */
  end: DateValue | null;
}

/**
 * A shortcut button beside the calendar that sets the value without navigating to it.
 */
export interface DatePreset {
  /** The button's text in the preset column, such as "Last 7 days". */
  label: string;
  /** Computes the value when the preset is chosen, so "today" resolves at click time rather than at render. */
  getValue: () => Date | DateRange | Date[];
}

/**
 * A note attached to a day — a holiday, a deadline — drawn as a dot under the number.
 */
export interface DateMarker {
  /** The day to mark. */
  date: Date;
  /** Short text for the marker, used as its accessible name and tooltip title. */
  label: string;
  /** Longer text shown under the label in the marker's tooltip. */
  description?: string;
  /** A caller-defined category, so several markers can be styled as a group. */
  type?: string;
  /** Overrides the dot's colour for this marker. */
  color?: string;
}

/**
 * Rules for which days cannot be chosen. Fields combine: a day is disabled if any rule matches.
 */
export interface DisabledDateOptions {
  /** Disables every day earlier than this one. */
  before?: Date;
  /** Disables every day later than this one. */
  after?: Date;
  /** Disables every day before today, recomputed per render rather than pinned at mount. */
  disablePast?: boolean;
  /** Disables every day after today. */
  disableFuture?: boolean;
  /** Specific days to disable, matched by calendar day rather than by timestamp. */
  dates?: Date[];
  /** Weekdays to disable everywhere, 0 being Sunday — for closed days. */
  daysOfWeek?: number[];
  /** A predicate for rules the fields above cannot express; it runs for every rendered day, so keep it cheap. */
  custom?: (date: Date) => boolean;
}

export interface DatePickerClasses {
  /** Root container */
  root?: string;
  /** Trigger button */
  trigger?: string;
  /** Text input inside trigger */
  input?: string;
  /** The trigger's clear/calendar icon row. */
  triggerActions?: string;
  /** Calendar icon in trigger */
  icon?: string;
  /** Clear button in trigger */
  clearTrigger?: string;
  /** Label above trigger */
  label?: string;
  /** Error message below trigger */
  message?: string;
  /** Description text below label */
  description?: string;
  /** Calendar popover container */
  content?: string;
  /** Calendar header (month/year nav) */
  header?: string;
  /** Month navigation container */
  row?: string;
  /** Navigation button (prev/next month/year) */
  navButton?: string;
  /** Multi-month grid wrapper */
  listRow?: string;
  /** Single month grid */
  list?: string;
  /** Weekday header row */
  listHeader?: string;
  /** Individual weekday label */
  weekday?: string;
  /** Calendar day cell */
  item?: string;
  /** Keyboard focused day */
  /** Week number column */
  weekNumber?: string;
  /** Preset buttons container */
  presetGroup?: string;
  /** Individual preset button */
  presetTrigger?: string;
  /** Calendar footer */
  footer?: string;
  /** Today button in footer */
  todayTrigger?: string;
  /** Marker indicator dot */
  markerIndicator?: string;
  /** Month select button */
  monthSelect?: string;
  /** Year select button */
  yearSelect?: string;
  /** Generic dropdown menu */
  subContent?: string;
  /** Dropdown item */
  subItem?: string;
  /** Selected dropdown item */
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
 * <DatePicker selectionMode="range" value={range} onValueChange={setRange} />
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

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  minDate?: Date;
  maxDate?: Date;
  disabledDates?: DisabledDateOptions;

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

  showPresets?: boolean;
  presets?: DatePreset[];

  markers?: DateMarker[];
  showMarkerIndicator?: boolean;
  showMarkerTooltip?: boolean;

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
  /** Shows a clear button in the trigger when a value is set. Default: `true`. */
  clearable?: boolean;
  required?: boolean;
  fullWidth?: boolean;

  showCalendarIcon?: boolean;

  calendarIcon?: ReactNode;
  clearIcon?: ReactNode;
  prevMonthIcon?: ReactNode;
  nextMonthIcon?: ReactNode;
  prevYearIcon?: ReactNode;
  nextYearIcon?: ReactNode;
  todayIcon?: ReactNode;
  monthDropdownSelectedIcon?: ReactNode;
  yearDropdownSelectedIcon?: ReactNode;

  classes?: DatePickerClasses;
  unstyled?: boolean;

  portalContainer?: HTMLElement | null;

  lockScroll?: boolean;

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

  reduceMotion?: boolean | "auto";
}

/** Single date selection mode. */
interface SingleDatePickerProps extends BaseDatePickerProps {
  selectionMode?: "single";
  /** Selected date. Omit for an uncontrolled picker. */
  value?: Date | null;
  /** Initial date when uncontrolled. Ignored if `value` is set. */
  defaultValue?: Date | null;
  /** Fires when the selected date changes. Not `onChange`. */
  onValueChange?: (date: Date | null, dateValue: DateValue | null) => void;
}

/** Date range selection mode. */
interface RangeDatePickerProps extends BaseDatePickerProps {
  selectionMode: "range";
  /** Selected date range. Omit for an uncontrolled picker. */
  value?: DateRange | null;
  /** Initial range when uncontrolled. Ignored if `value` is set. */
  defaultValue?: DateRange | null;
  /** Fires when the selected range changes. Not `onChange`. */
  onValueChange?: (range: DateRange | null, rangeValue: DateRangeValue | null) => void;
}

/** Multiple date selection mode. */
interface MultipleDatePickerProps extends BaseDatePickerProps {
  selectionMode: "multiple";
  /** Selected dates. Omit for an uncontrolled picker. */
  value?: Date[] | null;
  /** Initial dates when uncontrolled. Ignored if `value` is set. */
  defaultValue?: Date[] | null;
  /** Fires when the selected dates change. Not `onChange`. */
  onValueChange?: (dates: Date[] | null, dateValues: DateValue[] | null) => void;
}

/** DatePicker props — discriminated by `selectionMode`. */
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
  selectionMode: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null, dateValue: DateValue | null) => void;
}

interface RangeUseDatePickerProps extends BaseUseDatePickerProps {
  selectionMode: "range";
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (range: DateRange | null, rangeValue: DateRangeValue | null) => void;
}

interface MultipleUseDatePickerProps extends BaseUseDatePickerProps {
  selectionMode: "multiple";
  value?: Date[] | null;
  defaultValue?: Date[] | null;
  onValueChange?: (dates: Date[] | null, dateValues: DateValue[] | null) => void;
}

export type UseDatePickerProps =
  | SingleUseDatePickerProps
  | RangeUseDatePickerProps
  | MultipleUseDatePickerProps;

/**
 * One cell of the month grid, with every flag a renderer needs already resolved so a custom day renderer does no date maths.
 */
export interface CalendarDay {
  /** The day this cell stands for, at local midnight. */
  date: Date;
  /** The number printed in the cell, 1-31. */
  dayOfMonth: number;
  /** True for the system's current date, which the calendar rings rather than selects. */
  isToday: boolean;
  /** True when this exact day is the value, or an endpoint of a range value. */
  isSelected: boolean;
  /** True when `disabledDates` rules it out; it renders but does not respond. */
  isDisabled: boolean;
  /** True for a day belonging to the neighbouring month that fills the grid's first or last row. */
  isOutside: boolean;
  /** True for the earlier endpoint of a range, drawn with a half-rounded edge. */
  isRangeStart: boolean;
  /** True for the later endpoint of a range. */
  isRangeEnd: boolean;
  /** True for a day strictly between the endpoints — tinted, but not an endpoint. */
  isInRange: boolean;
  /** True when a `DateMarker` matches this day. */
  isMarked: boolean;
  /** The marker that matched, so a custom renderer reads its label and colour without searching again. */
  marker?: DateMarker;
  /** ISO week this day falls in, present only when `showWeekNumbers` is on. */
  weekNumber?: number;
}

export interface CalendarMonth {
  month: Date;
  weeks: CalendarDay[][];
}
