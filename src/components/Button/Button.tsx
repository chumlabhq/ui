import {
  forwardRef,
  cloneElement,
  isValidElement,
  type ReactElement,
  type MouseEventHandler,
} from "react";
import type { ButtonProps, IconAnimation } from "./types";
import { CircularLoader } from "../Loader";
import { Tooltip } from "../Tooltip";

const getIconAnimationClasses = (
  animation: IconAnimation,
  animateOnHover: boolean,
): string => {
  const baseClasses = "transition-transform duration-200";

  const animationMap: Record<IconAnimation, string> = {
    none: "",
    slideRight: animateOnHover
      ? `${baseClasses} group-hover:translate-x-1`
      : `${baseClasses} animate-slide-right`,
    slideLeft: animateOnHover
      ? `${baseClasses} group-hover:-translate-x-1`
      : `${baseClasses} animate-slide-left`,
    slideUp: animateOnHover
      ? `${baseClasses} group-hover:-translate-y-1`
      : `${baseClasses} animate-slide-up`,
    slideDown: animateOnHover
      ? `${baseClasses} group-hover:translate-y-1`
      : `${baseClasses} animate-slide-down`,
    bounce: animateOnHover
      ? `${baseClasses} group-hover:animate-bounce`
      : "animate-bounce",
    pulse: animateOnHover
      ? `${baseClasses} group-hover:animate-pulse`
      : "animate-pulse",
    spin: animateOnHover
      ? `${baseClasses} group-hover:animate-spin`
      : "animate-spin",
  };

  return animationMap[animation] || "";
};

const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement,
  ButtonProps
>((props, ref) => {
  // Extract common props with defaults
  const as = props.as ?? "button";
  const children = props.children;
  const leadingIcon = props.leadingIcon;
  const trailingIcon = props.trailingIcon;
  const isLoading = props.isLoading ?? false;
  const loadingText = props.loadingText;
  const loaderPosition = props.loaderPosition ?? "right";
  const loaderSize = props.loaderSize ?? 16;
  const loader = props.loader;
  const fullWidth = props.fullWidth ?? false;
  const asChild = props.asChild ?? false;
  const className = props.className ?? "";
  const contentClassName =
    props.contentClassName ?? "inline-flex items-center justify-center gap-2";
  const iconAnimation = props.iconAnimation ?? "none";
  const animateOnHover = props.animateOnHover ?? true;
  const animateIcon = props.animateIcon ?? "trailing";
  const tooltip = props.tooltip;
  const tooltipProps = props.tooltipProps;
  const onClick = props.onClick as MouseEventHandler<HTMLElement> | undefined;

  // Get type and disabled based on element type
  const type: "button" | "submit" | "reset" | undefined =
    as === "button" && "type" in props
      ? ((props.type as "button" | "submit" | "reset") ?? "button")
      : "button";
  const disabled =
    as === "button" && "disabled" in props ? (props.disabled ?? false) : false;

  const isDisabled = disabled || isLoading;

  const loaderElement = loader ?? (
    <CircularLoader size={loaderSize} thickness={2} aria-hidden="true" />
  );

  const displayContent = isLoading && loadingText ? loadingText : children;

  const shouldAnimateLeading =
    animateIcon === "leading" || animateIcon === "both";
  const shouldAnimateTrailing =
    animateIcon === "trailing" || animateIcon === "both";

  const leadingAnimationClasses =
    shouldAnimateLeading && iconAnimation !== "none"
      ? getIconAnimationClasses(iconAnimation, animateOnHover)
      : "";

  const trailingAnimationClasses =
    shouldAnimateTrailing && iconAnimation !== "none"
      ? getIconAnimationClasses(iconAnimation, animateOnHover)
      : "";

  const content = (
    <span className={contentClassName}>
      {loaderPosition === "left" && isLoading && loaderElement}
      {leadingIcon && (
        <span className={`inline-flex shrink-0 ${leadingAnimationClasses}`}>
          {leadingIcon}
        </span>
      )}
      {displayContent}
      {trailingIcon && (
        <span className={`inline-flex shrink-0 ${trailingAnimationClasses}`}>
          {trailingIcon}
        </span>
      )}
      {loaderPosition === "right" && isLoading && loaderElement}
    </span>
  );

  const fullWidthClass = fullWidth ? "w-full" : "";
  const groupClass = iconAnimation !== "none" ? "group" : "";
  const combinedClassName = [className, fullWidthClass, groupClass]
    .filter(Boolean)
    .join(" ");

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      onClick?: typeof onClick;
    }>;
    return cloneElement(child, {
      className: [combinedClassName, child.props.className]
        .filter(Boolean)
        .join(" "),
      onClick: isDisabled ? undefined : onClick,
    });
  }

  const commonProps = {
    className: combinedClassName,
    onClick: isDisabled ? undefined : onClick,
    "aria-busy": isLoading || undefined,
    "aria-disabled": isDisabled || undefined,
    "data-loading": isLoading || undefined,
    "data-disabled": isDisabled || undefined,
    "data-full-width": fullWidth || undefined,
  };

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
        contentClassName={tooltipProps?.contentClassName}
        contentStyle={tooltipProps?.contentStyle}
      >
        {element}
      </Tooltip>
    );
  };

  if (as === "a" && props.href) {
    return wrapWithTooltip(
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={props.href}
        target={props.target}
        rel={props.rel}
        {...commonProps}
      >
        {content}
      </a>,
    );
  }

  if (as === "span") {
    return wrapWithTooltip(
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        {...commonProps}
      >
        {content}
      </span>,
    );
  }

  return wrapWithTooltip(
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={isDisabled}
      {...commonProps}
    >
      {content}
    </button>,
  );
});

Button.displayName = "Button";

export default Button;
