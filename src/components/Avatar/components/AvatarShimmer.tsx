import { forwardRef } from "react";
import type { AvatarShimmerProps, AvatarGroupShimmerProps } from "../utils/types";
import { DEFAULT_SIZE, DEFAULT_SHAPE, DEFAULT_SPACING } from "../utils/constants";
import { getNumericSize, getBorderRadius } from "../utils/helpers";
import { Slot } from "../../../utils/Slot";
import { cn } from "../../../utils/cn";
import { useReducedMotion } from "../../../utils/useReducedMotion";

export const AvatarShimmer = forwardRef<HTMLDivElement, AvatarShimmerProps>(
  (
    {
      size = DEFAULT_SIZE,
      shape = DEFAULT_SHAPE,
      className,
      style,
      animate = true,
      reduceMotion = "auto",
      asChild = false,
    },
    ref,
  ) => {
    const numericSize = getNumericSize(size);
    const borderRadius = getBorderRadius(shape);
    const effectiveReduceMotion = useReducedMotion(reduceMotion);
    const shouldAnimate = animate && !effectiveReduceMotion;
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn(
          "shrink-0 bg-gray-200",
          shouldAnimate && "animate-pulse",
          className,
        )}
        style={{
          width: numericSize,
          height: numericSize,
          borderRadius,
          ...style,
        }}
        role="status"
        aria-label="Loading avatar"
      />
    );
  },
);

AvatarShimmer.displayName = "AvatarShimmer";

export const AvatarGroupShimmer = forwardRef<
  HTMLDivElement,
  AvatarGroupShimmerProps
>(
  (
    {
      count = 3,
      size = DEFAULT_SIZE,
      shape = DEFAULT_SHAPE,
      spacing = DEFAULT_SPACING,
      ringColor = "white",
      animate = true,
      reduceMotion = "auto",
      className,
      style,
      showCount = false,
      asChild = false,
    },
    ref,
  ) => {
    const numericSize = getNumericSize(size);
    const borderRadius = getBorderRadius(shape);
    const effectiveReduceMotion = useReducedMotion(reduceMotion);
    const shouldAnimate = animate && !effectiveReduceMotion;
    const Comp = asChild ? Slot : "div";
    const itemClassName = cn(
      "shrink-0 bg-gray-200",
      shouldAnimate && "animate-pulse",
    );

    return (
      <Comp
        ref={ref}
        className={cn("flex items-center", className)}
        style={style}
        role="status"
        aria-label="Loading avatar group"
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={itemClassName}
            style={{
              width: numericSize,
              height: numericSize,
              borderRadius,
              marginInlineStart: index === 0 ? 0 : spacing,
              zIndex: count - index,
              boxShadow: `0 0 0 2px ${ringColor}`,
            }}
          />
        ))}
        {showCount && (
          <div
            className={itemClassName}
            style={{
              minWidth: numericSize,
              height: numericSize,
              borderRadius,
              marginInlineStart: spacing,
              zIndex: 0,
              boxShadow: `0 0 0 2px ${ringColor}`,
            }}
          />
        )}
      </Comp>
    );
  },
);

AvatarGroupShimmer.displayName = "AvatarGroupShimmer";
