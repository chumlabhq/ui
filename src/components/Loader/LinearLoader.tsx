import { forwardRef, useMemo, type CSSProperties } from "react";
import type { LinearLoaderProps, LinearLoaderClasses } from "./utils/types.js";
import {
  DEFAULT_LINEAR_LOADER_CLASSES,
  UNSTYLED_LINEAR_LOADER_CLASSES,
} from "./utils/constants.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
const LinearLoader = forwardRef<HTMLDivElement, LinearLoaderProps>(
  (
    {
      height = 4,
      width = "100%",
      speed = 1.5,
      trackColor,
      borderRadius = 9999,
      reduceMotion = "auto",
      classes: classesProp,
      unstyled = false,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const prefersReducedMotion = useReducedMotion(reduceMotion);
    // The default track is the indicator's colour at 20%, painted on the track
    // alone. It was `currentColor` with `opacity: 0.2` on the root, and the bar
    // is inside the root, so the bar faded with it: 1:1, nothing visible moving.
    const trackBg = trackColor ?? "color-mix(in srgb, currentColor 20%, transparent)";
    const w = typeof width === "number" ? `${width}px` : width;

    const baseClassesRaw = unstyled
      ? UNSTYLED_LINEAR_LOADER_CLASSES
      : DEFAULT_LINEAR_LOADER_CLASSES;

    const baseClasses = motionSafeClasses(
      baseClassesRaw,
      useReducedMotion(reduceMotion),
    );
    const mergedClasses: Required<LinearLoaderClasses> = useMemo(
      () => ({
        root: mergeSlot(baseClasses.root, classesProp?.root),
        range: mergeSlot(baseClasses.range, classesProp?.range),
      }),
      [classesProp, baseClasses],
    );

    const rootStyle: CSSProperties = {
      width: w,
      height: `${height}px`,
      borderRadius: `${borderRadius}px`,
      backgroundColor: trackBg,
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
        <div className={mergedClasses.range || undefined} style={barStyle} />
        <style>{`@keyframes linear-loader-slide{0%{transform:translateX(-100%)}50%{transform:translateX(0%)}100%{transform:translateX(100%)}}`}</style>
      </div>
    );
  },
);

LinearLoader.displayName = "LinearLoader";

export default LinearLoader;
