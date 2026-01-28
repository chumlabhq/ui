import { forwardRef, useCallback, useId, useRef, useImperativeHandle } from "react";
import type { OtpInputProps, OtpInputLabelProps } from "./types";

export const OtpInputLabel = ({
  label,
  required = false,
  inputId,
  className = "",
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
      autoFocusFirst = true,
      inputType = "text",
      containerClassName = "",
      wrapperClassName = "",
      groupClassName = "",
      inputClassName = "",
      focusClassName = "",
      labelClassName = "",
      errorClassName = "",
      separatorClassName = "",
      inputClassNames = [],
      fullWidth = false,
      id,
      name,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;
    const errorId = `${inputId}-error`;

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useImperativeHandle(ref, () => inputRefs.current[0] as HTMLInputElement);

    const valueArray = value.split("").slice(0, length);
    while (valueArray.length < length) {
      valueArray.push("");
    }

    const focusInput = useCallback((index: number) => {
      if (index >= 0 && index < length) {
        inputRefs.current[index]?.focus();
      }
    }, [length]);

    const handleChange = useCallback(
      (index: number, inputValue: string) => {
        const digit = inputValue.replace(/\D/g, "").slice(0, 1);
        const newValueArray = [...valueArray];
        newValueArray[index] = digit;
        const newValue = newValueArray.join("");

        onChange?.(newValue);

        if (digit && index < length - 1) {
          focusInput(index + 1);
        }

        if (newValue.length === length && !newValue.includes("")) {
          const completeValue = newValueArray.join("");
          if (completeValue.length === length) {
            onComplete?.(completeValue);
          }
        }
      },
      [valueArray, onChange, onComplete, length, focusInput]
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
      },
      [valueArray, onChange, focusInput]
    );

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLDivElement>) => {
        if (!allowPaste) return;

        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
        if (!pastedData) return;

        e.preventDefault();

        const digits = pastedData.slice(0, length).split("");
        const newValueArray = [...valueArray];

        digits.forEach((digit, i) => {
          newValueArray[i] = digit;
        });

        const newValue = newValueArray.join("");
        onChange?.(newValue);

        const lastFilledIndex = Math.min(digits.length, length) - 1;
        focusInput(lastFilledIndex);

        if (digits.length >= length) {
          onComplete?.(newValue);
        }
      },
      [allowPaste, valueArray, onChange, onComplete, length, focusInput]
    );

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    }, []);

    const renderInputs = () => {
      if (groups && groups.length > 0) {
        let currentIndex = 0;
        const groupElements: React.ReactNode[] = [];

        groups.forEach((groupSize, groupIndex) => {
          const groupInputs: React.ReactNode[] = [];

          for (let i = 0; i < groupSize && currentIndex < length; i++) {
            const index = currentIndex;
            const individualClassName = inputClassNames[index] || "";

            groupInputs.push(
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type={inputType}
                inputMode="numeric"
                pattern="\d*"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`OTP digit ${index + 1}`}
                aria-invalid={error || undefined}
                value={valueArray[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={handleFocus}
                disabled={disabled}
                maxLength={1}
                className={[inputClassName, focusClassName, individualClassName]
                  .filter(Boolean)
                  .join(" ")}
                data-index={index}
                data-disabled={disabled || undefined}
                data-error={error || undefined}
                data-filled={valueArray[index] ? true : undefined}
                autoFocus={autoFocusFirst && index === 0}
                {...rest}
              />
            );
            currentIndex++;
          }

          groupElements.push(
            <div
              key={`group-${groupIndex}`}
              className={groupClassName}
              data-group={groupIndex}
            >
              {groupInputs}
            </div>
          );

          if (groupIndex < groups.length - 1 && separator) {
            groupElements.push(
              <span key={`separator-${groupIndex}`} className={separatorClassName}>
                {separator}
              </span>
            );
          }
        });

        return groupElements;
      }

      return valueArray.map((_, index) => {
        const individualClassName = inputClassNames[index] || "";

        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type={inputType}
            inputMode="numeric"
            pattern="\d*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`OTP digit ${index + 1}`}
            aria-invalid={error || undefined}
            value={valueArray[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={handleFocus}
            disabled={disabled}
            maxLength={1}
            className={[inputClassName, focusClassName, individualClassName]
              .filter(Boolean)
              .join(" ")}
            data-index={index}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-filled={valueArray[index] ? true : undefined}
            autoFocus={autoFocusFirst && index === 0}
            {...rest}
          />
        );
      });
    };

    const fullWidthClass = fullWidth ? "w-full" : "";

    return (
      <div
        className={[containerClassName, fullWidthClass].filter(Boolean).join(" ")}
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
          aria-label="OTP input"
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
  }
);

OtpInput.displayName = "OtpInput";

export default OtpInput;
