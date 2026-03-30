import { forwardRef, type CSSProperties } from "react";
import type { CircularLoaderProps } from "./utils/types";
import { useReducedMotion } from "../../utils/useReducedMotion";

const CircularLoader = forwardRef<HTMLDivElement, CircularLoaderProps>(
  (
    {
      size = 20,
      thickness = 2,
      speed = 0.75,
      trackColor,
      reduceMotion,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion(reduceMotion);
    const radius = 10 - thickness / 2;
    const circumference = 2 * Math.PI * radius;

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
        className={`inline-flex shrink-0 h-(--loader-size) w-(--loader-size) ${className}`}
        style={loaderStyle}
        data-reduce-motion={prefersReducedMotion || undefined}
        {...rest}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-full w-full animate-spin [animation-duration:var(--loader-speed)]"
          style={prefersReducedMotion ? { animation: "none" } : undefined}
        >
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="var(--loader-track)"
            strokeWidth={thickness}
            className="opacity-20"
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
          />
        </svg>
      </div>
    );
  }
);

CircularLoader.displayName = "CircularLoader";

export default CircularLoader;
