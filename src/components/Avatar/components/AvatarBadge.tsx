import { forwardRef, useMemo } from "react";
import type { AvatarBadgeProps } from "../types";
import { Slot } from "../../../utils/Slot";
import { getBadgePosition, getBadgeSizeClasses } from "../utils/helpers";
import { cn } from "../../../utils/cn";

const variantStyles = {
  solid: {
    dot: "bg-red-500 rounded-full",
    count: "font-medium bg-red-500 text-white rounded-full px-1.5",
  },
  outline: {
    dot: "border-2 border-red-500 bg-transparent rounded-full",
    count:
      "font-medium border-2 border-red-500 text-red-500 bg-white rounded-full px-1.5",
  },
  soft: {
    dot: "bg-red-200 rounded-full",
    count: "font-medium bg-red-100 text-red-700 rounded-full px-1.5",
  },
};

export const AvatarBadge = forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  (
    {
      count,
      max = 99,
      showZero = false,
      dot = false,
      position = "top-right",
      offset,
      color,
      size = "md",
      variant = "solid",
      overlap = "circular",
      pulse = false,
      invisible = false,
      "aria-live": ariaLive,
      asChild = false,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const displayCount = count !== undefined && count > max ? `${max}+` : count;
    const shouldShow =
      !invisible && (dot || showZero || (count !== undefined && count > 0));

    const { minWidth, height } = useMemo(
      () => getBadgeSizeClasses(size, dot),
      [size, dot],
    );

    const positionStyle = useMemo(
      () => getBadgePosition(position, overlap, offset),
      [position, overlap, offset],
    );

    const defaultVariantClass = dot ? variantStyles[variant].dot : variantStyles[variant].count;

    const colorStyle = useMemo(() => {
      if (!color) return {};
      if (dot) {
        return variant === "outline"
          ? { borderColor: color }
          : { backgroundColor: color };
      }
      return variant === "outline"
        ? { borderColor: color, color }
        : { backgroundColor: color };
    }, [color, dot, variant]);

    const ariaLabel = useMemo(() => {
      if (dot) return "New notification";
      if (count !== undefined)
        return `${count} notification${count !== 1 ? "s" : ""}`;
      return undefined;
    }, [dot, count]);

    if (!shouldShow) return null;

    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        role="status"
        className={cn(
          "absolute flex items-center justify-center",
          defaultVariantClass,
          pulse && "animate-pulse",
          className,
        )}
        style={{
          minWidth,
          height,
          ...positionStyle,
          ...colorStyle,
          ...style,
        }}
        aria-label={ariaLabel}
        aria-live={ariaLive}
        {...rest}
      >
        {dot ? null : displayCount}
        {children}
      </Comp>
    );
  },
);

AvatarBadge.displayName = "AvatarBadge";
