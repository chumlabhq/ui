import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  type ChangeEvent,
} from "react";
import type { TextAreaProps, TextAreaClasses } from "./utils/types.js";
import {
  DEFAULT_TEXTAREA_CLASSES,
  UNSTYLED_TEXTAREA_CLASSES,
  TEXTAREA_SIZE_CLASSES,
  DEFAULT_TEXTAREA_SIZE,
} from "./utils/constants.js";
import { FieldLabel } from "../../utils/FieldLabel.js";
import { FieldWrapper } from "../../utils/FieldWrapper.js";
import { cn } from "../../utils/scopedCn.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { useControllableState } from "../../utils/useControllableState.js";

import { motionSafeClasses, structuralOnly } from "../../utils/classLayers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
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

    useAccessibleNameWarning("TextArea", {
      label,
      "aria-label": (rest as Record<string, unknown>)["aria-label"],
      "aria-labelledby": (rest as Record<string, unknown>)["aria-labelledby"],
      title: (rest as Record<string, unknown>).title,
    });
    const errorId = `${textAreaId}-error`;
    const successId = `${textAreaId}-success`;
    const descriptionId = `${textAreaId}-description`;
    const countId = `${textAreaId}-count`;
    const isDisabled = disabled;
    const isInteractive = !isDisabled && !readOnly && !loading;

    const prefersReducedMotion = useReducedMotion();
    const baseClassesRaw = unstyled ? UNSTYLED_TEXTAREA_CLASSES : DEFAULT_TEXTAREA_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);
    // Resolved even when `size` is absent, so an unset prop paints `md` — the
    // field as it was. `data-size` still reports what the consumer asked for
    // rather than what was rendered.
    const sizeClassesRaw = TEXTAREA_SIZE_CLASSES[size ?? DEFAULT_TEXTAREA_SIZE];
    const sizeClasses = unstyled ? structuralOnly(sizeClassesRaw) : sizeClassesRaw;
    const mergedClasses: Required<TextAreaClasses> = useMemo(
      () => ({
        root: cn(baseClasses.root, classesProp?.root),
        // Size ahead of the consumer's classes and in the same merge groups, so
        // `px-5` loses to their `px-8` instead of sitting beside it.
        control: cn(baseClasses.control, sizeClasses.control, classesProp?.control),
        label: cn(baseClasses.label, classesProp?.label),
        description: cn(baseClasses.description, classesProp?.description),
        input: cn(baseClasses.input, sizeClasses.input, classesProp?.input),
        message: cn(baseClasses.message, classesProp?.message),
        count: cn(baseClasses.count, classesProp?.count),
      }),
      [classesProp, baseClasses, sizeClasses],
    );

    const [currentValue, setCurrentValue] = useControllableState({
      value: value !== undefined ? String(value) : undefined,
      defaultValue: (defaultValue as string) ?? "",
      onChange: onValueChange,
      component: "TextArea",
    });

    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const mergedRef = useMemo(() => mergeRefs(internalRef, ref), [ref]);

    const adjustHeight = useCallback(() => {
      const el = internalRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    useEffect(() => {
      adjustHeight();
    }, [currentValue, adjustHeight]);

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

      const nativeValueSetter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value",
      )?.set;
      nativeValueSetter?.call(textarea, "");

      setCurrentValue("");

      // Construct a synthetic-shaped Event whose target/currentTarget are
      // the real textarea element and forward it to onChange. See the
      // matching comment in Input/Input.tsx — the native dispatch path is
      // unreliable for controlled fields in jsdom because React's
      // internal `_valueTracker` reconciles textarea.value back to the
      // controlled prop value before our onChange listener observes it.
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
        wrapperClassName={mergedClasses.control}
        labelClassName={mergedClasses.label}
        errorClassName={mergedClasses.message}
        successClassName={mergedClasses.message}
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
          className={cn(mergedClasses.input)}
          style={autoResize ? { overflow: "hidden", resize: "none" } : undefined}
          aria-invalid={error || undefined}
          aria-describedby={ariaDescribedBy}
          aria-required={required || undefined}
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

TextArea.displayName = "TextArea";

export default TextArea;
