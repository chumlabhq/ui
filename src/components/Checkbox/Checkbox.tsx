import { forwardRef, useId, useEffect, useRef, useMemo, useCallback } from "react";
import type { CheckboxProps, CheckboxClasses } from "./utils/types";
import { useReducedMotion } from "../../utils/useReducedMotion";
import {
  SIZE_MAP,
  ICON_SIZE_MAP,
  SHAPE_CLASS_MAP,
  DEFAULT_CHECKBOX_CLASSES,
  UNSTYLED_CHECKBOX_CLASSES,
} from "./utils/constants";
import { DefaultCheckIcon, DefaultIndeterminateIcon } from "./utils/icons";
import { useControllableState } from "../../utils/useControllableState";
import { cn } from "../../utils/cn";
import { mergeRefs } from "../../utils/mergeRefs";

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
      classes: classesProp,
      unstyled = false,
      reduceMotion,
      className,
      ...rest
    },
    ref,
  ) => {
    const prefersReducedMotion = useReducedMotion(reduceMotion);

    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;
    const descriptionId = `${checkboxId}-description`;

    const internalRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMemo(() => mergeRefs(internalRef, ref), [ref]);

    // Dev warnings — in useEffect to comply with React 19 ref access rules
    const warnedRef = useRef(false);
    useEffect(() => {
      if (process.env.NODE_ENV !== "production") {
        if (
          !label &&
          !rest["aria-label"] &&
          !rest["aria-labelledby"] &&
          !warnedRef.current
        ) {
          warnedRef.current = true;
          console.warn(
            "Checkbox: A checkbox without a label requires an `aria-label` or `aria-labelledby` for accessibility.",
          );
        }
      }
    }, [label, rest]);

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

    // ─── Merged classes system ──────────────────────────────────────────
    const baseClasses = unstyled ? UNSTYLED_CHECKBOX_CLASSES : DEFAULT_CHECKBOX_CLASSES;
    const mergedClasses: Required<CheckboxClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        labelContainer: classesProp?.labelContainer ?? baseClasses.labelContainer,
        label: classesProp?.label ?? baseClasses.label,
        description: classesProp?.description ?? baseClasses.description,
        checkbox: classesProp?.checkbox ?? baseClasses.checkbox,
        checked: classesProp?.checked ?? baseClasses.checked,
        unchecked: classesProp?.unchecked ?? baseClasses.unchecked,
        indeterminate: classesProp?.indeterminate ?? baseClasses.indeterminate,
        icon: classesProp?.icon ?? baseClasses.icon,
        error: classesProp?.error ?? baseClasses.error,
      }),
      [classesProp, baseClasses],
    );

    // ─── Size & shape ───────────────────────────────────────────────────
    const { boxSize, iconSize } = useMemo(() => {
      if (size === undefined) {
        return { boxSize: undefined, iconSize: undefined };
      }
      if (typeof size === "number") {
        return { boxSize: size, iconSize: Math.round(size * 0.6) };
      }
      return { boxSize: SIZE_MAP[size], iconSize: ICON_SIZE_MAP[size] };
    }, [size]);

    const shapeClass = shape ? SHAPE_CLASS_MAP[shape] : "";

    const sizeStyle = useMemo(() => {
      if (!boxSize) return undefined;
      return { width: boxSize, height: boxSize };
    }, [boxSize]);

    // ─── State class ────────────────────────────────────────────────────
    const stateClassName = useMemo(() => {
      if (indeterminate) return mergedClasses.indeterminate;
      if (isChecked) return mergedClasses.checked;
      return mergedClasses.unchecked;
    }, [indeterminate, isChecked, mergedClasses]);

    // ─── Handlers ───────────────────────────────────────────────────────
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
          setIsChecked(event.target.checked);
        }
      },
      [disabled, setIsChecked],
    );

    // ─── Icon ───────────────────────────────────────────────────────────
    const renderedIcon = useMemo(() => {
      if (indeterminate) {
        return indeterminateIcon || <DefaultIndeterminateIcon className={mergedClasses.icon || undefined} size={iconSize} />;
      }
      if (isChecked) {
        return checkedIcon || <DefaultCheckIcon className={mergedClasses.icon || undefined} size={iconSize} />;
      }
      return uncheckedIcon || null;
    }, [indeterminate, isChecked, indeterminateIcon, checkedIcon, uncheckedIcon, mergedClasses.icon, iconSize]);

    // ─── Described by ───────────────────────────────────────────────────
    const describedBy = [
      description ? descriptionId : null,
      error && errorMessage ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={cn(mergedClasses.root, className) || undefined}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-checked={isChecked || undefined}
        data-indeterminate={indeterminate || undefined}
        data-size={typeof size === "string" ? size : undefined}
        data-shape={shape || undefined}
        data-reduce-motion={prefersReducedMotion || undefined}
      >
        <label className="flex items-start gap-2" style={{ cursor: disabled ? "not-allowed" : "pointer" }}>
          <span
            className={cn(mergedClasses.checkbox, stateClassName, shapeClass) || undefined}
            style={{ ...sizeStyle, position: "relative" }}
            data-checked={isChecked || undefined}
            data-indeterminate={indeterminate || undefined}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
          >
            <input
              ref={mergedRef}
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
            <span className={mergedClasses.labelContainer || undefined}>
              {label && (
                <span className={mergedClasses.label || undefined}>
                  {label}
                  {required && <span aria-hidden="true"> *</span>}
                </span>
              )}
              {description && (
                <span id={descriptionId} className={mergedClasses.description || undefined}>
                  {description}
                </span>
              )}
            </span>
          )}
        </label>

        {error && errorMessage && (
          <div id={errorId} role="alert" className={mergedClasses.error || undefined}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
