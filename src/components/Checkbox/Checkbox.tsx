import { forwardRef, useId, useEffect, useRef, useImperativeHandle, useMemo, useCallback } from "react";
import type { CheckboxProps } from "./utils/types";
import { SIZE_MAP, ICON_SIZE_MAP, SHAPE_CLASS_MAP, defaultCheckboxStyles } from "./utils/constants";
import { DefaultCheckIcon, DefaultIndeterminateIcon } from "./utils/icons";
import { useControllableState } from "../../utils/useControllableState";
import { cn } from "../../utils/cn";

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
      classNames,
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
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;
    const descriptionId = `${checkboxId}-description`;

    const internalRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => internalRef.current!, []);

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
      if (resolvedShapeClassName) return resolvedShapeClassName;
      if (shape) return SHAPE_CLASS_MAP[shape];
      return "";
    }, [shape, resolvedShapeClassName]);

    const sizeStyle = useMemo(() => {
      if (resolvedSizeClassName || !boxSize) return undefined;
      return { width: boxSize, height: boxSize };
    }, [boxSize, resolvedSizeClassName]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
          setIsChecked(event.target.checked);
        }
      },
      [disabled, setIsChecked]
    );

    const resolvedContainerClassName = containerClassName ?? classNames?.root;
    const resolvedLabelContainerClassName = labelContainerClassName ?? classNames?.labelContainer;
    const resolvedLabelClassName = labelClassName ?? classNames?.label;
    const resolvedDescriptionClassName = descriptionClassName ?? classNames?.description;
    const resolvedCheckboxClassName = checkboxClassName ?? classNames?.checkbox;
    const resolvedCheckedClassName = checkedClassName ?? classNames?.checked;
    const resolvedUncheckedClassName = uncheckedClassName ?? classNames?.unchecked;
    const resolvedIndeterminateClassName = indeterminateClassName ?? classNames?.indeterminate;
    const resolvedIconClassName = iconClassName ?? classNames?.icon;
    const resolvedErrorClassName = errorClassName ?? classNames?.error;
    const resolvedSizeClassName = sizeClassName ?? classNames?.size;
    const resolvedShapeClassName = shapeClassName ?? classNames?.shape;

    const getStateClassName = useMemo(() => {
      if (indeterminate) return cn(defaultCheckboxStyles.indeterminate, resolvedIndeterminateClassName);
      if (isChecked) return cn(defaultCheckboxStyles.checked, resolvedCheckedClassName);
      return cn(defaultCheckboxStyles.unchecked, resolvedUncheckedClassName);
    }, [indeterminate, isChecked, resolvedIndeterminateClassName, resolvedCheckedClassName, resolvedUncheckedClassName]);

    const renderedIcon = useMemo(() => {
      if (indeterminate) {
        return (
          indeterminateIcon || <DefaultIndeterminateIcon className={resolvedIconClassName} size={iconSize} />
        );
      }
      if (isChecked) {
        return checkedIcon || <DefaultCheckIcon className={resolvedIconClassName} size={iconSize} />;
      }
      return uncheckedIcon || null;
    }, [indeterminate, isChecked, indeterminateIcon, checkedIcon, uncheckedIcon, resolvedIconClassName, iconSize]);

    const describedBy = [
      description ? descriptionId : null,
      error && errorMessage ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={cn(resolvedContainerClassName, className)}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-checked={isChecked || undefined}
        data-indeterminate={indeterminate || undefined}
        data-size={typeof size === "string" ? size : undefined}
        data-shape={shape || undefined}
      >
        <label className={cn("flex items-start gap-2")}>
          <span
            className={cn(defaultCheckboxStyles.base, resolvedCheckboxClassName, getStateClassName, resolvedSizeClassName, shapeClass)}
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
            {renderedIcon}
          </span>

          {(label || description) && (
            <span className={resolvedLabelContainerClassName}>
              {label && (
                <span className={resolvedLabelClassName}>
                  {label}
                  {required && <span aria-hidden="true">*</span>}
                </span>
              )}
              {description && (
                <span id={descriptionId} className={resolvedDescriptionClassName}>
                  {description}
                </span>
              )}
            </span>
          )}
        </label>

        {error && errorMessage && (
          <div id={errorId} role="alert" className={resolvedErrorClassName}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
