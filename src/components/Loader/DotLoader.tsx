import { forwardRef, useMemo, type CSSProperties } from "react";
import type { DotLoaderProps, DotLoaderClasses } from "./utils/types.js";
import {
  DEFAULT_DOT_LOADER_CLASSES,
  UNSTYLED_DOT_LOADER_CLASSES,
} from "./utils/constants.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
const DotLoader = forwardRef<HTMLDivElement, DotLoaderProps>(
  (
    {
      dotSize = 8,
      gap = 4,
      count = 3,
      speed = 1.4,
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
    const dots = Array.from({ length: count });

    const baseClassesRaw = unstyled
      ? UNSTYLED_DOT_LOADER_CLASSES
      : DEFAULT_DOT_LOADER_CLASSES;

    const baseClasses = motionSafeClasses(
      baseClassesRaw,
      useReducedMotion(reduceMotion),
    );
    const mergedClasses: Required<DotLoaderClasses> = useMemo(
      () => ({
        root: mergeSlot(baseClasses.root, classesProp?.root),
        range: mergeSlot(baseClasses.range, classesProp?.range),
      }),
      [classesProp, baseClasses],
    );

    const rootStyle: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: `${gap}px`,
      ...style,
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
        {dots.map((_, i) => (
          <span
            key={i}
            className={mergedClasses.range || undefined}
            style={{
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              borderRadius: "50%",
              backgroundColor: "currentColor",
              animation: prefersReducedMotion ? "none" : `dot-loader-bounce ${speed}s ease-in-out infinite`,
              animationDelay: prefersReducedMotion ? undefined : `${(i * speed) / (count + 1)}s`,
            }}
          />
        ))}
        <style>{`@keyframes dot-loader-bounce{0%,80%,100%{transform:scale(0.4);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
      </div>
    );
  },
);

DotLoader.displayName = "DotLoader";

export default DotLoader;
