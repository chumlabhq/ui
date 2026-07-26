import { useId, useMemo, forwardRef, useCallback } from "react";
import type { SwitchProps, SwitchClasses, SwitchRenderProps } from "./utils/types";
import { DEFAULT_SWITCH_CLASSES, UNSTYLED_SWITCH_CLASSES } from "./utils/constants";
import { useControllableState } from "../../utils/useControllableState";
import { useReducedMotion } from "../../utils/useReducedMotion";
import { cn } from "../../utils/cn";

/**
 * Component: Switch
 *
 * Purpose: Toggle switch for binary on/off states with labels, validation,
 * loading, custom thumb icons, and full WAI-ARIA switch pattern.
 *
 * AI Usage Guidelines:
 * - Use `label` for visible labeling, or `aria-label` for icon-only
 * - Use `checked` + `onValueChange` for controlled mode
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
      onValueChange,
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
      transitionDuration,
      transitionTimingFunction,
      renderLabel,
      renderDescription,
      style,
      reduceMotion,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
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
      onChange: onValueChange ?? onCheckedChange,
    });

    const handleToggle = useCallback(() => {
      if (!disabled) {
        setIsChecked(!isChecked);
      }
    }, [disabled, isChecked, setIsChecked]);

    // ─── Merged classes ─────────────────────────────────────────────────
    const baseClasses = unstyled ? UNSTYLED_SWITCH_CLASSES : DEFAULT_SWITCH_CLASSES;
    const mergedClasses: Required<SwitchClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        innerRow: classesProp?.innerRow ?? baseClasses.innerRow,
        labelContainer: classesProp?.labelContainer ?? baseClasses.labelContainer,
        label: classesProp?.label ?? baseClasses.label,
        disabledLabel: classesProp?.disabledLabel ?? baseClasses.disabledLabel,
        description: classesProp?.description ?? baseClasses.description,
        tracker: classesProp?.tracker ?? baseClasses.tracker,
        disabledTracker: classesProp?.disabledTracker ?? baseClasses.disabledTracker,
        thumb: classesProp?.thumb ?? baseClasses.thumb,
        checkedTracker: classesProp?.checkedTracker ?? baseClasses.checkedTracker,
        uncheckedTracker: classesProp?.uncheckedTracker ?? baseClasses.uncheckedTracker,
        checkedThumb: classesProp?.checkedThumb ?? baseClasses.checkedThumb,
        uncheckedThumb: classesProp?.uncheckedThumb ?? baseClasses.uncheckedThumb,
        error: classesProp?.error ?? baseClasses.error,
        success: classesProp?.success ?? baseClasses.success,
        loading: classesProp?.loading ?? baseClasses.loading,
      }),
      [classesProp, baseClasses],
    );

    const renderProps: SwitchRenderProps = useMemo(
      () => ({ checked: isChecked, disabled, error, loading, success, switchId, descriptionId }),
      [isChecked, disabled, error, loading, success, switchId, descriptionId],
    );

    const transitionStyle = useMemo(() => {
      if (prefersReducedMotion) return { transitionDuration: "0ms" };
      if (!transitionDuration && !transitionTimingFunction) return undefined;
      return {
        transitionDuration: transitionDuration
          ? `${transitionDuration}ms`
          : undefined,
        transitionTimingFunction: transitionTimingFunction,
      };
    }, [transitionDuration, transitionTimingFunction, prefersReducedMotion]);

    const hasLabelContent =
      label || description || renderLabel || renderDescription;

    return (
      <div
        className={cn(mergedClasses.root, className) || undefined}
        style={style}
        data-disabled={disabled || undefined}
        data-checked={isChecked || undefined}
        data-error={error || undefined}
        data-loading={loading || undefined}
        data-success={success || undefined}
        data-reduce-motion={prefersReducedMotion || undefined}
      >
        <div className={mergedClasses.innerRow || undefined}>
          {hasLabelContent && (
            <div className={mergedClasses.labelContainer || undefined}>
              {renderLabel
                ? renderLabel(renderProps)
                : label && (
                    <label
                      htmlFor={switchId}
                      className={cn(
                        mergedClasses.label,
                        disabled && mergedClasses.disabledLabel,
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
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={
              [descriptionId, error && errorMessage ? errorId : undefined]
                .filter(Boolean)
                .join(" ") || undefined
            }
            aria-required={required || undefined}
            disabled={disabled || loading}
            onClick={handleToggle}
            className={cn(
              mergedClasses.tracker,
              disabled && mergedClasses.disabledTracker,
              isChecked ? mergedClasses.checkedTracker : mergedClasses.uncheckedTracker,
              loading && "opacity-50 pointer-events-none",
            ) || undefined}
            style={transitionStyle}
            data-disabled={disabled || undefined}
            data-checked={isChecked || undefined}
            {...buttonProps}
          >
            <span
              className={cn(
                mergedClasses.thumb,
                isChecked ? mergedClasses.checkedThumb : mergedClasses.uncheckedThumb,
              ) || undefined}
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
                className={cn("animate-spin", mergedClasses.loading) || undefined}
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
          <div id={errorId} role="alert" className={mergedClasses.error || undefined}>{errorMessage}</div>
        )}

        {success && successMessage && !error && (
          <div className={mergedClasses.success || undefined}>{successMessage}</div>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
