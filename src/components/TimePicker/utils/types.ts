import type { ReactNode } from "react";

export type TimeFormat = "12h" | "24h";
export type TimePickerVariant = "dropdown" | "clock";
export type ClockSelectionMode = "hours" | "minutes";

export interface TimeValue {
  hours: number;
  minutes: number;
  period?: "AM" | "PM";
}

export interface TimePickerProps {
  value: string | null;
  onChange: (time: string | null, timeValue: TimeValue | null) => void;
  onBlur?: () => void;
  format?: TimeFormat;
  minuteStep?: number;
  minTime?: string;
  maxTime?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  label?: ReactNode;
  required?: boolean;
  showEndIcon?: boolean;
  endIcon?: ReactNode;
  showSelectedIcon?: boolean;
  selectedIcon?: ReactNode;
  renderOptionContent?: (time: string, isSelected: boolean) => ReactNode;
  fullWidth?: boolean;
  variant?: TimePickerVariant;
  className?: string;
  containerClassName?: string;
  triggerClassName?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  selectedOptionClassName?: string;
  focusedOptionClassName?: string;
  optionListClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  endIconClassName?: string;
  selectedIconClassName?: string;
  noResultsClassName?: string;
  clockContainerClassName?: string;
  clockDisplayClassName?: string;
  clockDisplayHoursClassName?: string;
  clockDisplayMinutesClassName?: string;
  clockDisplayActiveClassName?: string;
  clockDisplaySeparatorClassName?: string;
  clockFaceClassName?: string;
  clockHandClassName?: string;
  clockHandLineClassName?: string;
  clockHandDotClassName?: string;
  clockNumberClassName?: string;
  clockNumberSelectedClassName?: string;
  clockNumberInnerClassName?: string;
  clockCenterClassName?: string;
  clockActionsClassName?: string;
  clockCancelButtonClassName?: string;
  clockOkButtonClassName?: string;
  clockPeriodToggleClassName?: string;
  clockPeriodButtonClassName?: string;
  clockPeriodActiveClassName?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export interface UseTimePickerProps {
  value: string | null;
  format: TimeFormat;
  minuteStep: number;
  minTime?: string;
  maxTime?: string;
  disabled: boolean;
  onChange: (time: string | null, timeValue: TimeValue | null) => void;
}

export interface UseTimePickerReturn {
  isOpen: boolean;
  inputValue: string;
  focusedIndex: number;
  displayOptions: string[];
  setInputValue: (value: string) => void;
  setFocusedIndex: (index: number) => void;
  handleToggle: () => void;
  handleClose: () => void;
  handleInputChange: (value: string) => void;
  handleOptionSelect: (time: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  handleBlur: () => void;
  commitValue: () => void;
}
