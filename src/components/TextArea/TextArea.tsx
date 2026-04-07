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
import { mergeRefs } from "../../utils/mergeRefs";
import { useControllableState } from "../../utils/useControllableState";

export const TextAreaLabel = FieldLabel;

/**
 * Component: TextArea
 *
 * Purpose:
 * Multi-line text input with auto-resize, character count, validation states,
 * icons, clearable, and full form integration.
 *
 * AI Usage Guidelines:
 * - Use `label` for accessible labeling
 * - Use `autoResize` for content-growing textarea
 * - Use `showCount` + `maxLength` for character limits
 * - Use `onValueChange` for simple string callback
 *
 * Reference:
 * - TEXTAREA.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/TextAreaDemo.tsx — live demo
 */
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
      autoResize = false,
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
    const isDisabled = disabled;
    const isInteractive = !isDisabled && !readOnly && !loading;

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

    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const mergedRef = useMemo(() => mergeRefs(internalRef, ref), [ref]);

    // ─── Auto-resize ─────────────────────────────────────────────────
    const adjustHeight = useCallback(() => {
      const el = internalRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    useEffect(() => {
      adjustHeight();
    }, [currentValue, adjustHeight]);

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
        data-auto-resize={autoResize || undefined}
      >
        <textarea
          {...rest}
          ref={mergedRef}
          id={textAreaId}
          name={name}
          required={required}
          disabled={isDisabled || loading}
          readOnly={readOnly}
          maxLength={maxLength}
          rows={rows}
          data-slot="textarea"
          className={cn("flex-1 min-w-0", mergedClasses.textarea)}
          style={autoResize ? { overflow: "hidden", resize: "none" } : undefined}
          aria-invalid={error || undefined}
          aria-describedby={ariaDescribedBy}
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
