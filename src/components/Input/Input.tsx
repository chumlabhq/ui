import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import type { InputProps } from "./utils/types";
import { FieldLabel } from "../../utils/FieldLabel";
import { FieldWrapper } from "../../utils/FieldWrapper";
import { cn } from "../../utils/cn";

export const InputLabel = FieldLabel;

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
      wrapperClassName,
      labelClassName,
      errorClassName,
      successClassName,
      descriptionClassName,
      inputClassName,
      prefixClassName,
      suffixClassName,
      countClassName,
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
    const isDisabled = disabled || loading;
    const isInteractive = !isDisabled && !readOnly;

    // Controlled vs uncontrolled detection
    const isControlled = value !== undefined;

    // Track whether the component started as controlled — warn on switch
    const wasControlledRef = useRef(isControlled);

    // Track internal value for clearable/showCount in uncontrolled mode
    const [internalValue, setInternalValue] = useState(
      () => (defaultValue as string) ?? "",
    );

    // Internal ref — merged with consumer's forwarded ref via callback
    const internalRef = useRef<HTMLInputElement | null>(null);

    // Ref merge callback: assigns to both internal ref and consumer ref
    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            node;
        }
      },
      [ref],
    );

    const currentValue = isControlled ? String(value) : internalValue;

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

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInternalValue(e.target.value);
        }
        onChange?.(e);
        onValueChange?.(e.target.value);
      },
      [onChange, onValueChange, isControlled],
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

      // Update internal state for uncontrolled
      if (!isControlled) {
        setInternalValue("");
      }

      // Construct a proper event with the real input element as target
      // so e.target.name, e.target.type, e.preventDefault() etc. all work
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
      onValueChange?.("");
    }, [onClear, onChange, onValueChange, isControlled]);

    // Dev warnings — in useEffect to avoid double-firing in StrictMode
    useEffect(() => {
      if (process.env.NODE_ENV !== "production") {
        // Controlled/uncontrolled transition warning
        if (wasControlledRef.current && !isControlled) {
          console.warn(
            "Input: switched from controlled to uncontrolled. This is likely a bug. " +
              "Decide between using a controlled or uncontrolled Input for its lifetime.",
          );
        }
        if (!wasControlledRef.current && isControlled) {
          console.warn(
            "Input: switched from uncontrolled to controlled. This is likely a bug. " +
              "Decide between using a controlled or uncontrolled Input for its lifetime.",
          );
        }
        wasControlledRef.current = isControlled;

        if (onStartIconClick && !startIconLabel) {
          console.warn(
            "Input: onStartIconClick is provided without startIconLabel. Add startIconLabel for accessibility.",
          );
        }
        if (onEndIconClick && !endIconLabel) {
          console.warn(
            "Input: onEndIconClick is provided without endIconLabel. Add endIconLabel for accessibility.",
          );
        }
        if (!label && !rest["aria-label"] && !rest["aria-labelledby"]) {
          console.warn(
            "Input: No accessible name provided. Add a `label`, `aria-label`, or `aria-labelledby` prop for accessibility.",
          );
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      isControlled,
      label,
      onStartIconClick,
      startIconLabel,
      onEndIconClick,
      endIconLabel,
    ]);

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
        className={className}
        wrapperClassName={wrapperClassName}
        labelClassName={labelClassName}
        errorClassName={errorClassName}
        successClassName={successClassName}
        descriptionClassName={descriptionClassName}
        prefixClassName={prefixClassName}
        suffixClassName={suffixClassName}
        countClassName={countClassName}
        wrapperAlign="items-center"
        data-size={size || undefined}
        data-readonly={readOnly || undefined}
      >
        <input
          {...rest}
          ref={setRef}
          id={inputId}
          name={name}
          type={type}
          required={required}
          disabled={isDisabled}
          readOnly={readOnly}
          maxLength={maxLength}
          data-slot="input"
          className={cn("flex-1 min-w-0", inputClassName)}
          aria-invalid={error || undefined}
          aria-describedby={ariaDescribedBy}
          aria-errormessage={error && errorMessage ? errorId : undefined}
          aria-required={required || undefined}
          data-disabled={isDisabled || undefined}
          data-error={error || undefined}
          data-success={(!error && success) || undefined}
          data-readonly={readOnly || undefined}
          onChange={handleChange}
          value={isControlled ? value : internalValue}
        />
      </FieldWrapper>
    );
  },
);

Input.displayName = "Input";

export default Input;
