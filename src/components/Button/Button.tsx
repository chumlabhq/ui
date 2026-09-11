import { forwardRef, useCallback, useMemo } from "react";
import type {
  ButtonProps,
  ButtonClasses,
  ButtonAsButtonProps,
  ButtonAsAnchorProps,
  ButtonAsSpanProps,
  ButtonAsChildProps,
} from "./utils/types.js";
import {
  DEFAULT_BUTTON_CLASSES,
  UNSTYLED_BUTTON_CLASSES,
  HOVER_ANIMATION_MAP,
  CONTINUOUS_ANIMATION_MAP,
  BUTTON_SIZE_CLASSES,
  BUTTON_LOADER_SIZE,
  DEFAULT_BUTTON_SIZE,
} from "./utils/constants.js";
import { CircularLoader } from "../Loader/index.js";
import { Tooltip } from "../Tooltip/index.js";
import { Slot } from "../../utils/Slot.js";
import { cn } from "../../utils/scopedCn.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";

import { motionSafeClasses, structuralOnly } from "../../utils/classLayers.js";
/**
 * Component: Button
 *
 * Purpose:
 * A polymorphic, accessible button rendering as `<button>`, `<a>`, or `<span>`.
 * Provides structural defaults (padding, focus ring, disabled) — visual theme
 * is applied via className.
 *
 * AI Usage Guidelines:
 * - Always pass className for visual styling — defaults have no colors
 * - Use as="a" with href for links, as="span" for non-semantic triggers
 * - Use startIcon/endIcon for icons, loading for async states
 * - See "Common variant recipes" in BUTTON.ai.md for copy-paste className values
 *
 * Behavior:
 * - className merges after defaults: cn(classes.root, fullWidth, group, className)
 * - loading=true auto-disables and shows spinner
 * - Icon animations via iconAnimation prop (hover or continuous)
 *
 * Reference:
 * - BUTTON.ai.md (this directory) — full AI knowledge doc with variant recipes and patterns
 * - src/pages/demo/ButtonDemo.tsx — live demo with all features implemented
 */
const Button = forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  const {
    children,
    size,
    startIcon,
    endIcon,
    loading = false,
    loadingText,
    loaderPosition = "right",
    loaderSize,
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

  const prefersReducedMotionForClasses = useReducedMotion(reduceMotion);

  const baseClassesRaw = unstyled ? UNSTYLED_BUTTON_CLASSES : DEFAULT_BUTTON_CLASSES;
  const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotionForClasses);
  // Resolved even when `size` is absent, so an unset prop paints `md` — which
  // is the button as it was. `data-size` below stays absent in that case: the
  // attribute reports what the consumer asked for, not what was rendered.
  const sizeClassesRaw = BUTTON_SIZE_CLASSES[size ?? DEFAULT_BUTTON_SIZE];
  const sizeClasses = unstyled ? structuralOnly(sizeClassesRaw) : sizeClassesRaw;
  const mergedClasses: Required<ButtonClasses> = useMemo(
    () => ({
      // Size BEFORE the consumer's classes, in the same tailwind-merge groups:
      // `px-6` loses to their `px-8`, `text-base` to their `text-lg`. Written
      // as `data-[size=lg]:px-6` it would have survived their class and won at
      // paint time, which is how `border-none` beat a consumer's `border`.
      root: cn(baseClasses.root, sizeClasses.root, classesProp?.root),
      itemText: cn(baseClasses.itemText, sizeClasses.itemText, classesProp?.itemText),
      icon: cn(baseClasses.icon, sizeClasses.icon, classesProp?.icon),
      loading: cn(baseClasses.loading, classesProp?.loading),
    }),
    [classesProp, baseClasses, sizeClasses],
  );
  const resolvedLoaderSize = loaderSize ?? BUTTON_LOADER_SIZE[size ?? DEFAULT_BUTTON_SIZE];

  // The loader takes the button's own text colour, not the accent it paints
  // standalone. On a primary button the two were the same value — the spinner
  // measured rgb(91,155,255) on a rgb(91,155,255) background, 1.00:1 — so the
  // two captions that exist to demonstrate `loaderPosition` were the only two
  // with no visible loader. A caller passing `loader` keeps whatever it paints.
  const loaderElement = loader ?? (
    <CircularLoader
      size={resolvedLoaderSize}
      thickness={2}
      classes={{ root: "text-current" }}
      aria-hidden="true"
    />
  );

  const loadingAnnouncement = loading ? (
    <span
      role="status"
      aria-live="polite"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      Loading
    </span>
  ) : null;

  const displayContent = loading && loadingText ? loadingText : children;

  const effectiveAnimation = effectiveReduceMotion ? "none" : iconAnimation;

  const animationClasses = useMemo(() => {
    // No motionSafeClasses here: `effectiveAnimation` above is already forced to
    // "none" under reduced motion, so the map never reaches the DOM.
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
    <span className={mergedClasses.itemText || undefined}>
      {loadingAnnouncement}
      {loaderPosition === "left" && loading && (
        <span className={mergedClasses.loading || undefined}>{loaderElement}</span>
      )}
      {startIcon && (
        <span aria-hidden="true" className={cn(mergedClasses.icon, animationClasses.leading) || undefined}>
          {startIcon}
        </span>
      )}
      {displayContent}
      {endIcon && (
        <span aria-hidden="true" className={cn(mergedClasses.icon, animationClasses.trailing) || undefined}>
          {endIcon}
        </span>
      )}
      {loaderPosition === "right" && loading && (
        <span className={mergedClasses.loading || undefined}>{loaderElement}</span>
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
    "data-size": size || undefined,
  };

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

  if (as === "span") {
    const {
      onClick,
      style,
      disabled: _spanDisabled,
      ...spanRest
    } = rest as ButtonAsSpanProps & { disabled?: boolean };

    if (import.meta.env.DEV) {
      const hasAriaLabel =
        "aria-label" in (rest as Record<string, unknown>) ||
        "aria-labelledby" in (rest as Record<string, unknown>);
      if (!children && !hasAriaLabel) {
        console.warn(
          'Button: A <span role="button"> without text content should have an `aria-label` or `aria-labelledby` attribute for accessibility.',
        );
      }
    }

    return wrapWithTooltip(
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === " ") {
            e.preventDefault();
          }
          if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
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
