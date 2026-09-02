import React, {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useMemo,
} from "react";
import type { OtpInputProps, OtpInputClasses } from "./utils/types";
import { DEFAULT_OTPINPUT_CLASSES, UNSTYLED_OTPINPUT_CLASSES } from "./utils/constants";
import { OtpInputLabel } from "./components/OtpInputLabel";
import { cn } from "../../utils/scopedCn";
import { mergeRefs } from "../../utils/mergeRefs";
import { useControllableState } from "../../utils/useControllableState";

import { motionSafeClasses } from "../../utils/classLayers";
import { useReducedMotion } from "../../utils/useReducedMotion";
export { OtpInputLabel };

/**
 * Component: OtpInput
 *
 * Purpose: One-time password input with per-character fields, paste support, and validation.
 *
 * AI Usage Guidelines:
 * - Use `length` to set number of digits (default 6)
 * - Use `inputPattern` for the accepted character set (default `"\\d*"`)
 * - Use `groups` for visual grouping (e.g., [3,3])
 * - Use `inputType="password"` for password-style dots
 *
 * Reference: OTPINPUT.ai.md (this directory), src/pages/demo/OtpInputDemo.tsx
 */
const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(
  (
    {
      length = 6,
      value: controlledValue,
      defaultValue,
      onValueChange,
      onComplete,
      label,
      description,
      required = false,
      error = false,
      errorMessage,
      success = false,
      successMessage,
      loading = false,
      disabled = false,
      groups,
      separator,
      allowPaste = true,
      autoFocusFirst = false,
      inputType = "text",
      inputPattern = "\\d*",
      inputClassNames,
      fullWidth = false,
      renderInput,
      validate,
      inputAriaLabel,
      groupAriaLabel = "One-time password input",
      classes: classesProp,
      unstyled = false,
      id,
      name,
      className,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    const [value, setValue] = useControllableState({
      value: controlledValue,
      defaultValue: defaultValue ?? "",
      onChange: onValueChange,
    });

    const fireChange = setValue;

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const lastCompletedRef = useRef<string>("");

    const mergedRef = useMemo(
      () =>
        mergeRefs(ref, (node: HTMLInputElement | null) => {
          inputRefs.current[0] = node;
        }),
      [ref],
    );

    React.useEffect(() => {
      if (autoFocusFirst && inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, [autoFocusFirst]);

    // ─── Merged classes ─────────────────────────────────────────────────
    const prefersReducedMotion = useReducedMotion();
    const baseClassesRaw = unstyled ? UNSTYLED_OTPINPUT_CLASSES : DEFAULT_OTPINPUT_CLASSES;
    // Motion is decorative under ADR 001, so `unstyled` has already removed it;
    // this handles the other reason to stop animating. Applied to the defaults
    // only — a class string the consumer supplied is theirs to control.
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);
    const mergedClasses: Required<OtpInputClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        wrapper: classesProp?.wrapper ?? baseClasses.wrapper,
        group: classesProp?.group ?? baseClasses.group,
        input: classesProp?.input ?? baseClasses.input,
        inputFocused: classesProp?.inputFocused ?? baseClasses.inputFocused,
        label: classesProp?.label ?? baseClasses.label,
        error: classesProp?.error ?? baseClasses.error,
        separator: classesProp?.separator ?? baseClasses.separator,
        description: classesProp?.description ?? baseClasses.description,
        success: classesProp?.success ?? baseClasses.success,
      }),
      [classesProp, baseClasses],
    );

    /**
     * `inputPattern` is the single source for what a slot accepts.
     *
     * It already set the `pattern` attribute, chose `inputMode` and named the
     * slots "Digit" or "Character" — but nothing filtered, because `pattern` is
     * form-validation metadata the browser does not apply to typing. A default
     * OtpInput therefore told the browser, the soft keyboard and the screen
     * reader that it wanted digits, and then accepted letters (E2E-TRIAGE.md).
     * Deriving `validate` from the same pattern makes the four agree.
     *
     * The pattern is a whole-value regex by HTML's definition, so it is
     * anchored and tested one character at a time.
     */
    const patternTest = useMemo(() => {
      if (!inputPattern) return null;
      try {
        const re = new RegExp(`^(?:${inputPattern})$`);
        return (char: string) => re.test(char);
      } catch {
        // An unparseable pattern still reaches the DOM attribute, where the
        // browser ignores it. Filtering on it would reject every keystroke.
        return null;
      }
    }, [inputPattern]);

    /** An explicit `validate` wins; otherwise the pattern is the rule. */
    const acceptsChar = validate ?? patternTest ?? undefined;

    /**
     * Asked of the resolved pattern rather than compared against the literal
     * `"\\d*"`, so `[0-9]` and `\\d` are recognised as numeric too.
     */
    const digitsOnly = useMemo(
      () =>
        inputType === "tel" ||
        (!!patternTest &&
          "0123456789".split("").every(patternTest) &&
          !patternTest("a")),
      [inputType, patternTest],
    );

    const valueArray = useMemo(() => {
      const arr = value.split("").slice(0, length);
      while (arr.length < length) arr.push("");
      return arr;
    }, [value, length]);

    const prevValueRef = useRef(value);
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      if (value.length < length) lastCompletedRef.current = "";
    }

    const focusInput = useCallback(
      (index: number) => {
        if (index >= 0 && index < length) inputRefs.current[index]?.focus();
      },
      [length],
    );

    const handleComplete = useCallback(
      (newValue: string) => {
        if (lastCompletedRef.current !== newValue) {
          lastCompletedRef.current = newValue;
          onComplete?.(newValue);
        }
      },
      [onComplete],
    );

    const handleChange = useCallback(
      (index: number, inputValue: string) => {
        if (inputValue.length > 1) {
          const newValueArray = [...valueArray];
          let filledCount = 0;
          for (const char of inputValue) {
            if (filledCount >= length) break;
            if (acceptsChar && !acceptsChar(char)) continue;
            newValueArray[filledCount] = char;
            filledCount++;
          }
          const newValue = newValueArray.join("");
          fireChange(newValue);
          if (filledCount > 0) focusInput(Math.min(filledCount - 1, length - 1));
          if (newValueArray.every((c) => c !== "")) handleComplete(newValue);
          return;
        }

        const char = inputValue.slice(0, 1);
        if (char && acceptsChar && !acceptsChar(char)) return;
        const newValueArray = [...valueArray];
        newValueArray[index] = char;
        const newValue = newValueArray.join("");
        fireChange(newValue);
        if (char && index < length - 1) focusInput(index + 1);
        if (newValueArray.every((c) => c !== "")) handleComplete(newValue);
      },
      [valueArray, fireChange, handleComplete, length, focusInput, acceptsChar],
    );

    const handleKeyDown = useCallback(
      (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        const { key } = e;
        if (key === "Backspace") {
          e.preventDefault();
          const currentInputValue = (e.target as HTMLInputElement).value;
          const newValueArray = [...valueArray];
          if (currentInputValue) {
            newValueArray[index] = "";
            fireChange(newValueArray.join(""));
            if (index > 0) focusInput(index - 1);
          } else if (index > 0) {
            newValueArray[index - 1] = "";
            fireChange(newValueArray.join(""));
            focusInput(index - 1);
          }
          return;
        }
        if (key === "Delete") { e.preventDefault(); const arr = [...valueArray]; arr[index] = ""; fireChange(arr.join("")); return; }
        if (key === "ArrowLeft") { e.preventDefault(); focusInput(index - 1); return; }
        if (key === "ArrowRight") { e.preventDefault(); focusInput(index + 1); return; }
        if (key === "Home") { e.preventDefault(); focusInput(0); return; }
        if (key === "End") { e.preventDefault(); focusInput(length - 1); return; }
      },
      [valueArray, fireChange, focusInput, length],
    );

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLDivElement>) => {
        if (!allowPaste) return;
        const pastedData = e.clipboardData.getData("text").trim();
        if (!pastedData) return;
        e.preventDefault();
        const newValueArray = [...valueArray];
        let filledCount = 0;
        for (const char of pastedData) {
          if (filledCount >= length) break;
          if (acceptsChar && !acceptsChar(char)) continue;
          newValueArray[filledCount] = char;
          filledCount++;
        }
        const newValue = newValueArray.join("");
        fireChange(newValue);
        focusInput(Math.max(0, filledCount - 1));
        if (newValueArray.every((c) => c !== "")) handleComplete(newValue);
      },
      [allowPaste, valueArray, fireChange, handleComplete, length, focusInput, acceptsChar],
    );

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => { e.target.select(); }, []);

    const createInputProps = useCallback(
      (index: number) => {
        const individualClassName = inputClassNames?.[index] || "";
        const resolvedInputMode = digitsOnly ? ("numeric" as const) : ("text" as const);

        return {
          ref:
            index === 0
              ? mergedRef
              : (el: HTMLInputElement | null) => {
                  inputRefs.current[index] = el;
                },
          id: index === 0 ? inputId : undefined,
          type: inputType,
          inputMode: resolvedInputMode,
          pattern: inputPattern,
          autoComplete: index === 0 ? "one-time-code" : "off",
          "aria-label": inputAriaLabel
            ? inputAriaLabel(index, length)
            : `${digitsOnly ? "Digit" : "Character"} ${index + 1} of ${length}`,
          "aria-invalid": error || undefined,
          "aria-required": required || undefined,
          "aria-describedby": error && errorMessage ? errorId : undefined,
          value: valueArray[index],
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value),
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e),
          onFocus: handleFocus,
          onPaste: allowPaste ? undefined : (e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault(),
          disabled: disabled || loading,
          maxLength: 1,
          className: cn(mergedClasses.input, mergedClasses.inputFocused, individualClassName),
          "data-index": index,
          "data-disabled": disabled || undefined,
          "data-error": error || undefined,
          "data-filled": valueArray[index] ? true : undefined,
        };
      },
      [inputClassNames, inputId, inputType, inputPattern, digitsOnly, length, error, required, errorMessage, errorId, valueArray, handleChange, handleKeyDown, handleFocus, disabled, loading, mergedClasses, inputAriaLabel, allowPaste, mergedRef],
    );

    const renderSingleInput = (index: number) => {
      const inputProps = createInputProps(index);
      if (renderInput) {
        return (
          <React.Fragment key={index}>
            {renderInput({ index, value: valueArray[index], disabled, error, filled: !!valueArray[index], inputProps })}
          </React.Fragment>
        );
      }
      return <input key={index} {...inputProps} />;
    };

    const renderInputs = () => {
      if (groups && groups.length > 0) {
        let currentIndex = 0;
        const groupElements: React.ReactNode[] = [];
        groups.forEach((groupSize, groupIndex) => {
          const groupInputs: React.ReactNode[] = [];
          for (let i = 0; i < groupSize && currentIndex < length; i++) {
            groupInputs.push(renderSingleInput(currentIndex));
            currentIndex++;
          }
          groupElements.push(
            <div key={`group-${groupIndex}`} className={mergedClasses.group || undefined} data-group={groupIndex}>{groupInputs}</div>,
          );
          if (groupIndex < groups.length - 1 && separator) {
            groupElements.push(<span key={`sep-${groupIndex}`} className={mergedClasses.separator || undefined}>{separator}</span>);
          }
        });
        return groupElements;
      }
      return valueArray.map((_, index) => renderSingleInput(index));
    };

    return (
      <div
        className={cn(mergedClasses.root, fullWidth && "w-full", className) || undefined}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-loading={loading || undefined}
        data-valid={success || undefined}
        {...rest}
      >
        {label && (
          <OtpInputLabel label={label} required={required} htmlFor={inputId} className={mergedClasses.label || undefined} />
        )}
        {description && (
          <div className={mergedClasses.description || undefined}>{description}</div>
        )}
        <div
          className={cn(mergedClasses.wrapper, loading && "opacity-50 pointer-events-none") || undefined}
          onPaste={handlePaste}
          role="group"
          aria-label={groupAriaLabel}
        >
          {renderInputs()}
        </div>
        {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
        {error && errorMessage && (
          <div id={errorId} role="alert" data-invalid className={mergedClasses.error || undefined}>{errorMessage}</div>
        )}
        {success && successMessage && !error && (
          <div data-valid className={mergedClasses.success || undefined}>{successMessage}</div>
        )}
      </div>
    );
  },
);

OtpInput.displayName = "OtpInput";

export default OtpInput;
