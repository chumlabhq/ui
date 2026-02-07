import { useId, useMemo, forwardRef, useCallback } from "react";
import type { SwitchProps, SwitchRenderProps } from "./types";
import { useControllableState } from "../../utils/useControllableState";
import { cn } from "../../utils/cn";

const defaultStyles = {
  container: "gap-3",
  label: "text-sm font-medium text-gray-700",
  disabledLabel: "text-gray-400",
  description: "text-xs text-gray-500",
  tracker:
    "h-5 w-9 rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
  disabledTracker: "opacity-50",
  thumb:
    "h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 motion-reduce:transition-none",
  checkedTracker: "bg-blue-600",
  uncheckedTracker: "bg-gray-300",
  checkedThumb: "translate-x-4.5",
  uncheckedThumb: "translate-x-0.5",
};

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
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
      description || renderDescription ? `${switchId}-desc` : undefined;

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

    const hasLabelContent =
      label || description || renderLabel || renderDescription;

    return (
      <div
        className={cn(
          "flex items-center",
          defaultStyles.container,
          containerClassName,
        )}
        data-disabled={disabled || undefined}
        data-checked={isChecked || undefined}
        data-error={error || undefined}
      >
        {hasLabelContent && (
          <div className={cn("flex flex-col", labelContainerClassName)}>
            {renderLabel
              ? renderLabel(renderProps)
              : label && (
                  <label
                    htmlFor={switchId}
                    className={cn(
                      "cursor-pointer",
                      disabled && "cursor-not-allowed",
                      defaultStyles.label,
                      labelClassName,
                      disabled && defaultStyles.disabledLabel,
                      disabled && disabledLabelClassName,
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
                    descriptionClassName,
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
            trackerClassName,
            disabled && defaultStyles.disabledTracker,
            disabled && disabledTrackerClassName,
            isChecked
              ? defaultStyles.checkedTracker
              : defaultStyles.uncheckedTracker,
            isChecked ? checkedTrackerClassName : uncheckedTrackerClassName,
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
              thumbClassName,
              isChecked
                ? defaultStyles.checkedThumb
                : defaultStyles.uncheckedThumb,
              isChecked ? checkedThumbClassName : uncheckedThumbClassName,
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

        {error && errorMessage && (
          <div id={errorId} role="alert" className={errorClassName}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
