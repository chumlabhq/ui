import React from "react";
import type { AvatarShimmerProps, AvatarGroupShimmerProps } from "./types";

export const AvatarShimmer: React.FC<AvatarShimmerProps> = ({
  size = 24,
  className = "",
}) => {
  return (
    <div
      className={`shrink-0 rounded-full bg-gray-200 animate-pulse ${className}`}
      style={{ width: size, height: size }}
      data-shimmer
    />
  );
};

export const AvatarGroupShimmer: React.FC<AvatarGroupShimmerProps> = ({
  count = 3,
  size = 24,
  className = "",
  itemClassName = "",
}) => {
  return (
    <div className={`flex -space-x-2 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <AvatarShimmer
          key={`avatar-shimmer-${index}`}
          size={size}
          className={`ring-2 ring-white ${itemClassName}`}
        />
      ))}
    </div>
  );
};

AvatarShimmer.displayName = "AvatarShimmer";
AvatarGroupShimmer.displayName = "AvatarGroupShimmer";
