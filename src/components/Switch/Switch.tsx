import { useId, useMemo, forwardRef, useCallback } from "react";
import type { SwitchProps, SwitchRenderProps } from "./utils/types";
import { defaultStyles } from "./utils/constants";
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
      classes,
      errorClassName,
      containerClassName,
      labelContainerClassName,
      labelClassName,
      disabledLabelClassName,
      descriptionClassName,
      trackerClassName,
      disabledTrackerClassName,
      thumbClassName,
      checkedTrackerClassName,
      uncheckedTrackerClassName,
      checkedThumbClassName,
      uncheckedThumbClassName,
      checkedIcon,
      uncheckedIcon,
      transitionDuration,
      transitionTimingFunction,
      renderLabel,
      renderDescription,
      "aria-label": ariaLabel,
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

    const renderProps: SwitchRenderProps = useMemo(
      () => ({ checked: isChecked, disabled, switchId, descriptionId }),
      [isChecked, disabled, switchId, descriptionId],
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

    const rContainerClassName = containerClassName ?? classes?.root;
    const rLabelContainerClassName = labelContainerClassName ?? classes?.labelContainer;
    const rLabelClassName = labelClassName ?? classes?.label;
    const rDisabledLabelClassName = disabledLabelClassName ?? classes?.disabledLabel;
    const rDescriptionClassName = descriptionClassName ?? classes?.description;
    const rTrackerClassName = trackerClassName ?? classes?.tracker;
    const rDisabledTrackerClassName = disabledTrackerClassName ?? classes?.disabledTracker;
    const rThumbClassName = thumbClassName ?? classes?.thumb;
    const rCheckedTrackerClassName = checkedTrackerClassName ?? classes?.checkedTracker;
    const rUncheckedTrackerClassName = uncheckedTrackerClassName ?? classes?.uncheckedTracker;
    const rCheckedThumbClassName = checkedThumbClassName ?? classes?.checkedThumb;
    const rUncheckedThumbClassName = uncheckedThumbClassName ?? classes?.uncheckedThumb;
    const rErrorClassName = errorClassName ?? classes?.error;

    const hasLabelContent =
      label || description || renderLabel || renderDescription;

    return (
      <div
        className={cn("flex flex-col", rContainerClassName, className)}
        data-disabled={disabled || undefined}
        data-checked={isChecked || undefined}
        data-error={error || undefined}
      >
        <div
          className={cn(
            "flex items-center",
            defaultStyles.container,
          )}
        >
          {hasLabelContent && (
            <div className={cn("flex flex-col", rLabelContainerClassName)}>
              {renderLabel
                ? renderLabel(renderProps)
                : label && (
                    <label
                      htmlFor={switchId}
                      className={cn(
                        "cursor-pointer",
                        disabled && "cursor-not-allowed",
                        defaultStyles.label,
                        rLabelClassName,
                        disabled && defaultStyles.disabledLabel,
                        disabled && rDisabledLabelClassName,
                      )}
                    >
                      {label}
                    </label>
                  )}
              {renderDescription ? (
                <span id={descriptionId}>{renderDescription(renderProps)}</span>
              ) : (
                description && (
                  <span
                    id={descriptionId}
                    className={cn(
                      defaultStyles.description,
                      rDescriptionClassName,
                    )}
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
              "relative inline-flex items-center",
              disabled ? "cursor-not-allowed" : "cursor-pointer",
              defaultStyles.tracker,
              rTrackerClassName,
              disabled && defaultStyles.disabledTracker,
              disabled && rDisabledTrackerClassName,
              isChecked
                ? defaultStyles.checkedTracker
                : defaultStyles.uncheckedTracker,
              isChecked ? rCheckedTrackerClassName : rUncheckedTrackerClassName,
            )}
            style={transitionStyle}
            data-disabled={disabled || undefined}
            data-checked={isChecked || undefined}
            {...buttonProps}
          >
            <span
              className={cn(
                "inline-flex items-center justify-center transform",
                defaultStyles.thumb,
                rThumbClassName,
                isChecked
                  ? defaultStyles.checkedThumb
                  : defaultStyles.uncheckedThumb,
                isChecked ? rCheckedThumbClassName : rUncheckedThumbClassName,
              )}
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
          <div id={errorId} role="alert" className={rErrorClassName}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
