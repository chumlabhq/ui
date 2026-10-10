import { forwardRef, useMemo, type CSSProperties } from "react";
import type { PulseLoaderProps, PulseLoaderClasses } from "./utils/types.js";
import {
  DEFAULT_PULSE_LOADER_CLASSES,
  UNSTYLED_PULSE_LOADER_CLASSES,
} from "./utils/constants.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
const PulseLoader = forwardRef<HTMLDivElement, PulseLoaderProps>(
  (
    {
      size = 40,
      animationDuration = 1500,
      rings = 2,
      reduceMotion = "auto",
      classes: classesProp,
      unstyled = false,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const rootStyle: CSSProperties = {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${size}px`,
      height: `${size}px`,
      ...style,
    };

    const ringElements = Array.from({ length: rings });

    const prefersReducedMotion = useReducedMotion(reduceMotion);

    const baseClassesRaw = unstyled
      ? UNSTYLED_PULSE_LOADER_CLASSES
      : DEFAULT_PULSE_LOADER_CLASSES;

    const baseClasses = motionSafeClasses(
      baseClassesRaw,
      useReducedMotion(reduceMotion),
    );
    const mergedClasses: Required<PulseLoaderClasses> = useMemo(
      () => ({
        root: mergeSlot(baseClasses.root, classesProp?.root),
        range: mergeSlot(baseClasses.range, classesProp?.range),
      }),
      [classesProp, baseClasses],
    );

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
        {/* Core dot */}
        <span
          className={mergedClasses.range || undefined}
          style={{
            position: "absolute",
            width: `${size * 0.3}px`,
            height: `${size * 0.3}px`,
            borderRadius: "50%",
            backgroundColor: "currentColor",
            animation: prefersReducedMotion ? "none" : `pulse-loader-core ${animationDuration}ms ease-in-out infinite`,
          }}
        />
        {/* Ripple rings */}
        {ringElements.map((_, i) => (
          <span
            key={i}
            className={mergedClasses.range || undefined}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "2px solid currentColor",
              opacity: prefersReducedMotion ? 0.4 : 0,
              animation: prefersReducedMotion ? "none" : `pulse-loader-ring ${animationDuration}ms ease-out infinite`,
              animationDelay: prefersReducedMotion ? undefined : `${(i * animationDuration) / rings}ms`,
            }}
          />
        ))}
        <style>{`@keyframes pulse-loader-core{0%,100%{transform:scale(0.8);opacity:0.6}50%{transform:scale(1);opacity:1}}@keyframes pulse-loader-ring{0%{transform:scale(0.3);opacity:0.6}100%{transform:scale(1);opacity:0}}`}</style>
      </div>
    );
  },
);

PulseLoader.displayName = "PulseLoader";

export default PulseLoader;
