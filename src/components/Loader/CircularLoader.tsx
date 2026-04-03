import { forwardRef, useMemo, type CSSProperties } from "react";
import type { CircularLoaderProps, CircularLoaderClasses } from "./utils/types";
import {
  DEFAULT_CIRCULAR_LOADER_CLASSES,
  UNSTYLED_CIRCULAR_LOADER_CLASSES,
} from "./utils/constants";
import { cn } from "../../utils/cn";
import { useReducedMotion } from "../../utils/useReducedMotion";

const CircularLoader = forwardRef<HTMLDivElement, CircularLoaderProps>(
  (
    {
      size = 20,
      thickness = 2,
      speed = 0.75,
      trackColor,
      reduceMotion,
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

    const baseClasses = unstyled
      ? UNSTYLED_CIRCULAR_LOADER_CLASSES
      : DEFAULT_CIRCULAR_LOADER_CLASSES;
    const mergedClasses: Required<CircularLoaderClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        svg: classesProp?.svg ?? baseClasses.svg,
        track: classesProp?.track ?? baseClasses.track,
        indicator: classesProp?.indicator ?? baseClasses.indicator,
      }),
      [classesProp, baseClasses],
    );

    const loaderStyle: CSSProperties = {
      "--loader-size": `${size}px`,
      "--loader-speed": `${speed}s`,
      "--loader-track": trackColor ?? "currentColor",
      ...style,
    } as CSSProperties;

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(mergedClasses.root, !unstyled && "h-(--loader-size) w-(--loader-size)", className) || undefined}
        style={loaderStyle}
        data-reduce-motion={prefersReducedMotion || undefined}
        {...rest}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn(mergedClasses.svg, !unstyled && "[animation-duration:var(--loader-speed)]") || undefined}
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
            className={mergedClasses.indicator || undefined}
          />
        </svg>
      </div>
    );
  }
);

CircularLoader.displayName = "CircularLoader";

export default CircularLoader;
