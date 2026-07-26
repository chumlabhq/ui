import { forwardRef, createContext, useContext, useId, useMemo, useCallback } from "react";
import type {
  RadioButtonProps,
  RadioButtonClasses,
  RadioGroupProps,
  RadioGroupClasses,
  RadioButtonSize,
} from "./utils/types";
import type { FocusEvent } from "react";
import { useReducedMotion } from "../../utils/useReducedMotion";
import {
  SIZE_MAP,
  ICON_SIZE_MAP,
  DEFAULT_RADIO_CLASSES,
  UNSTYLED_RADIO_CLASSES,
  DEFAULT_RADIO_GROUP_CLASSES,
  UNSTYLED_RADIO_GROUP_CLASSES,
} from "./utils/constants";
import { useControllableState } from "../../utils/useControllableState";
import { cn } from "../../utils/cn";

// ─── Context ──────────────────────────────────────────────────────────────────

interface RadioGroupContextValue {
  name?: string;
  selectedValue: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  size?: RadioButtonSize;
  unstyled?: boolean;
  reduceMotion?: boolean;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error("RadioButton must be used within a RadioGroup.");
  }
  return ctx;
}

// ─── RadioGroup ───────────────────────────────────────────────────────────────

/**
 * Component: RadioGroup + RadioButton
 *
 * Purpose: Radio button group with labels, descriptions, custom icons, sizes, and validation.
 * Uses native <input type="radio"> for full browser keyboard support.
 *
 * Reference: RADIOBUTTON.ai.md (this directory), src/pages/demo/RadioButtonDemo.tsx
 */
