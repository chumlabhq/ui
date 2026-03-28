import { forwardRef, type CSSProperties } from "react";
import type { DotLoaderProps } from "./utils/types";

const DotLoader = forwardRef<HTMLDivElement, DotLoaderProps>(
  (
    {
      dotSize = 8,
      gap = 4,
      count = 3,
      speed = 1.4,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
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
              animation: `dot-loader-bounce ${speed}s ease-in-out infinite`,
              animationDelay: `${(i * speed) / (count + 1)}s`,
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
