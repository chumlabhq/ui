import {
  useRef,
  useEffect,
  useId,
  forwardRef,
  memo,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import type { TimePickerProps, TimeValue } from "./types";
import { useTimePicker } from "./useTimePicker";
import { ChevronDownIcon, CheckIcon } from "./icons";
import { ClockFace } from "./ClockFace";
import { formatTimeValue, parseTimeInput } from "./utils";

const TimeOption = memo(function TimeOption({
  time,
  isSelected,
  isFocused,
  dropdownId,
  index,
  optionClassName,
  selectedOptionClassName,
  focusedOptionClassName,
  selectedIconClassName,
  showSelectedIcon,
  selectedIcon,
  renderOptionContent,
  onSelect,
  onHover,
}: {
  time: string;
  isSelected: boolean;
  isFocused: boolean;
  dropdownId: string;
  index: number;
  optionClassName: string;
  selectedOptionClassName: string;
  focusedOptionClassName: string;
  selectedIconClassName: string;
  showSelectedIcon: boolean;
  selectedIcon?: ReactNode;
  renderOptionContent?: (time: string, isSelected: boolean) => ReactNode;
  onSelect: (time: string) => void;
  onHover: (index: number) => void;
}) {
  const combinedClassName = [
    optionClassName,
    isSelected && selectedOptionClassName,
    isFocused && focusedOptionClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      className={combinedClassName}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect(time);
      }}
      onMouseEnter={() => onHover(index)}
    >
      <span className="flex-1">
        {renderOptionContent ? renderOptionContent(time, isSelected) : time}
      </span>
      {isSelected &&
        showSelectedIcon &&
        (selectedIcon || <CheckIcon className={selectedIconClassName} />)}
    </div>
  );
});

