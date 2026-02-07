import { forwardRef, useId } from "react";
import type { TextAreaProps } from "./utils/types";
import { FieldLabel } from "../../utils/FieldLabel";
import { FieldWrapper } from "../../utils/FieldWrapper";
import { cn } from "../../utils/cn";

export const TextAreaLabel = FieldLabel;

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
      loading = false,
      loader,
      loaderSize = 16,
      fullWidth = false,
      containerClassName,
      wrapperClassName,
      labelClassName,
      errorClassName,
      className,
      textAreaClassName,
      rows = 4,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const textAreaId = id || generatedId;
    const errorId = `${textAreaId}-error`;
    const isDisabled = disabled || loading;

    if (process.env.NODE_ENV !== "production") {
      if (onLeadingIconClick && !leadingIconLabel) {
        console.warn(
          "TextArea: onLeadingIconClick is provided without leadingIconLabel. Add leadingIconLabel for accessibility.",
        );
      }
      if (onTrailingIconClick && !trailingIconLabel) {
        console.warn(
          "TextArea: onTrailingIconClick is provided without trailingIconLabel. Add trailingIconLabel for accessibility.",
        );
      }
    }

    return (
      <FieldWrapper
        fieldId={textAreaId}
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
        wrapperAlign="items-start"
      >
        <textarea
          ref={ref}
          id={textAreaId}
          name={name}
          required={required}
          disabled={isDisabled}
          rows={rows}
          className={cn("flex-1 resize-y", textAreaClassName)}
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

TextArea.displayName = "TextArea";

export default TextArea;
