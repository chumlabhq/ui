import { useId, useMemo, forwardRef, useCallback } from "react";
import type { SwitchProps, SwitchClasses, SwitchRenderProps } from "./utils/types.js";
import { DEFAULT_SWITCH_CLASSES, UNSTYLED_SWITCH_CLASSES } from "./utils/constants.js";
import { useControllableState } from "../../utils/useControllableState.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
/**
 * Component: Switch
 *
 * Purpose: Toggle switch for binary on/off states with labels, validation,
 * loading, custom thumb icons, and full WAI-ARIA switch pattern.
 *
 * AI Usage Guidelines:
 * - Use `label` for visible labeling, or `aria-label` for icon-only
 * - Use `checked` + `onCheckedChange` for controlled mode
 * - Use `checkedIcon`/`uncheckedIcon` for thumb icons
 * - CSS custom properties available for easy theming
 *
 * Reference: SWITCH.ai.md (this directory), src/pages/demo/SwitchDemo.tsx
 */
const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      label,
      description,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      name,
      value = "on",
      required = false,
      id,
      disabled = false,
      error = false,
      errorMessage,
      success = false,
      successMessage,
      loading = false,
      loader,
      loaderSize = 16,
      classes: classesProp,
      unstyled = false,
      checkedIcon,
      uncheckedIcon,
      animationDuration,
      transitionTimingFunction,
      renderLabel,
      renderDescription,
      style,
      reduceMotion = "auto",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...buttonProps
    },
    ref,
  ) => {
    const prefersReducedMotion = useReducedMotion(reduceMotion);
    const generatedId = useId();
    const switchId = id || generatedId;
    const errorId = `${switchId}-error`;
    const descriptionId =
      description || renderDescription ? `${switchId}-description` : undefined;

    const [isChecked, setIsChecked] = useControllableState({
      value: controlledChecked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const handleToggle = useCallback(() => {
      if (!disabled) {
        setIsChecked(!isChecked);
      }
    }, [disabled, isChecked, setIsChecked]);

    const baseClassesRaw = unstyled ? UNSTYLED_SWITCH_CLASSES : DEFAULT_SWITCH_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);
    const mergedClasses: Required<SwitchClasses> = useMemo(
      () => ({
        root: mergeSlot(baseClasses.root, classesProp?.root),
        row: mergeSlot(baseClasses.row, classesProp?.row),
        group: mergeSlot(baseClasses.group, classesProp?.group),
        label: mergeSlot(baseClasses.label, classesProp?.label),
        description: mergeSlot(baseClasses.description, classesProp?.description),
        control: mergeSlot(baseClasses.control, classesProp?.control),
        thumb: mergeSlot(baseClasses.thumb, classesProp?.thumb),
        message: mergeSlot(baseClasses.message, classesProp?.message),
        loading: mergeSlot(baseClasses.loading, classesProp?.loading),
      }),
      [classesProp, baseClasses],
    );

    const renderProps: SwitchRenderProps = useMemo(
      () => ({ checked: isChecked, disabled, error, loading, success, switchId, descriptionId }),
      [isChecked, disabled, error, loading, success, switchId, descriptionId],
    );

    const transitionStyle = useMemo(() => {
      if (prefersReducedMotion) return { transitionDuration: "0ms" };
      if (!animationDuration && !transitionTimingFunction) return undefined;
      return {
        transitionDuration: animationDuration
          ? `${animationDuration}ms`
          : undefined,
        transitionTimingFunction: transitionTimingFunction,
      };
    }, [animationDuration, transitionTimingFunction, prefersReducedMotion]);

    const hasLabelContent =
      label || description || renderLabel || renderDescription;

    return (
      <div
        className={cn(mergedClasses.root, className) || undefined}
        style={style}
        data-disabled={disabled || undefined}
        data-checked={isChecked || undefined}
        data-state={isChecked ? "checked" : "unchecked"}
        data-error={error || undefined}
        data-loading={loading || undefined}
        data-valid={(!error && success) || undefined}
        data-reduce-motion={prefersReducedMotion || undefined}
      >
        <div className={mergedClasses.row || undefined}>
          {hasLabelContent && (
            <div className={mergedClasses.group || undefined}>
              {renderLabel
                ? renderLabel(renderProps)
                : label && (
                    <label
                      htmlFor={switchId}
                      // ADR 002 R4: the state the disabledLabel key named. The
                      // attribute has to sit on the element `label` styles, or
                      // the replacement variant has nothing to match.
                      data-disabled={disabled || undefined}
                      className={cn(
                        mergedClasses.label,
                      ) || undefined}
                    >
                      {label}
                      {required && <span aria-hidden="true"> *</span>}
                    </label>
                  )}
              {renderDescription ? (
                <span id={descriptionId}>{renderDescription(renderProps)}</span>
              ) : (
                description && (
                  <span
                    id={descriptionId}
                    className={mergedClasses.description || undefined}
                  >
                    {description}
                  </span>
                )
              )}
            </div>
          )}

          <button
            ref={ref}
            type="button"
            id={switchId}
            role="switch"
            aria-checked={isChecked}
            aria-invalid={error || undefined}
            // Input, OtpInput and Checkbox all expose this in their error
            // state; Switch linked the message with `aria-describedby` and
            // stopped there, so the message was read out while the control
            // itself was still announced as valid.
            // `disabled` alone is not exposed on a custom role in every AT, and
            // the ARIA switch pattern expects the state explicitly.
            aria-disabled={disabled || loading || undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={
              [ariaDescribedBy, descriptionId, error && errorMessage ? errorId : undefined]
                .filter(Boolean)
                .join(" ") || undefined
            }
            aria-required={required || undefined}
            disabled={disabled || loading}
            onClick={handleToggle}
            className={cn(
              mergedClasses.control,
            ) || undefined}
            style={transitionStyle}
            data-disabled={disabled || undefined}
            data-loading={loading || undefined}
            data-checked={isChecked || undefined}
            data-state={isChecked ? "checked" : "unchecked"}
            {...buttonProps}
          >
            <span
              className={mergedClasses.thumb || undefined}
              data-state={isChecked ? "checked" : "unchecked"}
              style={transitionStyle}
            >
              {isChecked ? checkedIcon : uncheckedIcon}
            </span>
          </button>

          {loading && (
            loader || (
              <svg
                role="status"
                aria-label="Loading"
                className={cn(mergedClasses.loading) || undefined}
                width={loaderSize}
                height={loaderSize}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  opacity="0.25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </svg>
            )
          )}

          {name && (
            <input
              type="hidden"
              name={name}
              value={isChecked ? value : ""}
              disabled={disabled}
            />
          )}
        </div>

        {error && errorMessage && (
          <div id={errorId} role="alert" data-invalid className={mergedClasses.message || undefined}>{errorMessage}</div>
        )}

        {success && successMessage && !error && (
          <div role="status" data-valid className={mergedClasses.message || undefined}>{successMessage}</div>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
