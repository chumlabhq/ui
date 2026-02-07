import { forwardRef, useId, useCallback, type KeyboardEvent } from "react";
import type { TextAreaProps, TextAreaLabelProps } from "./types";
import { CircularLoader } from "../Loader";
import { cn } from "../../utils/cn";

export const TextAreaLabel = ({
  label,
  required = false,
  textAreaId,
  className,
}: TextAreaLabelProps) => {
  return (
    <label htmlFor={textAreaId} className={className}>
      {label}
      {required && <span aria-hidden="true">*</span>}
    </label>
  );
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      id,
      name,
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
      rows = 4,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const textAreaId = id || name || generatedId;
    const errorId = `${textAreaId}-error`;

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
          <TextAreaLabel
            label={label}
            required={required}
            textAreaId={textAreaId}
            className={labelClassName}
          />
        )}

        <div className={cn("flex items-start w-full", wrapperClassName, wrapperFocusClassName)}>
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

          <textarea
            ref={ref}
            id={textAreaId}
            name={name}
            required={required}
            disabled={isDisabled}
            rows={rows}
            className={cn("flex-1 resize-none", className)}
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

TextArea.displayName = "TextArea";

export default TextArea;
