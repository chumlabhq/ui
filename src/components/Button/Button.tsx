import { forwardRef, useMemo } from "react";
import type { ButtonHTMLAttributes } from "react";
import type { ButtonProps } from "./utils/types";
import {
  HOVER_ANIMATION_MAP,
  CONTINUOUS_ANIMATION_MAP,
} from "./utils/constants";
import { CircularLoader } from "../Loader";
import { Tooltip } from "../Tooltip";
import { Slot } from "../../utils/Slot";
import { cn } from "../../utils/cn";

const Button = forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  const {
    children,
    leadingIcon,
    trailingIcon,
    loading = false,
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
    ...rest
  } = props;

  const as =
    "asChild" in props && props.asChild ? undefined : (props.as ?? "button");
  const disabled = "disabled" in rest ? (rest.disabled ?? false) : false;
  const isDisabled = disabled || loading;

  const loaderElement = loader ?? (
    <CircularLoader size={loaderSize} thickness={2} aria-hidden="true" />
  );

  const displayContent = loading && loadingText ? loadingText : children;

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
      {loaderPosition === "left" && loading && loaderElement}
      {leadingIcon && (
        <span className={cn("inline-flex shrink-0", animationClasses.leading)}>
          {leadingIcon}
        </span>
      )}
      {displayContent}
      {trailingIcon && (
        <span className={cn("inline-flex shrink-0", animationClasses.trailing)}>
          {trailingIcon}
        </span>
      )}
      {loaderPosition === "right" && loading && loaderElement}
    </span>
  );

  const combinedClassName = cn(
    fullWidth && "w-full",
    iconAnimation !== "none" && "group",
    className,
  );

  const dataProps = {
    "aria-busy": loading || undefined,
    "aria-disabled": isDisabled || undefined,
    "data-loading": loading || undefined,
    "data-disabled": isDisabled || undefined,
    "data-full-width": fullWidth || undefined,
  };

  const tooltipWrap = (element: React.ReactElement) =>
    tooltip ? (
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
        asChild
      >
        {element}
      </Tooltip>
    ) : (
      element
    );

  if (asChild && children) {
    const { onClick: asChildOnClick, ...asChildRest } = rest as Record<
      string,
      unknown
    >;
    const handleDisabledClick = (e: React.MouseEvent) => {
      e.preventDefault();
    };
    const slotElement = (
      <Slot
        ref={ref}
        className={combinedClassName || undefined}
        onClick={
          isDisabled
            ? handleDisabledClick
            : (asChildOnClick as
                | React.MouseEventHandler<HTMLElement>
                | undefined)
        }
        {...dataProps}
        {...asChildRest}
        aria-disabled={isDisabled || undefined}
      >
        {children}
      </Slot>
    );

    return tooltip ? (
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
        asChild
      >
        {slotElement}
      </Tooltip>
    ) : (
      slotElement
    );
  }

  if (as === "a") {
    const {
      href,
      target,
      rel,
      onClick,
      style,
      ...anchorRest
    } = rest as Record<string, unknown>;
    delete anchorRest.disabled;

    const handleAnchorClick = isDisabled
      ? (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()
      : (onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined);

    const anchorElement = (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={isDisabled ? undefined : (href as string)}
        target={target as string}
        rel={rel as string}
        tabIndex={isDisabled ? -1 : undefined}
        onClick={handleAnchorClick}
        className={combinedClassName || undefined}
        style={style as React.CSSProperties}
        {...dataProps}
        {...(anchorRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );

    return tooltipWrap(anchorElement);
  }

  if (as === "span") {
    const { onClick, style, ...spanRest } = rest as Record<string, unknown>;
    const handleSpanClick = onClick as
      | React.MouseEventHandler<HTMLSpanElement>
      | undefined;

    const spanElement = (
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
        className={combinedClassName || undefined}
        style={style as React.CSSProperties}
        onClick={isDisabled ? undefined : handleSpanClick}
        {...dataProps}
        {...(spanRest as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {content}
      </span>
    );

    return tooltipWrap(spanElement);
  }

  const {
    type: buttonType,
    onClick,
    style,
    ...buttonRest
  } = rest as ButtonHTMLAttributes<HTMLButtonElement> & Record<string, unknown>;
  const type: "button" | "submit" | "reset" = buttonType ?? "button";

  const buttonElement = (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      className={combinedClassName || undefined}
      style={style as React.CSSProperties}
      {...dataProps}
      {...(buttonRest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );

  return tooltipWrap(buttonElement);
});

Button.displayName = "Button";

export default Button;
