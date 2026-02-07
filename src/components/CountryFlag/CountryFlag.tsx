import { forwardRef, useState, useCallback, useMemo } from "react";
import type { SyntheticEvent } from "react";
import type { CountryFlagProps } from "./utils/types";
import { DEFAULT_FLAG_BASE_PATH, DEFAULT_ASPECT_RATIO } from "./utils/constants";
import { getPixelSize, isTooltipConfig } from "./utils/helpers";
import { useCountryFlagGroupContext } from "./utils/context";
import { CountryFlagShimmer } from "./components/CountryFlagShimmer";
import { Tooltip } from "../Tooltip";
import { cn } from "../../utils/cn";

export const CountryFlag = forwardRef<HTMLSpanElement, CountryFlagProps>(
  (
    {
      code,
      size = "md",
      aspectRatio = DEFAULT_ASPECT_RATIO,
      alt,
      fallback,
      loading = false,
      tooltip,
      basePath = DEFAULT_FLAG_BASE_PATH,
      onLoad,
      onError,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [hasError, setHasError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [prevCode, setPrevCode] = useState(code);

    if (prevCode !== code) {
      setPrevCode(code);
      setHasError(false);
      setIsImageLoading(true);
    }

    const groupContext = useCountryFlagGroupContext();

    const normalizedCode = code?.toLowerCase() || "";
    const pixelSize = getPixelSize(size);
    const width = pixelSize;
    const height = Math.round(pixelSize * aspectRatio);
    const src = `${basePath}/${normalizedCode}.svg`;
    const altText = alt || `${normalizedCode.toUpperCase()} flag`;

    const handleError = useCallback(
      (event: SyntheticEvent<HTMLImageElement>) => {
        setHasError(true);
        setIsImageLoading(false);
        onError?.(event);
      },
      [onError],
    );

    const handleLoad = useCallback(
      (event: SyntheticEvent<HTMLImageElement>) => {
        setIsImageLoading(false);
        onLoad?.(event);
      },
      [onLoad],
    );

    const tooltipConfig = useMemo(() => {
      if (!tooltip) return null;
      if (isTooltipConfig(tooltip)) return tooltip;
      return { content: tooltip };
    }, [tooltip]);

    if (loading) {
      return (
        <CountryFlagShimmer
          size={size}
          aspectRatio={aspectRatio}
          className={cn(groupContext?.itemClassName, className)}
          style={style}
        />
      );
    }

    const showFallback = hasError || !normalizedCode;

    const flagElement = (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center shrink-0 overflow-hidden",
          groupContext?.itemClassName,
          className,
        )}
        style={{ width, height, ...style }}
        role="img"
        aria-label={altText}
        data-loading={!showFallback && isImageLoading ? true : undefined}
        {...rest}
      >
        {showFallback ? (
          fallback || null
        ) : (
          <img
            src={src}
            alt=""
            aria-hidden
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            style={{
              borderRadius: "inherit",
              opacity: isImageLoading ? 0 : 1,
              transition: "opacity 0.15s ease-in-out",
            }}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </span>
    );

    if (tooltipConfig) {
      return (
        <Tooltip
          content={tooltipConfig.content}
          side={tooltipConfig.side ?? "top"}
          align={tooltipConfig.align ?? "center"}
          sideOffset={tooltipConfig.sideOffset ?? 6}
          delayDuration={tooltipConfig.delayDuration ?? 200}
          contentClassName={tooltipConfig.className}
          showArrow={tooltipConfig.showArrow ?? true}
        >
          {flagElement}
        </Tooltip>
      );
    }

    return flagElement;
  },
);

CountryFlag.displayName = "CountryFlag";
