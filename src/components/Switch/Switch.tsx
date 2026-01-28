import { useId } from "react";
import type { SwitchProps } from "./types";

const Switch: React.FC<SwitchProps> = ({
  label,
  description,
  isChecked = false,
  handleToggle,
  id,
  disabled = false,
  containerClassName = "",
  labelContainerClassName = "",
  labelClassName = "",
  descriptionClassName = "",
  trackerClassName = "",
  thumbClassName = "",
  checkedTrackerClassName = "",
  uncheckedTrackerClassName = "",
  checkedThumbClassName = "",
  uncheckedThumbClassName = "",
  checkedIcon,
  uncheckedIcon,
}) => {
  const generatedId = useId();
  const switchId = id || generatedId;
  const descriptionId = description ? `${switchId}-desc` : undefined;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      handleToggle?.();
    }
  };

  return (
    <div
      className={containerClassName}
      data-disabled={disabled || undefined}
      data-checked={isChecked || undefined}
    >
      {(label || description) && (
        <div className={labelContainerClassName}>
          {label && (
            <label htmlFor={switchId} className={labelClassName}>
              {label}
            </label>
          )}
          {description && (
            <span id={descriptionId} className={descriptionClassName}>
              {description}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={isChecked}
        aria-describedby={descriptionId}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={[
          trackerClassName,
          isChecked ? checkedTrackerClassName : uncheckedTrackerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        data-disabled={disabled || undefined}
        data-checked={isChecked || undefined}
      >
        <span
          className={[
            thumbClassName,
            isChecked ? checkedThumbClassName : uncheckedThumbClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isChecked ? checkedIcon : uncheckedIcon}
        </span>
      </button>
    </div>
  );
};

Switch.displayName = "Switch";

export default Switch;
