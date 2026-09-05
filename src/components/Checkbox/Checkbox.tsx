import { forwardRef, useId, useEffect, useRef, useMemo, useCallback } from "react";
import type { CheckboxProps, CheckboxClasses } from "./utils/types.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import {
  SIZE_MAP,
  ICON_SIZE_MAP,
  SHAPE_CLASS_MAP,
  DEFAULT_CHECKBOX_CLASSES,
  UNSTYLED_CHECKBOX_CLASSES,
} from "./utils/constants.js";
import { CheckIcon as CheckIconDefault, IndeterminateIcon } from "./utils/icons.js";
import { useControllableState } from "../../utils/useControllableState.js";
import { cn } from "../../utils/scopedCn.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
/**
 * Component: Checkbox
 *
 * Purpose:
 * Accessible checkbox with label, description, indeterminate state,
 * custom icons, sizes, shapes, and full form integration.
 *
 * AI Usage Guidelines:
 * - Use `checked` + `onValueChange` for controlled mode
 * - Use `indeterminate` for "select all" patterns (visual only)
 * - Use `shape` for square/rounded/circle variants
 * - Use `classes` for per-slot styling overrides
 *
 * Behavior:
 * - Native `<input type="checkbox">` inside implicit `<label>`
 * - `indeterminate` is set programmatically via ref
 * - Error/success messages use `role="alert"` for live announcements
 *
 * Reference:
 * - CHECKBOX.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/CheckboxDemo.tsx — live demo
 */
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
      readOnly = false,
      required = false,
      onValueChange,
      onFocus,
      onBlur,
      error = false,
      errorMessage,
      success = false,
      successMessage,
      loading = false,
      size = "md",
      shape = "rounded",
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

    // A control nobody can name is a control nobody can use. Dev-only.
    useAccessibleNameWarning("Checkbox", {
      label,
      "aria-label": (rest as Record<string, unknown>)["aria-label"],
      "aria-labelledby": (rest as Record<string, unknown>)["aria-labelledby"],
      title: (rest as Record<string, unknown>).title,
    });
    const errorId = `${checkboxId}-error`;
    const descriptionId = `${checkboxId}-description`;

    const internalRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMemo(() => mergeRefs(internalRef, ref), [ref]);

    const [isChecked, setIsChecked] = useControllableState({
      value: controlledChecked,
      defaultValue: defaultChecked,
      onChange: onValueChange,
    });

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // ─── Merged classes system ──────────────────────────────────────────
    const baseClassesRaw = unstyled ? UNSTYLED_CHECKBOX_CLASSES : DEFAULT_CHECKBOX_CLASSES;
    // Motion is decorative under ADR 001, so `unstyled` has already removed it;
    // this handles the other reason to stop animating. Applied to the defaults
    // only — a class string the consumer supplied is theirs to control.
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);
    const mergedClasses: Required<CheckboxClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        labelGroup: classesProp?.labelGroup ?? baseClasses.labelGroup,
        label: classesProp?.label ?? baseClasses.label,
        description: classesProp?.description ?? baseClasses.description,
        control: classesProp?.control ?? baseClasses.control,
        itemIndicator: classesProp?.itemIndicator ?? baseClasses.itemIndicator,
        message: classesProp?.message ?? baseClasses.message,
      }),
      [classesProp, baseClasses],
    );

    // ─── Size & shape ───────────────────────────────────────────────────
    const { boxSize, iconSize } = useMemo(() => {
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
    // ADR 002 R4: checked/unchecked/indeterminate are data-state values on
    // `control`, so there is no state class to pick between.
    const stateClassName = undefined;

    // ─── Handlers ───────────────────────────────────────────────────────
    // The native readonly attribute does nothing on checkboxes, so the guard has
    // to live here - readOnly blocks the change but must not read as disabled.
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled && !readOnly) {
          setIsChecked(event.target.checked);
        }
      },
      [disabled, readOnly, setIsChecked],
    );

    // ─── Icon ───────────────────────────────────────────────────────────
    const renderedIcon = useMemo(() => {
      if (indeterminate) {
        return indeterminateIcon || <IndeterminateIcon className={mergedClasses.itemIndicator || undefined} size={iconSize} />;
      }
      if (isChecked) {
        return checkedIcon || <CheckIconDefault className={mergedClasses.itemIndicator || undefined} size={iconSize} />;
      }
      return uncheckedIcon || null;
    }, [indeterminate, isChecked, indeterminateIcon, checkedIcon, uncheckedIcon, mergedClasses.itemIndicator, iconSize]);

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
        data-readonly={readOnly || undefined}
        data-error={error || undefined}
        data-checked={isChecked || undefined}
        data-indeterminate={indeterminate || undefined}
        // ADR 002 R4: state is one attribute with a value, which is what a
        // consumer targets after the checked/unchecked/indeterminate keys go.
        // Radix Checkbox spells it exactly this way.
        data-state={indeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked"}
        data-size={typeof size === "string" ? size : undefined}
        data-shape={shape || undefined}
        data-reduce-motion={prefersReducedMotion || undefined}
        data-loading={loading || undefined}
        data-valid={(!error && success) || undefined}
      >
        <label className="flex items-start gap-2" style={{ cursor: disabled ? "not-allowed" : "pointer" }}>
          <span
            className={cn(mergedClasses.control, stateClassName, shapeClass) || undefined}
            style={{ ...sizeStyle, position: "relative" }}
            data-checked={isChecked || undefined}
            data-indeterminate={indeterminate || undefined}
            data-state={indeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked"}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
          >
            <input
              ref={mergedRef}
              type="checkbox"
              id={checkboxId}
              name={name}
              checked={isChecked}
              disabled={disabled || loading}
              readOnly={readOnly}
              aria-readonly={readOnly || undefined}
              required={required}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              aria-checked={indeterminate ? "mixed" : undefined}
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
            <span className={mergedClasses.labelGroup || undefined}>
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
          <div id={errorId} role="alert" data-invalid className={mergedClasses.message || undefined}>
            {errorMessage}
          </div>
        )}

        {success && successMessage && !error && (
          <div role="status" data-valid className={mergedClasses.message || undefined}>{successMessage}</div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
