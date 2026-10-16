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
import { useLayer } from "../../utils/layers.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import type { TimePickerProps, TimePickerClasses, TimeValue, ClockFaceClasses } from "./utils/types.js";
import {
  DEFAULT_TIMEPICKER_CLASSES,
  UNSTYLED_TIMEPICKER_CLASSES,
} from "./utils/constants.js";
import { useTimePicker } from "./useTimePicker.js";
import { useControllableState } from "../../utils/useControllableState.js";
import { FormValue } from "../../utils/FormValue.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import { useAnchoredPosition } from "../../utils/useAnchoredPosition.js";
import { ChevronDownIcon, CheckIcon as CheckIconDefault, ClearIcon as ClearIconDefault } from "./icons.js";
import { useClockFace } from "./useClockFace.js";
import { formatTimeValue, parseTimeInput, getDefaultTimeValue, clampMinuteStep, isMinutesInRange, timeValueToMinutes } from "./utils.js";
import { isBrowser } from "../../utils/isBrowser.js";

import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";
import { motionSafeClasses } from "../../utils/classLayers.js";
import MenuSurface from "../../utils/menu/MenuSurface.js";

const TimeOption = memo(function TimeOption({
  time,
  isSelected,
  isFocused,
  dropdownId,
  index,
  classes,
  showSelectedIcon,
  selectedIcon,
  renderOptionContent,
  onSelect,
  onHover,
  optionTextClass,
}: {
  time: string;
  isSelected: boolean;
  isFocused: boolean;
  dropdownId: string;
  index: number;
  classes: {
    option: string;
    selectedIcon: string;
  };
  showSelectedIcon: boolean;
  selectedIcon?: ReactNode;
  renderOptionContent?: (time: string, isSelected: boolean) => ReactNode;
  onSelect: (time: string) => void;
  onHover: (index: number) => void;
  optionTextClass: string;
}) {
  const combinedClassName = [classes.option].filter(Boolean).join(" ");

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-label={time}
      className={combinedClassName}
      data-selected={isSelected || undefined}
      data-highlighted={isFocused || undefined}
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect(time);
      }}
      onMouseEnter={() => onHover(index)}
    >
      <span className={optionTextClass}>
        {renderOptionContent ? renderOptionContent(time, isSelected) : time}
      </span>
      {isSelected &&
        showSelectedIcon &&
        (selectedIcon || <CheckIconDefault className={classes.selectedIcon} />)}
    </div>
  );
});

/**
 * Component: TimePicker
 *
 * Purpose:
 * A time input with a dropdown list or an analog clock face. Supports 12/24-hour formats,
 * min/max constraints, smart parsing, clearable, portal-based positioning, and full keyboard navigation.
 *
 * AI Usage Guidelines:
 * - Use `<TimePicker />` for any time selection need
 * - Minimum: `value` + `onValueChange` for controlled, or no props for uncontrolled
 * - Use `mode="clock"` for an analog clock face; default is the dropdown list
 * - Use `forceDropdownSide` to lock dropdown direction without auto-flipping
 *
 * Behavior:
 * - Dropdown: filterable list with keyboard navigation (Arrow, Enter, Escape)
 * - Clock: analog face with pointer/keyboard interaction, OK/Cancel to commit
 * - Portal-rendered dropdown with auto-flip positioning
 *
 * Reference:
 * - TIMEPICKER.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/TimePickerDemo.tsx — live demo
 */
