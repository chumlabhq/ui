import { forwardRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { FieldLabel } from "./FieldLabel.js";
import { CircularLoader } from "../components/Loader/index.js";
import { cn } from "./cn.js";

export interface FieldWrapperProps {
  fieldId: string;
  label?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  success?: boolean;
  successMessage?: ReactNode;
  description?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onStartIconClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onEndIconClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  startIconAriaLabel?: string;
  endIconAriaLabel?: string;
  clearable?: boolean;
  onClearClick?: () => void;
  clearLabel?: string;
  showCount?: boolean;
  currentLength?: number;
  maxLength?: number;
  countId?: string;
  loader?: ReactNode;
  loaderSize?: number;
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  successClassName?: string;
  descriptionClassName?: string;
  prefixClassName?: string;
  suffixClassName?: string;
  countClassName?: string;
  wrapperAlign?: "items-center" | "items-start";
  wrapperRef?: React.Ref<HTMLDivElement>;
  "data-size"?: string;
  "data-readonly"?: boolean;
  children: ReactNode;
}

const ClearIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

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
      success = false,
      successMessage,
      description,
      prefix,
      suffix,
      startIcon,
      endIcon,
      onStartIconClick,
      onEndIconClick,
      startIconAriaLabel,
      endIconAriaLabel,
      clearable = false,
      onClearClick,
      clearLabel = "Clear",
      showCount = false,
      currentLength = 0,
      maxLength,
      countId,
      loader,
      loaderSize = 16,
      fullWidth = false,
      className,
      style,
      wrapperClassName,
      labelClassName,
      errorClassName,
      successClassName,
      descriptionClassName,
      prefixClassName,
      suffixClassName,
      countClassName,
      wrapperAlign = "items-center",
      wrapperRef,
      "data-size": dataSize,
      "data-readonly": dataReadonly,
      children,
    },
    ref,
  ) => {
    const errorId = `${fieldId}-error`;
    const successId = `${fieldId}-success`;
    const descriptionId = `${fieldId}-description`;
    const isDisabled = disabled;
    const showSuccess = !error && success;

    const loaderElement = loading
      ? (loader ?? (
          <CircularLoader size={loaderSize} thickness={2} aria-hidden="true" />
        ))
      : null;

    return (
      <div
        ref={ref}
        data-slot="container"
        className={cn(fullWidth && "w-full", loading && "opacity-50 pointer-events-none", className) || undefined}
        style={style}
        data-disabled={isDisabled || undefined}
        data-error={error || undefined}
        data-valid={showSuccess || undefined}
        data-loading={loading || undefined}
        data-size={dataSize}
        data-readonly={dataReadonly || undefined}
      >
        {label != null && label !== "" && (
          <FieldLabel
            label={label}
            required={required}
            htmlFor={fieldId}
            className={labelClassName}
          />
        )}

        {description != null && description !== "" && (
          <div
            id={descriptionId}
            data-slot="description"
            className={descriptionClassName}
          >
            {description}
          </div>
        )}

        <div
          ref={wrapperRef}
          data-slot="wrapper"
          className={cn("flex w-full", wrapperAlign, wrapperClassName)}
          aria-busy={loading || undefined}
        >
          {prefix != null && (
            <span
              data-slot="prefix"
              className={cn("inline-flex shrink-0", prefixClassName)}
            >
              {prefix}
            </span>
          )}

          {startIcon &&
            (onStartIconClick ? (
              <button
                type="button"
                className={cn("inline-flex shrink-0 cursor-pointer")}
                onClick={onStartIconClick}
                disabled={isDisabled || loading}
                aria-label={startIconAriaLabel}
              >
                {startIcon}
              </button>
            ) : (
              <span
                className="inline-flex shrink-0"
                aria-hidden="true"
              >
                {startIcon}
              </span>
            ))}

          {children}

          {clearable && currentLength > 0 && (
            <button
              type="button"
              className="inline-flex shrink-0 cursor-pointer opacity-50 hover:opacity-100 transition-opacity motion-reduce:transition-none"
              onClick={onClearClick}
              disabled={isDisabled || loading}
              aria-label={clearLabel}
            >
              <ClearIcon />
            </button>
          )}

          {endIcon &&
            (onEndIconClick ? (
              <button
                type="button"
                className={cn("inline-flex shrink-0 cursor-pointer")}
                onClick={onEndIconClick}
                disabled={isDisabled || loading}
                aria-label={endIconAriaLabel}
              >
                {endIcon}
              </button>
            ) : (
              <span
                className="inline-flex shrink-0"
                aria-hidden="true"
              >
                {endIcon}
              </span>
            ))}

          {suffix != null && (
            <span
              data-slot="suffix"
              className={cn("inline-flex shrink-0", suffixClassName)}
            >
              {suffix}
            </span>
          )}

          {loaderElement}
        </div>

        {showCount && maxLength != null && (
          <div
            id={countId}
            data-slot="count"
            className={countClassName}
            role="status"
            aria-live="polite"
          >
            {currentLength}/{maxLength}
          </div>
        )}

        {/* ADR 002 Amendment B: `error` and `success` collapse into one `message`
            part, so validity has to be readable on the message element itself.
            The root carries data-valid too (above), but a consumer styling the
            merged part can only reach it from here. */}
        {error && errorMessage && (
          <div
            id={errorId}
            role="alert"
            data-slot="error"
            data-invalid
            className={errorClassName}
          >
            {errorMessage}
          </div>
        )}

        {showSuccess && successMessage && (
          <div
            id={successId}
            role="status"
            data-slot="success"
            data-valid
            className={successClassName}
          >
            {successMessage}
          </div>
        )}
      </div>
    );
  },
);

FieldWrapper.displayName = "FieldWrapper";
