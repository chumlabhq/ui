import React from "react";
import type {
  AvatarProps,
  AvatarGroupCountProps,
  AvatarGroupProps,
} from "./types";
import { AvatarShimmer, AvatarGroupShimmer } from "./AvatarShimmer";
import { Tooltip } from "../Tooltip";

const processText = (text?: string, maxChars: number = 1): string => {
  if (!text) return "";

  const cleanText = text.trim().toUpperCase();

  if (cleanText.length <= maxChars) return cleanText;

  if (cleanText.includes(" ")) {
    return cleanText
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, maxChars);
  }

  return cleanText.slice(0, maxChars);
};

export const Avatar: React.FC<AvatarProps> = ({
  text,
  src,
  alt,
  size = 24,
  maxChars = 1,
  isLoading = false,
  className = "",
  imgClassName = "",
  style,
  shimmerClassName = "",
  tooltipContent,
  tooltipSide = "top",
  tooltipAlign = "center",
  tooltipSideOffset = 6,
  tooltipDelayDuration = 200,
  tooltipClassName = "",
  showTooltipArrow = true,
}) => {
  const processedText = processText(text, maxChars);

  if (isLoading) {
    return (
      <AvatarShimmer size={size} className={shimmerClassName || className} />
    );
  }

  const avatarElement = src ? (
    <div
      className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      <img
        src={src}
        alt={alt || "Avatar"}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  ) : (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      {processedText}
    </div>
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
        {avatarElement}
      </Tooltip>
    );
  }

  return avatarElement;
};

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max,
  size = 24,
  isLoading = false,
  shimmerCount = 3,
  showCountTooltip = false,
  countTooltipSide = "top",
  countTooltipAlign = "center",
  className = "",
  itemClassName = "",
  countClassName = "",
  countTooltipClassName = "",
  shimmerClassName = "",
  shimmerItemClassName = "",
}) => {
  if (isLoading) {
    return (
      <AvatarGroupShimmer
        count={shimmerCount}
        size={size}
        className={shimmerClassName || className}
        itemClassName={shimmerItemClassName || itemClassName}
      />
    );
  }

  const childArray = React.Children.toArray(children || []);
  const visibleChildren = max ? childArray.slice(0, max) : childArray;
  const remainingChildren = max ? childArray.slice(max) : [];
  const remainingCount = remainingChildren.length;

  const remainingNames = showCountTooltip
    ? remainingChildren
        .map((child) => {
          if (React.isValidElement<AvatarProps>(child)) {
            return child.props.text || child.props.alt || "";
          }
          return "";
        })
        .filter(Boolean)
    : [];

  const countTooltipContent =
    showCountTooltip && remainingNames.length > 0
      ? remainingNames.join(", ")
      : undefined;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleChildren.map((child, index) => {
        if (React.isValidElement<AvatarProps>(child)) {
          return React.cloneElement(child, {
            key: index,
            size: child.props.size ?? size,
            className: `${itemClassName} ${child.props.className ?? ""}`.trim(),
          });
        }
        return child;
      })}
      {remainingCount > 0 && (
        <AvatarGroupCount
          count={remainingCount}
          size={size}
          className={countClassName}
          tooltipContent={countTooltipContent}
          tooltipSide={countTooltipSide}
          tooltipAlign={countTooltipAlign}
          tooltipClassName={countTooltipClassName}
        />
      )}
    </div>
  );
};

export const AvatarGroupCount: React.FC<AvatarGroupCountProps> = ({
  count,
  size = 24,
  className = "",
  tooltipContent,
  tooltipSide = "top",
  tooltipAlign = "center",
  tooltipClassName = "",
}) => {
  const countElement = (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      +{count}
    </div>
  );

  if (tooltipContent) {
    return (
      <Tooltip
        content={tooltipContent}
        side={tooltipSide}
        align={tooltipAlign}
        contentClassName={tooltipClassName}
        showArrow
      >
        {countElement}
      </Tooltip>
    );
  }

  return countElement;
};

Avatar.displayName = "Avatar";
AvatarGroup.displayName = "AvatarGroup";
AvatarGroupCount.displayName = "AvatarGroupCount";