const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
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
      description,
      success,
      successMessage,
      loading,
      label,
      required = false,
      showEndIcon = true,
      endIcon,
      showSelectedIcon = true,
      selectedIcon,
      renderOptionContent,
      fullWidth = false,
      mode = "dropdown",
      clearable = true,
      onClear,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      lockScroll = false,
      dropdownSide = "bottom",
      forceDropdownSide = false,
      dropdownZIndex: dropdownZIndexProp,
      dropdownOffset = 4,
      keepMounted = false,
      portalContainer,
      classes: classesProp,
      unstyled = false,
      className,
      style,
      reduceMotion = "auto",
      onCancel,
      onConfirm,
      cancelText,
      confirmText,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
        ...restProps
    },
    ref,
  ) => {
    const dropdownZIndex = useLayer(dropdownZIndexProp);

    const prefersReducedMotionForClasses = useReducedMotion(reduceMotion);

    const baseClassesRaw = unstyled
      ? UNSTYLED_TIMEPICKER_CLASSES
      : DEFAULT_TIMEPICKER_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotionForClasses);

    const mergedClasses = useMemo<Required<TimePickerClasses>>(() => ({
      root: mergeSlot(baseClasses.root, classesProp?.root),
      label: mergeSlot(baseClasses.label, classesProp?.label),
      control: mergeSlot(baseClasses.control, classesProp?.control),
      trigger: mergeSlot(baseClasses.trigger, classesProp?.trigger),
      input: mergeSlot(baseClasses.input, classesProp?.input),
      icon: mergeSlot(baseClasses.icon, classesProp?.icon),
      clearTrigger: mergeSlot(baseClasses.clearTrigger, classesProp?.clearTrigger),
      content: mergeSlot(baseClasses.content, classesProp?.content),
      list: mergeSlot(baseClasses.list, classesProp?.list),
      item: mergeSlot(baseClasses.item, classesProp?.item),
      itemIndicator: mergeSlot(baseClasses.itemIndicator, classesProp?.itemIndicator),
      empty: mergeSlot(baseClasses.empty, classesProp?.empty),
      message: mergeSlot(baseClasses.message, classesProp?.message),
      description: mergeSlot(baseClasses.description, classesProp?.description),
      clockContent: mergeSlot(baseClasses.clockContent, classesProp?.clockContent),
      clockDisplay: mergeSlot(baseClasses.clockDisplay, classesProp?.clockDisplay),
      clockHours: mergeSlot(baseClasses.clockHours, classesProp?.clockHours),
      clockMinutes: mergeSlot(baseClasses.clockMinutes, classesProp?.clockMinutes),
      clockSeparator: mergeSlot(baseClasses.clockSeparator, classesProp?.clockSeparator),
      clockFace: mergeSlot(baseClasses.clockFace, classesProp?.clockFace),
      clockHand: mergeSlot(baseClasses.clockHand, classesProp?.clockHand),
      clockHandLine: mergeSlot(baseClasses.clockHandLine, classesProp?.clockHandLine),
      clockHandDot: mergeSlot(baseClasses.clockHandDot, classesProp?.clockHandDot),
      clockNumber: mergeSlot(baseClasses.clockNumber, classesProp?.clockNumber),
      clockCenter: mergeSlot(baseClasses.clockCenter, classesProp?.clockCenter),
      footer: mergeSlot(baseClasses.footer, classesProp?.footer),
      cancelTrigger: mergeSlot(baseClasses.cancelTrigger, classesProp?.cancelTrigger),
      confirmTrigger: mergeSlot(baseClasses.confirmTrigger, classesProp?.confirmTrigger),
      row: mergeSlot(baseClasses.row, classesProp?.row),
      periodTrigger: mergeSlot(baseClasses.periodTrigger, classesProp?.periodTrigger),
    }), [classesProp, baseClasses]);

    // Fetched at mount when the clock mode is asked for, and null until it
    // resolves — see `useClockFace`.
    const ClockFace = useClockFace(mode === "clock");

    const clockClasses = useMemo<Required<ClockFaceClasses>>(() => ({
      clockContent: mergedClasses.clockContent,
      clockDisplay: mergedClasses.clockDisplay,
      clockHours: mergedClasses.clockHours,
      clockMinutes: mergedClasses.clockMinutes,
      clockSeparator: mergedClasses.clockSeparator,
      clockFace: mergedClasses.clockFace,
      clockHand: mergedClasses.clockHand,
      clockHandLine: mergedClasses.clockHandLine,
      clockHandDot: mergedClasses.clockHandDot,
      clockNumber: mergedClasses.clockNumber,
      clockCenter: mergedClasses.clockCenter,
      footer: mergedClasses.footer,
      cancelTrigger: mergedClasses.cancelTrigger,
      confirmTrigger: mergedClasses.confirmTrigger,
      row: mergedClasses.row,
      periodTrigger: mergedClasses.periodTrigger,
    }), [mergedClasses]);

    const optionClasses = useMemo(() => ({
      option: mergedClasses.item,
      selectedIcon: mergedClasses.itemIndicator,
    }), [mergedClasses.item, mergedClasses.itemIndicator]);

    const prefersReducedMotion = useReducedMotion(reduceMotion);

    const [value, setValueState, resetValue] = useControllableState<string | null>({
      value: valueProp,
      defaultValue: defaultValue ?? null,
    });

    const [rangeError, setRangeError] = useState(false);
    const handleValueChange = useCallback(
      (time: string | null, timeValue: TimeValue | null) => {
        setRangeError(false);
        setValueState(time);
        onValueChange?.(time, timeValue);
      },
      [setValueState, onValueChange],
    );

    const [isOpen, setIsOpen] = useControllableState<boolean>({
      value: openProp,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const generatedId = useId();
    const dropdownId = id || name || generatedId;
    const listboxId = `${dropdownId}-listbox`;

    // The one combobox in the package that is an `<input>`, which is why the
    // axe sweep never faulted it: `button-name` does not apply, and the
    // placeholder is a name axe accepts and a screen reader announces as a
    // hint. ACCESSIBILITY.md records that gap; this is the warning it needed.
    useAccessibleNameWarning("TimePicker", {
      label,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    });
    const clockPopupId = `${dropdownId}-clock`;
    const triggerId = id ?? `${dropdownId}-trigger`;
    const errorId = `${dropdownId}-error`;
    const descriptionId = `${dropdownId}-description`;
    const successId = `${dropdownId}-success`;

    const describedByParts = [
      ariaDescribedBy,
      description ? descriptionId : null,
      error && errorMessage ? errorId : null,
      success && successMessage && !error ? successId : null,
    ].filter(Boolean);
    const describedBy = describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownContentRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedInputRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
    // Tracks whether a mousedown on the trigger is in progress so the
    // blur handler can skip its close — the click handler will handle it.
    const isTriggerMouseDownRef = useRef(false);

    const safeMinuteStep = clampMinuteStep(minuteStep);
    const optionTextClass = unstyled ? "" : "flex-1";
    const wrapperLayoutClass = unstyled ? "" : "relative";

    const defaultPlaceholder = format === "12h" ? "hh:mm AM/PM" : "hh:mm";

    const {
      inputValue,
      focusedIndex,
      displayOptions,
      setFocusedIndex,
      handleToggle: hookHandleToggle,
      handleClose: hookHandleClose,
      handleOpen: hookHandleOpen,
      handleInputChange: hookHandleInputChange,
      handleOptionSelect: hookHandleOptionSelect,
      handleKeyDown: hookHandleKeyDown,
      handleBlur,
    } = useTimePicker({
      value,
      format,
      minuteStep: safeMinuteStep,
      minTime,
      maxTime,
      disabled,
      onValueChange: handleValueChange,
    });

    const handleToggle = useCallback(() => {
      if (disabled) return;
      hookHandleToggle();
      isTriggerMouseDownRef.current = false;
      setIsOpen((prev: boolean) => !prev);
    }, [disabled, hookHandleToggle, setIsOpen]);

    const handleClose = useCallback(() => {
      hookHandleClose();
      setIsOpen(false);
    }, [hookHandleClose, setIsOpen]);

    const handleOpen = useCallback(() => {
      hookHandleOpen();
      setIsOpen(true);
    }, [hookHandleOpen, setIsOpen]);

    const handleInputChange = useCallback((newValue: string) => {
      setRangeError(false);
      hookHandleInputChange(newValue);
      if (!isOpen) {
        setIsOpen(true);
      }
    }, [hookHandleInputChange, isOpen, setIsOpen]);

    const handleOptionSelect = useCallback((time: string) => {
      hookHandleOptionSelect(time);
      handleClose();
    }, [hookHandleOptionSelect, handleClose]);

    const handleClear = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleValueChange(null, null);
      onClear?.();
      inputRef.current?.focus({ preventScroll: true });
    }, [handleValueChange, onClear]);

    const refuseOutOfRange = useCallback(() => {
      const typed = parseTimeInput(inputValue, format);
      const refused = !!typed && !isMinutesInRange(timeValueToMinutes(typed, format), format, minTime, maxTime);
      if (refused) setRangeError(true);
      return refused;
    }, [inputValue, format, minTime, maxTime]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
          if (isOpen && focusedIndex >= 0 && displayOptions[focusedIndex]) {
            event.preventDefault();
            handleOptionSelect(displayOptions[focusedIndex]);
            return;
          }
          if (refuseOutOfRange()) event.preventDefault();
          else hookHandleKeyDown(event);
          handleClose();
          return;
        case "Tab":
          if (!refuseOutOfRange()) hookHandleKeyDown(event);
          handleClose();
          return;
        case "Escape":
          if (isOpen) {
            event.preventDefault();
            handleClose();
          }
          return;
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            handleOpen();
            if (mode === "dropdown") setFocusedIndex(0);
            return;
          }
          break;
      }

      if (mode === "dropdown") hookHandleKeyDown(event);
    }, [disabled, isOpen, focusedIndex, displayOptions, hookHandleKeyDown, handleOptionSelect, handleClose, handleOpen, setFocusedIndex, refuseOutOfRange, mode]);

    useEffect(() => {
      if (isOpen) {
        inputRef.current?.focus({ preventScroll: true });
      }
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen || focusedIndex < 0 || !isBrowser) return;
      const optionEl = document.getElementById(`${dropdownId}-option-${focusedIndex}`);
      optionEl?.scrollIntoView({ block: "nearest" });
    }, [isOpen, focusedIndex, dropdownId]);

    useEffect(() => {
      if (!isOpen || !isBrowser) return;

      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (containerRef.current?.contains(target)) return;
        if (dropdownContentRef.current?.contains(target)) return;
        handleClose();
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [isOpen, handleClose]);

    useEffect(() => {
      if (!lockScroll || !isOpen || !isBrowser) return;

      const preventScroll = (e: Event) => {
        if (dropdownContentRef.current?.contains(e.target as Node)) return;
        if (containerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
      };

      const preventKeyScroll = (e: KeyboardEvent) => {
        if (containerRef.current?.contains(e.target as Node)) return;
        const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
        if (scrollKeys.includes(e.key) && (e.target === document.body || e.target === document.documentElement)) {
          e.preventDefault();
        }
      };

      window.addEventListener("wheel", preventScroll, { capture: true, passive: false });
      window.addEventListener("touchmove", preventScroll, { capture: true, passive: false });
      window.addEventListener("keydown", preventKeyScroll, { capture: true });

      return () => {
        window.removeEventListener("wheel", preventScroll, { capture: true } as EventListenerOptions);
        window.removeEventListener("touchmove", preventScroll, { capture: true } as EventListenerOptions);
        window.removeEventListener("keydown", preventKeyScroll, { capture: true } as EventListenerOptions);
      };
    }, [lockScroll, isOpen]);

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // If the blur was caused by clicking the trigger (chevron, etc.),
          // skip — the click handler's handleToggle will manage open state.
          if (isTriggerMouseDownRef.current) {
            isTriggerMouseDownRef.current = false;
            return;
          }
          const active = document.activeElement;
          if (containerRef.current?.contains(active)) return;
          if (dropdownContentRef.current?.contains(active)) return;
          if (!refuseOutOfRange()) handleBlur();
          handleClose();
          onBlur?.(event);
        });
      });
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
      const resolved = clockValue ?? getDefaultTimeValue(format);
      const formatted = formatTimeValue(resolved, format);
      handleValueChange(formatted, resolved);
      setLocalClockValue(null);
      handleClose();
      onConfirm?.();
    }, [clockValue, format, handleValueChange, handleClose, onConfirm]);

    const handleClockCancel = useCallback(() => {
      setLocalClockValue(null);
      handleClose();
      onCancel?.();
    }, [handleClose, onCancel]);

    const triggerElRef = useRef<HTMLDivElement>(null);
    const dropdownCoords = useAnchoredPosition(
      triggerElRef,
      dropdownContentRef,
      isOpen,
      { side: dropdownSide, gap: dropdownOffset, forceSide: forceDropdownSide },
    );

    const shouldRenderDropdown = mode === "dropdown"
      ? (isOpen || keepMounted)
      : isOpen; // Clock mode always remounts to reset selectionMode

    const dropdownPortal = shouldRenderDropdown ? (
      <MenuSurface
        ref={dropdownContentRef}
        trigger={triggerElRef}
        isOpen={isOpen}
        side={dropdownSide}
        forceSide={forceDropdownSide}
        gap={dropdownOffset}
        zIndex={dropdownZIndex}
        portalContainer={portalContainer}
        // Clock mode remounts on every open to reset its selection mode,
        // so `keepMounted` is the dropdown mode's alone.
        keepMounted={mode === "dropdown" ? keepMounted : false}
        matchTriggerWidth={mode === "dropdown"}
        {...(mode === "dropdown"
          ? {
              className: mergedClasses.content,
              "data-position": dropdownCoords?.side ?? dropdownSide,
            }
          : {
              id: clockPopupId,
              role: "dialog",
              "aria-label": typeof label === "string" ? label : "Select time",
            })}
      >
        {mode === "dropdown" ? (
          <>
            {/* Beside the listbox, not inside it: a listbox owns options, and
                "no matching times" is a status message. It had no role at all,
                so a filter that emptied the list said nothing to anyone. */}
            {displayOptions.length === 0 ? (
              <div role="status" className={mergedClasses.empty}>
                No matching times
              </div>
            ) : null}
            <div
              id={listboxId}
              role="listbox"
              aria-label={typeof label === "string" ? label : "Time options"}
              className={mergedClasses.list}
            >
              {displayOptions.map((time, index) => (
                <TimeOption
                  key={time}
                  time={time}
                  isSelected={time === inputValue}
                  isFocused={index === focusedIndex}
                  dropdownId={dropdownId}
                  index={index}
                  classes={optionClasses}
                  showSelectedIcon={showSelectedIcon}
                  selectedIcon={selectedIcon}
                  renderOptionContent={renderOptionContent}
                  onSelect={handleOptionSelect}
                  onHover={setFocusedIndex}
                  optionTextClass={optionTextClass}
                />
              ))}
            </div>
          </>
        ) : ClockFace ? (
          // Module-cached identity — see `useLazyComponent`.
          // eslint-disable-next-line react-hooks/static-components
          <ClockFace
            value={clockValue}
            format={format}
            minuteStep={safeMinuteStep}
            onValueChange={handleClockChange}
            onConfirm={handleClockConfirm}
            onCancel={handleClockCancel}
            disabled={disabled}
            classes={clockClasses}
            reduceMotion={prefersReducedMotion}
            minTime={minTime}
            maxTime={maxTime}
            cancelText={cancelText}
            confirmText={confirmText}
          />
        ) : null}
      </MenuSurface>
    ) : null;

    const showClearButton = clearable && value && !disabled;

    return (
      <div
        {...restProps}
        className={[mergedClasses.root, className, fullWidth ? "w-full" : ""]
          .filter(Boolean)
          .join(" ")}
        style={style}
        data-disabled={disabled || undefined}
        data-error={error || rangeError || undefined}
        data-open={isOpen || undefined}
        data-loading={loading || undefined}
        data-valid={(!error && success) || undefined}
      >
        {name ? (
          <FormValue
            entries={[[name, value ?? ""]]}
            required={required && !disabled}
            onReset={() => {
              if (resetValue()) setRangeError(false);
            }}
            focusTarget={inputRef}
          />
        ) : null}
        {label && (
          <label htmlFor={triggerId} className={mergedClasses.label}>
            {label}
            {required && <span aria-hidden="true">*</span>}
          </label>
        )}
        {description && (
          <div id={descriptionId} className={mergedClasses.description || undefined}>{description}</div>
        )}

        <div
          ref={containerRef}
          className={[wrapperLayoutClass, mergedClasses.control, loading ? "opacity-50 pointer-events-none" : ""].filter(Boolean).join(" ")}
        >
          <div
            ref={triggerElRef}
            onMouseDown={() => { isTriggerMouseDownRef.current = true; }}
            onClick={handleToggle}
            className={mergedClasses.trigger}
            style={fullWidth && !unstyled ? { width: "100%" } : undefined}
            data-disabled={disabled || undefined}
            data-error={error || rangeError || undefined}
            data-valid={(!error && success) || undefined}
            data-open={isOpen || undefined}
          >
            <input
              ref={mergedInputRef}
              id={triggerId}
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup={mode === "dropdown" ? "listbox" : "dialog"}
              aria-controls={
                isOpen
                  ? mode === "dropdown"
                    ? listboxId
                    : clockPopupId
                  : undefined
              }
              aria-activedescendant={
                mode === "dropdown" &&
                isOpen &&
                focusedIndex >= 0 &&
                displayOptions[focusedIndex]
                  ? `${dropdownId}-option-${focusedIndex}`
                  : undefined
              }
              aria-autocomplete={mode === "dropdown" ? "list" : "none"}
              aria-label={!label ? ariaLabel : undefined}
              aria-labelledby={ariaLabelledBy}
              aria-invalid={error || rangeError || undefined}
              aria-describedby={describedBy}
              aria-required={required || undefined}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              onClick={(e) => {
                e.stopPropagation();
                if (!isOpen && !disabled) {
                  handleOpen();
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pasted = e.clipboardData.getData("text");
                handleInputChange(pasted);
              }}
              placeholder={placeholder || defaultPlaceholder}
              disabled={disabled}
              className={mergedClasses.input}
              autoComplete="off"
            />
            {showClearButton && (
              <button
                type="button"
                className={mergedClasses.clearTrigger}
                onClick={handleClear}
                aria-label="Clear time"
                // SC 2.1.1: this was tabIndex={-1}, so clearing could only be done
                // with a pointer — and for a single select there is no other way
                // back to an empty value.
              >
                {/* The icon is sized unless the consumer styles the trigger. This read
                    `mergedClasses.clearTrigger`, whose library default is never empty, so
                    the icon was never sized and the button rendered 0×0: the ADR 002
                    codemod (a3354b7a) moved the test from the old, empty-by-default
                    `clearIcon` slot onto the button's. */}
                <ClearIconDefault className={classesProp?.clearTrigger ? "" : "w-4 h-4"} />
              </button>
            )}
            {showEndIcon &&
              (endIcon ? (
                <span className={mergedClasses.icon} aria-hidden>
                  {endIcon}
                </span>
              ) : (
                <ChevronDownIcon
                  className={cn(
                    mergedClasses.icon,
                    // The transition lives in the endIcon default; drop it here
                    // rather than re-adding it, so `classes.endIcon` and
                    // `unstyled` both reach it.
                    prefersReducedMotion && "transition-none",
                    !prefersReducedMotion && isOpen && "rotate-180",
                  )}
                />
              ))}
          </div>

          {dropdownPortal}
        </div>

        {error && errorMessage && (
          <div id={errorId} role="alert" data-invalid className={mergedClasses.message}>
            {errorMessage}
          </div>
        )}
        {success && successMessage && !error && (
          <div id={successId} role="status" data-valid className={mergedClasses.message || undefined}>{successMessage}</div>
        )}
      </div>
    );
  },
);

TimePicker.displayName = "TimePicker";

export default TimePicker;
