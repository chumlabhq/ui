import {
  forwardRef,
  useCallback,
  useEffect,
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
import { useControllableState } from "../../utils/useControllableState";

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
    const isDisabled = disabled || loading;
    const isInteractive = !isDisabled && !readOnly;

    // Controlled/uncontrolled state via shared hook
    // (hook handles transition warnings internally)
    const [currentValue, setCurrentValue] = useControllableState({
      value: value !== undefined ? String(value) : undefined,
      defaultValue: (defaultValue as string) ?? "",
      onChange: onValueChange,
    });

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
    }, [onClear, onChange, setCurrentValue]);

    // Extract aria values for stable effect deps (rest is a new object each render)
    const ariaLabel = rest["aria-label"];
    const ariaLabelledBy = rest["aria-labelledby"];

    // Dev warnings — in useEffect to avoid double-firing in StrictMode
    useEffect(() => {
      if (process.env.NODE_ENV !== "production") {
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
        if (!label && !ariaLabel && !ariaLabelledBy) {
          console.warn(
            "Input: No accessible name provided. Add a `label`, `aria-label`, or `aria-labelledby` prop for accessibility.",
          );
        }
      }
    }, [
      label,
      ariaLabel,
      ariaLabelledBy,
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
          ref={setRef}
          id={inputId}
          name={name}
          type={type}
          required={required}
          disabled={isDisabled}
          readOnly={readOnly}
          maxLength={maxLength}
          data-slot="input"
          className={cn("flex-1 min-w-0", mergedClasses.input)}
          aria-invalid={error || undefined}
          aria-describedby={ariaDescribedBy}
          aria-errormessage={error && errorMessage ? errorId : undefined}
          aria-required={required || undefined}
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
