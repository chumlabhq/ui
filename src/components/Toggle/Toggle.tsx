import { forwardRef, useCallback, useMemo } from "react";
import type { ToggleProps, ToggleClasses } from "./utils/types";
import {
  DEFAULT_TOGGLE_CLASSES,
  UNSTYLED_TOGGLE_CLASSES,
  SIZE_MAP,
} from "./utils/constants";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../utils/useControllableState";
import { useReducedMotion } from "../../utils/useReducedMotion";

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>((props, ref) => {
  const {
    children,
    pressed: pressedProp,
    defaultPressed = false,
    onPressedChange,
    disabled = false,
    loading = false,
    size = "md",
    classes: classesProp,
    unstyled = false,
    reduceMotion = "auto",
    className,
    onClick,
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  const [pressed, setPressed] = useControllableState<boolean>({
    value: pressedProp,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });

  const effectiveReduceMotion = useReducedMotion(reduceMotion);

  // ─── Merged classes system ──────────────────────────────────────────
  const baseClasses = unstyled
    ? UNSTYLED_TOGGLE_CLASSES
    : DEFAULT_TOGGLE_CLASSES;
  const mergedClasses: Required<ToggleClasses> = useMemo(
    () => ({
      root: classesProp?.root ?? baseClasses.root,
      content: classesProp?.content ?? baseClasses.content,
      icon: classesProp?.icon ?? baseClasses.icon,
    }),
    [classesProp, baseClasses],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      setPressed(!pressed);
      onClick?.(e);
    },
    [isDisabled, pressed, setPressed, onClick],
  );

  const combinedClassName = cn(
    mergedClasses.root,
    !unstyled && SIZE_MAP[size],
    !effectiveReduceMotion && "transition-colors",
    className,
  );

  return (
    <button
      ref={ref}
      type="button"
      disabled={isDisabled}
      aria-pressed={pressed}
      onClick={handleClick}
      className={combinedClassName || undefined}
      data-pressed={pressed || undefined}
      data-disabled={isDisabled || undefined}
      data-size={size || undefined}
      data-loading={loading || undefined}
      {...rest}
    >
      <span className={mergedClasses.content || undefined}>{children}</span>
    </button>
  );
});

Toggle.displayName = "Toggle";

export default Toggle;
