import React, { forwardRef, useMemo } from "react";
import type {
  CountryFlagGroupProps,
  CountryFlagGroupCountProps,
  CountryFlagTooltipConfig,
  CountryFlagProps,
  CountryFlagGroupClasses,
} from "../utils/types.js";
import {
  DEFAULT_COUNTRYFLAG_GROUP_CLASSES,
} from "../utils/constants.js";
import { Tooltip } from "../../Tooltip/index.js";
import { cn } from "../../../utils/scopedCn.js";
import { getPixelSize, isTooltipConfig } from "../utils/helpers.js";
import { CountryFlagGroupContext } from "../utils/context.js";

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

    const mergedClasses: Required<CountryFlagGroupClasses> = useMemo(
      () => ({
        root: cn(DEFAULT_COUNTRYFLAG_GROUP_CLASSES.root, classesProp?.root),
        item: cn(DEFAULT_COUNTRYFLAG_GROUP_CLASSES.item, classesProp?.item),
        count: cn(DEFAULT_COUNTRYFLAG_GROUP_CLASSES.count, classesProp?.count),
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

/**
 * The row's own overlap, from `-space-x-1.5` on the group root. Written here
 * because the surplus has to centre its type in the part of the tile that is
 * actually visible, and a tile that disagrees with the class would put the
 * count under its neighbour.
 */
const STACK_OVERLAP = 6;

/** `+99` and no further: three glyphs is what an flag-sized tile can hold. */
const MAX_COUNT = 99;
const WIDEST_COUNT_GLYPHS = 3;
const GLYPH_WIDTH_RATIO = 0.62;
const MIN_COUNT_FONT_SIZE = 7;

export const CountryFlagGroupCount = forwardRef<HTMLDivElement, CountryFlagGroupCountProps>(
  ({ count, size = "md", tooltip, className, style, ...rest }, ref) => {
    const pixelSize = getPixelSize(size);
    const height = Math.round(pixelSize * 0.75);

    const tooltipConfig = useMemo(() => {
      if (!tooltip) return null;
      if (isTooltipConfig<CountryFlagTooltipConfig>(tooltip)) return tooltip;
      return { content: tooltip };
    }, [tooltip]);

    // The surplus is the last TILE in the stack, not a chip beside it — the
    // decision AvatarGroup's surplus already landed on, and the reason is the
    // same: a count that breaks out of the overlap reads as a separate control,
    // and a count that grows with its content moves every flag before it. This
    // was both. `marginLeft: 8` cancelled the row's own -6px overlap so the
    // chip sat apart, and `minWidth` let `+2` and `+47` render at different
    // widths.
    //
    // So: exactly the tile a flag occupies, fixed, inside the same overlap. The
    // type is what gives — sized to fit the widest count the cap allows, in the
    // part of the tile the neighbour does not cover. `AvatarGroupCount` carries
    // the full reasoning for the glyph-width and floor numbers below.
    const visible = Math.max(pixelSize - STACK_OVERLAP, Math.floor(pixelSize / 2));
    const fontSize = Math.max(
      MIN_COUNT_FONT_SIZE,
      Math.min(
        Math.round(height * 0.45),
        Math.floor(visible / (WIDEST_COUNT_GLYPHS * GLYPH_WIDTH_RATIO)),
      ),
    );
    const countElement = (
      <div
        ref={ref}
        className={cn("shrink-0 inline-flex items-center justify-center", className) || undefined}
        style={{
          width: pixelSize,
          minWidth: pixelSize,
          maxWidth: pixelSize,
          height,
          boxSizing: "border-box",
          // The start padding is the flag before it: text centred in the whole
          // tile begins under the overlap.
          paddingInlineStart: STACK_OVERLAP,
          paddingInlineEnd: 0,
          fontSize,
          ...style,
        }}
        role="img"
        aria-label={`${count} more flag${count !== 1 ? "s" : ""} not shown`}
        {...rest}
      >
        +{Math.min(count, MAX_COUNT)}
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
          classes={tooltipConfig.className ? { content: tooltipConfig.className } : undefined}
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
