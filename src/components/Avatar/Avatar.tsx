import { forwardRef, useState, useCallback, useMemo } from "react";
import type {
  AvatarProps,
  AvatarTooltipConfig,
  AvatarStatusConfig,
} from "./types";
import { Tooltip } from "../Tooltip";
import { Slot } from "../../utils/Slot";
import { DEFAULT_SIZE, DEFAULT_SHAPE } from "./utils/constants";
import {
  parseBorder,
  getInitials,
  getNumericSize,
  getFontSize,
  getStatusSize,
  getBorderRadius,
  generateColors,
  getStatusColor,
  getStatusPosition,
} from "./utils/helpers";
import { useAvatarGroupContext } from "./utils/context";
import { AvatarShimmer } from "./components/AvatarShimmer";
import { cn } from "../../utils/cn";
import { isTooltipConfig } from "../../utils/isTooltipConfig";

const isStatusConfig = (status: unknown): status is AvatarStatusConfig => {
  return (
    typeof status === "object" &&
    status !== null &&
    !Array.isArray(status) &&
    "type" in status
  );
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      name,
      src,
      alt,
      size,
      shape,
      maxInitials = 2,
      fallback,
      autoColor = false,
      colors,
      bordered,
      status,
      tooltip,
      imageConfig,
      textClassName,
      textStyle,
      statusClassName,
      loading = false,
      onLoad,
      onError,
      asChild = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const groupCtx = useAvatarGroupContext();
    const effectiveSize = size ?? groupCtx?.size ?? DEFAULT_SIZE;
    const effectiveShape = shape ?? groupCtx?.shape ?? DEFAULT_SHAPE;
    const effectiveBordered = bordered ?? groupCtx?.bordered;

    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [prevSrc, setPrevSrc] = useState(src);

    if (prevSrc !== src) {
      setPrevSrc(src);
      setImageError(false);
      setImageLoaded(false);
    }

    const initials = getInitials(name, maxInitials);
    const numericSize = getNumericSize(effectiveSize);
    const fontSize = getFontSize(effectiveSize);
    const statusSize = getStatusSize(effectiveSize);
    const borderRadius = getBorderRadius(effectiveShape);

    const generatedColors = useMemo(
      () => (autoColor ? generateColors(name, colors) : null),
      [autoColor, name, colors],
    );

    const handleImageError = useCallback(() => {
      setImageError(true);
      onError?.();
    }, [onError]);

    const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
      onLoad?.();
    }, [onLoad]);

    const statusConfig = useMemo(() => {
      if (!status) return null;
      if (isStatusConfig(status)) return status;
      return { type: status, position: "bottom-right" as const };
    }, [status]);

    const tooltipConfig = useMemo(() => {
      if (!tooltip) return null;
      if (isTooltipConfig<AvatarTooltipConfig>(tooltip)) return tooltip;
      return { content: tooltip };
    }, [tooltip]);

    if (loading) {
      return (
        <AvatarShimmer
          size={effectiveSize}
          shape={effectiveShape}
          style={
            groupCtx
              ? { boxShadow: `0 0 0 2px ${groupCtx.ringColor}` }
              : undefined
          }
        />
      );
    }

    const showImage = src && !imageError;
    const showFallback = !showImage && fallback && !initials;
    const showInitials = !showImage && initials;

    const containerStyle: React.CSSProperties = {
      width: numericSize,
      height: numericSize,
      borderRadius,
      fontSize,
      backgroundColor: generatedColors?.background,
      color: generatedColors?.text,
      border: parseBorder(effectiveBordered, generatedColors?.border),
      position: "relative",
      ...(groupCtx ? { boxShadow: `0 0 0 2px ${groupCtx.ringColor}` } : {}),
      ...style,
    };

    const Comp = asChild ? Slot : "div";

    const avatarElement = (
      <Comp
        ref={ref}
        className={cn(
          "shrink-0 flex items-center justify-center font-medium select-none",
          className,
        )}
        style={containerStyle}
        role={!showImage ? "img" : undefined}
        aria-label={alt || name || rest["aria-label"]}
        data-has-image={showImage || undefined}
        data-shape={effectiveShape}
        {...rest}
      >
        <div
          className="absolute inset-0 overflow-hidden flex items-center justify-center"
          style={{ borderRadius }}
        >
          {showImage && (
            <img
              src={src}
              alt={alt || ""}
              srcSet={imageConfig?.srcSet}
              sizes={imageConfig?.sizes}
              loading={imageConfig?.loading ?? "lazy"}
              decoding={imageConfig?.decoding ?? "async"}
              crossOrigin={imageConfig?.crossOrigin}
              referrerPolicy={imageConfig?.referrerPolicy}
              fetchPriority={imageConfig?.fetchPriority}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={cn(
                "w-full h-full object-cover",
                imageConfig?.className,
              )}
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: imageLoaded ? "none" : "opacity 0.2s ease-in-out",
              }}
            />
          )}
          {showFallback && fallback}
          {showInitials && (
            <span className={textClassName} style={textStyle}>
              {initials}
            </span>
          )}
        </div>

        {statusConfig && (
          <span
            className={cn("absolute block rounded-full", statusClassName)}
            style={{
              width: statusSize,
              height: statusSize,
              backgroundColor: getStatusColor(
                statusConfig.type,
                statusConfig.color,
              ),
              ...getStatusPosition(
                statusConfig.position ?? "bottom-right",
                statusSize,
              ),
            }}
            aria-label={statusConfig.type}
          />
        )}
      </Comp>
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
          {avatarElement}
        </Tooltip>
      );
    }

    return avatarElement;
  },
);

Avatar.displayName = "Avatar";
