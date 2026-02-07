import { forwardRef, useCallback, type KeyboardEvent, type ReactNode } from "react";
import { FieldLabel } from "./FieldLabel";
import { CircularLoader } from "../components/Loader";
import { cn } from "./cn";

export interface FieldWrapperProps {
  fieldId: string;
  label?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onLeadingIconClick?: () => void;
  onTrailingIconClick?: () => void;
  leadingIconLabel?: string;
  trailingIconLabel?: string;
  loader?: ReactNode;
  loaderSize?: number;
  fullWidth?: boolean;
  containerClassName?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  className?: string;
  wrapperAlign?: "items-center" | "items-start";
  wrapperRef?: React.Ref<HTMLDivElement>;
  children: ReactNode;
}

export const FieldWrapper = forwardRef<HTMLDivElement, FieldWrapperProps>(
  (
    {
      fieldId,
      label,
      required = false,
      disabled = false,
      loading = false,
      error = false,
      errorMessage,
      leadingIcon,
      trailingIcon,
      onLeadingIconClick,
      onTrailingIconClick,
      leadingIconLabel,
      trailingIconLabel,
      loader,
      loaderSize = 16,
      fullWidth = false,
      containerClassName,
      wrapperClassName,
      labelClassName,
      errorClassName,
      className,
      wrapperAlign = "items-center",
      wrapperRef,
      children,
    },
    ref,
  ) => {
    const errorId = `${fieldId}-error`;
    const isDisabled = disabled || loading;

    const loaderElement = loader ?? (
      <CircularLoader size={loaderSize} thickness={2} aria-hidden="true" />
    );

    const handleLeadingIconKeyDown = useCallback(
      (event: KeyboardEvent<HTMLSpanElement>) => {
        if (
          onLeadingIconClick &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onLeadingIconClick();
        }
      },
      [onLeadingIconClick],
    );

    const handleTrailingIconKeyDown = useCallback(
      (event: KeyboardEvent<HTMLSpanElement>) => {
        if (
          onTrailingIconClick &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onTrailingIconClick();
        }
      },
      [onTrailingIconClick],
    );

    return (
      <div
        ref={ref}
        className={
          cn(containerClassName, fullWidth && "w-full", className) || undefined
        }
        data-disabled={isDisabled || undefined}
        data-error={error || undefined}
        data-loading={loading || undefined}
      >
        {label && (
          <FieldLabel
            label={label}
            required={required}
            htmlFor={fieldId}
            className={labelClassName}
          />
        )}

        <div ref={wrapperRef} className={cn("flex w-full", wrapperAlign, wrapperClassName)}>
          {leadingIcon && (
            <span
              className={cn(
                "inline-flex shrink-0",
                onLeadingIconClick && "cursor-pointer",
              )}
              onClick={onLeadingIconClick}
              onKeyDown={
                onLeadingIconClick ? handleLeadingIconKeyDown : undefined
              }
              role={onLeadingIconClick ? "button" : undefined}
              tabIndex={onLeadingIconClick ? 0 : undefined}
              aria-label={leadingIconLabel}
            >
              {leadingIcon}
            </span>
          )}

          {children}

          {trailingIcon && (
            <span
              className={cn(
                "inline-flex shrink-0",
                onTrailingIconClick && "cursor-pointer",
              )}
              onClick={onTrailingIconClick}
              onKeyDown={
                onTrailingIconClick ? handleTrailingIconKeyDown : undefined
              }
              role={onTrailingIconClick ? "button" : undefined}
              tabIndex={onTrailingIconClick ? 0 : undefined}
              aria-label={trailingIconLabel}
            >
              {trailingIcon}
            </span>
          )}

          {loading && loaderElement}
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

FieldWrapper.displayName = "FieldWrapper";
