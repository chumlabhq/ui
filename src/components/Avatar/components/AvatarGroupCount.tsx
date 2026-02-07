import { forwardRef, useMemo } from "react";
import type { AvatarGroupCountProps, AvatarTooltipConfig } from "../types";
import { Tooltip } from "../../Tooltip";
import { Slot } from "../../../utils/Slot";
import { DEFAULT_SIZE, DEFAULT_SHAPE } from "../utils/constants";
import {
  getNumericSize,
  getFontSize,
  getBorderRadius,
  parseBorder,
} from "../utils/helpers";
import { cn } from "../../../utils/cn";

const isTooltipConfig = (tooltip: unknown): tooltip is AvatarTooltipConfig => {
  return (
    typeof tooltip === "object" && tooltip !== null && "content" in tooltip
  );
};

const variantClassNames = {
  solid:
    "font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 select-none px-2",
  outline:
    "font-medium border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-transparent select-none px-2",
  ghost: "font-medium text-gray-600 dark:text-gray-300 select-none px-2",
};

export const AvatarGroupCount = forwardRef<
  HTMLDivElement,
  AvatarGroupCountProps
>(
  (
    {
      count,
      size = DEFAULT_SIZE,
      shape = DEFAULT_SHAPE,
      max,
      showPlus = true,
      format,
      variant = "solid",
      tooltip,
      bordered,
      textClassName = "",
      textStyle,
      "aria-live": ariaLive,
      asChild = false,
      className,
      style,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const numericSize = getNumericSize(size);
    const fontSize = getFontSize(size);
    const borderRadius = getBorderRadius(shape);

    const displayCount = useMemo(() => {
      if (format) return format(count);
      const displayValue = max !== undefined && count > max ? `${max}+` : count;
      return showPlus ? `+${displayValue}` : String(displayValue);
    }, [count, max, format, showPlus]);

    const tooltipConfig = useMemo(() => {
      if (!tooltip) return null;
      if (isTooltipConfig(tooltip)) return tooltip;
      return { content: tooltip };
    }, [tooltip]);

    const Comp = asChild ? Slot : "div";

    const ariaLabel = `${count} more member${count !== 1 ? "s" : ""} not shown`;

    const countElement = (
      <Comp
        ref={ref}
        role="status"
        className={cn(
          "shrink-0 inline-flex items-center justify-center",
          variantClassNames[variant],
          onClick && "cursor-pointer hover:opacity-80 transition-opacity",
          className,
        )}
        style={{
          minWidth: numericSize,
          height: numericSize,
          borderRadius,
          fontSize,
          border: parseBorder(bordered),
          ...style,
        }}
        aria-label={ariaLabel}
        aria-live={ariaLive}
        onClick={onClick}
        {...rest}
      >
        <span className={textClassName} style={textStyle}>
          {displayCount}
        </span>
        {children}
      </Comp>
    );

    if (tooltipConfig) {
      return (
        <Tooltip
          content={tooltipConfig.content}
          side={tooltipConfig.side ?? "top"}
          align={tooltipConfig.align ?? "center"}
          sideOffset={tooltipConfig.sideOffset ?? 6}
          delayDuration={tooltipConfig.delayDuration ?? 200}
          contentClassName={tooltipConfig.className}
          showArrow={tooltipConfig.showArrow ?? true}
        >
          {countElement}
        </Tooltip>
      );
    }

    return countElement;
  },
);

AvatarGroupCount.displayName = "AvatarGroupCount";
