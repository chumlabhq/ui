import { forwardRef, useState, useCallback, useEffect, useMemo, useRef } from "react";
import type {
  AvatarProps,
  AvatarTooltipConfig,
  AvatarStatusConfig,
  AvatarClasses,
} from "./utils/types";
import { Tooltip } from "../Tooltip";
import { Slot } from "../../utils/Slot";
import {
  DEFAULT_SIZE,
  DEFAULT_SHAPE,
  DEFAULT_AVATAR_CLASSES,
  UNSTYLED_AVATAR_CLASSES,
} from "./utils/constants";
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
import { useReducedMotion } from "../../utils/useReducedMotion";

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
      classes: classesProp,
      unstyled = false,
      textStyle,
      loading = false,
      reduceMotion = "auto",
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

    const effectiveReduceMotion = useReducedMotion(reduceMotion);

    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [prevSrc, setPrevSrc] = useState(src);

    // React-endorsed derived state reset: https://react.dev/reference/react/useState#storing-information-from-previous-renders
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

    const baseClasses = unstyled ? UNSTYLED_AVATAR_CLASSES : DEFAULT_AVATAR_CLASSES;

    const ariaLabel = rest["aria-label"];
    const ariaLabelledBy = rest["aria-labelledby"];
    const warnedRef = useRef(false);
    useEffect(() => {
      if (process.env.NODE_ENV !== "production") {
        if (!name && !src && !ariaLabel && !ariaLabelledBy && !warnedRef.current) {
          warnedRef.current = true;
          console.warn(
            "Avatar: An avatar without a name or src requires `aria-label` or `aria-labelledby` for accessibility.",
          );
        }
      }
    }, [name, src, ariaLabel, ariaLabelledBy]);

    const mergedClasses: Required<AvatarClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        inner: classesProp?.inner ?? baseClasses.inner,
        image: classesProp?.image ?? baseClasses.image,
        initials: classesProp?.initials ?? baseClasses.initials,
        fallback: classesProp?.fallback ?? baseClasses.fallback,
        status: classesProp?.status ?? baseClasses.status,
      }),
      [classesProp, baseClasses],
    );

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

    // Check if image is already cached on mount
    const imgRef = useCallback((node: HTMLImageElement | null) => {
      if (node && node.complete && node.naturalWidth > 0) {
        setImageLoaded(true);
      }
    }, []);

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
          reduceMotion={reduceMotion}
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
        className={cn(mergedClasses.root, className) || undefined}
        style={containerStyle}
        role={!showImage ? "img" : undefined}
        aria-label={alt || name || rest["aria-label"]}
        data-has-image={showImage || undefined}
        data-shape={effectiveShape}
        {...rest}
      >
        <div
          className={mergedClasses.inner || undefined}
          style={{ borderRadius }}
        >
          {showImage && (
            <img
              ref={imgRef}
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
              className={cn(mergedClasses.image, imageConfig?.className) || undefined}
              style={
                effectiveReduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: imageLoaded ? 1 : 0,
                      transition: imageLoaded ? "none" : "opacity 0.2s ease-in-out",
                    }
              }
            />
          )}
          {showFallback && (
            <span className={mergedClasses.fallback || undefined}>{fallback}</span>
          )}
          {showInitials && (
            <span className={mergedClasses.initials || undefined} style={textStyle}>
              {initials}
            </span>
          )}
        </div>

        {statusConfig && (
          <span
            className={cn(mergedClasses.status, statusConfig.className) || undefined}
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
          classes={tooltipConfig.className ? { content: tooltipConfig.className } : undefined}
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

export default Avatar;
