import React, { forwardRef, useMemo } from "react";
import type {
  CountryFlagGroupProps,
  CountryFlagGroupCountProps,
  CountryFlagTooltipConfig,
  CountryFlagProps,
  CountryFlagGroupClasses,
} from "../utils/types";
import {
  DEFAULT_COUNTRYFLAG_GROUP_CLASSES,
} from "../utils/constants";
import { Tooltip } from "../../Tooltip";
import { cn } from "../../../utils/cn";
import { getPixelSize, isTooltipConfig } from "../utils/helpers";
import { CountryFlagGroupContext } from "../utils/context";

export const CountryFlagGroup = forwardRef<HTMLDivElement, CountryFlagGroupProps>(
  (
    {
      children,
      max,
      size = "md",
      showCountTooltip = false,
      countTooltip,
      surplusTooltipContent,
      renderSurplus,
      classes: classesProp,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const effectiveMax =
      max != null && Number.isFinite(max) && max > 0 ? Math.floor(max) : undefined;

    // Use default classes (no unstyled on group — consumer uses classes to override)
    const mergedClasses: Required<CountryFlagGroupClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? DEFAULT_COUNTRYFLAG_GROUP_CLASSES.root,
        item: classesProp?.item ?? DEFAULT_COUNTRYFLAG_GROUP_CLASSES.item,
        count: classesProp?.count ?? DEFAULT_COUNTRYFLAG_GROUP_CLASSES.count,
      }),
      [classesProp],
    );

    const { visibleChildren, remainingChildren, remainingCount, totalCount } =
      useMemo(() => {
        const arr = React.Children.toArray(children);
        const visible = effectiveMax ? arr.slice(0, effectiveMax) : arr;
        const remaining = effectiveMax ? arr.slice(effectiveMax) : [];
        return {
          visibleChildren: visible,
          remainingChildren: remaining,
          remainingCount: remaining.length,
          totalCount: arr.length,
        };
      }, [children, effectiveMax]);

    const countTooltipContent = useMemo(() => {
      if (surplusTooltipContent) return surplusTooltipContent;
      if (!showCountTooltip || remainingChildren.length === 0) return undefined;
      return remainingChildren
        .map((child) => {
          if (React.isValidElement<CountryFlagProps>(child)) {
            return child.props.alt || child.props.code?.toUpperCase() || "";
          }
          return "";
        })
        .filter(Boolean)
        .join(", ");
    }, [surplusTooltipContent, showCountTooltip, remainingChildren]);

    const ariaLabel = useMemo(() => {
      const hidden = remainingCount > 0 ? `, ${remainingCount} more not shown` : "";
      return `Flag group with ${totalCount} flag${totalCount !== 1 ? "s" : ""}${hidden}`;
    }, [totalCount, remainingCount]);

    const pixelSize = getPixelSize(size);

    const contextValue = useMemo(
      () => ({ itemClassName: mergedClasses.item, size }),
      [mergedClasses.item, size],
    );

    return (
      <CountryFlagGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(mergedClasses.root, className) || undefined}
          style={style}
          role="group"
          aria-label={ariaLabel}
          {...rest}
        >
          {visibleChildren}
          {remainingCount > 0 &&
            (renderSurplus ? (
              renderSurplus(remainingCount)
            ) : (
              <CountryFlagGroupCount
                count={remainingCount}
                size={pixelSize}
                className={mergedClasses.count}
                tooltip={
                  countTooltipContent
                    ? {
                        content: countTooltipContent,
                        side: countTooltip?.side ?? "top",
                        align: countTooltip?.align ?? "center",
                        sideOffset: countTooltip?.sideOffset,
                        delayDuration: countTooltip?.delayDuration,
                        className: countTooltip?.className,
                        showArrow: countTooltip?.showArrow ?? true,
                      }
                    : undefined
                }
              />
            ))}
        </div>
      </CountryFlagGroupContext.Provider>
    );
  },
);

export const CountryFlagGroupCount = forwardRef<HTMLDivElement, CountryFlagGroupCountProps>(
  ({ count, size = "md", tooltip, className, style, ...rest }, ref) => {
    const pixelSize = getPixelSize(size);
    const height = Math.round(pixelSize * 0.75);

    const tooltipConfig = useMemo(() => {
      if (!tooltip) return null;
      if (isTooltipConfig<CountryFlagTooltipConfig>(tooltip)) return tooltip;
      return { content: tooltip };
    }, [tooltip]);

    const countElement = (
      <div
        ref={ref}
        className={cn("shrink-0 flex items-center justify-center", className) || undefined}
        style={{
          minWidth: height,
          height,
          paddingInline: Math.round(height * 0.3),
          ...style,
        }}
        role="img"
        aria-label={`${count} more flag${count !== 1 ? "s" : ""} not shown`}
        {...rest}
      >
        +{count}
      </div>
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
          {countElement}
        </Tooltip>
      );
    }

    return countElement;
  },
);

CountryFlagGroup.displayName = "CountryFlagGroup";
CountryFlagGroupCount.displayName = "CountryFlagGroupCount";
