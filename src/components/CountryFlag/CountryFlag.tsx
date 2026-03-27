import { forwardRef, useState, useCallback, useMemo } from "react";
import type { SyntheticEvent } from "react";
import type { CountryFlagProps, CountryFlagClasses, CountryFlagTooltipConfig } from "./utils/types";
import {
  DEFAULT_FLAG_BASE_PATH,
  DEFAULT_ASPECT_RATIO,
  DEFAULT_COUNTRYFLAG_CLASSES,
  UNSTYLED_COUNTRYFLAG_CLASSES,
} from "./utils/constants";
import { getPixelSize, isTooltipConfig } from "./utils/helpers";
import { useCountryFlagGroupContext } from "./utils/context";
import { CountryFlagShimmer } from "./components/CountryFlagShimmer";
import { Tooltip } from "../Tooltip";
import { cn } from "../../utils/cn";
import { useReducedMotion } from "../../utils/useReducedMotion";

export const CountryFlag = forwardRef<HTMLSpanElement, CountryFlagProps>(
  (
    {
      code,
      size,
      aspectRatio = DEFAULT_ASPECT_RATIO,
      alt,
      fallback,
      loading = false,
      tooltip,
      basePath = DEFAULT_FLAG_BASE_PATH,
      classes: classesProp,
      unstyled = false,
      reduceMotion = "auto",
      onLoad,
      onError,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [hasError, setHasError] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [prevCode, setPrevCode] = useState(code);

    if (prevCode !== code) {
      setPrevCode(code);
      setHasError(false);
      setIsImageLoaded(false);
    }

    const groupContext = useCountryFlagGroupContext();
    const effectiveReduceMotion = useReducedMotion(reduceMotion);

    const normalizedCode = code?.toLowerCase() || "";
    const effectiveSize = size ?? groupContext?.size ?? "md";
    const pixelSize = getPixelSize(effectiveSize);
    const width = pixelSize;
    const height = Math.round(pixelSize * aspectRatio);
    const src = `${basePath}/${normalizedCode}.svg`;
    const altText = alt || `${normalizedCode.toUpperCase()} flag`;

    // ─── Merged classes ─────────────────────────────────────────────────
    const baseClasses = unstyled ? UNSTYLED_COUNTRYFLAG_CLASSES : DEFAULT_COUNTRYFLAG_CLASSES;
    const mergedClasses: Required<CountryFlagClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        image: classesProp?.image ?? baseClasses.image,
        fallback: classesProp?.fallback ?? baseClasses.fallback,
      }),
      [classesProp, baseClasses],
    );

    // ─── Cached image check ─────────────────────────────────────────────
    const imgRef = useCallback((node: HTMLImageElement | null) => {
      if (node && node.complete && node.naturalWidth > 0) {
        setIsImageLoaded(true);
      }
    }, []);

    const handleError = useCallback(
      (event: SyntheticEvent<HTMLImageElement>) => {
        setHasError(true);
        setIsImageLoaded(false);
        onError?.(event);
      },
      [onError],
    );

    const handleLoad = useCallback(
      (event: SyntheticEvent<HTMLImageElement>) => {
        setIsImageLoaded(true);
        onLoad?.(event);
      },
      [onLoad],
    );

    const tooltipConfig = useMemo(() => {
      if (!tooltip) return null;
      if (isTooltipConfig<CountryFlagTooltipConfig>(tooltip)) return tooltip;
      return { content: tooltip };
    }, [tooltip]);

    if (loading) {
      return (
        <CountryFlagShimmer
          size={size}
          aspectRatio={aspectRatio}
          reduceMotion={reduceMotion}
          className={cn(groupContext?.itemClassName, className)}
          style={style}
        />
      );
    }

    const showFallback = hasError || !normalizedCode;

    const flagElement = (
      <span
        ref={ref}
        className={cn(mergedClasses.root, groupContext?.itemClassName, className) || undefined}
        style={{ width, height, ...style }}
        role="img"
        aria-label={altText}
        data-loading={!showFallback && !isImageLoaded ? true : undefined}
        data-error={hasError || undefined}
        data-code={normalizedCode || undefined}
        {...rest}
      >
        {showFallback ? (
          fallback ? <span className={mergedClasses.fallback || undefined}>{fallback}</span> : null
        ) : (
          <img
            ref={imgRef}
            src={src}
            alt=""
            aria-hidden
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className={mergedClasses.image || undefined}
            style={
              effectiveReduceMotion
                ? { borderRadius: "inherit", opacity: 1 }
                : {
                    borderRadius: "inherit",
                    opacity: isImageLoaded ? 1 : 0,
                    transition: "opacity 0.15s ease-in-out",
                  }
            }
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
          classes={tooltipConfig.className ? { content: tooltipConfig.className } : undefined}
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

export default CountryFlag;
