import { forwardRef, useState, useCallback, useMemo } from "react";
import type { SyntheticEvent } from "react";
import type { CountryFlagProps, CountryFlagClasses, CountryFlagTooltipConfig } from "./utils/types";
import {
  DEFAULT_ASPECT_RATIO,
  DEFAULT_COUNTRYFLAG_CLASSES,
  UNSTYLED_COUNTRYFLAG_CLASSES,
} from "./utils/constants";
import { getPixelSize, isTooltipConfig } from "./utils/helpers";
import { usePackagedFlag } from "./utils/packagedFlags";
import { useCountryFlagGroupContext } from "./utils/context";
import { CountryFlagShimmer } from "./components/CountryFlagShimmer";
import { Tooltip } from "../Tooltip";
import { cn } from "../../utils/cn";
import { useReducedMotion } from "../../utils/useReducedMotion";

/**
 * Component: CountryFlag
 *
 * Purpose:
 * Renders a country flag image from a two-letter ISO code. Supports sizes,
 * tooltips, grouping with overflow, shimmer loading, and error fallback.
 *
 * AI Usage Guidelines:
 * - Pass `code` as lowercase two-letter ISO 3166-1 alpha-2
 * - Use `size` for presets (xs-2xl) or pixel number
 * - Use `fallback` for custom error UI
 * - Use `<CountryFlagGroup max={N}>` for overflow grouping
 *
 * Reference:
 * - COUNTRYFLAG.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/CountryFlagDemo.tsx — live demo
 */
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
      basePath,
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
    const altText = alt || `${normalizedCode.toUpperCase()} flag`;

    // Default: the SVG ships in the package and is lazily imported per code, so
    // no request leaves the app. Supplying basePath opts back into fetching
    // `${basePath}/${code}.svg` from a CDN or self-hosted directory.
    const usePackaged = basePath === undefined;
    const packagedSrc = usePackagedFlag(usePackaged && normalizedCode ? normalizedCode : null);
    const src = usePackaged ? packagedSrc : `${basePath}/${normalizedCode}.svg`;

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
            // Omitted (not empty) while a packaged chunk is in flight: an empty
            // src would fire a spurious error before the flag even resolves.
            src={src ?? undefined}
            alt=""
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
