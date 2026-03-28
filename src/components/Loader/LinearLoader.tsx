import { forwardRef, type CSSProperties } from "react";
import type { LinearLoaderProps } from "./utils/types";

const LinearLoader = forwardRef<HTMLDivElement, LinearLoaderProps>(
  (
    {
      height = 4,
      width = "100%",
      speed = 1.5,
      trackColor,
      borderRadius = 9999,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const trackBg = trackColor ?? "currentColor";
    const w = typeof width === "number" ? `${width}px` : width;

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
      animation: `linear-loader-slide ${speed}s ease-in-out infinite`,
    };

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={`inline-block ${className}`}
        style={rootStyle}
        {...rest}
      >
        <div style={barStyle} />
        <style>{`@keyframes linear-loader-slide{0%{transform:translateX(-100%)}50%{transform:translateX(0%)}100%{transform:translateX(100%)}}`}</style>
      </div>
    );
  },
);

LinearLoader.displayName = "LinearLoader";

export default LinearLoader;
