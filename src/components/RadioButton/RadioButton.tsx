import { forwardRef, createContext, useContext, useId, useMemo, useCallback } from "react";
import type {
  RadioButtonProps,
  RadioButtonClasses,
  RadioGroupProps,
  RadioGroupClasses,
  RadioButtonSize,
} from "./utils/types.js";
import type { FocusEvent } from "react";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import {
  SIZE_MAP,
  ICON_SIZE_MAP,
  DEFAULT_RADIO_CLASSES,
  UNSTYLED_RADIO_CLASSES,
  DEFAULT_RADIO_GROUP_CLASSES,
  UNSTYLED_RADIO_GROUP_CLASSES,
} from "./utils/constants.js";
import { useControllableState } from "../../utils/useControllableState.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";

import { motionSafeClasses } from "../../utils/classLayers.js";

interface RadioGroupContextValue {
  name?: string;
  selectedValue: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  /** `success` without `error`: the one validity state an item paints. */
  valid?: boolean;
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
      reduceMotion = "auto",
      children,
      className,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const prefersReducedMotion = useReducedMotion(reduceMotion);

    const generatedId = useId();
    const groupId = rest.id || generatedId;
    const labelId = `${groupId}-label`;

    // `radiogroup` takes no name from the radios inside it, so a group without
    // `label` is announced as "group" and nothing else. The library cannot
    // supply the name; it can say that one is missing.
    useAccessibleNameWarning("RadioGroup", {
      label,
      // Read off `rest` rather than destructured: both attributes are spread
      // onto the group element and neither has its own prop.
      "aria-label": (rest as Record<string, unknown>)["aria-label"],
      "aria-labelledby": (rest as Record<string, unknown>)["aria-labelledby"],
    });
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

    const baseClassesRaw = unstyled ? UNSTYLED_RADIO_GROUP_CLASSES : DEFAULT_RADIO_GROUP_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);
    const mergedClasses: Required<RadioGroupClasses> = useMemo(
      () => ({
        root: mergeSlot(baseClasses.root, classesProp?.root),
        label: mergeSlot(baseClasses.label, classesProp?.label),
        description: mergeSlot(baseClasses.description, classesProp?.description),
        message: mergeSlot(baseClasses.message, classesProp?.message),
      }),
      [classesProp, baseClasses],
    );

    const describedBy = [
      ariaDescribedBy,
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
        valid: !error && success,
        size,
        unstyled,
        reduceMotion: prefersReducedMotion,
        onFocus,
        onBlur,
      }),
      [name, selectedValue, handleSelect, disabled, loading, error, success, size, unstyled, prefersReducedMotion, onFocus, onBlur],
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
          className={cn(mergedClasses.root, className) || undefined}
          data-disabled={disabled || undefined}
          data-error={error || undefined}
          data-orientation={orientation}
          data-reduce-motion={prefersReducedMotion || undefined}
          data-loading={loading || undefined}
          data-valid={(!error && success) || undefined}
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
            <div id={errorId} role="alert" data-invalid className={mergedClasses.message || undefined}>
              {errorMessage}
            </div>
          )}

          {success && successMessage && !error && (
            <div role="status" data-valid className={mergedClasses.message || undefined}>{successMessage}</div>
          )}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = "RadioGroup";

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
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
      id: idProp,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
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
    const radioId = idProp || generatedId;

    const baseClassesRaw = unstyled ? UNSTYLED_RADIO_CLASSES : DEFAULT_RADIO_CLASSES;
    const baseClasses = motionSafeClasses(
      baseClassesRaw,
      // The group already resolved prop-vs-query into `ctx.reduceMotion`; the
      // classes read that rather than the query on its own.
      ctx.reduceMotion === true,
    );
    const mergedClasses: Required<RadioButtonClasses> = useMemo(
      () => ({
        root: mergeSlot(baseClasses.root, classesProp?.root),
        label: mergeSlot(baseClasses.label, classesProp?.label),
        description: mergeSlot(baseClasses.description, classesProp?.description),
        control: mergeSlot(baseClasses.control, classesProp?.control),
        itemIndicator: mergeSlot(baseClasses.itemIndicator, classesProp?.itemIndicator),
      }),
      [classesProp, baseClasses],
    );

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

    const stateClassName = undefined;

    const handleChange = useCallback(() => {
      if (!isDisabled) {
        ctx.onSelect(value);
      }
    }, [isDisabled, ctx, value]);

    const renderedIcon = useMemo(() => {
      if (isChecked) {
        return (
          checkedIcon || (
            <span
              className={mergedClasses.itemIndicator || undefined}
              style={{
                width: iconSize ?? 10,
                height: iconSize ?? 10,
                borderRadius: "50%",
                // `--cl-text`, not `white`. The dot is white in both themes and
                // the control it sits in is transparent, so a selected radio
                // showed an empty ring on a light background — invisible, and
                // written as an inline style where no class-based gate could
                // see it. The token matches the ring the checked control draws.
                backgroundColor: "var(--cl-text)",
                display: "block",
              }}
            />
          )
        );
      }
      return uncheckedIcon || null;
    }, [isChecked, checkedIcon, uncheckedIcon, mergedClasses.itemIndicator, iconSize]);

    return (
      <label
        htmlFor={radioId}
        className={cn(mergedClasses.root, className) || undefined}
        style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
        data-checked={isChecked || undefined}
        data-state={isChecked ? "checked" : "unchecked"}
        data-disabled={isDisabled || undefined}
        data-value={value}
        {...rest}
      >
        <span
          className={cn(mergedClasses.control, stateClassName) || undefined}
          style={{ ...sizeStyle, position: "relative" }}
          data-checked={isChecked || undefined}
          data-state={isChecked ? "checked" : "unchecked"}
          data-disabled={isDisabled || undefined}
          data-error={ctx.error || undefined}
          data-valid={ctx.valid || undefined}
        >
          <input
            ref={ref}
            type="radio"
            id={radioId}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
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