const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      onFocus,
      onBlur,
      label,
      description,
      name,
      required = false,
      disabled = false,
      error = false,
      errorMessage,
      success = false,
      successMessage,
      loading = false,
      size = "md",
      orientation = "vertical",
      classes: classesProp,
      unstyled = false,
      reduceMotion,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const prefersReducedMotion = useReducedMotion(reduceMotion);

    const generatedId = useId();
    const groupId = rest.id || generatedId;
    const labelId = `${groupId}-label`;
    const descriptionId = `${groupId}-description`;
    const errorId = `${groupId}-error`;

    const [selectedValue, setSelectedValue] = useControllableState({
      value: controlledValue,
      defaultValue,
      onChange: onValueChange,
    });

    const handleSelect = useCallback(
      (value: string) => {
        if (!disabled) {
          setSelectedValue(value);
        }
      },
      [disabled, setSelectedValue],
    );

    // ─── Merged classes ─────────────────────────────────────────────────
    const baseClasses = unstyled ? UNSTYLED_RADIO_GROUP_CLASSES : DEFAULT_RADIO_GROUP_CLASSES;
    const mergedClasses: Required<RadioGroupClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        label: classesProp?.label ?? baseClasses.label,
        description: classesProp?.description ?? baseClasses.description,
        error: classesProp?.error ?? baseClasses.error,
        success: classesProp?.success ?? baseClasses.success,
      }),
      [classesProp, baseClasses],
    );

    // ─── Described by ───────────────────────────────────────────────────
    const describedBy = [
      description ? descriptionId : null,
      error && errorMessage ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const ctxValue = useMemo<RadioGroupContextValue>(
      () => ({
        name,
        selectedValue,
        onSelect: handleSelect,
        // A loading group disables its radios so they can't be operated by
        // keyboard mid-flight, not just visually dimmed.
        disabled: disabled || loading,
        error,
        size,
        unstyled,
        reduceMotion: prefersReducedMotion,
        onFocus,
        onBlur,
      }),
      [name, selectedValue, handleSelect, disabled, loading, error, size, unstyled, prefersReducedMotion, onFocus, onBlur],
    );

    return (
      <RadioGroupContext.Provider value={ctxValue}>
        <div
          ref={ref}
          role="radiogroup"
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={describedBy || undefined}
          aria-required={required || undefined}
          aria-invalid={error || undefined}
          className={cn(mergedClasses.root, className, loading && "opacity-50 pointer-events-none") || undefined}
          data-disabled={disabled || undefined}
          data-error={error || undefined}
          data-orientation={orientation}
          data-reduce-motion={prefersReducedMotion || undefined}
          data-loading={loading || undefined}
          data-success={success || undefined}
          {...rest}
        >
          {label && (
            <span id={labelId} className={mergedClasses.label || undefined}>
              {label}
              {required && <span aria-hidden="true"> *</span>}
            </span>
          )}

          {description && (
            <span id={descriptionId} className={mergedClasses.description || undefined}>
              {description}
            </span>
          )}

          <div className={cn(
            "flex",
            orientation === "horizontal" ? "flex-row flex-wrap gap-4" : "flex-col gap-2",
          ) || undefined}>
            {children}
          </div>

          {error && errorMessage && (
            <div id={errorId} role="alert" className={mergedClasses.error || undefined}>
              {errorMessage}
            </div>
          )}

          {success && successMessage && !error && (
            <div className={mergedClasses.success || undefined}>{successMessage}</div>
          )}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = "RadioGroup";

// ─── RadioButton ──────────────────────────────────────────────────────────────

const RadioButton = forwardRef<HTMLLabelElement, RadioButtonProps>(
  (
    {
      value,
      label,
      description,
      disabled: disabledProp = false,
      size: sizeProp,
      checkedIcon,
      uncheckedIcon,
      classes: classesProp,
      className,
      ...rest
    },
    ref,
  ) => {
    const ctx = useRadioGroupContext();

    const isDisabled = disabledProp || ctx.disabled;
    const isChecked = ctx.selectedValue === value;
    const size = sizeProp ?? ctx.size;
    const unstyled = ctx.unstyled;

    const generatedId = useId();
    const radioId = rest.id || generatedId;

    // ─── Merged classes ─────────────────────────────────────────────────
    const baseClasses = unstyled ? UNSTYLED_RADIO_CLASSES : DEFAULT_RADIO_CLASSES;
    const mergedClasses: Required<RadioButtonClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        label: classesProp?.label ?? baseClasses.label,
        description: classesProp?.description ?? baseClasses.description,
        radio: classesProp?.radio ?? baseClasses.radio,
        checked: classesProp?.checked ?? baseClasses.checked,
        unchecked: classesProp?.unchecked ?? baseClasses.unchecked,
        icon: classesProp?.icon ?? baseClasses.icon,
        error: classesProp?.error ?? baseClasses.error,
        success: classesProp?.success ?? baseClasses.success,
      }),
      [classesProp, baseClasses],
    );

    // ─── Size ───────────────────────────────────────────────────────────
    const { boxSize, iconSize } = useMemo(() => {
      if (size === undefined) {
        return { boxSize: undefined, iconSize: undefined };
      }
      if (typeof size === "number") {
        return { boxSize: size, iconSize: Math.round(size * 0.5) };
      }
      return { boxSize: SIZE_MAP[size], iconSize: ICON_SIZE_MAP[size] };
    }, [size]);

    const sizeStyle = useMemo(() => {
      if (!boxSize) return undefined;
      return { width: boxSize, height: boxSize };
    }, [boxSize]);

    // ─── State class ────────────────────────────────────────────────────
    const stateClassName = isChecked ? mergedClasses.checked : mergedClasses.unchecked;

    // ─── Handler ────────────────────────────────────────────────────────
    const handleChange = useCallback(() => {
      if (!isDisabled) {
        ctx.onSelect(value);
      }
    }, [isDisabled, ctx, value]);

    // ─── Icon ───────────────────────────────────────────────────────────
    const renderedIcon = useMemo(() => {
      if (isChecked) {
        return (
          checkedIcon || (
            <span
              className={mergedClasses.icon || undefined}
              style={{
                width: iconSize ?? 10,
                height: iconSize ?? 10,
                borderRadius: "50%",
                backgroundColor: "white",
                display: "block",
              }}
            />
          )
        );
      }
      return uncheckedIcon || null;
    }, [isChecked, checkedIcon, uncheckedIcon, mergedClasses.icon, iconSize]);

    return (
      <label
        ref={ref}
        htmlFor={radioId}
        className={cn(mergedClasses.root, className, !unstyled && isDisabled && "opacity-50") || undefined}
        style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
        data-checked={isChecked || undefined}
        data-disabled={isDisabled || undefined}
        data-value={value}
        {...rest}
      >
        <span
          className={cn(mergedClasses.radio, stateClassName, !unstyled && ctx.error && "border-cl-error dark:border-cl-error", "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-cl-accent dark:has-[:focus-visible]:ring-offset-cl-bg") || undefined}
          style={{ ...sizeStyle, position: "relative" }}
          data-checked={isChecked || undefined}
          data-disabled={isDisabled || undefined}
          data-error={ctx.error || undefined}
        >
          <input
            type="radio"
            id={radioId}
            name={ctx.name}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            onChange={handleChange}
            onFocus={ctx.onFocus}
            onBlur={ctx.onBlur}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              margin: 0,
              padding: 0,
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
          />
          {renderedIcon}
        </span>

        {(label || description) && (
          <span className="flex flex-col">
            {label && (
              <span className={mergedClasses.label || undefined}>{label}</span>
            )}
            {description && (
              <span className={mergedClasses.description || undefined}>{description}</span>
            )}
          </span>
        )}
      </label>
    );
  },
);

RadioButton.displayName = "RadioButton";

export default RadioGroup;
export { RadioButton };