const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value,
      onChange,
      onBlur,
      format = "24h",
      minuteStep = 15,
      minTime,
      maxTime,
      id,
      name,
      placeholder,
      disabled = false,
      error = false,
      errorMessage,
      label,
      required = false,
      showEndIcon = true,
      endIcon,
      showSelectedIcon = true,
      selectedIcon,
      renderOptionContent,
      fullWidth = false,
      variant = "dropdown",
      className = "",
      containerClassName = "",
      triggerClassName = "",
      inputClassName = "",
      dropdownClassName = "",
      optionClassName = "",
      selectedOptionClassName = "",
      focusedOptionClassName = "",
      optionListClassName = "",
      labelClassName = "",
      errorClassName = "",
      endIconClassName = "",
      selectedIconClassName = "",
      noResultsClassName = "",
      clockContainerClassName = "",
      clockDisplayClassName = "",
      clockDisplayHoursClassName = "",
      clockDisplayMinutesClassName = "",
      clockDisplayActiveClassName = "",
      clockDisplaySeparatorClassName = "",
      clockFaceClassName = "",
      clockHandClassName = "",
      clockHandLineClassName = "",
      clockHandDotClassName = "",
      clockNumberClassName = "",
      clockNumberSelectedClassName = "",
      clockNumberInnerClassName = "",
      clockCenterClassName = "",
      clockActionsClassName = "",
      clockCancelButtonClassName = "",
      clockOkButtonClassName = "",
      clockPeriodToggleClassName = "",
      clockPeriodButtonClassName = "",
      clockPeriodActiveClassName = "",
      onCancel,
      onConfirm,
    },
    ref,
  ) => {
    const generatedId = useId();
    const dropdownId = id || name || generatedId;
    const listboxId = `${dropdownId}-listbox`;
    const triggerId = `${dropdownId}-trigger`;
    const errorId = `${dropdownId}-error`;

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const defaultPlaceholder = format === "12h" ? "hh:mm AM/PM" : "hh:mm";

    const {
      isOpen,
      inputValue,
      focusedIndex,
      displayOptions,
      setFocusedIndex,
      handleToggle,
      handleClose,
      handleInputChange,
      handleOptionSelect,
      handleKeyDown,
      handleBlur,
    } = useTimePicker({
      value,
      format,
      minuteStep,
      minTime,
      maxTime,
      disabled,
      onChange,
    });

    useEffect(() => {
      if (isOpen) {
        inputRef.current?.focus();
      }
    }, [isOpen]);

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

    const handleInputBlur = () => {
      setTimeout(() => {
        if (!containerRef.current?.contains(document.activeElement)) {
          handleBlur();
          handleClose();
          onBlur?.();
        }
      }, 100);
    };

    const [localClockValue, setLocalClockValue] = useState<TimeValue | null>(
      null,
    );

    const clockValue = useMemo(() => {
      if (localClockValue !== null) {
        return localClockValue;
      }
      if (value) {
        return parseTimeInput(value, format);
      }
      return null;
    }, [localClockValue, value, format]);

    const handleClockChange = useCallback((timeValue: TimeValue) => {
      setLocalClockValue(timeValue);
    }, []);

    const handleClockConfirm = useCallback(() => {
      if (clockValue) {
        const formatted = formatTimeValue(clockValue, format);
        onChange(formatted, clockValue);
      }
      setLocalClockValue(null);
      handleClose();
      onConfirm?.();
    }, [clockValue, format, onChange, handleClose, onConfirm]);

    const handleClockCancel = useCallback(() => {
      setLocalClockValue(null);
      handleClose();
      onCancel?.();
    }, [handleClose, onCancel]);

    const fullWidthClass = fullWidth ? "w-full" : "";

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
          <div
            id={triggerId}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-invalid={error || undefined}
            aria-describedby={error && errorMessage ? errorId : undefined}
            aria-required={required || undefined}
            onClick={handleToggle}
            className={triggerClassName}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-open={isOpen || undefined}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");
                handleInputChange(pasted);
              }}
              placeholder={placeholder || defaultPlaceholder}
              disabled={disabled}
              className={inputClassName}
              autoComplete="off"
            />
            {showEndIcon &&
              (endIcon ? (
                <span className={endIconClassName}>{endIcon}</span>
              ) : (
                <ChevronDownIcon
                  className={[endIconClassName, isOpen ? "rotate-180" : ""]
                    .filter(Boolean)
                    .join(" ")}
                />
              ))}
          </div>

          {isOpen && variant === "dropdown" && (
            <div
              id={listboxId}
              role="listbox"
              aria-label={typeof label === "string" ? label : "Time options"}
              className={dropdownClassName}
            >
              <div className={optionListClassName}>
                {displayOptions.length === 0 ? (
                  <div className={noResultsClassName}>No matching times</div>
                ) : (
                  displayOptions.map((time, index) => (
                    <TimeOption
                      key={time}
                      time={time}
                      isSelected={time === inputValue}
                      isFocused={index === focusedIndex}
                      dropdownId={dropdownId}
                      index={index}
                      optionClassName={optionClassName}
                      selectedOptionClassName={selectedOptionClassName}
                      focusedOptionClassName={focusedOptionClassName}
                      selectedIconClassName={selectedIconClassName}
                      showSelectedIcon={showSelectedIcon}
                      selectedIcon={selectedIcon}
                      renderOptionContent={renderOptionContent}
                      onSelect={handleOptionSelect}
                      onHover={setFocusedIndex}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {isOpen && variant === "clock" && (
            <ClockFace
              value={clockValue}
              format={format}
              minuteStep={minuteStep}
              onChange={handleClockChange}
              onConfirm={handleClockConfirm}
              onCancel={handleClockCancel}
              disabled={disabled}
              clockContainerClassName={clockContainerClassName}
              clockDisplayClassName={clockDisplayClassName}
              clockDisplayHoursClassName={clockDisplayHoursClassName}
              clockDisplayMinutesClassName={clockDisplayMinutesClassName}
              clockDisplayActiveClassName={clockDisplayActiveClassName}
              clockDisplaySeparatorClassName={clockDisplaySeparatorClassName}
              clockFaceClassName={clockFaceClassName}
              clockHandClassName={clockHandClassName}
              clockHandLineClassName={clockHandLineClassName}
              clockHandDotClassName={clockHandDotClassName}
              clockNumberClassName={clockNumberClassName}
              clockNumberSelectedClassName={clockNumberSelectedClassName}
              clockNumberInnerClassName={clockNumberInnerClassName}
              clockCenterClassName={clockCenterClassName}
              clockActionsClassName={clockActionsClassName}
              clockCancelButtonClassName={clockCancelButtonClassName}
              clockOkButtonClassName={clockOkButtonClassName}
              clockPeriodToggleClassName={clockPeriodToggleClassName}
              clockPeriodButtonClassName={clockPeriodButtonClassName}
              clockPeriodActiveClassName={clockPeriodActiveClassName}
            />
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

TimePicker.displayName = "TimePicker";

export default TimePicker;
