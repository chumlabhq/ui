import { forwardRef, useId, useCallback, type KeyboardEvent } from "react";
import type { InputLabelProps, InputProps } from "./types";
import { CircularLoader } from "../Loader";
import { cn } from "../../utils/cn";

export const InputLabel = ({
  label,
  required = false,
  inputId,
  className,
}: InputLabelProps) => {
  return (
    <label htmlFor={inputId} className={className}>
      {label}
      {required && <span aria-hidden="true">*</span>}
    </label>
  );
};

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
      isLoading = false,
      loader,
      loaderSize = 16,
      fullWidth = false,
      containerClassName,
      wrapperClassName,
      wrapperFocusClassName,
      labelClassName,
      errorClassName,
      className,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;
    const errorId = `${inputId}-error`;

    const isDisabled = disabled || isLoading;

    const loaderElement = loader ?? (
      <CircularLoader size={loaderSize} thickness={2} aria-hidden="true" />
    );

    const handleLeadingIconKeyDown = useCallback(
      (event: KeyboardEvent<HTMLSpanElement>) => {
        if (onLeadingIconClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onLeadingIconClick();
        }
      },
      [onLeadingIconClick],
    );

    const handleTrailingIconKeyDown = useCallback(
      (event: KeyboardEvent<HTMLSpanElement>) => {
        if (onTrailingIconClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onTrailingIconClick();
        }
      },
      [onTrailingIconClick],
    );

    return (
      <div
        className={cn(containerClassName, fullWidth && "w-full") || undefined}
        data-disabled={isDisabled || undefined}
        data-error={error || undefined}
        data-loading={isLoading || undefined}
      >
        {label && (
          <InputLabel
            label={label}
            required={required}
            inputId={inputId}
            className={labelClassName}
          />
        )}

        <div className={cn("flex items-center w-full", wrapperClassName, wrapperFocusClassName)}>
          {leadingIcon && (
            <span
              className={cn(
                "inline-flex shrink-0",
                onLeadingIconClick && "cursor-pointer",
              )}
              onClick={onLeadingIconClick}
              onKeyDown={onLeadingIconClick ? handleLeadingIconKeyDown : undefined}
              role={onLeadingIconClick ? "button" : undefined}
              tabIndex={onLeadingIconClick ? 0 : undefined}
              aria-label={leadingIconLabel}
            >
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            required={required}
            disabled={isDisabled}
            className={cn("flex-1 min-w-0", className)}
            aria-invalid={error || undefined}
            aria-describedby={error && errorMessage ? errorId : undefined}
            aria-required={required || undefined}
            data-disabled={isDisabled || undefined}
            data-error={error || undefined}
            {...rest}
          />

          {trailingIcon && (
            <span
              className={cn(
                "inline-flex shrink-0",
                onTrailingIconClick && "cursor-pointer",
              )}
              onClick={onTrailingIconClick}
              onKeyDown={onTrailingIconClick ? handleTrailingIconKeyDown : undefined}
              role={onTrailingIconClick ? "button" : undefined}
              tabIndex={onTrailingIconClick ? 0 : undefined}
              aria-label={trailingIconLabel}
            >
              {trailingIcon}
            </span>
          )}

          {isLoading && loaderElement}
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

Input.displayName = "Input";

export default Input;
