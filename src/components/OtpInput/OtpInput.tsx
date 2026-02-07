import React, {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useImperativeHandle,
  useMemo,
} from "react";
import type {
  OtpInputProps,
  OtpInputLabelProps,
  OtpInputRenderProps,
} from "./types";
import { cn } from "../../utils/cn";

export const OtpInputLabel = ({
  label,
  required = false,
  inputId,
  className,
}: OtpInputLabelProps) => {
  return (
    <label htmlFor={inputId} className={className}>
      {label}
      {required && <span aria-hidden="true">*</span>}
    </label>
  );
};

const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(
  (
    {
      length = 6,
      value = "",
      onChange,
      onComplete,
      label,
      required = false,
      error = false,
      errorMessage,
      disabled = false,
      groups,
      separator,
      allowPaste = true,
      autoFocusFirst = false,
      inputType = "text",
      inputPattern = "\\d*",
      containerClassName,
      wrapperClassName,
      groupClassName,
      inputClassName,
      inputFocusClassName,
      labelClassName,
      errorClassName,
      separatorClassName,
      inputClassNames,
      fullWidth = false,
      renderInput,
      id,
      name,
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;
    const errorId = `${inputId}-error`;

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const lastCompletedRef = useRef<string>("");

    useImperativeHandle(ref, () => inputRefs.current[0] as HTMLInputElement);

    const valueArray = useMemo(() => {
      const arr = value.split("").slice(0, length);
      while (arr.length < length) {
        arr.push("");
      }
      return arr;
    }, [value, length]);

    const focusInput = useCallback(
      (index: number) => {
        if (index >= 0 && index < length) {
          inputRefs.current[index]?.focus();
        }
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
        const char = inputValue.slice(0, 1);
        const newValueArray = [...valueArray];
        newValueArray[index] = char;
        const newValue = newValueArray.join("");

        onChange?.(newValue);

        if (char && index < length - 1) {
          focusInput(index + 1);
        }

        if (newValueArray.every((c) => c !== "")) {
          handleComplete(newValue);
        }
      },
      [valueArray, onChange, handleComplete, length, focusInput],
    );

    const handleKeyDown = useCallback(
      (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        const { key } = e;

        if (key === "Backspace") {
          e.preventDefault();
          const target = e.target as HTMLInputElement;
          const currentInputValue = target.value;
          const newValueArray = [...valueArray];

          if (currentInputValue) {
            newValueArray[index] = "";
            onChange?.(newValueArray.join(""));
            if (index > 0) {
              focusInput(index - 1);
            }
          } else if (index > 0) {
            newValueArray[index - 1] = "";
            onChange?.(newValueArray.join(""));
            focusInput(index - 1);
          }
          return;
        }

        if (key === "Delete") {
          e.preventDefault();
          const newValueArray = [...valueArray];
          newValueArray[index] = "";
          onChange?.(newValueArray.join(""));
          return;
        }

        if (key === "ArrowLeft") {
          e.preventDefault();
          focusInput(index - 1);
          return;
        }

        if (key === "ArrowRight") {
          e.preventDefault();
          focusInput(index + 1);
          return;
        }

        if (key === "Home") {
          e.preventDefault();
          focusInput(0);
          return;
        }

        if (key === "End") {
          e.preventDefault();
          focusInput(length - 1);
          return;
        }
      },
      [valueArray, onChange, focusInput, length],
    );

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLDivElement>) => {
        if (!allowPaste) return;

        const pastedData = e.clipboardData.getData("text").trim();
        if (!pastedData) return;

        e.preventDefault();

        const chars = pastedData.slice(0, length).split("");
        const newValueArray = [...valueArray];

        chars.forEach((char, i) => {
          newValueArray[i] = char;
        });

        const newValue = newValueArray.join("");
        onChange?.(newValue);

        const lastFilledIndex = Math.min(chars.length, length) - 1;
        focusInput(lastFilledIndex);

        if (chars.length >= length) {
          handleComplete(newValue);
        }
      },
      [allowPaste, valueArray, onChange, handleComplete, length, focusInput],
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
      },
      [],
    );

    const createInputProps = useCallback(
      (index: number) => {
        const individualClassName = inputClassNames?.[index] || "";

        return {
          ref: (el: HTMLInputElement | null) => {
            inputRefs.current[index] = el;
          },
          id: index === 0 ? inputId : undefined,
          type: inputType,
          inputMode: "numeric" as const,
          pattern: inputPattern,
          autoComplete: index === 0 ? "one-time-code" : "off",
          "aria-label": `Digit ${index + 1} of ${length}`,
          "aria-invalid": error || undefined,
          "aria-required": required || undefined,
          "aria-describedby": error && errorMessage ? errorId : undefined,
          value: valueArray[index],
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(index, e.target.value),
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
            handleKeyDown(index, e),
          onFocus: handleFocus,
          disabled,
          maxLength: 1,
          className: cn(inputClassName, inputFocusClassName, individualClassName),
          "data-index": index,
          "data-disabled": disabled || undefined,
          "data-error": error || undefined,
          "data-filled": valueArray[index] ? true : undefined,
          autoFocus: autoFocusFirst && index === 0,
        };
      },
      [
        inputClassNames,
        inputId,
        inputType,
        inputPattern,
        length,
        error,
        required,
        errorMessage,
        errorId,
        valueArray,
        handleChange,
        handleKeyDown,
        handleFocus,
        disabled,
        inputClassName,
        inputFocusClassName,
        autoFocusFirst,
      ],
    );

    const renderSingleInput = (index: number) => {
      const inputProps = createInputProps(index);

      if (renderInput) {
        const renderProps: OtpInputRenderProps = {
          index,
          value: valueArray[index],
          disabled,
          error,
          filled: !!valueArray[index],
          inputProps,
        };
        return (
          <React.Fragment key={index}>
            {renderInput(renderProps)}
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
            <div
              key={`group-${groupIndex}`}
              className={groupClassName}
              data-group={groupIndex}
            >
              {groupInputs}
            </div>,
          );

          if (groupIndex < groups.length - 1 && separator) {
            groupElements.push(
              <span
                key={`separator-${groupIndex}`}
                className={separatorClassName}
              >
                {separator}
              </span>,
            );
          }
        });

        return groupElements;
      }

      return valueArray.map((_, index) => renderSingleInput(index));
    };

    return (
      <div
        className={cn(containerClassName, fullWidth && "w-full") || undefined}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
      >
        {label && (
          <OtpInputLabel
            label={label}
            required={required}
            inputId={inputId}
            className={labelClassName}
          />
        )}

        <div
          className={wrapperClassName}
          onPaste={handlePaste}
          role="group"
          aria-label="One-time password input"
          aria-roledescription="One-time password input"
        >
          {renderInputs()}
        </div>

        {error && errorMessage && (
          <div id={errorId} role="alert" className={errorClassName}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

OtpInput.displayName = "OtpInput";

export default OtpInput;
