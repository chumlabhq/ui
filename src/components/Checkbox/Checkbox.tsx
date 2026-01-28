import { forwardRef, useId, useEffect, useRef, useImperativeHandle, useMemo } from "react";
import type { CheckboxProps, CheckboxSize, CheckboxShape } from "./types";

const SIZE_MAP: Record<Exclude<CheckboxSize, number>, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const ICON_SIZE_MAP: Record<Exclude<CheckboxSize, number>, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
};

const SHAPE_CLASS_MAP: Record<CheckboxShape, string> = {
  square: "rounded-none",
  rounded: "rounded",
  circle: "rounded-full",
};

const DefaultCheckIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const DefaultIndeterminateIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
);

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      name,
      label,
      description,
      checked = false,
      indeterminate = false,
      disabled = false,
      required = false,
      onChange,
      error = false,
      errorMessage,
      size,
      shape,
      checkedIcon,
      uncheckedIcon,
      indeterminateIcon,
      containerClassName = "",
      labelContainerClassName = "",
      labelClassName = "",
      descriptionClassName = "",
      checkboxClassName = "",
      checkedClassName = "",
      uncheckedClassName = "",
      indeterminateClassName = "",
      iconClassName = "",
      errorClassName = "",
      sizeClassName = "",
      shapeClassName = "",
      className = "",
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || name || generatedId;
    const errorId = `${checkboxId}-error`;
    const descriptionId = `${checkboxId}-description`;

    const internalRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const { boxSize, iconSize } = useMemo(() => {
      if (size === undefined) {
        return { boxSize: undefined, iconSize: undefined };
      }
      if (typeof size === "number") {
        return { boxSize: size, iconSize: Math.round(size * 0.6) };
      }
      return { boxSize: SIZE_MAP[size], iconSize: ICON_SIZE_MAP[size] };
    }, [size]);

    const shapeClass = useMemo(() => {
      if (shapeClassName) return shapeClassName;
      if (shape) return SHAPE_CLASS_MAP[shape];
      return "";
    }, [shape, shapeClassName]);

    const sizeStyle = useMemo(() => {
      if (sizeClassName || !boxSize) return undefined;
      return { width: boxSize, height: boxSize };
    }, [boxSize, sizeClassName]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        onChange?.(event.target.checked, event);
      }
    };

    const getStateClassName = () => {
      if (indeterminate) return indeterminateClassName;
      if (checked) return checkedClassName;
      return uncheckedClassName;
    };

    const renderIcon = () => {
      if (indeterminate) {
        return (
          indeterminateIcon || <DefaultIndeterminateIcon className={iconClassName} size={iconSize} />
        );
      }
      if (checked) {
        return checkedIcon || <DefaultCheckIcon className={iconClassName} size={iconSize} />;
      }
      return uncheckedIcon || null;
    };

    const describedBy = [
      description ? descriptionId : null,
      error && errorMessage ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={containerClassName}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-checked={checked || undefined}
        data-indeterminate={indeterminate || undefined}
        data-size={typeof size === "string" ? size : undefined}
        data-shape={shape || undefined}
      >
        <label className={["flex items-start gap-2", className].filter(Boolean).join(" ")}>
          <span
            className={[checkboxClassName, getStateClassName(), sizeClassName, shapeClass].filter(Boolean).join(" ")}
            style={sizeStyle}
            data-checked={checked || undefined}
            data-indeterminate={indeterminate || undefined}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-size={typeof size === "string" ? size : undefined}
            data-shape={shape || undefined}
          >
            <input
              ref={internalRef}
              type="checkbox"
              id={checkboxId}
              name={name}
              checked={checked}
              disabled={disabled}
              required={required}
              onChange={handleChange}
              aria-invalid={error || undefined}
              aria-describedby={describedBy || undefined}
              aria-required={required || undefined}
              className="sr-only"
              {...rest}
            />
            {renderIcon()}
          </span>

          {(label || description) && (
            <span className={labelContainerClassName}>
              {label && (
                <span className={labelClassName}>
                  {label}
                  {required && <span aria-hidden="true">*</span>}
                </span>
              )}
              {description && (
                <span id={descriptionId} className={descriptionClassName}>
                  {description}
                </span>
              )}
            </span>
          )}
        </label>

        {error && errorMessage && (
          <div id={errorId} role="alert" className={errorClassName}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
