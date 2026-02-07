import { forwardRef, useId } from "react";
import type { InputProps } from "./utils/types";
import { FieldLabel } from "../../utils/FieldLabel";
import { FieldWrapper } from "../../utils/FieldWrapper";
import { cn } from "../../utils/cn";

export const InputLabel = FieldLabel;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      name,
      type = "text",
      required = false,
      disabled = false,
      error = false,
      errorMessage,
      leadingIcon,
      trailingIcon,
      onLeadingIconClick,
      onTrailingIconClick,
      leadingIconLabel,
      trailingIconLabel,
      loading = false,
      loader,
      loaderSize = 16,
      fullWidth = false,
      containerClassName,
      wrapperClassName,
      labelClassName,
      errorClassName,
      className,
      inputClassName,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const isDisabled = disabled || loading;

    if (process.env.NODE_ENV !== "production") {
      if (onLeadingIconClick && !leadingIconLabel) {
        console.warn(
          "Input: onLeadingIconClick is provided without leadingIconLabel. Add leadingIconLabel for accessibility.",
        );
      }
      if (onTrailingIconClick && !trailingIconLabel) {
        console.warn(
          "Input: onTrailingIconClick is provided without trailingIconLabel. Add trailingIconLabel for accessibility.",
        );
      }
    }

    return (
      <FieldWrapper
        fieldId={inputId}
        label={label}
        required={required}
        disabled={disabled}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        onLeadingIconClick={onLeadingIconClick}
        onTrailingIconClick={onTrailingIconClick}
        leadingIconLabel={leadingIconLabel}
        trailingIconLabel={trailingIconLabel}
        loader={loader}
        loaderSize={loaderSize}
        fullWidth={fullWidth}
        containerClassName={containerClassName}
        wrapperClassName={wrapperClassName}
        labelClassName={labelClassName}
        errorClassName={errorClassName}
        className={className}
        wrapperAlign="items-center"
      >
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          required={required}
          disabled={isDisabled}
          className={cn("flex-1 min-w-0", inputClassName)}
          aria-invalid={error || undefined}
          aria-describedby={error && errorMessage ? errorId : undefined}
          aria-required={required || undefined}
          data-disabled={isDisabled || undefined}
          data-error={error || undefined}
          {...rest}
        />
      </FieldWrapper>
    );
  },
);

Input.displayName = "Input";

export default Input;
