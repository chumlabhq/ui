import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  type ChangeEvent,
} from "react";
import type { TextAreaProps, TextAreaClasses } from "./utils/types";
import { DEFAULT_TEXTAREA_CLASSES, UNSTYLED_TEXTAREA_CLASSES } from "./utils/constants";
import { FieldLabel } from "../../utils/FieldLabel";
import { FieldWrapper } from "../../utils/FieldWrapper";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../utils/useControllableState";

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
      classes: classesProp,
      unstyled = false,
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

    // ─── Merged classes ─────────────────────────────────────────────────
    const baseClasses = unstyled ? UNSTYLED_TEXTAREA_CLASSES : DEFAULT_TEXTAREA_CLASSES;
    const mergedClasses: Required<TextAreaClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        wrapper: classesProp?.wrapper ?? baseClasses.wrapper,
        label: classesProp?.label ?? baseClasses.label,
        description: classesProp?.description ?? baseClasses.description,
        textarea: classesProp?.textarea ?? baseClasses.textarea,
        error: classesProp?.error ?? baseClasses.error,
        success: classesProp?.success ?? baseClasses.success,
        count: classesProp?.count ?? baseClasses.count,
      }),
      [classesProp, baseClasses],
    );

    // Controlled/uncontrolled state via shared hook
    const [currentValue, setCurrentValue] = useControllableState({
      value: value !== undefined ? String(value) : undefined,
      defaultValue: (defaultValue as string) ?? "",
      onChange: onValueChange,
    });

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

      const textarea = internalRef.current;
      if (!textarea) return;

      // Set native value to empty via the prototype setter
      const nativeValueSetter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value",
      )?.set;
      nativeValueSetter?.call(textarea, "");

      setCurrentValue("");

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
    }, [onClear, onChange, setCurrentValue]);

    // Extract aria values for stable effect deps (rest is a new object each render)
    const ariaLabel = rest["aria-label"];
    const ariaLabelledBy = rest["aria-labelledby"];

    // Dev warnings — in useEffect to avoid double-firing in StrictMode
    useEffect(() => {
      if (process.env.NODE_ENV !== "production") {
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
        if (!label && !ariaLabel && !ariaLabelledBy) {
          console.warn(
            "TextArea: No accessible name provided. Add a `label`, `aria-label`, or `aria-labelledby` prop for accessibility.",
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
        className={cn(mergedClasses.root, fullWidth && "w-full", className)}
        wrapperClassName={mergedClasses.wrapper}
        labelClassName={mergedClasses.label}
        errorClassName={mergedClasses.error}
        successClassName={mergedClasses.success}
        descriptionClassName={mergedClasses.description}
        countClassName={mergedClasses.count}
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
          className={cn("flex-1 min-w-0", mergedClasses.textarea)}
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

TextArea.displayName = "TextArea";

export default TextArea;
