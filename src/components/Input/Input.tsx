import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  type ChangeEvent,
} from "react";
import type { InputProps, InputClasses } from "./utils/types";
import { DEFAULT_INPUT_CLASSES, UNSTYLED_INPUT_CLASSES } from "./utils/constants";
import { FieldLabel } from "../../utils/FieldLabel";
import { FieldWrapper } from "../../utils/FieldWrapper";
import { cn } from "../../utils/cn";
import { mergeRefs } from "../../utils/mergeRefs";
import { useControllableState } from "../../utils/useControllableState";

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
      startIconLabel,
      endIconLabel,
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
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const descriptionId = `${inputId}-description`;
    const countId = `${inputId}-count`;
    const isDisabled = disabled;
    const isInteractive = !isDisabled && !readOnly && !loading;

    const [currentValue, setCurrentValue] = useControllableState({
      value: value !== undefined ? String(value) : undefined,
      defaultValue: (defaultValue as string) ?? "",
      onChange: onValueChange,
    });

    const internalRef = useRef<HTMLInputElement | null>(null);
    const mergedRef = useMemo(() => mergeRefs(internalRef, ref), [ref]);

    // Build aria-describedby from description + error/success/count IDs
    const ariaDescribedBy =
      [
        description ? descriptionId : null,
        error && errorMessage ? errorId : null,
        !error && success && successMessage ? successId : null,
        showCount && maxLength != null ? countId : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    // ─── Merged classes ─────────────────────────────────────────────────
    const baseClasses = unstyled ? UNSTYLED_INPUT_CLASSES : DEFAULT_INPUT_CLASSES;
    const mergedClasses: Required<InputClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        wrapper: classesProp?.wrapper ?? baseClasses.wrapper,
        label: classesProp?.label ?? baseClasses.label,
        description: classesProp?.description ?? baseClasses.description,
        input: classesProp?.input ?? baseClasses.input,
        prefix: classesProp?.prefix ?? baseClasses.prefix,
        suffix: classesProp?.suffix ?? baseClasses.suffix,
        error: classesProp?.error ?? baseClasses.error,
        success: classesProp?.success ?? baseClasses.success,
        count: classesProp?.count ?? baseClasses.count,
      }),
      [classesProp, baseClasses],
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

      // Set native input value to empty via the prototype setter
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeInputValueSetter?.call(input, "");

      // Update state via controllable hook
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
        startIconLabel={startIconLabel}
        endIconLabel={endIconLabel}
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
        wrapperClassName={mergedClasses.wrapper}
        labelClassName={mergedClasses.label}
        errorClassName={mergedClasses.error}
        successClassName={mergedClasses.success}
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
          className={cn("flex-1 min-w-0", mergedClasses.input)}
          aria-invalid={error || undefined}
          aria-describedby={ariaDescribedBy}
          aria-required={required || undefined}
          aria-busy={loading || undefined}
          data-disabled={isDisabled || undefined}
          data-error={error || undefined}
          data-success={(!error && success) || undefined}
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
