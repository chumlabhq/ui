/**
 * AI GOVERNANCE NOTICE
 * This repository enforces strict cross-component consistency.
 * Do not introduce new prop names, behaviors, or documentation formats
 * unless absolutely required for correctness.
 */

import { forwardRef, useId, type KeyboardEvent } from "react";
import type { TextAreaProps, TextAreaLabelProps } from "./types";
import { CircularLoader } from "../Loader";

const handleIconKeyDown =
  (onClick?: () => void) => (event: KeyboardEvent<HTMLSpanElement>) => {
    if (onClick && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick();
    }
  };

export const TextAreaLabel = ({
  label,
  required = false,
  textAreaId,
  className = "",
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
      containerClassName = "",
      wrapperClassName = "",
      focusClassName = "",
      labelClassName = "",
      errorClassName = "",
      className = "",
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

    const fullWidthClass = fullWidth ? "w-full" : "";

    return (
      <div
        className={[containerClassName, fullWidthClass]
          .filter(Boolean)
          .join(" ")}
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

        <div
          className={["flex items-start w-full", wrapperClassName, focusClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {leadingIcon && (
            <span
              className={[
                "inline-flex shrink-0",
                onLeadingIconClick ? "cursor-pointer" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={onLeadingIconClick}
              onKeyDown={handleIconKeyDown(onLeadingIconClick)}
              role={onLeadingIconClick ? "button" : undefined}
              tabIndex={onLeadingIconClick ? 0 : undefined}
              aria-label={onLeadingIconClick ? leadingIconLabel : undefined}
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
            className={["flex-1 resize-none", className]
              .filter(Boolean)
              .join(" ")}
            aria-invalid={error || undefined}
            aria-describedby={error && errorMessage ? errorId : undefined}
            aria-required={required || undefined}
            data-disabled={isDisabled || undefined}
            data-error={error || undefined}
            {...rest}
          />

          {trailingIcon && (
            <span
              className={[
                "inline-flex shrink-0",
                onTrailingIconClick ? "cursor-pointer" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={onTrailingIconClick}
              onKeyDown={handleIconKeyDown(onTrailingIconClick)}
              role={onTrailingIconClick ? "button" : undefined}
              tabIndex={onTrailingIconClick ? 0 : undefined}
              aria-label={onTrailingIconClick ? trailingIconLabel : undefined}
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
