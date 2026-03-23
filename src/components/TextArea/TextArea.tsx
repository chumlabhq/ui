import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import type { TextAreaProps } from "./utils/types";
import { FieldLabel } from "../../utils/FieldLabel";
import { FieldWrapper } from "../../utils/FieldWrapper";
import { cn } from "../../utils/cn";

export const TextAreaLabel = FieldLabel;

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      description,
      id,
      name,
      required = false,
      disabled = false,
      error = false,
      errorMessage,
      success = false,
      successMessage,
      size,
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
      textAreaClassName,
      countClassName,
      readOnly,
      maxLength,
      value,
      defaultValue,
      rows = 4,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const textAreaId = id || generatedId;
    const errorId = `${textAreaId}-error`;
    const successId = `${textAreaId}-success`;
    const descriptionId = `${textAreaId}-description`;
    const countId = `${textAreaId}-count`;
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
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const setRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
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
      (e: ChangeEvent<HTMLTextAreaElement>) => {
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

      const textarea = internalRef.current;
      if (!textarea) return;

      // Set native value to empty via the prototype setter
      const nativeValueSetter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value",
      )?.set;
      nativeValueSetter?.call(textarea, "");

      if (!isControlled) {
        setInternalValue("");
      }

      // Construct a proper event with the real textarea element as target
      const event = new Event("change", { bubbles: true });
      Object.defineProperty(event, "target", {
        writable: false,
        value: textarea,
      });
      Object.defineProperty(event, "currentTarget", {
        writable: false,
        value: textarea,
      });

      onChange?.(event as unknown as ChangeEvent<HTMLTextAreaElement>);
      onValueChange?.("");
    }, [onClear, onChange, onValueChange, isControlled]);

    // Dev warnings — in useEffect to avoid double-firing in StrictMode
    useEffect(() => {
      if (process.env.NODE_ENV !== "production") {
        if (wasControlledRef.current && !isControlled) {
          console.warn(
            "TextArea: switched from controlled to uncontrolled. This is likely a bug. " +
              "Decide between using a controlled or uncontrolled TextArea for its lifetime.",
          );
        }
        if (!wasControlledRef.current && isControlled) {
          console.warn(
            "TextArea: switched from uncontrolled to controlled. This is likely a bug. " +
              "Decide between using a controlled or uncontrolled TextArea for its lifetime.",
          );
        }
        wasControlledRef.current = isControlled;

        if (onStartIconClick && !startIconLabel) {
          console.warn(
            "TextArea: onStartIconClick is provided without startIconLabel. Add startIconLabel for accessibility.",
          );
        }
        if (onEndIconClick && !endIconLabel) {
          console.warn(
            "TextArea: onEndIconClick is provided without endIconLabel. Add endIconLabel for accessibility.",
          );
        }
        if (!label && !rest["aria-label"] && !rest["aria-labelledby"]) {
          console.warn(
            "TextArea: No accessible name provided. Add a `label`, `aria-label`, or `aria-labelledby` prop for accessibility.",
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
        fieldId={textAreaId}
        label={label}
        description={description}
        required={required}
        disabled={disabled}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        success={success}
        successMessage={successMessage}
        startIcon={startIcon}
        endIcon={endIcon}
        onStartIconClick={onStartIconClick}
        onEndIconClick={onEndIconClick}
        startIconLabel={startIconLabel}
        endIconLabel={endIconLabel}
        clearable={clearable && isInteractive}
        onClearClick={handleClear}
        clearLabel="Clear textarea"
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
        countClassName={countClassName}
        wrapperAlign="items-start"
        data-size={size || undefined}
        data-readonly={readOnly || undefined}
      >
        <textarea
          {...rest}
          ref={setRef}
          id={textAreaId}
          name={name}
          required={required}
          disabled={isDisabled}
          readOnly={readOnly}
          maxLength={maxLength}
          rows={rows}
          data-slot="textarea"
          className={cn("flex-1 min-w-0", textAreaClassName)}
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

TextArea.displayName = "TextArea";

export default TextArea;
