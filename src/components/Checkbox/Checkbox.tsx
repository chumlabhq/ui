import { forwardRef, useId, useEffect, useRef, useImperativeHandle, useMemo, useCallback } from "react";
import type { CheckboxProps, CheckboxSize, CheckboxShape } from "./types";
import { useControllableState } from "../../utils/useControllableState";
import { cn } from "../../utils/cn";

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

const defaultCheckboxStyles = {
  base: "inline-flex items-center justify-center border transition-colors",
  checked: "bg-blue-600 border-blue-600 text-white",
  unchecked: "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600",
  indeterminate: "bg-blue-600 border-blue-600 text-white",
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
      checked: controlledChecked,
      defaultChecked = false,
      indeterminate = false,
      disabled = false,
      required = false,
      onCheckedChange,
      onFocus,
      onBlur,
      error = false,
      errorMessage,
      size,
      shape,
      checkedIcon,
      uncheckedIcon,
      indeterminateIcon,
      containerClassName,
      labelContainerClassName,
      labelClassName,
      descriptionClassName,
      checkboxClassName,
      checkedClassName,
      uncheckedClassName,
      indeterminateClassName,
      iconClassName,
      errorClassName,
      sizeClassName,
      shapeClassName,
      className,
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

    const [isChecked, setIsChecked] = useControllableState({
      value: controlledChecked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

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

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
          setIsChecked(event.target.checked);
        }
      },
      [disabled, setIsChecked]
    );

    const getStateClassName = useMemo(() => {
      if (indeterminate) return cn(defaultCheckboxStyles.indeterminate, indeterminateClassName);
      if (isChecked) return cn(defaultCheckboxStyles.checked, checkedClassName);
      return cn(defaultCheckboxStyles.unchecked, uncheckedClassName);
    }, [indeterminate, isChecked, indeterminateClassName, checkedClassName, uncheckedClassName]);

    const renderIcon = useCallback(() => {
      if (indeterminate) {
        return (
          indeterminateIcon || <DefaultIndeterminateIcon className={iconClassName} size={iconSize} />
        );
      }
      if (isChecked) {
        return checkedIcon || <DefaultCheckIcon className={iconClassName} size={iconSize} />;
      }
      return uncheckedIcon || null;
    }, [indeterminate, isChecked, indeterminateIcon, checkedIcon, uncheckedIcon, iconClassName, iconSize]);

    const describedBy = [
      description ? descriptionId : null,
      error && errorMessage ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={cn(containerClassName, className)}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-checked={isChecked || undefined}
        data-indeterminate={indeterminate || undefined}
        data-size={typeof size === "string" ? size : undefined}
        data-shape={shape || undefined}
      >
        <label className={cn("flex items-start gap-2")}>
          <span
            className={cn(defaultCheckboxStyles.base, checkboxClassName, getStateClassName, sizeClassName, shapeClass)}
            style={{ ...sizeStyle, position: "relative" }}
            data-checked={isChecked || undefined}
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
              checked={isChecked}
              disabled={disabled}
              required={required}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              aria-invalid={error || undefined}
              aria-describedby={describedBy || undefined}
              aria-required={required || undefined}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                margin: 0,
                padding: 0,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
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
