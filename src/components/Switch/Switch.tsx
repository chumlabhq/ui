import { useId, useMemo, forwardRef, useCallback } from "react";
import type { SwitchProps, SwitchClasses, SwitchRenderProps } from "./utils/types";
import { DEFAULT_SWITCH_CLASSES, UNSTYLED_SWITCH_CLASSES } from "./utils/constants";
import { useControllableState } from "../../utils/useControllableState";
import { cn } from "../../utils/cn";

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
      classes: classesProp,
      unstyled = false,
      checkedIcon,
      uncheckedIcon,
      transitionDuration,
      transitionTimingFunction,
      renderLabel,
      renderDescription,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...buttonProps
    },
    ref,
  ) => {
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
      }),
      [classesProp, baseClasses],
    );

    const renderProps: SwitchRenderProps = useMemo(
      () => ({ checked: isChecked, disabled, error, switchId, descriptionId }),
      [isChecked, disabled, error, switchId, descriptionId],
    );

    const transitionStyle = useMemo(() => {
      if (!transitionDuration && !transitionTimingFunction) return undefined;
      return {
        transitionDuration: transitionDuration
          ? `${transitionDuration}ms`
          : undefined,
        transitionTimingFunction: transitionTimingFunction,
      };
    }, [transitionDuration, transitionTimingFunction]);

    const hasLabelContent =
      label || description || renderLabel || renderDescription;

    return (
      <div
        className={cn(mergedClasses.root, className) || undefined}
        data-disabled={disabled || undefined}
        data-checked={isChecked || undefined}
        data-error={error || undefined}
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
            aria-disabled={disabled || undefined}
            aria-required={required || undefined}
            disabled={disabled}
            onClick={handleToggle}
            className={cn(
              mergedClasses.tracker,
              disabled && mergedClasses.disabledTracker,
              isChecked ? mergedClasses.checkedTracker : mergedClasses.uncheckedTracker,
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
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
