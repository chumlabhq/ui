import React, { forwardRef, useMemo } from "react";
import type { AvatarGroupProps } from "../utils/types";
import { AvatarGroupCount } from "./AvatarGroupCount";
import { Slot } from "../../../utils/Slot";
import {
  DEFAULT_SIZE,
  DEFAULT_SPACING,
  DEFAULT_SHAPE,
} from "../utils/constants";
import { AvatarGroupContext } from "../utils/context";
import { cn } from "../../../utils/cn";

const variantClassNames = {
  stack: "flex items-center",
  grid: "grid grid-cols-auto gap-2",
  inline: "inline-flex items-center",
};

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      children,
      max,
      size = DEFAULT_SIZE,
      shape,
      bordered,
      spacing,
      ringColor = "white",
      showTooltip = false,
      total,
      variant = "stack",
      reverseOrder = false,
      renderSurplus,
      onAvatarClick,
      dir = "ltr",
      classes = {},
      asChild = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const effectiveSpacing = spacing ?? DEFAULT_SPACING;
    const effectiveShape = shape ?? DEFAULT_SHAPE;

    const effectiveMax =
      max != null && Number.isFinite(max) && max > 0
        ? Math.floor(max)
        : undefined;

    const { visibleChildren, remainingChildren, remainingCount, totalCount } =
      useMemo(() => {
        const childArray = React.Children.toArray(children || []);
        const orderedArray = reverseOrder
          ? [...childArray].reverse()
          : childArray;
        const visible = effectiveMax
          ? orderedArray.slice(0, effectiveMax)
          : orderedArray;
        const remaining = effectiveMax
          ? orderedArray.slice(effectiveMax)
          : [];
        const count =
          total !== undefined
            ? Math.max(0, total - (effectiveMax ?? childArray.length))
            : remaining.length;
        return {
          visibleChildren: visible,
          remainingChildren: remaining,
          remainingCount: count,
          totalCount: total ?? childArray.length,
        };
      }, [children, effectiveMax, total, reverseOrder]);

    const tooltipContent = useMemo(() => {
      if (!showTooltip || remainingChildren.length === 0) return undefined;
      return remainingChildren
        .map((child) => {
          if (React.isValidElement(child)) {
            const props = child.props as Record<string, unknown>;
            return (props.name as string) || (props.alt as string) || "";
          }
          return "";
        })
        .filter(Boolean)
        .join(", ");
    }, [showTooltip, remainingChildren]);

    const Comp = asChild ? Slot : "div";

    const ariaLabel = useMemo(() => {
      const hiddenCount =
        remainingCount > 0 ? `, ${remainingCount} more not shown` : "";
      return `Avatar group with ${totalCount} member${totalCount !== 1 ? "s" : ""}${hiddenCount}`;
    }, [totalCount, remainingCount]);

    const contextValue = useMemo(
      () => ({
        size,
        shape: effectiveShape,
        bordered,
        ringColor,
      }),
      [size, effectiveShape, bordered, ringColor],
    );

    const itemClassName = classes.item ?? "shrink-0";

    return (
      <AvatarGroupContext.Provider value={contextValue}>
        <Comp
          ref={ref}
          className={cn(variantClassNames[variant], classes.root, className) || undefined}
          style={style}
          dir={dir}
          role="group"
          aria-label={ariaLabel}
          {...rest}
        >
          {visibleChildren.map((child, index) => {
            const childName = React.isValidElement(child)
              ? ((child.props as Record<string, unknown>).name as string | undefined)
              : undefined;

            return (
              <div
                key={
                  React.isValidElement(child) ? (child.key ?? index) : index
                }
                className={itemClassName || undefined}
                role={onAvatarClick ? "button" : undefined}
                tabIndex={onAvatarClick ? 0 : undefined}
                aria-label={onAvatarClick ? childName || `Avatar ${index + 1}` : undefined}
                style={{
                  marginInlineStart: index === 0 ? 0 : effectiveSpacing,
                  zIndex: visibleChildren.length - index,
                  position: "relative",
                  cursor: onAvatarClick ? "pointer" : undefined,
                }}
                onClick={
                  onAvatarClick
                    ? (e: React.MouseEvent) => onAvatarClick({ index, name: childName }, e)
                    : undefined
                }
                onKeyDown={
                  onAvatarClick
                    ? (e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onAvatarClick({ index, name: childName }, e as unknown as React.MouseEvent);
                        }
                      }
                    : undefined
                }
              >
                {child}
              </div>
            );
          })}
          {remainingCount > 0 &&
            (renderSurplus ? (
              renderSurplus(remainingCount)
            ) : (
              <AvatarGroupCount
                count={remainingCount}
                size={size}
                shape={shape}
                bordered={bordered}
                tooltip={tooltipContent}
                style={{
                  marginInlineStart: effectiveSpacing < 0 ? 4 : effectiveSpacing,
                  zIndex: 0,
                }}
              />
            ))}
        </Comp>
      </AvatarGroupContext.Provider>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";
