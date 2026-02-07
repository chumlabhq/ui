import {
  forwardRef,
  cloneElement,
  isValidElement,
  useMemo,
  type ReactElement,
} from "react";
import type { ButtonProps, IconAnimation } from "./types";
import { CircularLoader } from "../Loader";
import { Tooltip } from "../Tooltip";
import { cn } from "../../utils/cn";

const BASE_TRANSITION = "transition-transform duration-200";

const HOVER_ANIMATION_MAP: Record<IconAnimation, string> = {
  none: "",
  slideRight: `${BASE_TRANSITION} group-hover:translate-x-1`,
  slideLeft: `${BASE_TRANSITION} group-hover:-translate-x-1`,
  slideUp: `${BASE_TRANSITION} group-hover:-translate-y-1`,
  slideDown: `${BASE_TRANSITION} group-hover:translate-y-1`,
  bounce: `${BASE_TRANSITION} group-hover:animate-bounce`,
  pulse: `${BASE_TRANSITION} group-hover:animate-pulse`,
  spin: `${BASE_TRANSITION} group-hover:animate-spin`,
};

const CONTINUOUS_ANIMATION_MAP: Record<IconAnimation, string> = {
  none: "",
  slideRight: `${BASE_TRANSITION} animate-slide-right`,
  slideLeft: `${BASE_TRANSITION} animate-slide-left`,
  slideUp: `${BASE_TRANSITION} animate-slide-up`,
  slideDown: `${BASE_TRANSITION} animate-slide-down`,
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin",
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

  const animationClasses = useMemo(() => {
    const map = animateOnHover ? HOVER_ANIMATION_MAP : CONTINUOUS_ANIMATION_MAP;
    const classes = iconAnimation !== "none" ? map[iconAnimation] : "";
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
  }, [iconAnimation, animateOnHover, animateIcon]);

  const content = (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-2",
        contentClassName,
      )}
    >
      {loaderPosition === "left" && isLoading && loaderElement}
      {leadingIcon && (
        <span
          className={cn("inline-flex shrink-0", animationClasses.leading)}
        >
          {leadingIcon}
        </span>
      )}
      {displayContent}
      {trailingIcon && (
        <span
          className={cn("inline-flex shrink-0", animationClasses.trailing)}
        >
          {trailingIcon}
        </span>
      )}
      {loaderPosition === "right" && isLoading && loaderElement}
    </span>
  );

  const combinedClassName = cn(
    className,
    fullWidth && "w-full",
    iconAnimation !== "none" && "group",
  );

  // Memoize aria/data prop filtering to avoid allocation on every render
  const ariaAndDataProps = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(rest).filter(
          ([key]) => key.startsWith("aria-") || key.startsWith("data-"),
        ),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(rest)],
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
