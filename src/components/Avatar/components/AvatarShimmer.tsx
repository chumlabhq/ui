import { forwardRef } from "react";
import type { AvatarShimmerProps, AvatarGroupShimmerProps } from "../utils/types.js";
import {
  DEFAULT_SIZE,
  DEFAULT_SHAPE,
  DEFAULT_SPACING,
  DEFAULT_AVATAR_SHIMMER_CLASSES,
  UNSTYLED_AVATAR_SHIMMER_CLASSES,
} from "../utils/constants.js";
import { getNumericSize, getBorderRadius } from "../utils/helpers.js";
import { Slot } from "../../../utils/Slot.js";
import { cn } from "../../../utils/scopedCn.js";
import { motionSafe } from "../../../utils/classLayers.js";
import { useReducedMotion } from "../../../utils/useReducedMotion.js";

export const AvatarShimmer = forwardRef<HTMLDivElement, AvatarShimmerProps>(
  (
    {
      size = DEFAULT_SIZE,
      shape = DEFAULT_SHAPE,
      className,
      classes,
      unstyled = false,
      style,
      animate = true,
      reduceMotion = "auto",
    },
    ref,
  ) => {
    const numericSize = getNumericSize(size);
    const borderRadius = getBorderRadius(shape);
    const effectiveReduceMotion = useReducedMotion(reduceMotion);
    const shouldAnimate = animate && !effectiveReduceMotion;
    const base = unstyled
      ? UNSTYLED_AVATAR_SHIMMER_CLASSES
      : DEFAULT_AVATAR_SHIMMER_CLASSES;
    const rootClass = cn(base.root, classes?.root);

    return (
      <div
        ref={ref}
        className={cn(
          motionSafe(cn(rootClass, className) ?? "", !shouldAnimate),
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
      // The ring separates overlapping avatars from the page behind them, so
      // it is the page colour — `white` is a light-theme value that draws a
      // halo in dark.
      ringColor = "var(--cl-bg)",
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

    /**
     * Two elements per placeholder, because `animate-pulse` is an opacity
     * animation: with the ring on the pulsing element it went translucent along
     * with the fill, the shapes showed through each other and the stack read as
     * one grey blob. The ring and an opaque page-coloured fill sit on the
     * wrapper, which never animates, so the edge stays as clean as a real
     * avatar's; only the grey inside it pulses.
     */
    const ringStyle = {
      width: numericSize,
      height: numericSize,
      borderRadius,
      backgroundColor: ringColor,
      boxShadow: `0 0 0 2px ${ringColor}`,
      position: "relative" as const,
    };
    const fillClassName = cn(
      "w-full h-full bg-gray-200",
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
            className="shrink-0"
            style={{
              ...ringStyle,
              marginInlineStart: index === 0 ? 0 : spacing,
              zIndex: count - index,
            }}
          >
            <div className={fillClassName} style={{ borderRadius }} />
          </div>
        ))}
        {showCount && (
          <div
            className="shrink-0"
            style={{ ...ringStyle, marginInlineStart: spacing, zIndex: 0 }}
          >
            <div className={fillClassName} style={{ borderRadius }} />
          </div>
        )}
      </Comp>
    );
  },
);

AvatarGroupShimmer.displayName = "AvatarGroupShimmer";
