// AI Knowledge: See DATEPICKER.ai.md in this directory for full usage guide, props, styling, and patterns.
export { default as DatePicker } from "./DatePicker.js";

export type {
  DatePickerProps,
  DatePickerClasses,
  DatePickerMode,
  DateValue,
  DateRange,
  DateRangeValue,
  DatePreset,
  DisabledDateOptions,
  CalendarDay,
  CalendarMonth,
  DateMarker,
} from "./utils/types.js";

export {
  DEFAULT_DATEPICKER_CLASSES,
  UNSTYLED_DATEPICKER_CLASSES,
} from "./constants.js";

export {
  formatDate,
  formatDateRange,
  formatMultipleDates,
  toDateString,
  fromDateString,
  toDateValue,
  isDateDisabled,
  getDefaultPresets,
  findMarker,
} from "./utils.js";
