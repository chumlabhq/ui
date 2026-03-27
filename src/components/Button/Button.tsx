import { forwardRef, useCallback, useMemo } from "react";
import type {
  ButtonProps,
  ButtonClasses,
  ButtonAsButtonProps,
  ButtonAsAnchorProps,
  ButtonAsSpanProps,
  ButtonAsChildProps,
} from "./utils/types";
import {
  DEFAULT_BUTTON_CLASSES,
  UNSTYLED_BUTTON_CLASSES,
  HOVER_ANIMATION_MAP,
  CONTINUOUS_ANIMATION_MAP,
} from "./utils/constants";
import { CircularLoader } from "../Loader";
import { Tooltip } from "../Tooltip";
import { Slot } from "../../utils/Slot";
import { cn } from "../../utils/cn";
import { useReducedMotion } from "../../utils/useReducedMotion";

const Button = forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  const {
    children,
    startIcon,
    endIcon,
    loading = false,
    loadingText,
    loaderPosition = "right",
    loaderSize = 16,
    loader,
    fullWidth = false,
    asChild = false,
    classes: classesProp,
    unstyled = false,
    className,
    iconAnimation = "none",
    animateOnHover = true,
    animateIcon = "trailing",
    reduceMotion = "auto",
    tooltip,
    tooltipProps,
    ...rest
  } = props;

  const as =
    "asChild" in props && props.asChild ? undefined : (props.as ?? "button");
  const disabled = "disabled" in rest ? (rest.disabled ?? false) : false;
  const isDisabled = disabled || loading;

  const effectiveReduceMotion = useReducedMotion(reduceMotion);

  // ─── Merged classes system ──────────────────────────────────────────
  const baseClasses = unstyled ? UNSTYLED_BUTTON_CLASSES : DEFAULT_BUTTON_CLASSES;
  const mergedClasses: Required<ButtonClasses> = useMemo(
    () => ({
      root: classesProp?.root ?? baseClasses.root,
      content: classesProp?.content ?? baseClasses.content,
      startIcon: classesProp?.startIcon ?? baseClasses.startIcon,
      endIcon: classesProp?.endIcon ?? baseClasses.endIcon,
      loader: classesProp?.loader ?? baseClasses.loader,
    }),
    [classesProp, baseClasses],
  );

  const loaderElement = loader ?? (
    <CircularLoader size={loaderSize} thickness={2} aria-hidden="true" />
  );

  const displayContent = loading && loadingText ? loadingText : children;

  const effectiveAnimation = effectiveReduceMotion ? "none" : iconAnimation;

  const animationClasses = useMemo(() => {
    const map = animateOnHover ? HOVER_ANIMATION_MAP : CONTINUOUS_ANIMATION_MAP;
    const classes = effectiveAnimation !== "none" ? map[effectiveAnimation] : "";
    return {
      leading:
        (animateIcon === "leading" || animateIcon === "both") && classes
          ? classes
          : "",
      trailing:
        (animateIcon === "trailing" || animateIcon === "both") && classes
          ? classes
          : "",
    };
  }, [effectiveAnimation, animateOnHover, animateIcon]);

  const content = (
    <span className={mergedClasses.content || undefined}>
      {loaderPosition === "left" && loading && (
        <span className={mergedClasses.loader || undefined}>{loaderElement}</span>
      )}
      {startIcon && (
        <span className={cn(mergedClasses.startIcon, animationClasses.leading) || undefined}>
          {startIcon}
        </span>
      )}
      {displayContent}
      {endIcon && (
        <span className={cn(mergedClasses.endIcon, animationClasses.trailing) || undefined}>
          {endIcon}
        </span>
      )}
      {loaderPosition === "right" && loading && (
        <span className={mergedClasses.loader || undefined}>{loaderElement}</span>
      )}
    </span>
  );

  const combinedClassName = cn(
    mergedClasses.root,
    fullWidth && "w-full",
    effectiveAnimation !== "none" && "group",
    className,
  );

  const dataProps = {
    "aria-busy": loading || undefined,
    "aria-disabled": isDisabled || undefined,
    "data-loading": loading || undefined,
    "data-disabled": isDisabled || undefined,
    "data-full-width": fullWidth || undefined,
  };

  // Stable disabled click handler — shared across all paths
  const handleDisabledClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const wrapWithTooltip = (element: React.ReactElement) => {
    if (!tooltip) return element;
    return (
      <Tooltip
        content={tooltip}
        side={tooltipProps?.side}
        align={tooltipProps?.align}
        sideOffset={tooltipProps?.sideOffset}
        maxWidth={tooltipProps?.maxWidth}
        delayDuration={tooltipProps?.delayDuration}
        showArrow={tooltipProps?.showArrow}
        classes={tooltipProps?.contentClassName ? { content: tooltipProps.contentClassName } : undefined}
        contentStyle={tooltipProps?.contentStyle}
        asChild
      >
        {element}
      </Tooltip>
    );
  };

  // ─── asChild ────────────────────────────────────────────────────────
  if (asChild && children) {
    const { onClick: childOnClick, ...childRest } = rest as ButtonAsChildProps;

    return wrapWithTooltip(
      <Slot
        ref={ref}
        className={combinedClassName || undefined}
        onClick={
          isDisabled
            ? handleDisabledClick
            : (childOnClick as React.MouseEventHandler<HTMLElement> | undefined)
        }
        {...dataProps}
        {...childRest}
        aria-disabled={isDisabled || undefined}
      >
        {children}
      </Slot>,
    );
  }

  // ─── as="a" ─────────────────────────────────────────────────────────
  if (as === "a") {
    const {
      href,
      target,
      rel,
      onClick,
      style,
      disabled: _anchorDisabled,
      ...anchorRest
    } = rest as ButtonAsAnchorProps & { disabled?: boolean };
    void _anchorDisabled;

    return wrapWithTooltip(
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={isDisabled ? undefined : href}
        target={isDisabled ? undefined : target}
        rel={isDisabled ? undefined : rel}
        tabIndex={isDisabled ? -1 : undefined}
        onClick={isDisabled ? handleDisabledClick : onClick}
        className={combinedClassName || undefined}
        style={style}
        {...dataProps}
        {...anchorRest}
      >
        {content}
      </a>,
    );
  }

  // ─── as="span" ──────────────────────────────────────────────────────
  if (as === "span") {
    const {
      onClick,
      style,
      disabled: _spanDisabled,
      ...spanRest
    } = rest as ButtonAsSpanProps & { disabled?: boolean };
    void _spanDisabled;

    return wrapWithTooltip(
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            (onClick as React.MouseEventHandler<HTMLSpanElement> | undefined)?.(
              e as unknown as React.MouseEvent<HTMLSpanElement>,
            );
          }
        }}
        className={combinedClassName || undefined}
        style={style}
        onClick={isDisabled ? undefined : (onClick as React.MouseEventHandler<HTMLSpanElement>)}
        {...dataProps}
        {...spanRest}
      >
        {content}
      </span>,
    );
  }

  // ─── as="button" (default) ──────────────────────────────────────────
  const {
    type: buttonType,
    onClick,
    style,
    ...buttonRest
  } = rest as ButtonAsButtonProps;

  return wrapWithTooltip(
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={buttonType ?? "button"}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      className={combinedClassName || undefined}
      style={style}
      {...dataProps}
      {...buttonRest}
    >
      {content}
    </button>,
  );
});

Button.displayName = "Button";

export default Button;
