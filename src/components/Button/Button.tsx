import {
  forwardRef,
  cloneElement,
  isValidElement,
  type ReactElement,
} from "react";
import type { ButtonProps, IconAnimation } from "./types";
import { CircularLoader } from "../Loader";
import { Tooltip } from "../Tooltip";
import { cn } from "../../utils/cn";

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
  const {
    as = "button",
    children,
    leadingIcon,
    trailingIcon,
    isLoading = false,
    loadingText,
    loaderPosition = "right",
    loaderSize = 16,
    loader,
    fullWidth = false,
    asChild = false,
    className,
    contentClassName,
    iconAnimation = "none",
    animateOnHover = true,
    animateIcon = "trailing",
    tooltip,
    tooltipProps,
    onClick,
    type: buttonType,
    disabled: disabledProp,
    href,
    target,
    rel,
    ...rest
  } = props;

  const type: "button" | "submit" | "reset" =
    as === "button" ? (buttonType ?? "button") : "button";
  const disabled = disabledProp ?? false;

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
    <span className={cn("inline-flex items-center justify-center gap-2", contentClassName)}>
      {loaderPosition === "left" && isLoading && loaderElement}
      {leadingIcon && (
        <span className={cn("inline-flex shrink-0", leadingAnimationClasses)}>
          {leadingIcon}
        </span>
      )}
      {displayContent}
      {trailingIcon && (
        <span className={cn("inline-flex shrink-0", trailingAnimationClasses)}>
          {trailingIcon}
        </span>
      )}
      {loaderPosition === "right" && isLoading && loaderElement}
    </span>
  );

  const combinedClassName = cn(
    className,
    fullWidth && "w-full",
    iconAnimation !== "none" && "group"
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      onClick?: typeof onClick;
    }>;
    return cloneElement(child, {
      className: cn(combinedClassName, child.props.className),
      onClick: isDisabled ? undefined : onClick,
    });
  }

  const commonProps = {
    className: combinedClassName || undefined,
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

  if (as === "a" && href) {
    const handleAnchorClick = isDisabled
      ? (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()
      : (onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined);
    const ariaAndDataProps = Object.fromEntries(
      Object.entries(rest).filter(
        ([key]) => key.startsWith("aria-") || key.startsWith("data-"),
      ),
    );
    return wrapWithTooltip(
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onClick={handleAnchorClick}
        aria-busy={isLoading || undefined}
        aria-disabled={isDisabled || undefined}
        data-loading={isLoading || undefined}
        data-disabled={isDisabled || undefined}
        data-full-width={fullWidth || undefined}
        className={combinedClassName || undefined}
        {...ariaAndDataProps}
      >
        {content}
      </a>,
    );
  }

  if (as === "span") {
    const handleSpanClick = onClick as
      | React.MouseEventHandler<HTMLSpanElement>
      | undefined;
    const ariaAndDataProps = Object.fromEntries(
      Object.entries(rest).filter(
        ([key]) => key.startsWith("aria-") || key.startsWith("data-"),
      ),
    );
    return wrapWithTooltip(
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleSpanClick?.(
              e as unknown as React.MouseEvent<HTMLSpanElement>,
            );
          }
        }}
        {...commonProps}
        onClick={isDisabled ? undefined : handleSpanClick}
        {...ariaAndDataProps}
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
      {...rest}
    >
      {content}
    </button>,
  );
});

Button.displayName = "Button";

export default Button;
