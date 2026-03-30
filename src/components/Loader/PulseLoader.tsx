import { forwardRef, type CSSProperties } from "react";
import type { PulseLoaderProps } from "./utils/types";
import { useReducedMotion } from "../../utils/useReducedMotion";

const PulseLoader = forwardRef<HTMLDivElement, PulseLoaderProps>(
  (
    {
      size = 40,
      speed = 1.5,
      rings = 2,
      reduceMotion,
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
        {/* Core dot */}
        <span
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
