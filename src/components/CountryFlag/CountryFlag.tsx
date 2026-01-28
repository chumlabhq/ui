import { useState } from "react";
import type { CountryFlagProps, CountryFlagSize } from "./types";
import { Tooltip } from "../Tooltip";

const FLAG_CDN_URL = "https://flagcdn.com";

const SIZE_MAP: Record<CountryFlagSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40,
};

const VALID_CDN_WIDTHS = [20, 40, 80, 160, 320, 640] as const;

const getNearestCdnWidth = (width: number): number => {
  const targetWidth = width * 2;
  for (const cdnWidth of VALID_CDN_WIDTHS) {
    if (cdnWidth >= targetWidth) return cdnWidth;
  }
  return VALID_CDN_WIDTHS[VALID_CDN_WIDTHS.length - 1];
};

const getPixelSize = (size: CountryFlagSize | number): number => {
  if (typeof size === "number") return size;
  return SIZE_MAP[size];
};

const CountryFlag = ({
  code,
  size = "md",
  className = "",
  alt,
  style,
  fallback,
  tooltipContent,
  tooltipSide = "top",
  tooltipAlign = "center",
  tooltipSideOffset = 6,
  tooltipDelayDuration = 200,
  tooltipClassName = "",
  showTooltipArrow = true,
}: CountryFlagProps) => {
  const [hasError, setHasError] = useState(false);

  const normalizedCode = code?.toLowerCase() || "";
  const pixelSize = getPixelSize(size);
  const width = pixelSize;
  const height = Math.round(pixelSize * 0.75);
  const cdnWidth = getNearestCdnWidth(width);
  const src = `${FLAG_CDN_URL}/w${cdnWidth}/${normalizedCode}.png`;
  const altText = alt || `${normalizedCode.toUpperCase()} flag`;

  if (hasError || !normalizedCode) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div
        style={{ width, height, ...style }}
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        role="img"
        aria-label={altText}
      />
    );
  }

  const flagElement = (
    <img
      src={src}
      alt={altText}
      width={width}
      height={height}
      loading="lazy"
      style={style}
      className={`inline-block shrink-0 object-cover ${className}`}
      onError={() => setHasError(true)}
    />
  );

  if (tooltipContent) {
    return (
      <Tooltip
        content={tooltipContent}
        side={tooltipSide}
        align={tooltipAlign}
        sideOffset={tooltipSideOffset}
        delayDuration={tooltipDelayDuration}
        contentClassName={tooltipClassName}
        showArrow={showTooltipArrow}
      >
        {flagElement}
      </Tooltip>
    );
  }

  return flagElement;
};

CountryFlag.displayName = "CountryFlag";

export default CountryFlag;
