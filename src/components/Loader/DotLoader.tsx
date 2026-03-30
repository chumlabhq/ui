import { forwardRef, type CSSProperties } from "react";
import type { DotLoaderProps } from "./utils/types";
import { useReducedMotion } from "../../utils/useReducedMotion";

const DotLoader = forwardRef<HTMLDivElement, DotLoaderProps>(
  (
    {
      dotSize = 8,
      gap = 4,
      count = 3,
      speed = 1.4,
      reduceMotion,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const prefersReducedMotion = useReducedMotion(reduceMotion);
    const dots = Array.from({ length: count });

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
        aria-label="Loading"
        className={className}
        style={rootStyle}
        data-reduce-motion={prefersReducedMotion || undefined}
        {...rest}
      >
        {dots.map((_, i) => (
          <span
            key={i}
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
