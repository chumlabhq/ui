import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  type ChangeEvent,
} from "react";
import type { InputProps, InputClasses } from "./utils/types.js";
import {
  DEFAULT_INPUT_CLASSES,
  UNSTYLED_INPUT_CLASSES,
  INPUT_SIZE_CLASSES,
  DEFAULT_INPUT_SIZE,
} from "./utils/constants.js";
import { FieldLabel } from "../../utils/FieldLabel.js";
import { FieldWrapper } from "../../utils/FieldWrapper.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { useControllableState } from "../../utils/useControllableState.js";
import { useFormReset } from "../../utils/FormValue.js";

import { motionSafeClasses, structuralOnly } from "../../utils/classLayers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
export const InputLabel = FieldLabel;

/**
 * Component: Input
 *
 * Purpose:
 * Production-grade text input with labels, icons, prefix/suffix, clearable,
 * character count, validation states, and full form integration.
 *
 * AI Usage Guidelines:
 * - Use `label` for accessible labeling (auto-linked via htmlFor)
 * - Use `onValueChange` for simple string callback
 * - Use `error` + `errorMessage` for validation feedback
 * - Use `startIcon`/`endIcon` with click handlers for interactive icons
 *
 * Reference:
 * - INPUT.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/InputDemo.tsx — live demo
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      id,
      name,
      type = "text",
      required = false,
      disabled = false,
      error = false,
      errorMessage,
      success = false,
      successMessage,
      size,
      prefix,
      suffix,
      startIcon,
      endIcon,
      onStartIconClick,
      onEndIconClick,
      startIconAriaLabel,
      endIconAriaLabel,
      onValueChange,
      onChange,
      clearable = false,
      onClear,
      showCount = false,
      loading = false,
      loader,
      loaderSize = 16,
      fullWidth = false,
      className,
      style,
      classes: classesProp,
      unstyled = false,
      readOnly,
      maxLength,
      value,
      defaultValue,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    useAccessibleNameWarning("Input", {
      label,
      "aria-label": (rest as Record<string, unknown>)["aria-label"],
      "aria-labelledby": (rest as Record<string, unknown>)["aria-labelledby"],
      title: (rest as Record<string, unknown>).title,
    });
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const descriptionId = `${inputId}-description`;
    const countId = `${inputId}-count`;
    const isDisabled = disabled;
    const isInteractive = !isDisabled && !readOnly && !loading;

    const [currentValue, setCurrentValue, resetValue] = useControllableState({
      value: value !== undefined ? String(value) : undefined,
      defaultValue: (defaultValue as string) ?? "",
      onChange: onValueChange,
      component: "Input",
    });

    const internalRef = useRef<HTMLInputElement | null>(null);
    const mergedRef = useMemo(() => mergeRefs(internalRef, ref), [ref]);
    useFormReset(internalRef, resetValue, rest.form);

    const ariaDescribedBy =
      [
        rest["aria-describedby"],
        description ? descriptionId : null,
        error && errorMessage ? errorId : null,
        !error && success && successMessage ? successId : null,
        showCount && maxLength != null ? countId : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const prefersReducedMotion = useReducedMotion();
    const baseClassesRaw = unstyled ? UNSTYLED_INPUT_CLASSES : DEFAULT_INPUT_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);
    // Resolved even when `size` is absent, so an unset prop paints `md` — the
    // field as it was. `data-size` still reports what the consumer asked for
    // rather than what was rendered.
    const sizeClassesRaw = INPUT_SIZE_CLASSES[size ?? DEFAULT_INPUT_SIZE];
    const sizeClasses = unstyled ? structuralOnly(sizeClassesRaw) : sizeClassesRaw;
    const mergedClasses: Required<InputClasses> = useMemo(
      () => ({
        root: mergeSlot(baseClasses.root, classesProp?.root),
        // Size ahead of the consumer's classes and in the same merge groups, so
        // `px-5` loses to their `px-8` instead of sitting beside it.
        control: mergeSlot(cn(baseClasses.control, sizeClasses.control), classesProp?.control),
        label: mergeSlot(baseClasses.label, classesProp?.label),
        description: mergeSlot(baseClasses.description, classesProp?.description),
        input: mergeSlot(cn(baseClasses.input, sizeClasses.input), classesProp?.input),
        prefix: mergeSlot(cn(baseClasses.prefix, sizeClasses.prefix), classesProp?.prefix),
        suffix: mergeSlot(cn(baseClasses.suffix, sizeClasses.suffix), classesProp?.suffix),
        message: mergeSlot(baseClasses.message, classesProp?.message),
        count: mergeSlot(baseClasses.count, classesProp?.count),
      }),
      [classesProp, baseClasses, sizeClasses],
    );

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setCurrentValue(e.target.value);
        onChange?.(e);
      },
      [onChange, setCurrentValue],
    );

    const handleClear = useCallback(() => {
      if (onClear) {
        onClear();
        return;
      }

      const input = internalRef.current;
      if (!input) return;

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeInputValueSetter?.call(input, "");

      setCurrentValue("");

      // Construct a synthetic-shaped Event whose target/currentTarget are
      // the real input element and forward it to onChange. The native
      // dispatch path (dispatchEvent → React's synthetic event system) is
      // unreliable for controlled inputs in jsdom because React's internal
      // `_valueTracker` reconciles input.value back to the controlled
      // prop value before our onChange listener observes it; this manual
      // construction is the contract our tests verify.
      const event = new Event("change", { bubbles: true });
      Object.defineProperty(event, "target", {
        writable: false,
        value: input,
      });
      Object.defineProperty(event, "currentTarget", {
        writable: false,
        value: input,
      });
      onChange?.(event as unknown as ChangeEvent<HTMLInputElement>);
    }, [onClear, onChange, setCurrentValue]);

    return (
      <FieldWrapper
        fieldId={inputId}
        label={label}
        description={description}
        required={required}
        disabled={disabled}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        success={success}
        successMessage={successMessage}
        prefix={prefix}
        suffix={suffix}
        startIcon={startIcon}
        endIcon={endIcon}
        onStartIconClick={onStartIconClick}
        onEndIconClick={onEndIconClick}
        startIconAriaLabel={startIconAriaLabel}
        endIconAriaLabel={endIconAriaLabel}
        clearable={clearable && isInteractive}
        onClearClick={handleClear}
        clearLabel="Clear input"
        showCount={showCount}
        currentLength={currentValue.length}
        maxLength={maxLength}
        countId={countId}
        loader={loader}
        loaderSize={loaderSize}
        fullWidth={fullWidth}
        className={cn(mergedClasses.root, fullWidth && "w-full", className)}
        style={style}
        wrapperClassName={mergedClasses.control}
        labelClassName={mergedClasses.label}
        errorClassName={mergedClasses.message}
        successClassName={mergedClasses.message}
        descriptionClassName={mergedClasses.description}
        prefixClassName={mergedClasses.prefix}
        suffixClassName={mergedClasses.suffix}
        countClassName={mergedClasses.count}
        wrapperAlign="items-center"
        data-size={size || undefined}
        data-readonly={readOnly || undefined}
      >
        <input
          {...rest}
          ref={mergedRef}
          id={inputId}
          name={name}
          type={type}
          required={required}
          disabled={isDisabled || loading}
          readOnly={readOnly}
          maxLength={maxLength}
          data-slot="input"
          className={cn(mergedClasses.input)}
          aria-invalid={error || undefined}
          aria-describedby={ariaDescribedBy}
          aria-required={required || undefined}
          aria-busy={loading || undefined}
          data-disabled={isDisabled || undefined}
          data-error={error || undefined}
          data-valid={(!error && success) || undefined}
          data-readonly={readOnly || undefined}
          onChange={handleChange}
          value={currentValue}
        />
      </FieldWrapper>
    );
  },
);

Input.displayName = "Input";

export default Input;
