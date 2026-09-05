import { forwardRef } from "react";
import type {
  CountryFlagShimmerProps,
  CountryFlagGroupShimmerProps,
} from "../utils/types.js";
import { cn } from "../../../utils/scopedCn.js";
import { motionSafe } from "../../../utils/classLayers.js";
import { getPixelSize } from "../utils/helpers.js";
import {
  DEFAULT_COUNTRY_FLAG_SHIMMER_CLASSES,
  UNSTYLED_COUNTRY_FLAG_SHIMMER_CLASSES,
} from "../utils/constants.js";
import { DEFAULT_ASPECT_RATIO } from "../utils/constants.js";
import { useReducedMotion } from "../../../utils/useReducedMotion.js";

export const CountryFlagShimmer = forwardRef<HTMLSpanElement, CountryFlagShimmerProps>(
  (
    {
      size = "md",
      aspectRatio = DEFAULT_ASPECT_RATIO,
      animate = true,
      reduceMotion = "auto",
      className,
      classes,
      unstyled = false,
      style,
      ...rest
    },
    ref,
  ) => {
    const pixelSize = getPixelSize(size);
    const width = pixelSize;
    const height = Math.round(pixelSize * aspectRatio);
    const effectiveReduceMotion = useReducedMotion(reduceMotion);
    const shouldAnimate = animate && !effectiveReduceMotion;

    const base = unstyled
      ? UNSTYLED_COUNTRY_FLAG_SHIMMER_CLASSES
      : DEFAULT_COUNTRY_FLAG_SHIMMER_CLASSES;
    const rootClass = classes?.root ?? base.root;

    return (
      <span
        ref={ref}
        className={cn(
          motionSafe(cn(rootClass, className) ?? "", !shouldAnimate),
        )}
        style={{ width, height, ...style }}
        role="status"
        aria-label="Loading flag"
        {...rest}
      />
    );
  },
);

CountryFlagShimmer.displayName = "CountryFlagShimmer";

export const CountryFlagGroupShimmer = forwardRef<HTMLDivElement, CountryFlagGroupShimmerProps>(
  (
    {
      count = 3,
      size = "md",
      aspectRatio = DEFAULT_ASPECT_RATIO,
      animate = true,
      reduceMotion = "auto",
      showCount = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const pixelSize = getPixelSize(size);
    const width = pixelSize;
    const height = Math.round(pixelSize * aspectRatio);
    const effectiveReduceMotion = useReducedMotion(reduceMotion);
    const shouldAnimate = animate && !effectiveReduceMotion;
    const itemClassName = cn("shrink-0 bg-gray-200", shouldAnimate && "animate-pulse");

    return (
      <div
        ref={ref}
        className={cn("flex -space-x-1.5", className)}
        style={style}
        role="status"
        aria-label="Loading flag group"
        {...rest}
      >
        {Array.from({ length: count }).map((_, index) => (
          <span key={index} className={itemClassName} style={{ width, height }} />
        ))}
        {showCount && (
          <span
            className={itemClassName}
            style={{ minWidth: width, height, paddingLeft: 4, paddingRight: 4 }}
          />
        )}
      </div>
    );
  },
);

CountryFlagGroupShimmer.displayName = "CountryFlagGroupShimmer";
