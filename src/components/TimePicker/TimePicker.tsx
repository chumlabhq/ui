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
import type { ReactNode, CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { TimePickerProps, TimePickerClasses, TimeValue, ClockFaceClasses } from "./utils/types";
import {
  DEFAULT_TIMEPICKER_CLASSES,
  UNSTYLED_TIMEPICKER_CLASSES,
} from "./utils/constants";
import { useTimePicker } from "./useTimePicker";
import { useControllableState } from "../../utils/useControllableState";
import { useReducedMotion } from "../../utils/useReducedMotion";
import { useStablePositionAfterOpen } from "../../utils/useStablePositionAfterOpen";
import { ChevronDownIcon, CheckIcon as CheckIconDefault, ClearIcon as ClearIconDefault } from "./icons";
import { ClockFace } from "./ClockFace";
import { formatTimeValue, parseTimeInput, getDefaultTimeValue, clampMinuteStep } from "./utils";
import { isBrowser } from "../../utils/isBrowser";

interface DropdownCoords {
  top: number;
  left: number;
  width: number;
  position: "top" | "bottom";
}

function computeDropdownCoords(
  triggerEl: HTMLElement,
  dropdownEl: HTMLElement,
  preferredPosition: "top" | "bottom",
  gap: number,
  forcePosition = false,
): DropdownCoords {
  const rect = triggerEl.getBoundingClientRect();
  const dropdownHeight = dropdownEl.getBoundingClientRect().height;
  const viewportHeight = isBrowser ? (window.visualViewport?.height ?? window.innerHeight) : 768;
  const viewportWidth = isBrowser ? (window.visualViewport?.width ?? window.innerWidth) : 1024;

  let position = preferredPosition;
  if (!forcePosition) {
    if (position === "bottom" && rect.bottom + gap + dropdownHeight > viewportHeight) {
      if (rect.top - gap - dropdownHeight > 0) {
        position = "top";
      }
    } else if (position === "top" && rect.top - gap - dropdownHeight < 0) {
      if (rect.bottom + gap + dropdownHeight <= viewportHeight) {
        position = "bottom";
      }
    }
  }

  const top = position === "top"
    ? rect.top - dropdownHeight - gap
    : rect.bottom + gap;

  let left = rect.left;
  const dropdownWidth = rect.width;
  if (left + dropdownWidth > viewportWidth) {
    left = Math.max(0, viewportWidth - dropdownWidth);
  }

  return { top, left, width: rect.width, position };
}

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
    optionSelected: string;
    optionFocused: string;
    selectedIcon: string;
  };
  showSelectedIcon: boolean;
  selectedIcon?: ReactNode;
  renderOptionContent?: (time: string, isSelected: boolean) => ReactNode;
  onSelect: (time: string) => void;
  onHover: (index: number) => void;
  optionTextClass: string;
}) {
  const combinedClassName = [
    classes.option,
    isSelected && classes.optionSelected,
    isFocused && classes.optionFocused,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-label={time}
      className={combinedClassName}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
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
 * A time input with dropdown list or analog clock variant. Supports 12/24-hour formats,
 * min/max constraints, smart parsing, clearable, portal-based positioning, and full keyboard navigation.
 *
 * AI Usage Guidelines:
 * - Use `<TimePicker />` for any time selection need
 * - Minimum: `value` + `onValueChange` for controlled, or no props for uncontrolled
 * - Use `variant="clock"` for analog clock face; default is dropdown list
 * - Use `forceDropdownPosition` to lock dropdown direction without auto-flipping
 *
 * Behavior:
 * - Dropdown: filterable list with keyboard navigation (Arrow, Enter, Escape)
 * - Clock: analog face with pointer/keyboard interaction, OK/Cancel to commit
 * - Portal-rendered dropdown with auto-flip positioning
 *
 * Reference:
 * - COMPONENT.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/TimePickerDemo.tsx — live demo
 */
const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
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
      variant = "dropdown",
      clearable = false,
      onClear,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      lockScroll = false,
      dropdownPosition = "bottom",
      forceDropdownPosition = false,
      dropdownZIndex = 50,
      dropdownGap = 4,
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
      okText,
      // Remaining HTML attributes (data-testid, aria-*, event handlers, etc.)
      ...restProps
    },
    ref,
  ) => {
    // ── Class merging (matches library pattern: classes ?? base) ────────
    const baseClasses = unstyled
      ? UNSTYLED_TIMEPICKER_CLASSES
      : DEFAULT_TIMEPICKER_CLASSES;

    const mergedClasses = useMemo<Required<TimePickerClasses>>(() => ({
      root: classesProp?.root ?? baseClasses.root,
      label: classesProp?.label ?? baseClasses.label,
      wrapper: classesProp?.wrapper ?? baseClasses.wrapper,
      trigger: classesProp?.trigger ?? baseClasses.trigger,
      input: classesProp?.input ?? baseClasses.input,
      endIcon: classesProp?.endIcon ?? baseClasses.endIcon,
      clearIcon: classesProp?.clearIcon ?? baseClasses.clearIcon,
      dropdown: classesProp?.dropdown ?? baseClasses.dropdown,
      optionList: classesProp?.optionList ?? baseClasses.optionList,
      option: classesProp?.option ?? baseClasses.option,
      optionSelected: classesProp?.optionSelected ?? baseClasses.optionSelected,
      optionFocused: classesProp?.optionFocused ?? baseClasses.optionFocused,
      selectedIcon: classesProp?.selectedIcon ?? baseClasses.selectedIcon,
      noResults: classesProp?.noResults ?? baseClasses.noResults,
      error: classesProp?.error ?? baseClasses.error,
      description: classesProp?.description ?? baseClasses.description,
      success: classesProp?.success ?? baseClasses.success,
      clockContainer: classesProp?.clockContainer ?? baseClasses.clockContainer,
      clockDisplay: classesProp?.clockDisplay ?? baseClasses.clockDisplay,
      clockDisplayHours: classesProp?.clockDisplayHours ?? baseClasses.clockDisplayHours,
      clockDisplayMinutes: classesProp?.clockDisplayMinutes ?? baseClasses.clockDisplayMinutes,
      clockDisplayActive: classesProp?.clockDisplayActive ?? baseClasses.clockDisplayActive,
      clockDisplaySeparator: classesProp?.clockDisplaySeparator ?? baseClasses.clockDisplaySeparator,
      clockFace: classesProp?.clockFace ?? baseClasses.clockFace,
      clockHand: classesProp?.clockHand ?? baseClasses.clockHand,
      clockHandLine: classesProp?.clockHandLine ?? baseClasses.clockHandLine,
      clockHandDot: classesProp?.clockHandDot ?? baseClasses.clockHandDot,
      clockNumber: classesProp?.clockNumber ?? baseClasses.clockNumber,
      clockNumberSelected: classesProp?.clockNumberSelected ?? baseClasses.clockNumberSelected,
      clockNumberInner: classesProp?.clockNumberInner ?? baseClasses.clockNumberInner,
      clockNumberDisabled: classesProp?.clockNumberDisabled ?? baseClasses.clockNumberDisabled,
      clockCenter: classesProp?.clockCenter ?? baseClasses.clockCenter,
      clockActions: classesProp?.clockActions ?? baseClasses.clockActions,
      clockCancelButton: classesProp?.clockCancelButton ?? baseClasses.clockCancelButton,
      clockOkButton: classesProp?.clockOkButton ?? baseClasses.clockOkButton,
      clockPeriodToggle: classesProp?.clockPeriodToggle ?? baseClasses.clockPeriodToggle,
      clockPeriodButton: classesProp?.clockPeriodButton ?? baseClasses.clockPeriodButton,
      clockPeriodActive: classesProp?.clockPeriodActive ?? baseClasses.clockPeriodActive,
    }), [classesProp, baseClasses]);

    // Clock classes sub-object
    const clockClasses = useMemo<Required<ClockFaceClasses>>(() => ({
      clockContainer: mergedClasses.clockContainer,
      clockDisplay: mergedClasses.clockDisplay,
      clockDisplayHours: mergedClasses.clockDisplayHours,
      clockDisplayMinutes: mergedClasses.clockDisplayMinutes,
      clockDisplayActive: mergedClasses.clockDisplayActive,
      clockDisplaySeparator: mergedClasses.clockDisplaySeparator,
      clockFace: mergedClasses.clockFace,
      clockHand: mergedClasses.clockHand,
      clockHandLine: mergedClasses.clockHandLine,
      clockHandDot: mergedClasses.clockHandDot,
      clockNumber: mergedClasses.clockNumber,
      clockNumberSelected: mergedClasses.clockNumberSelected,
      clockNumberInner: mergedClasses.clockNumberInner,
      clockNumberDisabled: mergedClasses.clockNumberDisabled,
      clockCenter: mergedClasses.clockCenter,
      clockActions: mergedClasses.clockActions,
      clockCancelButton: mergedClasses.clockCancelButton,
      clockOkButton: mergedClasses.clockOkButton,
      clockPeriodToggle: mergedClasses.clockPeriodToggle,
      clockPeriodButton: mergedClasses.clockPeriodButton,
      clockPeriodActive: mergedClasses.clockPeriodActive,
    }), [mergedClasses]);

    // Option classes sub-object for TimeOption
    const optionClasses = useMemo(() => ({
      option: mergedClasses.option,
      optionSelected: mergedClasses.optionSelected,
      optionFocused: mergedClasses.optionFocused,
      selectedIcon: mergedClasses.selectedIcon,
    }), [mergedClasses.option, mergedClasses.optionSelected, mergedClasses.optionFocused, mergedClasses.selectedIcon]);

    const prefersReducedMotion = useReducedMotion(reduceMotion);

    // Controllable value state (supports both controlled and uncontrolled)
    const [value, setValueState] = useControllableState<string | null>({
      value: valueProp,
      defaultValue: defaultValue ?? null,
    });

    const handleValueChange = useCallback(
      (time: string | null, timeValue: TimeValue | null) => {
        setValueState(time);
        onValueChange?.(time, timeValue);
      },
      [setValueState, onValueChange],
    );

    // Controllable open state
    const [isOpen, setIsOpen] = useControllableState<boolean>({
      value: openProp,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const generatedId = useId();
    const dropdownId = id || name || generatedId;
    const listboxId = `${dropdownId}-listbox`;
    const clockPopupId = `${dropdownId}-clock`;
    const triggerId = `${dropdownId}-trigger`;
    const errorId = `${dropdownId}-error`;
    const descriptionId = `${dropdownId}-description`;
    const successId = `${dropdownId}-success`;

    const describedByParts = [
      description ? descriptionId : null,
      error && errorMessage ? errorId : null,
      success && successMessage && !error ? successId : null,
    ].filter(Boolean);
    const describedBy = describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownContentRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
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

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
          if (isOpen && focusedIndex >= 0 && displayOptions[focusedIndex]) {
            event.preventDefault();
            handleOptionSelect(displayOptions[focusedIndex]);
            return;
          }
          hookHandleKeyDown(event);
          handleClose();
          return;
        case "Tab":
          hookHandleKeyDown(event);
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
            setFocusedIndex(0);
            return;
          }
          break;
      }

      hookHandleKeyDown(event);
    }, [disabled, isOpen, focusedIndex, displayOptions, hookHandleKeyDown, handleOptionSelect, handleClose, handleOpen, setFocusedIndex]);

    useEffect(() => {
      if (isOpen) {
        inputRef.current?.focus({ preventScroll: true });
      }
    }, [isOpen]);

    // Scroll focused option into view
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

    const handleInputBlur = () => {
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
          handleBlur();
          handleClose();
          onBlur?.();
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

    // ─── Portal dropdown positioning (matches Dropdown/DatePicker pattern) ──
    const triggerElRef = useRef<HTMLDivElement>(null);
    const [dropdownCoords, setDropdownCoords] = useState<DropdownCoords | null>(null);
    const isPositionStable = useStablePositionAfterOpen(isOpen);
    const rafIdRef = useRef<number | null>(null);

    const updateDropdownPosition = useCallback(() => {
      if (!triggerElRef.current || !dropdownContentRef.current) return;
      setDropdownCoords(
        computeDropdownCoords(triggerElRef.current, dropdownContentRef.current, dropdownPosition, dropdownGap, forceDropdownPosition),
      );
    }, [dropdownPosition, dropdownGap, forceDropdownPosition]);

    // Update position on open (double-RAF to ensure portal is painted)
    useEffect(() => {
      if (!isOpen || !isBrowser) return;
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = requestAnimationFrame(updateDropdownPosition);
      });
    }, [isOpen, updateDropdownPosition]);

    // Reposition on scroll/resize
    useEffect(() => {
      if (!isOpen || !isBrowser) return;
      const handleReposition = () => {
        if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(updateDropdownPosition);
      };
      window.addEventListener("scroll", handleReposition, true);
      window.addEventListener("resize", handleReposition);
      return () => {
        window.removeEventListener("scroll", handleReposition, true);
        window.removeEventListener("resize", handleReposition);
        if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      };
    }, [isOpen, updateDropdownPosition]);

    const portalDropdownStyle: CSSProperties = {
      position: "fixed",
      zIndex: dropdownZIndex,
      margin: 0,
      ...(dropdownCoords && isPositionStable
        ? {
            top: dropdownCoords.top,
            left: dropdownCoords.left,
            // Clock variant sizes itself; dropdown variant matches trigger width
            ...(variant === "dropdown" ? { width: dropdownCoords.width } : {}),
          }
        : { visibility: "hidden" as const, top: 0, left: 0 }),
      ...(!isOpen && keepMounted ? { display: "none" } : {}),
    };

    const portalTarget = (portalContainer ?? (isBrowser ? document.body : null));

    const shouldRenderDropdown = variant === "dropdown"
      ? (isOpen || keepMounted)
      : isOpen; // Clock variant always remounts to reset selectionMode

    const dropdownPortal = shouldRenderDropdown && portalTarget ? createPortal(
      variant === "dropdown" ? (
        <div
          ref={dropdownContentRef}
          id={listboxId}
          role="listbox"
          aria-label={typeof label === "string" ? label : "Time options"}
          className={mergedClasses.dropdown}
          style={portalDropdownStyle}
          data-position={dropdownCoords?.position ?? dropdownPosition}
        >
          <div className={mergedClasses.optionList}>
            {displayOptions.length === 0 ? (
              <div className={mergedClasses.noResults}>No matching times</div>
            ) : (
              displayOptions.map((time, index) => (
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
              ))
            )}
          </div>
        </div>
      ) : (
        <div
          ref={dropdownContentRef}
          id={clockPopupId}
          role="dialog"
          aria-modal="true"
          aria-label={typeof label === "string" ? label : "Select time"}
          style={portalDropdownStyle}
        >
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
            okText={okText}
          />
        </div>
      ),
      portalTarget,
    ) : null;

    const showClearButton = clearable && value && !disabled;

    return (
      <div
        ref={ref}
        {...restProps}
        className={[mergedClasses.root, className, fullWidth ? "w-full" : ""]
          .filter(Boolean)
          .join(" ")}
        style={style}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-open={isOpen || undefined}
        data-loading={loading || undefined}
        data-success={success || undefined}
      >
        {name ? (
          <input type="hidden" name={name} value={value ?? ""} readOnly tabIndex={-1} aria-hidden />
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
          className={[wrapperLayoutClass, mergedClasses.wrapper, loading ? "opacity-50 pointer-events-none" : ""].filter(Boolean).join(" ")}
        >
          <div
            ref={triggerElRef}
            onMouseDown={() => { isTriggerMouseDownRef.current = true; }}
            onClick={handleToggle}
            className={mergedClasses.trigger}
            style={fullWidth && !unstyled ? { width: "100%" } : undefined}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-open={isOpen || undefined}
          >
            <input
              ref={inputRef}
              id={triggerId}
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup={variant === "dropdown" ? "listbox" : "dialog"}
              aria-controls={
                isOpen
                  ? variant === "dropdown"
                    ? listboxId
                    : clockPopupId
                  : undefined
              }
              aria-activedescendant={
                variant === "dropdown" &&
                isOpen &&
                focusedIndex >= 0 &&
                displayOptions[focusedIndex]
                  ? `${dropdownId}-option-${focusedIndex}`
                  : undefined
              }
              aria-autocomplete={variant === "dropdown" ? "list" : "none"}
              aria-label={!label ? restProps["aria-label"] : undefined}
              aria-invalid={error || undefined}
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
                className={mergedClasses.clearIcon}
                onClick={handleClear}
                aria-label="Clear time"
                tabIndex={-1}
              >
                <ClearIconDefault className={mergedClasses.clearIcon ? "" : "w-4 h-4"} />
              </button>
            )}
            {showEndIcon &&
              (endIcon ? (
                <span className={mergedClasses.endIcon} aria-hidden>
                  {endIcon}
                </span>
              ) : (
                <ChevronDownIcon
                  className={[
                    mergedClasses.endIcon,
                    !prefersReducedMotion ? "transition-transform duration-200" : "",
                    !prefersReducedMotion && isOpen ? "rotate-180" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              ))}
          </div>

          {dropdownPortal}
        </div>

        {error && errorMessage && (
          <div id={errorId} role="alert" className={mergedClasses.error}>
            {errorMessage}
          </div>
        )}
        {success && successMessage && !error && (
          <div id={successId} className={mergedClasses.success || undefined}>{successMessage}</div>
        )}
      </div>
    );
  },
);

TimePicker.displayName = "TimePicker";

export default TimePicker;
