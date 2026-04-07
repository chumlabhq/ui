import { forwardRef, useMemo, type CSSProperties } from "react";
import type { LinearLoaderProps, LinearLoaderClasses } from "./utils/types";
import {
  DEFAULT_LINEAR_LOADER_CLASSES,
  UNSTYLED_LINEAR_LOADER_CLASSES,
} from "./utils/constants";
import { cn } from "../../utils/cn";
import { useReducedMotion } from "../../utils/useReducedMotion";

const LinearLoader = forwardRef<HTMLDivElement, LinearLoaderProps>(
  (
    {
      height = 4,
      width = "100%",
      speed = 1.5,
      trackColor,
      borderRadius = 9999,
      reduceMotion,
      classes: classesProp,
      unstyled = false,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const prefersReducedMotion = useReducedMotion(reduceMotion);
    const trackBg = trackColor ?? "currentColor";
    const w = typeof width === "number" ? `${width}px` : width;

    const baseClasses = unstyled
      ? UNSTYLED_LINEAR_LOADER_CLASSES
      : DEFAULT_LINEAR_LOADER_CLASSES;
    const mergedClasses: Required<LinearLoaderClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        bar: classesProp?.bar ?? baseClasses.bar,
      }),
      [classesProp, baseClasses],
    );

    const rootStyle: CSSProperties = {
      width: w,
      height: `${height}px`,
      borderRadius: `${borderRadius}px`,
      backgroundColor: trackBg,
      opacity: trackColor ? undefined : 0.2,
      overflow: "hidden",
      position: "relative",
      ...style,
    };

    const barStyle: CSSProperties = {
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      backgroundColor: "currentColor",
      animation: prefersReducedMotion ? "none" : `linear-loader-slide ${speed}s ease-in-out infinite`,
    };

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label="Loading"
        className={cn(mergedClasses.root, className) || undefined}
        style={rootStyle}
        data-reduce-motion={prefersReducedMotion || undefined}
        {...rest}
      >
        <div className={mergedClasses.bar || undefined} style={barStyle} />
        <style>{`@keyframes linear-loader-slide{0%{transform:translateX(-100%)}50%{transform:translateX(0%)}100%{transform:translateX(100%)}}`}</style>
      </div>
    );
  },
);

LinearLoader.displayName = "LinearLoader";

export default LinearLoader;
