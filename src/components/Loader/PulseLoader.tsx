import { forwardRef, useMemo, type CSSProperties } from "react";
import type { PulseLoaderProps, PulseLoaderClasses } from "./utils/types";
import {
  DEFAULT_PULSE_LOADER_CLASSES,
  UNSTYLED_PULSE_LOADER_CLASSES,
} from "./utils/constants";
import { cn } from "../../utils/cn";
import { useReducedMotion } from "../../utils/useReducedMotion";

const PulseLoader = forwardRef<HTMLDivElement, PulseLoaderProps>(
  (
    {
      size = 40,
      speed = 1.5,
      rings = 2,
      reduceMotion,
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

    const baseClasses = unstyled
      ? UNSTYLED_PULSE_LOADER_CLASSES
      : DEFAULT_PULSE_LOADER_CLASSES;
    const mergedClasses: Required<PulseLoaderClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        core: classesProp?.core ?? baseClasses.core,
        ring: classesProp?.ring ?? baseClasses.ring,
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
          className={mergedClasses.core || undefined}
          style={{
            position: "absolute",
            width: `${size * 0.3}px`,
            height: `${size * 0.3}px`,
            borderRadius: "50%",
            backgroundColor: "currentColor",
            animation: prefersReducedMotion ? "none" : `pulse-loader-core ${speed}s ease-in-out infinite`,
          }}
        />
        {/* Ripple rings */}
        {ringElements.map((_, i) => (
          <span
            key={i}
            className={mergedClasses.ring || undefined}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "2px solid currentColor",
              opacity: prefersReducedMotion ? 0.4 : 0,
              animation: prefersReducedMotion ? "none" : `pulse-loader-ring ${speed}s ease-out infinite`,
              animationDelay: prefersReducedMotion ? undefined : `${(i * speed) / rings}s`,
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
