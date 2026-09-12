import { forwardRef, useMemo, type CSSProperties } from "react";
import type { CircularLoaderProps, CircularLoaderClasses } from "./utils/types.js";
import {
  DEFAULT_CIRCULAR_LOADER_CLASSES,
  UNSTYLED_CIRCULAR_LOADER_CLASSES,
} from "./utils/constants.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
/**
 * Component: CircularLoader
 *
 * Purpose: Spinning circle loading indicator with configurable size, color, speed.
 *
 * Reference: LOADER.ai.md (this directory), src/pages/demo/LoaderDemo.tsx
 */
const CircularLoader = forwardRef<HTMLDivElement, CircularLoaderProps>(
  (
    {
      size = 20,
      thickness = 2,
      speed = 0.75,
      trackColor,
      reduceMotion = "auto",
      classes: classesProp,
      unstyled = false,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion(reduceMotion);
    const radius = 10 - thickness / 2;
    const circumference = 2 * Math.PI * radius;

    const baseClassesRaw = unstyled
      ? UNSTYLED_CIRCULAR_LOADER_CLASSES
      : DEFAULT_CIRCULAR_LOADER_CLASSES;

    const baseClasses = motionSafeClasses(
      baseClassesRaw,
      useReducedMotion(reduceMotion),
    );
    const mergedClasses: Required<CircularLoaderClasses> = useMemo(
      () => ({
        root: mergeSlot(baseClasses.root, classesProp?.root),
        control: mergeSlot(baseClasses.control, classesProp?.control),
        track: mergeSlot(baseClasses.track, classesProp?.track),
        range: mergeSlot(baseClasses.range, classesProp?.range),
      }),
      [classesProp, baseClasses],
    );

    // Hoisted rather than inlined into the style object so the schema
    // generator can see the default: it reads `x ?? literal` from a variable
    // declaration, which is why LinearLoader's `trackColor` recorded
    // "currentColor" and this one recorded nothing.
    const trackBg = trackColor ?? "currentColor";

    const loaderStyle: CSSProperties = {
      "--loader-size": `${size}px`,
      "--loader-speed": `${speed}s`,
      "--loader-track": trackBg,
      ...style,
    } as CSSProperties;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label="Loading"
        className={cn(mergedClasses.root, className) || undefined}
        style={loaderStyle}
        data-reduce-motion={prefersReducedMotion || undefined}
        {...rest}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={mergedClasses.control || undefined}
          style={prefersReducedMotion ? { animation: "none" } : undefined}
        >
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="var(--loader-track)"
            strokeWidth={thickness}
            className={mergedClasses.track || undefined}
          />
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="currentColor"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
            className={mergedClasses.range || undefined}
          />
        </svg>
      </div>
    );
  }
);

CircularLoader.displayName = "CircularLoader";

export default CircularLoader;
